import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScrollProgress from '@/components/ScrollProgress';

describe('ScrollProgress', () => {
    test('renders an accessible progress indicator fixed to the top of the page', () => {
        render(<ScrollProgress />);
        const bar = screen.getByRole('progressbar', { name: /page scroll progress/i });
        expect(bar).toBeInTheDocument();
        expect(bar).toHaveClass('fixed', 'top-0');
    });
});
