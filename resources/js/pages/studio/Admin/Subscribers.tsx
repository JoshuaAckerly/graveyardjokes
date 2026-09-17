import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';

interface Subscriber {
    id: number;
    email: string;
    confirmed_at: string | null;
    created_at: string;
}

interface PaginatedSubscribers {
    data: Subscriber[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    subscribers: PaginatedSubscribers;
    total: number;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminSubscribers({ subscribers, total }: Props) {
    return (
        <MainLayout>
            <>
                <InertiaHead>
                    <title>Subscribers — Admin</title>
                    <meta name="robots" content="noindex, nofollow" />
                </InertiaHead>

                <section className="relative z-0 mx-auto max-w-4xl px-6 py-20 text-white sm:px-10">
                    <div className="mb-8">
                        <p className="mb-3 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Studio · Admin</p>
                        <h1 className="font-serif text-4xl font-bold text-white">Newsletter Subscribers</h1>
                        <p className="mt-2 text-sm text-white/60">
                            {total} total subscriber{total !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {subscribers.data.length === 0 ? (
                        <p className="text-white/50">No subscribers yet.</p>
                    ) : (
                        <div className="overflow-hidden rounded-lg border border-white/10">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 text-white/60">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Email</th>
                                        <th className="px-4 py-3 text-left font-medium">Subscribed</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {subscribers.data.map((sub) => (
                                        <tr key={sub.id} className="bg-white/[0.02] transition-colors hover:bg-white/5">
                                            <td className="px-4 py-3 font-mono text-xs text-white">{sub.email}</td>
                                            <td className="px-4 py-3 text-white/60">{formatDate(sub.created_at)}</td>
                                            <td className="px-4 py-3">
                                                {sub.confirmed_at ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/15 px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
                                                        Confirmed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/60">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {(subscribers.prev_page_url || subscribers.next_page_url) && (
                        <div className="mt-6 flex justify-between">
                            {subscribers.prev_page_url ? (
                                <Link href={subscribers.prev_page_url} className="text-sm text-[var(--primary)] hover:underline">
                                    ← Previous
                                </Link>
                            ) : (
                                <span />
                            )}
                            {subscribers.next_page_url && (
                                <Link href={subscribers.next_page_url} className="text-sm text-[var(--primary)] hover:underline">
                                    Next →
                                </Link>
                            )}
                        </div>
                    )}
                </section>
            </>
        </MainLayout>
    );
}
