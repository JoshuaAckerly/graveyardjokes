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
        if (!window.paypal || !paypalRef.current) return;

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
                    alert('PayPal error: ' + err);
                },
            })
            .render(paypalRef.current);
    }, [amount, item, onSuccess]);

    return <div ref={paypalRef}></div>;
}
