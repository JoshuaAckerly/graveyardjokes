import MainLayout from '@/Layouts/MainLayout';
import React from 'react';

const Portfolio: React.FC = () => {
    return (
        <MainLayout>
            <section className="flex flex-col gap-4 justify-center items-center text-white p-4">
                <h1>Portfolio</h1>
                <p className='p-10'>Welcome to my portfolio page! Here you can find a collection of my work and projects that showcase my skills and experience.</p>
                <ul className="flex flex-col gap-4 text-center justify-center items-center">
                    <li>
                        <a className="hover:underline" href="https://thevelvetpulse.graveyardjokes.com" target="_blank" rel="noopener noreferrer">
                            Project 1: A web application that helps users manage their tasks efficiently.
                        </a>
                    </li>
                    <li>
                        <a className="hover:underline" href="https://hollowpress.graveyardjokes.com" target="_blank" rel="noopener noreferrer">
                            Project 2: A blog site that shares articles on various topics including technology, lifestyle, and more.
                        </a>
                    </li>
                    <li>
                        <a className="hover:underline" href="https://lunarblood.graveyardjokes.com" target="_blank" rel="noopener noreferrer">
                            Project 2: a heavy metal band that creates and shares music, merchandise, and updates with fans.
                        </a>
                    </li>
                    <li>
                        <a className="hover:underline" href="https://velvetradio.graveyardjokes.com" target="_blank" rel="noopener noreferrer">
                            Project 3: A music streaming service that provides users with access to a vast library of songs and playlists.
                        </a>
                    </li>
                    <li>
                        <a className="hover:underline" href="https://synthveil.graveyardjokes.com" target="_blank" rel="noopener noreferrer">
                            Project 4: A portfolio website that showcases my design and development skills.
                        </a>
                    </li>
                </ul>
                <p className='p-10'>Feel free to explore these projects and reach out if you have any questions or would like to collaborate!</p>
            </section>
        </MainLayout>

    );
};

export default Portfolio;
