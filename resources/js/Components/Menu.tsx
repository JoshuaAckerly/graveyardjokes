import { Link } from '@inertiajs/react';

export default function Menu() {
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
                <a href="https://studio.graveyardjokes.com" className="hover:underline">
                    Studio
                </a>
            </li>
        </ul>
    );
}
