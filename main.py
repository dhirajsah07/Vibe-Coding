from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
import asyncio
import os

app = FastAPI(title="Aurelia API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class Product(BaseModel):
    id: int
    name: str
    price: float
    image_url: str

class CartItem(BaseModel):
    product_id: int
    quantity: int

class PaymentRequest(BaseModel):
    cart: List[CartItem]
    total_amount: float
    # other payment details omitted for dummy

class ChatRequest(BaseModel):
    message: str

class ContactRequest(BaseModel):
    name: str
    email: str
    inquiry: str

# --- Dummy Data ---
PRODUCTS = [
    {"id": 1, "name": "Obsidian Silk Trench", "price": 1250.00, "image_url": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80"},
    {"id": 2, "name": "Champagne Cashmere Knit", "price": 890.00, "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80"},
    {"id": 3, "name": "Pure White Tailored Trousers", "price": 650.00, "image_url": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80"},
    {"id": 4, "name": "Gold Accent Leather Tote", "price": 1850.00, "image_url": "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80"},
]

# --- Endpoints ---
@app.get("/products", response_model=List[Product])
async def get_products():
    return PRODUCTS

@app.post("/process-payment")
async def process_payment(payment_data: PaymentRequest):
    await asyncio.sleep(2)  # Simulate processing delay
    return {"status": "success", "message": "Payment Successful. Thank you for your purchase."}

@app.post("/chat")
async def chat_with_concierge(request: ChatRequest):
    msg = request.message.lower()
    
    if "material" in msg or "fabric" in msg:
        response_msg = "We exclusively source the finest Italian silk and hand-sourced cashmere to ensure our garments provide unparalleled elegance and comfort."
    elif "price" in msg or "cost" in msg:
        response_msg = "Our collection reflects the highest standards of craftsmanship, with pieces ranging from $650 to $2,000."
    elif "shipping" in msg or "delivery" in msg:
        response_msg = "We offer complimentary express shipping worldwide on all orders, delivered in bespoke protective packaging."
    elif "hello" in msg or "hi" in msg:
        response_msg = "Welcome to Aurelia. How may I assist you today?"
    else:
        response_msg = "Thank you for reaching out. A dedicated stylist will review your request. Is there anything specific you are looking for?"
        
    return {"reply": response_msg}

@app.post("/contact-submit")
async def contact_submit(request: ContactRequest):
    # In a real app, send an email or save to DB.
    return {"status": "success", "message": f"Thank you, {request.name}. Your inquiry has been received."}

# --- Mount Frontend ---
frontend_path = os.path.join(os.path.dirname(__file__), '..', 'frontend')
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
