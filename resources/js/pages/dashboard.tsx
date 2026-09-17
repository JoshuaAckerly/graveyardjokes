import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const page = usePage().props as { auth?: { user?: { name?: string }; is_admin?: boolean } };
    const name = page.auth?.user?.name ?? 'there';
    const isAdmin = !!page.auth?.is_admin;

    const links = [
        { name: 'Studio', href: '/studio', desc: 'Blog, feeds, and works in progress' },
        { name: 'Profile settings', href: '/settings/profile', desc: 'Update your account details' },
        { name: 'Password', href: '/settings/password', desc: 'Change your password' },
    ];

    const adminLinks = [
        { name: 'Analytics', href: '/admin/analytics', desc: 'Site visits and referrals' },
        { name: 'Social Schedule', href: '/admin/social-schedule', desc: 'Scheduled social posts' },
    ];

    return (
        <MainLayout>
            <>
                <InertiaHead>
                    <meta name="robots" content="noindex, nofollow" />
                </InertiaHead>

                <section className="relative z-0 mx-auto max-w-3xl px-6 py-20 text-white sm:px-10">
                    <p className="mb-2 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Dashboard</p>
                    <h1 className="font-serif text-4xl font-bold">Hey, {name}.</h1>
                    <p className="mt-4 text-white/60">You're signed in to Graveyard Jokes.</p>

                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="rounded-lg border border-white/10 bg-white/5 p-5 transition hover:border-[var(--primary)]/40"
                            >
                                <span className="block font-serif font-semibold text-white">{l.name}</span>
                                <span className="mt-1 block text-xs text-white/50">{l.desc}</span>
                            </Link>
                        ))}
                    </div>

                    {isAdmin && (
                        <div className="mt-8">
                            <p className="mb-3 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Admin</p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {adminLinks.map((l) => (
                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        className="rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-5 transition hover:border-[var(--primary)]/50"
                                    >
                                        <span className="block font-serif font-semibold text-white">{l.name}</span>
                                        <span className="mt-1 block text-xs text-white/50">{l.desc}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </>
        </MainLayout>
    );
}
