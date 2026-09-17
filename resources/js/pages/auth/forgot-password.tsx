import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    status?: string;
}

export default function ForgotPassword({ status }: Props) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <MainLayout>
            <>
                <InertiaHead>
                    <meta name="robots" content="noindex, nofollow" />
                </InertiaHead>

                <section className="relative z-0 mx-auto flex max-w-md flex-col gap-6 rounded-lg bg-[var(--color-foreground)] px-6 py-16 text-white shadow-lg sm:px-10">
                    <div className="text-center">
                        <h1 className="font-serif text-3xl font-bold">Forgot password</h1>
                        <p className="mt-3 text-sm text-white/60">Enter your email and we'll send a reset link if the account exists.</p>
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
                        <button type="submit" disabled={processing} className="rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60">
                            Email reset link
                        </button>
                    </form>

                    <div className="text-center text-sm text-white/50">
                        <Link href="/login" className="hover:text-[var(--primary)]">Back to log in</Link>
                    </div>
                </section>
            </>
        </MainLayout>
    );
}
