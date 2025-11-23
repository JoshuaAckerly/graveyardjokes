import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PayPalDonateButton from '@/Components/PayPalDonateButton';

export default function About() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const skills = [
        { name: 'PHP', percentage: 90, color: 'bg-green-500' },
        { name: 'MySQL', percentage: 85, color: 'bg-blue-500' },
        { name: 'JavaScript', percentage: 80, color: 'bg-yellow-500' },
        { name: 'HTML', percentage: 95, color: 'bg-red-500' },
        { name: 'Tailwind CSS', percentage: 75, color: 'bg-teal-500' },
        { name: 'Design', percentage: 65, color: 'bg-purple-500' },
        { name: 'React', percentage: 70, color: 'bg-indigo-500' },
        { name: 'Laravel', percentage: 90, color: 'bg-green-500' },
    ];

    return (
        <>
            <Head>
                <title>About Joshua Ackerly | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Meet Joshua Ackerly — the developer behind Graveyard Jokes Studios. Discover his journey, skills, and story behind the brand."
                />
                <meta
                    name="keywords"
                    content="Joshua Ackerly, Graveyard Jokes Studios, web developer, web designer, portfolio, skills, Laravel, React, Tailwind CSS"
                />

                {/* Canonical */}
                <link rel="canonical" href="https://graveyardjokes.com/about" />

                {/* Open Graph */}
                <meta property="og:title" content="About Joshua Ackerly | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Meet Joshua Ackerly — the developer behind Graveyard Jokes Studios. Discover his journey, skills, and story behind the brand."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/about" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="About Joshua Ackerly | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Meet Joshua Ackerly — the developer behind Graveyard Jokes Studios. Discover his journey, skills, and story behind the brand."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />

                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Joshua Ackerly",
  "url": "https://graveyardjokes.com",
  "sameAs": [
    "https://www.linkedin.com/in/joshua-ackerly",
    "https://github.com/joshua-ackerly"
  ],
  "jobTitle": "Web Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "GraveYard Jokes Studios Inc."
  }
}
    `}
                </script>
            </Head>

            <MainLayout>
                <motion.main
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-0 max-w-full overflow-hidden bg-[var(--color-foreground)] text-center shadow-lg"
                >
                    {/* Hero Banner */}
                    <div className="absolute inset-0 max-h-96">
                        <img
                            src={`${cdn}/images/aboutBanner.webp`}
                            loading="lazy"
                            alt="Abstract graveyard-themed banner"
                            className="pointer-events-none h-full w-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-foreground)] to-transparent" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center px-6 py-12 text-white sm:px-12">
                        <motion.h1
                            className="text-4xl font-bold underline decoration-[var(--color-primary)]"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            About the Creator
                        </motion.h1>
                    </div>

                    {/* Profile Section */}
                    <div className="relative flex flex-col items-center justify-center px-4">
                        <motion.div
                            className="flex items-center justify-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex h-48 w-48 items-center justify-center rounded-full border-4 border-[var(--primary)] shadow-xl sm:h-80 sm:w-80">
                                <div className="flex h-44 w-44 items-center justify-center rounded-full border-2 border-[var(--accent)] sm:h-72 sm:w-72">
                                    <img
                                        src={`${cdn}/images/profileImage.webp`}
                                        loading="lazy"
                                        alt="Joshua Ackerly's profile picture"
                                        className="h-40 w-40 rounded-full object-cover sm:h-64 sm:w-64"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Bio Section (Mobile + Desktop) */}
                        <motion.div
                            className="mt-8 max-w-xl border-2 border-[var(--accent)] bg-[var(--card)] p-6 text-left text-white shadow-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <p className="leading-relaxed">
                                Hi! I’m <span className="font-semibold text-[var(--primary)]">Joshua Ackerly</span>, a passionate web developer and
                                designer. I thrive at the intersection of technology and creativity, using{' '}
                                <span className="font-semibold text-[var(--primary)]">Laravel, React, and Tailwind CSS</span> to build functional,
                                elegant, and expressive websites. This portfolio is more than a resume — it’s a glimpse into a developer who builds
                                with purpose.
                            </p>
                        </motion.div>
                    </div>

                    {/* Resume + CTA */}
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <a
                            href={`${cdn}/documents/Joshua.pdf`}
                            download
                            className="text-[var(--primary)] underline transition hover:text-[var(--accent-foreground)]"
                        >
                            Download My Resume
                        </a>
                        <a
                            href="/contact"
                            className="rounded-lg bg-[var(--card)] px-6 py-3 font-semibold text-white shadow transition hover:bg-[var(--accent)]"
                        >
                            Let's Work Together
                        </a>
                    </div>

                    {/* Skills Section */}
                    <div className="mt-16 px-4">
                        <motion.h2
                            className="text-3xl font-semibold text-[var(--primary)] underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            Skills
                        </motion.h2>
                        <div className="m-8 mx-auto grid max-w-4xl grid-cols-1 gap-6 border-2 border-[var(--accent)] bg-[var(--card)] p-8 shadow-md sm:grid-cols-2">
                            {skills.map((skill) => (
                                <motion.div
                                    key={skill.name}
                                    className="flex items-center space-x-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <p className="w-24 flex-shrink-0 p-2 text-left font-medium text-white">{skill.name}</p>
                                    <div className="h-6 flex-grow overflow-hidden rounded-lg bg-gray-300">
                                        <motion.div
                                            className={`${skill.color} h-full`}
                                            style={{ width: `${skill.percentage}%` }}
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${skill.percentage}%` }}
                                            transition={{ duration: 0.8 }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Story Section */}
                    <div className="mt-10 flex flex-col items-center px-4 pb-20">
                        <motion.h2
                            className="text-3xl font-semibold text-[var(--primary)] underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            The Story of GraveyardJokes Studios
                        </motion.h2>
                        <motion.div
                            className="m-8 w-full max-w-3xl border-2 border-[var(--accent)] bg-[var(--card)] p-8 text-left text-white shadow-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <p className="mb-4 leading-relaxed">
                                What started as a late-night idea and a domain name —{' '}
                                <span className="font-semibold text-[--primary]">GraveyardJokes.com</span> — evolved into a brand focused on creative
                                web experiences and expressive design.
                            </p>
                            <p className="mb-4 leading-relaxed">
                                Long nights of learning and experimentation shaped it into a studio where humor meets function. From interfaces to
                                full-stack applications, <span className="font-semibold text-[--primary]">GraveyardJokes Studios</span> reflects both
                                grit and creative spark.
                            </p>
                            <p className="leading-relaxed">Today, it's a playground for merging tech with style, function with fun.</p>
                        </motion.div>
                    </div>

                    {/* Support Section */}
                    <div className="mt-16 px-4 pb-20">
                        <PayPalDonateButton />
                    </div>
                </motion.main>
            </MainLayout>
        </>
    );
}
