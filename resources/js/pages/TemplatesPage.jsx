import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTemplates } from '../store/slices/templatesSlice';
import api from '../api/client';

function TemplatesPage() {
    const dispatch = useAppDispatch();
    const { items } = useAppSelector((state) => state.templates);
    const [form, setForm] = useState({
        name: '',
        category: 'birthday',
        channel: 'whatsapp',
        body: 'Hi {{contact.first_name}}, ',
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        dispatch(fetchTemplates());
    }, [dispatch]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await api.post('/templates', form);
            setMessage('Template saved');
            setForm((current) => ({ ...current, name: '' }));
            dispatch(fetchTemplates());
        } catch (error) {
            setMessage(error.response?.data?.message ?? 'Unable to save template');
        }
    };

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
                <h2 className="text-2xl font-semibold text-white">Auto-Messaging Template</h2>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <input
                            type="text"
                            placeholder="Template name"
                            required
                            className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                        <select
                            className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                        >
                            <option value="birthday">Birthday</option>
                            <option value="bill">Bill payment</option>
                            <option value="meeting">Meeting</option>
                            <option value="promotion">Business promo</option>
                            <option value="custom">Custom</option>
                        </select>
                        <select
                            className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white"
                            value={form.channel}
                            onChange={(e) => setForm({ ...form, channel: e.target.value })}
                        >
                            <option value="whatsapp">WhatsApp</option>
                            <option value="email">Email</option>
                        </select>
                    </div>
                    <textarea
                        rows={4}
                        className="w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white"
                        value={form.body}
                        onChange={(e) => setForm({ ...form, body: e.target.value })}
                    />
                    {message && <p className="text-sm text-emerald-400">{message}</p>}
                    <button
                        type="submit"
                        className="rounded-2xl bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-400"
                    >
                        Save template
                    </button>
                </form>
            </section>

            <section className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
                <h2 className="text-2xl font-semibold text-white">Template library</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((template) => (
                        <div key={template.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                {template.category} · {template.channel}
                            </p>
                            <p className="text-lg font-semibold text-white">{template.name}</p>
                            <p className="text-xs text-slate-400 line-clamp-3">{template.body}</p>
                        </div>
                    ))}
                    {items.length === 0 && <p className="text-sm text-slate-400">No templates yet.</p>}
                </div>
            </section>
        </div>
    );
}

export default TemplatesPage;
