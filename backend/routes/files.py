from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from controllers.file_controller import FileController
from pydantic import BaseModel
from utils.auth import verify_token

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), category: str = Query(..., enum=["document", "image", "video"]), token: str = Depends(verify_token)):
    return await FileController.upload_file(file, category, token)

@router.get("/download/{file_id}")
async def download_file(file_id: str):
    # Call the controller method to download the file by file_id
    return await FileController.download_file(file_id)

@router.get("/search")
async def search_files(
    name: str = Query(None, description="Search files by name"),
    category: str = Query(None, description="Search files by type"),
    uploaded_by: str = Query(None, description="Search files by user ID"),
):
    return await FileController.search_files(name=name, category=category, uploaded_by=uploaded_by)

