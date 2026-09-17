import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

/**
 * Subtle preloader: a dark curtain with a 0 → 100 counter that lifts away on
 * first load. Minimal, low-key — matches the musician brand.
 *
 * SSR-safe (all animation in useEffect). Honors prefers-reduced-motion by
 * skipping straight to hidden.
 */
export default function Preloader() {
    const rootRef = useRef<HTMLDivElement>(null);
    const [count, setCount] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            setDone(true);
            return;
        }

        const state = { v: 0 };
        const tl = gsap.timeline({
            onComplete: () => setDone(true),
        });

        // Count 0 -> 100
        tl.to(state, {
            v: 100,
            duration: 1.4,
            ease: 'power2.inOut',
            onUpdate: () => setCount(Math.round(state.v)),
        });

        // Lift the curtain up and away
        tl.to(rootRef.current, {
            yPercent: -100,
            duration: 0.9,
            ease: 'power3.inOut',
        });

        return () => {
            tl.kill();
        };
    }, []);

    if (done) return null;

    return (
        <div
            ref={rootRef}
            className="fixed inset-0 z-[10000] flex items-end justify-between bg-[var(--color-foreground)] px-8 pb-10 text-white sm:px-16"
            aria-hidden="true"
        >
            <span className="font-serif text-lg tracking-[0.3em] text-white/60 uppercase">Graveyard Jokes</span>
            <span className="font-serif text-6xl font-bold text-[var(--primary)] sm:text-8xl">{count}</span>
        </div>
    );
}
