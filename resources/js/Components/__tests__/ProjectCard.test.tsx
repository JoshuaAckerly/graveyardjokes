import { render, screen, waitFor } from '@testing-library/react';
import ProjectCard from '../ProjectCard';

global.fetch = jest.fn();

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe('ProjectCard', () => {
    const defaultProps = {
        title: 'Test Project',
        description: 'Test description',
        url: 'https://example.com',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (fetch as jest.Mock).mockClear();
        localStorageMock.getItem.mockReturnValue(null);
    });

    it('renders project card with title and description', () => {
        render(<ProjectCard {...defaultProps} />);

        expect(screen.getByText('Test Project')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('renders link with correct attributes', () => {
        render(<ProjectCard {...defaultProps} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'https://example.com');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('uses cached image from localStorage', () => {
        const cachedUrl = '/cached-image.jpg';
        localStorageMock.getItem.mockReturnValue(cachedUrl);

        render(<ProjectCard {...defaultProps} />);

        const img = screen.getByAltText('Test Project');
        expect(img).toHaveAttribute('src', cachedUrl);
    });

    it('falls back to default image when API fails', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: false }).mockRejectedValueOnce(new Error('API error'));

        render(<ProjectCard {...defaultProps} />);

        await waitFor(() => {
            const img = screen.getByAltText('Test Project');
            expect(img).toHaveAttribute('src', '/images/AdobeStock_471779082.webp');
        });
    });

    it('uses CDN fallback when provided', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: false }).mockRejectedValueOnce(new Error('API error'));

        render(<ProjectCard {...defaultProps} cdn="https://cdn.example.com" />);

        await waitFor(() => {
            const img = screen.getByAltText('Test Project');
            expect(img).toHaveAttribute('src', 'https://cdn.example.com/images/portfolio-placeholder.webp');
        });
    });
});
