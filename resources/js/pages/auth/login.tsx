import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    canResetPassword?: boolean;
    status?: string;
}

export default function Login({ canResetPassword = true, status }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    };

    return (
        <MainLayout>
            <>
                <InertiaHead>
                    <meta name="robots" content="noindex, nofollow" />
                </InertiaHead>

                <section className="relative z-0 mx-auto flex max-w-md flex-col gap-8 rounded-lg bg-[var(--color-foreground)] px-6 py-16 text-white shadow-lg sm:px-10">
                    <div className="text-center">
                        <p className="mb-2 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Graveyard Jokes</p>
                        <h1 className="font-serif text-4xl font-bold">Log in</h1>
                    </div>

                    {status && <div className="rounded bg-white/10 px-4 py-2 text-center text-sm text-[var(--primary)]">{status}</div>}

                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm text-white/70">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[var(--primary)]"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="mb-1 block text-sm text-white/70">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[var(--primary)]"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                        </div>
                        <label className="flex items-center gap-2 text-sm text-white/60">
                            <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                            Remember me
                        </label>
                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
                        >
                            Log in
                        </button>
                    </form>

                    <div className="flex justify-between text-sm text-white/50">
                        {canResetPassword && <Link href="/forgot-password" className="hover:text-[var(--primary)]">Forgot password?</Link>}
                        <Link href="/register" className="hover:text-[var(--primary)]">Create an account</Link>
                    </div>
                </section>
            </>
        </MainLayout>
    );
}
