'use client';

import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Project } from '@/lib/types';

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * ProjectModal component displays expanded project details in a full-screen overlay
 * 
 * Features:
 * - Full-screen overlay with centered content
 * - Displays all project fields: title, detailed description, technologies, outcomes, links
 * - Close button with ARIA label
 * - Outside-click dismissal
 * - Escape key handler
 * - Prevents body scroll when open
 * - Focus management for accessibility
 * - Responsive: Full-screen on mobile, centered card on desktop
 * 
 * Validates Requirements: 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 16.4, 16.5
 * 
 * @param project - Project data to display (null when closed)
 * @param isOpen - Modal visibility state
 * @param onClose - Callback to close the modal
 */
export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Handle Escape key press
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            // Save the current scroll position
            const scrollY = window.scrollY;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }

        return () => {
            // Cleanup on unmount
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    // Focus management
    useEffect(() => {
        if (isOpen) {
            // Store the previously focused element
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Focus the modal container
            modalRef.current?.focus();
        } else {
            // Restore focus to the previously focused element
            previousFocusRef.current?.focus();
        }
    }, [isOpen]);

    // Handle outside click on backdrop
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    // Focus trap - keep focus within modal
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Tab') {
            const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (!focusableElements || focusableElements.length === 0) {
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
                // Shift + Tab: if on first element, move to last
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab: if on last element, move to first
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && project && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        ref={modalRef}
                        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
                        tabIndex={-1}
                        onKeyDown={handleKeyDown}
                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 12 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-2xl leading-none"
                    aria-label="Close project details"
                >
                    &times;
                </button>

                {/* Modal content */}
                <div className="pr-12">
                    {/* Project title */}
                    <h2 id="modal-title" className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                        {project.title}
                    </h2>

                    {/* Detailed description */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-white">Description</h3>
                        <p className="text-dark-text-secondary leading-relaxed whitespace-pre-wrap">
                            {project.detailedDescription}
                        </p>
                    </div>

                    {/* Technologies */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3 text-white">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 text-sm rounded-full bg-white/10 border border-white/20 text-dark-text"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Outcomes */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3 text-white">Outcomes & Achievements</h3>
                        <ul className="list-disc list-inside space-y-2">
                            {project.outcomes.map((outcome, index) => (
                                <li key={index} className="text-dark-text-secondary">
                                    {outcome}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links */}
                    {(project.githubUrl || project.liveUrl) && (
                        <div className="flex flex-wrap gap-4">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold hover:opacity-90 transition-opacity"
                                    aria-label={`View ${project.title} on GitHub`}
                                >
                                    View on GitHub
                                </a>
                            )}
                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-lg border-2 border-accent-purple text-white font-semibold hover:bg-accent-purple/20 transition-colors"
                                    aria-label={`View live demo of ${project.title}`}
                                >
                                    Live Demo
                                </a>
                            )}
                        </div>
                    )}
                </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
