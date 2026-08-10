import InertiaHead from '@/Components/InertiaHead';
import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function MaintenancePackage() {
    const features = [
        'Monthly content updates (text, images, links)',
        'Security & dependency updates',
        'Uptime monitoring',
        'Full site administration — no login needed',
        'Monthly backups',
        'Bug fixes & small tweaks',
        'Priority support response',
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
                            Monthly Add-On
                        </div>
                        <h1 className="mb-4 text-4xl font-bold text-white">Website Maintenance</h1>
                        <div className="mb-2 flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-(--primary)">$49</span>
                            <span className="text-sm text-white/50">/mo</span>
                        </div>
                        <p className="mb-8 text-lg text-gray-300">Ongoing care so your site never goes stale or breaks</p>

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
                                <PackagePaymentGate amount={49} item="Website Maintenance" packageSlug="maintenance" />
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
                            <h2 className="mb-3 text-2xl font-bold text-white">About Website Maintenance</h2>
                            <p className="text-white/70">
                                A website isn't a one-time project — it's a living thing. Content goes out of date, dependencies need updating,
                                and without regular care, even a great site can break or get hacked. Our Website Maintenance plan at $49/mo
                                means you have someone in your corner every single month. We handle everything behind the scenes so you can
                                focus on what you actually do — whether that's running a business, playing shows, or creating content.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">You Never Have to Log In</h3>
                            <p className="text-white/70">
                                Most of our maintenance clients never touch their website's backend. Just send us an email — "update my show
                                dates," "swap this photo," "change this paragraph" — and it's done. We act as your full-time site
                                administrator so you're never stuck figuring out a CMS or waiting on a developer for small changes.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">Does this work for sites not built by Graveyard Jokes?</p>
                                    <p className="text-white/70">
                                        Yes — we can take over maintenance on any existing site, not just ones we built. We'll do an initial
                                        audit to understand the stack and then take it from there.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">What counts as a "small tweak"?</p>
                                    <p className="text-white/70">
                                        Text changes, image swaps, link updates, show/event date changes, adding new pages to existing
                                        templates, and fixing broken elements all fall under standard monthly maintenance. Large redesigns or
                                        new feature development are quoted separately.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Can I cancel anytime?</p>
                                    <p className="text-white/70">
                                        Yes. No long-term contracts. Cancel anytime with 30 days notice.
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
