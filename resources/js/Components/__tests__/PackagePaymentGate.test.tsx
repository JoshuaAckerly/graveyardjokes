import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { vi } from 'vitest';
import PackagePaymentGate from '../PackagePaymentGate';

vi.mock('@inertiajs/react', () => ({
    Link: ({ href, children, className }: { href: string; children: ReactNode; className?: string }) => (
        <a href={href} className={className}>
            {children}
        </a>
    ),
}));

vi.mock('@/Components/PayPalCheckoutButton', () => ({
    __esModule: true,
    default: ({ amount, item }: { amount: number; item: string }) => <div data-testid="paypal-checkout">{`${item}-${amount}`}</div>,
}));

describe('PackagePaymentGate', () => {
    it('shows checkout and the optional questionnaire link', () => {
        render(<PackagePaymentGate amount={199} item="Starter Package" packageSlug="starter" />);

        expect(screen.getByTestId('paypal-checkout')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Fill out project questionnaire (optional)' })).toHaveAttribute(
            'href',
            '/services/intake?package=starter',
        );
    });
});
