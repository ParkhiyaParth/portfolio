import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackToTop from '@/components/BackToTop';

describe('BackToTop', () => {
    test('is not rendered while near the top of the page', () => {
        render(<BackToTop />);
        expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument();
    });
});
