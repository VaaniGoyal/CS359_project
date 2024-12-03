from fastapi import HTTPException, UploadFile, File, Depends, Query
from fastapi.responses import StreamingResponse
from bson import ObjectId
from db import db, fs, files_collection
from typing import List
from models.file import File
from utils.auth import verify_token
from datetime import datetime
from pymongo import DESCENDING
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
import io

class FileController:
    @staticmethod
    async def upload_file(file: UploadFile, category: str, token: str = Depends(verify_token)):
        try:
            print(f"Received file: {file.filename}, Category: {category}, Token: {token}")
        
            allowed_categories = ["document", "image", "video"]
            if category not in allowed_categories:
                raise HTTPException(status_code=400, detail="Invalid category")
        
            user_id = token["sub"]
        
            # Create GridFS bucket
            bucket = AsyncIOMotorGridFSBucket(db)
        
            # Read the file content into memory (in case it's not too large)
            file_content = await file.read()
            file_stream = io.BytesIO(file_content)  # Create an in-memory stream from file content
        
            # Upload file content to GridFS using upload_from_stream
            file_id = await bucket.upload_from_stream(file.filename, file_stream, metadata={
                "category": category,
                "uploaded_by": user_id,
                "created_at": datetime.utcnow().isoformat()
            })
        
            print(f"File uploaded to GridFS with ID: {file_id}")
        
            # Save metadata in files collection
            new_file = {
                "file_name": file.filename,
                "file_id": str(file_id),
                "category": category,
                "uploaded_by": user_id,
                "created_at": datetime.utcnow().isoformat()
            }
        
            result = await files_collection.insert_one(new_file)
            print(f"File metadata inserted: {result.inserted_id}")
        
            return {"message": "File uploaded successfully", "file_id": str(file_id)}
    
        except Exception as e:
            print(f"Error during file upload: {e}")
            raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")


    @staticmethod
    async def download_file(file_id: str):
        try:
            # Convert file_id string to ObjectId
            file_id = ObjectId(file_id)
            # Retrieve the file from GridFS
            file = fs.get(file_id)
        
            # Stream the file to the client
            return StreamingResponse(
                file,
                media_type="application/octet-stream",  # Generic binary stream type
                headers={"Content-Disposition": f"attachment; filename={file.filename}"}
            )
        except Exception as e:
            # Raise an HTTP 404 if the file isn't found
            raise HTTPException(status_code=404, detail="File not found")

    @staticmethod
    async def search_files(name: str = None, category: str = None, uploaded_by: str = None) -> List[File]:
        query = {}

        # Add filters to the query if parameters are provided
        if name:
            query["file_name"] = {"$regex": name, "$options": "i"}  # Case-insensitive search
        if category:
            query["category"] = category
        if uploaded_by:
            query["uploaded_by"] = uploaded_by

        # # Perform the search with the constructed query
        # files = await files_collection.find(query).sort("created_at", DESCENDING).to_list(length=100)  # Adjust `length` as needed
        cursor = files_collection.find(query).sort("created_at", DESCENDING)
        files = await cursor.to_list(length=100)  # Adjust the length as needed

        if not files:
            raise HTTPException(status_code=404, detail="No files found matching the criteria.")
            
        # Convert results to a list of File objects
        return [File(**{**file, "id": str(file["_id"])}) for file in files]