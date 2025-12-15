import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function PremiumPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';
    const paypalContainerRef = useRef<HTMLDivElement>(null);
    const [isPayPalReady, setIsPayPalReady] = useState(false);

    useEffect(() => {
        // Check if PayPal script is already loaded
        if (window.paypal) {
            setIsPayPalReady(true);
            return;
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => setIsPayPalReady(true));
            return;
        }

        // Load the script
        const script = document.createElement('script');
        script.src =
            'https://www.paypal.com/sdk/js?client-id=BAAEThXfkghKIa87QQOlnsIur64eOCnBLuAxJeYWYDW5o366RczxK2o9F8DtrXnte6SY65yJRFso_mMA2o&components=hosted-buttons&enable-funding=venmo,paylater&disable-funding=card,credit&currency=USD';
        script.async = true;
        script.onload = () => setIsPayPalReady(true);
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (!isPayPalReady || !paypalContainerRef.current || !window.paypal?.HostedButtons) {
            return;
        }

        try {
            paypalContainerRef.current.innerHTML = '';
            window.paypal
                .HostedButtons({
                    hostedButtonId: 'CZQNCK3FUPTN2',
                })
                .render(paypalContainerRef.current);
        } catch (error) {
            console.error('Failed to render PayPal button:', error);
        }
    }, [isPayPalReady]);

    const features = [
        'Everything in Professional',
        'E-commerce/merch store',
        'Event calendar & ticketing',
        'Music/video streaming',
        'Custom animations & effects',
        'API integrations',
        '6 months of support',
        'Priority updates',
    ];

    return (
        <>
            <Head>
                <title>Premium Package - $3,000+ | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Full-featured solution for serious professionals. E-commerce, streaming, custom integrations, and premium support."
                />
                <meta
                    name="keywords"
                    content="premium package, e-commerce, merch store, streaming, custom website, API integration, priority support, full-stack development"
                />
                <link rel="canonical" href="https://graveyardjokes.com/services/premium" />
                {/* Open Graph */}
                <meta property="og:title" content="Premium Package - $3,000+ | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Full-featured solution for serious professionals. E-commerce, streaming, custom integrations, and premium support."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/premium" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Premium Package - $3,000+ | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Full-featured solution for serious professionals. E-commerce, streaming, custom integrations, and premium support."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />
                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Design",
  "name": "Premium Package",
  "description": "Full-featured solution for serious professionals. E-commerce, streaming, custom integrations, and premium support.",
  "provider": {
    "@type": "Organization",
    "name": "GraveYard Jokes Studios Inc.",
    "url": "https://graveyardjokes.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "3000",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "areaServed": "US",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Premium Package Features",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Everything in Professional" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E-commerce/merch store" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Event calendar & ticketing" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Music/video streaming" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom animations & effects" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "API integrations" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "6 months of support" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Priority updates" } }
    ]
  }
}
`}
                </script>
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
                        <h1 className="mb-4 text-4xl font-bold text-white">Premium Package</h1>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$3,000+</span>
                        </div>
                        <p className="mb-8 text-lg text-gray-300">Full-featured solution for serious professionals</p>

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
                                <div ref={paypalContainerRef} />
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
