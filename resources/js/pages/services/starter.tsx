import PackagePaymentGate from '@/Components/PackagePaymentGate';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

export default function StarterPackage() {
    const cdn = import.meta.env.VITE_ASSET_URL || '';

    const features = [
        'Single-page responsive website',
        'Contact form integration',
        'Social media links',
        'Mobile-optimized design',
        'Basic SEO setup',
        '1 month of support',
    ];

    return (
        <>
            <Head>
                <title>Starter Package - $199 | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Perfect for startups launching their first website. Single-page responsive website with contact form and social media integration."
                />
                <meta
                    name="keywords"
                    content="starter package, web design, single page website, startup website, small business website, affordable web design, basic SEO"
                />
                <link rel="canonical" href="https://graveyardjokes.com/services/starter" />
                {/* Open Graph */}
                <meta property="og:title" content="Starter Package - $199 | Graveyard Jokes Studios" />
                <meta
                    name="og:description"
                    content="Perfect for startups launching their first website. Single-page responsive website with contact form and social media integration."
                />
                <meta property="og:image" content={`${cdn}/images/aboutBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/services/starter" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Starter Package - $199 | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Perfect for startups launching their first website. Single-page responsive website with contact form and social media integration."
                />
                <meta name="twitter:image" content={`${cdn}/images/aboutBanner.webp`} />
                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Design",
  "name": "Starter Package",
  "description": "Perfect for artists and musicians starting their online presence. Single-page responsive website with contact form and social media integration.",
  "provider": {
    "@type": "Organization",
    "name": "GraveYard Jokes Studios Inc.",
    "url": "https://graveyardjokes.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "600",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "areaServed": "US",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Starter Package Features",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Single-page responsive website" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Contact form integration" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Social media links" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mobile-optimized design" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Basic SEO setup" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "1 month of support" } }
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
                        <h1 className="mb-4 text-4xl font-bold text-white">Starter Package</h1>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-(--primary)">$199</span>
                        </div>
                        <p className="mb-8 text-lg text-gray-300">Perfect for startups launching their first website</p>
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
                                <PackagePaymentGate amount={199} item="Starter Package" packageSlug="starter" />
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
