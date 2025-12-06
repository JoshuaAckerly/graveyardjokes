import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface PayPalDonateButtonProps {
    variant?: 'default' | 'compact' | 'footer';
    className?: string;
    hostedButtonId?: string;
}

export default function PayPalDonateButton({ variant = 'default', className = '', hostedButtonId }: PayPalDonateButtonProps) {
    const paypalContainerRef = useRef<HTMLDivElement>(null);
    const customButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // Only render PayPal button for default variant if hosted button ID is provided
        if (variant === 'default' && hostedButtonId && paypalContainerRef.current && window.paypal?.HostedButtons) {
            // Clear any existing buttons
            paypalContainerRef.current.innerHTML = '';

            try {
                window.paypal
                    .HostedButtons({
                        hostedButtonId: hostedButtonId,
                    })
                    .render(paypalContainerRef.current);
            } catch (error) {
                console.error('Failed to render PayPal button:', error);
            }
        }
    }, [variant, hostedButtonId]);

    const handleDonate = () => {
        const paypalUrl = 'https://www.paypal.com/donate/?business=admin@graveyardjokes.com&currency_code=USD';
        window.open(paypalUrl, '_blank', 'noopener,noreferrer');
    };

    if (variant === 'compact') {
        return (
            <motion.button
                ref={customButtonRef}
                onClick={handleDonate}
                className={`flex items-center gap-2 rounded-lg bg-[#0070ba] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#005a95] ${className}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Heart className="h-4 w-4" fill="currentColor" />
                <span>Donate</span>
            </motion.button>
        );
    }

    if (variant === 'footer') {
        return (
            <motion.button
                ref={customButtonRef}
                onClick={handleDonate}
                className={`flex items-center gap-2 rounded-lg bg-[#0070ba] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#005a95] ${className}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Heart className="h-3 w-3" fill="currentColor" />
                <span>Support Us</span>
            </motion.button>
        );
    }

    // Default variant - full card with PayPal SDK integration
    return (
        <motion.div
            className={`relative z-10 mx-auto max-w-md rounded-lg border-2 border-(--accent) bg-(--card) p-6 text-center shadow-lg ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="mb-4 flex justify-center">
                <Heart className="h-12 w-12 text-(--primary)" fill="currentColor" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">Support Our Studio</h3>
            <p className="mb-4 text-sm text-gray-300">
                Help fund GraveYard Jokes Studios and support the creation of more creative projects!
            </p>

            {/* PayPal SDK Button Container - only shows if hostedButtonId is provided */}
            {hostedButtonId && <div ref={paypalContainerRef} className="relative z-0 mb-3"></div>}

            {/* Main donation button */}
            <motion.button
                onClick={handleDonate}
                className="w-full rounded-lg bg-[#0070ba] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#005a95]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Donate via PayPal
            </motion.button>

            <p className="mt-3 text-xs text-gray-400">Every contribution helps keep the lights on! ✨</p>
        </motion.div>
    );
}
