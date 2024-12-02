from fastapi import HTTPException, UploadFile, File, Depends
from fastapi.responses import StreamingResponse
from bson import ObjectId
from db import fs, files_collection
from typing import List
from models.file import File
from utils.auth import verify_token
from datetime import datetime
from pymongo import DESCENDING

class FileController:
    @staticmethod
    async def upload_file(file: UploadFile, category: str, token: str = Depends(verify_token)):
        allowed_categories = ["document", "image", "video"]
        if category not in allowed_categories:
            raise HTTPException(status_code=400, detail="Invalid category")
        user_id = token["sub"]  # Extract the user_id from the token
        try:
            # Save file content to GridFS
            file_id = fs.put(
                await file.read(),  # File content as bytes
                filename=file.filename,
                metadata={
                    "category": category,
                    "uploaded_by": user_id,
                    "created_at": datetime.utcnow().isoformat()
                }
            )
            # Save metadata in files collection
            new_file = {
                "file_name": file.filename,
                "file_id": str(file_id),  # GridFS file ID as a string
                "category": category,
                "uploaded_by": user_id,
                "created_at": datetime.utcnow().isoformat()
            }
            files_collection.insert_one(new_file)
            return {"message": "File uploaded successfully", "file_id": str(file_id)}
        except Exception as e:
            # Handle any errors during the upload process
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

    async def search_files(name: str = None, category: str = None, uploaded_by: str = None) -> List[File]:
        query = {}

        # Add filters to the query if parameters are provided
        if name:
            query["file_name"] = {"$regex": name, "$options": "i"}  # Case-insensitive search
        if category:
            query["category"] = category
        if uploaded_by:
            query["uploaded_by"] = uploaded_by

        # Perform the search with the constructed query
        files = await db.files.find(query).sort("created_at", DESCENDING).to_list(length=100)  # Adjust `length` as needed

        # Convert results to a list of File objects
        return [File(**{**file, "id": str(file["_id"])}) for file in files]