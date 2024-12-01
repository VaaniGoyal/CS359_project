from pydantic import BaseModel
from typing import Optional
from bson import ObjectId

class File(BaseModel):
    id: Optional[str]  # MongoDB ObjectId as a string
    file_name: str
    file_path: str
    file_type: str  # e.g., document, image, video
    category: str
    uploaded_by: str  # User ID
    created_at: Optional[str]

    class Config:
        orm_mode = True
