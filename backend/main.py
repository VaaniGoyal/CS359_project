from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Allow requests from the frontend (adjust the URL as needed)
origins = [
    "http://localhost:3000",  # React app running on port 3000 (adjust if necessary)
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows only the listed origins to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

