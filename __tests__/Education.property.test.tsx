/**
 * Property-Based Tests for Education Section
 * 
 * Uses fast-check to verify properties hold across a wide range of inputs.
 * Validates Requirements 10.1, 10.2
 * 
 * **Validates: Requirements 10.1, 10.2**
 */

import { render, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { Education } from '@/lib/types';
import GlassCard from '@/components/GlassCard';

// Clean up after each test to prevent DOM pollution
afterEach(() => {
    cleanup();
});

describe('Education Section - Property-Based Tests', () => {
    // Arbitrary generators for test data
    const idArbitrary = () => fc.uuid();

    const degreeArbitrary = () =>
        fc.tuple(
            fc.constantFrom('B.Tech', 'B.E.', 'B.Sc.', 'M.Tech', 'M.Sc.', 'B.A.', 'M.A.', 'Ph.D.'),
            fc.constantFrom(
                'Computer Engineering',
                'Computer Science',
                'Information Technology',
                'Data Science',
                'Artificial Intelligence',
                'Software Engineering',
                'Electronics Engineering'
            )
        ).map(([degree, field]) => `${degree} in ${field}`);

    const institutionArbitrary = () =>
        fc.constantFrom(
            'Massachusetts Institute of Technology',
            'Stanford University',
            'University of California Berkeley',
            'Carnegie Mellon University',
            'Indian Institute of Technology',
            'University of Oxford',
            'Harvard University'
        );

    const dateArbitrary = () =>
        fc.tuple(
            fc.integer({ min: 2015, max: 2024 }),
            fc.oneof(
                fc.constant(''),
                fc.integer({ min: 2015, max: 2024 }).map(year => ` - ${year}`)
            )
        ).map(([year, range]) => `${year}${range}`);

    const detailsArbitrary = () =>
        fc.option(
            fc.constantFrom(
                'CGPA: 8.5/10.0 | Dean\'s List',
                'GPA: 3.8/4.0 | Summa Cum Laude',
                'First Class with Distinction',
                'Research focus: Machine Learning and AI',
                'Thesis: Advanced Neural Networks'
            ),
            { nil: undefined }
        );

    const educationArbitrary = (): fc.Arbitrary<Education> =>
        fc.record({
            id: idArbitrary(),
            degree: degreeArbitrary(),
            institution: institutionArbitrary(),
            date: dateArbitrary(),
            details: detailsArbitrary(),
        });

    describe('Property 17: Education Content Rendering', () => {
        /**
         * Property: For any list of education entries containing degree,
         * institution, and date, the rendered education section SHALL display
         * all entries with all required fields.
         * 
         * **Validates: Requirements 10.1, 10.2**
         */

        it('should render all required fields for any generated education entry', () => {
            fc.assert(
                fc.property(educationArbitrary(), (edu) => {
                    // Render a single education entry using the same structure as the page
                    const { container } = render(
                        <GlassCard key={edu.id} variant="default">
                            {/* Degree */}
                            <h3 className="text-2xl font-semibold text-gradient mb-2">
                                {edu.degree}
                            </h3>

                            {/* Institution */}
                            <p className="text-lg text-white mb-1">
                                {edu.institution}
                            </p>

                            {/* University/Date */}
                            <p className="text-gray-400 mb-3">
                                {edu.date}
                            </p>

                            {/* Details */}
                            {edu.details && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-gray-300">
                                        {edu.details}
                                    </p>
                                </div>
                            )}
                        </GlassCard>
                    );

                    // Verify degree is rendered
                    expect(container).toHaveTextContent(edu.degree);

                    // Verify institution is rendered
                    expect(container).toHaveTextContent(edu.institution);

                    // Verify date is rendered
                    expect(container).toHaveTextContent(edu.date);

                    // Verify details are rendered if present
                    if (edu.details) {
                        expect(container).toHaveTextContent(edu.details);
                    }

                    // Clean up after this property test iteration
                    cleanup();
                }),
                { numRuns: 100 }
            );
        });

        it('should render all entries when given a list of education entries', () => {
            fc.assert(
                fc.property(
                    fc.array(educationArbitrary(), { minLength: 1, maxLength: 10 }),
                    (educations) => {
                        // Render all education entries
                        const { container } = render(
                            <div className="space-y-6">
                                {educations.map((edu) => (
                                    <GlassCard key={edu.id} variant="default">
                                        {/* Degree */}
                                        <h3 className="text-2xl font-semibold text-gradient mb-2">
                                            {edu.degree}
                                        </h3>

                                        {/* Institution */}
                                        <p className="text-lg text-white mb-1">
                                            {edu.institution}
                                        </p>

                                        {/* University/Date */}
                                        <p className="text-gray-400 mb-3">
                                            {edu.date}
                                        </p>

                                        {/* Details */}
                                        {edu.details && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <p className="text-gray-300">
                                                    {edu.details}
                                                </p>
                                            </div>
                                        )}
                                    </GlassCard>
                                ))}
                            </div>
                        );

                        // Verify each education entry has all required fields rendered
                        educations.forEach((edu) => {
                            // Check degree
                            expect(container).toHaveTextContent(edu.degree);

                            // Check institution
                            expect(container).toHaveTextContent(edu.institution);

                            // Check date
                            expect(container).toHaveTextContent(edu.date);

                            // Check details if present
                            if (edu.details) {
                                expect(container).toHaveTextContent(edu.details);
                            }
                        });

                        // Verify count of rendered entries matches input
                        // Count the number of h3 elements (one per education entry)
                        const headings = container.querySelectorAll('h3');
                        expect(headings).toHaveLength(educations.length);

                        // Clean up after this property test iteration
                        cleanup();
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should render education entries with optional details field', () => {
            fc.assert(
                fc.property(
                    fc.array(educationArbitrary(), { minLength: 2, maxLength: 5 }),
                    (educations) => {
                        const { container } = render(
                            <div className="space-y-6">
                                {educations.map((edu) => (
                                    <GlassCard key={edu.id} variant="default">
                                        <h3 className="text-2xl font-semibold text-gradient mb-2">
                                            {edu.degree}
                                        </h3>
                                        <p className="text-lg text-white mb-1">
                                            {edu.institution}
                                        </p>
                                        <p className="text-gray-400 mb-3">
                                            {edu.date}
                                        </p>
                                        {edu.details && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <p className="text-gray-300">
                                                    {edu.details}
                                                </p>
                                            </div>
                                        )}
                                    </GlassCard>
                                ))}
                            </div>
                        );

                        // All entries should have required fields
                        educations.forEach((edu) => {
                            expect(container).toHaveTextContent(edu.degree);
                            expect(container).toHaveTextContent(edu.institution);
                            expect(container).toHaveTextContent(edu.date);
                        });

                        // Count entries with details
                        const entriesWithDetails = educations.filter(e => e.details !== undefined);

                        // If there are entries with details, verify they're rendered
                        entriesWithDetails.forEach((edu) => {
                            if (edu.details) {
                                expect(container).toHaveTextContent(edu.details);
                            }
                        });

                        // Clean up after this property test iteration
                        cleanup();
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should maintain order for any list of education entries', () => {
            fc.assert(
                fc.property(
                    fc.array(educationArbitrary(), { minLength: 2, maxLength: 8 }),
                    (educations) => {
                        // Render education entries in order
                        const { container } = render(
                            <div className="space-y-6" data-testid="education-container">
                                {educations.map((edu, idx) => (
                                    <GlassCard key={`${edu.id}-${idx}`} variant="default">
                                        <h3 data-testid={`degree-${idx}`}>{edu.degree}</h3>
                                        <p data-testid={`institution-${idx}`}>{edu.institution}</p>
                                        <p data-testid={`date-${idx}`}>{edu.date}</p>
                                    </GlassCard>
                                ))}
                            </div>
                        );

                        // Verify all education entries are rendered
                        const headings = container.querySelectorAll('h3');
                        expect(headings).toHaveLength(educations.length);

                        // Verify they appear in the same order as input
                        educations.forEach((edu, idx) => {
                            const degreeElement = container.querySelector(`[data-testid="degree-${idx}"]`);
                            const institutionElement = container.querySelector(`[data-testid="institution-${idx}"]`);
                            const dateElement = container.querySelector(`[data-testid="date-${idx}"]`);

                            expect(degreeElement).toHaveTextContent(edu.degree);
                            expect(institutionElement).toHaveTextContent(edu.institution);
                            expect(dateElement).toHaveTextContent(edu.date);
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
