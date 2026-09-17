import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useEffect } from 'react';

/**
 * Site-wide smooth scrolling via Lenis, synced with GSAP ScrollTrigger.
 *
 * SSR-safe: everything runs inside useEffect (client only). Honors the user's
 * "prefers-reduced-motion" setting by skipping smooth scroll entirely.
 */
export function useSmoothScroll(): void {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Respect accessibility preference — no smooth-scroll hijack for users
        // who ask for reduced motion.
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            duration: 1.1,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
            smoothWheel: true,
        });

        // Drive Lenis from GSAP's ticker so scroll + animations stay in sync.
        const onTick = (time: number) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);

        // Keep ScrollTrigger in sync with Lenis scroll position.
        lenis.on('scroll', ScrollTrigger.update);

        return () => {
            gsap.ticker.remove(onTick);
            lenis.destroy();
        };
    }, []);
}

export default useSmoothScroll;
