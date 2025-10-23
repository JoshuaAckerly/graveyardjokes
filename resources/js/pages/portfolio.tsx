import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import ProjectCard from "@/Components/ProjectCard";
import portfolioItems from "@/data/portfolioItems";

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
          {portfolioItems.map((project) => (
            <li key={project.title} className="flex flex-col items-center justify-center gap-2 rounded-lg p-0">
              <ProjectCard title={project.title} description={project.description} url={project.url} cdn={cdn} />
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
