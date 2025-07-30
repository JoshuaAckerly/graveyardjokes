import { render, screen } from '@testing-library/react';
import Menu from '../Menu';

// Mock Inertia Link
jest.mock('@inertiajs/react', () => ({
    Link: ({ href, children, className }: any) => (
        <a href={href} className={className}>
            {children}
        </a>
    ),
}));

describe('Menu', () => {
    it('renders all navigation links', () => {
        render(<Menu />);

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
        expect(screen.getByText('Portfolio')).toBeInTheDocument();
        expect(screen.getByText('Studio')).toBeInTheDocument();
    });

    it('has correct href attributes', () => {
        render(<Menu />);

        expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
        expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact');
        expect(screen.getByText('Portfolio').closest('a')).toHaveAttribute('href', '/portfolio');
        expect(screen.getByText('Studio').closest('a')).toHaveAttribute('href', 'https://studio.graveyardjokes.com');
    });

    it('applies hover styles to links', () => {
        render(<Menu />);

        const links = screen.getAllByRole('link');
        links.forEach((link) => {
            expect(link).toHaveClass('hover:underline');
        });
    });
});
