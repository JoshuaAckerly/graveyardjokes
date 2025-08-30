// resources/js/Pages/Legal/Cookies.tsx

const Cookies = () => {
  return (
    <div title="Cookie Policy">
      <div className="mx-auto max-w-4xl space-y-4 bg-gray-900 p-6 text-white">
        <h1 className="text-2xl font-bold">Cookie Policy</h1>
        <p>
          <strong>Effective Date:</strong> July 24, 2025
        </p>

        <p>
          This Cookie Policy explains how GraveYardJokes Studios uses cookies
          and similar technologies when you visit
          <strong> graveyardjokes.com</strong>.
        </p>

        <h2 className="text-xl font-semibold">1. What are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit our
          website. They help us understand how the site is used and improve your
          experience.
        </p>

        <h2 className="text-xl font-semibold">2. Types of Cookies We Use</h2>
        <ul className="list-inside list-disc">
          <li>
            <strong>Session Cookies</strong> – These are essential for the
            operation of our website. We use a session cookie (named based on
            our app name, e.g., <code>graveyard_jokes_studio_session</code>) to
            manage your login state and other session data. Session data is
            stored securely in our database and is not accessible to third
            parties.
          </li>
          <li>
            <strong>Security Settings</strong> – Our session cookies are set
            with the following technical attributes:
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
                <strong>SameSite:</strong> <code>lax</code> (helps protect
                against CSRF attacks)
              </li>
              <li>
                <strong>Partitioned:</strong> Not enabled by default
              </li>
              <li>
                <strong>Encryption:</strong> Session data is not encrypted in
                the cookie itself, but is protected in our database
              </li>
            </ul>
          </li>
          <li>
            <strong>Analytics Cookies</strong> – If enabled, we may use
            third-party analytics (such as Google Analytics) to track site
            usage. These cookies are subject to their own privacy policies.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">3. Managing Cookies</h2>
        <p>
          You can disable cookies via your browser settings. Disabling essential
          session cookies may prevent you from logging in or using certain
          features. By continuing to use this website, you consent to our use of
          cookies as described above.
        </p>
      </div>
    </div>
  );
};

export default Cookies;
