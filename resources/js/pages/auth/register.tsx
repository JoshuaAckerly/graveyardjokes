import InertiaHead from '@/Components/InertiaHead';
import MainLayout from '@/Layouts/MainLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', { onFinish: () => reset('password', 'password_confirmation') });
    };

    const field = 'w-full rounded border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[var(--primary)]';

    return (
        <MainLayout>
            <>
                <InertiaHead>
                    <meta name="robots" content="noindex, nofollow" />
                </InertiaHead>

                <section className="relative z-0 mx-auto flex max-w-md flex-col gap-8 rounded-lg bg-[var(--color-foreground)] px-6 py-16 text-white shadow-lg sm:px-10">
                    <div className="text-center">
                        <p className="mb-2 font-serif text-xs tracking-[0.35em] text-[var(--primary)] uppercase">Graveyard Jokes</p>
                        <h1 className="font-serif text-4xl font-bold">Create an account</h1>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="name" className="mb-1 block text-sm text-white/70">Name</label>
                            <input id="name" type="text" value={data.name} autoComplete="name" onChange={(e) => setData('name', e.target.value)} className={field} />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm text-white/70">Email</label>
                            <input id="email" type="email" value={data.email} autoComplete="username" onChange={(e) => setData('email', e.target.value)} className={field} />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="mb-1 block text-sm text-white/70">Password</label>
                            <input id="password" type="password" value={data.password} autoComplete="new-password" onChange={(e) => setData('password', e.target.value)} className={field} />
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                        </div>
                        <div>
                            <label htmlFor="password_confirmation" className="mb-1 block text-sm text-white/70">Confirm password</label>
                            <input id="password_confirmation" type="password" value={data.password_confirmation} autoComplete="new-password" onChange={(e) => setData('password_confirmation', e.target.value)} className={field} />
                            {errors.password_confirmation && <p className="mt-1 text-sm text-red-400">{errors.password_confirmation}</p>}
                        </div>
                        <button type="submit" disabled={processing} className="mt-2 rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60">
                            Create account
                        </button>
                    </form>

                    <div className="text-center text-sm text-white/50">
                        Already have an account? <Link href="/login" className="hover:text-[var(--primary)]">Log in</Link>
                    </div>
                </section>
            </>
        </MainLayout>
    );
}
