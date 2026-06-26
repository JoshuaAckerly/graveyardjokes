import { getAuthSystemUrl } from '@/env';
import { Head } from '@inertiajs/react';

// This page is no longer used. Login is handled by the auth-system project.

export default function Login() {
    if (typeof window !== 'undefined') {
        const returnUrl = window.location.href;
        window.location.replace(`${getAuthSystemUrl()}/login?return_url=${encodeURIComponent(returnUrl)}`);
        return null;
    }
    return (
        <>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div>Redirecting to login...</div>
        </>
    );
}
