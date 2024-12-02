from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from gridfs import GridFS

uri = "mongodb+srv://vaanigoyal:Vaani%4012345@networkdb.rbpnd.mongodb.net/?retryWrites=true&w=majority&appName=NetworkDB"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
db = client.network
users_collection = db.users
files_collection = db.files

# Initialize GridFS for file storage
fs = GridFS(db)