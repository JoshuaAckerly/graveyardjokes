import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function SocialMediaPremiumPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const features = [
        'Everything in Professional',
        '7+ platforms managed',
        'Unlimited posts',
        'Paid ad campaign management',
        'Influencer outreach',
        'Weekly strategy calls',
    ];

    return (
        <>
            <Head>
                <title>Social Media Management - Premium - $199/mo | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Premium social media management: complete strategy with unlimited posts, ad campaigns, influencer outreach, and weekly strategy calls."
                />
                <meta
                    name="keywords"
                    content="social media management, social media advertising, influencer outreach, ad campaigns, full social media strategy"
                />
                <link rel="canonical" href="https://graveyardjokes.com/services/modernization-premium" />
                <meta property="og:title" content="Social Media Management - Premium - $199/mo | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Complete social media strategy with unlimited posts, ad campaigns, influencer outreach, and weekly calls."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/modernization-premium" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Social Media Management - Premium - $199/mo | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Complete social media strategy with unlimited posts, ad campaigns, and influencer outreach."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />
            </Head>

            <MainLayout>
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <Link href="/services" className="mb-6 inline-flex items-center gap-2 text-white transition hover:text-(--primary)">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Services
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-lg border-2 border-(--accent) bg-(--card) p-8"
                    >
                        <h1 className="mb-4 text-4xl font-bold text-white">Social Media Premium</h1>
                        <div className="mb-2 flex items-baseline gap-3">
                            <span className="text-5xl font-bold text-(--primary)">$199</span>
                            <span className="text-lg text-white/60">/mo</span>
                        </div>
                        <p className="mb-8 text-lg text-gray-300">Complete strategy with ad campaigns and influencer outreach</p>
                        <h2 className="mb-4 text-2xl font-bold text-white">What's Included:</h2>
                        <ul className="mb-8 space-y-3">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-200">
                                    <Check className="mt-1 h-6 w-6 shrink-0 text-(--primary)" />
                                    <span className="text-lg">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-700 pt-8">
                            <h2 className="mb-4 text-2xl font-bold text-white">Ready to Get Started?</h2>
                            <p className="mb-6 text-gray-300">
                                Complete the short project questionnaire first. Once submitted, payment unlocks instantly for this package.
                            </p>
                            <div className="mb-6" style={{ minHeight: '45px' }}>
                                <PackagePaymentGate amount={199} item="Social Media Premium" packageSlug="modernization-premium" />
                            </div>
                            <p className="text-sm text-gray-400">
                                Have questions?{' '}
                                <Link href="/contact" className="text-(--primary) hover:underline">
                                    Contact us
                                </Link>
                            </p>
                        </div>
                    </motion.div>

                    <div className="mt-12 space-y-8 pb-8">
                        <section>
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Social Media Premium</h2>
                            <p className="text-white/70">
                                The Premium tier is the complete package for brands that are serious about growth. At $199/mo, we manage 7+ platforms,
                                post unlimited content, run paid ad campaigns, handle influencer outreach, and hold weekly strategy calls to keep
                                everything aligned with your goals. This is full-service social media — nothing is left unmanaged.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">Is the ad spend included in the $199/mo?</p>
                                    <p className="text-white/70">
                                        No — the $199/mo covers management of the ad campaigns. Ad spend budget is separate and set by you. We handle
                                        the targeting, creative, and optimization.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">How does influencer outreach work?</p>
                                    <p className="text-white/70">
                                        We research and reach out to micro-influencers in your niche on your behalf, manage the communication, and
                                        coordinate any collaborations or shoutouts.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
