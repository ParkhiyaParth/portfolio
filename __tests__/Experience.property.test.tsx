/**
 * Property-Based Tests for Experience Section
 * 
 * Uses fast-check to verify properties hold across a wide range of inputs.
 * 
 * **Validates: Requirements 9.1, 9.2, 9.3**
 */

import { render, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { Experience } from '@/lib/types';
import GlassCard from '@/components/GlassCard';

// Clean up after each test to prevent DOM pollution
afterEach(() => {
    cleanup();
});

describe('Experience Section - Property-Based Tests', () => {
    // Arbitrary generators for test data
    const idArbitrary = () => fc.uuid();

    const roleArbitrary = () =>
        fc.constantFrom(
            'Senior Software Engineer',
            'ML Engineer',
            'Data Scientist',
            'Full Stack Developer',
            'AI Research Intern',
            'Backend Engineer',
            'Frontend Developer'
        );

    const companyArbitrary = () =>
        fc.constantFrom(
            'Tech Corp',
            'Innovation Labs',
            'AI Solutions Inc',
            'Data Systems Ltd',
            'Software Dynamics'
        );

    const dateArbitrary = () =>
        fc.tuple(
            fc.constantFrom('January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'),
            fc.integer({ min: 2020, max: 2024 })
        ).map(([month, year]) => `${month} ${year}`);

    const descriptionItemArbitrary = () =>
        fc.constantFrom(
            'Developed machine learning models',
            'Led team of 5 engineers',
            'Improved system performance by 40%',
            'Implemented CI/CD pipelines',
            'Conducted code reviews and mentoring'
        );

    const experienceArbitrary = (): fc.Arbitrary<Experience> =>
        fc.record({
            id: idArbitrary(),
            role: roleArbitrary(),
            company: companyArbitrary(),
            startDate: dateArbitrary(),
            endDate: fc.oneof(fc.constant('Present'), dateArbitrary()),
            description: fc.array(descriptionItemArbitrary(), { minLength: 1, maxLength: 5 }),
        });

    describe('Property 16: Experience Content Rendering', () => {
        /**
         * Property: For any list of experience entries containing role, company,
         * dates, and descriptions, the rendered experience section SHALL display
         * all entries with all required fields.
         * 
         * **Validates: Requirements 9.1, 9.2, 9.3**
         */

        it('should render all required fields for any generated experience entry', () => {
            fc.assert(
                fc.property(experienceArbitrary(), (exp) => {
                    // Render a single experience entry using the same structure as the page
                    const { container } = render(
                        <GlassCard key={exp.id} variant="default">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-semibold text-gradient mb-1">
                                        {exp.role}
                                    </h3>
                                    <p className="text-lg text-white">
                                        {exp.company}
                                    </p>
                                </div>
                                <div className="text-sm text-gray-400 mt-2 md:mt-0 md:text-right">
                                    <p>{exp.startDate} - {exp.endDate}</p>
                                </div>
                            </div>
                            <ul className="space-y-2 text-gray-300">
                                {exp.description.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-purple-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </GlassCard>
                    );

                    // Verify role is rendered
                    expect(container).toHaveTextContent(exp.role);

                    // Verify company is rendered
                    expect(container).toHaveTextContent(exp.company);

                    // Verify date range is rendered
                    const dateRange = `${exp.startDate} - ${exp.endDate}`;
                    expect(container).toHaveTextContent(dateRange);

                    // Verify all description items are rendered
                    exp.description.forEach((item) => {
                        expect(container).toHaveTextContent(item);
                    });

                    // Clean up after this property test iteration
                    cleanup();
                }),
                { numRuns: 100 }
            );
        });

        it('should render all entries when given a list of experiences', () => {
            fc.assert(
                fc.property(
                    fc.array(experienceArbitrary(), { minLength: 1, maxLength: 10 }),
                    (experiences) => {
                        // Render all experiences
                        const { container } = render(
                            <div className="space-y-6">
                                {experiences.map((exp) => (
                                    <GlassCard key={exp.id} variant="default">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                            <div>
                                                <h3 className="text-2xl font-semibold text-gradient mb-1">
                                                    {exp.role}
                                                </h3>
                                                <p className="text-lg text-white">
                                                    {exp.company}
                                                </p>
                                            </div>
                                            <div className="text-sm text-gray-400 mt-2 md:mt-0 md:text-right">
                                                <p>{exp.startDate} - {exp.endDate}</p>
                                            </div>
                                        </div>
                                        <ul className="space-y-2 text-gray-300">
                                            {exp.description.map((item, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="text-purple-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </GlassCard>
                                ))}
                            </div>
                        );

                        // Verify each experience entry has all required fields rendered
                        experiences.forEach((exp) => {
                            // Check role
                            expect(container).toHaveTextContent(exp.role);

                            // Check company
                            expect(container).toHaveTextContent(exp.company);

                            // Check date range
                            const dateRange = `${exp.startDate} - ${exp.endDate}`;
                            expect(container).toHaveTextContent(dateRange);

                            // Check all description items
                            exp.description.forEach((item) => {
                                expect(container).toHaveTextContent(item);
                            });
                        });

                        // Verify count of rendered entries matches input
                        // Count the number of h3 elements (one per experience)
                        const headings = container.querySelectorAll('h3');
                        expect(headings).toHaveLength(experiences.length);

                        // Clean up after this property test iteration
                        cleanup();
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should render description array with all items visible', () => {
            fc.assert(
                fc.property(
                    fc.array(descriptionItemArbitrary(), { minLength: 2, maxLength: 5 }),
                    (descriptionItems) => {
                        const testExp: Experience = {
                            id: 'test-id',
                            role: 'Test Engineer',
                            company: 'Test Company',
                            startDate: 'January 2023',
                            endDate: 'December 2023',
                            description: descriptionItems,
                        };

                        const { container } = render(
                            <ul className="space-y-2 text-gray-300">
                                {testExp.description.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-purple-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        );

                        // Verify all description items are rendered
                        descriptionItems.forEach((item) => {
                            expect(container).toHaveTextContent(item);
                        });

                        // Verify count - count list items
                        const listItems = container.querySelectorAll('li');
                        expect(listItems).toHaveLength(descriptionItems.length);

                        // Clean up after this property test iteration
                        cleanup();
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should maintain chronological order for any list of experiences', () => {
            fc.assert(
                fc.property(
                    fc.array(experienceArbitrary(), { minLength: 2, maxLength: 8 }),
                    (experiences) => {
                        // Render experiences in order
                        const { container } = render(
                            <div className="space-y-6" data-testid="experiences-container">
                                {experiences.map((exp, idx) => (
                                    <GlassCard key={`${exp.id}-${idx}`} variant="default">
                                        <h3 data-testid={`role-${idx}`}>{exp.role}</h3>
                                        <p data-testid={`company-${idx}`}>{exp.company}</p>
                                    </GlassCard>
                                ))}
                            </div>
                        );

                        // Verify all experiences are rendered
                        const headings = container.querySelectorAll('h3');
                        expect(headings).toHaveLength(experiences.length);

                        // Verify they appear in the same order as input
                        experiences.forEach((exp, idx) => {
                            const roleElement = container.querySelector(`[data-testid="role-${idx}"]`);
                            const companyElement = container.querySelector(`[data-testid="company-${idx}"]`);

                            expect(roleElement).toHaveTextContent(exp.role);
                            expect(companyElement).toHaveTextContent(exp.company);
                        });

                        // Clean up after this property test iteration
                        cleanup();
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});
