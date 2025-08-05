import React, { useEffect, useState } from 'react';

interface Slide {
    image: string;
    title: string;
    description: string;
    link: string;
}

const carouselSlides: Slide[] = [
    {
        image: '/images/AdobeStock_283463385.webp',
        title: 'The Velvet Pulse',
        description: 'A visually stunning site currently in development — designed to engage and impress.',
        link: 'https://thevelvetpulse.graveyardjokes.com',
    },
    {
        image: '/images/AdobeStock_348397404.webp',
        title: 'Lunar Blood',
        description: 'This project features an elegant layout made for a modern metal band.',
        link: 'https://lunarblood.graveyardjokes.com',
    },
    {
        image: '/images/AdobeStock_621659086.webp',
        title: 'Synth Veil',
        description: 'An immersive experience built with modern web technologies.',
        link: 'https://synthveil.graveyardjokes.com',
    },
    {
        image: '#',
        title: 'Velvet Radio',
        description: 'A tribute to The Velvet Pulse, blending nostalgia with contemporary design.',
        link: 'https://velvetradio.graveyardjokes.com',
    },
    {
        image: '#',
        title: 'Hollow Press',
        description: 'A vibrant showcase of creativity and innovation in web design.',
        link: 'https://hollowpress.graveyardjokes.com',
    },
];

const Carousel: React.FC = () => {
    const cdn: string = import.meta.env.VITE_ASSET_URL as string;

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const totalSlides = carouselSlides.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
        }, 5000);

        return () => clearInterval(interval);
    }, [totalSlides]);

    return (
        <div className="relative z-10 mx-auto w-full max-w-sm overflow-hidden md:max-w-3xl">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {carouselSlides.map((slide, index) => (
                    <div key={index} className="relative w-full flex-shrink-0 border border-[var(--primary)]">
                        {/* Slide image */}
                        <img
                            src={`${cdn}${slide.image}`}
                            loading="lazy"
                            className="max-h-[300px] w-full object-contain md:max-h-[500px]"
                            alt={slide.title}
                        />

                        {/* Overlay content */}
                        <div className="absolute inset-0 flex flex-col bg-black/40">
                            <div className='flex flex-col items-center justify-center h-full p-4 text-center'>
                                {/* Slide title and description */}
                                <div className='bg-[var(--primary)] p-4 shadow-lg'>
                                    <h3 className="text-xl font-bold text-white">{slide.title}</h3>
                                    <p className="hidden text-white sm:block">{slide.description}</p>
                                    {slide.link && (
                                        <a href={slide.link} target="_blank" rel="noopener noreferrer" className="inline-block text-white">
                                            View Project
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="absolute top-1/2 right-5 left-5 flex -translate-y-1/2 transform justify-between">
                <button
                    onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselSlides.length) % carouselSlides.length)}
                    className="btn btn-circle"
                >
                    ❮
                </button>
                <button onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselSlides.length)} className="btn btn-circle">
                    ❯
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-2">
                {carouselSlides.map((_, index) => (
                    <button
                        key={index}
                        className={`h-3 w-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-600'}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
