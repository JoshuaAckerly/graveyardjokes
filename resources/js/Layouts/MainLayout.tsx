import GuestPromptModal from '@/Components/GuestPromptModal';
import Menu from '@/Components/Menu';
import MobileMenu from '@/Components/MobileMenu';
import NotificationBell from '@/Components/NotificationBell';
import { router } from '@inertiajs/react';
import gsap from 'gsap';
import React, { ReactNode, useEffect, useRef } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Page transition: fade-out overlay before navigate, fade-in on arrive
        const beforeLeave = router.on('before', () => {
            if (overlayRef.current) {
                gsap.fromTo(
                    overlayRef.current,
                    { opacity: 0, pointerEvents: 'none' },
                    { opacity: 1, pointerEvents: 'all', duration: 0.25, ease: 'power1.in' },
                );
            }
        });
        const onFinish = router.on('finish', () => {
            if (overlayRef.current) {
                gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.35, ease: 'power2.out', delay: 0.05 });
            }
        });
        return () => {
            beforeLeave();
            onFinish();
        };
    }, []);
    useEffect(() => {
        // Track visitor on layout mount (every page visit)
        const trackVisit = async () => {
            try {
                // Determine if we're on the main domain or a subdomain
                const currentHost = window.location.hostname;
                const isMainLocal = currentHost === 'graveyardjokes.local' || currentHost === 'localhost' || currentHost === '127.0.0.1';
                const isLocalSubdomain = currentHost.endsWith('.graveyardjokes.local');
                const isTest = currentHost === 'graveyardjokes.test' || currentHost.endsWith('.graveyardjokes.test');

                // Use /api/track-visit for local and main domain, full URL for subdomains
                const trackingUrl =
                    isMainLocal || isTest || currentHost === 'graveyardjokes.com'
                        ? '/api/track-visit'
                        : isLocalSubdomain
                          ? 'http://graveyardjokes.local:8000/api/track-visit'
                          : 'https://graveyardjokes.com/api/track-visit';

                const fetchOptions: RequestInit = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        referrer: window.location.href,
                        subdomain: window.location.hostname,
                    }),
                };

                // Add credentials for cross-origin requests
                if (trackingUrl.startsWith('https://')) {
                    fetchOptions.credentials = 'include';
                }

                await fetch(trackingUrl, fetchOptions);
            } catch (error) {
                console.error('Failed to track visit:', error);
            }
        };

        trackVisit();
    }, []); // Empty dependency array means it runs once per component mount
    return (
        <div id="app" className="min-h-screen bg-[var(--color-background)]">
            <GuestPromptModal />
            {/* Page transition overlay */}
            <div ref={overlayRef} className="pointer-events-none fixed inset-0 z-[999] bg-[var(--color-background)] opacity-0" aria-hidden="true" />
            <header className="relative z-50 flex items-center justify-between p-4">
                <div className="md:hidden">
                    <MobileMenu />
                </div>
                <div className="hidden w-full items-center justify-between md:flex">
                    <Menu />
                    <NotificationBell />
                </div>
                {/*  <Message /> */}
            </header>
            <main className="min-w-full p-4">{children}</main>
            <footer className="relative z-30 mt-8 p-4 text-center text-sm">
                <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                    <a href="/terms" className="text-white hover:underline">
                        Terms of Service
                    </a>
                    <a href="/privacy" className="text-white hover:underline">
                        Privacy Policy
                    </a>
                    <a href="/cookies" className="text-white hover:underline">
                        Cookie Policy
                    </a>
                    <a href="/contact" className="text-white hover:underline">
                        Contact
                    </a>
                    <a href="/linkedin" className="text-white hover:underline">
                        LinkedIn
                    </a>
                </div>
                <div className="mt-2 text-white/80">
                    &copy; {new Date().getFullYear()} GraveYard Jokes Studios Inc. —{' '}
                    <a href="mailto:admin@graveyardjokes.com" className="text-white hover:underline">
                        admin@graveyardjokes.com
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
