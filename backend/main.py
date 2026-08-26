"""
FastAPI Backend for Portfolio Contact Form

This backend handles contact form submissions and sends emails using SMTP.
Includes CORS configuration for Next.js frontend integration.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import os
from dotenv import load_dotenv

# Import email service
from email_service import send_contact_email

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Portfolio Contact API",
    description="Backend API for handling contact form submissions",
    version="1.0.0"
)

# CORS configuration - allow requests from Next.js frontend
# ALLOWED_ORIGINS can be set to a comma-separated list of extra origins
# (e.g. your production domain) without editing this file.
default_origins = [
    "http://localhost:3000",  # Next.js dev server
    "http://127.0.0.1:3000",
]
extra_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]
origins = default_origins + extra_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request validation
class ContactFormData(BaseModel):
    """Contact form data model with validation"""
    name: str = Field(..., min_length=2, max_length=100, description="Sender's name")
    email: EmailStr = Field(..., description="Sender's email address")
    message: str = Field(..., min_length=10, max_length=2000, description="Message content")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "message": "Hello, I would like to connect with you regarding..."
            }
        }


class ContactResponse(BaseModel):
    """Response model for contact form submission"""
    success: bool
    message: str


# API Routes
@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Portfolio Contact API is running"}


@app.post("/api/contact", response_model=ContactResponse)
async def submit_contact_form(form_data: ContactFormData):
    """
    Handle contact form submission
    
    Validates form data and sends email to the portfolio owner.
    
    Args:
        form_data: ContactFormData with name, email, and message
        
    Returns:
        ContactResponse with success status and message
        
    Raises:
        HTTPException: If email sending fails
    """
    try:
        # Send email using email service
        await send_contact_email(
            sender_name=form_data.name,
            sender_email=form_data.email,
            message=form_data.message
        )
        
        return ContactResponse(
            success=True,
            message="Thank you for your message! I'll get back to you soon."
        )
        
    except Exception as e:
        # Log error (in production, use proper logging)
        print(f"Error sending email: {str(e)}")
        
        raise HTTPException(
            status_code=500,
            detail="Failed to send message. Please try again later or contact directly via email."
        )


# Run with: uvicorn main:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
