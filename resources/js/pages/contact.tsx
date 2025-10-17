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
  <motion.div
    className="flex w-full flex-col items-center bg-[var(--card)] p-6 shadow-lg transition-transform duration-300 hover:scale-105"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
  >
    <h2 className="mb-4 text-2xl font-semibold text-white">{name}</h2>
    <p className="mb-4 text-4xl font-bold text-[var(--accent)]">{price}</p>
    <p className="mb-4 text-lg text-white">Delivery Time: {deliveryTime}</p>
    <ul className="mb-6 space-y-2">
      {features.map((feature, idx) => (
        <li key={idx} className="text-white">
          {feature}
        </li>
      ))}
    </ul>
    <a
      href="#contact-section"
      className="tansition w-full bg-[--color-background] px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-[--color-foreground]"
      aria-label={`Request ${buttonText} package`}
    >
      Request
    </a>
  </motion.div>
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
  <div className="flex w-full flex-col items-center bg-[var(--card)] p-6 shadow-lg transition-transform duration-300 hover:scale-105">
    <h2 className="mb-4 text-2xl font-semibold text-white">{name}</h2>
    <p className="mb-4 text-4xl font-bold text-[var(--accent)]">{price}</p>
    <p className="mb-4 text-lg text-white">Delivery Time: {deliveryTime}</p>
    <ul className="mb-6 space-y-2">
      {features.map((feature, idx) => (
        <li key={idx} className="text-white">
          {feature}
        </li>
      ))}
    </ul>
    <a
      href="#contact-section"
      className="text w-full px-6 py-3 font-medium text-white shadow-md transition"
      aria-label={`Request ${buttonText} package`}
    >
      Request
    </a>
  </div>
);

const SubscriptionCard = ({
  price,
  description,
  buttonText,
}: {
  price: string;
  description: string;
  buttonText: string;
}) => (
  <div className="m-auto w-full max-w-md rounded-md bg-[var(--card)] p-6 shadow-lg text-left">
    <h3 className="mb-2 text-2xl font-semibold text-white">Maintenance & Hosting</h3>
    <p className="mb-4 text-3xl font-bold text-[var(--accent)]">{price}</p>
    <p className="mb-6 text-white">{description}</p>
    <a
      href="#contact-section"
      className="inline-block rounded bg-[var(--accent)] px-5 py-3 font-medium text-white shadow hover:opacity-95"
      aria-label="Request maintenance subscription"
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

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
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
    if (!values.message.trim()) currentErrors.message = "Message is required";

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
      price: "Starting at $800",
      features: [
        "1-page",
        "Functional website",
        "Responsive design",
        "Social Media icons",
        "Deployment via Forge on AWS",
      ],
      buttonText: "Basic",
      deliveryTime: "1 week",
    },
    {
      name: "Standard Package",
      price: "Starting at $1800",
      features: [
        "3 pages",
        "Functional website",
        "Responsive design",
        "Content upload",
        "Social Media icons",
        "Deployment via Forge on AWS",
      ],
      buttonText: "Pro",
      deliveryTime: "2 weeks",
    },
    {
      name: "Premium Package",
      price: "Starting at $3500",
      features: [
        "5 pages",
        "Functional website",
        "Responsive design",
        "Content upload",
        "Social Media icons",
        "Deployment via Forge on AWS",
      ],
      buttonText: "Premium",
      deliveryTime: "3 weeks",
    },
  ];

  const pricingPlansDesign = [
    {
      name: "Basic Package",
      price: "Starting at $400",
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
      price: "Starting at $900",
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
      price: "Starting at $1800",
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
        <meta
          name="keywords"
          content="contact, pricing, custom websites, web design, web development, musicians, artists, creatives, small business websites"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Canonical */}
        <link rel="canonical" href="https://graveyardjokes.com/contact" />

        {/* Open Graph */}
        <meta property="og:title" content="Contact & Pricing | Graveyard Jokes Studios" />
        <meta
          property="og:description"
          content="Contact Graveyard Jokes Studios for custom websites and explore affordable pricing packages for creatives, musicians, and small businesses."
        />
        <meta property="og:image" content={`${cdn}/images/ContactBanner.webp`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://graveyardjokes.com/contact" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact & Pricing | Graveyard Jokes Studios" />
        <meta
          name="twitter:description"
          content="Contact Graveyard Jokes Studios for custom websites and explore affordable pricing packages for creatives, musicians, and small businesses."
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
        {/* Pricing Section */}
        <div className="relative mb-20 max-w-full space-y-20 overflow-hidden bg-[var(--color-foreground)] text-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 max-h-96">
            <img
              src={`${cdn}/images/AdobeStock_949366383.webp`}
              loading="lazy"
              alt="Pricing background"
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-foreground)] to-transparent"></div>
          </div>

          {/* Pricing Section */}
          <div className="relative z-10 flex flex-col justify-center space-y-6 p-6">
            <h1 className="mb-4 text-5xl font-extrabold text-white">
              Develop a Website
            </h1>
            <p className="mb-4 max-w-2xl mx-auto text-lg text-white">Prices listed are starting points — final cost depends on scope, integrations, and revisions. For accurate quotes and flexible options, request a custom estimate below.</p>

            <div className="m-auto grid gap-6 md:grid-cols-3">
              {pricingPlansDevelop.map((plan, index) => (
                <PricingCardDevelop key={index} {...plan} />
              ))}
            </div>
            </div>

            {/* Subscription Box (single) */}
            <div className="relative z-10 flex justify-center p-6">
              <SubscriptionCard
                price="$29/month"
                description="Maintenance, security updates, backups, and hosting. Billed monthly — cancellable anytime. Add-ons and priority support available."
                buttonText="Subscribe / Request"
              />
            </div>

            {/* Pricing Section */}
            <div className="relative z-10 flex flex-col justify-center space-y-6 p-6">
            <h1 className="mb-4 text-5xl font-extrabold text-white">
              Design a Website
            </h1>
            <p className="mb-4 max-w-2xl mx-auto text-lg text-white">These design packages are starting points. If you need additional pages, brand assets, or expedited delivery, contact us for a tailored quote.</p>

            <div className="m-auto grid gap-6 md:grid-cols-3">
              {pricingPlansDesign.map((plan, index) => (
                <PricingCardDesign key={index} {...plan} />
              ))}
            </div>
          </div>

          <section className="py-16">
            <section className="-3xl relative z-10 mx-auto mt-16 max-w-5xl bg-[var(--card)] p-12 shadow-2xl">
              <h2 className="mb-6 text-center text-3xl font-semibold text-white">
                Interested in a custom website?
              </h2>
              <p className="mb-6 text-center text-lg text-white">
                Contact us to discuss your project and get a personalized quote.
              </p>
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                whileHover={{ scale: 1.1 }}
                className="relative bottom-2 z-20 mx-auto flex bg-[var(--accent)] px-8 py-6 text-sm font-semibold text-white shadow-md transition duration-300 ease-in-out sm:px-12 sm:py-6 sm:text-lg"
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
          className="relative z-0 max-w-full overflow-hidden bg-[var(--color-foreground)] text-center"
        >
          <div className="relative z-10 flex px-6 py-12 text-3xl text-white underline sm:px-12">
            <h1>Contact</h1>
          </div>

          <div className="relative z-10 px-6 py-24 sm:py-32 lg:mx-auto lg:w-1/2 lg:px-8">
            <p className="mb-6 text-center text-lg text-[var(--primary)]">
              Interested in getting a custom website built for your brand or
              project? Reach out using the form below and our site administrator
              will get back to you within 24 hours.
            </p>

            <form
              onSubmit={handleSubmit}
              className="-xl mx-auto max-w-xl bg-white p-8 shadow-lg"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[
                  { id: "first_name", label: "First Name" },
                  { id: "last_name", label: "Last Name" },
                ].map(({ id, label }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-semibold">
                      {label}
                    </label>
                    <input
                      id={id}
                      value={values[id as keyof FormValues]}
                      onChange={handleChange}
                      className={`block w-full border px-3.5 py-2 ${errors[id as keyof FormValues]
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
                    className={`block w-full border px-3.5 py-2 ${errors.email ? "border-red-500" : "border-gray-300"
                      } focus:border-indigo-600 focus:ring focus:ring-indigo-200`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
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
                    className={`block w-full border px-3.5 py-2 ${errors.message ? "border-red-500" : "border-gray-300"
                      } focus:border-indigo-600 focus:ring focus:ring-indigo-200`}
                  ></textarea>
                  {errors.message && (
                    <p className="text-sm text-red-600">{errors.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 py-2 text-white transition hover:bg-indigo-500"
                >
                  Submit
                </button>
              </div>
              {successMessage && (
                <p className="mt-4 text-green-600">{successMessage}</p>
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
              <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                <div className="relative w-full max-w-sm bg-white p-6 shadow-xl">
                  <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                    onClick={() => setShowPopup(false)}
                  >
                    ✖
                  </button>
                  <img
                    src={`${cdn}/images/snapcode.webp`}
                    alt="Snapchat Code"
                    className="-md w-full"
                  />
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
