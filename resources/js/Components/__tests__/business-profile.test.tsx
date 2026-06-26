import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import GoogleReviews from '../GoogleReviews';
import BusinessHours from '../BusinessHours';
import BusinessPosts from '../BusinessPosts';

vi.mock('@gj/hooks', () => ({
    useFetchApi: vi.fn(),
}));

import { useFetchApi } from '@gj/hooks';
const mockUseFetchApi = vi.mocked(useFetchApi);

describe('GoogleReviews', () => {
    it('shows skeleton cards while loading', () => {
        mockUseFetchApi.mockReturnValue({ data: null, loading: true, error: false });
        const { container } = render(<GoogleReviews />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders nothing on error', () => {
        mockUseFetchApi.mockReturnValue({ data: null, loading: false, error: true });
        const { container } = render(<GoogleReviews />);
        expect(container.firstChild).toBeNull();
    });

    it('renders reviews when data loads', () => {
        mockUseFetchApi.mockReturnValue({
            data: {
                averageRating: 5,
                totalReviewCount: 1,
                reviews: [
                    {
                        reviewId: 'r1',
                        reviewer: { displayName: 'Jane Doe', profilePhotoUrl: null, isAnonymous: false },
                        starRating: 'FIVE' as const,
                        comment: 'Great service!',
                        createTime: '2024-01-01T00:00:00Z',
                        updateTime: '2024-01-01T00:00:00Z',
                    },
                ],
            },
            loading: false,
            error: false,
        });
        render(<GoogleReviews />);
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('Great service!')).toBeInTheDocument();
    });
});

describe('BusinessHours', () => {
    it('shows skeleton while loading', () => {
        mockUseFetchApi.mockReturnValue({ data: null, loading: true, error: false });
        const { container } = render(<BusinessHours />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders hours when data loads', () => {
        mockUseFetchApi.mockReturnValue({
            data: {
                name: 'GraveyardJokes Studios',
                regularHours: {
                    periods: [
                        { openDay: 'MONDAY', openTime: { hours: 9, minutes: 0 }, closeDay: 'MONDAY', closeTime: { hours: 17, minutes: 0 } },
                    ],
                },
            },
            loading: false,
            error: false,
        });
        render(<BusinessHours />);
        expect(screen.getByText('Monday')).toBeInTheDocument();
        expect(screen.getByText('9:00 AM – 5:00 PM')).toBeInTheDocument();
    });
});

describe('BusinessPosts', () => {
    it('shows skeleton cards while loading', () => {
        mockUseFetchApi.mockReturnValue({ data: null, loading: true, error: false });
        const { container } = render(<BusinessPosts />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders nothing when no posts', () => {
        mockUseFetchApi.mockReturnValue({ data: { localPosts: [] }, loading: false, error: false });
        const { container } = render(<BusinessPosts />);
        expect(container.firstChild).toBeNull();
    });

    it('renders posts when data loads', () => {
        mockUseFetchApi.mockReturnValue({
            data: {
                localPosts: [
                    {
                        name: 'accounts/123/locations/456/localPosts/789',
                        summary: 'Check out our latest work!',
                        topicType: 'STANDARD',
                        createTime: '2024-01-01T00:00:00Z',
                        updateTime: '2024-01-01T00:00:00Z',
                    },
                ],
            },
            loading: false,
            error: false,
        });
        render(<BusinessPosts />);
        expect(screen.getByText('Check out our latest work!')).toBeInTheDocument();
    });
});
