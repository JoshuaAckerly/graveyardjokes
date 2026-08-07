import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getAuthSystemUrl, getLoginUrl } from '../env';

const STORAGE_KEY = 'gj_guest_prompt_dismissed';
const DELAY_MS = 15_000;

// Suppress on pages where the prompt would be intrusive or redundant
const SUPPRESSED_PATH_PREFIXES = [
    '/services/intake',
    '/contact',
    '/terms',
    '/privacy',
    '/cookies',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
];

export default function GuestPromptModal() {
    const [visible, setVisible] = useState(false);

    const page = usePage();
    const props = page.props as { auth?: { user?: unknown } };
    const isGuest = !props.auth?.user;
    const currentPath = (page.url ?? '').split('?')[0];
    const isSuppressed = SUPPRESSED_PATH_PREFIXES.some(
        (prefix) => currentPath === prefix || currentPath.startsWith(prefix + '/'),
    );

    useEffect(() => {
        if (!isGuest) return;
        if (isSuppressed) return;
        if (sessionStorage.getItem(STORAGE_KEY)) return;

        const id = setTimeout(() => setVisible(true), DELAY_MS);
        return () => clearTimeout(id);
    }, [isGuest, isSuppressed]);

    const dismiss = () => {
        setVisible(false);
        sessionStorage.setItem(STORAGE_KEY, '1');
    };

    if (!visible) return null;

    const registerUrl = `${getAuthSystemUrl()}/register`;
    const loginUrl = getLoginUrl('');

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-prompt-title"
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} aria-hidden="true" />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-md rounded-lg border border-white/10 bg-[var(--color-foreground)] p-8 shadow-2xl">
                <button onClick={dismiss} aria-label="Close" className="absolute top-4 right-4 text-white/50 transition hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                <p className="mb-1 text-sm font-semibold tracking-widest text-[var(--primary)] uppercase">Hey there 👋</p>
                <h2 id="guest-prompt-title" className="mb-3 text-2xl font-bold text-white">
                    Have a project in mind?
                </h2>
                <p className="mb-6 text-white/70">
                    Fill out the project questionnaire and we'll scope your build — or create a free account to stay in the loop and get direct
                    feedback from us.
                </p>

                <div className="flex flex-col gap-3">
                    <a
                        href="/services/intake"
                        className="block w-full rounded bg-[var(--primary)] py-3 text-center font-semibold text-black transition hover:opacity-90"
                        onClick={dismiss}
                    >
                        Fill Out Questionnaire
                    </a>
                    <a
                        href={registerUrl}
                        className="block w-full rounded border border-white/20 py-3 text-center font-semibold text-white transition hover:border-white/50 hover:bg-white/5"
                        onClick={dismiss}
                    >
                        Create a Free Account
                    </a>
                    <div className="mt-1 text-center text-sm text-white/50">
                        Already have an account?{' '}
                        <a href={loginUrl} className="text-[var(--primary)] hover:underline" onClick={dismiss}>
                            Log in
                        </a>
                    </div>
                </div>

                <button onClick={dismiss} className="mt-5 w-full text-center text-xs text-white/30 transition hover:text-white/50">
                    Maybe later
                </button>
            </div>
        </div>
    );
}
