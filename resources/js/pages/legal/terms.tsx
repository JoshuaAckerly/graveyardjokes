import InertiaHead from '@/Components/InertiaHead';
import React from 'react';

const Terms: React.FC = () => {
    return (
        <>
            <InertiaHead />
            <div title="Terms of Service" className="mx-auto max-w-4xl space-y-4 bg-gray-900 p-6 text-white">
                <h1 className="text-2xl font-bold">Terms of Service</h1>
                <p>
                    <strong>Effective Date:</strong> September 18, 2026
                </p>

                <p>
                    Welcome to Graveyard Jokes ("we", "us", or "our"). By accessing or using our website at{' '}
                    <a href="https://graveyardjokes.com" className="text-blue-600 underline">
                        graveyardjokes.com
                    </a>
                    , you agree to these Terms of Service.
                </p>

                <h2 className="text-xl font-semibold">1. Use of the Site</h2>
                <p>
                    Graveyard Jokes is a small songwriting project that also builds a few games and other small things. This site shares that music
                    and those projects. Most of the site is publicly accessible for viewing without an account. You may optionally create a free
                    account to receive updates. By using this site, you acknowledge that we may track basic visitor analytics for site improvement
                    purposes.
                </p>

                <h2 className="text-xl font-semibold">2. Prohibited Conduct</h2>
                <p>By using this site, you agree not to:</p>
                <ul className="list-inside list-disc">
                    <li>Post or transmit any illegal, hateful, harassing, or spam content</li>
                    <li>Interfere with the site’s operation or security</li>
                    <li>Attempt to access restricted parts of the site without authorization</li>
                </ul>
                <p>We reserve the right to suspend or terminate user accounts at our sole discretion.</p>

                <h2 className="text-xl font-semibold">3. Intellectual Property</h2>
                <p>
                    All content, code, graphics, and music on this site is the property of Joshua Ackerly unless otherwise stated. You may not copy,
                    reproduce, or use materials without permission.
                </p>

                <h2 className="text-xl font-semibold">4. Visitor Tracking and Analytics</h2>
                <p>
                    By using this site, you acknowledge that we collect basic visitor information for analytics and site improvement purposes,
                    including:
                </p>
                <ul className="ml-6 list-inside list-disc">
                    <li>IP address and approximate geographic location</li>
                    <li>Browser information and user agent</li>
                    <li>Visit timestamps and page views</li>
                    <li>Referrer information</li>
                </ul>
                <p>
                    We use Google Analytics and may use geolocation services (such as IPInfo.io) to understand our site traffic. We also use session
                    cookies for basic site functionality. This data helps us improve the site experience and understand our audience.
                </p>
                <p>
                    For more information about our data practices, see our{' '}
                    <a href="/privacy" className="text-blue-600 underline">
                        Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a href="/cookies" className="text-blue-600 underline">
                        Cookie Policy
                    </a>
                    .
                </p>

                <h2 className="text-xl font-semibold">5. External Links</h2>
                <p>
                    This site may link to third-party services including YouTube, Instagram, and others. We are not responsible for the content or
                    privacy practices of those sites.
                </p>

                <h2 className="text-xl font-semibold">6. Contact</h2>
                <p>
                    This site is a place to share our music and small projects and to get in touch. Any inquiries can be made through the{' '}
                    <a href="/contact" className="text-blue-600 underline">
                        contact form
                    </a>{' '}
                    or by email at{' '}
                    <a href="mailto:admin@graveyardjokes.com" className="text-blue-600 underline">
                        admin@graveyardjokes.com
                    </a>
                    .
                </p>

                <h2 className="text-xl font-semibold">7. Accounts and Notifications</h2>
                <p>
                    Creating an account is optional and free. If you create one, you are responsible for the activity on your account. You may receive
                    occasional updates related to Graveyard Jokes. You may not use any site feature to send unsolicited communications or to harass
                    others.
                </p>

                <h2 className="text-xl font-semibold">8. Modifications</h2>
                <p>We may update these Terms at any time. Continued use of the site after changes means you accept the new Terms.</p>
            </div>
        </>
    );
};

export default Terms;
