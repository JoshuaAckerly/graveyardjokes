import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/studio/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus('success');
                setMessage("You're subscribed — check your inbox for a welcome email.");
                setEmail('');
            } else {
                const data = await res.json().catch(() => ({}));
                setStatus('error');
                setMessage((data as { message?: string }).message ?? 'Something went wrong. Please try again.');
            }
        } catch {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
            <h3 className="mb-1 font-serif text-lg font-semibold text-white">Stay in the loop</h3>
            <p className="mb-4 text-sm text-white/60">Get an email when a new post goes up. No spam — just new posts.</p>

            {status === 'success' ? (
                <p className="text-sm font-medium text-[var(--primary)]">{message}</p>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading'}
                        className="flex-1 rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/40 focus:outline-none disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
                    </button>
                </form>
            )}

            {status === 'error' && <p className="mt-2 text-sm text-red-400">{message}</p>}
        </div>
    );
}
