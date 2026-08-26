'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { ContactFormData, FormErrors } from '@/lib/types';
import { validateContactForm } from '@/lib/validation';
import { sendEmail } from '@/lib/email';

/**
 * ContactForm Component
 * 
 * Handles contact form submission with client-side validation and backend integration.
 * Displays inline error messages and success/error feedback.
 * 
 * Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5, 13.6
 */

export default function ContactForm() {
    // Form data state
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: '',
    });

    // Validation errors
    const [errors, setErrors] = useState<FormErrors>({});

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }

        // Clear submit status when user modifies form
        if (submitStatus !== 'idle') {
            setSubmitStatus('idle');
            setSubmitMessage('');
        }
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form data
        const validationErrors = validateContactForm(formData);
        setErrors(validationErrors);

        // If there are validation errors, don't submit
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        // Submit form
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setSubmitMessage('');

        try {
            await sendEmail(formData);

            // Success
            setSubmitStatus('success');
            setSubmitMessage('Thank you for your message! I\'ll get back to you soon.');

            // Clear form
            setFormData({
                name: '',
                email: '',
                message: '',
            });

        } catch (error) {
            // Error
            setSubmitStatus('error');
            setSubmitMessage(
                error instanceof Error
                    ? error.message
                    : 'Failed to send message. Please try again later.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field */}
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white mb-2"
                >
                    Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/20'
                        } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                    placeholder="Your name"
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                    <p id="name-error" className="mt-2 text-sm text-red-400" role="alert">
                        {errors.name}
                    </p>
                )}
            </div>

            {/* Email field */}
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white mb-2"
                >
                    Email *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/20'
                        } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                    placeholder="your.email@example.com"
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                    <p id="email-error" className="mt-2 text-sm text-red-400" role="alert">
                        {errors.email}
                    </p>
                )}
            </div>

            {/* Message field */}
            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium text-white mb-2"
                >
                    Message *
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${errors.message ? 'border-red-500' : 'border-white/20'
                        } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
                    placeholder="Your message..."
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                    <p id="message-error" className="mt-2 text-sm text-red-400" role="alert">
                        {errors.message}
                    </p>
                )}
            </div>

            {/* Submit button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all duration-200 ${isSubmitting
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-dark-bg'
                    }`}
                aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
            >
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {/* Success/Error message */}
            {submitStatus !== 'idle' && (
                <div
                    className={`p-4 rounded-lg ${submitStatus === 'success'
                            ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                            : 'bg-red-500/20 border border-red-500/50 text-red-300'
                        }`}
                    role="alert"
                >
                    {submitMessage}
                </div>
            )}
        </form>
    );
}
