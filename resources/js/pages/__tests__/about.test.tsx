import { render, screen } from '@testing-library/react';
import About from '../about';

// Mock Inertia
jest.mock('@inertiajs/react', () => ({
    Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
        h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
        h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock MainLayout
jest.mock('@/Layouts/MainLayout', () => {
    return function MainLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="main-layout">{children}</div>;
    };
});

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

describe('About Page', () => {
    it('renders main heading', () => {
        render(<About />);

        expect(screen.getByText('About the Creator')).toBeInTheDocument();
    });

    it('renders profile image', () => {
        render(<About />);

        const profileImage = screen.getByAltText("Joshua Ackerly's profile picture");
        expect(profileImage).toBeInTheDocument();
        expect(profileImage).toHaveAttribute('src', 'https://cdn.example.com/images/profileImage.webp');
    });

    it('renders bio section with Joshua Ackerly introduction', () => {
        render(<About />);

        expect(screen.getByText(/Hi! I'm/i)).toBeInTheDocument();
        expect(screen.getByText(/Joshua Ackerly/i)).toBeInTheDocument();
        expect(screen.getByText(/Laravel, React, and Tailwind CSS/i)).toBeInTheDocument();
    });

    it('renders resume download link', () => {
        render(<About />);

        const resumeLink = screen.getByRole('link', { name: /Download My Resume/i });
        expect(resumeLink).toBeInTheDocument();
        expect(resumeLink).toHaveAttribute('href', 'https://cdn.example.com/documents/Joshua.pdf');
        expect(resumeLink).toHaveAttribute('download');
    });

    it('renders contact CTA button', () => {
        render(<About />);

        const contactLink = screen.getByRole('link', { name: /Let's Work Together/i });
        expect(contactLink).toBeInTheDocument();
        expect(contactLink).toHaveAttribute('href', '/contact');
    });

    it('renders skills section heading', () => {
        render(<About />);

        expect(screen.getByText('Skills')).toBeInTheDocument();
    });

    it('renders all skills with correct names', () => {
        render(<About />);

        const expectedSkills = ['PHP', 'MySQL', 'JavaScript', 'HTML', 'Tailwind CSS', 'Design', 'React', 'Laravel'];

        expectedSkills.forEach((skill) => {
            expect(screen.getByText(skill)).toBeInTheDocument();
        });
    });

    it('renders story section heading', () => {
        render(<About />);

        expect(screen.getByText('The Story of GraveyardJokes Studios')).toBeInTheDocument();
    });

    it('renders story content with brand mentions', () => {
        render(<About />);

        expect(screen.getByText(/What started as a late-night idea/i)).toBeInTheDocument();
        expect(screen.getByText(/GraveyardJokes.com/i)).toBeInTheDocument();
        expect(screen.getByText(/GraveyardJokes Studios/i)).toBeInTheDocument();
    });

    it('renders hero banner image', () => {
        render(<About />);

        const bannerImage = screen.getByAltText('Abstract graveyard-themed banner');
        expect(bannerImage).toBeInTheDocument();
        expect(bannerImage).toHaveAttribute('src', 'https://cdn.example.com/images/aboutBanner.webp');
    });

    it('applies correct loading attribute to images', () => {
        render(<About />);

        const bannerImage = screen.getByAltText('Abstract graveyard-themed banner');
        const profileImage = screen.getByAltText("Joshua Ackerly's profile picture");

        expect(bannerImage).toHaveAttribute('loading', 'lazy');
        expect(profileImage).toHaveAttribute('loading', 'lazy');
    });

    it('renders with MainLayout wrapper', () => {
        render(<About />);

        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    it('renders skills with progress bars', () => {
        const { container } = render(<About />);

        // Check that there are colored progress bars
        const progressBars = container.querySelectorAll('[class*="bg-"]');
        expect(progressBars.length).toBeGreaterThan(0);
    });

    it('has proper semantic HTML structure', () => {
        const { container } = render(<About />);

        const main = container.querySelector('main');
        expect(main).toBeInTheDocument();

        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
    });
});
