import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Services() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const packages = [
        {
            title: 'Starter Package',
            price: '$600',
            description: 'Perfect for artists and musicians starting their online presence',
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
            title: 'Professional Package',
            price: '$1,500',
            description: 'Ideal for established artists with growing audiences',
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
            title: 'Premium Package',
            price: '$3,000+',
            description: 'Full-featured solution for serious professionals',
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

    return (
        <>
            <Head>
                <title>Services & Pricing | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Explore our web design and development packages. Custom solutions for musicians, artists, and creatives."
                />
                <meta name="keywords" content="web design packages, pricing, custom websites, musicians, artists, web development services" />
                <link rel="canonical" href="https://graveyardjokes.com/services" />

                {/* Open Graph */}
                <meta property="og:title" content="Services & Pricing | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Explore our web design and development packages. Custom solutions for musicians, artists, and creatives."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Services & Pricing | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Explore our web design and development packages. Custom solutions for musicians, artists, and creatives."
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
                            Choose the package that fits your needs. All packages include responsive design, modern tech stack, and ongoing support.
                        </motion.p>
                    </div>

                    {/* Packages Grid */}
                    <div className="relative mx-auto mt-6 max-w-7xl px-3 pb-20 sm:mt-8 sm:px-4 sm:pb-32" style={{ maxWidth: '100vw' }}>
                        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3" style={{ maxWidth: '100%' }}>
                            {packages.map((pkg) => (
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
                                            <span className="text-3xl font-bold text-(--primary) sm:text-4xl">{pkg.price}</span>
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

                                    <Link
                                        href={pkg.link}
                                        className="mt-auto block w-full rounded-lg bg-(--primary) px-6 py-3 text-center font-semibold text-white transition hover:bg-(--accent)"
                                    >
                                        View Details & Purchase
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
