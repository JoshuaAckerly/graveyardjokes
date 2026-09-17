import { getEnvVar, getProjectUrl } from '../env';

// Paline lives on its own production domain (palineofficial.com), not a
// graveyardjokes subdomain, so it can't use getProjectUrl directly. In local/test
// dev it is served via nginx at paline.graveyardjokes.test (port 80).
const palineUrl = (): string => {
    const env = getEnvVar('VITE_SERVER_ENV') || getEnvVar('MODE');
    if (env === 'production') return 'https://palineofficial.com';
    return 'http://paline.graveyardjokes.test';
};

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
        url: palineUrl(),
        tech: ['Laravel', 'React', 'Inertia.js', 'TypeScript', 'MySQL', 'Tailwind CSS'],
        category: 'Booking Platform',
        year: 2026,
        featured: true,
    },
    {
        title: 'Noteleks',
        description: 'A game project built and hosted under the Graveyard Jokes umbrella.',
        longDescription:
            'Noteleks is an in-house game development project. It represents the shift of Graveyard Jokes toward building original games and interactive experiences rather than client websites.',
        url: getProjectUrl('noteleks'),
        tech: ['Laravel', 'React', 'TypeScript', 'Tailwind CSS'],
        category: 'Game Development',
        year: 2026,
        featured: true,
    },
];

export default portfolioItems;
