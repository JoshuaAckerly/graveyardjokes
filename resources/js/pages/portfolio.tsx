import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import React from "react";

const Portfolio: React.FC = () => {
  const cdn = import.meta.env.VITE_ASSET_URL;

  return (
    <MainLayout>
      <>
        <Head>
          <title>Portfolio | Graveyard Jokes Studios</title>
          <meta
            name="description"
            content="Explore the portfolio of Graveyard Jokes Studios, showcasing custom websites for musicians, artists, and creatives."
          />
          <meta
            name="keywords"
            content="portfolio, custom websites, musicians, artists, creatives, web design, web development"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="canonical" href="https://graveyardjokes.com/portfolio" />

          {/* Open Graph */}
          <meta property="og:title" content="Portfolio | Graveyard Jokes Studios" />
          <meta
            property="og:description"
            content="Explore the portfolio of Graveyard Jokes Studios, showcasing custom websites for musicians, artists, and creatives."
          />
          <meta property="og:image" content={`${cdn}/images/PortfolioBanner.webp`} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://graveyardjokes.com/portfolio" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Portfolio | Graveyard Jokes Studios" />
          <meta
            name="twitter:description"
            content="Explore the portfolio of Graveyard Jokes Studios, showcasing custom websites for musicians, artists, and creatives."
          />
          <meta name="twitter:image" content={`${cdn}/images/PortfolioBanner.webp`} />
        </Head>
      </>

      <section className="relative z-0 flex flex-col items-center justify-center gap-8 rounded-lg bg-[var(--color-foreground)] p-6 text-white shadow-lg">
        <h1 className="text-5xl font-extrabold text-[var(--accent)]">Portfolio</h1>
        <p className="max-w-2xl text-center text-lg underline md:w-auto">
          Welcome to my portfolio! Here you can explore my projects that showcase my skills in web design and development.
        </p>

        <ul className="grid w-full grid-cols-1 gap-6 text-center md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "The Velvet Pulse",
              description: "A band site that features music, tour dates, and merchandise.",
              url: "https://thevelvetpulse.graveyardjokes.com",
            },
            {
              title: "Hollow Press",
              description: "A blog site covering technology, lifestyle, and more.",
              url: "https://hollowpress.graveyardjokes.com",
            },
            {
              title: "Lunar Blood",
              description: "A heavy metal band site sharing music, merchandise, and updates.",
              url: "https://lunarblood.graveyardjokes.com",
            },
            {
              title: "Velvet Radio",
              description: "A music streaming platform with a vast library of songs and playlists.",
              url: "https://velvetradio.graveyardjokes.com",
            },
            {
              title: "Synth Veil",
              description: "A portfolio website showcasing design and development skills.",
              url: "https://synthveil.graveyardjokes.com",
            },
          ].map((project) => (
            <li key={project.title} className="flex flex-col items-center justify-center gap-2 rounded-lg bg-[var(--card)] p-6 shadow-md transition-transform hover:scale-105">
              <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[var(--accent)] hover:underline"
                aria-label={`View ${project.title}`}
              >
                {project.description}
              </a>
            </li>
          ))}
        </ul>

        <p className="max-w-2xl text-center text-lg">
          Feel free to explore these projects and reach out if you'd like to collaborate or learn more!
        </p>
      </section>
    </MainLayout>
  );
};

export default Portfolio;
