from passlib.context import CryptContext
from fastapi import HTTPException, status
from models.user import User
from utils.auth import hash_password, create_access_token, verify_password
from db import db
from bson import ObjectId

user_collection = db["users"]
class UserController:
    @staticmethod
    async def register_user(username: str, email: str, password: str):
        existing_user = await user_collection.find_one({"email": email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = hash_password(password)
        new_user = {
            "username": username,
            "email": email,
            "password": hashed_password
        }
        result = await user_collection.insert_one(new_user)
        return {"message": "User created successfully", "user_id": str(result.inserted_id)}

    @staticmethod
    async def login_user(email: str, password: str):
         # Retrieve user from database
        user = await user_collection.find_one({"email": email}) 
        if not user or not verify_password(password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create a JWT token
        token = create_access_token(data={"sub": str(user["_id"])})
        return {"access_token": token, "token_type": "bearer"}