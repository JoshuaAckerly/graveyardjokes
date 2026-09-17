import { Link, usePage } from '@inertiajs/react';
import { getAuthSystemUrl, getLoginUrl, getProjectUrl } from '../env';

export default function Menu() {
    let auth: { user?: { id: number; name: string; email: string } } | undefined;

    try {
        const page = usePage().props as { auth?: { user?: { id: number; name: string; email: string } } };
        auth = page.auth;
    } catch {
        auth = undefined;
    }

    const isAuthenticated = !!auth?.user;

    return (
        <ul className="center-items mx-auto flex space-x-4">
            <li className="text-[var(--color-text)]">
                <Link href="/" className="hover:underline">
                    Home
                </Link>
            </li>
            <li className="text-[var(--color-text)]">
                <Link href="/about" className="hover:underline">
                    About
                </Link>
            </li>
            <li className="text-[var(--color-text)]">
                <Link href="/links" className="hover:underline">
                    Links
                </Link>
            </li>
            <li className="text-[var(--color-text)]">
                <Link href="/contact" className="hover:underline">
                    Contact
                </Link>
            </li>
            <li className="text-[var(--color-text)]">
                <a href={getProjectUrl('studio')} className="hover:underline">
                    Studio
                </a>
            </li>
            <li className="text-[var(--color-text)]">
                {isAuthenticated ? (
                    <a href={`${getAuthSystemUrl()}/dashboard`} className="hover:underline">
                        Dashboard
                    </a>
                ) : (
                    <a href={getLoginUrl('')} className="hover:underline">
                        Login
                    </a>
                )}
            </li>
        </ul>
    );
}
