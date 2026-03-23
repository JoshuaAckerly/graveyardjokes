import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

interface AdBannerProps {
    slot: string;
    format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
    className?: string;
}

export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch {
            // AdSense not loaded (e.g. ad blocker or script not yet available)
        }
    }, []);

    return (
        <ins
            className={`adsbygoogle${className ? ` ${className}` : ''}`}
            style={{ display: 'block' }}
            data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
        />
    );
}
