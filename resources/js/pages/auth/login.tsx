import { Head } from '@inertiajs/react';

// This page is no longer used. Login is handled by the auth-system project.

export default function Login() {
    if (typeof window !== 'undefined') {
        window.location.replace('http://auth-system.test/login');
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
