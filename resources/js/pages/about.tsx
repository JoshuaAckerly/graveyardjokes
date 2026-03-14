import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { getEnvVar, getProjectUrl } from '../env';

export default function About() {
    const cdn = getEnvVar('VITE_ASSET_URL');

    const highlights = [
        { value: '8+', label: 'Years Building' },
        { value: '30+', label: 'Web Projects Shipped' },
        { value: '6', label: 'Active Sister Platforms' },
        { value: '100%', label: 'Custom-First Mindset' },
    ];

    const skills = [
        { name: 'PHP', percentage: 90, color: 'bg-green-500' },
        { name: 'Laravel', percentage: 90, color: 'bg-emerald-500' },
        { name: 'MySQL', percentage: 85, color: 'bg-blue-500' },
        { name: 'JavaScript', percentage: 80, color: 'bg-yellow-500' },
        { name: 'TypeScript', percentage: 75, color: 'bg-blue-400' },
        { name: 'React', percentage: 70, color: 'bg-indigo-500' },
        { name: 'Tailwind CSS', percentage: 75, color: 'bg-teal-500' },
        { name: 'Design', percentage: 70, color: 'bg-purple-500' },
        { name: 'Linux / DevOps', percentage: 60, color: 'bg-orange-500' },
    ];

    const specialties = [
        {
            icon: 'FS',
            title: 'Full-Stack Web Apps',
            body: 'I build complete applications from backend architecture to polished interfaces using Laravel, Inertia, React, and TypeScript.',
        },
        {
            icon: 'UX',
            title: 'Brand-Driven UI/UX',
            body: 'I design interfaces with personality. The goal is always the same: memorable visuals that still feel intuitive and fast.',
        },
        {
            icon: 'MU',
            title: 'Music + Media Platforms',
            body: 'A major part of my work serves artists, labels, and underground scenes with custom publishing, streaming, and community features.',
        },
        {
            icon: 'OS',
            title: 'Open Source Workflow',
            body: 'I build in public where possible, share practical code, and keep systems transparent so others can learn from real production work.',
        },
    ];

    const process = [
        {
            step: '01',
            title: 'Discovery',
            desc: 'Clarify the brand voice, audience, and business goals before touching code.',
        },
        {
            step: '02',
            title: 'Architecture',
            desc: 'Design a maintainable structure for data, routes, components, and deployment.',
        },
        {
            step: '03',
            title: 'Build + Iterate',
            desc: 'Ship quickly, test in real conditions, and improve based on usage and feedback.',
        },
        {
            step: '04',
            title: 'Launch + Support',
            desc: 'Deploy cleanly, monitor behavior, and keep improving after day one.',
        },
    ];

    const timeline = [
        {
            year: '2016',
            label: 'The Spark',
            desc: 'Started learning HTML, CSS, and JavaScript through late-night experiments and personal projects.',
        },
        {
            year: '2019',
            label: 'GraveyardJokes Is Born',
            desc: 'Registered GraveyardJokes.com as a creative idea that quickly grew into a serious long-term brand.',
        },
        {
            year: '2021',
            label: 'Going Full-Stack',
            desc: 'Shifted from static sites into Laravel applications with real databases, auth systems, and production deployment.',
        },
        {
            year: '2023',
            label: 'Ecosystem Expansion',
            desc: 'Launched multiple sister platforms in publishing and music to serve different creative communities.',
        },
        {
            year: '2024',
            label: 'Studio Incorporated',
            desc: 'Formalized as GraveYard Jokes Studios Inc. and expanded service offerings for startups and artists.',
        },
    ];

    const ecosystem = [
        {
            name: 'GraveyardJokes Studios',
            desc: 'The main portfolio, service hub, and parent studio for the entire ecosystem.',
            href: 'https://graveyardjokes.com',
            tag: 'Portfolio / Services',
        },
        {
            name: 'HollowPress',
            desc: 'A publishing platform for writers and editorial teams that need clean workflows and flexible content tools.',
            href: 'https://hollowpress.graveyardjokes.com',
            tag: 'Publishing',
        },
        {
            name: 'LunarBlood',
            desc: 'An underground music platform focused on alternative and experimental artists.',
            href: 'https://lunarblood.graveyardjokes.com',
            tag: 'Music Platform',
        },
        {
            name: 'SynthVeil',
            desc: 'A destination for electronic and synth-driven artist discovery and promotion.',
            href: 'https://synthveil.graveyardjokes.com',
            tag: 'Electronic Music',
        },
        {
            name: 'The Velvet Pulse',
            desc: 'Music journalism, artist features, and culture coverage with a distinct editorial tone.',
            href: 'https://thevelvetpulse.graveyardjokes.com',
            tag: 'Editorial',
        },
        {
            name: 'Velvet Radio',
            desc: 'Internet radio project for curated independent and underground music.',
            href: 'https://velvetradio.graveyardjokes.com',
            tag: 'Internet Radio',
        },
    ];

    const values = [
        {
            title: 'Build With Purpose',
            body: 'Every feature should serve a clear user or business goal, not just fill a layout.',
        },
        {
            title: 'Craft Over Shortcuts',
            body: 'Templates can help speed, but quality comes from custom decisions and attention to detail.',
        },
        {
            title: 'Clear Communication',
            body: 'No guesswork, no vague promises, and no hidden surprises in timelines or scope.',
        },
    ];

    const tools = [
        'PHP',
        'Laravel',
        'React',
        'TypeScript',
        'JavaScript',
        'Tailwind CSS',
        'Inertia.js',
        'Vite',
        'MySQL',
        'PostgreSQL',
        'Redis',
        'Git',
        'GitHub',
        'Nginx',
        'Linux',
        'Docker',
        'Figma',
        'Adobe CC',
        'VS Code',
        'PHPStan',
        'Jest',
    ];

    const projectUrl = getProjectUrl('graveyardjokes');

    return (
        <>
            <InertiaHead>
                <title>About Joshua Ackerly | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Meet Joshua Ackerly, full-stack developer and founder of Graveyard Jokes Studios. Explore his story, skills, process, and platform ecosystem."
                />
                <meta
                    name="keywords"
                    content="Joshua Ackerly, Graveyard Jokes Studios, full-stack developer, Laravel, React, TypeScript, Tailwind, web design, music platform development"
                />

                <link rel="canonical" href={`${projectUrl}about`} />

                <meta property="og:title" content="About Joshua Ackerly | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="A deeper look at the founder, workflow, skills, and projects behind Graveyard Jokes Studios."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${projectUrl}about`} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="About Joshua Ackerly | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="A deeper look at the founder, workflow, skills, and projects behind Graveyard Jokes Studios."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />

                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Joshua Ackerly",
  "url": "https://graveyardjokes.com",
  "sameAs": [
    "https://www.linkedin.com/in/joshua-ackerly",
    "https://github.com/JoshuaAckerly"
  ],
  "jobTitle": "Full-Stack Web Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "GraveYard Jokes Studios Inc."
  }
}
                    `}
                </script>
            </InertiaHead>

            <MainLayout>
                <motion.main
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.45 }}
                    className="relative z-0 max-w-full overflow-hidden bg-[var(--color-foreground)] text-center shadow-lg"
                >
                    <div className="absolute inset-0 max-h-[28rem]">
                        <img
                            src={`${cdn}/images/aboutBanner.webp`}
                            loading="lazy"
                            alt="Abstract graveyard-themed banner"
                            className="pointer-events-none h-full w-full object-cover opacity-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-foreground)] via-[var(--color-foreground)]/60 to-transparent" />
                    </div>

                    <section className="relative z-10 mx-auto max-w-5xl px-6 pt-14 pb-12 text-white sm:px-10">
                        <motion.p
                            className="mb-3 text-xs font-semibold tracking-[0.25em] text-[var(--primary)] uppercase"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                        >
                            About The Founder
                        </motion.p>
                        <motion.h1
                            className="text-4xl leading-tight font-bold sm:text-5xl"
                            initial={{ opacity: 0, y: -18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55 }}
                        >
                            Joshua Ackerly
                        </motion.h1>
                        <motion.p
                            className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            Graveyard Jokes Studios is where engineering discipline meets creative identity. I build robust, expressive web platforms
                            for startups, musicians, and independent brands that need more than a generic template.
                        </motion.p>
                    </section>

                    <section className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 pb-6 sm:px-8 lg:grid-cols-[300px_1fr]">
                        <motion.div
                            className="flex items-start justify-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex h-64 w-64 items-center justify-center rounded-full border-4 border-[var(--primary)] bg-[var(--color-foreground)] shadow-xl sm:h-72 sm:w-72">
                                <div className="flex h-56 w-56 items-center justify-center rounded-full border-2 border-[var(--accent)] sm:h-64 sm:w-64">
                                    <img
                                        src={`${cdn}/images/profileImage.webp`}
                                        loading="lazy"
                                        alt="Joshua Ackerly profile photo"
                                        className="h-52 w-52 rounded-full object-cover sm:h-60 sm:w-60"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="border-2 border-[var(--accent)] bg-[var(--card)] p-6 text-left text-white shadow-md sm:p-8"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                        >
                            <h2 className="mb-4 text-2xl font-semibold text-[var(--primary)]">Who I Am</h2>
                            <p className="mb-4 leading-relaxed text-white/90">
                                I am a full-stack developer focused on custom digital experiences. My day-to-day work includes architecture planning,
                                backend development, API and database design, frontend UX implementation, and production deployment.
                            </p>
                            <p className="mb-4 leading-relaxed text-white/90">
                                I primarily work with Laravel + React and build around long-term maintainability. The result is software that feels
                                original, performs well, and can evolve with your brand.
                            </p>
                            <p className="leading-relaxed text-white/90">
                                Graveyard Jokes Studios was built to help creative businesses launch serious products without losing their voice.
                            </p>

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                <a
                                    href={`${cdn}/documents/Joshua.pdf`}
                                    download
                                    className="inline-flex items-center justify-center rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]"
                                >
                                    Download Resume
                                </a>
                                <a
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-lg border-2 border-[var(--accent)] bg-transparent px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]"
                                >
                                    Start A Project
                                </a>
                            </div>
                        </motion.div>
                    </section>

                    <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:px-8">
                        {highlights.map((item, idx) => (
                            <motion.div
                                key={item.label}
                                className="border border-[var(--accent)] bg-[var(--card)] p-4 shadow-md"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.07 * idx + 0.15, duration: 0.4 }}
                            >
                                <p className="text-2xl font-bold text-[var(--primary)] sm:text-3xl">{item.value}</p>
                                <p className="mt-1 text-xs tracking-wide text-white/70 uppercase sm:text-sm">{item.label}</p>
                            </motion.div>
                        ))}
                    </section>

                    <section className="mt-16 px-4 sm:px-8">
                        <motion.h2
                            className="text-3xl font-semibold text-[var(--primary)] underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            What I Build
                        </motion.h2>
                        <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2">
                            {specialties.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    className="border-2 border-[var(--accent)] bg-[var(--card)] p-6 text-left text-white shadow-md"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * idx + 0.2, duration: 0.45 }}
                                >
                                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--color-foreground)] text-xs font-bold text-[var(--primary)]">
                                        {item.icon}
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-[var(--primary)]">{item.title}</h3>
                                    <p className="leading-relaxed text-white/80">{item.body}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-16 px-4 sm:px-8">
                        <motion.h2
                            className="text-3xl font-semibold text-[var(--primary)] underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            Core Skills
                        </motion.h2>
                        <div className="mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-5 border-2 border-[var(--accent)] bg-[var(--card)] p-6 text-left shadow-md sm:grid-cols-2 sm:p-8">
                            {skills.map((skill, idx) => (
                                <motion.div
                                    key={skill.name}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.04 * idx + 0.2, duration: 0.4 }}
                                >
                                    <p className="w-28 flex-shrink-0 text-sm font-medium text-white">{skill.name}</p>
                                    <div className="h-4 flex-grow overflow-hidden rounded bg-[var(--accent)]">
                                        <motion.div
                                            className={`${skill.color} h-full`}
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${skill.percentage}%` }}
                                            transition={{ delay: 0.04 * idx + 0.45, duration: 0.75 }}
                                        />
                                    </div>
                                    <span className="w-10 text-right text-xs text-white/70">{skill.percentage}%</span>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-16 px-4 sm:px-8">
                        <motion.h2
                            className="text-3xl font-semibold text-[var(--primary)] underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            Build Process
                        </motion.h2>
                        <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {process.map((item, idx) => (
                                <motion.div
                                    key={item.step}
                                    className="border-2 border-[var(--accent)] bg-[var(--card)] p-5 text-left text-white shadow-md"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 * idx + 0.2, duration: 0.45 }}
                                >
                                    <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[var(--primary)] uppercase">Step {item.step}</p>
                                    <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                                    <p className="leading-relaxed text-white/80">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-16 px-4 sm:px-8">
                        <motion.h2
                            className="text-3xl font-semibold text-[var(--primary)] underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            The Journey
                        </motion.h2>
                        <div className="mx-auto mt-8 w-full max-w-4xl text-left">
                            {timeline.map((item, idx) => (
                                <motion.div
                                    key={item.year}
                                    className="relative flex gap-4 sm:gap-6"
                                    initial={{ opacity: 0, x: -18 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.08 * idx + 0.2, duration: 0.45 }}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="h-4 w-4 rounded-full border-2 border-[var(--primary)] bg-[var(--color-foreground)]" />
                                        {idx < timeline.length - 1 && <div className="h-full w-0.5 bg-[var(--accent)]" />}
                                    </div>
                                    <div className="mb-8 rounded border border-[var(--accent)] bg-[var(--card)] p-4 text-white shadow-md sm:p-5">
                                        <p className="text-xs font-semibold tracking-[0.18em] text-[var(--primary)] uppercase">{item.year}</p>
                                        <h3 className="mt-1 text-lg font-semibold">{item.label}</h3>
                                        <p className="mt-2 leading-relaxed text-white/80">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-16 px-4 sm:px-8">
                        <motion.h2
                            className="text-3xl font-semibold text-[var(--primary)] underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            Studio Ecosystem
                        </motion.h2>
                        <motion.p
                            className="mx-auto mt-4 max-w-3xl text-white/75"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.45 }}
                        >
                            Graveyard Jokes Studios powers a network of focused products in publishing, music discovery, and media. Each platform is
                            designed for a specific community and built on the same reliability standards.
                        </motion.p>
                        <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {ecosystem.map((item, idx) => (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block border-2 border-[var(--accent)] bg-[var(--card)] p-5 text-left text-white shadow-md transition hover:border-[var(--primary)]"
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 * idx + 0.2, duration: 0.45 }}
                                >
                                    <p className="text-xs font-semibold tracking-[0.16em] text-[var(--primary)] uppercase">{item.tag}</p>
                                    <h3 className="mt-2 text-lg font-semibold">{item.name}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/80">{item.desc}</p>
                                </motion.a>
                            ))}
                        </div>
                    </section>

                    <section className="mt-16 px-4 sm:px-8">
                        <motion.h2
                            className="text-3xl font-semibold text-[var(--primary)] underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            Working Principles
                        </motion.h2>
                        <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-3">
                            {values.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    className="border-2 border-[var(--accent)] bg-[var(--card)] p-6 text-left text-white shadow-md"
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 * idx + 0.2, duration: 0.45 }}
                                >
                                    <h3 className="mb-2 text-lg font-semibold text-[var(--primary)]">{item.title}</h3>
                                    <p className="leading-relaxed text-white/80">{item.body}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-16 px-4 sm:px-8">
                        <motion.h2
                            className="text-3xl font-semibold text-[var(--primary)] underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            Tools And Technologies
                        </motion.h2>
                        <motion.div
                            className="mx-auto mt-8 flex w-full max-w-5xl flex-wrap justify-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.45 }}
                        >
                            {tools.map((tool) => (
                                <span
                                    key={tool}
                                    className="rounded border border-[var(--accent)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-white"
                                >
                                    {tool}
                                </span>
                            ))}
                        </motion.div>
                    </section>

                    <section className="mt-16 px-4 sm:px-8">
                        <motion.h2
                            className="text-3xl font-semibold text-[var(--primary)] underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            Open Source And Community
                        </motion.h2>
                        <motion.div
                            className="mx-auto mt-8 w-full max-w-4xl border-2 border-[var(--accent)] bg-[var(--card)] p-6 text-left text-white shadow-md sm:p-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.45 }}
                        >
                            <p className="mb-4 leading-relaxed text-white/90">
                                I share code because practical examples help people faster than theory alone. My repositories include production apps,
                                experiments, and reusable components.
                            </p>
                            <p className="leading-relaxed text-white/90">
                                If you are curious how something works, feel free to dig in, fork, and adapt it to your own work.
                            </p>

                            <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                                <a
                                    href="https://github.com/JoshuaAckerly"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]"
                                >
                                    View GitHub Profile
                                </a>
                                <a
                                    href="https://github.com/JoshuaAckerly/graveyardjokes"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-lg border-2 border-[var(--accent)] bg-transparent px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]"
                                >
                                    View This Site Repository
                                </a>
                            </div>
                        </motion.div>
                    </section>

                    <section className="mt-16 px-4 pb-24 sm:px-8">
                        <motion.h2
                            className="text-3xl font-semibold text-[var(--primary)] underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            Ready To Build Something Real?
                        </motion.h2>
                        <motion.p
                            className="mx-auto mt-4 max-w-3xl text-white/75"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.45 }}
                        >
                            If you need a website or platform that reflects your identity and can scale with your goals, I am ready to help.
                        </motion.p>
                        <motion.div
                            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.45 }}
                        >
                            <a
                                href="/contact"
                                className="rounded-lg bg-[var(--primary)] px-8 py-4 font-semibold text-white shadow transition hover:bg-[var(--accent)]"
                            >
                                Contact Me
                            </a>
                            <a
                                href="/services"
                                className="rounded-lg border-2 border-[var(--accent)] bg-transparent px-8 py-4 font-semibold text-white shadow transition hover:bg-[var(--accent)]"
                            >
                                View Services
                            </a>
                        </motion.div>
                    </section>
                </motion.main>
            </MainLayout>
        </>
    );
}
