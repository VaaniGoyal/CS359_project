from fastapi import FastAPI
from routes.user_routes import router as user_router
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
app.include_router(user_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

