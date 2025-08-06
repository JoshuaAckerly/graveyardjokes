import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

const Portfolio: React.FC = () => {
    return (
        <MainLayout>
            <>
            <Head>
                <title>Portfolio | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Explore the portfolio of Graveyard Jokes Studios, showcasing custom websites for musicians, artists, and creatives."
                />
                <meta
                    name="keywords"
                    content="portfolio, custom websites, musicians, artists, creatives, web design, web development"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="canonical" href="https://graveyardjokes.com/portfolio" />
            </Head>
            </>
            <section className="flex flex-col gap-4 justify-center items-center text-white p-4 bg-[var(--color-foreground)] rounded-lg shadow-lg">
                <h1 className='text-5xl text-[var(--card)]'>Portfolio</h1>
                <p className='p-10 underline md:w-sm text-center'>Welcome to my portfolio page! Here you can find a collection of my work and projects that showcase my skills and experience.</p>
                <ul className="flex flex-col gap-4 text-center justify-center items-center md:w-sm">
                    <li>
                        <h3 className='text-[var(--card)]'>The Velvet Pulse</h3>
                        <a className="hover:underline" href="https://thevelvetpulse.graveyardjokes.com" target="_blank" rel="noopener noreferrer">
                            A band site that features music, tour dates, and merchandise.
                        </a>
                    </li>
                    <li>
                        <h3 className='text-[var(--card)]'>Hollow Press</h3>
                        <a className="hover:underline" href="https://hollowpress.graveyardjokes.com" target="_blank" rel="noopener noreferrer">
                            A blog site that shares articles on various topics including technology, lifestyle, and more.
                        </a>
                    </li>
                    <li>
                        <h3 className='text-[var(--card)]'>Lunar Blood</h3>
                        <a className="hover:underline" href="https://lunarblood.graveyardjokes.com" target="_blank" rel="noopener noreferrer">
                            A heavy metal band that creates and shares music, merchandise, and updates with fans.
                        </a>
                    </li>
                    <li>
                        <h3 className='text-[var(--card)]'>Velvet Radio</h3>
                        <a className="hover:underline" href="https://velvetradio.graveyardjokes.com" target="_blank" rel="noopener noreferrer">
                            A music streaming service that provides users with access to a vast library of songs and playlists.
                        </a>
                    </li>
                    <li>
                        <h3 className='text-[var(--card)]'>Synth Veil</h3>
                        <a className="hover:underline" href="https://synthveil.graveyardjokes.com" target="_blank" rel="noopener noreferrer">
                            A portfolio website that showcases my design and development skills.
                        </a>
                    </li>
                </ul>
                <p className='p-10 md:w-sm'>Feel free to explore these projects and reach out if you have any questions or would like to collaborate!</p>
            </section>
        </MainLayout>

    );
};

export default Portfolio;
