import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    mustVerifyEmail?: boolean;
    status?: string;
}

const field = 'w-full rounded border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[var(--primary)]';

export default function ProfileSettings({ status }: Props) {
    const page = usePage().props as { auth?: { user?: { name?: string; email?: string } } };
    const user = page.auth?.user;

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/settings/profile', { preserveScroll: true });
    };

    const del = useForm({ password: '' });
    const deleteAccount: FormEventHandler = (e) => {
        e.preventDefault();
        del.delete('/settings/profile', { preserveScroll: true });
    };

    return (
        <MainLayout>
            <>
                <InertiaHead>
                    <meta name="robots" content="noindex, nofollow" />
                </InertiaHead>

                <section className="relative z-0 mx-auto max-w-2xl px-6 py-16 text-white sm:px-10">
                    <p className="mb-2 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Settings</p>
                    <h1 className="mb-8 font-serif text-4xl font-bold">Profile</h1>

                    <div className="mb-6 flex gap-4 text-sm text-white/50">
                        <Link href="/settings/profile" className="text-[var(--primary)]">Profile</Link>
                        <Link href="/settings/password" className="hover:text-white">Password</Link>
                        <Link href="/settings/appearance" className="hover:text-white">Appearance</Link>
                    </div>

                    {status && <div className="mb-4 rounded bg-white/10 px-4 py-2 text-sm text-[var(--primary)]">{status}</div>}

                    <form onSubmit={submit} className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-6">
                        <div>
                            <label htmlFor="name" className="mb-1 block text-sm text-white/70">Name</label>
                            <input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className={field} />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm text-white/70">Email</label>
                            <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={field} />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="submit" disabled={processing} className="rounded-lg bg-[var(--primary)] px-5 py-2 font-semibold text-black transition hover:opacity-90 disabled:opacity-60">Save</button>
                            {recentlySuccessful && <span className="text-sm text-white/50">Saved.</span>}
                        </div>
                    </form>

                    <form onSubmit={deleteAccount} className="mt-8 flex flex-col gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-6">
                        <h2 className="font-serif text-lg text-white">Delete account</h2>
                        <p className="text-sm text-white/50">This permanently deletes your account. Enter your password to confirm.</p>
                        <input
                            type="password"
                            value={del.data.password}
                            onChange={(e) => del.setData('password', e.target.value)}
                            placeholder="Password"
                            className={field}
                        />
                        {del.errors.password && <p className="text-sm text-red-400">{del.errors.password}</p>}
                        <button type="submit" disabled={del.processing} className="self-start rounded-lg border border-red-500/40 px-5 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10">
                            Delete account
                        </button>
                    </form>
                </section>
            </>
        </MainLayout>
    );
}
