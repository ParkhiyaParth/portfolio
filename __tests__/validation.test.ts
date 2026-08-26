/**
 * Property-based tests for form validation
 * 
 * These tests verify form validation logic using property-based testing approach.
 * Each test uses 100+ random iterations to ensure validation rules hold across
 * a wide range of inputs.
 * 
 * Validates: Requirements 13.4, 13.5
 * - Property 20: Contact Form Validation - Valid Input Acceptance
 * - Property 21: Contact Form Validation - Invalid Input Rejection
 */

import fc from 'fast-check';
import { validateContactForm } from '@/lib/validation';
import { ContactFormData } from '@/lib/types';

describe('Form Validation - Property-Based Tests', () => {
    describe('Property 20: Contact Form Validation - Valid Input Acceptance', () => {
        /**
         * Property: For any contact form data where name has ≥2 characters,
         * email is valid format, and message has ≥10 characters, the form
         * validation SHALL return no errors and allow submission.
         * 
         * Validates: Requirement 13.4 - Form inputs are validated on submit
         */
        test(
            'should accept all valid inputs without errors',
            () => {
                fc.assert(
                    fc.property(
                        // Generate valid name: 2+ characters (excluding leading/trailing spaces)
                        fc.stringMatching(/^[^ ].*[^ ]$|^[^ ]$/).filter(s => s.trim().length >= 2),
                        // Generate valid email: proper format with alphanumeric, dot, @, and domain
                        fc.emailAddress(),
                        // Generate valid message: 10+ characters (excluding leading/trailing spaces)
                        fc.stringMatching(/^[^ ].*[^ ]$/).filter(s => s.trim().length >= 10),
                        (name, email, message) => {
                            const formData: ContactFormData = {
                                name,
                                email,
                                message,
                            };

                            const errors = validateContactForm(formData);

                            // Verify no errors are returned for valid inputs
                            expect(errors).toEqual({});
                            expect(Object.keys(errors).length).toBe(0);
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should accept name with exactly 2 characters',
            () => {
                fc.assert(
                    fc.property(
                        fc.stringMatching(/^[a-zA-Z]{2}$/),
                        fc.emailAddress(),
                        fc.stringMatching(/^[^ ].*[^ ]$/).filter(s => s.trim().length >= 10),
                        (name, email, message) => {
                            const formData: ContactFormData = { name, email, message };
                            const errors = validateContactForm(formData);
                            expect(errors.name).toBeUndefined();
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should accept message with exactly 10 characters',
            () => {
                fc.assert(
                    fc.property(
                        fc.stringMatching(/^[a-zA-Z]{2,}$/),
                        fc.emailAddress(),
                        // Generate string with exactly 10+ non-space characters
                        fc.string({ minLength: 10 }).filter(s => s.trim().length >= 10),
                        (name, email, message) => {
                            const formData: ContactFormData = { name, email, message };
                            const errors = validateContactForm(formData);
                            expect(errors.message).toBeUndefined();
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should accept name with leading/trailing spaces when trimmed is valid',
            () => {
                fc.assert(
                    fc.property(
                        fc.tuple(
                            fc.stringMatching(/^[a-zA-Z]{2,}$/),
                            fc.integer({ min: 0, max: 5 }).map(n => ' '.repeat(n)),
                            fc.integer({ min: 0, max: 5 }).map(n => ' '.repeat(n))
                        ),
                        ([nameCore, leading, trailing]) => {
                            const name = leading + nameCore + trailing;
                            const formData: ContactFormData = {
                                name,
                                email: 'test@example.com',
                                message: 'This is a valid message',
                            };

                            const errors = validateContactForm(formData);
                            expect(errors.name).toBeUndefined();
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should accept message with leading/trailing spaces when trimmed is valid',
            () => {
                fc.assert(
                    fc.property(
                        fc.tuple(
                            // Generate messageCore with 10+ non-space characters
                            fc.string({ minLength: 10 }).filter(s => s.trim().length >= 10),
                            fc.integer({ min: 0, max: 5 }).map(n => ' '.repeat(n)),
                            fc.integer({ min: 0, max: 5 }).map(n => ' '.repeat(n))
                        ),
                        ([messageCore, leading, trailing]) => {
                            const message = leading + messageCore + trailing;
                            const formData: ContactFormData = {
                                name: 'John Doe',
                                email: 'john@example.com',
                                message,
                            };

                            const errors = validateContactForm(formData);
                            expect(errors.message).toBeUndefined();
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );
    });

    describe('Property 21: Contact Form Validation - Invalid Input Rejection', () => {
        /**
         * Property: For any contact form data where name has <2 characters,
         * OR email is invalid format, OR message has <10 characters, the form
         * validation SHALL return appropriate error messages for the invalid fields.
         * 
         * Validates: Requirement 13.5 - Error messages are displayed for invalid fields
         */
        test(
            'should reject names with less than 2 characters',
            () => {
                fc.assert(
                    fc.property(
                        // Generate names with 0-1 characters
                        fc.constantFrom('', 'A'),
                        fc.emailAddress(),
                        fc.stringMatching(/^[^ ].*[^ ]$/).filter(s => s.trim().length >= 10),
                        (name, email, message) => {
                            const formData: ContactFormData = { name, email, message };
                            const errors = validateContactForm(formData);

                            // Should have an error for name field
                            expect(errors.name).toBeDefined();
                            expect(errors.name).toMatch(/Name must be at least 2 characters/i);
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should reject invalid email addresses',
            () => {
                fc.assert(
                    fc.property(
                        fc.stringMatching(/^[a-zA-Z]{2,}$/),
                        // Generate invalid emails
                        fc.oneof(
                            fc.string().filter(s => !s.includes('@')), // missing @
                            fc.stringMatching(/^[^@]+$/), // no @
                            fc.stringMatching(/^@.*$/), // starts with @
                            fc.stringMatching(/.*@$/), // ends with @
                            fc.stringMatching(/^.*@[^.]*$/), // no dot after @
                            fc.stringMatching(/^[^@]*@[^@]*$/), // no dot in domain
                            fc.string().filter(s => s.includes(' @') || s.includes('@ ')) // space around @
                        ),
                        fc.stringMatching(/^[^ ].*[^ ]$/).filter(s => s.trim().length >= 10),
                        (name, email, message) => {
                            const formData: ContactFormData = { name, email, message };
                            const errors = validateContactForm(formData);

                            // Should have an error for email field
                            expect(errors.email).toBeDefined();
                            expect(errors.email).toMatch(/Please enter a valid email address/i);
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should reject messages with less than 10 characters',
            () => {
                fc.assert(
                    fc.property(
                        fc.stringMatching(/^[a-zA-Z]{2,}$/),
                        fc.emailAddress(),
                        // Generate messages with 0-9 characters (trimmed)
                        fc.stringMatching(/^[a-zA-Z0-9 ]{0,9}$/),
                        (name, email, message) => {
                            const formData: ContactFormData = { name, email, message };
                            const errors = validateContactForm(formData);

                            // Should have an error for message field
                            expect(errors.message).toBeDefined();
                            expect(errors.message).toMatch(/Message must be at least 10 characters/i);
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should reject empty name field',
            () => {
                fc.assert(
                    fc.property(
                        fc.emailAddress(),
                        fc.stringMatching(/^[^ ].*[^ ]$/).filter(s => s.trim().length >= 10),
                        (email, message) => {
                            const formData: ContactFormData = {
                                name: '',
                                email,
                                message,
                            };

                            const errors = validateContactForm(formData);
                            expect(errors.name).toBeDefined();
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should reject empty email field',
            () => {
                fc.assert(
                    fc.property(
                        fc.stringMatching(/^[a-zA-Z]{2,}$/),
                        fc.stringMatching(/^[^ ].*[^ ]$/).filter(s => s.trim().length >= 10),
                        (name, message) => {
                            const formData: ContactFormData = {
                                name,
                                email: '',
                                message,
                            };

                            const errors = validateContactForm(formData);
                            expect(errors.email).toBeDefined();
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should reject empty message field',
            () => {
                fc.assert(
                    fc.property(
                        fc.stringMatching(/^[a-zA-Z]{2,}$/),
                        fc.emailAddress(),
                        (name, email) => {
                            const formData: ContactFormData = {
                                name,
                                email,
                                message: '',
                            };

                            const errors = validateContactForm(formData);
                            expect(errors.message).toBeDefined();
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should reject whitespace-only fields',
            () => {
                fc.assert(
                    fc.property(
                        fc.integer({ min: 1, max: 10 }).map(n => ' '.repeat(n)),
                        fc.integer({ min: 1, max: 10 }).map(n => ' '.repeat(n)),
                        fc.integer({ min: 1, max: 10 }).map(n => ' '.repeat(n)),
                        (nameSpaces, emailSpaces, messageSpaces) => {
                            const formData: ContactFormData = {
                                name: nameSpaces,
                                email: emailSpaces,
                                message: messageSpaces,
                            };

                            const errors = validateContactForm(formData);
                            // All fields should have errors when only whitespace
                            expect(errors.name).toBeDefined();
                            expect(errors.email).toBeDefined();
                            expect(errors.message).toBeDefined();
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should return multiple errors for multiple invalid fields',
            () => {
                fc.assert(
                    fc.property(
                        fc.constantFrom('', 'A'), // Invalid name
                        fc.stringMatching(/^[^@.]+$/), // Invalid email (no @ or .)
                        fc.stringMatching(/^[a-zA-Z0-9 ]{0,9}$/), // Invalid message (too short)
                        (name, email, message) => {
                            const formData: ContactFormData = { name, email, message };
                            const errors = validateContactForm(formData);

                            // Should have errors for all three fields
                            expect(Object.keys(errors).length).toBeGreaterThanOrEqual(2);
                            expect(errors.name).toBeDefined();
                            expect(errors.email).toBeDefined();
                            expect(errors.message).toBeDefined();
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );
    });

    describe('Edge Cases and Boundary Tests', () => {
        test(
            'should handle special characters in valid input',
            () => {
                fc.assert(
                    fc.property(
                        fc.stringMatching(/^[a-zA-Z'-]{2,}$/).filter(s => s.trim().length >= 2),
                        fc.emailAddress(),
                        fc.stringMatching(/^[a-zA-Z0-9.,'!? -]{10,}$/).filter(s => s.trim().length >= 10),
                        (name, email, message) => {
                            const formData: ContactFormData = { name, email, message };
                            const errors = validateContactForm(formData);
                            expect(errors).toEqual({});
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should handle very long valid inputs',
            () => {
                fc.assert(
                    fc.property(
                        fc.stringMatching(/^[a-zA-Z]{2,}$/).map(s => s + ' ' + s), // Creates longer valid name
                        fc.emailAddress(),
                        fc.string({ minLength: 100 }).filter(s => s.trim().length >= 10),
                        (name, email, message) => {
                            const formData: ContactFormData = { name, email, message };
                            const errors = validateContactForm(formData);
                            expect(errors.name).toBeUndefined();
                            expect(errors.email).toBeUndefined();
                            expect(errors.message).toBeUndefined();
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );

        test(
            'should be consistent across multiple validations of same input',
            () => {
                fc.assert(
                    fc.property(
                        fc.stringMatching(/^[a-zA-Z]{2,}$/),
                        fc.emailAddress(),
                        fc.stringMatching(/^[^ ].*[^ ]$/).filter(s => s.trim().length >= 10),
                        (name, email, message) => {
                            const formData: ContactFormData = { name, email, message };

                            // Validate multiple times
                            const errors1 = validateContactForm(formData);
                            const errors2 = validateContactForm(formData);
                            const errors3 = validateContactForm(formData);

                            // Should always return the same result
                            expect(errors1).toEqual(errors2);
                            expect(errors2).toEqual(errors3);
                        }
                    ),
                    { numRuns: 100 }
                );
            }
        );
    });
});
