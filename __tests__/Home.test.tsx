/**
 * Smoke tests for the single-page portfolio (app/page.tsx).
 *
 * The site is a single scrollable page, so these tests check that the
 * hero content and every section landmark render, rather than asserting
 * on a dedicated Hero route (which no longer exists).
 */

import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';

describe('Home page', () => {
    test('renders the name as the top-level heading', () => {
        render(<Home />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading.textContent).toContain('Parth Parkhiya');
    });

    test('renders the professional title and tagline', () => {
        render(<Home />);
        expect(screen.getAllByText(/AI\/ML Engineer & LLM\/RAG Developer/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Building intelligent AI applications/i)).toBeInTheDocument();
    });

    test('renders hero call-to-action links', () => {
        render(<Home />);
        const heroSection = document.getElementById('home') as HTMLElement;
        expect(within(heroSection).getByRole('link', { name: /view projects/i })).toHaveAttribute('href', '#projects');
        expect(within(heroSection).getByRole('link', { name: /download resume/i })).toHaveAttribute('href', '#resume');
        expect(within(heroSection).getByRole('link', { name: /contact me/i })).toHaveAttribute('href', '#contact');
    });

    test('renders every section as an addressable anchor target', () => {
        render(<Home />);
        const sectionIds = [
            'home',
            'about',
            'skills',
            'projects',
            'experience',
            'education',
            'research',
            'resume',
            'contact',
        ];

        sectionIds.forEach((id) => {
            expect(document.getElementById(id)).not.toBeNull();
        });
    });

    test('renders a heading for each major section', () => {
        render(<Home />);
        const headingNames = [
            'About Me',
            'Skills & Technologies',
            'Projects',
            'Experience',
            'Education',
            'Research Interests',
            'Resume',
            'Get In Touch',
        ];

        headingNames.forEach((name) => {
            expect(screen.getByRole('heading', { name })).toBeInTheDocument();
        });
    });

    test('renders the project gallery with all project cards', () => {
        render(<Home />);
        expect(screen.getAllByText(/QueryBot/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/View Details/i).length).toBeGreaterThanOrEqual(5);
    });
});
