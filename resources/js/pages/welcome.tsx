import React, { JSX } from "react"
import { Head, router } from "@inertiajs/react"
import { motion } from "framer-motion"

export default function Home(): JSX.Element {
    const cdn = import.meta.env.VITE_ASSET_URL

    const handleClick = (): void => {
        router.visit("/contact")
    }

    return (
        <>
            <Head>
                <title>
                    Graveyard Jokes Studios | Custom Websites for Musicians &
                    Creatives
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
                <link rel="icon" href={`${cdn}/favicon.ico`} />
                    </Head>


            <a href="/" className="sr-only">
                Home Page
            </a>

            <div className="relative z-0 max-w-full space-y-20 overflow-hidden rounded-2xl bg-[#3E403D] text-center pb-24 sm:pb-40 lg:pb-60">
                {/* Background Image and Gradient */}
                <div className="absolute inset-0 max-h-96">
                    <img
                        src={`${cdn}/images/AdobeStock_327183052.webp`}
                        loading="lazy"
                        alt="Overlay Image"
                        className="object-cover w-full h-full pointer-events-none opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3E403D] to-transparent"></div>
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 px-6 py-12 space-y-4 sm:px-12"
                >
                    <h1 className="sr-only">GraveYard Jokes Studios</h1>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="rounded-2xl bg-[#1C1C1C] text-4xl font-bold text-white opacity-80 sm:text-6xl"
                    >
                        GraveYard Jokes Studios
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="max-w-2xl mx-auto mt-4 text-lg text-center text-white opacity-70 sm:text-xl"
                    >
                        Custom websites for musicians, artists, and
                        creatives who want to stand out online — whether
                        you're promoting your latest album or building a
                        portfolio to showcase your skills.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                    >

                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="max-w-2xl mx-auto text-xl text-white sm:text-2xl"
                    >
                        "Dreaming of a website that works as hard as you do?
                        Let’s build it! Your vision, my code, endless
                        possibilities."
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                    >
                        <a
                            href="/demo"
                            className="text-customGreen hover:underline"
                        >
                            Try the Demo
                        </a>
                    </motion.div>
                </motion.div>

                <div className="flex flex-col items-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <p className="relative flex p-4 text-lg text-black shadow-lg md:m-auto rounded-2xl hover:bg-green-900 bg-customGreen md:max-w-screen-md">
                            Custom websites for musicians, artists, and
                            creatives who want to stand out online — whether
                            you're promoting your latest album, launching a
                            brand, or building a personal portfolio to
                            showcase your skills and story.
                        </p>
                    </motion.div>
                </div>

                {/* Carousel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >

                </motion.div>

                {/* Contact Button */}
                <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="relative z-20 flex px-8 py-6 mx-auto text-sm font-semibold text-white transition duration-300 ease-in-out shadow-md bottom-2 rounded-2xl bg-customGreen hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:px-12 sm:py-6 sm:text-lg"
                    aria-label="Contact Us"
                    onClick={handleClick}
                >
                    Let's talk
                </motion.button>

                {/* Footer Image */}
                <div className="absolute bottom-0 w-full z-5 max-h-96">
                    <motion.img
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        src={`${cdn}/images/AdobeStock_471779082.webp`}
                        loading="lazy"
                        alt="Footer Image"
                        className="object-cover w-full h-auto pointer-events-none rounded-b-2xl opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#3E403D]"></div>
                </div>
            </div>

        </>
    )
}
