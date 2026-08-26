/**
 * Email API Client
 * 
 * Handles communication with the Python FastAPI backend for contact form submissions.
 */

import { ContactFormData } from './types';

// API base URL - configure based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Send contact form data to the backend API
 * 
 * @param data - Contact form data (name, email, message)
 * @returns Promise that resolves when email is sent successfully
 * @throws Error if the request fails
 */
export async function sendEmail(data: ContactFormData): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Parse response
        const result = await response.json();

        // Handle non-OK responses
        if (!response.ok) {
            throw new Error(result.detail || 'Failed to send message. Please try again.');
        }

        // Success - response includes success message from backend
        return;

    } catch (error) {
        // Network error or other issues
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Unable to send message. Please check your connection and try again.');
    }
}
