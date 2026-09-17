import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { ElementType, ReactNode, useEffect, useRef } from 'react';

interface RevealProps {
    children: ReactNode;
    /** Wrapper element tag. Defaults to div. */
    as?: ElementType;
    className?: string;
    /** Slide direction the element travels from. Default 'up'. */
    from?: 'up' | 'down' | 'left' | 'right' | 'none';
    /** Seconds of delay before the reveal. */
    delay?: number;
    /** Travel distance in px. Default 40. */
    distance?: number;
    /** Seconds. Default 0.9. */
    duration?: number;
}

/**
 * Fade/slide content into view as it scrolls in. SSR-safe (animation runs in
 * useEffect only) and honors prefers-reduced-motion (renders content visible,
 * no motion).
 */
const Reveal: React.FC<RevealProps> = ({
    children,
    as: Tag = 'div',
    className = '',
    from = 'up',
    delay = 0,
    distance = 40,
    duration = 0.9,
}) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const el = ref.current;
        if (!el) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            gsap.set(el, { opacity: 1, x: 0, y: 0 });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const offset = { x: 0, y: 0 };
        if (from === 'up') offset.y = distance;
        else if (from === 'down') offset.y = -distance;
        else if (from === 'left') offset.x = distance;
        else if (from === 'right') offset.x = -distance;

        const tween = gsap.fromTo(
            el,
            { opacity: 0, x: offset.x, y: offset.y },
            {
                opacity: 1,
                x: 0,
                y: 0,
                duration,
                delay,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            },
        );

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [from, delay, distance, duration]);

    return (
        <Tag ref={ref} className={className} style={{ opacity: 0 }}>
            {children}
        </Tag>
    );
};

export default Reveal;
