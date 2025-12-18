import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { Check, ArrowLeft } from 'lucide-react';
=======
import { ArrowLeft, Check } from 'lucide-react';
>>>>>>> 3af94ce9a36ea4fab79cd3b986493cecd56f508a
import { useEffect, useRef, useState } from 'react';

export default function ProfessionalPackage() {
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
<<<<<<< HEAD
        script.src = 'https://www.paypal.com/sdk/js?client-id=BAAEThXfkghKIa87QQOlnsIur64eOCnBLuAxJeYWYDW5o366RczxK2o9F8DtrXnte6SY65yJRFso_mMA2o&components=hosted-buttons&enable-funding=venmo,paylater&disable-funding=card,credit&currency=USD';
=======
        script.src =
            'https://www.paypal.com/sdk/js?client-id=BAAEThXfkghKIa87QQOlnsIur64eOCnBLuAxJeYWYDW5o366RczxK2o9F8DtrXnte6SY65yJRFso_mMA2o&components=hosted-buttons&enable-funding=venmo,paylater&disable-funding=card,credit&currency=USD';
>>>>>>> 3af94ce9a36ea4fab79cd3b986493cecd56f508a
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
<<<<<<< HEAD
                <meta name="description" content="Ideal for established artists with growing audiences. Multi-page custom website with blog, galleries, and advanced features." />
            </Head>

            <MainLayout>
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <Link href="/services" className="inline-flex items-center gap-2 text-white hover:text-(--primary) transition mb-6">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Services
                    </Link>

=======
                <meta
                    name="description"
                    content="Ideal for established artists with growing audiences. Multi-page custom website with blog, galleries, and advanced features."
                />
                <meta
                    name="keywords"
                    content="professional package, multi-page website, custom website, blog, galleries, advanced SEO, analytics, web development"
                />
                <link rel="canonical" href="https://graveyardjokes.com/services/professional" />
                {/* Open Graph */}
                <meta property="og:title" content="Professional Package - $1,500 | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Ideal for established artists with growing audiences. Multi-page custom website with blog, galleries, and advanced features."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/professional" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Professional Package - $1,500 | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Ideal for established artists with growing audiences. Multi-page custom website with blog, galleries, and advanced features."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />
                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Design",
  "name": "Professional Package",
  "description": "Ideal for established artists with growing audiences. Multi-page custom website with blog, galleries, and advanced features.",
  "provider": {
    "@type": "Organization",
    "name": "GraveYard Jokes Studios Inc.",
    "url": "https://graveyardjokes.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "1500",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "areaServed": "US",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Professional Package Features",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Multi-page custom website" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Blog or news section" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Photo/video galleries" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Newsletter integration" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Advanced SEO optimization" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Analytics setup" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "3 months of support" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Social media integration" } }
    ]
  }
}
`}
                </script>
            </Head>

            <MainLayout>
                {/* Pay Over Time Section */}
                <div className="mx-auto mb-8 max-w-2xl rounded-lg border-2 border-(--primary) bg-black/80 p-8 text-white shadow-xl">
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl">💀💸</span>
                        <h2 className="text-2xl font-bold">Pay Over Time with PayPal</h2>
                        <p className="mt-2 text-lg text-white/80">
                            Want a killer website but your wallet's feeling a little... lifeless? <br />
                            With PayPal's <span className="font-semibold text-(--primary)">Pay Over Time</span> options, you can break up your payments—no need to dig up your savings all at once!
                        </p>
                        <p className="mt-4 text-base text-white/60 italic">
                            "Even the Grim Reaper appreciates flexible payments. He says, 'Why pay it all now when you can pay it... over time?'"
                        </p>
                        <div className="mt-4 rounded bg-white/10 px-4 py-2 text-sm text-white/80">
                            Look for <span className="font-semibold text-(--primary)">Pay Later</span> at checkout!
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <Link href="/services" className="mb-6 inline-flex items-center gap-2 text-white transition hover:text-(--primary)">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Services
                    </Link>
>>>>>>> 3af94ce9a36ea4fab79cd3b986493cecd56f508a
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-lg border-2 border-(--primary) bg-(--card) p-8 shadow-xl"
                    >
<<<<<<< HEAD
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
=======
                        <div className="mb-4 inline-block rounded-full bg-(--primary) px-4 py-1 text-xs font-bold text-white">MOST POPULAR</div>
                        <h1 className="mb-4 text-4xl font-bold text-white">Professional Package</h1>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$1,500</span>
                        </div>
                        <p className="mb-8 text-lg text-gray-300">Ideal for established artists with growing audiences</p>
                        <h2 className="mb-4 text-2xl font-bold text-white">What's Included:</h2>
>>>>>>> 3af94ce9a36ea4fab79cd3b986493cecd56f508a
                        <ul className="mb-8 space-y-3">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-200">
                                    <Check className="mt-1 h-6 w-6 shrink-0 text-(--primary)" />
                                    <span className="text-lg">{feature}</span>
                                </li>
                            ))}
                        </ul>
<<<<<<< HEAD

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
=======
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
>>>>>>> 3af94ce9a36ea4fab79cd3b986493cecd56f508a
                            </p>
                        </div>
                    </motion.div>
                </div>
            </MainLayout>
        </>
    );
}
