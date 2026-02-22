import { render, screen, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import Home from '../welcome';

jest.mock('@/Components/ProjectCard', () => {
    return function MockProjectCard({ title }: { title: string }) {
        return <div data-testid="project-card">{title}</div>;
    };
});

Object.defineProperty(global, 'import', {
    value: {
        meta: {
            env: {
                VITE_ASSET_URL: 'https://cdn.example.com',
            },
        },
    },
});

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

        await waitFor(() => {
            expect((global as any).fetch).toHaveBeenCalledWith(expect.stringContaining('/api/random-joke'));
        });
    });

    it('renders portfolio showcase section', async () => {
        render(<Home />);

        expect(screen.getByText('Selected Projects')).toBeInTheDocument();

        await waitFor(() => {
            expect((global as any).fetch).toHaveBeenCalledWith(expect.stringContaining('/api/random-joke'));
        });
    });

    it('fetches a random joke on mount', async () => {
        render(<Home />);

        await waitFor(() => {
            expect((global as any).fetch).toHaveBeenCalledWith(expect.stringContaining('/api/random-joke'));
        });
    });
});
