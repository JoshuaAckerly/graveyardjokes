import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useState } from 'react';

type FormValues = {
    first_name: string;
    last_name: string;
    email: string;
    message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type Platform = {
    name: string;
    url: string;
};

export default function ContactPricing() {
    const cdn = import.meta.env.VITE_ASSET_URL;

    // Allow overriding Snapchat images via env for easy changes without editing source
    const snapchatImg = import.meta.env.VITE_SNAPCHAT_IMAGE_URL ?? `https://cdn.simpleicons.org/snapchat/000000`;
    const snapcodeImg = import.meta.env.VITE_SNAPCODE_IMAGE_URL ?? `${cdn}/images/snapcode.webp`;

    // Contact form state
    const [values, setValues] = useState<FormValues>({
        first_name: '',
        last_name: '',
        email: '',
        message: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const [platforms] = useState<Platform[]>([
        {
            name: 'instagram',
            url: 'https://www.instagram.com/graveyardjokesofficial/',
        },
        {
            name: 'facebook',
            url: 'https://www.facebook.com/people/Graveyardjokes/100073768148100/',
        },
        { name: 'youtube', url: 'https://www.youtube.com/@graveyardjokes/' },
        { name: 'pinterest', url: 'https://www.pinterest.com/graveyardjokes/' },
        { name: 'tiktok', url: 'https://www.tiktok.com/@graveyardjokes/' },
        {
            name: 'linkedin',
            url: 'https://www.linkedin.com/in/graveyardjokes/',
        },
        {
            name: 'discord',
            // Replace this with your real Discord invite link
            url: 'https://discord.gg/K3rAmsr8je',
        },
    ]);

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setValues({ ...values, [e.target.id]: e.target.value });
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        const currentErrors: FormErrors = {};
        if (!values.first_name.trim()) currentErrors.first_name = 'First name is required';
        if (!values.last_name.trim()) currentErrors.last_name = 'Last name is required';
        if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) currentErrors.email = 'A valid email is required';
        if (!values.message.trim()) currentErrors.message = 'Message is required';

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            return;
        }

        router.post('/contact', values, {
            onSuccess: () => {
                setSuccessMessage('Thank you! Your message has been sent.');
                setValues({
                    first_name: '',
                    last_name: '',
                    email: '',
                    message: '',
                });
            },
        });
    }

    return (
        <>
            <Head>
                <title>Contact | Graveyard Jokes Studios</title>
<<<<<<< HEAD
                <meta
                    name="description"
                    content="Contact Graveyard Jokes Studios for custom websites. Get in touch to discuss your project."
                />
                <meta
                    name="keywords"
                    content="contact, custom websites, web design, web development, musicians, artists, creatives"
                />
=======
                <meta name="description" content="Contact Graveyard Jokes Studios for custom websites. Get in touch to discuss your project." />
                <meta name="keywords" content="contact, custom websites, web design, web development, musicians, artists, creatives" />
>>>>>>> 3af94ce9a36ea4fab79cd3b986493cecd56f508a
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Canonical */}
                <link rel="canonical" href="https://graveyardjokes.com/contact" />

                {/* Open Graph */}
                <meta property="og:title" content="Contact | Graveyard Jokes Studios" />
                <meta
                    property="og:description"
                    content="Contact Graveyard Jokes Studios for custom websites. Get in touch to discuss your project."
                />
                <meta property="og:image" content={`${cdn}/images/ContactBanner.webp`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://graveyardjokes.com/contact" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Contact | Graveyard Jokes Studios" />
                <meta
                    name="twitter:description"
                    content="Contact Graveyard Jokes Studios for custom websites. Get in touch to discuss your project."
                />
                <meta name="twitter:image" content={`${cdn}/images/ContactBanner.webp`} />

                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {`
    {
      "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GraveYard Jokes Studios Inc.",
      "url": "https://graveyardjokes.com",
      "logo": "${cdn}/images/logo.webp",
      "sameAs": [
        "https://www.linkedin.com/in/graveyardjokes/",
        "https://github.com/joshua-ackerly",
        "https://www.instagram.com/graveyardjokesofficial/"
      ]
    }
    `}
                </script>
            </Head>

            <MainLayout>
                {/* Contact Section */}
                <div id="contact-section" className="relative z-0 max-w-full overflow-hidden bg-[var(--color-foreground)] text-center">
                    <div className="relative z-10 flex px-6 py-12 text-3xl text-white underline sm:px-12">
                        <h1>Contact</h1>
                    </div>

                    <div className="relative z-10 px-6 py-24 sm:py-32 lg:mx-auto lg:w-1/2 lg:px-8">
                        <p className="mb-6 text-center text-lg text-[var(--primary)]">
<<<<<<< HEAD
                            Ready to bring your vision to life? Let's discuss your project and create something amazing together. Contact us below and we'll get back to you within 24 hours.
=======
                            Ready to bring your vision to life? Let's discuss your project and create something amazing together. Contact us below and
                            we'll get back to you within 24 hours.
>>>>>>> 3af94ce9a36ea4fab79cd3b986493cecd56f508a
                        </p>

                        <form onSubmit={handleSubmit} className="-xl mx-auto max-w-xl bg-white p-8 shadow-lg">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {[
                                    { id: 'first_name', label: 'First Name' },
                                    { id: 'last_name', label: 'Last Name' },
                                ].map(({ id, label }) => (
                                    <div key={id}>
                                        <label htmlFor={id} className="block text-sm font-semibold">
                                            {label}
                                        </label>
                                        <input
                                            id={id}
                                            value={values[id as keyof FormValues]}
                                            onChange={handleChange}
                                            className={`block w-full border px-3.5 py-2 ${
                                                errors[id as keyof FormValues] ? 'border-red-500' : 'border-gray-300'
                                            } focus:border-indigo-600 focus:ring focus:ring-indigo-200`}
                                        />
                                        {errors[id as keyof FormValues] && <p className="text-sm text-red-600">{errors[id as keyof FormValues]}</p>}
                                    </div>
                                ))}
                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-semibold">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        className={`block w-full border px-3.5 py-2 ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        } focus:border-indigo-600 focus:ring focus:ring-indigo-200`}
                                    />
                                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="message" className="block text-sm font-semibold">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        value={values.message}
                                        onChange={handleChange}
                                        className={`block w-full border px-3.5 py-2 ${
                                            errors.message ? 'border-red-500' : 'border-gray-300'
                                        } focus:border-indigo-600 focus:ring focus:ring-indigo-200`}
                                    ></textarea>
                                    {errors.message && <p className="text-sm text-red-600">{errors.message}</p>}
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 py-2 text-white transition hover:bg-indigo-500">
                                    Submit
                                </button>
                            </div>
                            {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
                        </form>

                        <div className="mt-8 flex flex-wrap justify-center gap-4 p-4">
                            {platforms.map((platform) => {
                                // Map platform name to a simpleicons slug where necessary
                                const slugMap: Record<string, string> = {
                                    instagram: 'instagram',
                                    facebook: 'facebook',
                                    youtube: 'youtube',
                                    pinterest: 'pinterest',
                                    tiktok: 'tiktok',
                                    linkedin: 'linkedin',
                                    discord: 'discord',
                                };
                                const slug = slugMap[platform.name] ?? platform.name;
                                // Use simpleicons CDN color: black for all icons
                                const color = '000000';
                                const iconUrl = `https://cdn.simpleicons.org/${slug}/${color}`;

                                return (
                                    <a
                                        key={platform.name}
                                        href={platform.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={platform.name}
                                        className="flex items-center justify-center rounded bg-[var(--card)] p-2 shadow transition hover:scale-110"
                                    >
                                        <img
                                            src={iconUrl}
                                            alt={platform.name}
                                            className="h-10 w-10"
                                            // Try CDN first; if it fails, fall back to local asset, then a data-URI SVG with initial
                                            onError={(e) => {
                                                const img = e.currentTarget as HTMLImageElement;
                                                // prevent infinite loop
                                                if (!img.dataset.fallback) {
                                                    img.dataset.fallback = '1';
                                                    img.src = `${cdn}/images/${platform.name}.webp`;
                                                    return;
                                                }
                                                // final fallback: small SVG with the platform initial
                                                const initial = (platform.name && platform.name.charAt(0).toUpperCase()) || '?';
                                                const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%23000000'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='%23ffffff' font-family='Arial,Helvetica,sans-serif'>${initial}</text></svg>`;
                                                img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
                                            }}
                                        />
                                    </a>
                                );
                            })}
                            <button onClick={() => setShowPopup(true)}>
                                <img src={snapchatImg} alt="Snapchat" className="w-16 transition-transform hover:scale-110" />
                            </button>
                        </div>

                        {showPopup && (
                            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                                <div className="relative w-full max-w-sm bg-white p-6 shadow-xl">
                                    <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-900" onClick={() => setShowPopup(false)}>
                                        ✖
                                    </button>
                                    <img src={snapcodeImg} alt="Snapchat Code" className="-md w-full" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 max-h-96 w-full">
                        <img
                            src={`${cdn}/images/ContactBanner.webp`}
                            loading="lazy"
                            alt="Overlay Image"
                            className="pointer-events-none h-auto w-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-foreground)] to-transparent"></div>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
