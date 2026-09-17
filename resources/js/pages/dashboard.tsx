import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const page = usePage().props as { auth?: { user?: { name?: string } } };
    const name = page.auth?.user?.name ?? 'there';

    const links = [
        { name: 'Studio', href: '/studio', desc: 'Blog, feeds, and works in progress' },
        { name: 'Profile settings', href: '/settings/profile', desc: 'Update your account details' },
        { name: 'Password', href: '/settings/password', desc: 'Change your password' },
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
                </section>
            </>
        </MainLayout>
    );
}
