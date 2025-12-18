import { Link } from '@inertiajs/react';
import { MouseEvent, useState } from 'react';

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            {/* Hamburger Button */}
            <div className="fixed top-6 right-6 z-[9999]">
                <button onClick={toggleMenu} aria-label="Toggle Menu" aria-expanded={isOpen} className="text-white focus:outline-none">
                    <div className="space-y-2">
                        <span className={`block h-1 w-8 bg-[var(--primary)] transition-transform ${isOpen ? 'translate-y-3 rotate-45' : ''}`} />
                        <span className={`block h-1 w-8 bg-[var(--primary)] transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                        <span className={`block h-1 w-8 bg-[var(--primary)] transition-transform ${isOpen ? '-translate-y-3 -rotate-45' : ''}`} />
                    </div>
                </button>
            </div>

            {/* Centered Modal Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
<<<<<<< HEAD
                    <div className="fixed inset-0 z-[9990] bg-[var(--color-background)] opacity-80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
=======
                    <div
                        className="fixed inset-0 z-[9990] bg-[var(--color-background)] opacity-80 backdrop-blur-md"
                        onClick={() => setIsOpen(false)}
                    />
>>>>>>> 3af94ce9a36ea4fab79cd3b986493cecd56f508a

                    {/* Menu */}
                    <div className="fixed inset-0 z-[9995] flex items-center justify-center">
                        <div className="w-96 rounded-lg p-8 text-white">
                            <ul className="flex flex-col space-y-4 text-center">
                                <li className="mb-4 bg-[var(--primary)]">
                                    <Link href="/" className="text-black hover:underline" onClick={() => setIsOpen(false)}>
                                        Home
                                    </Link>
                                </li>
                                <li className="mb-4 bg-[var(--primary)]">
                                    <Link href="/about" className="text-black hover:underline" onClick={() => setIsOpen(false)}>
                                        About
                                    </Link>
                                </li>
                                <li className="mb-4 bg-[var(--primary)]">
                                    <Link href="/contact" className="text-black hover:underline" onClick={() => setIsOpen(false)}>
                                        Contact
                                    </Link>
                                </li>
                                <li className="mb-4 bg-[var(--primary)]">
                                    <Link href="/portfolio" className="text-black hover:underline" onClick={() => setIsOpen(false)}>
                                        Portfolio
                                    </Link>
                                </li>
                                <li className="mb-4 bg-[var(--primary)]">
                                    <Link href="/services" className="text-black hover:underline" onClick={() => setIsOpen(false)}>
                                        Services
                                    </Link>
                                </li>
                                <li className="mb-4 bg-[var(--primary)]">
                                    <a
                                        href="https://studio.graveyardjokes.com"
                                        className="text-black hover:underline"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Studio
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
