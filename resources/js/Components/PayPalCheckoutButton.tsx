import { useEffect, useRef } from 'react';
import { loadPayPalSdk } from '../lib/paypalSdk';

// Import PayPal types (global augmentation)
/// <reference path="../types/paypal.d.ts" />

interface PayPalCheckoutButtonProps {
    amount: number;
    item: string;
    onSuccess?: (details: Record<string, unknown>) => void;
}

function getPayPalErrorText(error: unknown): string {
    if (!error) {
        return 'Unknown PayPal error.';
    }

    if (typeof error === 'string') {
        return error;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return JSON.stringify(error);
}

function extractCorrelationId(errorMessage: string): string | null {
    const match = errorMessage.match(/Corr ID:\s*([a-zA-Z0-9]+)/i);
    return match?.[1] ?? null;
}

export default function PayPalCheckoutButton({ amount, item, onSuccess }: PayPalCheckoutButtonProps) {
    const paypalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;

        const renderPayPalButton = () => {
            if (!isMounted || !window.paypal || !paypalRef.current) return;

            // Clear any existing content
            paypalRef.current.innerHTML = '';

            window.paypal
                .Buttons({
                    createOrder: (_data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: { value: amount.toFixed(2) },
                                    description: item,
                                },
                            ],
                        });
                    },
                    onApprove: async (_data, actions) => {
                        const details = await actions.order.capture();
                        // Send payment details to auth-system
                        await fetch('/api/purchases', {
                            method: 'POST',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                item,
                                amount,
                                paypal_transaction_id: (details as Record<string, unknown>).id,
                            }),
                        });
                        if (onSuccess) onSuccess(details as Record<string, unknown>);
                        alert('Payment successful!');
                    },
                    onError: (err) => {
                        console.error('PayPal error:', err);

                        const errorMessage = getPayPalErrorText(err);

                        if (errorMessage.includes('NOT_AUTHORIZED') || errorMessage.includes('insufficient permissions')) {
                            const correlationId = extractCorrelationId(errorMessage);
                            alert(
                                `PayPal checkout is not authorized for the current client ID. Update VITE_PAYPAL_CHECKOUT_CLIENT_ID to a PayPal REST app client ID with Checkout permissions.${
                                    correlationId ? ` Correlation ID: ${correlationId}` : ''
                                }`,
                            );
                            return;
                        }

                        alert('PayPal error: ' + errorMessage);
                    },
                })
                .render(paypalRef.current);
        };

        loadPayPalSdk({ components: ['buttons'] })
            .then(() => {
                renderPayPalButton();
            })
            .catch((error) => {
                const message = error instanceof Error ? error.message : 'Failed to load PayPal SDK';
                console.error(message);

                if (message.includes('Checkout Orders requires a REST app client ID')) {
                    alert('PayPal checkout is misconfigured. Please set VITE_PAYPAL_CHECKOUT_CLIENT_ID to your PayPal REST app client ID.');
                }
            });

        return () => {
            isMounted = false;
        };
    }, [amount, item, onSuccess]);

    return <div ref={paypalRef} className="paypal-button-container mt-4"></div>;
}
