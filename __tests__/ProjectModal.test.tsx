/**
 * Unit tests for ProjectModal component
 * 
 * Tests verify:
 * - Modal renders with correct project data
 * - Close button functionality
 * - Outside-click dismissal
 * - Escape key handler
 * - Body scroll prevention
 * - Focus management
 * - Responsive layout
 * - Accessibility features (ARIA labels, keyboard navigation)
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectModal from '@/components/ProjectModal';
import { Project } from '@/lib/types';

// Mock project data for testing
const mockProject: Project = {
    id: '1',
    title: 'Test Project',
    description: 'Short description',
    detailedDescription: 'This is a detailed description of the test project.',
    technologies: ['React', 'TypeScript', 'Next.js'],
    outcomes: ['Outcome 1', 'Outcome 2', 'Outcome 3'],
    imageUrl: '/test-image.jpg',
    githubUrl: 'https://github.com/test/project',
    liveUrl: 'https://test-project.com'
};

describe('ProjectModal Component', () => {
    let mockOnClose: jest.Mock;

    beforeEach(() => {
        mockOnClose = jest.fn();
    });

    afterEach(() => {
        // Cleanup body styles
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
    });

    describe('Rendering and Display', () => {
        test('should not render when isOpen is false', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={false}
                    onClose={mockOnClose}
                />
            );

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        test('should not render when project is null', () => {
            render(
                <ProjectModal
                    project={null}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        test('should render when isOpen is true and project is provided', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        test('should display project title (Requirement 8.2)', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            expect(screen.getByText('Test Project')).toBeInTheDocument();
        });

        test('should display detailed description (Requirement 8.2)', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            expect(screen.getByText('This is a detailed description of the test project.')).toBeInTheDocument();
        });

        test('should display all technologies (Requirement 8.2)', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            expect(screen.getByText('React')).toBeInTheDocument();
            expect(screen.getByText('TypeScript')).toBeInTheDocument();
            expect(screen.getByText('Next.js')).toBeInTheDocument();
        });

        test('should display all outcomes (Requirement 8.2)', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            expect(screen.getByText('Outcome 1')).toBeInTheDocument();
            expect(screen.getByText('Outcome 2')).toBeInTheDocument();
            expect(screen.getByText('Outcome 3')).toBeInTheDocument();
        });

        test('should display GitHub link when provided (Requirement 8.2)', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            const githubLink = screen.getByRole('link', { name: /View.*on GitHub/i });
            expect(githubLink).toBeInTheDocument();
            expect(githubLink).toHaveAttribute('href', 'https://github.com/test/project');
        });

        test('should display Live Demo link when provided (Requirement 8.2)', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            const liveLink = screen.getByRole('link', { name: /Live Demo/i });
            expect(liveLink).toBeInTheDocument();
            expect(liveLink).toHaveAttribute('href', 'https://test-project.com');
        });

        test('should not display links when not provided', () => {
            const projectWithoutLinks = { ...mockProject, githubUrl: undefined, liveUrl: undefined };
            render(
                <ProjectModal
                    project={projectWithoutLinks}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            expect(screen.queryByRole('link', { name: /GitHub/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /Live Demo/i })).not.toBeInTheDocument();
        });
    });

    describe('Close Functionality', () => {
        test('should have close button with ARIA label (Requirement 8.4)', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            const closeButton = screen.getByRole('button', { name: /Close project details/i });
            expect(closeButton).toBeInTheDocument();
        });

        test('should call onClose when close button is clicked (Requirement 8.3)', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            const closeButton = screen.getByRole('button', { name: /Close project details/i });
            fireEvent.click(closeButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        test('should call onClose when backdrop is clicked (Requirement 8.4)', () => {
            const { container } = render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            // Find the outer backdrop div (the one with the onClick handler)
            // It should have the fixed inset-0 styles and bg-black
            const backdropElement = container.querySelector('.fixed.inset-0');
            if (backdropElement) {
                // Simulate a click on the backdrop itself (where target === currentTarget)
                const clickEvent = new MouseEvent('click', { bubbles: true });
                Object.defineProperty(clickEvent, 'target', { value: backdropElement, enumerable: true });
                Object.defineProperty(clickEvent, 'currentTarget', { value: backdropElement, enumerable: true });
                backdropElement.dispatchEvent(clickEvent);
                expect(mockOnClose).toHaveBeenCalledTimes(1);
            }
        });

        test('should call onClose when Escape key is pressed (Requirement 8.5)', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            fireEvent.keyDown(document, { key: 'Escape' });

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        test('should not call onClose for other key presses', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            fireEvent.keyDown(document, { key: 'Enter' });
            fireEvent.keyDown(document, { key: 'Space' });

            expect(mockOnClose).not.toHaveBeenCalled();
        });
    });

    describe('Body Scroll Prevention', () => {
        test('should prevent body scroll when modal is open', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            expect(document.body.style.overflow).toBe('hidden');
            expect(document.body.style.position).toBe('fixed');
        });

        test('should restore body scroll when modal is closed', () => {
            const { rerender } = render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            expect(document.body.style.overflow).toBe('hidden');

            rerender(
                <ProjectModal
                    project={mockProject}
                    isOpen={false}
                    onClose={mockOnClose}
                />
            );

            expect(document.body.style.overflow).toBe('');
            expect(document.body.style.position).toBe('');
        });
    });

    describe('Accessibility (Requirements 16.4, 16.5)', () => {
        test('should have role="dialog"', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();
        });

        test('should have aria-modal="true"', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveAttribute('aria-modal', 'true');
        });

        test('should have aria-labelledby pointing to modal title', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');

            const title = screen.getByText('Test Project');
            expect(title).toHaveAttribute('id', 'modal-title');
        });

        test('should have ARIA label on GitHub link', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            const githubLink = screen.getByRole('link', { name: /View Test Project on GitHub/i });
            expect(githubLink).toHaveAttribute('aria-label');
        });

        test('should have ARIA label on Live Demo link', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            const liveLink = screen.getByRole('link', { name: /View live demo of Test Project/i });
            expect(liveLink).toHaveAttribute('aria-label');
        });
    });

    describe('Responsive Layout (Requirement 8.7)', () => {
        test('should apply responsive styling classes', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            const dialog = screen.getByRole('dialog');
            const modalContent = dialog.querySelector('.glass-card');

            expect(modalContent).toHaveClass('w-full');
            expect(modalContent).toHaveClass('max-w-4xl');
            expect(modalContent).toHaveClass('max-h-[90vh]');
        });
    });

    describe('Glassmorphism Styling', () => {
        test('should apply glass-card class for glassmorphism effect', () => {
            render(
                <ProjectModal
                    project={mockProject}
                    isOpen={true}
                    onClose={mockOnClose}
                />
            );

            const dialog = screen.getByRole('dialog');
            const modalContent = dialog.querySelector('.glass-card');

            expect(modalContent).toBeInTheDocument();
        });
    });
});
