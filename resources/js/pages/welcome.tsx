import ApplicationLogo from "@/Components/applicationLogo";
import Carousel from "@/Components/carousel";
import MainLayout from "@/Layouts/MainLayout";
import { Head, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { JSX } from "react";

export default function Home(): JSX.Element {
    const cdn = import.meta.env.VITE_ASSET_URL;

    const handleClick = (): void => {
        router.visit("/contact");
    };

    return (
        <MainLayout>
            <>
                <Head>
                    <title>
                        Graveyard Jokes Studios | Custom Websites for Musicians, Artists,
                        and Creatives
                    </title>
                    <meta
                        name="description"
                        content="Graveyard Jokes Studios builds custom websites for musicians, artists, and creatives — stand out online with tailored design and tech."
                    />
                    <meta
                        name="keywords"
                        content="custom websites, musicians, artists, creatives, web design, web development, portfolio, online presence"
                    />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>

                <a href="/" className="sr-only">
                    Home Page
                </a>

                <div className="relative z-0 max-w-full space-y-10 overflow-hidden bg-[var(--color-foreground)] text-center">
                    {/* Background Image and Gradient */}
                    <div className="absolute inset-0 max-h-96">
                        <img
                            src={`${cdn}/images/AdobeStock_327183052.webp`}
                            loading="lazy"
                            alt="Overlay Image"
                            className="pointer-events-none h-full w-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-foreground)] to-transparent"></div>
                    </div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 space-y-4 px-6 pt-12 sm:px-12"
                    >
                        <h1 className="sr-only">GraveYard Jokes Studios</h1>

                        <motion.h1
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-min-max bg-[var(--card)] p-12 text-4xl font-bold text-white sm:text-6xl lg:text-7xl"
                        >
                            GraveYard Jokes
                            <br />
                            Studios
                        </motion.h1>

                        <div className="block md:flex md:items-center md:justify-center md:space-x-6">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="mx-auto text-center text-lg text-white opacity-70 sm:text-xl md:w-1/2"
                            >
                                Custom websites for musicians, artists, and creatives who want
                                to stand out online
                                <br />— whether you're promoting your latest album or building a
                                portfolio to showcase your skills.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.8 }}
                                className="flex items-center justify-center md:w-1/2"
                            >
                                <ApplicationLogo
                                    logoSize="h-32 w-32 sm:h-48 sm:w-48 mx-auto"
                                    containerClasses="m-6"
                                />
                            </motion.div>
                        </div>
                    </motion.div>

                    <div className="block md:flex md:items-center md:justify-center md:space-x-6">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mx-auto pb-12 text-xl text-white sm:text-2xl lg:w-sm"
                        >
                            "Dreaming of a website that works as hard as you do? Let’s build
                            it! Your vision, my code, endless possibilities."
                        </motion.p>
                        {/* Contact Button */}
                        <motion.button
                            type="button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            whileHover={{ scale: 1.1 }}
                            className="relative z-20 mx-auto mb-12 flex bg-[var(--card)] px-20 py-12 text-2xl font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-[var(--accent)] focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-none sm:px-12 sm:py-6 sm:text-lg lg:px-36 lg:py-24 lg:text-5xl"
                            aria-label="Contact Us"
                            onClick={handleClick}
                        >
                            Let's talk
                        </motion.button>

                        <div className="mx-auto items-center p-4 lg:w-sm">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <p className="relative flex bg-[var(--card)] p-4 text-lg text-black shadow-lg hover:bg-green-900 md:m-auto md:max-w-screen-md">
                                    Custom websites for musicians, artists, and creatives who want
                                    to stand out online — whether you're promoting your latest
                                    album, launching a brand, or building a personal portfolio to
                                    showcase your skills and story.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                    {/* Carousel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <Carousel />
                    </motion.div>

                    {/* Footer Image */}
                    <div className="absolute bottom-0 z-5 max-h-96 w-full">
                        <motion.img
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                            src={`${cdn}/images/AdobeStock_471779082.webp`}
                            loading="lazy"
                            alt="Footer Image"
                            className="pointer-events-none h-auto w-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-foreground)]"></div>
                    </div>
                </div>
            </>
        </MainLayout>
    );
}
