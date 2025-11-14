import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchReminders, createReminder } from '../store/slices/remindersSlice';
import { fetchContacts } from '../store/slices/contactsSlice';
import { fetchTemplates } from '../store/slices/templatesSlice';

const reminderTypes = ['birthday', 'bill', 'meeting', 'promotion', 'custom'];
const channels = ['whatsapp', 'email'];

function RemindersPage() {
    const dispatch = useAppDispatch();
    const reminders = useAppSelector((state) => state.reminders.items);
    const contacts = useAppSelector((state) => state.contacts.items);
    const templates = useAppSelector((state) => state.templates.items);
    const [form, setForm] = useState({
        title: '',
        contact_id: '',
        reminder_template_id: '',
        type: 'custom',
        channel: 'whatsapp',
        send_at: dayjs().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        dispatch(fetchReminders());
        dispatch(fetchContacts());
        dispatch(fetchTemplates());
    }, [dispatch]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage(null);

        try {
            await dispatch(
                createReminder({
                    ...form,
                    contact_id: Number(form.contact_id),
                    reminder_template_id: form.reminder_template_id ? Number(form.reminder_template_id) : null,
                    send_at: dayjs(form.send_at).toISOString(),
                }),
            ).unwrap();
            setMessage('Reminder scheduled successfully.');
            setForm((current) => ({ ...current, title: '', reminder_template_id: '' }));
        } catch (error) {
            setMessage(error.message ?? 'Unable to create reminder');
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Create</p>
                <h2 className="text-2xl font-semibold text-white">Smart reminder</h2>
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Title</label>
                        <input
                            type="text"
                            required
                            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white focus:border-indigo-500"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Contact</label>
                            <select
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white"
                                value={form.contact_id}
                                onChange={(e) => setForm({ ...form, contact_id: e.target.value })}
                            >
                                <option value="">Choose</option>
                                {contacts.map((contact) => (
                                    <option key={contact.id} value={contact.id}>
                                        {contact.first_name} {contact.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Template</label>
                            <select
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white"
                                value={form.reminder_template_id}
                                onChange={(e) => setForm({ ...form, reminder_template_id: e.target.value })}
                            >
                                <option value="">Custom message</option>
                                {templates.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.name} ({template.channel})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Type</label>
                            <select
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                            >
                                {reminderTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Channel</label>
                            <select
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white"
                                value={form.channel}
                                onChange={(e) => setForm({ ...form, channel: e.target.value })}
                            >
                                {channels.map((channel) => (
                                    <option key={channel} value={channel}>
                                        {channel}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Send at</label>
                            <input
                                type="datetime-local"
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-white"
                                value={form.send_at}
                                onChange={(e) => setForm({ ...form, send_at: e.target.value })}
                            />
                        </div>
                    </div>
                    {message && <p className="text-sm text-emerald-400">{message}</p>}
                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-indigo-500 py-3 font-semibold text-white shadow-indigo-500/30 transition hover:bg-indigo-400"
                    >
                        Schedule via WhatsApp / Email
                    </button>
                </form>
            </section>

            <section className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Timeline</p>
                        <h2 className="text-2xl font-semibold text-white">Recent reminders</h2>
                    </div>
                </div>
                <div className="mt-4 space-y-4">
                    {reminders.map((reminder) => (
                        <div key={reminder.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{reminder.type}</p>
                                    <p className="text-lg font-semibold text-white">{reminder.title}</p>
                                    <p className="text-xs text-slate-400">{reminder.contact?.first_name}</p>
                                </div>
                                <div className="text-right text-sm text-slate-400">
                                    <p>{dayjs(reminder.send_at).format('MMM D, HH:mm')}</p>
                                    <p className="text-xs">{reminder.status}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {reminders.length === 0 && <p className="text-sm text-slate-400">No reminders yet.</p>}
                </div>
            </section>
        </div>
    );
}

export default RemindersPage;
