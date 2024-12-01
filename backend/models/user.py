from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId

class User(BaseModel):
    id: Optional[str]  # MongoDB ObjectId
    username: str
    email: str
    password: str
    created_at: Optional[str]
    class Config:
        orm_model = True
