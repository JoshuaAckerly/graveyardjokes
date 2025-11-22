import { render, screen } from '@testing-library/react';
import Portfolio from '../portfolio';

// Mock Inertia
jest.mock('@inertiajs/react', () => ({
    Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock MainLayout
jest.mock('@/Layouts/MainLayout', () => {
    return function MainLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="main-layout">{children}</div>;
    };
});

// Mock ProjectCard
jest.mock('@/Components/ProjectCard', () => {
    return function ProjectCard({ title, description, url }: { title: string; description: string; url: string }) {
        return (
            <div data-testid="project-card">
                <h4>{title}</h4>
                <p>{description}</p>
                <a href={url}>{url}</a>
            </div>
        );
    };
});

// Mock portfolio items
jest.mock('@/data/portfolioItems', () => [
    { title: 'Project Alpha', description: 'First project description', url: 'https://alpha.example.com' },
    { title: 'Project Beta', description: 'Second project description', url: 'https://beta.example.com' },
    { title: 'Project Gamma', description: 'Third project description', url: 'https://gamma.example.com' },
]);

// Mock import.meta.env
Object.defineProperty(global, 'import', {
    value: {
        meta: {
            env: {
                VITE_ASSET_URL: 'https://cdn.example.com',
            },
        },
    },
});

describe('Portfolio Page', () => {
    it('renders main heading', () => {
        render(<Portfolio />);

        expect(screen.getByRole('heading', { name: 'Portfolio' })).toBeInTheDocument();
    });

    it('renders intro paragraph', () => {
        render(<Portfolio />);

        expect(screen.getByText(/Welcome to my portfolio!/i)).toBeInTheDocument();
        expect(screen.getByText(/explore my projects that showcase my skills/i)).toBeInTheDocument();
    });

    it('renders closing paragraph', () => {
        render(<Portfolio />);

        expect(screen.getByText(/Feel free to explore these projects/i)).toBeInTheDocument();
    });

    it('renders all project cards', () => {
        render(<Portfolio />);

        const projectCards = screen.getAllByTestId('project-card');
        expect(projectCards).toHaveLength(3);
    });

    it('renders project titles', () => {
        render(<Portfolio />);

        expect(screen.getByText('Project Alpha')).toBeInTheDocument();
        expect(screen.getByText('Project Beta')).toBeInTheDocument();
        expect(screen.getByText('Project Gamma')).toBeInTheDocument();
    });

    it('renders project descriptions', () => {
        render(<Portfolio />);

        expect(screen.getByText('First project description')).toBeInTheDocument();
        expect(screen.getByText('Second project description')).toBeInTheDocument();
        expect(screen.getByText('Third project description')).toBeInTheDocument();
    });

    it('renders project URLs', () => {
        render(<Portfolio />);

        expect(screen.getByText('https://alpha.example.com')).toBeInTheDocument();
        expect(screen.getByText('https://beta.example.com')).toBeInTheDocument();
        expect(screen.getByText('https://gamma.example.com')).toBeInTheDocument();
    });

    it('renders with MainLayout wrapper', () => {
        render(<Portfolio />);

        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    it('uses semantic HTML list structure', () => {
        const { container } = render(<Portfolio />);

        const list = container.querySelector('ul');
        expect(list).toBeInTheDocument();

        const listItems = container.querySelectorAll('li');
        expect(listItems).toHaveLength(3);
    });

    it('has proper heading hierarchy', () => {
        render(<Portfolio />);

        const mainHeading = screen.getByRole('heading', { name: 'Portfolio' });
        expect(mainHeading.tagName).toBe('H1');
    });

    it('applies correct CSS classes to section', () => {
        const { container } = render(<Portfolio />);

        const section = container.querySelector('section');
        expect(section).toHaveClass('relative', 'z-0', 'flex', 'flex-col');
    });

    it('renders projects in a grid layout', () => {
        const { container } = render(<Portfolio />);

        const grid = container.querySelector('.grid');
        expect(grid).toBeInTheDocument();
        expect(grid).toHaveClass('grid-cols-1');
    });
});
