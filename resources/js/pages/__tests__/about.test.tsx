import { render, screen } from '@testing-library/react';
import About from '../about';

// MainLayout runs browser-only effects (Lenis, visit tracking); jsdom-safe stubs.
beforeEach(() => {
    (global as any).fetch = vi.fn().mockImplementation(() => Promise.resolve({ ok: true, json: async () => ({}) }));
});

describe('About Page', () => {
    it('renders the music project heading', () => {
        render(<About />);
        expect(screen.getByRole('heading', { name: 'Graveyard Jokes' })).toBeInTheDocument();
    });

    it('describes the songwriting project', () => {
        render(<About />);
        expect(screen.getByText(/two people writing songs together/i)).toBeInTheDocument();
    });

    it('links to the Links and Contact pages', () => {
        render(<About />);
        expect(screen.getByRole('link', { name: /Where to find us/i })).toHaveAttribute('href', '/links');
        expect(screen.getByRole('link', { name: /Say hello/i })).toHaveAttribute('href', '/contact');
    });

    it('has no web-development or agency content', () => {
        render(<About />);
        expect(screen.queryByText(/web develop|resume|founder|agency|services/i)).not.toBeInTheDocument();
    });
});
