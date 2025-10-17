import React from "react";

const Terms: React.FC = () => {
  return (
    <div title="Terms of Service">
      <div className="mx-auto max-w-4xl space-y-4 bg-gray-900 p-6 text-white">
        <h1 className="text-2xl font-bold">Terms of Service</h1>
        <p>
          <strong>Effective Date:</strong> October 7, 2025
        </p>

        <p>
          Welcome to GraveYard Jokes Studios Inc. ("we", "us", or "our"). By accessing
          or using our website at{" "}
          <a
            href="https://graveyardjokes.com"
            className="text-blue-600 underline"
          >
            graveyardjokes.com
          </a>
          , you agree to these Terms of Service.
        </p>

        <h2 className="text-xl font-semibold">1. Use of the Site</h2>
        <p>
          This site is a personal portfolio showcasing the work of Joshua
          Ackerly in web development and creative projects. The site is publicly
          accessible for viewing and does not require user registration or accounts.
          By using this site, you acknowledge that we may track basic visitor
          analytics for site improvement purposes.
        </p>

        <h2 className="text-xl font-semibold">2. Prohibited Conduct</h2>
        <p>By using this site, you agree not to:</p>
        <ul className="list-inside list-disc">
          <li>
            Post or transmit any illegal, hateful, harassing, or spam content
          </li>
          <li>Interfere with the site’s operation or security</li>
          <li>
            Attempt to access restricted parts of the site without authorization
          </li>
        </ul>
        <p>
          We reserve the right to suspend or terminate user accounts at our sole
          discretion.
        </p>

        <h2 className="text-xl font-semibold">3. Intellectual Property</h2>
        <p>
          All content, code, graphics, and music on this site is the property of
          Joshua Ackerly unless otherwise stated. You may not copy, reproduce,
          or use materials without permission.
        </p>

        <h2 className="text-xl font-semibold">
          4. Visitor Tracking and Analytics
        </h2>
        <p>
          By using this site, you acknowledge that we collect basic visitor
          information for analytics and site improvement purposes, including:
        </p>
        <ul className="ml-6 list-inside list-disc">
          <li>IP address and approximate geographic location</li>
          <li>Browser information and user agent</li>
          <li>Visit timestamps and page views</li>
          <li>Referrer information</li>
        </ul>
        <p>
          We use Google Analytics and may use geolocation services (such as IPInfo.io)
          to understand our site traffic. We also use session cookies for basic site
          functionality. This data helps us improve the site experience and understand
          our audience.
        </p>
        <p>
          For more information about our data practices, see our{" "}
          <a href="/privacy" className="text-blue-600 underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/cookies" className="text-blue-600 underline">
            Cookie Policy
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold">5. External Links</h2>
        <p>
          This site may link to third-party services including Fiverr, YouTube,
          Instagram, and others. We are not responsible for the content or
          privacy practices of those sites.
        </p>

        <h2 className="text-xl font-semibold">6. Contact and Services</h2>
        <p>
          This site serves as a portfolio and contact point. Any business inquiries
          or service discussions should be made through the contact form or email.
          Terms for any contracted work would be agreed upon separately.
        </p>

        <h2 className="text-xl font-semibold">7. Modifications</h2>
        <p>
          We may update these Terms at any time. Continued use of the site after
          changes means you accept the new Terms.
        </p>
      </div>
    </div>
  );
};

export default Terms;
