import React, { useState, useEffect, MouseEvent } from "react";
import { router } from "@inertiajs/react";
import { Link, usePage } from "@inertiajs/react";

interface AuthProps {
    user?: any;
}

interface PageProps {
    auth?: AuthProps;
    [key: string]: unknown;
}

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleMenu = () => setIsOpen((prev) => !prev);

    const { auth } = usePage<PageProps>().props;

    const handleLogout = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.post(route("logout"));
    };

    const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [isOpen]);

    return (
        <div className="relative z-50">
            {/* Overlay with Blur Effect */}
            {isOpen && (
                <div
                    className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-md"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Hamburger Button */}
            <button
                className="fixed z-50 text-white right-6 top-6 rounded-2xl focus:outline-none"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
                aria-expanded={isOpen}
            >
                <div className="space-y-2">
                    <span
                        className={`block w-8 h-1 bg-customGreen transition-transform ${
                            isOpen ? "rotate-45 translate-y-3" : ""
                        }`}
                    ></span>
                    <span
                        className={`block w-8 h-1 bg-customGreen transition-opacity ${
                            isOpen ? "opacity-0" : "opacity-100"
                        }`}
                    ></span>
                    <span
                        className={`block w-8 h-1 bg-customGreen transition-transform ${
                            isOpen ? "-rotate-45 -translate-y-3" : ""
                        }`}
                    ></span>
                </div>
            </button>

            {/* Centered Modal Menu */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="p-8 text-white w-96 rounded-2xl ">
                        <ul className="flex flex-col space-y-2 text-xl text-center">
                            <li>
                                <Link
                                    href="/"
                                    className="block p-2 rounded-2xl bg-customGreen hover:bg-gray-700"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("about")}
                                    className="block p-2 rounded-2xl bg-customGreen hover:bg-gray-700"
                                >
                                    About
                                </Link>
                            </li>
                            <li className="relative group">
                                <button
                                    className="block w-full p-2 rounded-2xl bg-customGreen hover:bg-gray-700"
                                    onClick={() => setIsDemoOpen((prev) => !prev)}
                                    type="button"
                                >
                                    Demos
                                </button>

                                {/* Dropdown menu */}
                                <ul
                                    className={`absolute left-0 z-20 w-40 mt-2 space-y-1 rounded-lg shadow-lg bg-customGreen transition-opacity duration-200 ease-in-out
                                    ${
                                        isDemoOpen ? "block" : "hidden"
                                    } group-hover:block`}
                                >
                                    <li>
                                        <a
                                            href="/cryptescape"
                                            className="block w-full px-4 py-2 rounded-t-lg hover:bg-gray-700"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsDemoOpen(false);
                                            }}
                                        >
                                            Crypt Escape
                                        </a>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("illustrations")}
                                            className="block px-4 py-2 hover:bg-gray-700"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsDemoOpen(false);
                                            }}
                                        >
                                            Illustrations
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("demo")}
                                            className="block px-4 py-2 rounded-b-lg hover:bg-gray-700"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsDemoOpen(false);
                                            }}
                                        >
                                            Random Songs Demo
                                        </Link>
                                    </li>
                                    <li>
                                        <a
                                            href="https://thevelvetpulse.graveyardjokes.com/"
                                            className="block px-4 py-2 rounded-b-lg hover:bg-gray-700"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsDemoOpen(false);
                                            }}
                                        >
                                            The Velvet Pulse (Featured Project)
                                        </a>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="block px-4 py-2 rounded-b-lg hover:bg-gray-700"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsDemoOpen(false);
                                            }}
                                        >
                                            GYJ's Music (Coming Soon)
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link
                                    href={route("pricing")}
                                    className="block p-2 rounded-2xl bg-customGreen hover:bg-gray-700"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("contact")}
                                    className="block p-2 rounded-2xl bg-customGreen hover:bg-gray-700"
                                >
                                    Contact
                                </Link>
                            </li>

                            {auth?.user ? (
                                <>
                                    <li>
                                        <Link
                                            href={route("dashboard")}
                                            className="block p-2 mx-auto rounded-2xl bg-customGreen w-min hover:bg-gray-700"
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("profile.edit")}
                                            className="block p-2 mx-auto rounded-2xl bg-customGreen w-min hover:bg-gray-700"
                                        >
                                            Account Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="block p-2 mx-auto rounded-2xl bg-customGreen w-min hover:bg-gray-700"
                                            type="button"
                                        >
                                            Log Out
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            href={route("login")}
                                            className="block w-1/3 p-2 mx-auto rounded-2xl bg-customGreen hover:bg-gray-700"
                                        >
                                            Log In
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("register")}
                                            className="block p-2 mx-auto rounded-2xl bg-customGreen w-min hover:bg-gray-700"
                                        >
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                        {/* Close Button */}
                        <button
                            className="block w-full p-2 mt-6 text-center rounded-2xl bg-red-950 hover:bg-red-500"
                            onClick={() => setIsOpen(false)}
                            type="button"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
