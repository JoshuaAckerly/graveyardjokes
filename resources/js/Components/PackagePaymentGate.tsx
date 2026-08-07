import PayPalCheckoutButton from '@/Components/PayPalCheckoutButton';
import { Link } from '@inertiajs/react';

export type PackageSlug =
    | 'starter'
    | 'professional'
    | 'premium'
    | 'design-starter'
    | 'design-professional'
    | 'design-premium'
    | 'modernization-starter'
    | 'modernization-professional'
    | 'modernization-premium'
    | 'seo'
    | 'ecommerce';

interface PackagePaymentGateProps {
    amount: number;
    item: string;
    packageSlug: PackageSlug;
}

export default function PackagePaymentGate({ amount, item, packageSlug }: PackagePaymentGateProps) {
    const intakeUrl = `/services/intake?package=${packageSlug}`;

    return (
        <div className="flex flex-col gap-2">
            <PayPalCheckoutButton amount={amount} item={item} />
            <Link
                href={intakeUrl}
                className="text-center text-xs text-white/40 transition hover:text-white/70"
            >
                Fill out project questionnaire (optional)
            </Link>
        </div>
    );
}
