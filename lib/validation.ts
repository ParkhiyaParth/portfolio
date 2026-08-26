/**
 * Form validation utilities for the contact form
 * 
 * This module provides validation logic for contact form inputs, ensuring
 * data quality before submission to the email service.
 */

import { ContactFormData, FormErrors } from './types';

/**
 * Validates contact form data against defined business rules
 * 
 * Validation Rules:
 * - Name: Required, minimum 2 characters (after trimming whitespace)
 * - Email: Required, valid email format (regex pattern validation)
 * - Message: Required, minimum 10 characters (after trimming whitespace)
 * 
 * @param data - Contact form data to validate
 * @returns FormErrors object containing field-specific error messages (empty object if valid)
 * 
 * @example
 * const errors = validateContactForm({ name: 'A', email: 'invalid', message: 'Short' });
 * // Returns: { name: 'Name must be at least 2 characters', email: 'Please enter a valid email address', message: 'Message must be at least 10 characters' }
 * 
 * @example
 * const errors = validateContactForm({ name: 'John Doe', email: 'john@example.com', message: 'Hello, this is a valid message!' });
 * // Returns: {} (no errors)
 */
export function validateContactForm(data: ContactFormData): FormErrors {
    const errors: FormErrors = {};

    // Validate name field: required and minimum 2 characters
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }

    // Validate email field: required and valid email format
    if (!data.email || !isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Validate message field: required and minimum 10 characters
    if (!data.message || data.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters';
    }

    return errors;
}

/**
 * Validates email format using regex pattern
 * 
 * Pattern explanation:
 * - ^[^\s@]+ : One or more characters that are not whitespace or @
 * - @ : Literal @ symbol
 * - [^\s@]+ : One or more characters that are not whitespace or @
 * - \. : Literal dot
 * - [a-zA-Z]{2,}$ : Two or more letters for TLD
 * 
 * @param email - Email string to validate
 * @returns true if email matches valid format, false otherwise
 * 
 * @example
 * isValidEmail('user@example.com'); // Returns: true
 * isValidEmail('invalid.email'); // Returns: false
 * isValidEmail('user@domain'); // Returns: false
 * isValidEmail('user @example.com'); // Returns: false (contains space)
 */
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
}
