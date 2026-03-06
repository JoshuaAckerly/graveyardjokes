import PayPalCheckoutButton from '@/Components/PayPalCheckoutButton';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export type PackageSlug = 'starter' | 'professional' | 'premium';

interface PackagePaymentGateProps {
    amount: number;
    item: string;
    packageSlug: PackageSlug;
}

const packageLabelMap: Record<PackageSlug, string> = {
    starter: 'Starter Package',
    professional: 'Professional Package',
    premium: 'Premium Package',
};

function getPackageLabel(slug: string | null): string | null {
    if (slug === 'starter' || slug === 'professional' || slug === 'premium') {
        return packageLabelMap[slug];
    }

    return null;
}

export default function PackagePaymentGate({ amount, item, packageSlug }: PackagePaymentGateProps) {
    const page = usePage().props as unknown as SharedData;
    const intake = page.websiteIntake;

    const selectedPackage = typeof intake?.selectedPackage === 'string' ? intake.selectedPackage.toLowerCase() : null;
    const hasCompletedIntake = intake?.completed === true;
    const canCheckout = hasCompletedIntake && selectedPackage === packageSlug;

    if (canCheckout) {
        return <PayPalCheckoutButton amount={amount} item={item} />;
    }

    const intakeUrl = `/services/intake?package=${packageSlug}`;
    const selectedPackageLabel = getPackageLabel(selectedPackage);

    const message =
        hasCompletedIntake && selectedPackage && selectedPackage !== packageSlug
            ? `Your current intake is saved for ${selectedPackageLabel ?? 'a different package'}. Submit this package intake to unlock payment.`
            : 'Complete the pre-payment project intake form to unlock checkout for this package.';

    return (
        <div className="mt-4 rounded-lg border border-(--accent)/70 bg-black/30 p-4 text-left">
            <p className="text-sm text-white/80">{message}</p>
            <Link
                href={intakeUrl}
                className="mt-3 inline-flex items-center rounded-md bg-(--primary) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--accent)"
            >
                Start Questionnaire
            </Link>
        </div>
    );
}
