"""
Schemas Pydantic para validação de dados
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class UserRoleEnum(str, Enum):
    USER = "user"
    ADMIN = "admin"


class OrderStatusEnum(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ReservationStatusEnum(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


# ===== USER SCHEMAS =====
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# ===== PRODUCT SCHEMAS =====
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    image: Optional[str] = None
    category: Optional[str] = None
    stock: int = Field(default=0, ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    image: Optional[str] = None
    category: Optional[str] = None
    stock: Optional[int] = Field(None, ge=0)


class ProductResponse(ProductBase):
    id: int
    
    class Config:
        from_attributes = True


# ===== CART SCHEMAS =====
class CartAdd(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)


class CartUpdate(BaseModel):
    quantity: int = Field(..., ge=1)


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductResponse
    
    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total: float


# ===== RESERVATION SCHEMAS =====
class ReservationCreate(BaseModel):
    date: str = Field(..., description="Formato: YYYY-MM-DD")
    time: str = Field(..., description="Formato: HH:MM")
    people_count: int = Field(..., ge=1, le=20)


class ReservationUpdate(BaseModel):
    date: Optional[str] = None
    time: Optional[str] = None
    people_count: Optional[int] = Field(None, ge=1, le=20)
    status: Optional[ReservationStatusEnum] = None


class ReservationResponse(BaseModel):
    id: int
    user_id: int
    date: str
    time: str
    people_count: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ===== ORDER SCHEMAS =====
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=1)


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: ProductResponse
    
    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: OrderStatusEnum


# ===== GENERIC RESPONSE =====
class MessageResponse(BaseModel):
    message: str
    detail: Optional[str] = None
