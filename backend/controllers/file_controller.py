from fastapi import HTTPException, UploadFile, File, Depends
from bson import ObjectId
from db import files_collection
from models.file import File
from utils.auth import verify_token
from datetime import datetime

class FileController:
    @staticmethod
    async def upload_file(file: UploadFile, category: str, token: str = Depends(verify_token)):
        user_id = token["sub"]  # Extract the user_id from the token
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        new_file = {
            "file_name": file.filename,
            "file_path": file_path,
            "file_type": file.content_type,
            "category": category,
            "uploaded_by": user_id,  # Store the user ID from token
            "created_at": datetime.utcnow().isoformat()
        }
        result = files_collection.insert_one(new_file)
        return {"message": "File uploaded successfully", "file_id": str(result.inserted_id)}

    @staticmethod
    async def download_file(file_id: str, token: str = Depends(verify_token)):
        user_id = token["sub"]  # Extract the user_id from token
        file = files_collection.find_one({"_id": ObjectId(file_id), "uploaded_by": user_id})
        if not file:
            raise HTTPException(status_code=404, detail="File not found or you don't have access")
        
        return {"file_path": file["file_path"]}
    
    @staticmethod
    async def search_files(name: str = None, file_type: str = None, uploaded_by: str = None):
        query = {}
        if name:
            query["file_name"] = {"$regex": name, "$options": "i"}  # Case-insensitive regex
        elif file_type:
            query["file_type"] = file_type
        elif uploaded_by:
            query["uploaded_by"] = uploaded_by

        files = await db.files.find(query).to_list(length=100)  # Adjust length as needed
        return [File(**file) for file in files]