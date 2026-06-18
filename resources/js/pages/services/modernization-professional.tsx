import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function SocialMediaProfessionalPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const features = [
        'Everything in Starter',
        '5 platforms managed',
        '16 posts per month',
        'Stories & Reels content',
        'Community engagement management',
        'Bi-weekly analytics report',
    ];

    return (
        <>
            <Head>
                <title>Social Media Management - Professional - $149/mo | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Professional social media management: full management across 5 platforms with stories, reels, community engagement, and bi-weekly reporting."
                />
                <meta name="keywords" content="social media management, professional social media, Instagram reels, community management, content creation" />
                <link rel="canonical" href="https://graveyardjokes.com/services/modernization-professional" />
                <meta property="og:title" content="Social Media Management - Professional - $149/mo | Graveyard Jokes Studios" />
                <meta property="og:description" content="Full management across 5 platforms with stories, reels, community engagement, and bi-weekly reporting." />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/modernization-professional" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Social Media Management - Professional - $149/mo | Graveyard Jokes Studios" />
                <meta name="twitter:description" content="Full management across 5 platforms with stories, reels, and community engagement." />
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
                        className="rounded-lg border-2 border-(--primary) bg-(--card) p-8 shadow-xl"
                    >
                        <div className="mb-4 inline-block rounded-full bg-(--primary) px-4 py-1 text-xs font-bold text-white">MOST POPULAR</div>
                        <h1 className="mb-4 text-4xl font-bold text-white">Social Media Professional</h1>
                        <div className="mb-2 flex items-baseline gap-3">
                            <span className="text-5xl font-bold text-(--primary)">$149</span>
                            <span className="text-lg text-white/60">/mo</span>
                        </div>
                        <p className="mb-8 text-lg text-gray-300">Full management across 5 platforms with engagement</p>
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
                                <PackagePaymentGate amount={149} item="Social Media Professional" packageSlug="modernization-professional" />
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
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Social Media Professional</h2>
                            <p className="text-white/70">
                                The Professional tier is built for brands that are ready to show up consistently and build a real audience. At $149/mo,
                                you get full management across 5 platforms — including Stories and Reels content that keeps you visible in the algorithm.
                                Community engagement is handled for you, so comments and messages get responses and your audience feels seen. Bi-weekly
                                analytics reports keep you informed on what is working and where to push harder.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">Which 5 platforms are included?</p>
                                    <p className="text-white/70">
                                        You choose from Instagram, Facebook, X (Twitter), TikTok, LinkedIn, and Pinterest. We tailor content for each
                                        platform's format and audience.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">What counts as community engagement?</p>
                                    <p className="text-white/70">
                                        We respond to comments on your posts, engage with relevant accounts in your niche, and handle direct messages
                                        that don't require your personal input.
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
