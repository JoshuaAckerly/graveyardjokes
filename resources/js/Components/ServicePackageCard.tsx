import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Global flag to track if PayPal SDK is loading or loaded
let isPayPalScriptLoading = false;
let isPayPalScriptLoaded = false;
const paypalLoadCallbacks: Array<() => void> = [];

function loadPayPalScript(callback: () => void) {
    if (isPayPalScriptLoaded && window.paypal) {
        callback();
        return;
    }

    paypalLoadCallbacks.push(callback);

    if (isPayPalScriptLoading) {
        return; // Already loading, just wait for callback
    }

    isPayPalScriptLoading = true;

    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=BAAEThXfkghKIa87QQOlnsIur64eOCnBLuAxJeYWYDW5o366RczxK2o9F8DtrXnte6SY65yJRFso_mMA2o&components=hosted-buttons&enable-funding=venmo,paylater&disable-funding=card,credit&currency=USD';
    script.async = true;
    script.onload = () => {
        isPayPalScriptLoaded = true;
        isPayPalScriptLoading = false;
        paypalLoadCallbacks.forEach(cb => cb());
        paypalLoadCallbacks.length = 0;
    };
    script.onerror = () => {
        isPayPalScriptLoading = false;
        console.error('Failed to load PayPal SDK');
    };
    document.body.appendChild(script);
}

interface ServicePackageCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    hostedButtonId: string;
    popular?: boolean;
}

export default function ServicePackageCard({
    title,
    price,
    description,
    features,
    hostedButtonId,
    popular = false,
}: ServicePackageCardProps) {
    const paypalContainerRef = useRef<HTMLDivElement>(null);
    const [isPayPalReady, setIsPayPalReady] = useState(false);
    const [showPayPal, setShowPayPal] = useState(false);

    useEffect(() => {
        // Delay showing PayPal to ensure layout is stable
        const timer = setTimeout(() => {
            setShowPayPal(true);
        }, 2000); // Increased to 2 seconds

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!showPayPal) return;

        // Load PayPal SDK (shared across all instances)
        loadPayPalScript(() => {
            setIsPayPalReady(true);
        });
    }, [showPayPal]);

    useEffect(() => {
        if (!isPayPalReady || !paypalContainerRef.current || !window.paypal?.HostedButtons) {
            return;
        }

        try {
            paypalContainerRef.current.innerHTML = '';
            
            window.paypal
                .HostedButtons({
                    hostedButtonId: hostedButtonId,
                })
                .render(paypalContainerRef.current);
        } catch (error) {
            console.error('Failed to render PayPal button:', error);
        }
    }, [isPayPalReady, hostedButtonId]);

    return (
        <motion.div
            className={`relative z-0 flex flex-col rounded-lg border-2 p-4 shadow-lg transition sm:p-6 ${
                popular
                    ? 'border-(--primary) bg-(--card) shadow-xl shadow-(--primary)/20'
                    : 'border-(--accent) bg-(--card)'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
        >
            {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-(--primary) px-4 py-1 text-xs font-bold text-white">
                    MOST POPULAR
                </div>
            )}

            <div className="mb-3 text-center sm:mb-4">
                <h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-(--primary) sm:text-4xl">{price}</span>
                </div>
                <p className="mt-2 text-xs text-gray-300 sm:text-sm">{description}</p>
            </div>

            <ul className="mb-6 flex-1 space-y-3">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-200">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-(--primary)" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            {/* PayPal Button Container */}
            <div className="mt-auto w-full pb-6" style={{ minHeight: '90px' }}>
                {showPayPal ? (
                    <div 
                        ref={paypalContainerRef}
                        className="w-full"
                        style={{ 
                            minHeight: '45px',
                            display: 'block'
                        }}
                    />
                ) : (
                    <button
                        disabled
                        className="w-full rounded-lg bg-gray-400 px-6 py-3 font-semibold text-white"
                    >
                        Loading PayPal...
                    </button>
                )}
            </div>

            {/* Fallback button if JavaScript doesn't load */}
            <noscript>
                <a
                    href={`https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${hostedButtonId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block w-full rounded-lg bg-(--primary) px-6 py-3 text-center font-semibold text-white transition hover:bg-(--accent)"
                >
                    Get Started
                </a>
            </noscript>
        </motion.div>
    );
}
