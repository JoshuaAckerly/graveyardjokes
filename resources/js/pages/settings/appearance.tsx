import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import useAppearance from '@/hooks/use-appearance';
import { Link } from '@inertiajs/react';

export default function AppearanceSettings() {
    const { theme, setTheme } = useAppearance();

    const options: { value: 'light' | 'dark'; label: string }[] = [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
    ];

    return (
        <MainLayout>
            <>
                <InertiaHead>
                    <meta name="robots" content="noindex, nofollow" />
                </InertiaHead>

                <section className="relative z-0 mx-auto max-w-2xl px-6 py-16 text-white sm:px-10">
                    <p className="mb-2 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Settings</p>
                    <h1 className="mb-8 font-serif text-4xl font-bold">Appearance</h1>

                    <div className="mb-6 flex gap-4 text-sm text-white/50">
                        <Link href="/settings/profile" className="hover:text-white">Profile</Link>
                        <Link href="/settings/password" className="hover:text-white">Password</Link>
                        <Link href="/settings/appearance" className="text-[var(--primary)]">Appearance</Link>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                        <p className="mb-4 text-sm text-white/70">Theme</p>
                        <div className="flex gap-3">
                            {options.map((o) => (
                                <button
                                    key={o.value}
                                    onClick={() => setTheme(o.value)}
                                    className={`rounded-lg border px-5 py-2 text-sm font-semibold transition ${
                                        theme === o.value
                                            ? 'border-[var(--primary)] bg-[var(--primary)] text-black'
                                            : 'border-white/15 text-white/70 hover:border-white/40'
                                    }`}
                                >
                                    {o.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </>
        </MainLayout>
    );
}
