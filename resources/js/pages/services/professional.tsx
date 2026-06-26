import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import InertiaHead from '@/Components/InertiaHead';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function ProfessionalPackage() {

    const features = [
        'Everything in Starter',
        'Up to 5 pages',
        'Custom UI design system',
        'Full brand guidelines',
        'Blog or portfolio section',
        'Mailing list integration',
        'Contact & booking forms',
        'Performance optimization',
        '3 months of support',
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
                        className="rounded-lg border-2 border-(--primary) bg-(--card) p-8 shadow-xl"
                    >
                        <div className="mb-4 inline-block rounded-full bg-(--primary) px-4 py-1 text-xs font-bold text-white">MOST POPULAR</div>
                        <h1 className="mb-4 text-4xl font-bold text-white">Professional Package</h1>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$149</span>
                        </div>
                        <p className="mb-8 text-lg text-gray-300">Ideal for growing startups needing more features</p>

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
                                <PackagePaymentGate amount={149} item="Professional Package" packageSlug="professional" />
                            </div>
                            <p className="text-sm text-gray-400">
                                Have questions?{' '}
                                <Link href="/contact" className="text-(--primary) hover:underline">
                                    Contact us
                                </Link>
                            </p>
                        </div>
                    </motion.div>

                    {/* Social Media Add-On */}
                    <div className="mt-8 rounded-lg border border-white/20 bg-white/5 p-6">
                        <p className="text-xs font-semibold tracking-widest text-(--primary) uppercase">Optional Add-On</p>
                        <h2 className="mt-2 text-xl font-bold text-white">Add Social Media Management</h2>
                        <p className="mt-2 text-sm text-white/60">
                            Keep your platforms active and growing every month. Pair with this package from $99/mo.
                        </p>
                        <Link
                            href="/services/modernization-starter"
                            className="mt-4 inline-flex rounded-md border border-(--primary) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--primary)"
                        >
                            View Social Media Plans →
                        </Link>
                    </div>

                    <div className="mt-12 space-y-8 pb-8">
                        <section>
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Professional Package</h2>
                            <p className="text-white/70">
                                The Professional Package from Graveyard Jokes Studios is our most popular offering for growing businesses, bands, and
                                independent artists who need a feature-rich, multi-page website that scales with their success. At $149, this package
                                includes up to five fully designed and developed pages — covering home, about, portfolio, shop, blog, and contact.
                                Mailing list integration, booking forms, and social media connections are all included, making your website a complete
                                online platform from day one.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">What Makes the Professional Package Different</h3>
                            <p className="text-white/70">
                                The Professional tier includes three months of support after launch. Performance optimization is built into every
                                project, ensuring your pages load quickly and look great on every device.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Why Choose Graveyard Jokes Studios?</h3>
                            <p className="text-white/70">
                                We have built full-scale platforms for independent musicians, creative studios, and small businesses across the United
                                States. Our team understands the unique needs of artists and entrepreneurs: you need a website that looks great,
                                functions flawlessly, and actively brings in business. The Professional Package is engineered to convert visitors into
                                fans, followers, and customers through strategic design and solid technical execution.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-white">What e-commerce platforms do you integrate with?</p>
                                    <p className="text-white/70">
                                        We work with Shopify, WooCommerce, and Stripe depending on your needs. During onboarding we will discuss which
                                        platform best suits your product type, sales volume, and budget.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Is one year of hosting included in the $149 price?</p>
                                    <p className="text-white/70">
                                        The 3 months of support covers content updates, bug fixes, performance questions, and any tweaks needed after
                                        launch. After that, affordable maintenance options are available.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Can you migrate content from my existing website?</p>
                                    <p className="text-white/70">
                                        Yes, content migration is available. We will discuss the specifics of your current site during the project
                                        intake process and ensure a smooth transition with no data loss.
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
