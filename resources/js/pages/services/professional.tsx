import PayPalCheckoutButton from '@/Components/PayPalCheckoutButton';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function ProfessionalPackage() {
    const features = [
        'Custom, mobile-friendly website design',
        'Up to 10 pages (Home, About, Portfolio, Shop, etc.)',
        'Integrated e-commerce (Shopify, WooCommerce, or Stripe)',
        'Blog setup & artist news section',
        'Mailing list integration (Mailchimp, ConvertKit, etc.)',
        'Social media & music platform links',
        'Contact & booking forms',
        'Basic SEO optimization',
        'Performance optimization',
        '1 year of free hosting & support',
    ];

    return (
        <>
            <Head title="Professional Website Package - $349 | GraveYard Jokes Studios" />
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
                            <span className="text-5xl font-bold text-(--primary)">$349</span>
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
                                Click the button below to proceed with payment. After payment, we'll contact you within 24 hours to discuss your
                                project requirements.
                            </p>
                            <div className="mb-6" style={{ minHeight: '45px' }}>
                                <PayPalCheckoutButton amount={349} item="Professional Package" />
                            </div>
                            <p className="text-sm text-gray-400">
                                Have questions?{' '}
                                <Link href="/contact" className="text-(--primary) hover:underline">
                                    Contact us
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </MainLayout>
        </>
    );
}
