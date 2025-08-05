import { useState, MouseEvent } from "react";
import { Link } from "@inertiajs/react";



export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };


    return (
        <div className="relative">

            {/* Hamburger Button */}
            <div className="fixed right-6 top-6 z-100">

                <button
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                    aria-expanded={isOpen}
                    className="text-white focus:outline-none"
                >
                    <div className="space-y-2">
                        <span className={`block w-8 h-1 bg-[var(--primary)] transition-transform ${isOpen ? "rotate-45 translate-y-3" : ""}`} />
                        <span className={`block w-8 h-1 bg-[var(--primary)] transition-opacity ${isOpen ? "opacity-0" : "opacity-100"}`} />
                        <span className={`block w-8 h-1 bg-[var(--primary)] transition-transform ${isOpen ? "-rotate-45 -translate-y-3" : ""}`} />
                    </div>
                </button>
            </div>

            {/* Centered Modal Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-20 bg-[var(--color-background)] opacity-80 backdrop-blur-md"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="fixed inset-0 flex items-center justify-center z-40">
                        <div
                            className="p-8 text-white w-96 rounded-lg">
                            <ul className="space-y-4 text-center flex flex-col">
                                <li className="mb-4 bg-[var(--primary)]">
                                    <Link
                                        href={route("home")}
                                        className="text-black hover:underline"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li className="mb-4 bg-[var(--primary)]">
                                    <Link
                                        href="/about"
                                        className="text-black hover:underline"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        About
                                    </Link>
                                </li>
                                <li className="mb-4 bg-[var(--primary)]">
                                    <Link
                                        href="/contact"
                                        className="text-black hover:underline"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Contact
                                    </Link>
                                </li>
                                <li className="mb-4 bg-[var(--primary)]">
                                    <Link
                                        href="#portfolio"
                                        className="text-black hover:underline"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Portfolio
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}


        </div>

    );
}
