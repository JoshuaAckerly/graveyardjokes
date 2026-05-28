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
            description: 'Get your social presence off the ground on 3 platforms',
            features: [
                'Account setup & branding on 3 platforms',
                'Monthly content calendar',
                'Up to 12 posts per month',
                'Caption writing & hashtag strategy',
                'Monthly analytics report',
                '1 month of support',
            ],
            link: '/services/starter',
            popular: false,
        },
        {
            slug: 'professional',
            title: 'Professional Package',
            price: 1499,
            description: 'Full management across 5 platforms with content creation',
            features: [
                'Everything in Starter',
                'Up to 20 posts per month',
                'Reels & short-form video content',
                'Audience engagement & community management',
                'Competitor analysis',
                'Bi-weekly performance reports',
                '3 months of support',
            ],
            link: '/services/professional',
            popular: true,
        },
        {
            slug: 'premium',
            title: 'Premium Package',
            price: 2499,
            description: 'Complete social media strategy with ad campaigns',
            features: [
                'Everything in Professional',
                'Paid ad campaign management',
                'Influencer outreach',
                '7+ platform coverage',
                'Weekly strategy calls',
                'Monthly brand story content',
                '6 months of support',
                'Priority response',
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
            title: 'SEO - Starter',
            price: 799,
            description: 'Keyword research and on-page SEO foundations',
            features: [
                'Keyword research (up to 10 keywords)',
                'On-page SEO audit',
                'Meta title & description optimization',
                'Google Search Console setup',
                'Sitemap & robots.txt review',
                'Monthly traffic report',
                '1 month of support',
            ],
            link: '/services/design-starter',
            popular: false,
        },
        {
            slug: 'design-professional',
            title: 'SEO - Professional',
            price: 999,
            description: 'Full on-page and technical SEO with competitor analysis',
            features: [
                'Everything in Starter',
                'Technical SEO audit & fixes',
                'Backlink analysis',
                'Content optimization for 10 pages',
                'Local SEO setup',
                'Competitor keyword analysis',
                'Bi-monthly reporting',
                '3 months of support',
            ],
            link: '/services/design-professional',
            popular: true,
        },
        {
            slug: 'design-premium',
            title: 'SEO - Premium',
            price: 1799,
            description: 'Full SEO strategy with backlink building and content planning',
            features: [
                'Everything in Professional',
                '20+ keyword targets',
                'Backlink building campaign',
                'Full content strategy & planning',
                'Structured data / schema markup',
                'Monthly strategy call',
                'Quarterly SEO audit',
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
            title: 'Website Mgmt - Starter',
            price: 799,
            description: 'Monthly maintenance & security keeping your site healthy',
            features: [
                'Monthly security scans',
                'Plugin & dependency updates',
                'Uptime monitoring',
                'Weekly automated backups',
                'Bug fixes (up to 2/month)',
                'Monthly health report',
                '2 weeks of support',
            ],
            link: '/services/modernization-starter',
            popular: false,
        },
        {
            slug: 'modernization-professional',
            title: 'Website Mgmt - Professional',
            price: 1299,
            description: 'Full maintenance plus performance tuning and content updates',
            features: [
                'Everything in Starter',
                'Performance optimization',
                'Content updates (up to 5/month)',
                'Image optimization',
                'Analytics review & reporting',
                'Priority support',
                '1 month of support',
            ],
            link: '/services/modernization-professional',
            popular: true,
        },
        {
            slug: 'modernization-premium',
            title: 'Website Mgmt - Premium',
            price: 1999,
            description: 'Unlimited updates, strategy consultation & growth reviews',
            features: [
                'Everything in Professional',
                'Unlimited content updates',
                'A/B testing',
                'E-commerce support',
                'Advanced security & firewall',
                'Monthly strategy consultation',
                'Quarterly site redesign review',
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
                    content="Graveyard Jokes Studios offers social media management, SEO management, and website management services for small businesses and independent brands."
                />
                <meta
                    name="keywords"
                    content="social media management, SEO management, website management, small business, online presence, digital marketing services"
                />
                <link rel="canonical" href={`${projectUrl}services`} />

                {/* Open Graph */}
                <meta property="og:title" content="Services & Pricing | Graveyard Jokes Studios" />
                <meta
                    name="og:description"
                    content="Graveyard Jokes Studios offers social media management, SEO management, and website management services for small businesses and independent brands."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${projectUrl}services`} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Services & Pricing | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Graveyard Jokes Studios offers social media management, SEO management, and website management services for small businesses and independent brands."
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
                            Choose the package that fits your needs. All packages include dedicated support, regular reporting, and hands-on
                            management tailored for small businesses and independent brands.
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
                        {/* Social Media Management Section */}
                        <div className="mb-16">
                            <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">Social Media Management</h2>
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

                        {/* SEO Management Section */}
                        <div className="mb-16">
                            <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">SEO Management</h2>
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

                        {/* Website Management Section */}
                        <div>
                            <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">Website Management</h2>
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
