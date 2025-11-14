import { useState } from 'react';
import api from '../api/client';

function SettingsPage() {
    const [form, setForm] = useState({
        access_token: '',
        phone_number_id: '',
        business_id: '',
    });
    const [message, setMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage(null);
        try {
            const { data } = await api.post('/integrations/meta/verify', form);
            setMessage(data.message);
        } catch (error) {
            setMessage(error.response?.data?.message ?? 'Unable to verify credentials');
        }
    };

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
                <h2 className="text-2xl font-semibold text-white">Meta Cloud (WhatsApp API)</h2>
                <p className="text-sm text-slate-400">
                    Paste the credentials from developers.facebook.com to enable WhatsApp automation.
                </p>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <input
                        type="text"
                        placeholder="Permanent access token"
                        className="w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white"
                        value={form.access_token}
                        onChange={(e) => setForm({ ...form, access_token: e.target.value })}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            type="text"
                            placeholder="Phone number ID"
                            className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white"
                            value={form.phone_number_id}
                            onChange={(e) => setForm({ ...form, phone_number_id: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Business account ID"
                            className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white"
                            value={form.business_id}
                            onChange={(e) => setForm({ ...form, business_id: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-2xl bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-400"
                    >
                        Connect WhatsApp
                    </button>
                    {message && <p className="text-sm text-emerald-400">{message}</p>}
                </form>
            </section>
        </div>
    );
}

export default SettingsPage;
