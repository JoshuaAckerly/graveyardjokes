import ServicePackageCard from '@/Components/ServicePackageCard';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

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
            hostedButtonId: '3C9XAYVTPYJM6', // Your actual button ID
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
            hostedButtonId: '74UP3VVZZCYRQ', // Replace with actual button ID
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
            hostedButtonId: 'CZQNCK3FUPTN2', // Replace with actual button ID
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
                <div className="relative max-w-full bg-[var(--color-foreground)] text-center shadow-lg">
                    {/* Hero Banner */}
                    <div className="absolute inset-0 max-h-96">
                        <img
                            src={`${cdn}/images/AdobeStock_949366383.webp`}
                            loading="lazy"
                            alt="Services hero banner"
                            className="pointer-events-none h-full w-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-foreground)] to-transparent" />
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
                    <div className="relative mx-auto mt-6 max-w-7xl px-3 pb-20 sm:mt-8 sm:px-4 sm:pb-32">
                        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {packages.map((pkg) => (
                                <ServicePackageCard
                                    key={pkg.title}
                                    title={pkg.title}
                                    price={pkg.price}
                                    description={pkg.description}
                                    features={pkg.features}
                                    hostedButtonId={pkg.hostedButtonId}
                                    popular={pkg.popular}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
