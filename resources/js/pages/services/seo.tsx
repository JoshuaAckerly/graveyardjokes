import InertiaHead from '@/Components/InertiaHead';
import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function SeoPackage() {
    const features = [
        'Keyword research & strategy',
        'On-page SEO optimization',
        'Meta titles, descriptions & schema markup',
        'Google Search Console setup & monitoring',
        'Google Analytics review & reporting',
        'Monthly SEO performance report',
        'Ongoing content & technical recommendations',
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
                        <div className="mb-2 inline-block rounded-full bg-(--primary)/20 px-4 py-1 text-xs font-bold tracking-widest text-(--primary) uppercase">
                            Special Add-On Price
                        </div>
                        <h1 className="mb-4 text-4xl font-bold text-white">SEO Management</h1>
                        <div className="mb-2 flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-(--primary)">$79</span>
                            <span className="text-sm text-white/50">/mo</span>
                        </div>
                        <p className="mb-8 text-lg text-gray-300">Get found on Google — hands-free, every month</p>

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
                                <PackagePaymentGate amount={79} item="SEO Management" packageSlug="seo" />
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
                            <h2 className="mb-3 text-2xl font-bold text-white">About SEO Management</h2>
                            <p className="text-white/70">
                                Most websites never get found on Google — not because they look bad, but because they were never optimized to rank.
                                Our SEO Management add-on fixes that. At $79/mo, it's the most cost-effective way to grow your organic traffic without
                                lifting a finger. We handle everything from keyword research and on-page optimization to monthly reporting, so you
                                always know exactly how your site is performing and what we're doing to improve it.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Why SEO Matters</h3>
                            <p className="text-white/70">
                                Paid ads stop the moment you stop paying. SEO compounds over time — the work we do this month keeps paying off next
                                month and beyond. For small businesses, musicians, and independent brands, organic search traffic is one of the
                                highest-converting channels available. We make sure your site is structured, tagged, and optimized so Google
                                understands exactly what you offer and who you serve.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">How long before I see results?</p>
                                    <p className="text-white/70">
                                        SEO is a long-term strategy. Most clients start seeing measurable improvements in rankings and traffic within
                                        60 to 90 days. The longer we work together, the stronger your results become.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Do I need a website package to add SEO?</p>
                                    <p className="text-white/70">
                                        No — SEO Management can be added to any existing website, not just sites built by us. As long as you have a
                                        live site, we can start optimizing it.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Can I cancel anytime?</p>
                                    <p className="text-white/70">
                                        Yes. There are no long-term contracts. You can cancel your SEO Management subscription at any time with 30
                                        days notice.
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
