import InertiaHead from '@/Components/InertiaHead';
import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function SocialMediaStarterPackage() {
    const features = [
        '3 platforms managed',
        '8 posts per month',
        'Content calendar & scheduling',
        'Caption writing & hashtag strategy',
        'Monthly analytics report',
    ];

    return (
        <>
            <InertiaHead />

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
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <h1 className="text-4xl font-bold text-white">Social Media Starter</h1>
                        </div>
                        <div className="mb-2 flex items-baseline gap-3">
                            <span className="text-5xl font-bold text-(--primary)">$99</span>
                            <span className="text-lg text-white/60">/mo</span>
                        </div>

                        <p className="mb-8 text-lg text-gray-300">Consistent presence on 3 platforms every month</p>
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
                                <PackagePaymentGate amount={99} item="Social Media Starter" packageSlug="modernization-starter" />
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
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Social Media Starter</h2>
                            <p className="text-white/70">
                                The Social Media Starter from Graveyard Jokes Studios is designed for small businesses and independent brands that
                                need a consistent, professional presence online without the cost or complexity of a full marketing team. At $99/mo,
                                this package keeps you posting regularly on 3 platforms — with content that reflects your brand and speaks to your
                                audience. Everything is handled for you: the calendar, the captions, the hashtags, and the reporting.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">What You Get</h3>
                            <p className="text-white/70">
                                Each month you get 8 posts scheduled across your 3 chosen platforms, written and formatted for each channel. A content
                                calendar keeps everything organized so you always know what is going up and when. At the end of the month, you receive
                                an analytics report showing reach, engagement, and growth — so you can see the work paying off.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">Which platforms are included?</p>
                                    <p className="text-white/70">
                                        You choose any 3 from Instagram, Facebook, X (Twitter), TikTok, or LinkedIn. We set up the content to match
                                        each platform's format and audience.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Can I approve posts before they go live?</p>
                                    <p className="text-white/70">
                                        Yes. We share the content calendar with you at the start of each month so you can review and approve
                                        everything before it is scheduled.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Can I upgrade to a higher tier later?</p>
                                    <p className="text-white/70">
                                        Absolutely. You can move up to the Professional or Premium tier at any time as your needs grow.
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
