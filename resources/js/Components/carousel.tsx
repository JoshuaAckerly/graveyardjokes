import React, { useEffect, useState } from 'react';
import { getEnvVar, getProjectUrl } from '../env';

interface Slide {
    image: string;
    title: string;
    description: string;
    link: string;
}

const carouselSlides: Slide[] = [
    {
        image: '/images/carousel-1.webp',
        title: 'Follow along',
        description: 'Behind-the-scenes and whatever we are working on. Follow @graveyardjokes.',
        link: 'https://instagram.com/graveyardjokes',
    },
    {
        image: '/images/carousel-2.webp',
        title: 'Songs in progress',
        description: 'Two people writing songs together, one at a time. More coming as we go.',
        link: '/studio',
    },
    {
        image: '/images/carousel-3.webp',
        title: 'Games & things',
        description: 'Noteleks and other things being built under the Graveyard Jokes name.',
        link: getProjectUrl('portfolio'),
    },
];

const Carousel: React.FC = () => {
    const cdn: string = getEnvVar('VITE_ASSET_URL');

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
                            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                                {/* Slide title and description */}
                                <div className="bg-[var(--primary)] p-4 shadow-lg">
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
