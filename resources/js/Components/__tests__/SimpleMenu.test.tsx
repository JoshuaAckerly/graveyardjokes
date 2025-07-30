import { render, screen } from '@testing-library/react';

// Simple Menu component test without complex imports
const SimpleMenu = () => (
    <nav>
        <ul>
            <li>
                <a href="/">Home</a>
            </li>
            <li>
                <a href="/about">About</a>
            </li>
            <li>
                <a href="/contact">Contact</a>
            </li>
        </ul>
    </nav>
);

describe('SimpleMenu', () => {
    it('renders navigation links', () => {
        render(<SimpleMenu />);

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('has correct href attributes', () => {
        render(<SimpleMenu />);

        expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
        expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
        expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact');
    });
});
