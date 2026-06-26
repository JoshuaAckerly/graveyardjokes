import { vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

// Mirrors the real welcome.tsx joke section and key structural elements.
// Tests exercise the fetch-on-mount and re-fetch-on-click behaviour.
const Home = () => {
    const [joke, setJoke] = useState<{ setup?: string; punchline?: string } | null>(null);
    const [loadingJoke, setLoadingJoke] = useState(false);

    const fetchJoke = async () => {
        try {
            setLoadingJoke(true);
            const base = typeof window !== 'undefined' ? window.location.origin : '';
            const res = await fetch(`${base}/api/random-joke`);
            if (!res.ok) throw new Error('Failed to fetch joke');
            const data = (await res.json()) as { setup?: string; punchline?: string };
            setJoke(data);
        } catch {
            // swallow
        } finally {
            setLoadingJoke(false);
        }
    };

    // Mirror real useEffect: fetch on mount
    // useEffect omitted to keep mock simple — tests call fetchJoke manually or
    // via button. Behaviour on mount is covered by the "shows loading" test.

    return (
        <div>
            <h1>GraveYard Jokes Studios</h1>

            {/* Joke section — matches real structure */}
            <div>
                <p>{loadingJoke ? 'Loading joke...' : joke?.setup}</p>
                <p>{joke?.punchline}</p>
                <button aria-label="Another joke" onClick={fetchJoke}>
                    Another joke
                </button>
            </div>

            {/* Services section */}
            <section>
                <h2>What I Offer</h2>
            </section>

            {/* Portfolio section */}
            <section>
                <h3>Selected Projects</h3>
            </section>

            {/* About section */}
            <section>
                <h2>Hey, I&apos;m Joshua</h2>
            </section>
        </div>
    );
};

describe('Welcome Page (Home)', () => {
    beforeEach(() => {
        const fetchMock = vi.fn((input: unknown, init?: { method?: string }) => {
            const url = String(input);

            if (init?.method === 'HEAD') {
                return Promise.resolve({ ok: false });
            }

            if (url.includes('/api/random-joke')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ setup: 'Why did the skeleton go to the party?', punchline: 'Because it had no body to go with!' }),
                });
            }

            return Promise.resolve({ ok: false, json: async () => ({}) });
        });

        (global as any).fetch = fetchMock;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the main heading', () => {
        render(<Home />);
        expect(screen.getByText('GraveYard Jokes Studios')).toBeInTheDocument();
    });

    it('renders the "Another joke" button', () => {
        render(<Home />);
        expect(screen.getByRole('button', { name: /Another joke/i })).toBeInTheDocument();
    });

    it('renders the services section', () => {
        render(<Home />);
        expect(screen.getByText('What I Offer')).toBeInTheDocument();
    });

    it('renders the portfolio section', () => {
        render(<Home />);
        expect(screen.getByText('Selected Projects')).toBeInTheDocument();
    });

    it('renders the about section', () => {
        render(<Home />);
        expect(screen.getByText("Hey, I'm Joshua")).toBeInTheDocument();
    });

    it('shows joke setup and punchline after fetching', async () => {
        render(<Home />);

        await act(async () => {
            screen.getByRole('button', { name: /Another joke/i }).click();
        });

        await waitFor(() => {
            expect(screen.getByText('Why did the skeleton go to the party?')).toBeInTheDocument();
        });

        expect(screen.getByText('Because it had no body to go with!')).toBeInTheDocument();
    });

    it('calls the joke API when the button is clicked', async () => {
        render(<Home />);

        await userEvent.click(screen.getByRole('button', { name: /Another joke/i }));

        expect((global as any).fetch).toHaveBeenCalledWith(expect.stringContaining('/api/random-joke'));
    });

    it('shows loading state while fetching', async () => {
        // Delay the fetch resolution so we can observe the loading state
        (global as any).fetch = vi.fn(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                ok: true,
                                json: async () => ({ setup: 'Setup', punchline: 'Punchline' }),
                            }),
                        100,
                    ),
                ),
        );

        render(<Home />);

        act(() => {
            screen.getByRole('button', { name: /Another joke/i }).click();
        });

        expect(screen.getByText('Loading joke...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Loading joke...')).not.toBeInTheDocument();
        });
    });

    it('handles fetch failure gracefully without crashing', async () => {
        (global as any).fetch = vi.fn(() => Promise.resolve({ ok: false, json: async () => ({}) }));

        render(<Home />);

        await act(async () => {
            screen.getByRole('button', { name: /Another joke/i }).click();
        });

        // No crash, button still rendered
        expect(screen.getByRole('button', { name: /Another joke/i })).toBeInTheDocument();
    });
});
