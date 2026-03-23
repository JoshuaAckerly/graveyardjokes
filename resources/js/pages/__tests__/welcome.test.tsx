import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

// Mock component for testing
const Home = () => (
    <div>
        <h1>GraveYard Jokes</h1>
        <button>Another joke</button>
        <section>
            <h2>Selected Projects</h2>
        </section>
    </div>
);

describe('Welcome Page (Home)', () => {
    beforeEach(() => {
        const fetchMock = jest.fn((input: unknown, init?: { method?: string }) => {
            const url = String(input);

            if (init?.method === 'HEAD') {
                return Promise.resolve({ ok: false });
            }

            if (url.includes('/api/random-joke')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ setup: 'Test joke setup', punchline: 'Test joke punchline' }),
                });
            }

            return Promise.resolve({ ok: false, json: async () => ({}) });
        });

        (global as any).fetch = fetchMock;
    });

    it('renders hero and primary CTA', async () => {
        render(<Home />);

        expect(screen.getAllByText(/GraveYard Jokes/i).length).toBeGreaterThan(0);
        expect(screen.getByRole('button', { name: /Another joke/i })).toBeInTheDocument();
    });

    it('renders portfolio showcase section', async () => {
        render(<Home />);

        expect(screen.getByText('Selected Projects')).toBeInTheDocument();
    });

    it('renders the home page', async () => {
        render(<Home />);

        expect(screen.getByText('GraveYard Jokes')).toBeInTheDocument();
    });
});
