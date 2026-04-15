import PackagePaymentGate, { type PackageSlug } from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { getProjectUrl } from '../env';

export default function Services() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const websitePackages: Array<{
        slug: PackageSlug;
        title: string;
        price: number;
        description: string;
        features: string[];
        link: string;
        popular: boolean;
    }> = [
        {
            slug: 'starter',
            title: 'Starter Package',
            price: 799,
            description: 'Perfect for startups launching their first website',
            features: [
                'Single-page responsive website',
                'Contact form integration',
                'Social media links',
                'Mobile-optimized design',
                'Basic SEO setup',
                '1 month of support',
            ],
            link: '/services/starter',
            popular: false,
        },
        {
            slug: 'professional',
            title: 'Professional Package',
            price: 1499,
            description: 'Ideal for growing startups needing more features',
            features: [
                'Multi-page custom website',
                'Blog or news section',
                'Photo/video galleries',
                'Newsletter integration',
                'Advanced SEO optimization',
                'Analytics setup',
                '3 months of support',
                'Social media integration',
            ],
            link: '/services/professional',
            popular: true,
        },
        {
            slug: 'premium',
            title: 'Premium Package',
            price: 2499,
            description: 'Full-featured solution for established startups',
            features: [
                'Everything in Professional',
                'E-commerce/merch store',
                'Event calendar & ticketing',
                'Music/video streaming',
                'Custom animations & effects',
                'API integrations',
                '6 months of support',
                'Priority updates',
            ],
            link: '/services/premium',
            popular: false,
        },
    ];

    const designPackages: Array<{
        slug: PackageSlug;
        title: string;
        price: number;
        description: string;
        features: string[];
        link: string;
        popular: boolean;
    }> = [
        {
            slug: 'design-starter',
            title: 'Design - Starter',
            price: 499,
            description: 'Wireframes and design mockups',
            features: [
                'Wireframes for 3-5 pages',
                'Design mockups in Figma',
                'Brand color palette',
                'Mobile-first design',
                'Icon set suggestions',
                '2 rounds of revisions',
                '1 month of support',
            ],
            link: '/services/design-starter',
            popular: false,
        },
        {
            slug: 'design-professional',
            title: 'Design - Professional',
            price: 999,
            description: 'Complete UI design system & prototypes',
            features: [
                'Everything in Starter',
                'Custom UI design system',
                'Interactive prototypes',
                'Design specifications',
                'Full brand guidelines',
                'Logo design or refinement',
                '4 rounds of revisions',
                '3 months of support',
            ],
            link: '/services/design-professional',
            popular: true,
        },
        {
            slug: 'design-premium',
            title: 'Design - Premium',
            price: 1799,
            description: 'Premium brand identity & ongoing consultation',
            features: [
                'Everything in Professional',
                'Premium brand identity',
                'Custom illustrations',
                'Animation design specs',
                'Accessibility audit',
                'Design tokens & CSS system',
                'Unlimited revisions',
                '6 months of support',
            ],
            link: '/services/design-premium',
            popular: false,
        },
    ];

    const modernizationPackages: Array<{
        slug: PackageSlug;
        title: string;
        price: number;
        description: string;
        features: string[];
        link: string;
        popular: boolean;
    }> = [
        {
            slug: 'modernization-starter',
            title: 'Modernization - Starter',
            price: 699,
            description: 'Visual refresh & performance updates',
            features: [
                'Visual design refresh',
                'Navigation updates',
                'Mobile responsiveness',
                'Performance optimization',
                'SEO recommendations',
                'Security scan',
                'Improvement roadmap',
                '2 weeks of support',
            ],
            link: '/services/modernization-starter',
            popular: false,
        },
        {
            slug: 'modernization-professional',
            title: 'Modernization - Professional',
            price: 1299,
            description: 'Complete design & code refresh',
            features: [
                'Everything in Starter',
                'Design & code refresh',
                'Modern framework update',
                'Accessibility compliance',
                'Advanced SEO',
                'Performance monitoring',
                'Image optimization',
                '1 month of support',
            ],
            link: '/services/modernization-professional',
            popular: true,
        },
        {
            slug: 'modernization-premium',
            title: 'Modernization - Premium',
            price: 1999,
            description: 'Full tech migration & strategic consultation',
            features: [
                'Everything in Professional',
                'Full tech stack migration',
                'Advanced security',
                'Analytics & monitoring setup',
                'CMS & automation setup',
                'Backup & recovery setup',
                'Quarterly reviews',
                '3 months of support',
            ],
            link: '/services/modernization-premium',
            popular: false,
        },
    ];

    const projectUrl = getProjectUrl('graveyardjokes');
    return (
        <>
            <Head>
                <title>Services & Pricing | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Explore GraveyardJokes web design and development services, from custom websites and redesigns to SEO foundations, performance tuning, and support."
                />
                <meta name="keywords" content="web design packages, pricing, custom websites, startups, small businesses, web development services" />
                <link rel="canonical" href={`${projectUrl}services`} />

                {/* Open Graph */}
                <meta property="og:title" content="Services & Pricing | Graveyard Jokes Studios" />
                <meta
                    name="og:description"
                    content="Explore GraveyardJokes web design and development services, from custom websites and redesigns to SEO foundations, performance tuning, and support."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${projectUrl}services`} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Services & Pricing | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Explore GraveyardJokes web design and development services, from custom websites and redesigns to SEO foundations, performance tuning, and support."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />
            </Head>

            <MainLayout>
                <div className="relative max-w-full bg-foreground text-center shadow-lg">
                    {/* Hero Banner */}
                    <div className="absolute inset-0 max-h-96">
                        <img
                            src={`${cdn}/images/AdobeStock_949366383.webp`}
                            loading="lazy"
                            alt="Services hero banner"
                            className="pointer-events-none h-full w-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-foreground to-transparent" />
                    </div>

                    {/* Header Section */}
                    <div className="relative z-10 flex flex-col items-center px-4 py-8 text-white sm:px-8 sm:py-12 md:px-12">
                        <motion.h1
                            className="text-3xl font-bold underline decoration-(--primary) sm:text-4xl md:text-5xl"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Services & Pricing
                        </motion.h1>
                        <motion.p
                            className="mx-auto mt-3 max-w-2xl px-2 text-base text-gray-300 sm:mt-4 sm:text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            Choose the package that fits your needs. All packages include responsive design, modern tech stack, and ongoing support
                            tailored for startups.
                        </motion.p>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
                            <Link
                                href="/services/intake"
                                className="mt-4 inline-flex rounded-md border border-(--primary) bg-black/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--primary)"
                            >
                                Start Project Questionnaire First
                            </Link>
                        </motion.div>
                    </div>

                    {/* Packages Grid */}
                    <div className="relative mx-auto mt-6 max-w-7xl px-3 pb-20 sm:mt-8 sm:px-4 sm:pb-32" style={{ maxWidth: '100vw' }}>
                        {/* Website Development Section */}
                        <div className="mb-16">
                            <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">Website Development</h2>
                            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3" style={{ maxWidth: '100%' }}>
                                {websitePackages.map((pkg) => (
                                    <motion.div
                                        key={pkg.title}
                                        className={`relative z-0 flex flex-col rounded-lg border-2 p-4 shadow-lg transition sm:p-6 ${
                                            pkg.popular
                                                ? 'border-(--primary) bg-(--card) shadow-(--primary)/20 shadow-xl'
                                                : 'border-(--accent) bg-(--card)'
                                        }`}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        {pkg.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-(--primary) px-4 py-1 text-xs font-bold text-white">
                                                MOST POPULAR
                                            </div>
                                        )}

                                        <div className="mb-3 text-center sm:mb-4">
                                            <h3 className="text-xl font-bold text-white sm:text-2xl">{pkg.title}</h3>
                                            <div className="mt-2 flex items-baseline justify-center gap-1">
                                                <span className="text-3xl font-bold text-(--primary) sm:text-4xl">${pkg.price}</span>
                                            </div>
                                            <p className="mt-2 text-xs text-gray-300 sm:text-sm">{pkg.description}</p>
                                        </div>

                                        <ul className="mb-6 flex-1 space-y-3">
                                            {pkg.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm text-gray-200">
                                                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-(--primary)" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-auto flex flex-col gap-2">
                                            <Link
                                                href={pkg.link}
                                                className="block w-full rounded-lg bg-(--primary) px-6 py-3 text-center font-semibold text-white transition hover:bg-(--accent)"
                                            >
                                                View Details
                                            </Link>
                                            <PackagePaymentGate amount={pkg.price} item={pkg.title} packageSlug={pkg.slug} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Website Design Section */}
                        <div className="mb-16">
                            <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">Website Design Services</h2>
                            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3" style={{ maxWidth: '100%' }}>
                                {designPackages.map((pkg) => (
                                    <motion.div
                                        key={pkg.title}
                                        className={`relative z-0 flex flex-col rounded-lg border-2 p-4 shadow-lg transition sm:p-6 ${
                                            pkg.popular
                                                ? 'border-(--primary) bg-(--card) shadow-(--primary)/20 shadow-xl'
                                                : 'border-(--accent) bg-(--card)'
                                        }`}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        {pkg.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-(--primary) px-4 py-1 text-xs font-bold text-white">
                                                MOST POPULAR
                                            </div>
                                        )}

                                        <div className="mb-3 text-center sm:mb-4">
                                            <h3 className="text-xl font-bold text-white sm:text-2xl">{pkg.title}</h3>
                                            <div className="mt-2 flex items-baseline justify-center gap-1">
                                                <span className="text-3xl font-bold text-(--primary) sm:text-4xl">${pkg.price}</span>
                                            </div>
                                            <p className="mt-2 text-xs text-gray-300 sm:text-sm">{pkg.description}</p>
                                        </div>

                                        <ul className="mb-6 flex-1 space-y-3">
                                            {pkg.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm text-gray-200">
                                                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-(--primary)" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-auto flex flex-col gap-2">
                                            <Link
                                                href={pkg.link}
                                                className="block w-full rounded-lg bg-(--primary) px-6 py-3 text-center font-semibold text-white transition hover:bg-(--accent)"
                                            >
                                                View Details
                                            </Link>
                                            <PackagePaymentGate amount={pkg.price} item={pkg.title} packageSlug={pkg.slug} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Website Modernization Section */}
                        <div>
                            <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">Website Modernization Services</h2>
                            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3" style={{ maxWidth: '100%' }}>
                                {modernizationPackages.map((pkg) => (
                                    <motion.div
                                        key={pkg.title}
                                        className={`relative z-0 flex flex-col rounded-lg border-2 p-4 shadow-lg transition sm:p-6 ${
                                            pkg.popular
                                                ? 'border-(--primary) bg-(--card) shadow-(--primary)/20 shadow-xl'
                                                : 'border-(--accent) bg-(--card)'
                                        }`}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        {pkg.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-(--primary) px-4 py-1 text-xs font-bold text-white">
                                                MOST POPULAR
                                            </div>
                                        )}

                                        <div className="mb-3 text-center sm:mb-4">
                                            <h3 className="text-xl font-bold text-white sm:text-2xl">{pkg.title}</h3>
                                            <div className="mt-2 flex items-baseline justify-center gap-1">
                                                <span className="text-3xl font-bold text-(--primary) sm:text-4xl">${pkg.price}</span>
                                            </div>
                                            <p className="mt-2 text-xs text-gray-300 sm:text-sm">{pkg.description}</p>
                                        </div>

                                        <ul className="mb-6 flex-1 space-y-3">
                                            {pkg.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm text-gray-200">
                                                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-(--primary)" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-auto flex flex-col gap-2">
                                            <Link
                                                href={pkg.link}
                                                className="block w-full rounded-lg bg-(--primary) px-6 py-3 text-center font-semibold text-white transition hover:bg-(--accent)"
                                            >
                                                View Details
                                            </Link>
                                            <PackagePaymentGate amount={pkg.price} item={pkg.title} packageSlug={pkg.slug} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
