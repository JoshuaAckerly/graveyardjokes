import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import PackagePaymentGate from '../PackagePaymentGate';

const mockUsePage = vi.fn();

vi.mock('@inertiajs/react', () => ({
    Link: ({ href, children, className }: any) => (
        <a href={href} className={className}>
            {children}
        </a>
    ),
    usePage: () => mockUsePage(),
}));

vi.mock('@/Components/PayPalCheckoutButton', () => ({
    __esModule: true,
    default: ({ amount, item }: { amount: number; item: string }) => <div data-testid="paypal-checkout">{`${item}-${amount}`}</div>,
}));

describe('PackagePaymentGate', () => {
    beforeEach(() => {
        mockUsePage.mockReset();
    });

    it('shows questionnaire link when intake is not completed', () => {
        mockUsePage.mockReturnValue({
            props: {
                websiteIntake: {
                    completed: false,
                    selectedPackage: null,
                    submissionId: null,
                    submittedAt: null,
                },
            },
        });

        render(<PackagePaymentGate amount={199} item="Starter Package" packageSlug="starter" />);

        expect(screen.queryByTestId('paypal-checkout')).not.toBeInTheDocument();
        expect(screen.getByText(/Complete the pre-payment project intake form/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Start Questionnaire' })).toHaveAttribute('href', '/services/intake?package=starter');
    });

    it('shows PayPal checkout when intake is completed for the same package', () => {
        mockUsePage.mockReturnValue({
            props: {
                websiteIntake: {
                    completed: true,
                    selectedPackage: 'starter',
                    submissionId: 7,
                    submittedAt: '2026-03-06T12:00:00Z',
                },
            },
        });

        render(<PackagePaymentGate amount={199} item="Starter Package" packageSlug="starter" />);

        expect(screen.getByTestId('paypal-checkout')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Start Questionnaire' })).not.toBeInTheDocument();
    });

    it('shows package mismatch guidance when intake was completed for a different package', () => {
        mockUsePage.mockReturnValue({
            props: {
                websiteIntake: {
                    completed: true,
                    selectedPackage: 'professional',
                    submissionId: 3,
                    submittedAt: '2026-03-06T12:00:00Z',
                },
            },
        });

        render(<PackagePaymentGate amount={199} item="Starter Package" packageSlug="starter" />);

        expect(screen.queryByTestId('paypal-checkout')).not.toBeInTheDocument();
        expect(screen.getByText(/saved for Professional Package/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Start Questionnaire' })).toHaveAttribute('href', '/services/intake?package=starter');
    });
});
