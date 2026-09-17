import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { useMemo, useState } from 'react';

interface Post {
    id: number;
    platform: string;
    content: string;
    media_url: string | null;
    scheduled_at: string | null;
    posted_at: string | null;
    status: string;
    error_message: string | null;
    is_overdue: boolean;
}

interface Props {
    posts: Post[];
    stats: Record<string, number>;
}

const statusOptions = ['all', 'pending', 'processing', 'posted', 'failed', 'cancelled'];

function formatDate(value: string | null): string {
    if (!value) return 'Not set';
    return new Intl.DateTimeFormat(undefined, {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
    }).format(new Date(value));
}

function statusClass(status: string): string {
    if (status === 'posted') return 'bg-green-500/20 text-green-300';
    if (status === 'failed') return 'bg-red-500/20 text-red-300';
    if (status === 'processing') return 'bg-blue-500/20 text-blue-300';
    if (status === 'cancelled') return 'bg-white/10 text-white/50';
    return 'bg-amber-500/20 text-amber-300';
}

export default function SocialScheduleIndex({ posts, stats }: Props) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return posts.filter((p) => {
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
            const hay = `${p.id} ${p.platform} ${p.status} ${p.content} ${p.error_message ?? ''}`.toLowerCase();
            return matchesStatus && (!q || hay.includes(q));
        });
    }, [posts, query, statusFilter]);

    const statCards: [string, number][] = [
        ['Total', stats.total], ['Pending', stats.pending], ['Posted', stats.posted],
        ['Failed', stats.failed], ['Processing', stats.processing], ['Due now', stats.overdue_pending],
    ];

    return (
        <MainLayout>
            <>
                <InertiaHead>
                    <meta name="robots" content="noindex, nofollow" />
                </InertiaHead>

                <section className="relative z-0 mx-auto max-w-6xl px-6 py-16 text-white sm:px-10">
                    <p className="mb-2 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Admin</p>
                    <h1 className="mb-8 font-serif text-4xl font-bold">Social Schedule</h1>

                    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        {statCards.map(([label, value]) => (
                            <div key={label} className="rounded-lg border border-white/10 bg-white/5 px-4 py-4">
                                <p className="text-xs tracking-wider text-white/40 uppercase">{label}</p>
                                <p className="mt-1 text-2xl font-semibold">{(value ?? 0).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_180px]">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search posts"
                            className="rounded border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[var(--primary)]"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[var(--primary)]"
                        >
                            {statusOptions.map((s) => <option key={s} value={s} className="bg-[var(--color-foreground)]">{s}</option>)}
                        </select>
                    </div>

                    {filtered.length === 0 ? (
                        <p className="text-white/50">No scheduled posts.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-white/10">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-xs tracking-wider text-white/40 uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Platform</th>
                                        <th className="px-4 py-3">Content</th>
                                        <th className="px-4 py-3">Scheduled</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.map((p) => (
                                        <tr key={p.id} className="align-top">
                                            <td className="px-4 py-3 text-white/80">{p.platform}</td>
                                            <td className="max-w-md px-4 py-3 text-white/60">
                                                <span className="line-clamp-2">{p.content}</span>
                                                {p.error_message && <span className="mt-1 block text-xs text-red-400">{p.error_message}</span>}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-white/50">{formatDate(p.scheduled_at)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(p.status)}`}>
                                                    {p.is_overdue && p.status === 'pending' ? 'due' : p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </>
        </MainLayout>
    );
}
