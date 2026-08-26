import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/lib/types';
import '@testing-library/jest-dom';

/**
 * Test suite for ProjectCard component
 * 
 * Validates Requirements 7.2, 7.5, and 2.2:
 * - Requirement 7.2: Projects_Section SHALL show project preview information (title, description, image, technologies)
 * - Requirement 7.5: Projects_Section SHALL include visual indicator that more details are available
 * - Requirement 2.2: Portfolio_System SHALL implement Glassmorphism effects on UI components
 */

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <img {...props} />;
    },
}));

describe('ProjectCard Component', () => {
    // Test data
    const mockProject: Project = {
        id: '1',
        title: 'Test Project',
        description: 'This is a test project description',
        detailedDescription: 'This is the detailed description for the test project with more comprehensive information.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        outcomes: ['Outcome 1', 'Outcome 2'],
        imageUrl: '/images/test-project.jpg',
        githubUrl: 'https://github.com/test/project',
        liveUrl: 'https://example.com'
    };

    const mockOnOpenModal = jest.fn();

    beforeEach(() => {
        mockOnOpenModal.mockClear();
    });

    describe('Requirement 7.2: Project Preview Information Rendering', () => {
        it('should render project title', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            expect(screen.getByText(mockProject.title)).toBeInTheDocument();
        });

        it('should render project description', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            expect(screen.getByText(mockProject.description)).toBeInTheDocument();
        });

        it('should render all project technologies', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            mockProject.technologies.forEach((tech) => {
                expect(screen.getByText(tech)).toBeInTheDocument();
            });
        });

        it('should render project image with correct alt text', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const img = screen.getByAltText(`${mockProject.title} project screenshot`);
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', mockProject.imageUrl);
        });

        it('should render all preview information together', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);

            // Verify all key information is rendered
            expect(screen.getByText(mockProject.title)).toBeInTheDocument();
            expect(screen.getByText(mockProject.description)).toBeInTheDocument();
            expect(screen.getByAltText(`${mockProject.title} project screenshot`)).toBeInTheDocument();

            // Verify at least one technology is rendered
            expect(screen.getByText('React')).toBeInTheDocument();
        });

        it('should handle projects with few technologies', () => {
            const projectWithOneTech: Project = {
                ...mockProject,
                technologies: ['Python']
            };

            render(<ProjectCard project={projectWithOneTech} onOpenModal={mockOnOpenModal} />);
            expect(screen.getByText('Python')).toBeInTheDocument();
        });

        it('should handle projects with many technologies', () => {
            const projectWithManyTechs: Project = {
                ...mockProject,
                technologies: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Jest', 'Python', 'FastAPI']
            };

            render(<ProjectCard project={projectWithManyTechs} onOpenModal={mockOnOpenModal} />);
            projectWithManyTechs.technologies.forEach((tech) => {
                expect(screen.getByText(tech)).toBeInTheDocument();
            });
        });
    });

    describe('Requirement 7.5: Visual Indicator for More Details', () => {
        it('should render "View Details" text', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            expect(screen.getByText('View Details')).toBeInTheDocument();
        });

        it('should render arrow icon indicating more details available', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const svg = screen.getByRole('img', { hidden: true });
            expect(svg).toBeInTheDocument();
        });

        it('should have aria-label indicating project name for accessibility', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-label', `View details for ${mockProject.title} project`);
        });

        it('should render "View Details" section visually distinct', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const viewDetailsText = screen.getByText('View Details');
            // The text-purple-400 class is on the parent flex container, not the span
            const parentDiv = viewDetailsText.closest('.flex');
            expect(parentDiv).toHaveClass('text-purple-400');
        });

        it('should position "View Details" after description content', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const container = screen.getByRole('button');
            const viewDetails = screen.getByText('View Details');
            expect(container).toContainElement(viewDetails);
        });
    });

    describe('Requirement 2.2: Glassmorphism Effects', () => {
        it('should apply GlassCard component with glassmorphism styling', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const glassCard = container.querySelector('.glass-card-hover');
            expect(glassCard).toBeInTheDocument();
        });

        it('should have hover effects applied through GlassCard variant', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const glassCard = container.querySelector('.glass-card-hover');
            expect(glassCard).toHaveClass('transition-all', 'duration-300');
        });

        it('should apply shadow effect on hover', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const glassCard = container.querySelector('.glass-card-hover');
            expect(glassCard).toHaveClass('group-hover:shadow-2xl', 'group-hover:shadow-purple-500/20');
        });

        it('should scale image on hover', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const image = container.querySelector('img');
            expect(image).toHaveClass('group-hover:scale-110');
        });

        it('should have backdrop blur effect', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const glassCard = container.querySelector('.glass-card-hover');
            expect(glassCard).toBeInTheDocument();
            // The actual blur effect is in CSS, but we can verify the class is present
        });
    });

    describe('Featured Project Badge', () => {
        it('should not render a featured badge for a regular project', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            expect(screen.queryByText(/flagship project/i)).not.toBeInTheDocument();
        });

        it('should render a featured badge when project.featured is true', () => {
            const featuredProject: Project = { ...mockProject, featured: true };
            render(<ProjectCard project={featuredProject} onOpenModal={mockOnOpenModal} />);
            expect(screen.getByText(/flagship project/i)).toBeInTheDocument();
        });

        it('should mention "featured" in the accessible label when featured', () => {
            const featuredProject: Project = { ...mockProject, featured: true };
            render(<ProjectCard project={featuredProject} onOpenModal={mockOnOpenModal} />);
            const button = screen.getByRole('button');
            expect(button.getAttribute('aria-label')).toContain('featured project');
        });

        it('should span two columns on medium+ screens when featured', () => {
            const featuredProject: Project = { ...mockProject, featured: true };
            const { container } = render(<ProjectCard project={featuredProject} onOpenModal={mockOnOpenModal} />);
            const article = container.querySelector('article');
            expect(article).toHaveClass('md:col-span-2');
        });
    });

    describe('Click and Interaction Handling', () => {
        it('should call onOpenModal when card is clicked', async () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const button = screen.getByRole('button');

            fireEvent.click(button);

            expect(mockOnOpenModal).toHaveBeenCalledWith(mockProject);
            expect(mockOnOpenModal).toHaveBeenCalledTimes(1);
        });

        it('should call onOpenModal when Enter key is pressed', async () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const button = screen.getByRole('button');

            fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

            expect(mockOnOpenModal).toHaveBeenCalledWith(mockProject);
        });

        it('should call onOpenModal when Space key is pressed', async () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const button = screen.getByRole('button');

            fireEvent.keyDown(button, { key: ' ', code: 'Space' });

            expect(mockOnOpenModal).toHaveBeenCalledWith(mockProject);
        });

        it('should not call onOpenModal for other keys', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const button = screen.getByRole('button');

            fireEvent.keyDown(button, { key: 'Escape', code: 'Escape' });

            expect(mockOnOpenModal).not.toHaveBeenCalled();
        });

        it('should be keyboard accessible with tab navigation', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const button = screen.getByRole('button');

            expect(button).toHaveAttribute('tabIndex', '0');
        });
    });

    describe('Edge Cases and Robustness', () => {
        it('should handle long project titles', () => {
            const longTitleProject: Project = {
                ...mockProject,
                title: 'This is a very long project title that might wrap to multiple lines in the interface'
            };

            render(<ProjectCard project={longTitleProject} onOpenModal={mockOnOpenModal} />);
            expect(screen.getByText(longTitleProject.title)).toBeInTheDocument();
        });

        it('should handle long descriptions', () => {
            const longDescProject: Project = {
                ...mockProject,
                description: 'This is a very long project description that contains lots of details about what the project does and why it is important. It should be truncated in the preview.'
            };

            render(<ProjectCard project={longDescProject} onOpenModal={mockOnOpenModal} />);
            expect(screen.getByText(longDescProject.description)).toBeInTheDocument();
        });

        it('should handle empty technologies array gracefully', () => {
            const projectWithNoTechs: Project = {
                ...mockProject,
                technologies: []
            };

            const { container } = render(<ProjectCard project={projectWithNoTechs} onOpenModal={mockOnOpenModal} />);
            // Should still render without crashing
            expect(screen.getByText(projectWithNoTechs.title)).toBeInTheDocument();
        });

        it('should handle missing optional URLs', () => {
            const projectWithoutUrls: Project = {
                ...mockProject,
                githubUrl: undefined,
                liveUrl: undefined
            };

            render(<ProjectCard project={projectWithoutUrls} onOpenModal={mockOnOpenModal} />);
            expect(screen.getByText(projectWithoutUrls.title)).toBeInTheDocument();
        });

        it('should render with article semantic HTML element', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const article = container.querySelector('article');
            expect(article).toBeInTheDocument();
        });
    });

    describe('Accessibility Features', () => {
        it('should have proper ARIA attributes for accessibility', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const button = screen.getByRole('button');

            expect(button).toHaveAttribute('aria-label');
            expect(button.getAttribute('aria-label')).toContain(mockProject.title);
        });

        it('should have proper image alt text for accessibility', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const img = screen.getByAltText(`${mockProject.title} project screenshot`);

            expect(img.getAttribute('alt')).toBeTruthy();
            expect(img.getAttribute('alt')).toContain(mockProject.title);
        });

        it('should have role="button" for keyboard accessibility', () => {
            render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const button = screen.getByRole('button');

            expect(button).toHaveAttribute('role', 'button');
        });

        it('should indicate icon as decorative with aria-hidden', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const svg = container.querySelector('svg');

            expect(svg).toHaveAttribute('aria-hidden', 'true');
        });
    });

    describe('Visual Styling', () => {
        it('should have group class for hover effects', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const article = container.querySelector('article');

            expect(article).toHaveClass('group');
        });

        it('should have flex layout for vertical stacking', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const glassCard = container.querySelector('.glass-card-hover');

            expect(glassCard).toHaveClass('flex', 'flex-col');
        });

        it('should have fixed height for image container', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const imageContainer = container.querySelector('.h-48');

            expect(imageContainer).toBeInTheDocument();
        });

        it('should style technologies as badges with purple theme', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const badges = container.querySelectorAll('.bg-purple-500\\/20');

            expect(badges.length).toBeGreaterThan(0);
        });

        it('should have proper spacing and padding', () => {
            const { container } = render(<ProjectCard project={mockProject} onOpenModal={mockOnOpenModal} />);
            const glassCard = container.querySelector('.glass-card-hover');

            expect(glassCard).toHaveClass('p-6');
        });
    });
});
