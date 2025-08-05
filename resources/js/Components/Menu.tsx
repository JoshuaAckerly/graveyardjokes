import { Link } from "@inertiajs/react";



export default function Menu() {

    return (

        <ul className="flex center-items mx-auto space-x-4">
            <li className="text-[var(--color-text)]">
                <Link
                    href={route("home")}
                    className="hover:underline"

                >
                    Home
                </Link>
            </li>
            <li className="text-[var(--color-text)]">
                <Link
                    href="/about"
                    className="hover:underline"

                >
                    About
                </Link>
            </li>
            <li className="text-[var(--color-text)]">
                <Link
                    href="/contact"
                    className="hover:underline"

                >
                    Contact
                </Link>
            </li>
            <li className="text-[var(--color-text)]">
                <Link
                    href="#portfolio"
                    className="hover:underline"

                >
                    Portfolio
                </Link>
            </li>
            <li className="text-[var(--color-text)]">
                <Link
                    href="#studio"
                    className="hover:underline"

                >
                    Studio
                </Link>
            </li>
        </ul>
    );
}
