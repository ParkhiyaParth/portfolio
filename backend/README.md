# Portfolio Backend - FastAPI Contact Form API

Python FastAPI backend for handling contact form submissions with email delivery.

## Features

- FastAPI REST API with automatic OpenAPI documentation
- Email delivery via SMTP (Gmail, custom SMTP server)
- Request validation with Pydantic
- CORS configuration for Next.js frontend
- Comprehensive integration tests with pytest

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and add your SMTP credentials:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
RECIPIENT_EMAIL=your-email@gmail.com
```

**Note for Gmail users:** You need to use an "App Password" instead of your regular Gmail password. Generate one at: https://myaccount.google.com/apppasswords

### 3. Run the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- Main API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- OpenAPI Schema: http://localhost:8000/openapi.json

## Testing

### Run All Tests

```bash
# Run all tests with verbose output
pytest test_main.py -v

# Run with coverage report
pytest test_main.py --cov=main --cov-report=html

# Run specific test class
pytest test_main.py::TestContactEndpointValidData -v
```

### Test Coverage

The test suite includes:
- ✅ Health check endpoint tests
- ✅ Valid contact form submission tests
- ✅ Input validation tests (missing fields, invalid formats, length constraints)
- ✅ Error handling tests (email service failures, network timeouts)
- ✅ CORS configuration tests
- ✅ API documentation tests

## API Endpoints

### `GET /`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Portfolio Contact API is running"
}
```

### `POST /api/contact`
Submit contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I would like to connect with you..."
}
```

**Validation Rules:**
- `name`: 2-100 characters, required
- `email`: Valid email format, required
- `message`: 10-2000 characters, required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Thank you for your message! I'll get back to you soon."
}
```

**Error Response (422):**
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "detail": "Failed to send message. Please try again later..."
}
```

## Integration with Next.js Frontend

The backend is configured to accept requests from:
- `http://localhost:3000` (Next.js dev server)
- `http://127.0.0.1:3000`

Update the `origins` list in `main.py` to add your production domain.

Frontend API client location: `../lib/email.ts`

## Deployment

### Environment Variables for Production

Set these environment variables in your hosting platform:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
RECIPIENT_EMAIL=your-email@gmail.com
```

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t portfolio-backend .
docker run -p 8000:8000 --env-file .env portfolio-backend
```

## Troubleshooting

### Gmail SMTP Issues

If you get authentication errors with Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password (not your regular password) in `SMTP_PASSWORD`

### CORS Errors

If you get CORS errors from the frontend:
1. Verify the frontend URL is in the `origins` list in `main.py`
2. Check that the frontend is making requests to the correct backend URL
3. Ensure the backend is running on the expected port (8000)

### Test Failures

If tests fail:
1. Ensure all dependencies are installed: `pip install -r requirements.txt`
2. Check that the test environment doesn't require actual SMTP credentials (tests use mocks)
3. Run with verbose output: `pytest test_main.py -v --tb=short`

## License

MIT
