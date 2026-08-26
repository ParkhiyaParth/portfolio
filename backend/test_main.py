"""
Integration Tests for FastAPI Backend

Tests the contact form API endpoint with pytest.
Validates request handling, validation, and error scenarios.

Requirements: 14.1, 14.2, 14.3, 14.4
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from main import app

# Create test client
client = TestClient(app)


class TestHealthCheck:
    """Tests for root health check endpoint"""
    
    def test_root_endpoint_returns_ok(self):
        """Test that root endpoint returns successful health check"""
        response = client.get("/")
        
        assert response.status_code == 200
        assert response.json() == {
            "status": "ok",
            "message": "Portfolio Contact API is running"
        }


class TestContactEndpointValidData:
    """Tests for contact endpoint with valid data"""
    
    @patch('main.send_contact_email', new_callable=AsyncMock)
    def test_valid_contact_form_submission(self, mock_send_email):
        """Test successful contact form submission with valid data"""
        # Arrange
        valid_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "message": "Hello, I would like to connect with you regarding a project opportunity."
        }
        
        # Act
        response = client.post("/api/contact", json=valid_data)
        
        # Assert
        assert response.status_code == 200
        assert response.json()["success"] is True
        assert "Thank you for your message" in response.json()["message"]
        
        # Verify email service was called with correct parameters
        mock_send_email.assert_called_once_with(
            sender_name="John Doe",
            sender_email="john@example.com",
            message="Hello, I would like to connect with you regarding a project opportunity."
        )
    
    @patch('main.send_contact_email', new_callable=AsyncMock)
    def test_minimum_valid_data(self, mock_send_email):
        """Test with minimum valid field lengths"""
        # Arrange - name=2 chars, message=10 chars (minimum valid)
        valid_data = {
            "name": "Jo",
            "email": "j@e.co",
            "message": "Short msg!"
        }
        
        # Act
        response = client.post("/api/contact", json=valid_data)
        
        # Assert
        assert response.status_code == 200
        assert response.json()["success"] is True
        mock_send_email.assert_called_once()
    
    @patch('main.send_contact_email', new_callable=AsyncMock)
    def test_maximum_valid_data(self, mock_send_email):
        """Test with maximum valid field lengths"""
        # Arrange - name=100 chars, message=2000 chars
        valid_data = {
            "name": "A" * 100,
            "email": "test@example.com",
            "message": "x" * 2000
        }
        
        # Act
        response = client.post("/api/contact", json=valid_data)
        
        # Assert
        assert response.status_code == 200
        assert response.json()["success"] is True
        mock_send_email.assert_called_once()


class TestContactEndpointInvalidData:
    """Tests for contact endpoint validation with invalid data"""
    
    def test_missing_name_field(self):
        """Test validation error when name field is missing"""
        # Arrange
        invalid_data = {
            "email": "john@example.com",
            "message": "Hello, this is a test message."
        }
        
        # Act
        response = client.post("/api/contact", json=invalid_data)
        
        # Assert
        assert response.status_code == 422  # Unprocessable Entity
        assert "name" in str(response.json()).lower()
    
    def test_missing_email_field(self):
        """Test validation error when email field is missing"""
        # Arrange
        invalid_data = {
            "name": "John Doe",
            "message": "Hello, this is a test message."
        }
        
        # Act
        response = client.post("/api/contact", json=invalid_data)
        
        # Assert
        assert response.status_code == 422
        assert "email" in str(response.json()).lower()
    
    def test_missing_message_field(self):
        """Test validation error when message field is missing"""
        # Arrange
        invalid_data = {
            "name": "John Doe",
            "email": "john@example.com"
        }
        
        # Act
        response = client.post("/api/contact", json=invalid_data)
        
        # Assert
        assert response.status_code == 422
        assert "message" in str(response.json()).lower()
    
    def test_name_too_short(self):
        """Test validation error when name is less than 2 characters"""
        # Arrange
        invalid_data = {
            "name": "J",  # Only 1 character
            "email": "john@example.com",
            "message": "Hello, this is a test message."
        }
        
        # Act
        response = client.post("/api/contact", json=invalid_data)
        
        # Assert
        assert response.status_code == 422
    
    def test_name_too_long(self):
        """Test validation error when name exceeds 100 characters"""
        # Arrange
        invalid_data = {
            "name": "A" * 101,  # 101 characters
            "email": "john@example.com",
            "message": "Hello, this is a test message."
        }
        
        # Act
        response = client.post("/api/contact", json=invalid_data)
        
        # Assert
        assert response.status_code == 422
    
    def test_invalid_email_format(self):
        """Test validation error when email format is invalid"""
        # Arrange - various invalid email formats
        invalid_emails = [
            "notanemail",
            "@example.com",
            "user@",
            "user@.com",
            "user space@example.com",
            "user@@example.com"
        ]
        
        for invalid_email in invalid_emails:
            invalid_data = {
                "name": "John Doe",
                "email": invalid_email,
                "message": "Hello, this is a test message."
            }
            
            # Act
            response = client.post("/api/contact", json=invalid_data)
            
            # Assert
            assert response.status_code == 422, f"Should reject invalid email: {invalid_email}"
    
    def test_message_too_short(self):
        """Test validation error when message is less than 10 characters"""
        # Arrange
        invalid_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "message": "Short"  # Only 5 characters
        }
        
        # Act
        response = client.post("/api/contact", json=invalid_data)
        
        # Assert
        assert response.status_code == 422
    
    def test_message_too_long(self):
        """Test validation error when message exceeds 2000 characters"""
        # Arrange
        invalid_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "message": "x" * 2001  # 2001 characters
        }
        
        # Act
        response = client.post("/api/contact", json=invalid_data)
        
        # Assert
        assert response.status_code == 422
    
    def test_empty_string_fields(self):
        """Test validation error when fields are empty strings"""
        # Arrange
        invalid_data = {
            "name": "",
            "email": "",
            "message": ""
        }
        
        # Act
        response = client.post("/api/contact", json=invalid_data)
        
        # Assert
        assert response.status_code == 422


class TestContactEndpointErrorHandling:
    """Tests for error handling scenarios"""
    
    @patch('main.send_contact_email', new_callable=AsyncMock)
    def test_email_service_failure(self, mock_send_email):
        """Test error handling when email service fails"""
        # Arrange
        mock_send_email.side_effect = Exception("SMTP connection failed")
        
        valid_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "message": "Hello, this is a test message."
        }
        
        # Act
        response = client.post("/api/contact", json=valid_data)
        
        # Assert
        assert response.status_code == 500
        assert "Failed to send message" in response.json()["detail"]
        mock_send_email.assert_called_once()
    
    @patch('main.send_contact_email', new_callable=AsyncMock)
    def test_network_timeout_error(self, mock_send_email):
        """Test error handling for network timeout"""
        # Arrange
        mock_send_email.side_effect = TimeoutError("Connection timeout")
        
        valid_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "message": "Hello, this is a test message."
        }
        
        # Act
        response = client.post("/api/contact", json=valid_data)
        
        # Assert
        assert response.status_code == 500
        mock_send_email.assert_called_once()
    
    def test_malformed_json_request(self):
        """Test error handling for malformed JSON"""
        # Act - send invalid JSON
        response = client.post(
            "/api/contact",
            data="not valid json",
            headers={"Content-Type": "application/json"}
        )
        
        # Assert
        assert response.status_code == 422


class TestCORSConfiguration:
    """Tests for CORS middleware configuration"""
    
    def test_cors_headers_present(self):
        """Test that CORS headers are included in a preflight response for an allowed origin"""
        # Act - a real browser preflight always sends Origin + Access-Control-Request-Method
        response = client.options(
            "/api/contact",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
            },
        )

        # Assert - CORS headers should be present
        assert "access-control-allow-origin" in [h.lower() for h in response.headers.keys()]


class TestAPIDocumentation:
    """Tests for API documentation endpoints"""
    
    def test_openapi_schema_available(self):
        """Test that OpenAPI schema is accessible"""
        # Act
        response = client.get("/openapi.json")
        
        # Assert
        assert response.status_code == 200
        assert "openapi" in response.json()
        assert "paths" in response.json()
    
    def test_docs_endpoint_available(self):
        """Test that Swagger UI docs are accessible"""
        # Act
        response = client.get("/docs")
        
        # Assert
        assert response.status_code == 200


# Run tests with: pytest test_main.py -v
# Run with coverage: pytest test_main.py --cov=main --cov-report=html
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
