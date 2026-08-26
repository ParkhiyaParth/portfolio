"""
Email Service for Contact Form

Handles sending emails using SMTP (aiosmtplib) or email service SDKs.
Supports Gmail SMTP by default, can be configured for other providers.
"""

import os
import aiosmtplib
from email.message import EmailMessage
from typing import Optional


async def send_contact_email(
    sender_name: str,
    sender_email: str,
    message: str
) -> None:
    """
    Send contact form email using SMTP
    
    Args:
        sender_name: Name of the person sending the message
        sender_email: Email address of the sender
        message: Message content
        
    Raises:
        Exception: If email sending fails
    """
    # Get SMTP configuration from environment variables
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    recipient_email = os.getenv("RECIPIENT_EMAIL", "parkhiyaparth@gmail.com")
    
    # Validate configuration
    if not smtp_username or not smtp_password:
        raise ValueError(
            "SMTP credentials not configured. "
            "Please set SMTP_USERNAME and SMTP_PASSWORD environment variables."
        )
    
    # Create email message
    email_msg = EmailMessage()
    email_msg["From"] = smtp_username
    email_msg["To"] = recipient_email
    email_msg["Subject"] = f"Portfolio Contact Form: Message from {sender_name}"
    
    # Email body
    email_body = f"""
New contact form submission from your portfolio website:

From: {sender_name}
Email: {sender_email}

Message:
{message}

---
This message was sent from your portfolio contact form.
Reply directly to {sender_email} to respond.
"""
    
    email_msg.set_content(email_body)
    
    # Send email using aiosmtplib
    try:
        await aiosmtplib.send(
            email_msg,
            hostname=smtp_host,
            port=smtp_port,
            username=smtp_username,
            password=smtp_password,
            start_tls=True,
        )
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"SMTP Error: {str(e)}")
        raise Exception(f"Failed to send email: {str(e)}")


# Alternative: SendGrid implementation (uncomment to use)
# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail
# 
# async def send_contact_email_sendgrid(
#     sender_name: str,
#     sender_email: str,
#     message: str
# ) -> None:
#     """Send email using SendGrid"""
#     sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
#     recipient_email = os.getenv("RECIPIENT_EMAIL", "parkhiyaparth@gmail.com")
#     
#     if not sendgrid_api_key:
#         raise ValueError("SendGrid API key not configured")
#     
#     mail_message = Mail(
#         from_email=sender_email,
#         to_emails=recipient_email,
#         subject=f"Portfolio Contact: {sender_name}",
#         plain_text_content=f"From: {sender_name} ({sender_email})\n\n{message}"
#     )
#     
#     try:
#         sg = SendGridAPIClient(sendgrid_api_key)
#         response = sg.send(mail_message)
#         print(f"Email sent. Status code: {response.status_code}")
#     except Exception as e:
#         raise Exception(f"SendGrid error: {str(e)}")
