import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser } from '../store/slices/authSlice';

function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token, status, user } = useAppSelector((state) => state.auth);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token && user) {
            navigate(user.is_admin ? '/admin' : '/dashboard', { replace: true });
        }
    }, [token, user, navigate]);

    const passwordStrength = useMemo(() => {
        const value = form.password || '';
        let score = 0;
        if (value.length >= 8) score += 1;
        if (value.length >= 12) score += 1;
        if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
        if (/[0-9]/.test(value)) score += 1;
        if (/[^A-Za-z0-9]/.test(value)) score += 1;

        if (!value) score = 0;

        const labels = ['Too weak', 'Weak', 'Okay', 'Good', 'Strong', 'Excellent'];
        const colors = ['text-rose-400', 'text-rose-400', 'text-amber-300', 'text-lime-300', 'text-emerald-300', 'text-emerald-300'];
        const tips = [
            'Use at least 8 characters with a mix of symbols, numbers, and letters.',
            'Add more characters and mix upper/lowercase.',
            'Include a number and a symbol to strengthen it.',
            'Great! A symbol and 12+ characters makes it even better.',
            'Strong password. You’re good to go.',
        ];

        const clamped = Math.min(score, labels.length - 1);
        return {
            score,
            label: labels[clamped],
            color: colors[clamped],
            recommendation: tips[Math.min(clamped, tips.length - 1)],
            percent: Math.min((score / 5) * 100, 100),
        };
    }, [form.password]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        const messages = [];
        if (!form.name.trim()) messages.push('Full name is required.');
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
        if (!emailValid) messages.push('Enter a valid email address.');
        if (form.password !== form.password_confirmation) {
            messages.push('Passwords do not match.');
        }
        if (passwordStrength.score < 3) {
            messages.push('Password is too weak. Use 12+ chars with upper/lowercase, numbers, and a symbol.');
        }

        if (messages.length) {
            setError(messages.join(' '));
            return;
        }

        try {
            const result = await dispatch(registerUser(form)).unwrap();
            navigate(result.user?.is_admin ? '/admin' : '/legacy');
        } catch (err) {
            setError(typeof err === 'string' ? err : err?.message ?? 'Unable to register');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="text-sm text-slate-300">Full Name</label>
                <input
                    type="text"
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
            </div>
            <div>
                <label className="text-sm text-slate-300">Email</label>
                <input
                    type="email"
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm text-slate-300">Password</label>
                    <input
                        type="password"
                        required
                        className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <div className="mt-2">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-300 transition-all"
                                style={{ width: `${passwordStrength.percent}%` }}
                            />
                        </div>
                        <p className={`mt-1 text-xs ${passwordStrength.color}`}>{passwordStrength.label}</p>
                        <p className="text-[11px] text-slate-400">{passwordStrength.recommendation}</p>
                    </div>
                </div>
                <div>
                    <label className="text-sm text-slate-300">Confirm Password</label>
                    <input
                        type="password"
                        required
                        className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                        value={form.password_confirmation}
                        onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                    />
                    {form.password_confirmation && form.password !== form.password_confirmation && (
                        <p className="mt-1 text-xs text-rose-400">Passwords do not match.</p>
                    )}
                </div>
            </div>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-2xl bg-indigo-500 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:opacity-50"
            >
                {status === 'loading' ? 'Creating account...' : 'Create account'}
            </button>
            <p className="text-center text-sm text-slate-400">
                Already registered?{' '}
                <Link to="/login" className="text-indigo-300 hover:text-white">
                    Sign in
                </Link>
            </p>
        </form>
    );
}

export default RegisterPage;
