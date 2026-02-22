type PayPalComponent = 'buttons' | 'hosted-buttons';

interface LoadPayPalSdkOptions {
    components?: PayPalComponent[];
    timeoutMs?: number;
}

let paypalSdkPromise: Promise<PayPalSDK> | null = null;

function isLikelyHostedButtonsClientId(clientId: string): boolean {
    return clientId.startsWith('BA');
}

function resolvePayPalClientId(components: PayPalComponent[]): string {
    const environment = import.meta.env.VITE_PAYPAL_ENVIRONMENT;
    const isProduction = environment === 'production';
    const checkoutClientId = import.meta.env.VITE_PAYPAL_CHECKOUT_CLIENT_ID;
    const fallbackClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    const sandboxClientId = import.meta.env.VITE_PAYPAL_SANDBOX_CLIENT_ID;

    if (!isProduction) {
        if (!sandboxClientId) {
            throw new Error('Missing VITE_PAYPAL_SANDBOX_CLIENT_ID for sandbox environment.');
        }

        return sandboxClientId;
    }

    const needsCheckoutOrders = components.includes('buttons');
    const productionClientId = checkoutClientId || fallbackClientId;

    if (!productionClientId) {
        throw new Error('Missing PayPal production client ID. Set VITE_PAYPAL_CHECKOUT_CLIENT_ID (or VITE_PAYPAL_CLIENT_ID).');
    }

    if (needsCheckoutOrders && isLikelyHostedButtonsClientId(productionClientId)) {
        throw new Error(
            'Configured PayPal client ID appears to be a Hosted Buttons ID. Checkout Orders requires a REST app client ID from PayPal Developer Apps & Credentials.',
        );
    }

    return productionClientId;
}

function buildPayPalSdkUrl(components: PayPalComponent[]) {
    const clientId = resolvePayPalClientId(components);

    const params = new URLSearchParams({
        'client-id': clientId,
        components: components.join(','),
        currency: 'USD',
        'enable-funding': 'venmo,paylater',
        'disable-funding': 'card,credit',
    });

    return `https://www.paypal.com/sdk/js?${params.toString()}`;
}

export function loadPayPalSdk(options: LoadPayPalSdkOptions = {}): Promise<PayPalSDK> {
    const components = options.components ?? ['buttons', 'hosted-buttons'];
    const timeoutMs = options.timeoutMs ?? 15000;

    if (window.paypal) {
        return Promise.resolve(window.paypal);
    }

    if (paypalSdkPromise) {
        return paypalSdkPromise;
    }

    let scriptSrc: string;

    try {
        scriptSrc = buildPayPalSdkUrl(components);
    } catch (error) {
        const normalizedError = error instanceof Error ? error : new Error('Failed to resolve PayPal SDK configuration.');
        return Promise.reject(normalizedError);
    }

    paypalSdkPromise = new Promise<PayPalSDK>((resolve, reject) => {
        const timeoutId = window.setTimeout(() => {
            finishWithError(new Error(`PayPal SDK failed to load within ${timeoutMs / 1000} seconds`));
        }, timeoutMs);

        const finishWithError = (error: Error) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            paypalSdkPromise = null;
            reject(error);
        };

        const finishWithSuccess = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            if (!window.paypal) {
                finishWithError(new Error('PayPal SDK loaded but window.paypal is unavailable.'));
                return;
            }

            resolve(window.paypal);
        };

        const existingScript = document.querySelector<HTMLScriptElement>('script[data-paypal-sdk="true"]');

        if (existingScript) {
            existingScript.addEventListener('load', finishWithSuccess, { once: true });
            existingScript.addEventListener('error', () => finishWithError(new Error('Failed to load PayPal SDK script.')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = scriptSrc;
        script.async = true;
        script.setAttribute('data-paypal-sdk', 'true');
        script.onload = finishWithSuccess;
        script.onerror = () => finishWithError(new Error('Failed to load PayPal SDK script.'));
        document.body.appendChild(script);
    });

    return paypalSdkPromise;
}