import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser } from '../store/slices/authSlice';

function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token, status } = useAppSelector((state) => state.auth);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            navigate('/', { replace: true });
        }
    }, [token, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        try {
            await dispatch(registerUser(form)).unwrap();
            navigate('/');
        } catch (err) {
            setError(err.message ?? 'Unable to register');
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
