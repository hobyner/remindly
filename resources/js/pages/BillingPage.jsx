import { useState } from 'react';
import api from '../api/client';

function BillingPage() {
    const [status, setStatus] = useState(null);

    const handleSubscribe = async () => {
        try {
            setStatus('loading');
            const { data } = await api.post('/payments/paystack/initialize', {
                amount: 5000,
                plan: 'pro-monthly',
            });
            setStatus('redirecting');
            window.open(data.authorization_url, '_blank');
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
                <h2 className="text-2xl font-semibold text-white">Paystack billing</h2>
                <p className="text-sm text-slate-400">
                    Unlock unlimited automations, high-volume WhatsApp templates, and premium analytics.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Free</p>
                        <p className="text-3xl font-semibold text-white">₦0</p>
                        <p className="text-sm text-slate-400">Up to 10 reminders every month.</p>
                    </div>
                    <div className="rounded-2xl border border-indigo-700 bg-slate-950/60 p-4 shadow-lg shadow-indigo-900/30">
                        <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Pro</p>
                        <p className="text-3xl font-semibold text-white">₦5,000</p>
                        <p className="text-sm text-slate-400">Unlimited reminders + Paystack auto-renewal.</p>
                        <button
                            type="button"
                            onClick={handleSubscribe}
                            className="mt-4 w-full rounded-2xl bg-indigo-500 py-3 font-semibold text-white hover:bg-indigo-400"
                        >
                            {status === 'loading' ? 'Connecting to Paystack...' : 'Subscribe with Paystack'}
                        </button>
                        {status === 'redirecting' && (
                            <p className="mt-2 text-xs text-emerald-400">Please finish the checkout in the new tab.</p>
                        )}
                        {status === 'error' && <p className="mt-2 text-xs text-rose-400">Unable to talk to Paystack.</p>}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BillingPage;
