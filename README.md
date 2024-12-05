# CS359 Project

This project is a peer-to-peer file-sharing system with a Python backend (FastAPI) and a React frontend. The backend handles authentication, file categorization, and database operations using MongoDB. The frontend provides an intuitive user interface for interacting with the system.

---

## **Setup Instructions**

Follow the steps below to set up and run the project:

### **Step 1: Clone the Repository**
Clone the repository to your local machine:
```bash
git clone https://github.com/VaaniGoyal/CS359_project.git
cd CS359_project
```

### **Step 2: Setup the backend**
Run the following commands in your terminal:
```bash
cd backend
pip install -r requirements.txt
```

### **Step 3: Setup the frontend**
Open another terminal and run:
```bash
cd frontend
npm install
```

### **Step 4: Run the application**
Navigate to backend directory and run:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
Navigate to frontend directory and run:
```bash
npm start
```

## **Project Features**
1. User authentication (login and registration)
2. File categorization (document, image, video)
3. Peer-to-peer file sharing
4. MongoDB Atlas integration for database operations

## **Technologies Used**
Backend: Python, FastAPI, MongoDB, PyJWT
Frontend: React, JavaScript
Database: MongoDB Atlas

## **Author**
Vaani Goyal (2201AI41) | Vaishika Agrawal (2201AI42)



