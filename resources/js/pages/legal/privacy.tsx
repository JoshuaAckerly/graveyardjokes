import React from "react";

const Privacy: React.FC = () => {
    return (
        <div title="Privacy Policy">
            <div className="max-w-4xl p-6 mx-auto space-y-4 text-white bg-gray-900">
                <h1 className="text-2xl font-bold">Privacy Policy</h1>
                <p>
                    <strong>Effective Date:</strong> July 24, 2025
                </p>
                <p>
                    This Privacy Policy explains how we collect, use, and
                    protect your personal information when you visit
                    GraveYardJokes Studios.
                </p>
                <h2 className="text-xl font-semibold">
                    1. Information We Collect
                </h2>
                <p>When you create an account or contact us, we may collect:</p>
                <ul className="list-disc list-inside">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>IP address</li>
                </ul>
                <h2 className="text-xl font-semibold">
                    2. Cookies and Analytics
                </h2>
                <p>
                    We use Google Analytics to understand user behavior. Cookies
                    may be used to store session data. By using the site, you
                    consent to this.
                </p>
                <h2 className="text-xl font-semibold">3. Data Use</h2>
                <p>Your information is used to:</p>
                <ul className="list-disc list-inside">
                    <li>Manage your account (if applicable)</li>
                    <li>Respond to inquiries</li>
                    <li>Analyze site performance</li>
                </ul>
                <p>
                    We do not share your data with third parties except as
                    required by law.
                </p>
                <h2 className="text-xl font-semibold">4. Communications</h2>
                <p>
                    We may send occasional updates or newsletters in the future.
                    You will be able to opt out of marketing emails.
                </p>
                <h2 className="text-xl font-semibold">5. Your Rights</h2>
                <p>
                    If you're a resident of a jurisdiction with data protection
                    rights (e.g., the EU), you may request:
                </p>
                <ul className="list-disc list-inside">
                    <li>Access to your data</li>
                    <li>Correction or deletion</li>
                    <li>Restriction of use</li>
                </ul>
                <h2 className="text-xl font-semibold">6. Chat and Messaging</h2>
                <p>
                    We use Pusher Beams for real-time messaging. By using our
                    site, you consent to the use of Pusher Beams for
                    notifications.
                </p>
                <p>
                    To provide these features, we use a third-party service
                    called Pusher, which enables real-time data transfer between
                    your browser and our servers.
                </p>
                <p>
                    To make a request, email us at{" "}
                    <a
                        href="mailto:admin@graveyardjokes.com"
                        className="text-blue-600 underline"
                    >
                        admin@graveyardjokes.com
                    </a>
                    .
                </p>
                <p>What Data Is Collected</p>
                <ul className="list-disc list-inside">
                    <li>Your message content</li>
                    <li>Timestamps of your messages</li>
                    <li>Your IP address and browser information</li>
                    <li>Your user ID (if logged in)</li>
                </ul>
                <p>How We Use This Data</p>
                <ul className="list-disc list-inside">
                    <li>To display messages in real-time</li>
                    <li>To improve our chat features</li>
                    <li>To monitor for abuse or spam</li>
                </ul>
                <p>Third-Party Disclosure</p>
                <p>
                    We use Pusher (a service by Pusher Ltd., UK) to transmit
                    real-time events. While we do not store your data on
                    Pusher's servers, the service may temporarily process your
                    message and connection data as required to relay it.
                </p>
                <p>
                    You can view Pusher's Privacy Policy{" "}
                    <a href="https://pusher.com/legal/privacy-policy">here</a>.
                </p>
            </div>
        </div>
    );
};

export default Privacy;
