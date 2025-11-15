import { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error
    const [message, setMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage(null);

        if (!email) {
            setMessage('Please enter the email you used to sign up.');
            return;
        }

        setStatus('sending');
        // No backend endpoint wired yet; simulate a request so the UI can be hooked later.
        setTimeout(() => {
            setStatus('sent');
            setMessage('If that email exists, a reset link is on its way.');
        }, 600);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="text-sm text-slate-300">Account email</label>
                <input
                    type="email"
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                />
            </div>
            {message && (
                <p className={`text-sm ${status === 'sent' ? 'text-emerald-300' : 'text-rose-400'}`}>{message}</p>
            )}
            <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-2xl bg-indigo-500 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:opacity-50"
            >
                {status === 'sending' ? 'Sending reset link...' : 'Send reset link'}
            </button>
            <p className="text-center text-sm text-slate-400">
                Remembered it?{' '}
                <Link to="/login" className="text-indigo-300 hover:text-white">
                    Back to login
                </Link>
            </p>
        </form>
    );
}

export default ForgotPasswordPage;
