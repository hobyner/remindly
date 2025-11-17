import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser } from '../store/slices/authSlice';

function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token, status, user } = useAppSelector((state) => state.auth);
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token && user) {
            navigate(user.is_admin ? '/admin' : '/dashboard', { replace: true });
        }
    }, [token, user, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!form.email || !form.password) {
            setError('Email and password are required.');
            return;
        }

        try {
            const result = await dispatch(loginUser(form)).unwrap();
            navigate(result.user?.is_admin ? '/admin' : '/legacy');
        } catch (err) {
            setError(typeof err === 'string' ? err : err?.message ?? 'Unable to login');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div>
                <label className="text-sm text-slate-300">Password</label>
                <input
                    type="password"
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
                <Link to="/forgot-password" className="text-indigo-300 hover:text-white">
                    Forgot password?
                </Link>
                <span>{error && <span className="text-rose-400">{error}</span>}</span>
            </div>
            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-2xl bg-indigo-500 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:opacity-50"
            >
                {status === 'loading' ? 'Signing you in...' : 'Login'}
            </button>
            <p className="text-center text-sm text-slate-400">
                New here?{' '}
                <Link to="/register" className="text-indigo-300 hover:text-white">
                    Create an account
                </Link>
            </p>
        </form>
    );
}

export default LoginPage;
