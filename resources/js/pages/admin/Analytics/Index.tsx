import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';

interface Stats {
    totalVisits: number;
    visitsLast30Days: number;
    visitsLast7Days: number;
    uniqueIpsLast30: number;
    loggedInLast30: number;
}
interface DailyPoint { date: string; count: number }
interface PageRow { path: string; count: number }
interface CityRow { city: string | null; country: string | null; count: number }
interface HostRow { host: string | null; count: number }
interface RecentVisit {
    id: number; user_name: string | null; host: string | null; ip_address: string | null;
    city: string | null; country: string | null; path: string | null; browser: string | null; visited_at: string | null;
}
interface Props {
    stats: Stats;
    dailyChart: DailyPoint[];
    topPages: PageRow[];
    topCities: CityRow[];
    visitsByHost: HostRow[];
    recentVisits: RecentVisit[];
    socialSummary: Record<string, number>;
}

function fmtDate(v: string | null): string {
    if (!v) return '';
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(v));
}

export default function AnalyticsIndex({ stats, dailyChart, topPages, topCities, visitsByHost, recentVisits, socialSummary }: Props) {
    const maxDaily = Math.max(1, ...dailyChart.map((d) => d.count));
    const statCards: [string, number][] = [
        ['Total visits', stats.totalVisits], ['Last 30 days', stats.visitsLast30Days], ['Last 7 days', stats.visitsLast7Days],
        ['Unique IPs (30d)', stats.uniqueIpsLast30], ['Logged-in (30d)', stats.loggedInLast30],
    ];
    const social = Object.entries(socialSummary ?? {});

    const card = 'rounded-lg border border-white/10 bg-white/5 p-5';

    return (
        <MainLayout>
            <>
                <InertiaHead>
                    <meta name="robots" content="noindex, nofollow" />
                </InertiaHead>

                <section className="relative z-0 mx-auto max-w-6xl px-6 py-16 text-white sm:px-10">
                    <p className="mb-2 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Admin</p>
                    <h1 className="mb-8 font-serif text-4xl font-bold">Analytics</h1>

                    {/* Stat cards */}
                    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {statCards.map(([label, value]) => (
                            <div key={label} className={card}>
                                <p className="text-xs tracking-wider text-white/40 uppercase">{label}</p>
                                <p className="mt-1 text-2xl font-semibold">{(value ?? 0).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    {/* Daily chart (bars) */}
                    <div className={`mb-8 ${card}`}>
                        <h2 className="mb-4 font-serif text-lg">Last 14 days</h2>
                        <div className="flex h-32 items-end gap-1">
                            {dailyChart.map((d) => (
                                <div key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date}: ${d.count}`}>
                                    <div className="w-full rounded-t bg-[var(--primary)]" style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count > 0 ? '2px' : '0' }} />
                                    <span className="text-[0.6rem] text-white/30">{d.date.slice(5)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Top pages */}
                        <div className={card}>
                            <h2 className="mb-3 font-serif text-lg">Top pages (30d)</h2>
                            <ul className="space-y-1 text-sm">
                                {topPages.map((p) => (
                                    <li key={p.path} className="flex justify-between gap-4 text-white/70">
                                        <span className="truncate">{p.path}</span>
                                        <span className="text-white/40">{p.count}</span>
                                    </li>
                                ))}
                                {topPages.length === 0 && <li className="text-white/40">No data yet.</li>}
                            </ul>
                        </div>

                        {/* Top cities */}
                        <div className={card}>
                            <h2 className="mb-3 font-serif text-lg">Top locations (30d)</h2>
                            <ul className="space-y-1 text-sm">
                                {topCities.map((c, i) => (
                                    <li key={i} className="flex justify-between gap-4 text-white/70">
                                        <span className="truncate">{[c.city, c.country].filter(Boolean).join(', ') || 'Unknown'}</span>
                                        <span className="text-white/40">{c.count}</span>
                                    </li>
                                ))}
                                {topCities.length === 0 && <li className="text-white/40">No data yet.</li>}
                            </ul>
                        </div>

                        {/* Social referrals */}
                        <div className={card}>
                            <h2 className="mb-3 font-serif text-lg">Social referrals (30d)</h2>
                            <ul className="space-y-1 text-sm">
                                {social.map(([platform, count]) => (
                                    <li key={platform} className="flex justify-between gap-4 text-white/70">
                                        <span>{platform}</span>
                                        <span className="text-white/40">{count}</span>
                                    </li>
                                ))}
                                {social.length === 0 && <li className="text-white/40">No social referrals yet.</li>}
                            </ul>
                        </div>

                        {/* Visits by host */}
                        <div className={card}>
                            <h2 className="mb-3 font-serif text-lg">By site</h2>
                            <ul className="space-y-1 text-sm">
                                {visitsByHost.map((h, i) => (
                                    <li key={i} className="flex justify-between gap-4 text-white/70">
                                        <span className="truncate">{h.host ?? 'Unknown'}</span>
                                        <span className="text-white/40">{h.count}</span>
                                    </li>
                                ))}
                                {visitsByHost.length === 0 && <li className="text-white/40">No data yet.</li>}
                            </ul>
                        </div>
                    </div>

                    {/* Recent visits */}
                    <div className={`mt-6 ${card}`}>
                        <h2 className="mb-3 font-serif text-lg">Recent visits</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-xs tracking-wider text-white/40 uppercase">
                                    <tr>
                                        <th className="py-2 pr-4">When</th>
                                        <th className="py-2 pr-4">Path</th>
                                        <th className="py-2 pr-4">Location</th>
                                        <th className="py-2 pr-4">Browser</th>
                                        <th className="py-2">User</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-white/70">
                                    {recentVisits.map((v) => (
                                        <tr key={v.id}>
                                            <td className="py-2 pr-4 whitespace-nowrap text-white/40">{fmtDate(v.visited_at)}</td>
                                            <td className="py-2 pr-4">{v.path}</td>
                                            <td className="py-2 pr-4">{[v.city, v.country].filter(Boolean).join(', ') || '—'}</td>
                                            <td className="py-2 pr-4">{v.browser}</td>
                                            <td className="py-2">{v.user_name ?? 'Guest'}</td>
                                        </tr>
                                    ))}
                                    {recentVisits.length === 0 && (
                                        <tr><td colSpan={5} className="py-4 text-center text-white/40">No visits recorded yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </>
        </MainLayout>
    );
}
