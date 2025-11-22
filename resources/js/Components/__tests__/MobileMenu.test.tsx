import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileMenu from '../MobileMenu';

// Mock Inertia Link
jest.mock('@inertiajs/react', () => ({
    Link: ({ href, children, className, onClick }: any) => (
        <a href={href} className={className} onClick={onClick}>
            {children}
        </a>
    ),
}));

describe('MobileMenu', () => {
    it('renders hamburger button', () => {
        render(<MobileMenu />);

        const button = screen.getByLabelText('Toggle Menu');
        expect(button).toBeInTheDocument();
    });

    it('menu is initially closed', () => {
        render(<MobileMenu />);

        expect(screen.queryByText('Home')).not.toBeInTheDocument();
        expect(screen.queryByText('About')).not.toBeInTheDocument();
    });

    it('opens menu when hamburger is clicked', async () => {
        const user = userEvent.setup();
        render(<MobileMenu />);

        const button = screen.getByLabelText('Toggle Menu');
        await user.click(button);

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
        expect(screen.getByText('Portfolio')).toBeInTheDocument();
        expect(screen.getByText('Studio')).toBeInTheDocument();
    });

    it('closes menu when hamburger is clicked again', async () => {
        const user = userEvent.setup();
        render(<MobileMenu />);

        const button = screen.getByLabelText('Toggle Menu');
        
        // Open menu
        await user.click(button);
        expect(screen.getByText('Home')).toBeInTheDocument();
        
        // Close menu
        await user.click(button);
        expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('closes menu when backdrop is clicked', async () => {
        const user = userEvent.setup();
        render(<MobileMenu />);

        // Open menu
        const button = screen.getByLabelText('Toggle Menu');
        await user.click(button);
        expect(screen.getByText('Home')).toBeInTheDocument();

        // Click backdrop
        const backdrop = document.querySelector('.fixed.inset-0.z-20');
        if (backdrop) {
            await user.click(backdrop as Element);
            expect(screen.queryByText('Home')).not.toBeInTheDocument();
        }
    });

    it('has correct navigation links', async () => {
        const user = userEvent.setup();
        render(<MobileMenu />);

        const button = screen.getByLabelText('Toggle Menu');
        await user.click(button);

        expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
        expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
        expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact');
        expect(screen.getByText('Portfolio').closest('a')).toHaveAttribute('href', '/portfolio');
        expect(screen.getByText('Studio').closest('a')).toHaveAttribute('href', 'https://studio.graveyardjokes.com');
    });

    it('updates aria-expanded attribute', async () => {
        const user = userEvent.setup();
        render(<MobileMenu />);

        const button = screen.getByLabelText('Toggle Menu');
        
        // Initially closed
        expect(button).toHaveAttribute('aria-expanded', 'false');
        
        // After opening
        await user.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'true');
        
        // After closing
        await user.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('applies correct CSS classes to hamburger icon', async () => {
        const user = userEvent.setup();
        render(<MobileMenu />);

        const button = screen.getByLabelText('Toggle Menu');
        
        // Check initial state (closed)
        const spans = button.querySelectorAll('span');
        expect(spans).toHaveLength(3);
        
        // Open menu
        await user.click(button);
        
        // Check transformed state
        expect(spans[0]).toHaveClass('translate-y-3', 'rotate-45');
        expect(spans[1]).toHaveClass('opacity-0');
        expect(spans[2]).toHaveClass('-translate-y-3', '-rotate-45');
    });

    it('closes menu when a navigation link is clicked', async () => {
        const user = userEvent.setup();
        render(<MobileMenu />);

        const button = screen.getByLabelText('Toggle Menu');
        await user.click(button);

        const homeLink = screen.getByText('Home');
        await user.click(homeLink);

        expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });
});
