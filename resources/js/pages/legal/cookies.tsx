// resources/js/Pages/Legal/Cookies.tsx

const Cookies = () => {
    return (
        <div title="Cookie Policy">
            <div className="mx-auto max-w-4xl space-y-4 bg-gray-900 p-6 text-white">
                <h1 className="text-2xl font-bold">Cookie Policy</h1>
                <p>
                    <strong>Effective Date:</strong> October 7, 2025
                </p>

                <p>
                    This Cookie Policy explains how GraveYard Jokes Studios Inc. uses cookies and similar technologies when you visit{' '}
                    <strong>graveyardjokes.com</strong>.
                </p>

                <h2 className="text-xl font-semibold">1. What are Cookies?</h2>
                <p>
                    Cookies are small text files stored on your device when you visit our website. They help us provide basic functionality,
                    understand site usage, and improve your browsing experience.
                </p>

                <h2 className="text-xl font-semibold">2. Types of Cookies We Use</h2>

                <h3 className="mt-4 text-lg font-semibold">Essential Cookies</h3>
                <p>We use essential session cookies for basic site functionality:</p>
                <ul className="ml-4 list-inside list-disc">
                    <li>
                        <strong>Session Cookie</strong> (<code>graveyardjokes_session</code>) – Required for CSRF protection and basic site security.
                        This cookie:
                        <ul className="mt-2 ml-6 list-inside list-disc">
                            <li>
                                Is valid for the entire site (Path: <code>/</code>)
                            </li>
                            <li>Is HTTPOnly (not accessible via JavaScript)</li>
                            <li>
                                Uses SameSite: <code>lax</code> for CSRF protection
                            </li>
                            <li>Is sent over HTTPS when available</li>
                        </ul>
                    </li>
                </ul>

                <h3 className="mt-4 text-lg font-semibold">Analytics Cookies</h3>
                <ul className="ml-4 list-inside list-disc">
                    <li>
                        <strong>Google Analytics</strong> – We use Google Analytics to understand how visitors use our site. These cookies collect
                        anonymous usage data and are governed by Google's privacy policy.
                    </li>
                </ul>

                <h3 className="mt-4 text-lg font-semibold">Visitor Tracking</h3>
                <p>
                    We automatically collect visitor information (IP address, location, browser details) for site analytics and improvement. This data
                    is processed server-side and does not require additional cookies beyond our essential session cookie.
                </p>

                <h2 className="text-xl font-semibold">3. Managing Cookies</h2>
                <p>You can control cookies through your browser settings:</p>
                <ul className="ml-4 list-inside list-disc">
                    <li>Block all cookies (may affect site functionality)</li>
                    <li>Block third-party cookies only</li>
                    <li>Clear existing cookies</li>
                    <li>Set preferences for future cookie handling</li>
                </ul>
                <p className="mt-4">
                    Note that disabling essential cookies may prevent the site from functioning properly, particularly the contact form and security
                    features.
                </p>

                <h2 className="text-xl font-semibold">4. Consent</h2>
                <p>
                    By continuing to use this website, you consent to our use of cookies as described in this policy. If you do not agree to our use
                    of cookies, please adjust your browser settings or discontinue use of the site.
                </p>
            </div>
        </div>
    );
};

export default Cookies;
