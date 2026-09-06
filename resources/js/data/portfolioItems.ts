import { getProjectUrl } from '../env';

export type PortfolioItem = {
    title: string;
    description: string;
    longDescription: string;
    url: string;
    tech: string[];
    category: string;
    year: number;
    featured?: boolean;
};

const portfolioItems: PortfolioItem[] = [
    {
        title: 'Paline',
        description: 'A booking and inquiry platform for a touring performing artist.',
        longDescription:
            'Paline is a full booking platform built for a performing artist juggling solo, duo, and full-lineup shows across a busy touring calendar. It features live availability with Available, Limited, Held, and Blocked date states, an automated pricing engine that adjusts for lineup size, day of week, and season, and a guided request flow that lets buyers build most of a booking anonymously before verifying identity for private pricing. Legal riders and confidentiality agreements are handled with scroll-gated e-signature at final review, and accounts use passwordless magic-link authentication end to end.',
        url: 'https://palineofficial.com',
        tech: ['Laravel', 'React', 'Inertia.js', 'TypeScript', 'MySQL', 'Tailwind CSS'],
        category: 'Booking Platform',
        year: 2026,
        featured: true,
    },
    {
        title: 'Hollow Press',
        description: 'A blog site covering technology, lifestyle, and more.',
        longDescription:
            'Hollow Press is a full-featured editorial blog platform built for writers who want a clean, fast, and modern home for their content. It features a custom CMS with rich-text editing, category tagging, author profiles, and a fully server-side rendered frontend for top-tier SEO performance. Readers get a distraction-free reading experience across desktop and mobile.',
        url: getProjectUrl('hollowpress'),
        tech: ['Laravel', 'React', 'Inertia.js', 'SSR', 'MySQL', 'Tailwind CSS'],
        category: 'Blog / Publishing',
        year: 2026,
        featured: true,
    },
    {
        title: 'Lunar Blood',
        description: 'A heavy metal band site sharing music, merchandise, and updates.',
        longDescription:
            'Lunar Blood is a high-impact band site built for a heavy metal act that needed a digital presence as intense as their music. The site features an embedded music player, a merch store with cart and checkout, tour date listings, and a press kit section. Dark aesthetic with custom animations and mobile-first layout throughout.',
        url: getProjectUrl('lunarblood'),
        tech: ['Laravel', 'React', 'Inertia.js', 'SSR', 'Stripe', 'Tailwind CSS'],
        category: 'Band / Music',
        year: 2026,
        featured: true,
    },
    {
        title: 'The Velvet Pulse',
        description: 'A band site that features music, tour dates, and merchandise.',
        longDescription:
            'The Velvet Pulse needed a site that matched their lush, atmospheric sound. This build delivers a visually rich experience with a music preview player, tour calendar, and a merch section. Built with SSR for fast first loads and social sharing previews, every page is optimised for sharing on Instagram and Twitter.',
        url: getProjectUrl('thevelvetpulse'),
        tech: ['Laravel', 'React', 'Inertia.js', 'SSR', 'Tailwind CSS'],
        category: 'Band / Music',
        year: 2026,
    },
    {
        title: 'Velvet Radio',
        description: 'A music streaming platform with a vast library of songs and playlists.',
        longDescription:
            'Velvet Radio is a custom music streaming platform allowing independent artists to upload tracks, curate playlists, and build a listener base. Features include a persistent web audio player, user accounts, follow and like functionality, and an artist dashboard for upload management and stream analytics.',
        url: getProjectUrl('velvetradio'),
        tech: ['Laravel', 'React', 'Inertia.js', 'Web Audio API', 'MySQL', 'Tailwind CSS'],
        category: 'Streaming Platform',
        year: 2026,
    },
    {
        title: 'Synth Veil',
        description: 'A portfolio website showcasing design and development skills.',
        longDescription:
            'Synth Veil is a sleek single-page portfolio for a digital artist and sound designer. The site uses subtle parallax effects and animated transitions to let the work speak for itself. Built for speed with a perfect Lighthouse score in mind — fully responsive, accessible, and deployable as a static site or Laravel-backed SSR app.',
        url: getProjectUrl('synthveil'),
        tech: ['Laravel', 'React', 'Inertia.js', 'SSR', 'Framer Motion', 'Tailwind CSS'],
        category: 'Portfolio / Creative',
        year: 2026,
    },
];

export default portfolioItems;
