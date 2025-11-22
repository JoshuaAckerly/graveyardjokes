import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../welcome';

// Mock Inertia
const mockVisit = jest.fn();
jest.mock('@inertiajs/react', () => ({
    Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    router: {
        visit: mockVisit,
    },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
        img: ({ ...props }: any) => <img {...props} />,
    },
}));

// Mock MainLayout
jest.mock('@/Layouts/MainLayout', () => {
    return function MainLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="main-layout">{children}</div>;
    };
});

// Mock ApplicationLogo
jest.mock('@/Components/applicationLogo', () => {
    return function ApplicationLogo() {
        return <img alt="GraveYardJokes Studios Logo" />;
    };
});

// Mock Carousel
jest.mock('@/Components/carousel', () => {
    return function Carousel() {
        return <div data-testid="carousel">Carousel Component</div>;
    };
});

// Mock ProjectCard
jest.mock('@/Components/ProjectCard', () => {
    return function ProjectCard({ title, description }: { title: string; description: string }) {
        return (
            <div data-testid="project-card">
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
        );
    };
});

// Mock portfolio items
jest.mock('@/data/portfolioItems', () => [
    { title: 'Project 1', description: 'Description 1', url: 'https://example1.com' },
    { title: 'Project 2', description: 'Description 2', url: 'https://example2.com' },
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

// Mock fetch
global.fetch = jest.fn();

describe('Welcome Page (Home)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ id: 1, body: 'Test joke', author: 'Test Author' }),
        });
    });

    it('renders main heading', () => {
        render(<Home />);

        expect(screen.getByText(/GraveYard Jokes/i)).toBeInTheDocument();
        expect(screen.getByText(/Studios/i)).toBeInTheDocument();
    });

    it('renders tagline text', () => {
        render(<Home />);

        expect(screen.getByText(/Custom websites for musicians, artists, and creatives/i)).toBeInTheDocument();
    });

    it('renders ApplicationLogo component', () => {
        render(<Home />);

        expect(screen.getByAltText('GraveYardJokes Studios Logo')).toBeInTheDocument();
    });

    it('renders Carousel component', () => {
        render(<Home />);

        expect(screen.getByTestId('carousel')).toBeInTheDocument();
    });

    it('renders contact button and navigates on click', async () => {
        const user = userEvent.setup();
        render(<Home />);

        const contactButton = screen.getByRole('button', { name: /Let's talk/i });
        expect(contactButton).toBeInTheDocument();

        await user.click(contactButton);

        expect(mockVisit).toHaveBeenCalledWith('/contact');
    });

    it('fetches and displays a joke on mount', async () => {
        render(<Home />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/random-joke'));
        });

        await waitFor(() => {
            expect(screen.getByText('Test joke')).toBeInTheDocument();
            expect(screen.getByText('Test Author')).toBeInTheDocument();
        });
    });

    it('displays loading state while fetching joke', () => {
        (global.fetch as jest.Mock).mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                ok: true,
                                json: async () => ({ body: 'Delayed joke', author: 'Author' }),
                            }),
                        100,
                    ),
                ),
        );

        render(<Home />);

        expect(screen.getByText('Loading joke...')).toBeInTheDocument();
    });

    it('fetches another joke when button clicked', async () => {
        const user = userEvent.setup();
        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText('Test joke')).toBeInTheDocument();
        });

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 2, body: 'Second joke', author: 'Another Author' }),
        });

        const anotherJokeButton = screen.getByRole('button', { name: /Another joke/i });
        await user.click(anotherJokeButton);

        await waitFor(() => {
            expect(screen.getByText('Second joke')).toBeInTheDocument();
            expect(screen.getByText('Another Author')).toBeInTheDocument();
        });
    });

    it('handles joke fetch error gracefully', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

        render(<Home />);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        consoleErrorSpy.mockRestore();
    });

    it('renders Noteleks promo section', () => {
        render(<Home />);

        expect(screen.getByText(/Noteleks · Studio Promo/i)).toBeInTheDocument();
        expect(screen.getByText(/I teamed up with Noteleks Studio/i)).toBeInTheDocument();
    });

    it('renders Noteleks links with correct hrefs', () => {
        render(<Home />);

        const noteleksGameLink = screen.getByRole('link', { name: /See The Noteleks Game/i });
        expect(noteleksGameLink).toHaveAttribute('href', 'https://studio.graveyardjokes.com/noteleks');

        const studioLink = screen.getByRole('link', { name: /Visit Studio/i });
        expect(studioLink).toHaveAttribute('href', 'https://studio.graveyardjokes.com');
        expect(studioLink).toHaveAttribute('target', '_blank');
        expect(studioLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders portfolio showcase section', () => {
        render(<Home />);

        expect(screen.getByText('Selected Projects')).toBeInTheDocument();
        expect(screen.getAllByTestId('project-card')).toHaveLength(2);
    });

    it('renders portfolio link', () => {
        render(<Home />);

        const portfolioLink = screen.getByRole('link', { name: /View full portfolio/i });
        expect(portfolioLink).toBeInTheDocument();
        expect(portfolioLink).toHaveAttribute('href', '/portfolio');
    });

    it('renders background images with CDN URLs', () => {
        render(<Home />);

        const images = screen.getAllByRole('img');
        const overlayImage = images.find((img) => img.getAttribute('alt') === 'Overlay Image');
        const footerImage = images.find((img) => img.getAttribute('alt') === 'Footer Image');

        expect(overlayImage).toHaveAttribute('src', 'https://cdn.example.com/images/AdobeStock_327183052.webp');
        expect(footerImage).toHaveAttribute('src', 'https://cdn.example.com/images/AdobeStock_471779082.webp');
    });

    it('has proper accessibility attributes', () => {
        render(<Home />);

        const contactButton = screen.getByRole('button', { name: /Contact Us/i });
        expect(contactButton).toHaveAttribute('aria-label', 'Contact Us');

        const anotherJokeButton = screen.getByRole('button', { name: /Another joke/i });
        expect(anotherJokeButton).toHaveAttribute('aria-label', 'Another joke');

        const skipLink = screen.getByRole('link', { name: /Home Page/i });
        expect(skipLink).toHaveClass('sr-only');
    });
});
