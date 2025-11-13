import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div title="Privacy Policy">
            <div className="mx-auto max-w-4xl space-y-4 bg-gray-900 p-6 text-white">
                <h1 className="text-2xl font-bold">Privacy Policy</h1>
                <p>
                    <strong>Effective Date:</strong> October 7, 2025
                </p>
                <p>
                    This Privacy Policy explains how we collect, use, and protect information when you visit GraveYard Jokes Studios Inc.
                    (graveyardjokes.com).
                </p>
                <h2 className="text-xl font-semibold">1. Information We Collect</h2>
                <p>We automatically collect certain information when you visit our site:</p>
                <ul className="list-inside list-disc">
                    <li>IP address and approximate geographic location (city, region, country)</li>
                    <li>Browser type and version (user agent)</li>
                    <li>Visit timestamps and page views</li>
                    <li>Referrer information</li>
                </ul>
                <p>When you contact us through our contact form, we collect:</p>
                <ul className="list-inside list-disc">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Message content</li>
                </ul>
                <h2 className="text-xl font-semibold">2. How We Collect Information</h2>
                <p>
                    <strong>Visitor Tracking:</strong> We automatically track basic visitor information on every page visit using custom analytics.
                    This includes your IP address, which we use with geolocation services (IPInfo.io) to determine your approximate location.
                </p>
                <p>
                    <strong>Google Analytics:</strong> We use Google Analytics to understand site usage patterns. Google Analytics may set cookies and
                    collect data according to Google's privacy policy.
                </p>
                <p>
                    <strong>Session Cookies:</strong> We use essential session cookies (named <code>graveyardjokes_session</code>) for basic site
                    functionality and CSRF protection. These are necessary for the site to function properly.
                </p>
                <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-inside list-disc">
                    <li>Understand site usage and improve user experience</li>
                    <li>Monitor site performance and identify issues</li>
                    <li>Respond to contact form inquiries</li>
                    <li>Send email notifications about site visitors (for site administration)</li>
                    <li>Ensure site security and prevent abuse</li>
                </ul>
                <h2 className="text-xl font-semibold">4. Data Sharing and Security</h2>
                <p>
                    We do not sell, trade, or share your personal information with third parties except as required by law or as described in this
                    policy. We use the following third-party services:
                </p>
                <ul className="list-inside list-disc">
                    <li>
                        <strong>Google Analytics:</strong> For site usage analytics
                    </li>
                    <li>
                        <strong>IPInfo.io:</strong> For geolocation services
                    </li>
                    <li>
                        <strong>Zoho Mail:</strong> For email services and notifications
                    </li>
                </ul>
                <p>
                    Visitor data is cached temporarily to improve performance and reduce API calls. Contact form submissions are stored securely and
                    used only to respond to inquiries.
                </p>
                <h2 className="text-xl font-semibold">5. Your Rights and Choices</h2>
                <p>
                    You can disable cookies in your browser, though this may affect site functionality. If you have questions about your data or wish
                    to request information about data we may have collected, contact us at{' '}
                    <a href="mailto:info@graveyardjokes.com" className="text-blue-600 underline">
                        info@graveyardjokes.com
                    </a>
                    .
                </p>
                <h2 className="text-xl font-semibold">6. Updates to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
            </div>
        </div>
    );
};

export default Privacy;
