import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function ProfessionalPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const features = [
        'Custom, mobile-friendly website design',
        'Up to 10 pages (Home, About, Portfolio, Shop, etc.)',
        'Integrated e-commerce (Shopify, WooCommerce, or Stripe)',
        'Blog or news section',
        'Mailing list integration (Mailchimp, ConvertKit, etc.)',
        'Social media & business profile links',
        'Contact & booking forms',
        'Basic SEO optimization',
        'Performance optimization',
        '1 year of free hosting & support',
    ];

    return (
        <>
            <Head>
                <title>Professional Website Package - $1,499 | GraveYard Jokes Studios</title>
                <meta
                    name="description"
                    content="Professional plan for growing brands: custom design, advanced development, integrations, and conversion-focused improvements that scale results."
                />
                <meta
                    name="keywords"
                    content="professional package, custom website, e-commerce, SEO optimization, mobile-friendly design, web development, small business website"
                />
                <link rel="canonical" href="https://graveyardjokes.com/services/professional" />
                {/* Open Graph */}
                <meta property="og:title" content="Professional Website Package - $1,499 | GraveYard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Professional plan for growing brands: custom design, advanced development, integrations, and conversion-focused improvements that scale results."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/professional" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Professional Website Package - $1,499 | GraveYard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Professional plan for growing brands: custom design, advanced development, integrations, and conversion-focused improvements that scale results."
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
                        className="rounded-lg border-2 border-(--primary) bg-(--card) p-8 shadow-xl"
                    >
                        <div className="mb-4 inline-block rounded-full bg-(--primary) px-4 py-1 text-xs font-bold text-white">MOST POPULAR</div>
                        <h1 className="mb-4 text-4xl font-bold text-white">Professional Package</h1>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$1,499</span>
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
                                <PackagePaymentGate amount={1499} item="Professional Package" packageSlug="professional" />
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
                            <h2 className="mb-3 text-2xl font-bold text-white">About the Professional Package</h2>
                            <p className="text-white/70">
                                The Professional Package from Graveyard Jokes Studios is our most popular offering for growing businesses, bands, and
                                independent artists who need a feature-rich, multi-page website that scales with their success. At $1,499, this
                                package includes up to ten fully designed and developed pages — covering home, about, portfolio, shop, blog, and
                                contact. We integrate e-commerce capabilities through Shopify, WooCommerce, or Stripe so you can sell merchandise,
                                music, or services directly from your site. Mailing list integration, booking forms, and social media connections are
                                all included, making your website a complete marketing and sales platform from day one.
                            </p>
                        </section>
                        <section>
                            <h3 className="mb-3 text-xl font-semibold text-white">What Makes the Professional Package Different</h3>
                            <p className="text-white/70">
                                Unlike basic website packages, the Professional tier includes one full year of free hosting and ongoing support. After
                                your site launches, you have a dedicated team available to handle updates, performance questions, and technical issues
                                for an entire year at no additional cost. Performance optimization is built into every project, ensuring your pages
                                load quickly and score well on Core Web Vitals — a key factor in Google search rankings and organic visibility.
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
                                    <p className="font-semibold text-white">Is one year of hosting included in the $1,499 price?</p>
                                    <p className="text-white/70">
                                        Yes, hosting and support for twelve months are included at no additional charge. After the first year,
                                        affordable renewal options are available to keep your site running.
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
