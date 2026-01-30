import { getProjectUrl } from '../env';

const portfolioItems = [
    {
        title: 'The Velvet Pulse',
        description: 'A band site that features music, tour dates, and merchandise.',
        url: getProjectUrl('thevelvetpulse'),
    },
    {
        title: 'Hollow Press',
        description: 'A blog site covering technology, lifestyle, and more.',
        url: getProjectUrl('hollowpress'),
    },
    {
        title: 'Lunar Blood',
        description: 'A heavy metal band site sharing music, merchandise, and updates.',
        url: getProjectUrl('lunarblood'),
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
