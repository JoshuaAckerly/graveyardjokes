import React, { useState, ChangeEvent, FormEvent } from "react";
import { router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";

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

const PricingCardDevelop = ({
    name,
    price,
    deliveryTime,
    features,
    buttonText,
}: {
    name: string;
    price: string;
    deliveryTime: string;
    features: string[];
    buttonText: string;
}) => (
    <div className="flex flex-col items-center w-full p-6 transition-transform duration-300 bg-[#1c1c1c] shadow-lg  hover:scale-105">
        <h2 className="mb-4 text-2xl font-semibold text-white">{name}</h2>
        <p className="mb-4 text-4xl font-bold text-customGreen">{price}</p>
        <p className="mb-4 text-lg text-white">Delivery Time: {deliveryTime}</p>
        <ul className="mb-6 space-y-2">
            {features.map((feature, idx) => (
                <li key={idx} className="text-white">
                    <span className="mr-2 text-customGreen">✔</span>
                    {feature}
                </li>
            ))}
        </ul>
        <a
            href="https://www.fiverr.com/s/0bNavNk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-3 text-lg font-medium text-white transition  bg-customGreen"
            aria-label={`Purchase ${buttonText} package`}
        >
            {buttonText}
        </a>
    </div>
);

const PricingCardDesign = ({
    name,
    price,
    deliveryTime,
    features,
    buttonText,
}: {
    name: string;
    price: string;
    deliveryTime: string;
    features: string[];
    buttonText: string;
}) => (
    <div className="flex flex-col items-center w-full p-6 transition-transform duration-300 bg-[#1c1c1c] shadow-lg  hover:scale-105">
        <h2 className="mb-4 text-2xl font-semibold text-white">{name}</h2>
        <p className="mb-4 text-4xl font-bold text-customGreen">{price}</p>
        <p className="mb-4 text-lg text-white">Delivery Time: {deliveryTime}</p>
        <ul className="mb-6 space-y-2">
            {features.map((feature, idx) => (
                <li key={idx} className="text-white">
                    <span className="mr-2 text-customGreen">✔</span>
                    {feature}
                </li>
            ))}
        </ul>
        <a
            href="https://www.fiverr.com/graveyardjokes/create-a-website-design"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-3 text font-medium text-white transition  bg-customGreen"
            aria-label={`Purchase ${buttonText} package`}
        >
            {buttonText}
        </a>
    </div>
);

export default function ContactPricing() {
    const cdn = import.meta.env.VITE_ASSET_URL;

    // Contact form state
    const [values, setValues] = useState<FormValues>({
        first_name: "",
        last_name: "",
        email: "",
        message: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const [platforms] = useState<Platform[]>([
        {
            name: "instagram",
            url: "https://www.instagram.com/graveyardjokesofficial/",
        },
        {
            name: "facebook",
            url: "https://www.facebook.com/people/Graveyardjokes/100073768148100/",
        },
        { name: "youtube", url: "https://www.youtube.com/@graveyardjokes/" },
        { name: "pinterest", url: "https://www.pinterest.com/graveyardjokes/" },
        { name: "tiktok", url: "https://www.tiktok.com/@graveyardjokes/" },
        {
            name: "linkedin",
            url: "https://www.linkedin.com/in/graveyardjokes/",
        },
    ]);

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setValues({ ...values, [e.target.id]: e.target.value });
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({});
        setSuccessMessage("");

        const currentErrors: FormErrors = {};
        if (!values.first_name.trim())
            currentErrors.first_name = "First name is required";
        if (!values.last_name.trim())
            currentErrors.last_name = "Last name is required";
        if (
            !values.email.trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
        )
            currentErrors.email = "A valid email is required";
        if (!values.message.trim())
            currentErrors.message = "Message is required";

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            return;
        }

        router.post("/contact", values, {
            onSuccess: () => {
                setSuccessMessage("Thank you! Your message has been sent.");
                setValues({
                    first_name: "",
                    last_name: "",
                    email: "",
                    message: "",
                });
            },
        });
    }

    // Pricing data
    const pricingPlansDevelop = [
        {
            name: "Basic Package",
            price: "$80",
            features: [
                "1-page",
                "Functional website",
                "Responsive design",
                "Social Media icons",
                "Deployment via Forge on AWS",
                "Ongoing hosting & infrastructure: $19/month (includes AWS, Forge, and Studio)",
            ],
            buttonText: "Basic",
            deliveryTime: "1 week",
        },
        {
            name: "Standard Package",
            price: "$200",
            features: [
                "3 pages",
                "Functional website",
                "Responsive design",
                "Content upload",
                "Social Media icons",
                "Deployment via Forge on AWS",
                "Ongoing hosting & infrastructure: $19/month (includes AWS, Forge, and Studio)",
            ],
            buttonText: "Pro",
            deliveryTime: "2 weeks",
        },
        {
            name: "Premium Package",
            price: "$400",
            features: [
                "5 pages",
                "Functional website",
                "Responsive design",
                "Content upload",
                "Social Media icons",
                "Deployment via Forge on AWS",
                "Ongoing hosting & infrastructure: $19/month (includes AWS, Forge, and Studio)",
            ],
            buttonText: "Premium",
            deliveryTime: "3 weeks",
        },
    ];

    const pricingPlansDesign = [
        {
            name: "Basic Package",
            price: "$80",
            deliveryTime: "1 week",
            features: [
                "1 page",
                "Responsive design",
                "Social Media icons",
                "Photoshop mockup",
            ],
            buttonText: "Basic",
        },
        {
            name: "Standard Package",
            price: "$200",
            deliveryTime: "2 weeks",
            features: [
                "3 pages",
                "Responsive design",
                "Social Media icons",
                "Photoshop mockup",
            ],
            buttonText: "Pro",
        },
        {
            name: "Premium Package",
            price: "$400",
            deliveryTime: "3 weeks",
            features: [
                "5 pages",
                "Responsive design",
                "Social Media icons",
                "Photoshop mockup",
            ],
            buttonText: "Premium",
        },
    ];

    const handleContactScroll = () => {
        const el = document.getElementById("contact-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <Head>
                <title>Contact & Pricing | Graveyard Jokes Studios</title>
                <meta
                    name="description"
                    content="Contact Graveyard Jokes Studios for custom websites and explore affordable pricing packages for creatives, musicians, and small businesses."
                />
                <meta name="robots" content="index, follow" />
                {/* Open Graph / Facebook */}
                <meta
                    property="og:title"
                    content="Contact & Pricing | Graveyard Jokes Studios"
                />
                <meta
                    property="og:description"
                    content="Let's collaborate! Reach out to Graveyard Jokes Studios for custom web development and see our affordable pricing packages."
                />
                <meta
                    property="og:image"
                    content="https://graveyardjokes.com/images/ContactBanner.webp"
                />
                <meta
                    property="og:url"
                    content="https://graveyardjokes.com/contact"
                />
                <meta property="og:type" content="website" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Contact & Pricing | Graveyard Jokes Studios"
                />
                <meta
                    name="twitter:description"
                    content="Reach out to Graveyard Jokes Studios to get started on your custom website. We're here to build your vision. See our pricing packages."
                />
                <meta
                    name="twitter:image"
                    content="https://graveyardjokes.com/images/ContactBanner.webp"
                />
            </Head>
            <MainLayout>
                {/* Pricing Section */}
                <div className="relative max-w-full space-y-20 overflow-hidden  bg-[#3E403D] text-center mb-20">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0 max-h-96">
                        <img
                            src={`${cdn}/images/AdobeStock_949366383.webp`}
                            loading="lazy"
                            alt="Pricing background"
                            className="object-cover w-full h-full opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#3E403D] via-[#3E403D]/70 to-transparent"></div>
                    </div>

                    {/* Pricing Section */}
                    <div className="relative z-10 flex flex-col justify-center p-6 space-y-6">
                        <h1 className="mb-4 text-5xl font-extrabold text-white">
                            Develop a Website
                        </h1>

                        <div className="grid gap-6 m-auto md:grid-cols-3">
                            {pricingPlansDevelop.map((plan, index) => (
                                <PricingCardDevelop key={index} {...plan} />
                            ))}
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="relative z-10 flex flex-col justify-center p-6 space-y-6">
                        <h1 className="mb-4 text-5xl font-extrabold text-white">
                            Design a Website
                        </h1>

                        <div className="grid gap-6 m-auto md:grid-cols-3">
                            {pricingPlansDesign.map((plan, index) => (
                                <PricingCardDesign key={index} {...plan} />
                            ))}
                        </div>
                    </div>

                    <section className="py-16">
                        <section className="relative z-10 max-w-5xl p-12 mx-auto mt-16 bg-[#1c1c1c] shadow-2xl -3xl">
                            <h2 className="mb-4 text-4xl font-extrabold text-center text-white drop-shadow-sm">
                                What I’ll Need From You
                            </h2>
                            <p className="max-w-3xl mx-auto mb-4 font-medium leading-relaxed text-center text-white">
                                To craft a portfolio site uniquely tailored to
                                your goals, please share any of the following
                                materials you'd love featured:
                            </p>
                            <div className="flex justify-center mb-4">
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
                                    {[
                                        {
                                            title: "🧾 Basic Info",
                                            items: [
                                                "Your full name (optional)",
                                                "Your title or role (e.g., Software Engineer, Artist, Entrepreneur)",
                                            ],
                                        },
                                        {
                                            title: "📄 Content",
                                            items: [
                                                "Short bio / About Me (1–3 paragraphs)",
                                                "Resume (PDF or Word)",
                                                "Project links and descriptions (GitHub, screenshots, etc.)",
                                                "Skills / Tech Stack",
                                            ],
                                        },
                                        {
                                            title: "🔗 Links",
                                            items: [
                                                "LinkedIn profile",
                                                "GitHub / Portfolio / Blog / Medium",
                                                "Social profiles you'd like to include",
                                            ],
                                        },
                                        {
                                            title: "🎨 Design Preferences",
                                            items: [
                                                "Brand colors / color scheme",
                                                "Preferred font or mood (e.g., modern, minimal, bold)",
                                                "Example sites you like (for inspiration)",
                                            ],
                                        },
                                        {
                                            title: "📷 Images",
                                            items: [
                                                "Headshot or profile picture",
                                                "Logos, banners, or any custom graphics",
                                                "Or I can choose professional stock images for you",
                                            ],
                                        },
                                    ].map(({ title, items }) => (
                                        <div
                                            key={title}
                                            className="space-y-2 duration-300 cursor-default -xl"
                                        >
                                            <h3 className="mb-4 text-2xl font-semibold text-customGreen">
                                                {title}
                                            </h3>
                                            <ul className="space-y-2 text-white list-disc list-inside">
                                                {items.map((item, i) => (
                                                    <li
                                                        key={i}
                                                        className="px-3 py-1 list-none transition-colors duration-200 "
                                                    >
                                                        <span className="mr-2 text-customGreen">
                                                            ✔
                                                        </span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <motion.button
                                type="button"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 1 }}
                                whileHover={{ scale: 1.1 }}
                                className="relative z-20 flex px-8 py-6 mx-auto text-sm font-semibold text-white transition duration-300 ease-in-out shadow-md bottom-2  bg-customGreen sm:px-12 sm:py-6 sm:text-lg"
                                aria-label="Contact Us"
                                onClick={handleContactScroll}
                            >
                                Let's talk
                            </motion.button>
                        </section>
                    </section>
                </div>

                {/* Contact Section */}
                <div
                    id="contact-section"
                    className="relative z-0 max-w-full overflow-hidden  bg-[#3E403D] text-center"
                >

                    <div className="relative z-10 flex px-6 py-12 text-3xl text-white underline sm:px-12">
                        <h1>Contact</h1>
                    </div>

                    <div className="relative z-10 px-6 py-24 sm:py-32 lg:px-8 lg:w-1/2 lg:mx-auto ">
                        <p className="mb-6 text-center text-[custom-green] text-lg">
                            Interested in getting a custom website built for
                            your brand or project? Reach out using the form
                            below and our site administrator will get back to
                            you within 24 hours.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="mx-auto max-w-xl -xl bg-white p-8 shadow-lg"
                        >
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {[
                                    { id: "first_name", label: "First Name" },
                                    { id: "last_name", label: "Last Name" },
                                ].map(({ id, label }) => (
                                    <div key={id}>
                                        <label
                                            htmlFor={id}
                                            className="block text-sm font-semibold"
                                        >
                                            {label}
                                        </label>
                                        <input
                                            id={id}
                                            value={values[id as keyof FormValues]}
                                            onChange={handleChange}
                                            className={`block w-full  px-3.5 py-2 border ${
                                                errors[id as keyof FormValues]
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } focus:border-indigo-600 focus:ring focus:ring-indigo-200`}
                                        />
                                        {errors[id as keyof FormValues] && (
                                            <p className="text-sm text-red-600">
                                                {errors[id as keyof FormValues]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        className={`block w-full  px-3.5 py-2 border ${
                                            errors.email
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } focus:border-indigo-600 focus:ring focus:ring-indigo-200`}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-semibold"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        value={values.message}
                                        onChange={handleChange}
                                        className={`block w-full  px-3.5 py-2 border ${
                                            errors.message
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } focus:border-indigo-600 focus:ring focus:ring-indigo-200`}
                                    ></textarea>
                                    {errors.message && (
                                        <p className="text-sm text-red-600">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full  bg-indigo-600 py-2 text-white transition hover:bg-indigo-500"
                                >
                                    Submit
                                </button>
                            </div>
                            {successMessage && (
                                <p className="mt-4 text-green-600">
                                    {successMessage}
                                </p>
                            )}
                        </form>

                        <div className="mt-8 flex flex-wrap justify-center gap-4 p-4">
                            {platforms.map((platform) => (
                                <a
                                    key={platform.name}
                                    href={platform.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={`${cdn}/images/${platform.name}.webp`}
                                        alt={platform.name}
                                        className="w-16 transition-transform hover:scale-110"
                                    />
                                </a>
                            ))}

                            <button onClick={() => setShowPopup(true)}>
                                <img
                                    src={`${cdn}/images/snapchat.webp`}
                                    alt="Snapchat"
                                    className="w-16 transition-transform hover:scale-110"
                                />
                            </button>
                        </div>

                        {showPopup && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="relative w-full max-w-sm  bg-white p-6 shadow-xl">
                                    <button
                                        className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                                        onClick={() => setShowPopup(false)}
                                    >
                                        ✖
                                    </button>
                                    <img
                                        src={`${cdn}/images/snapcode.webp`}
                                        alt="Snapchat Code"
                                        className="w-full -md"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 w-full max-h-96">
                        <img
                            src={`${cdn}/images/ContactBanner.webp`}
                            loading="lazy"
                            alt="Overlay Image"
                            className="object-cover w-full h-auto pointer-events-none  opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#3E403D] to-transparent"></div>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
