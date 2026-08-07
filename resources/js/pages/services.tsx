import GoogleReviews from '@/Components/GoogleReviews';
import InertiaHead from '@/Components/InertiaHead';
import PackagePaymentGate, { type PackageSlug } from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
            price: 99,
            description: 'A clean, launch-ready single-page site — built and designed from scratch',
            features: [
                'Single-page responsive website',
                'Photoshop mockups & design',
                'Brand color palette & typography',
                'Contact form integration',
                'Mobile-optimized',
                'Domain & hosting assistance',
                '1 month of support',
            ],
            link: '/services/starter',
            popular: false,
        },
        {
            slug: 'professional',
            title: 'Professional Package',
            price: 149,
            description: 'Multi-page site with full UI design system and brand guidelines',
            features: [
                'Everything in Starter',
                'Up to 5 pages',
                'Custom UI design system',
                'Full brand guidelines',
                'Blog or portfolio section',
                'Mailing list integration',
                'Contact & booking forms',
                'Performance optimization',
                '3 months of support',
            ],
            link: '/services/professional',
            popular: true,
        },
        {
            slug: 'premium',
            title: 'Premium Package',
            price: 299,
            description: 'Full-featured platform with custom animations, illustrations, and integrations',
            features: [
                'Everything in Professional',
                'Up to 10 pages',
                'Custom animations & effects',
                'Animation design specifications',
                'Custom illustration design',
                'API integrations',
                'Event calendar or merch store',
                'Music/video streaming support',
                '6 months of support',
                'Priority updates',
            ],
            link: '/services/premium',
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
            title: 'Social Media - Starter',
            price: 99,
            description: 'Consistent presence on 3 platforms every month',
            features: [
                '3 platforms managed',
                '8 posts per month',
                'Content calendar & scheduling',
                'Caption writing & hashtag strategy',
                'Monthly analytics report',
            ],
            link: '/services/modernization-starter',
            popular: false,
        },
        {
            slug: 'modernization-professional',
            title: 'Social Media - Professional',
            price: 149,
            description: 'Full management across 5 platforms with engagement',
            features: [
                'Everything in Starter',
                '5 platforms managed',
                '16 posts per month',
                'Stories & Reels content',
                'Community engagement management',
                'Bi-weekly analytics report',
            ],
            link: '/services/modernization-professional',
            popular: true,
        },
        {
            slug: 'modernization-premium',
            title: 'Social Media - Premium',
            price: 199,
            description: 'Complete strategy with ad campaigns and influencer outreach',
            features: [
                'Everything in Professional',
                '7+ platforms managed',
                'Unlimited posts',
                'Paid ad campaign management',
                'Influencer outreach',
                'Weekly strategy calls',
            ],
            link: '/services/modernization-premium',
            popular: false,
        },
    ];

    return (
        <>
            <InertiaHead />

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
                                Fill Out Project Questionnaire (Optional)
                            </Link>
                        </motion.div>
                    </div>

                    {/* Packages Grid */}
                    <div className="relative mx-auto mt-6 max-w-7xl px-3 pb-20 sm:mt-8 sm:px-4 sm:pb-32" style={{ maxWidth: '100vw' }}>
                        {/* Web Development & Design Section */}
                        <div className="mb-16">
                            <h2 className="mb-2 text-center text-2xl font-bold text-white sm:text-3xl">Web Development & Design</h2>
                            <p className="mb-8 text-center text-sm text-white/50">
                                Every package includes both development and design — built and designed by hand, no templates.
                            </p>
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

                        {/* eCommerce Add-On Section */}
                        <div className="border-t border-white/10 pt-16">
                            <div className="mb-8 text-center">
                                <p className="text-xs font-semibold tracking-widest text-(--primary) uppercase">Optional Add-On</p>
                                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">eCommerce</h2>
                                <p className="mt-3 text-sm text-white/60">
                                    Add a full storefront to any package. Stripe payments, product catalog, cart & checkout — built to your brand.
                                </p>
                            </div>
                            <div className="mx-auto max-w-sm">
                                <motion.div
                                    className="relative z-0 flex flex-col rounded-lg border-2 border-(--accent) bg-(--card) p-4 shadow-lg sm:p-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="mb-3 text-center sm:mb-4">
                                        <h3 className="text-xl font-bold text-white sm:text-2xl">eCommerce Add-On</h3>
                                        <div className="mt-2 flex items-baseline justify-center gap-1">
                                            <span className="text-3xl font-bold text-(--primary) sm:text-4xl">$299</span>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-300 sm:text-sm">One-time add-on to any web package</p>
                                    </div>
                                    <ul className="mb-6 flex-1 space-y-3">
                                        {[
                                            'Product catalog & inventory management',
                                            'Shopping cart & checkout flow',
                                            'Stripe payment integration',
                                            'Order management & email receipts',
                                            'Coupon & discount code support',
                                            'Mobile-optimized storefront',
                                        ].map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-gray-200">
                                                <Check className="mt-0.5 h-5 w-5 shrink-0 text-(--primary)" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto flex flex-col gap-2">
                                        <Link
                                            href="/services/intake?package=ecommerce"
                                            className="block w-full rounded-lg bg-(--primary) px-6 py-3 text-center font-semibold text-white transition hover:bg-(--accent)"
                                        >
                                            Get Started
                                        </Link>
                                        <PackagePaymentGate amount={299} item="eCommerce Add-On" packageSlug="ecommerce" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* SEO Add-On Section */}
                        <div className="border-t border-white/10 pt-16">
                            <div className="mb-8 text-center">
                                <p className="text-xs font-semibold tracking-widest text-(--primary) uppercase">Optional Add-On</p>
                                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">SEO Management</h2>
                                <p className="mt-3 text-sm text-white/60">
                                    Get found on Google — hands-free, every month. Special add-on pricing at $79/mo.
                                </p>
                            </div>
                            <div className="mx-auto max-w-sm">
                                <motion.div
                                    className="relative z-0 flex flex-col rounded-lg border-2 border-(--accent) bg-(--card) p-4 shadow-lg sm:p-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="mb-3 text-center sm:mb-4">
                                        <div className="mb-2 inline-block rounded-full bg-(--primary)/20 px-3 py-1 text-xs font-bold tracking-widest text-(--primary) uppercase">
                                            Special Price
                                        </div>
                                        <h3 className="text-xl font-bold text-white sm:text-2xl">SEO Management</h3>
                                        <div className="mt-2 flex items-baseline justify-center gap-1">
                                            <span className="text-3xl font-bold text-(--primary) sm:text-4xl">$79</span>
                                            <span className="text-sm text-white/50">/mo</span>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-300 sm:text-sm">Get found on Google — hands-free, every month</p>
                                    </div>
                                    <ul className="mb-6 flex-1 space-y-3">
                                        {[
                                            'Keyword research & strategy',
                                            'On-page SEO optimization',
                                            'Meta tags & schema markup',
                                            'Google Search Console monitoring',
                                            'Monthly performance report',
                                        ].map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-gray-200">
                                                <Check className="mt-0.5 h-5 w-5 shrink-0 text-(--primary)" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto flex flex-col gap-2">
                                        <Link
                                            href="/services/seo"
                                            className="block w-full rounded-lg border border-(--primary) px-6 py-3 text-center font-semibold text-white transition hover:bg-(--primary)"
                                        >
                                            View Details
                                        </Link>
                                        <PackagePaymentGate amount={79} item="SEO Management" packageSlug="seo" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Social Media Management Add-On Section */}
                        <div className="border-t border-white/10 pt-16">
                            <div className="mb-8 text-center">
                                <p className="text-xs font-semibold tracking-widest text-(--primary) uppercase">Optional Add-On</p>
                                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Social Media Management</h2>
                                <p className="mt-3 text-sm text-white/60">
                                    Pair with any package. Keep your platforms active and growing every month.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3" style={{ maxWidth: '100%' }}>
                                {modernizationPackages.map((pkg) => (
                                    <motion.div
                                        key={pkg.title}
                                        className={`relative z-0 flex flex-col rounded-lg border-2 p-4 shadow-lg transition sm:p-6 ${
                                            pkg.popular
                                                ? 'border-(--primary) bg-white/5 shadow-(--primary)/20 shadow-xl'
                                                : 'border-white/20 bg-white/5'
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
                                                <span className="text-sm text-white/50">/mo</span>
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
                                                className="block w-full rounded-lg border border-(--primary) px-6 py-3 text-center font-semibold text-white transition hover:bg-(--primary)"
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

                    <div className="relative mx-auto max-w-7xl px-3 pb-12 sm:px-4">
                        <GoogleReviews />
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
