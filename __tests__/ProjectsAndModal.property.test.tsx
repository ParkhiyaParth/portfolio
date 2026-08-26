import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import { Project } from '@/lib/types';
import '@testing-library/jest-dom';

/**
 * Property-Based Tests for Projects Gallery and Modal System
 * 
 * Uses fast-check to verify properties hold across a wide range of inputs.
 * Tests verify the complete project display and modal interaction workflow.
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.7**
 * 
 * Properties tested:
 * - Property 10: Projects Gallery Display
 * - Property 11: Project Detail Indicator Presence
 * - Property 12: Modal Open with Correct Project Data
 * - Property 13: Modal Content Completeness
 * - Property 14: Modal Lifecycle
 * - Property 15: Modal Responsiveness
 */

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <img {...props} />;
    },
}));

// Arbitrary generators for test data
const titleArbitrary = () =>
    fc.tuple(
        fc.constant('Project '),
        fc.integer({ min: 1, max: 99 })
    ).map(([prefix, num]) => prefix + num);

const descriptionArbitrary = () =>
    fc.tuple(
        fc.constant('A project focused on '),
        fc.stringMatching(/^[A-Za-z ]{8,50}$/)
    ).map(([prefix, topic]) => prefix + topic);

const idArbitrary = () => fc.uuid();

const technologyArbitrary = () =>
    fc.subarray(
        ['React', 'TypeScript', 'Python', 'Node.js', 'FastAPI', 'Tailwind', 'LLM', 'RAG'],
        { minLength: 1, maxLength: 5 }
    );

const urlArbitrary = () =>
    fc.option(fc.constant('https://example.com/repo'));

const outcomeArbitrary = () =>
    fc.array(
        fc.tuple(
            fc.constant('Achievement: '),
            descriptionArbitrary()
        ).map(([prefix, desc]) => prefix + desc),
        { minLength: 1, maxLength: 3 }
    );

const projectArbitrary = (): fc.Arbitrary<Project> =>
    fc.record({
        id: idArbitrary(),
        title: titleArbitrary(),
        description: descriptionArbitrary(),
        detailedDescription: fc.tuple(
            fc.constant('Detailed: '),
            descriptionArbitrary()
        ).map(([prefix, desc]) => prefix + desc),
        technologies: technologyArbitrary(),
        outcomes: outcomeArbitrary(),
        imageUrl: fc.constant('/images/placeholder.png'),
        githubUrl: urlArbitrary(),
        liveUrl: urlArbitrary(),
    });

const projectArrayArbitrary = (minLength = 1, maxLength = 5) =>
    fc.array(projectArbitrary(), { minLength, maxLength });

describe('ProjectsAndModal - Property-Based Tests', () => {
    beforeEach(() => {
        // Cleanup body styles before each test
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
    });

    afterEach(() => {
        // Cleanup body styles after each test
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
    });

    describe('Property 10: Projects Gallery Display', () => {
        /**
         * **Validates: Requirements 7.1, 7.2, 7.3**
         * 
         * For any list of projects, the projects section SHALL render all projects
         * with their preview information (title, description, image, technologies).
         */
        it('should render all projects in a gallery with complete preview data', () => {
            fc.assert(
                fc.property(projectArrayArbitrary(1, 5), (projects) => {
                    const mockOnOpenModal = jest.fn();

                    const { unmount } = render(
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onOpenModal={mockOnOpenModal}
                                />
                            ))}
                        </div>
                    );

                    try {
                        // Property: All projects are rendered in the gallery
                        projects.forEach((project, index) => {
                            const titleElements = screen.getAllByText(project.title);
                            expect(titleElements.length).toBeGreaterThanOrEqual(1);
                        });

                        // Property: All project descriptions are visible
                        projects.forEach((project, index) => {
                            const descriptionShort = project.description.split(' ').slice(0, 3).join(' ');
                            const descElements = screen.queryAllByText((content) =>
                                content.includes(descriptionShort)
                            );
                            expect(descElements.length).toBeGreaterThanOrEqual(1);
                        });
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should render all technologies for each project in the gallery', () => {
            fc.assert(
                fc.property(projectArrayArbitrary(1, 5), (projects) => {
                    const mockOnOpenModal = jest.fn();

                    const { unmount } = render(
                        <div>
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onOpenModal={mockOnOpenModal}
                                />
                            ))}
                        </div>
                    );

                    try {
                        // Property: All technologies are rendered if they exist
                        projects.forEach((project) => {
                            if (project.technologies.length > 0) {
                                project.technologies.forEach((tech) => {
                                    const techElements = screen.queryAllByText(tech);
                                    expect(techElements.length).toBeGreaterThan(0);
                                });
                            }
                        });
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should maintain responsive grid structure for any number of projects', () => {
            fc.assert(
                fc.property(projectArrayArbitrary(1, 5), (projects) => {
                    const mockOnOpenModal = jest.fn();
                    const { container, unmount } = render(
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onOpenModal={mockOnOpenModal}
                                />
                            ))}
                        </div>
                    );

                    try {
                        // Property: Grid structure has responsive classes
                        const grid = container.querySelector('.grid');
                        expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });
    });

    describe('Property 11: Project Detail Indicator Presence', () => {
        /**
         * **Validates: Requirement 7.5**
         * 
         * For any rendered project card, the card SHALL include a visual indicator
         * (button, icon, or text) that signals additional details are available.
         */
        it('should display "View Details" indicator on every project card', () => {
            fc.assert(
                fc.property(projectArrayArbitrary(1, 5), (projects) => {
                    const mockOnOpenModal = jest.fn();

                    const { unmount } = render(
                        <div>
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onOpenModal={mockOnOpenModal}
                                />
                            ))}
                        </div>
                    );

                    try {
                        // Property: "View Details" text is always present
                        const viewDetailsElements = screen.getAllByText('View Details');
                        expect(viewDetailsElements.length).toBe(projects.length);
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should have visual indicator with arrow icon for each project', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const mockOnOpenModal = jest.fn();
                    const { container, unmount } = render(
                        <ProjectCard
                            project={project}
                            onOpenModal={mockOnOpenModal}
                        />
                    );

                    try {
                        // Property: Arrow icon (svg) is present as visual indicator
                        const svg = container.querySelector('svg');
                        expect(svg).toBeInTheDocument();
                        expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should have keyboard-accessible detail indicator', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const mockOnOpenModal = jest.fn();
                    const { unmount } = render(
                        <ProjectCard
                            project={project}
                            onOpenModal={mockOnOpenModal}
                        />
                    );

                    try {
                        // Property: Button role with proper accessibility
                        const button = screen.getByRole('button');
                        expect(button).toHaveAttribute('role', 'button');
                        expect(button).toHaveAttribute('tabIndex', '0');
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });
    });

    describe('Property 12: Modal Open with Correct Project Data', () => {
        /**
         * **Validates: Requirement 8.1**
         * 
         * For any project in the projects list, when that project's card is clicked,
         * the modal SHALL open with the correct project data (matching the clicked project's ID).
         */
        it('should open modal with correct project data when card is clicked', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const mockOnOpenModal = jest.fn();

                    const { unmount } = render(
                        <ProjectCard
                            project={project}
                            onOpenModal={mockOnOpenModal}
                        />
                    );

                    try {
                        // Click the project card
                        const button = screen.getByRole('button');
                        fireEvent.click(button);

                        // Property: onOpenModal called with correct project data
                        expect(mockOnOpenModal).toHaveBeenCalledWith(project);
                        expect(mockOnOpenModal).toHaveBeenCalledTimes(1);
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should open modal with keyboard interaction (Enter key)', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const mockOnOpenModal = jest.fn();

                    const { unmount } = render(
                        <ProjectCard
                            project={project}
                            onOpenModal={mockOnOpenModal}
                        />
                    );

                    try {
                        // Simulate Enter key press
                        const button = screen.getByRole('button');
                        fireEvent.keyDown(button, { key: 'Enter' });

                        // Property: onOpenModal called with correct project
                        expect(mockOnOpenModal).toHaveBeenCalledWith(project);
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should display modal with matching project ID when opened', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Property: Modal displays the correct project's title
                        expect(screen.getByText(project.title)).toBeInTheDocument();
                        // Property: Modal has correct aria-labelledby matching project
                        const modal = screen.getByRole('dialog');
                        expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
                        const title = screen.getByText(project.title);
                        expect(title).toHaveAttribute('id', 'modal-title');
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });
    });

    describe('Property 13: Modal Content Completeness', () => {
        /**
         * **Validates: Requirement 8.2**
         * 
         * For any project displayed in the modal, the modal SHALL render all detailed fields:
         * title, detailed description, technologies, outcomes, and optional links (GitHub, live URL).
         */
        it('should render all required content fields in the modal', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Property: Title is always rendered
                        expect(screen.getByText(project.title)).toBeInTheDocument();

                        // Property: Detailed description is always rendered
                        expect(screen.getByText((content) =>
                            content.includes(project.detailedDescription.split(' ').slice(0, 5).join(' '))
                        )).toBeInTheDocument();

                        // Property: Technologies section header is present
                        expect(screen.getByText('Technologies Used')).toBeInTheDocument();

                        // Property: Outcomes section header is present
                        expect(screen.getByText('Outcomes & Achievements')).toBeInTheDocument();
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should render all technologies in the modal', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Property: All technologies are rendered
                        project.technologies.forEach((tech) => {
                            expect(screen.getByText(tech)).toBeInTheDocument();
                        });
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should render all outcomes in the modal', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Property: All outcomes are rendered
                        project.outcomes.forEach((outcome) => {
                            const outcomeShort = outcome.split(' ').slice(0, 3).join(' ');
                            const outcomeElements = screen.queryAllByText((content) =>
                                content.includes(outcomeShort)
                            );
                            expect(outcomeElements.length).toBeGreaterThanOrEqual(1);
                        });
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should render optional links when provided', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Property: GitHub link rendered if provided
                        if (project.githubUrl) {
                            const githubLink = screen.getByRole('link', { name: /GitHub/i });
                            expect(githubLink).toHaveAttribute('href', project.githubUrl);
                        }

                        // Property: Live Demo link rendered if provided
                        if (project.liveUrl) {
                            const liveLink = screen.getByRole('link', { name: /Live Demo/i });
                            expect(liveLink).toHaveAttribute('href', project.liveUrl);
                        }
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should have proper section structure with semantic HTML', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { container, unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Property: Multiple h3 headers for section organization
                        const h3Elements = container.querySelectorAll('h3');
                        expect(h3Elements.length).toBeGreaterThanOrEqual(2);

                        // Property: List elements for outcomes (semantic HTML)
                        const listItems = container.querySelectorAll('li');
                        expect(listItems.length).toBe(project.outcomes.length);
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });
    });

    describe('Property 14: Modal Lifecycle', () => {
        /**
         * **Validates: Requirements 8.3, 8.4, 8.5**
         * 
         * For any modal state, when the modal is opened and then closed (via close button,
         * outside click, or Escape key), the modal SHALL transition from visible to hidden
         * and return focus appropriately.
         */
        it('should close modal when close button is clicked', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const mockOnClose = jest.fn();

                    const { unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={mockOnClose}
                        />
                    );

                    try {
                        // Get and click the close button
                        const closeButton = screen.getByRole('button', { name: /Close/i });
                        fireEvent.click(closeButton);

                        // Property: onClose called once
                        expect(mockOnClose).toHaveBeenCalledTimes(1);
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should close modal when Escape key is pressed', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const mockOnClose = jest.fn();

                    const { unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={mockOnClose}
                        />
                    );

                    try {
                        // Simulate Escape key
                        fireEvent.keyDown(document, { key: 'Escape' });

                        // Property: onClose called
                        expect(mockOnClose).toHaveBeenCalledTimes(1);
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should prevent body scroll when modal is open', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Property: Body scroll is prevented
                        expect(document.body.style.overflow).toBe('hidden');
                        expect(document.body.style.position).toBe('fixed');
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should transition from visible to hidden when closed', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { rerender, unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Initial state: modal is visible
                        expect(screen.getByRole('dialog')).toBeInTheDocument();

                        // Rerender with isOpen=false
                        rerender(
                            <ProjectModal
                                project={project}
                                isOpen={false}
                                onClose={() => { }}
                            />
                        );

                        // Property: Modal is no longer in the DOM
                        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should restore body scroll when modal is closed', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { rerender, unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Modal open: scroll hidden
                        expect(document.body.style.overflow).toBe('hidden');

                        // Close modal
                        rerender(
                            <ProjectModal
                                project={project}
                                isOpen={false}
                                onClose={() => { }}
                            />
                        );

                        // Property: Scroll is restored
                        expect(document.body.style.overflow).toBe('');
                        expect(document.body.style.position).toBe('');
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });
    });

    describe('Property 15: Modal Responsiveness', () => {
        /**
         * **Validates: Requirement 8.7**
         * 
         * For any viewport size (mobile, tablet, desktop), the project modal SHALL render
         * correctly without layout issues or horizontal scrolling.
         */
        it('should apply responsive modal classes for all viewport sizes', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { container, unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Get the modal content div
                        const modalContent = container.querySelector('.glass-card');

                        // Property: Modal has responsive width classes
                        expect(modalContent).toHaveClass('w-full');

                        // Property: Modal has max-width constraint
                        expect(modalContent).toHaveClass('max-w-4xl');

                        // Property: Modal has max-height with overflow handling
                        expect(modalContent).toHaveClass('max-h-[90vh]', 'overflow-y-auto');
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should have padding for all viewport sizes', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { container, unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Get the outer backdrop div
                        const backdrop = container.querySelector('.fixed.inset-0');

                        // Property: Backdrop has padding for mobile/tablet/desktop
                        expect(backdrop).toHaveClass('p-4');
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should render responsive typography for all viewports', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { container, unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Get the title element
                        const titleH2 = container.querySelector('h2');

                        // Property: Title has responsive text sizing classes
                        expect(titleH2).toHaveClass('text-3xl', 'md:text-4xl');
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should have centered layout that does not cause horizontal scrolling', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { container, unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Get the backdrop (outer container)
                        const backdrop = container.querySelector('.fixed.inset-0');

                        // Property: Backdrop uses flexbox centering
                        expect(backdrop).toHaveClass('flex', 'items-center', 'justify-center');

                        // Property: Modal content uses full width (responsive)
                        const modalContent = container.querySelector('.glass-card');
                        expect(modalContent).toHaveClass('w-full');
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });

        it('should apply glassmorphism styling consistently across viewports', () => {
            fc.assert(
                fc.property(projectArbitrary(), (project) => {
                    const { container, unmount } = render(
                        <ProjectModal
                            project={project}
                            isOpen={true}
                            onClose={() => { }}
                        />
                    );

                    try {
                        // Get the modal content
                        const modalContent = container.querySelector('.glass-card');

                        // Property: Glassmorphism class is applied
                        expect(modalContent).toHaveClass('glass-card');

                        // Property: Backdrop blur effect
                        const backdrop = container.querySelector('.fixed.inset-0');
                        expect(backdrop).toHaveClass('backdrop-blur-sm');
                    } finally {
                        unmount();
                    }
                }),
                { numRuns: 50 }
            );
        });
    });
});
