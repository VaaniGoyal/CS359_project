from fastapi import HTTPException, UploadFile, File, Depends, Query
from fastapi.responses import StreamingResponse
from bson import ObjectId
from db import db, fs, files_collection, users_collection
from typing import List
from models.file import File
from utils.auth import verify_token
from datetime import datetime
from pymongo import DESCENDING
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
import io
import mimetypes
import os

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
            file_stream = io.BytesIO(file_content)
            file_id = await bucket.upload_from_stream(file.filename, file_stream, metadata={
                "category": category,
                "uploaded_by": user_id,
                "created_at": datetime.utcnow().isoformat(),
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
            # Convert the file_id to ObjectId
            file_id = ObjectId(file_id)
            print(f"Trying to retrieve file with ID: {file_id}")
            file_document = await files_collection.find_one({"_id": file_id})
            if not file_document:
                raise HTTPException(status_code=404, detail="File not found")
            print(f"file document: {file_document}")
            gridfs_file_id = file_document['file_id']
            file_stream = await fs.open_download_stream(ObjectId(gridfs_file_id))
            file_name = file_document["file_name"]
            mime_type, _ = mimetypes.guess_type(file_name)
            if not mime_type:
                mime_type = "application/octet-stream"
            
            headers = {
                "Content-Disposition": f"attachment; filename={file_name}"
            }
        
            return StreamingResponse(file_stream, media_type=mime_type, headers=headers)

        except Exception as e:
            raise HTTPException(status_code=404, detail=f"File not found: {str(e)}")

    @staticmethod
    async def search_files(name: str = None, category: List[str] = None, username: str = None) -> List[dict]:
        query = {}
        # Add name filter if provided
        if name:
            query["file_name"] = {"$regex": name, "$options": "i"}  # Case-insensitive search
        # Add category filter if provided (assuming category is a list of categories)
        if category:
            query["category"] = {"$in": category}  # Find documents where category matches any in the provided list
        # If username is provided, fetch the corresponding user_id
        if username:
            user = await users_collection.find_one({"username": username}, {"_id": 1})
            if not user:
                raise HTTPException(status_code=404, detail="User not found.")
            query["uploaded_by"] = str(user["_id"])  # Filter by the uploaded_by user_id
        # Perform the search with the constructed query
        cursor = files_collection.find(query, {"_id": 1, "file_name": 1, "category": 1, "uploaded_by": 1, "created_at": 1}).sort("created_at", -1)

        files = await cursor.to_list(length=100)  # Limit to 100 files, can adjust as needed

        if not files:
            raise HTTPException(status_code=404, detail="No files found matching the criteria.")
    
        # Prepare the response with the necessary fields
        result = []
        for file in files:
            user = await users_collection.find_one({"_id": ObjectId(file["uploaded_by"])}, {"username": 1})
            if not user:
                raise HTTPException(status_code=404, detail="User not found for uploaded_by id.")
        
            # Safely get category, default to "Unknown" if missing
            category = file.get("category", "Unknown")
        
            # Add file details to the result
            result.append({
                "id": str(file["_id"]),  
                "file_name": file["file_name"],
                "category": category,
                "uploaded_by": user["username"],  
                "created_at": file["created_at"]
            })
        return result
