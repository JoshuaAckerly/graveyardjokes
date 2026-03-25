import { getScreenshotPath } from '@/utils/urlMapper';
import React, { useEffect, useState } from 'react';

type Props = {
    title: string;
    description: string;
    longDescription?: string;
    url: string;
    cdn?: string | undefined;
    featured?: boolean;
    tech?: string[];
    category?: string;
    year?: number;
};

const ProjectCard: React.FC<Props> = ({ title, description, longDescription, url, cdn, featured, tech, category, year }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const storageKey = `og:v2:${url}`;

    useEffect(() => {
        const cached = localStorage.getItem(storageKey);
        if (cached) {
            setImgSrc(cached);
            return;
        }

        let mounted = true;
        (async () => {
            try {
                // Prefer a pre-captured screenshot saved by the capture script
                const storagePath = getScreenshotPath(url);

                // Check if the static file exists by trying to fetch the HEAD
                const head = await fetch(storagePath, { method: 'HEAD' });
                if (head.ok) {
                    const final = storagePath;
                    if (mounted) {
                        setImgSrc(final);
                        localStorage.setItem(storageKey, final);
                        return;
                    }
                }

                // Fallback to OG fetch API
                const res = await fetch(`/api/fetch-og-image?url=${encodeURIComponent(url)}`);
                if (!res.ok) throw new Error('no image');
                const data = await res.json();
                if (data?.url && mounted) {
                    setImgSrc(data.url);
                    localStorage.setItem(storageKey, data.url);
                    return;
                }
            } catch {
                // fallback image
                if (mounted) setImgSrc(cdn ? `${cdn}/images/portfolio-placeholder.webp` : '/images/AdobeStock_471779082.webp');
            }
        })();

        return () => {
            mounted = false;
        };
    }, [url, storageKey, cdn]);

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex flex-col overflow-hidden rounded-lg transition hover:scale-[1.01] hover:shadow-xl ${
                featured ? 'bg-white/5 shadow-[0_0_16px_rgba(var(--accent-rgb,168,85,247),0.25)] ring-2 ring-[var(--color-accent)]' : 'bg-white/5'
            }`}
        >
            {featured && (
                <span className="absolute top-3 right-3 z-10 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-white shadow-md">
                    ★ Most Active
                </span>
            )}

            {/* Screenshot */}
            <div className="aspect-video w-full overflow-hidden bg-gray-800">
                <img
                    src={imgSrc ?? (cdn ? `${cdn}/images/portfolio-placeholder.webp` : '/images/AdobeStock_471779082.webp')}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition group-hover:scale-[1.03] group-hover:opacity-100"
                />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                    <h4 className="text-lg leading-tight font-bold text-white">{title}</h4>
                    {(category || year) && (
                        <div className="flex shrink-0 flex-col items-end gap-1">
                            {category && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/60">{category}</span>}
                            {year && <span className="text-[11px] text-white/40">{year}</span>}
                        </div>
                    )}
                </div>

                {/* Short description always visible */}
                <p className="text-sm leading-relaxed text-white/70">{description}</p>

                {/* Long description */}
                {longDescription && <p className="border-t border-white/10 pt-3 text-sm leading-relaxed text-white/50">{longDescription}</p>}

                {/* Tech tags */}
                {tech && tech.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                        {tech.map((t) => (
                            <span
                                key={t}
                                className="rounded-full bg-[var(--color-accent)]/15 px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-accent)]"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                )}

                {/* Visit link */}
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)] group-hover:underline">
                    Visit site →
                </span>
            </div>
        </a>
    );
};

export default ProjectCard;
