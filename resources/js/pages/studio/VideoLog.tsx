import InertiaHead from '@/Components/InertiaHead';
import Reveal from '@/Components/Reveal';
import MainLayout from '@/Layouts/MainLayout';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface VideoItem {
    id: number;
    title: string;
    date: string;
    thumbnail: string;
    url: string;
    embed_url?: string;
    description?: string;
}

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z" />
        </svg>
    );
}

function VideoCard({ item, onClick }: { item: VideoItem; onClick: () => void }) {
    const isTikTok = Boolean(item.embed_url);

    return (
        <button
            onClick={onClick}
            className="group w-full overflow-hidden rounded-lg border border-white/10 bg-white/5 text-left transition hover:border-[var(--primary)]/40"
        >
            <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-black/60">
                {item.thumbnail ? (
                    <img
                        src={item.thumbnail}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (!target.dataset.fallback) {
                                target.dataset.fallback = '1';
                                target.src = '/images/vlogs/default.svg';
                            }
                        }}
                        className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
                    />
                ) : (
                    <TikTokIcon className="h-12 w-12 text-white/70" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/20">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/90 shadow-lg">
                        <svg className="ml-1 h-5 w-5 text-black" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </span>
                </div>
                {isTikTok && (
                    <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] tracking-widest text-white/80 uppercase">
                        <TikTokIcon className="h-3 w-3" /> TikTok
                    </span>
                )}
            </div>
            <div className="p-4">
                <h3 className="mb-1 line-clamp-2 font-serif text-base font-semibold text-white">{item.title}</h3>
                <time dateTime={item.date} className="text-xs text-white/40">
                    {item.date}
                </time>
            </div>
        </button>
    );
}

export default function VideoLog() {
    const [items, setItems] = useState<VideoItem[]>([]);
    const [selected, setSelected] = useState<VideoItem | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await fetch('/studio/video-log/api');
                const json = await res.json();

                if (mounted && Array.isArray(json.data)) {
                    setItems(json.data);
                }
            } catch (e) {
                console.error('Failed to load video logs', e);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    // Close on Escape while the modal is open.
    useEffect(() => {
        if (!selected) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelected(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selected]);

    return (
        <MainLayout>
            <>
                <InertiaHead />

                <section className="relative z-0 mx-auto max-w-5xl px-6 py-20 text-white sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-12 text-center"
                    >
                        <p className="mb-3 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Studio</p>
                        <h1 className="font-serif text-5xl font-bold text-white">Video Log</h1>
                        <p className="mt-4 font-serif text-lg text-white/60">
                            A chronological log of short studio updates and process videos.
                        </p>
                    </motion.div>

                    {items.length === 0 ? (
                        <p className="text-center text-white/50">No videos yet — check back soon.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {items.map((item, i) => (
                                <Reveal key={item.id} delay={i * 0.05}>
                                    <VideoCard item={item} onClick={() => setSelected(item)} />
                                </Reveal>
                            ))}
                        </div>
                    )}
                </section>

                {selected && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-label={selected.title}
                    >
                        <div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={() => setSelected(null)}
                            aria-hidden="true"
                        />

                        <div className="relative z-10 mx-auto w-full max-w-lg rounded-lg border border-white/10 bg-[#0e1a12] p-5 text-white shadow-2xl">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h2 className="font-serif text-lg font-semibold text-white">{selected.title}</h2>
                                    {selected.description && <p className="mt-1 text-sm text-white/60">{selected.description}</p>}
                                </div>
                                <div className="flex shrink-0 items-center gap-3">
                                    {selected.url && (
                                        <a
                                            href={selected.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-[var(--primary)] hover:underline"
                                        >
                                            Open ↗
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="text-sm text-white/50 transition hover:text-white"
                                        aria-label="Close"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4">
                                {selected.embed_url ? (
                                    <div className="flex justify-center">
                                        <iframe
                                            src={selected.embed_url}
                                            className="h-[700px] w-full max-w-[325px] rounded-md"
                                            allow="fullscreen"
                                            title={selected.title}
                                        />
                                    </div>
                                ) : (
                                    <video controls className="w-full rounded-md">
                                        <source src={selected.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </>
        </MainLayout>
    );
}
