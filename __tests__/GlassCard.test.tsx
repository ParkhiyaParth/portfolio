import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlassCard from '@/components/GlassCard';

describe('GlassCard', () => {
    test('default variant renders a plain static card with no tilt wiring', () => {
        const { container } = render(<GlassCard variant="default">Content</GlassCard>);
        const card = container.querySelector('.glass-card');
        expect(card).toBeInTheDocument();
        expect(card?.tagName).toBe('DIV');
        // No glow overlay is rendered for static cards
        expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
    });

    test('hover variant renders the tilt wrapper and a decorative glow layer', () => {
        const { container } = render(<GlassCard variant="hover">Content</GlassCard>);
        const card = container.querySelector('.glass-card-hover');
        expect(card).toBeInTheDocument();
        expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });

    test('hover variant does not crash on mouse move or mouse leave', () => {
        const { container } = render(<GlassCard variant="hover">Content</GlassCard>);
        const card = container.querySelector('.glass-card-hover') as HTMLElement;

        expect(() => {
            fireEvent.mouseMove(card, { clientX: 40, clientY: 20 });
            fireEvent.mouseLeave(card);
        }).not.toThrow();
    });

    test('interactive variant keeps the pointer cursor class alongside the tilt wrapper', () => {
        const { container } = render(<GlassCard variant="interactive">Content</GlassCard>);
        const card = container.querySelector('.glass-card-hover');
        expect(card).toHaveClass('cursor-pointer');
    });
});
