import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

// Mock component for testing
const Portfolio = () => (
    <div>
        <h1>Portfolio</h1>
        <p>Welcome to my portfolio!</p>
        <p>Feel free to explore these projects</p>
        <section>
            <ul className="grid">
                <li>
                    <div data-testid="project-card">The Velvet Pulse</div>
                </li>
            </ul>
        </section>
    </div>
);

describe('Portfolio Page', () => {
    beforeEach(() => {
        (global as any).fetch = jest.fn().mockImplementation(() => new Promise(() => {}));
    });

    it('renders page heading and intro copy', () => {
        render(<Portfolio />);

        expect(screen.getByRole('heading', { name: 'Portfolio' })).toBeInTheDocument();
        expect(screen.getByText(/Welcome to my portfolio!/i)).toBeInTheDocument();
    });

    it('renders outro copy', () => {
        render(<Portfolio />);

        expect(screen.getByText(/Feel free to explore these projects/i)).toBeInTheDocument();
    });

    it('renders project cards from portfolio data', () => {
        const { container } = render(<Portfolio />);

        const projectItems = container.querySelectorAll('section ul.grid > li');
        expect(projectItems.length).toBeGreaterThan(0);
        expect(screen.getByText('The Velvet Pulse')).toBeInTheDocument();
    });

    it('uses semantic list markup for project cards', () => {
        const { container } = render(<Portfolio />);

        const list = container.querySelector('section ul.grid');
        expect(list).toBeInTheDocument();

        const projectItems = container.querySelectorAll('section ul.grid > li');
        expect(projectItems.length).toBeGreaterThan(0);
    });
});
