import React, { ReactNode, useEffect } from "react";
import MobileMenu from "@/Components/MobileMenu";
import Menu from "@/Components/Menu";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  useEffect(() => {
    // Track visitor on layout mount (every page visit)
    const trackVisit = async () => {
      try {
        await fetch('/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
          }
        });
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, []); // Empty dependency array means it runs once per component mount
  return (
    <div id="app" className="min-h-screen bg-[var(--color-background)]">
      <header className="flex items-center justify-between p-4">
        <div className="md:hidden">
          <MobileMenu />
        </div>
        <div className="hidden w-full items-center justify-between md:flex">
          <Menu />
        </div>
        {/*  <Message /> */}
      </header>
      <main className="min-w-full p-4">{children}</main>
      <footer className="mt-8 p-4 text-center text-sm">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <a href="/terms" className="text-blue-900 hover:underline">
            Terms of Service
          </a>
          <a href="/privacy" className="text-blue-900 hover:underline">
            Privacy Policy
          </a>
          <a href="/cookies" className="text-blue-900 hover:underline">
            Cookie Policy
          </a>
          <a href="/contact" className="text-blue-900 hover:underline">
            Contact
          </a>
        </div>
        <div className="mt-2 text-black">
          &copy; {new Date().getFullYear()} Joshua Ackerly
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
