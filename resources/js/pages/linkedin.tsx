import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Briefcase, Globe, Users } from 'lucide-react';

const LINKEDIN_URL = 'https://www.linkedin.com/company/graveyard-jokes-studios';

export default function LinkedIn() {
    const highlights = [
        {
            icon: <Globe className="h-5 w-5" />,
            label: 'Location',
            value: 'Cheektowaga, New York, USA',
        },
        {
            icon: <Briefcase className="h-5 w-5" />,
            label: 'Industry',
            value: 'Web Development & Digital Services',
        },
        {
            icon: <Users className="h-5 w-5" />,
            label: 'Company size',
            value: 'Under 49 employees',
        },
    ];

    const services = ['eCommerce Development', 'Web Development', 'Web Design', 'SEO', 'Digital Marketing'];

    return (
        <MainLayout>
            <>
                <InertiaHead />

                <section className="relative z-0 flex flex-col items-center gap-10 rounded-lg bg-[var(--color-foreground)] p-6 text-white shadow-lg sm:p-10">
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl text-center"
                    >
                        <p className="mb-2 text-sm font-semibold tracking-widest text-[var(--accent)] uppercase">Business Profile</p>
                        <h1 className="text-5xl font-extrabold text-[var(--accent)]">LinkedIn</h1>
                        <p className="mt-4 text-lg text-white/70">
                            Follow Graveyard Jokes Studios on LinkedIn for company updates, project showcases, and industry insights.
                        </p>
                        <a
                            href={LINKEDIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0A66C2] px-8 py-3 font-semibold text-white transition hover:opacity-90"
                        >
                            View on LinkedIn <ArrowUpRight className="h-4 w-4" />
                        </a>
                    </motion.div>

                    {/* Company profile card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="w-full max-w-2xl rounded-lg border border-white/10 bg-white/5 p-8"
                    >
                        <h2 className="mb-6 text-xl font-bold text-white">Company Overview</h2>
                        <ul className="mb-6 space-y-4">
                            {highlights.map((h) => (
                                <li key={h.label} className="flex items-center gap-4">
                                    <span className="text-[var(--accent)]">{h.icon}</span>
                                    <div>
                                        <p className="text-xs tracking-wider text-white/40 uppercase">{h.label}</p>
                                        <p className="text-sm font-medium text-white">{h.value}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-white/10 pt-6">
                            <p className="mb-3 text-xs tracking-wider text-white/40 uppercase">Services</p>
                            <div className="flex flex-wrap gap-2">
                                {services.map((s) => (
                                    <span
                                        key={s}
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Secondary CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        >
                            View Portfolio
                        </Link>
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        >
                            Our Services
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        >
                            Contact Us
                        </Link>
                    </motion.div>
                </section>
            </>
        </MainLayout>
    );
}
