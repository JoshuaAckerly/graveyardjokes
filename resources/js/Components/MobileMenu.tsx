import React, { useState, MouseEvent } from "react";
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
                        <span className={`block w-8 h-1 bg-green-400 transition-transform ${isOpen ? "rotate-45 translate-y-3" : ""}`} />
                        <span className={`block w-8 h-1 bg-green-400 transition-opacity ${isOpen ? "opacity-0" : "opacity-100"}`} />
                        <span className={`block w-8 h-1 bg-green-400 transition-transform ${isOpen ? "-rotate-45 -translate-y-3" : ""}`} />
                    </div>
                </button>
            </div>

            {/* Centered Modal Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-20 bg-green-950 opacity-80 backdrop-blur-md"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="fixed inset-0 flex items-center justify-center z-40">
                        <div
                            className="p-8 text-white w-96 rounded-lg">
                            <ul className="space-y-4 text-center flex flex-col">
                                <li className="mb-4 bg-green-800">
                                    <Link
                                        href={route("home")}
                                        className="text-green-400 hover:underline"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li className="mb-4 bg-green-800">
                                    <Link
                                        href="/about"
                                        className="text-green-400 hover:underline"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        About
                                    </Link>
                                </li>
                                <li className="mb-4 bg-green-800">
                                    <Link
                                        href="/contact"
                                        className="text-green-400 hover:underline"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Contact
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
