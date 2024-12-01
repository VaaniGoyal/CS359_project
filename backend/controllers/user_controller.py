from models.user_model import User
from db import db
from bson import ObjectId

user_collection = db["users"]

# Helper to convert MongoDB document to dict
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "age": user["age"],
    }

# CRUD Functions
async def create_user(user_data: User) -> dict:
    user = await user_collection.insert_one(user_data.dict())
    new_user = await user_collection.find_one({"_id": user.inserted_id})
    return user_helper(new_user)

async def get_users() -> list:
    users = []
    async for user in user_collection.find():
        users.append(user_helper(user))
    return users

async def get_user(user_id: str) -> dict | None:
    user = await user_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        return user_helper(user)
    return None
