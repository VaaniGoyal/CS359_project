from fastapi import FastAPI
from routes.user import router as user_router
from routes.files import router as file_router
from db import db

app = FastAPI()

@app.get("/ping")
async def ping():
    try:
        # Attempt a ping to the database
        await db.command("ping")
        return {"message": "Successfully connected to MongoDB!"}
    except Exception as e:
        return {"error": f"Failed to connect to MongoDB: {e}"}

# Register routes
app.include_router(user_router, prefix="/api/user")
app.include_router(file_router, prefix="/api/files")

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

