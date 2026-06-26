import { vi, type MockedFunction } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ProjectCard from '../ProjectCard';

const fetchMock = vi.fn() as MockedFunction<typeof fetch>;
global.fetch = fetchMock;

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

describe('ProjectCard', () => {
    const defaultProps = {
        title: 'Test Project',
        description: 'Test description',
        url: 'https://example.com',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        fetchMock.mockClear();
        fetchMock.mockRejectedValue(new Error('API error'));
        localStorageMock.getItem.mockReturnValue(null);
    });

    it('renders project card with title and description', async () => {
        render(<ProjectCard {...defaultProps} />);

        expect(screen.getByText('Test Project')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();

        await waitFor(() => {
            const img = screen.getByAltText('Test Project');
            expect(img).toHaveAttribute('src', '/images/AdobeStock_471779082.webp');
        });
    });

    it('renders link with correct attributes', async () => {
        render(<ProjectCard {...defaultProps} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'https://example.com');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');

        await waitFor(() => {
            const img = screen.getByAltText('Test Project');
            expect(img).toHaveAttribute('src', '/images/AdobeStock_471779082.webp');
        });
    });

    it('uses cached image from localStorage', async () => {
        const cachedUrl = '/cached-image.jpg';
        localStorageMock.getItem.mockReturnValue(cachedUrl);

        render(<ProjectCard {...defaultProps} />);

        await waitFor(() => {
            const img = screen.getByAltText('Test Project');
            expect(img).toHaveAttribute('src', cachedUrl);
        });
    });

    it('falls back to default image when API fails', async () => {
        fetchMock.mockResolvedValueOnce({ ok: false } as Response).mockRejectedValueOnce(new Error('API error'));

        render(<ProjectCard {...defaultProps} />);

        await waitFor(() => {
            const img = screen.getByAltText('Test Project');
            expect(img).toHaveAttribute('src', '/images/AdobeStock_471779082.webp');
        });
    });

    it('uses CDN fallback when provided', async () => {
        fetchMock.mockResolvedValueOnce({ ok: false } as Response).mockRejectedValueOnce(new Error('API error'));

        render(<ProjectCard {...defaultProps} cdn="https://cdn.example.com" />);

        await waitFor(() => {
            const img = screen.getByAltText('Test Project');
            expect(img).toHaveAttribute('src', 'https://cdn.example.com/images/portfolio-placeholder.webp');
        });
    });
});
