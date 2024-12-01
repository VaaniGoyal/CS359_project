from pydantic import BaseModel, EmailStr

class User(BaseModel):
    id: str | None = None
    name: str
    email: EmailStr
    age: int
