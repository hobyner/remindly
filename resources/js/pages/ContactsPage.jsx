import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createContact, fetchContacts } from '../store/slices/contactsSlice';

function ContactsPage() {
    const dispatch = useAppDispatch();
    const { items, status } = useAppSelector((state) => state.contacts);
    const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        notes: '',
        timezone: defaultTimezone,
    });
    const [feedback, setFeedback] = useState({ type: null, message: null });

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchContacts());
        }
    }, [dispatch, status]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setFeedback({ type: null, message: null });
            const payload = {
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email || undefined,
                phone_number: form.phone || undefined,
                whatsapp_number: form.phone || undefined,
                timezone: form.timezone || 'UTC',
                notes: form.notes || undefined,
            };
            await dispatch(createContact(payload)).unwrap();
            setForm({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                notes: '',
                timezone: defaultTimezone,
            });
            setFeedback({ type: 'success', message: 'Contact saved.' });
        } catch (error) {
            setFeedback({
                type: 'error',
                message: error?.response?.data?.message ?? 'Unable to save contact. Check the fields and try again.',
            });
        }
    };

    return (
        <div className="space-y-8">
            <header className="rounded-3xl border border-slate-900 bg-slate-950/60 p-6">
                <h1 className="text-2xl font-semibold text-white">Contacts</h1>
                <p className="text-sm text-slate-400">Add trusted people for reminders or legacy drops.</p>
            </header>

            <div className="grid gap-6 lg:grid-cols-3">
                <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-900 bg-slate-950/60 p-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Add contact</p>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-xs text-slate-400">First name</label>
                            <input
                                type="text"
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                                value={form.first_name}
                                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">Last name</label>
                            <input
                                type="text"
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                                value={form.last_name}
                                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Email</label>
                        <input
                            type="email"
                            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Phone</label>
                        <input
                            type="tel"
                            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Notes</label>
                        <textarea
                            rows={3}
                            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Timezone</label>
                        <input
                            type="text"
                            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                            value={form.timezone}
                            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                        />
                        <p className="mt-1 text-xs text-slate-500">Defaults to your current timezone.</p>
                    </div>
                    {feedback.message && (
                        <p
                            className={`text-sm ${
                                feedback.type === 'error' ? 'text-rose-400' : 'text-emerald-300'
                            }`}
                        >
                            {feedback.message}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-indigo-500 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
                    >
                        Save contact
                    </button>
                </form>

                <section className="lg:col-span-2 rounded-3xl border border-slate-900 bg-slate-950/60 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Contact list</p>
                            <h2 className="text-xl font-semibold text-white">Trusted people</h2>
                        </div>
                        <span className="text-sm text-slate-400">{items.length} total</span>
                    </div>
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-400">
                                    <th className="py-2 pr-4">Name</th>
                                    <th className="py-2 pr-4">Email</th>
                                    <th className="py-2 pr-4">Phone</th>
                                    <th className="py-2 pr-4">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((contact) => (
                                    <tr key={contact.id} className="border-t border-slate-900 text-slate-200">
                                        <td className="py-3 pr-4 font-semibold">
                                            {contact.first_name} {contact.last_name}
                                        </td>
                                        <td className="py-3 pr-4 text-slate-400">{contact.email || '—'}</td>
                                        <td className="py-3 pr-4 text-slate-400">{contact.phone_number || '—'}</td>
                                        <td className="py-3 pr-4 text-slate-500">{contact.notes || '—'}</td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-slate-500">
                                            No contacts yet. Use the form to add the first one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ContactsPage;
