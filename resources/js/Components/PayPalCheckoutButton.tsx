import { useEffect, useRef } from 'react';
import axios from 'axios';

interface PayPalCheckoutButtonProps {
  amount: number;
  item: string;
  onSuccess?: (details: any) => void;
}

export default function PayPalCheckoutButton({ amount, item, onSuccess }: PayPalCheckoutButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.paypal || !paypalRef.current) return;

    window.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: { value: amount.toFixed(2) },
              description: item,
            },
          ],
        });
      },
      onApprove: async (data: any, actions: any) => {
        const details = await actions.order.capture();
        // Send payment details to auth-system
        await axios.post(
          'http://localhost:8007/api/purchases',
          {
            item,
            amount,
            paypal_transaction_id: details.id,
          },
          { withCredentials: true }
        );
        if (onSuccess) onSuccess(details);
        alert('Payment successful!');
      },
      onError: (err: any) => {
        alert('PayPal error: ' + err);
      },
    }).render(paypalRef.current);
  }, [amount, item, onSuccess]);

  return <div ref={paypalRef}></div>;
}
