import React, { useEffect, useState } from 'react';

type Props = {
    title: string;
    description: string;
    url: string;
    cdn?: string | undefined;
};

const ProjectCard: React.FC<Props> = ({ title, description, url, cdn }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const storageKey = `og:${url}`;

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
                const safeName = url.replace(/^https?:\/\//, '').replace(/[\\/:*?"<>|]/g, '_');
                const storagePath = `/storage/og-cache/${safeName}.png`;

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
            className="group relative block overflow-hidden rounded-md bg-white/5 p-4 transition hover:scale-[1.01]"
        >
            <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-800">
                <img
                    src={imgSrc ?? (cdn ? `${cdn}/images/portfolio-placeholder.webp` : '/images/AdobeStock_471779082.webp')}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 group-hover:opacity-100"
                />
            </div>

            <div className="mt-3">
                <h4 className="text-lg font-semibold text-white">{title}</h4>
                <p className="mt-1 text-sm text-white/70">{description}</p>
            </div>
        </a>
    );
};

export default ProjectCard;
