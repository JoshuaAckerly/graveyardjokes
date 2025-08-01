// resources/js/Pages/Legal/Cookies.tsx

const Cookies = () => {
    return (
        <div title="Cookie Policy">
            <div className="max-w-4xl p-6 mx-auto space-y-4 text-white bg-gray-900">
                <h1 className="text-2xl font-bold">Cookie Policy</h1>
                <p><strong>Effective Date:</strong> July 24, 2025</p>

                <p>
                    This Cookie Policy explains how GraveYardJokes Studios uses cookies and similar technologies when you visit
                    <strong> graveyardjokes.com</strong>.
                </p>

                <h2 className="text-xl font-semibold">1. What are Cookies?</h2>
                <p>
                    Cookies are small text files stored on your device when you visit our website. They help us understand how
                    the site is used and improve your experience.
                </p>

                <h2 className="text-xl font-semibold">2. Types of Cookies We Use</h2>
                <ul className="list-disc list-inside">
                    <li><strong>Essential Cookies</strong> – necessary for basic site functionality</li>
                    <li><strong>Analytics Cookies</strong> – used by Google Analytics to track site usage</li>
                </ul>

                <h2 className="text-xl font-semibold">3. Managing Cookies</h2>
                <p>
                    You can disable cookies via your browser settings. Please note that doing so may affect site functionality.
                    By continuing to use this website, you consent to our use of cookies in accordance with this policy.
                </p>
            </div>
        </div>
    );
};

export default Cookies;
