import React, { ReactNode, useState, useEffect } from "react";
import MobileMenu from "@/Components/MobileMenu";

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const cdn = import.meta.env.VITE_ASSET_URL as string;

    return (
        <div
            id="app"
            className="min-h-screen bg-[var(--color-background)]"
        >
            {loading ? (
                <div className="flex min-h-screen items-center justify-center text-white">
                    <img
                        src={`${cdn}/images/SkullBoySwordSwinganimation.gif`}
                        alt="Loading..."
                        className="w-32 h-32"
                    />
                    <p className="ml-4 text-xl">Loading...</p>
                </div>
            ) : (
                <>
                    <header className="flex items-center justify-between p-4">
                        <MobileMenu />
                        {/*  <Message /> */}
                    </header>
                    <main className="min-w-full p-4">{children}</main>
                    <footer className="p-4 mt-8 text-sm text-center">
                        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                            <a
                                href="/terms"
                                className="text-blue-900 hover:underline"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="/privacy"
                                className="text-blue-900 hover:underline"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="/cookies"
                                className="text-blue-900 hover:underline"
                            >
                                Cookie Policy
                            </a>
                            <a
                                href="/contact"
                                className="text-blue-900 hover:underline"
                            >
                                Contact
                            </a>
                        </div>
                        <div className="mt-2 text-black">
                            &copy; {new Date().getFullYear()} Joshua Ackerly
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
};

export default MainLayout;
