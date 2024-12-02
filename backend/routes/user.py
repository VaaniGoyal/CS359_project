from fastapi import APIRouter
from pydantic import BaseModel
from controllers.user_controller import UserController

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: UserCreate):
    return await UserController.register_user(user.username, user.email, user.password)

@router.post("/login")
async def login(user: UserLogin):
    return await UserController.login_user(user.email, user.password)

