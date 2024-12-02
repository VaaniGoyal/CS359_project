from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from pymongo.server_api import ServerApi

uri = "mongodb+srv://vaanigoyal:Vaani%4012345@networkdb.rbpnd.mongodb.net/?retryWrites=true&w=majority&appName=NetworkDB"

# Use AsyncIOMotorClient for asynchronous operations
client = AsyncIOMotorClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Use a MotorDatabase instance
db = client.network
users_collection = db.users
files_collection = db.files

# Initialize GridFS for file storage
fs = AsyncIOMotorGridFSBucket(db)
