/**
 * Google Analytics 4 Event Tracking for Graveyardjokes Agency
 */

declare global {
    interface Window {
        gtag?: Function;
    }
}

/**
 * Track a form submission event
 */
export const trackFormSubmission = (formName: string, metadata?: Record<string, string | number | boolean>) => {
    if (window.gtag) {
        window.gtag('event', 'form_submit', {
            form_name: formName,
            ...metadata,
        });
    }
};

/**
 * Track a button click event
 */
export const trackButtonClick = (buttonName: string, category?: string) => {
    if (window.gtag) {
        window.gtag('event', 'button_click', {
            button_name: buttonName,
            button_category: category || 'general',
        });
    }
};

/**
 * Track a CTA click (call-to-action)
 */
export const trackCTAClick = (ctaName: string, destination?: string) => {
    if (window.gtag) {
        window.gtag('event', 'cta_click', {
            cta_name: ctaName,
            destination: destination || 'unknown',
        });
    }
};

/**
 * Track service package selection
 */
export const trackPackageSelection = (packageName: string, packagePrice?: number) => {
    if (window.gtag) {
        window.gtag('event', 'package_select', {
            package_name: packageName,
            value: packagePrice,
            currency: 'USD',
        });
    }
};

/**
 * Track eCommerce events for service packages
 */
export const trackBeginCheckout = (packageName: string, price: number) => {
    if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
            currency: 'USD',
            value: price,
            items: [
                {
                    item_name: packageName,
                    price: price,
                    item_category: 'Service Package',
                },
            ],
        });
    }
};

/**
 * Track engagement events
 */
export const trackEngagement = (eventName: string, category: string, label?: string) => {
    if (window.gtag) {
        window.gtag('event', eventName, {
            event_category: category,
            event_label: label,
        });
    }
};
