import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Carousel from '../carousel';

// Mock import.meta.env
Object.defineProperty(global, 'import', {
    value: {
        meta: {
            env: {
                VITE_ASSET_URL: 'https://cdn.example.com',
            },
        },
    },
    writable: true,
});

describe('Carousel', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('renders carousel with all slides', () => {
        render(<Carousel />);

        expect(screen.getByText('Follow us on Instagram')).toBeInTheDocument();
        expect(screen.getByText("Let's build your site")).toBeInTheDocument();
        expect(screen.getByText('Fast launches available')).toBeInTheDocument();
    });

    it('renders images for all slides', () => {
        render(<Carousel />);

        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(3);
        
        expect(images[0]).toHaveAttribute('alt', 'Follow us on Instagram');
        expect(images[0]).toHaveAttribute('src', 'https://cdn.example.com/images/AdobeStock_283463385.webp');
    });

    it('renders navigation buttons', () => {
        render(<Carousel />);

        const buttons = screen.getAllByRole('button');
        const navButtons = buttons.filter(btn => btn.textContent === '❮' || btn.textContent === '❯');
        
        expect(navButtons).toHaveLength(2);
    });

    it('renders slide indicators', () => {
        render(<Carousel />);

        const indicators = screen.getAllByRole('button').filter(btn => 
            btn.className.includes('h-3 w-3 rounded-full')
        );
        
        expect(indicators).toHaveLength(3);
    });

    it('shows first slide initially', () => {
        render(<Carousel />);

        const indicators = screen.getAllByRole('button').filter(btn => 
            btn.className.includes('h-3 w-3 rounded-full')
        );
        
        expect(indicators[0]).toHaveClass('bg-white');
        expect(indicators[1]).toHaveClass('bg-gray-600');
        expect(indicators[2]).toHaveClass('bg-gray-600');
    });

    it('advances to next slide when next button is clicked', async () => {
        const user = userEvent.setup({ delay: null });
        render(<Carousel />);

        const nextButton = screen.getAllByRole('button').find(btn => btn.textContent === '❯');
        await user.click(nextButton!);

        const indicators = screen.getAllByRole('button').filter(btn => 
            btn.className.includes('h-3 w-3 rounded-full')
        );
        
        expect(indicators[0]).toHaveClass('bg-gray-600');
        expect(indicators[1]).toHaveClass('bg-white');
    });

    it('goes to previous slide when previous button is clicked', async () => {
        const user = userEvent.setup({ delay: null });
        render(<Carousel />);

        const prevButton = screen.getAllByRole('button').find(btn => btn.textContent === '❮');
        await user.click(prevButton!);

        // Should wrap around to last slide
        const indicators = screen.getAllByRole('button').filter(btn => 
            btn.className.includes('h-3 w-3 rounded-full')
        );
        
        expect(indicators[2]).toHaveClass('bg-white');
    });

    it('jumps to specific slide when indicator is clicked', async () => {
        const user = userEvent.setup({ delay: null });
        render(<Carousel />);

        const indicators = screen.getAllByRole('button').filter(btn => 
            btn.className.includes('h-3 w-3 rounded-full')
        );
        
        await user.click(indicators[2]);
        
        expect(indicators[2]).toHaveClass('bg-white');
        expect(indicators[0]).toHaveClass('bg-gray-600');
    });

    it('auto-advances slides every 5 seconds', async () => {
        render(<Carousel />);

        const indicators = screen.getAllByRole('button').filter(btn => 
            btn.className.includes('h-3 w-3 rounded-full')
        );
        
        // Initially on first slide
        expect(indicators[0]).toHaveClass('bg-white');

        // Advance 5 seconds
        jest.advanceTimersByTime(5000);

        await waitFor(() => {
            const updatedIndicators = screen.getAllByRole('button').filter(btn => 
                btn.className.includes('h-3 w-3 rounded-full')
            );
            expect(updatedIndicators[1]).toHaveClass('bg-white');
        });
    });

    it('wraps around to first slide after last slide', async () => {
        render(<Carousel />);

        // Advance through all slides
        jest.advanceTimersByTime(5000); // Slide 2
        jest.advanceTimersByTime(5000); // Slide 3
        jest.advanceTimersByTime(5000); // Back to slide 1

        await waitFor(() => {
            const indicators = screen.getAllByRole('button').filter(btn => 
                btn.className.includes('h-3 w-3 rounded-full')
            );
            expect(indicators[0]).toHaveClass('bg-white');
        });
    });

    it('renders links for slides', () => {
        render(<Carousel />);

        const links = screen.getAllByText('View Project');
        expect(links).toHaveLength(3);
        
        expect(links[0].closest('a')).toHaveAttribute('href', 'https://instagram.com/graveyardjokes');
        expect(links[1].closest('a')).toHaveAttribute('href', '/contact');
        expect(links[2].closest('a')).toHaveAttribute('href', '/portfolio');
    });

    it('opens external links in new tab', () => {
        render(<Carousel />);

        const externalLink = screen.getAllByText('View Project')[0].closest('a');
        expect(externalLink).toHaveAttribute('target', '_blank');
        expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('applies correct transform style based on current index', () => {
        const { container } = render(<Carousel />);

        const slider = container.querySelector('.flex.transition-transform');
        expect(slider).toHaveStyle({ transform: 'translateX(-0%)' });
    });

    it('uses lazy loading for images', () => {
        render(<Carousel />);

        const images = screen.getAllByRole('img');
        images.forEach(img => {
            expect(img).toHaveAttribute('loading', 'lazy');
        });
    });

    it('renders slide descriptions', () => {
        render(<Carousel />);

        expect(screen.getByText(/Stay in the loop/)).toBeInTheDocument();
        expect(screen.getByText(/Ready to start/)).toBeInTheDocument();
        expect(screen.getByText(/Need a simple promo page/)).toBeInTheDocument();
    });

    it('cleans up interval on unmount', () => {
        const { unmount } = render(<Carousel />);
        
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
        
        unmount();
        
        expect(clearIntervalSpy).toHaveBeenCalled();
        
        clearIntervalSpy.mockRestore();
    });
});
