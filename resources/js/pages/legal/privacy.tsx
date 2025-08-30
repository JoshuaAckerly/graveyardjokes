import React from "react";

const Privacy: React.FC = () => {
  return (
    <div title="Privacy Policy">
      <div className="mx-auto max-w-4xl space-y-4 bg-gray-900 p-6 text-white">
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
        <p>
          <strong>Effective Date:</strong> July 24, 2025
        </p>
        <p>
          This Privacy Policy explains how we collect, use, and protect your
          personal information when you visit GraveYardJokes Studios.
        </p>
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>When you create an account or contact us, we may collect:</p>
        <ul className="list-inside list-disc">
          <li>Name</li>
          <li>Email address</li>
          <li>IP address</li>
        </ul>
        <h2 className="text-xl font-semibold">
          2. Cookies, Sessions, and Analytics
        </h2>
        <p>
          <strong>Session Cookies:</strong> We use a session cookie (named based
          on our app name, e.g., <code>graveyard_jokes_studio_session</code>) to
          manage your login state and other session data. Session data is stored
          securely in our database and is not accessible to third parties. The
          session cookie is set with the following technical attributes:
        </p>
        <ul className="ml-6 list-inside list-disc">
          <li>
            <strong>Path:</strong> <code>/</code> (cookie is valid for the
            entire site)
          </li>
          <li>
            <strong>Domain:</strong> Default (cookie is valid for the main
            domain)
          </li>
          <li>
            <strong>Secure:</strong> Only sent over HTTPS if enabled
          </li>
          <li>
            <strong>HTTPOnly:</strong> Not accessible via JavaScript
          </li>
          <li>
            <strong>SameSite:</strong> <code>lax</code> (helps protect against
            CSRF attacks)
          </li>
          <li>
            <strong>Partitioned:</strong> Not enabled by default
          </li>
          <li>
            <strong>Encryption:</strong> Session data is not encrypted in the
            cookie itself, but is protected in our database
          </li>
        </ul>
        <p>
          <strong>Analytics Cookies:</strong> If enabled, we may use third-party
          analytics (such as Google Analytics) to track site usage. These
          cookies are subject to their own privacy policies.
        </p>
        <h2 className="text-xl font-semibold">3. Data Use and Security</h2>
        <p>Your information is used to:</p>
        <ul className="list-inside list-disc">
          <li>Manage your account and session (if applicable)</li>
          <li>Respond to inquiries</li>
          <li>Analyze site performance and usage</li>
        </ul>
        <p>
          We do not share your data with third parties except as required by
          law. Session data is stored in our secure database and is not
          accessible to unauthorized parties. Cookies are set with security
          attributes to help protect your privacy and prevent unauthorized
          access.
        </p>
        <h2 className="text-xl font-semibold">4. Communications</h2>
        <p>
          We may send occasional updates or newsletters in the future. You will
          be able to opt out of marketing emails.
        </p>
        <h2 className="text-xl font-semibold">5. Your Rights</h2>
        <p>
          If you're a resident of a jurisdiction with data protection rights
          (e.g., the EU), you may request:
        </p>
        <ul className="list-inside list-disc">
          <li>Access to your data</li>
          <li>Correction or deletion</li>
          <li>Restriction of use</li>
        </ul>
        <h2 className="text-xl font-semibold">6. Chat and Messaging</h2>
        <p>
          We use Pusher Beams for real-time messaging. By using our site, you
          consent to the use of Pusher Beams for notifications.
        </p>
        <p>
          To provide these features, we use a third-party service called Pusher,
          which enables real-time data transfer between your browser and our
          servers.
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
        <ul className="list-inside list-disc">
          <li>Your message content</li>
          <li>Timestamps of your messages</li>
          <li>Your IP address and browser information</li>
          <li>Your user ID (if logged in)</li>
        </ul>
        <p>How We Use This Data</p>
        <ul className="list-inside list-disc">
          <li>To display messages in real-time</li>
          <li>To improve our chat features</li>
          <li>To monitor for abuse or spam</li>
        </ul>
        <p>Third-Party Disclosure</p>
        <p>
          We use Pusher (a service by Pusher Ltd., UK) to transmit real-time
          events. While we do not store your data on Pusher's servers, the
          service may temporarily process your message and connection data as
          required to relay it.
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
