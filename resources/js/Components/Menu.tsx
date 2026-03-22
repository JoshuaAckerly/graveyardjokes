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
                <Link href="/contact" className="hover:underline">
                    Contact
                </Link>
            </li>
            <li className="text-[var(--color-text)]">
                <Link href="/portfolio" className="hover:underline">
                    Portfolio
                </Link>
            </li>
            <li className="text-[var(--color-text)]">
                <Link href="/services" className="hover:underline">
                    Services
                </Link>
            </li>
            <li className="text-[var(--color-text)]">
                <a href={getProjectUrl('studio')} className="hover:underline">
                    Studio
                </a>
            </li>
            <li className="text-[var(--color-text)]">
                {isAuthenticated ? (
                    <Link
                        href={`${getAuthSystemUrl()}/logout`}
                        method="post"
                        as="button"
                        className="font-inherit cursor-pointer border-none bg-transparent p-0 hover:underline"
                    >
                        Log Out
                    </Link>
                ) : (
                    <a href={getLoginUrl('')} className="hover:underline">
                        Login
                    </a>
                )}
            </li>
        </ul>
    );
}
