import axios from 'axios';
import { useEffect, useRef } from 'react';

// Import PayPal types (global augmentation)
/// <reference path="../types/paypal.d.ts" />

interface PayPalCheckoutButtonProps {
    amount: number;
    item: string;
    onSuccess?: (details: Record<string, unknown>) => void;
}

export default function PayPalCheckoutButton({ amount, item, onSuccess }: PayPalCheckoutButtonProps) {
    const paypalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderPayPalButton = () => {
            if (!window.paypal || !paypalRef.current) return;

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
                        await axios.post(
                            'http://localhost:8007/api/purchases',
                            {
                                item,
                                amount,
                                paypal_transaction_id: (details as Record<string, unknown>).id,
                            },
                            { withCredentials: true },
                        );
                        if (onSuccess) onSuccess(details as Record<string, unknown>);
                        alert('Payment successful!');
                    },
                    onError: (err) => {
                        console.error('PayPal error:', err);
                        alert('PayPal error: ' + err);
                    },
                })
                .render(paypalRef.current);
        };

        // If PayPal SDK is already loaded, render immediately
        if (window.paypal) {
            renderPayPalButton();
        } else {
            // Wait for PayPal SDK to load
            const checkPayPal = setInterval(() => {
                if (window.paypal) {
                    clearInterval(checkPayPal);
                    renderPayPalButton();
                }
            }, 100);

            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkPayPal);
                console.error('PayPal SDK failed to load within 10 seconds');
            }, 10000);
        }
    }, [amount, item, onSuccess]);

    return <div ref={paypalRef} className="paypal-button-container mt-4"></div>;
}
