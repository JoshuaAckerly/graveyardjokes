import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ProfessionalPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';
    const paypalContainerRef = useRef<HTMLDivElement>(null);
    const [isPayPalReady, setIsPayPalReady] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=BAAEThXfkghKIa87QQOlnsIur64eOCnBLuAxJeYWYDW5o366RczxK2o9F8DtrXnte6SY65yJRFso_mMA2o&components=hosted-buttons&enable-funding=venmo,paylater&disable-funding=card,credit&currency=USD';
        script.async = true;
        script.onload = () => setIsPayPalReady(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (!isPayPalReady || !paypalContainerRef.current || !window.paypal?.HostedButtons) {
            return;
        }

        try {
            paypalContainerRef.current.innerHTML = '';
            window.paypal
                .HostedButtons({
                    hostedButtonId: '74UP3VVZZCYRQ',
                })
                .render(paypalContainerRef.current);
        } catch (error) {
            console.error('Failed to render PayPal button:', error);
        }
    }, [isPayPalReady]);

    const features = [
        'Multi-page custom website',
        'Blog or news section',
        'Photo/video galleries',
        'Newsletter integration',
        'Advanced SEO optimization',
        'Analytics setup',
        '3 months of support',
        'Social media integration',
    ];

    return (
        <>
            <Head>
                <title>Professional Package - $1,500 | Graveyard Jokes Studios</title>
                <meta name="description" content="Ideal for established artists with growing audiences. Multi-page custom website with blog, galleries, and advanced features." />
            </Head>

            <MainLayout>
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <Link href="/services" className="inline-flex items-center gap-2 text-white hover:text-(--primary) transition mb-6">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Services
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-lg border-2 border-(--primary) bg-(--card) p-8 shadow-xl"
                    >
                        <div className="mb-4 inline-block rounded-full bg-(--primary) px-4 py-1 text-xs font-bold text-white">
                            MOST POPULAR
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">Professional Package</h1>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$1,500</span>
                        </div>
                        <p className="text-lg text-gray-300 mb-8">
                            Ideal for established artists with growing audiences
                        </p>

                        <h2 className="text-2xl font-bold text-white mb-4">What's Included:</h2>
                        <ul className="mb-8 space-y-3">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-200">
                                    <Check className="mt-1 h-6 w-6 shrink-0 text-(--primary)" />
                                    <span className="text-lg">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-gray-700 pt-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
                            <p className="text-gray-300 mb-6">
                                Click the button below to proceed with payment. After payment, we'll contact you within 24 hours to discuss your project requirements.
                            </p>
                            
                            <div className="mb-6" style={{ minHeight: '45px' }}>
                                <div ref={paypalContainerRef} />
                            </div>

                            <p className="text-sm text-gray-400">
                                Have questions? <Link href="/contact" className="text-(--primary) hover:underline">Contact us</Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </MainLayout>
        </>
    );
}
