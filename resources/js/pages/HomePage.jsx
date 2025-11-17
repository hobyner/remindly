import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link to="/" className="text-xl font-semibold tracking-tight text-white">
                        BeyondMessage
                    </Link>
                    <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
                        <a href="#product" className="hover:text-white">
                            Product
                        </a>
                        <a href="#features" className="hover:text-white">
                            Features
                        </a>
                        <a href="#pricing" className="hover:text-white">
                            Pricing
                        </a>
                        <a href="#usecases" className="hover:text-white">
                            Use Cases
                        </a>
                    </nav>
                    <div className="flex items-center gap-3 text-sm">
                        <Link to="/login" className="text-slate-300 hover:text-white">
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-2xl bg-indigo-500 px-4 py-2 font-semibold text-white shadow-indigo-500/30"
                        >
                            Start free
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-16 space-y-20">
                <section className="grid gap-10 lg:grid-cols-2">
                    <div>
                        <p className="text-sm uppercase tracking-[0.4em] text-indigo-300">Beyond reminders</p>
                        <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
                            Speak when you can’t. Automate reminders when you can.
                        </h1>
                        <p className="mt-4 text-lg text-slate-300">
                            BeyondMessage combines encrypted legacy notes with always-on reminder automation, so your
                            loved ones, teams, or clients receive the right words when it matters most.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <Link
                                to="/register"
                                className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40"
                            >
                                Create vault
                            </Link>
                            <Link
                                to="/login"
                                className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200"
                            >
                                Go to dashboard
                            </Link>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-indigo-950/40">
                        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-sm text-slate-300">
                            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Legacy overview</p>
                            <div className="mt-6 space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                                    <p className="text-xs text-slate-400">Active messages</p>
                                    <p className="text-2xl font-semibold text-white">12 armed notes</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                                    <p className="text-xs text-slate-400">Next heartbeat</p>
                                    <p className="text-2xl font-semibold text-white">04h 12m</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="product" className="grid gap-8 rounded-3xl border border-white/10 bg-slate-950/70 p-10 lg:grid-cols-2">
                    <div>
                        <h2 className="text-3xl font-semibold text-white">What is BeyondMessage?</h2>
                        <p className="mt-4 text-slate-300">
                            A secure communications fail-safe. Draft a message (text, file, or voice), choose heartbeat
                            cadence, pick trusted recipients, and arm the note. If you miss a check-in, we deliver via
                            email, SMS, or WhatsApp—fully encrypted.
                        </p>
                    </div>
                    <ul className="space-y-4 text-sm text-slate-300">
                        <li>• Encrypted vault with per-message keys.</li>
                        <li>• Custom heartbeat schedules and grace windows.</li>
                        <li>• Multi-factor recipient verification.</li>
                        <li>• Works alongside your everyday reminders.</li>
                    </ul>
                </section>

                <section id="features">
                    <h2 className="text-3xl font-semibold text-white">Features & Benefits</h2>
                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                        {[
                            {
                                title: 'Heartbeat automation',
                                desc: 'Daily, weekly, or custom cadence. No response? Notes unlock.',
                            },
                            {
                                title: 'Omni-channel delivery',
                                desc: 'Email, SMS, WhatsApp, and secure download links.',
                            },
                            {
                                title: 'Recipient verification',
                                desc: 'Signed URLs + one-time codes ensure only trusted contacts read your note.',
                            },
                        ].map((f) => (
                            <div key={f.title} className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
                                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                                <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="pricing">
                    <h2 className="text-3xl font-semibold text-white">Pricing</h2>
                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                        {[
                            { tier: 'Starter', price: 'Free', copy: '2 legacy notes · unlimited reminders · email delivery' },
                            {
                                tier: 'Pro',
                                price: '$19/mo',
                                copy: 'Unlimited notes · encrypted storage · SMS/WhatsApp channels',
                                highlight: true,
                            },
                            { tier: 'Legacy Suite', price: '$59/mo', copy: 'Legal handoff tools · priority support · multi-editor vault' },
                        ].map((plan) => (
                            <div
                                key={plan.tier}
                                className={`rounded-3xl border p-6 ${
                                    plan.highlight
                                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/30'
                                        : 'border-white/5 bg-slate-900/70'
                                }`}
                            >
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{plan.tier}</p>
                                <p className="mt-4 text-3xl font-semibold text-white">{plan.price}</p>
                                <p className="mt-2 text-sm text-slate-300">{plan.copy}</p>
                                <Link
                                    to="/register"
                                    className="mt-6 inline-flex rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white/60"
                                >
                                    Choose plan
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="usecases" className="rounded-3xl border border-white/10 bg-slate-950/70 p-10">
                    <h2 className="text-3xl font-semibold text-white">Use Cases</h2>
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        {[
                            {
                                title: 'Families & caregivers',
                                copy: 'Send birthday videos, will locations, or “just in case” letters.',
                            },
                            {
                                title: 'Founders & execs',
                                copy: 'Release contingency playbooks if you go offline or incapacitated.',
                            },
                            {
                                title: 'Estate planners & lawyers',
                                copy: 'Provide clients with a secure digital vault tied to legal events.',
                            },
                            {
                                title: 'NGOs & journalists',
                                copy: 'Automate anonymous drops that unlock only if contact is lost.',
                            },
                        ].map((use) => (
                            <div key={use.title}>
                                <h3 className="text-lg font-semibold text-white">{use.title}</h3>
                                <p className="mt-2 text-sm text-slate-300">{use.copy}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/5 py-8 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} BeyondMessage. Secure the words that matter.
            </footer>
        </div>
    );
}

export default HomePage;
