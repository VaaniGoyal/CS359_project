from fastapi import APIRouter, HTTPException
from models.user_model import User
from controllers.user_controller import create_user, get_users, get_user

router = APIRouter()

@router.post("/users", response_model=User)
async def add_user(user: User):
    return await create_user(user)

@router.get("/users")
async def list_users():
    return await get_users()

@router.get("/users/{user_id}")
async def retrieve_user(user_id: str):
    user = await get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
