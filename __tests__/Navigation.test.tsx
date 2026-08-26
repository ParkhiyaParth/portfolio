import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '@/components/Navigation';

const SECTIONS = [
    ['Home', '#home'],
    ['About', '#about'],
    ['Skills', '#skills'],
    ['Projects', '#projects'],
    ['GitHub', '#github'],
    ['Experience', '#experience'],
    ['Education', '#education'],
    ['Research', '#research'],
    ['Resume', '#resume'],
    ['Contact', '#contact'],
] as const;

describe('Navigation', () => {
    afterEach(() => cleanup());

    test('renders a link to every section as an in-page anchor', () => {
        render(<Navigation />);
        SECTIONS.forEach(([label, href]) => {
            // Each label appears twice (desktop + mobile menu markup)
            const links = screen.getAllByRole('link', { name: label });
            expect(links.length).toBeGreaterThan(0);
            links.forEach((link) => expect(link).toHaveAttribute('href', href));
        });
    });

    test('mobile menu toggle button is hidden by default and opens on click', () => {
        render(<Navigation />);
        const toggle = screen.getByRole('button', { name: /toggle navigation menu/i });
        expect(toggle).toHaveAttribute('aria-expanded', 'false');

        fireEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });

    test('mobile menu closes on Escape key press', () => {
        render(<Navigation />);
        const toggle = screen.getByRole('button', { name: /toggle navigation menu/i });

        fireEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    test('nav element exposes an accessible label', () => {
        render(<Navigation />);
        expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    });

    test('marks the active section link with aria-current and a sliding indicator', () => {
        // No section elements exist in this isolated render, so the scroll-spy
        // falls back to its initial 'home' state.
        render(<Navigation />);
        const activeLink = screen.getAllByRole('link', { name: 'Home' }).find(
            (link) => link.getAttribute('aria-current') === 'page'
        );
        expect(activeLink).toBeDefined();
        expect(activeLink?.querySelector('[class*="absolute"]')).toBeInTheDocument();

        const inactiveLink = screen.getAllByRole('link', { name: 'About' }).find(
            (link) => link.getAttribute('href') === '#about'
        );
        expect(inactiveLink).not.toHaveAttribute('aria-current');
    });
});
