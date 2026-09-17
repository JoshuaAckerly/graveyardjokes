import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const field = 'w-full rounded border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[var(--primary)]';

export default function PasswordSettings() {
    const { data, setData, put, processing, errors, reset, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put('/settings/password', {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: () => reset('current_password', 'password', 'password_confirmation'),
        });
    };

    return (
        <MainLayout>
            <>
                <InertiaHead>
                    <meta name="robots" content="noindex, nofollow" />
                </InertiaHead>

                <section className="relative z-0 mx-auto max-w-2xl px-6 py-16 text-white sm:px-10">
                    <p className="mb-2 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Settings</p>
                    <h1 className="mb-8 font-serif text-4xl font-bold">Password</h1>

                    <div className="mb-6 flex gap-4 text-sm text-white/50">
                        <Link href="/settings/profile" className="hover:text-white">Profile</Link>
                        <Link href="/settings/password" className="text-[var(--primary)]">Password</Link>
                        <Link href="/settings/appearance" className="hover:text-white">Appearance</Link>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-6">
                        <div>
                            <label htmlFor="current_password" className="mb-1 block text-sm text-white/70">Current password</label>
                            <input id="current_password" type="password" autoComplete="current-password" value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} className={field} />
                            {errors.current_password && <p className="mt-1 text-sm text-red-400">{errors.current_password}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="mb-1 block text-sm text-white/70">New password</label>
                            <input id="password" type="password" autoComplete="new-password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={field} />
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                        </div>
                        <div>
                            <label htmlFor="password_confirmation" className="mb-1 block text-sm text-white/70">Confirm new password</label>
                            <input id="password_confirmation" type="password" autoComplete="new-password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className={field} />
                            {errors.password_confirmation && <p className="mt-1 text-sm text-red-400">{errors.password_confirmation}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="submit" disabled={processing} className="rounded-lg bg-[var(--primary)] px-5 py-2 font-semibold text-black transition hover:opacity-90 disabled:opacity-60">Update password</button>
                            {recentlySuccessful && <span className="text-sm text-white/50">Saved.</span>}
                        </div>
                    </form>
                </section>
            </>
        </MainLayout>
    );
}
