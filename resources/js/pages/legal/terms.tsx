import React from 'react';

const Terms: React.FC = () => {
    return (
        <div title="Terms of Service">
            <div className="max-w-4xl p-6 mx-auto space-y-4 text-white bg-gray-900">
                <h1 className="text-2xl font-bold">Terms of Service</h1>
                <p><strong>Effective Date:</strong> July 24, 2025</p>

                <p>
                    Welcome to GraveYardJokes Studios ("we", "us", or "our"). By accessing or using our website at{' '}
                    <a href="https://graveyardjokes.com" className="text-blue-600 underline">graveyardjokes.com</a>, you agree to these Terms of Service.
                </p>

                <h2 className="text-xl font-semibold">1. Use of the Site</h2>
                <p>
                    This site is a creative portfolio showcasing the work of Joshua Ackerly in web development, game design, music, and visual art. You may browse the site without an account. Some features, such as account creation, may become available. You must be at least 18 years of age to inquire about services.
                </p>

                <h2 className="text-xl font-semibold">2. Prohibited Conduct</h2>
                <p>By using this site, you agree not to:</p>
                <ul className="list-disc list-inside">
                    <li>Post or transmit any illegal, hateful, harassing, or spam content</li>
                    <li>Interfere with the site’s operation or security</li>
                    <li>Attempt to access restricted parts of the site without authorization</li>
                </ul>
                <p>We reserve the right to suspend or terminate user accounts at our sole discretion.</p>

                <h2 className="text-xl font-semibold">3. Intellectual Property</h2>
                <p>
                    All content, code, graphics, and music on this site is the property of Joshua Ackerly unless otherwise stated. You may not copy, reproduce, or use materials without permission.
                </p>


                <h2 className="text-xl font-semibold">4. Cookies, Sessions, and Technical Data</h2>
                <p>
                    By using this site, you acknowledge and agree that we use session cookies (e.g., <code>graveyard_jokes_studio_session</code>) to manage your login state and other session data. Session data is stored securely in our database and is not accessible to third parties. Session cookies are set with the following technical attributes:
                </p>
                <ul className="list-disc list-inside ml-6">
                    <li><strong>Path:</strong> <code>/</code> (cookie is valid for the entire site)</li>
                    <li><strong>Domain:</strong> Default (cookie is valid for the main domain)</li>
                    <li><strong>Secure:</strong> Only sent over HTTPS if enabled</li>
                    <li><strong>HTTPOnly:</strong> Not accessible via JavaScript</li>
                    <li><strong>SameSite:</strong> <code>lax</code> (helps protect against CSRF attacks)</li>
                    <li><strong>Partitioned:</strong> Not enabled by default</li>
                    <li><strong>Encryption:</strong> Session data is not encrypted in the cookie itself, but is protected in our database</li>
                </ul>
                <p>
                    If enabled, we may use third-party analytics (such as Google Analytics) to track site usage. These cookies are subject to their own privacy policies. For more information, see our <a href="/legal/cookies" className="text-blue-600 underline">Cookie Policy</a> and <a href="/legal/privacy" className="text-blue-600 underline">Privacy Policy</a>.
                </p>

                <h2 className="text-xl font-semibold">5. External Links</h2>
                <p>
                    This site may link to third-party services including Fiverr, YouTube, Instagram, and others. We are not responsible for the content or privacy practices of those sites.
                </p>

                <h2 className="text-xl font-semibold">6. Refund Policy (For Contract Work)</h2>
                <p>Refunds are handled through Fiverr. However, our general refund policy is:</p>
                <ul className="list-disc list-inside">
                    <li>Full refund if no work has begun</li>
                    <li>Partial refund based on work completed</li>
                    <li>No refund for completed or approved work</li>
                    <li>Deposits are non-refundable unless otherwise agreed in writing</li>
                </ul>
                <p>We aim to resolve concerns through revisions or support before refunds are discussed.</p>

                <h2 className="text-xl font-semibold">7. Modifications</h2>
                <p>
                    We may update these Terms at any time. Continued use of the site after changes means you accept the new Terms.
                </p>
            </div>
        </div>
    );
};

export default Terms;
