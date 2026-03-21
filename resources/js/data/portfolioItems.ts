import { getProjectUrl } from '../env';

export type PortfolioItem = {
    title: string;
    description: string;
    url: string;
    featured?: boolean;
};

const portfolioItems: PortfolioItem[] = [
    {
        title: 'Hollow Press',
        description: 'A blog site covering technology, lifestyle, and more.',
        url: getProjectUrl('hollowpress'),
        featured: true,
    },
    {
        title: 'Lunar Blood',
        description: 'A heavy metal band site sharing music, merchandise, and updates.',
        url: getProjectUrl('lunarblood'),
        featured: true,
    },
    {
        title: 'The Velvet Pulse',
        description: 'A band site that features music, tour dates, and merchandise.',
        url: getProjectUrl('thevelvetpulse'),
    },
    {
        title: 'Velvet Radio',
        description: 'A music streaming platform with a vast library of songs and playlists.',
        url: getProjectUrl('velvetradio'),
    },
    {
        title: 'Synth Veil',
        description: 'A portfolio website showcasing design and development skills.',
        url: getProjectUrl('synthveil'),
    },
];

export default portfolioItems;
