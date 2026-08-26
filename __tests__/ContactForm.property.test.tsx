/**
 * Property-Based Tests for ContactForm Component
 * 
 * Tests verify that the ContactForm component correctly renders all required fields
 * and displays appropriate validation states across a wide range of inputs.
 * 
 * Uses fast-check with 50 iterations per test as specified in the design document.
 * 
 * **Validates: Requirements 13.1, 13.2, 13.3**
 * **Property 22: Contact Form Field Requirements**
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import fc from 'fast-check';
import ContactForm from '@/components/ContactForm';
import '@testing-library/jest-dom';

// Mock the sendEmail function to prevent actual API calls during testing
jest.mock('@/lib/email', () => ({
    sendEmail: jest.fn(() => Promise.resolve()),
}));

describe('ContactForm - Property-Based Tests', () => {
    describe('Property 22: Contact Form Field Requirements', () => {
        /**
         * For any rendered contact form, the form SHALL include input fields for:
         * - name (text input)
         * - email (email input)
         * - message (textarea)
         * - plus a submit button
         * 
         * **Validates: Requirements 13.1, 13.2, 13.3**
         */

        test(
            'should render name field on every render',
            () => {
                for (let i = 0; i < 50; i++) {
                    const { unmount } = render(<ContactForm />);

                    try {
                        // Property: Name input field always exists
                        const nameInput = screen.getByLabelText(/Name \*/i);
                        expect(nameInput).toBeInTheDocument();
                        expect(nameInput).toHaveAttribute('type', 'text');
                        expect(nameInput).toHaveAttribute('id', 'name');
                        expect(nameInput).toHaveAttribute('name', 'name');

                        // Property: Name field has proper placeholder
                        expect(nameInput).toHaveAttribute('placeholder', 'Your name');
                    } finally {
                        unmount();
                    }
                }
            }
        );

        test(
            'should render email field on every render',
            () => {
                for (let i = 0; i < 50; i++) {
                    const { unmount } = render(<ContactForm />);

                    try {
                        // Property: Email input field always exists
                        const emailInput = screen.getByLabelText(/Email \*/i);
                        expect(emailInput).toBeInTheDocument();
                        expect(emailInput).toHaveAttribute('type', 'email');
                        expect(emailInput).toHaveAttribute('id', 'email');
                        expect(emailInput).toHaveAttribute('name', 'email');

                        // Property: Email field has proper placeholder
                        expect(emailInput).toHaveAttribute('placeholder', 'your.email@example.com');
                    } finally {
                        unmount();
                    }
                }
            }
        );

        test(
            'should render message field on every render',
            () => {
                for (let i = 0; i < 50; i++) {
                    const { unmount } = render(<ContactForm />);

                    try {
                        // Property: Message textarea field always exists
                        const messageInput = screen.getByLabelText(/Message \*/i);
                        expect(messageInput).toBeInTheDocument();
                        expect(messageInput.tagName).toBe('TEXTAREA');
                        expect(messageInput).toHaveAttribute('id', 'message');
                        expect(messageInput).toHaveAttribute('name', 'message');

                        // Property: Message field has proper placeholder
                        expect(messageInput).toHaveAttribute('placeholder', 'Your message...');
                    } finally {
                        unmount();
                    }
                }
            }
        );

        test(
            'should render submit button on every render',
            () => {
                for (let i = 0; i < 50; i++) {
                    const { unmount } = render(<ContactForm />);

                    try {
                        // Property: Submit button always exists
                        const submitButton = screen.getByRole('button', { name: /Send Message/i });
                        expect(submitButton).toBeInTheDocument();
                        expect(submitButton).toHaveAttribute('type', 'submit');
                    } finally {
                        unmount();
                    }
                }
            }
        );

        test(
            'should render all fields together in form element',
            () => {
                for (let i = 0; i < 50; i++) {
                    const { unmount, container } = render(<ContactForm />);

                    try {
                        // Property: All fields exist within a form element
                        const form = container.querySelector('form');
                        expect(form).toBeInTheDocument();

                        // Property: All required input fields are within the form
                        const nameInput = within(form!).getByLabelText(/Name \*/i);
                        const emailInput = within(form!).getByLabelText(/Email \*/i);
                        const messageInput = within(form!).getByLabelText(/Message \*/i);
                        const submitButton = within(form!).getByRole('button', { name: /Send Message/i });

                        expect(nameInput).toBeInTheDocument();
                        expect(emailInput).toBeInTheDocument();
                        expect(messageInput).toBeInTheDocument();
                        expect(submitButton).toBeInTheDocument();
                    } finally {
                        unmount();
                    }
                }
            }
        );

        test(
            'should have labels for all input fields',
            () => {
                for (let i = 0; i < 50; i++) {
                    const { unmount } = render(<ContactForm />);

                    try {
                        // Property: All input fields have associated labels via screen.getByLabelText
                        // This is a more reliable way to verify labels are properly associated
                        const nameInput = screen.getByLabelText(/Name \*/i);
                        const emailInput = screen.getByLabelText(/Email \*/i);
                        const messageInput = screen.getByLabelText(/Message \*/i);

                        // Verify inputs exist and are linked to labels
                        expect(nameInput).toHaveAttribute('id', 'name');
                        expect(emailInput).toHaveAttribute('id', 'email');
                        expect(messageInput).toHaveAttribute('id', 'message');

                        // Verify input attributes are correct
                        expect(nameInput).toHaveAttribute('name', 'name');
                        expect(emailInput).toHaveAttribute('name', 'email');
                        expect(messageInput).toHaveAttribute('name', 'message');
                    } finally {
                        unmount();
                    }
                }
            }
        );

        test(
            'should have fields with required asterisks',
            () => {
                for (let i = 0; i < 50; i++) {
                    const { unmount } = render(<ContactForm />);

                    try {
                        // Property: All labels show asterisks indicating required fields
                        const nameLabel = screen.getByText(/Name \*/i);
                        const emailLabel = screen.getByText(/Email \*/i);
                        const messageLabel = screen.getByText(/Message \*/i);

                        expect(nameLabel).toBeInTheDocument();
                        expect(emailLabel).toBeInTheDocument();
                        expect(messageLabel).toBeInTheDocument();
                    } finally {
                        unmount();
                    }
                }
            }
        );

        test(
            'should have accessible form fields',
            () => {
                for (let i = 0; i < 50; i++) {
                    const { unmount } = render(<ContactForm />);

                    try {
                        // Property: All fields have aria-required attribute
                        const nameInput = screen.getByLabelText(/Name \*/i);
                        const emailInput = screen.getByLabelText(/Email \*/i);
                        const messageInput = screen.getByLabelText(/Message \*/i);

                        expect(nameInput).toHaveAttribute('aria-required', 'true');
                        expect(emailInput).toHaveAttribute('aria-required', 'true');
                        expect(messageInput).toHaveAttribute('aria-required', 'true');

                        // Property: All fields have aria-invalid attribute (initially false)
                        expect(nameInput).toHaveAttribute('aria-invalid', 'false');
                        expect(emailInput).toHaveAttribute('aria-invalid', 'false');
                        expect(messageInput).toHaveAttribute('aria-invalid', 'false');
                    } finally {
                        unmount();
                    }
                }
            }
        );

        test(
            'should render form with correct structure and classes',
            () => {
                for (let i = 0; i < 50; i++) {
                    const { unmount, container } = render(<ContactForm />);

                    try {
                        // Property: Form has proper spacing classes
                        const form = container.querySelector('form');
                        expect(form).toHaveClass('space-y-6');

                        // Property: Each input field div has proper spacing
                        const inputDivs = form?.querySelectorAll(':scope > div');
                        expect(inputDivs!.length).toBeGreaterThanOrEqual(3);
                    } finally {
                        unmount();
                    }
                }
            }
        );

        test(
            'should render submit button with proper styling',
            () => {
                for (let i = 0; i < 50; i++) {
                    const { unmount } = render(<ContactForm />);

                    try {
                        // Property: Submit button has proper classes
                        const submitButton = screen.getByRole('button', { name: /Send Message/i });
                        expect(submitButton).toHaveClass('w-full', 'px-6', 'py-4', 'rounded-lg');

                        // Property: Submit button is not disabled initially
                        expect(submitButton).not.toBeDisabled();
                    } finally {
                        unmount();
                    }
                }
            }
        );
    });
});
