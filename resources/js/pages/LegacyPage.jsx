import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    armLegacyMessage,
    disarmLegacyMessage,
    fetchLegacyMessages,
    saveLegacyMessage,
    toggleLegacyPause,
} from '../store/slices/legacySlice';
import { fetchContacts } from '../store/slices/contactsSlice';

const baseForm = {
    title: '',
    body: '',
    check_in_frequency_unit: 'day',
    check_in_frequency_value: 1,
    grace_period_minutes: 1440,
    deliver_at: '',
    recipients: [],
};

function LegacyPage() {
    const dispatch = useAppDispatch();
    const { items, status, paused, legacyPausedAt } = useAppSelector((state) => state.legacy);
    const contacts = useAppSelector((state) => state.contacts.items);
    const contactsStatus = useAppSelector((state) => state.contacts.status);
    const [form, setForm] = useState(baseForm);
    const [recipient, setRecipient] = useState({ name: '', email: '', phone: '', channel_preference: 'email' });
    const [file, setFile] = useState(null);
    const [voiceNote, setVoiceNote] = useState(null);

    useEffect(() => {
        dispatch(fetchLegacyMessages());
        if (contactsStatus === 'idle') {
            dispatch(fetchContacts());
        }
    }, [dispatch, contactsStatus]);

    const addRecipient = () => {
        if (!recipient.name || !recipient.email) {
            return;
        }
        setForm((prev) => ({
            ...prev,
            recipients: [...prev.recipients, { ...recipient }],
        }));
        setRecipient({ name: '', email: '' });
    };

    const submitForm = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('body', form.body ?? '');
        formData.append('check_in_frequency_unit', form.check_in_frequency_unit);
        formData.append('check_in_frequency_value', form.check_in_frequency_value.toString());
        formData.append('grace_period_minutes', form.grace_period_minutes.toString());
        if (form.deliver_at) {
            formData.append('deliver_at', form.deliver_at);
        }
        form.recipients.forEach((rcp, idx) => {
            formData.append(`recipients[${idx}][name]`, rcp.name);
            formData.append(`recipients[${idx}][email]`, rcp.email);
            if (rcp.phone) {
                formData.append(`recipients[${idx}][phone]`, rcp.phone);
            }
            formData.append(`recipients[${idx}][channel_preference]`, rcp.channel_preference ?? 'email');
        });
        if (file) {
            formData.append('file', file);
        }
        if (voiceNote) {
            formData.append('voice_note', voiceNote);
        }

        dispatch(saveLegacyMessage(formData)).then(() => {
            setForm(baseForm);
            setFile(null);
            setVoiceNote(null);
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-900 bg-slate-950/40 p-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Legacy</p>
                    <h1 className="text-2xl font-semibold text-white">Speak When You Can’t</h1>
                    <p className="text-sm text-slate-400">
                        Secure notes that fire when you miss a heartbeat. Add your trusted recipients and arm the
                        message when you’re ready.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => dispatch(toggleLegacyPause(!paused))}
                    className={`rounded-2xl px-5 py-2 text-sm font-semibold transition ${
                        paused ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-white'
                    }`}
                >
                    {paused ? 'Resume legacy messages' : 'Pause all legacy messages'}
                </button>
            </div>

            {paused && (
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200">
                    Legacy delivery is paused. Nothing will be sent until you resume (paused at{' '}
                    {legacyPausedAt ? new Date(legacyPausedAt).toLocaleString() : 'now'}).
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-900 bg-slate-950/40 p-6">
                    <h2 className="text-lg font-semibold text-white">New message</h2>
                    <p className="text-sm text-slate-400">Draft the note, choose a heartbeat, add recipients.</p>
                    <form className="mt-4 space-y-4" onSubmit={submitForm}>
                        <div>
                            <label className="text-xs text-slate-400">Title</label>
                            <input
                                type="text"
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-white"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">Message</label>
                            <textarea
                                rows={4}
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-white"
                                value={form.body}
                                onChange={(e) => setForm({ ...form, body: e.target.value })}
                                placeholder="Write your note or instructions..."
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">Attach document (optional)</label>
                            <input
                                type="file"
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-white file:mr-4 file:rounded-xl file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-sm"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            />
                            {file && <p className="mt-1 text-xs text-slate-400">Selected: {file.name}</p>}
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">Voice note (optional)</label>
                            <input
                                type="file"
                                accept="audio/*"
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-white file:mr-4 file:rounded-xl file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-sm"
                                onChange={(e) => setVoiceNote(e.target.files?.[0] ?? null)}
                            />
                            {voiceNote && <p className="mt-1 text-xs text-slate-400">Selected: {voiceNote.name}</p>}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-xs text-slate-400">Check-in every</label>
                                <div className="mt-2 flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        className="w-20 rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-white"
                                        value={form.check_in_frequency_value}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                check_in_frequency_value: Number.parseInt(e.target.value, 10),
                                            })
                                        }
                                    />
                                    <select
                                        className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-white"
                                        value={form.check_in_frequency_unit}
                                        onChange={(e) => setForm({ ...form, check_in_frequency_unit: e.target.value })}
                                    >
                                        <option value="day">day(s)</option>
                                        <option value="week">week(s)</option>
                                        <option value="month">month(s)</option>
                                        <option value="hour">hour(s)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Grace period (minutes)</label>
                                <input
                                    type="number"
                                    min={30}
                                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-white"
                                    value={form.grace_period_minutes}
                                    onChange={(e) =>
                                        setForm({ ...form, grace_period_minutes: Number.parseInt(e.target.value, 10) })
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">Deliver after (optional)</label>
                            <input
                                type="datetime-local"
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-white"
                                value={form.deliver_at}
                                onChange={(e) => setForm({ ...form, deliver_at: e.target.value })}
                            />
                        </div>
                            <div className="rounded-2xl border border-slate-800 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Trusted recipients</p>
                                <div className="mt-3 grid gap-3 md:grid-cols-2">
                                    <select
                                        className="rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-white"
                                        defaultValue=""
                                        onChange={(e) => {
                                            const selected = contacts.find((contact) => contact.id === Number(e.target.value));
                                            if (selected) {
                                                setRecipient({
                                                    name: `${selected.first_name} ${selected.last_name ?? ''}`.trim(),
                                                    email: selected.email ?? '',
                                                    phone: selected.phone_number ?? '',
                                                    channel_preference: selected.email ? 'email' : 'sms',
                                                });
                                            }
                                        }}
                                    >
                                        <option value="" disabled>
                                            Select from contacts
                                        </option>
                                        {contacts.map((contact) => (
                                            <option key={contact.id} value={contact.id}>
                                                {contact.first_name} {contact.last_name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-white"
                                        value={recipient.name}
                                        onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-white"
                                        value={recipient.email}
                                        onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone (for SMS/WhatsApp)"
                                        className="rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-white"
                                        value={recipient.phone}
                                        onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
                                    />
                                    <select
                                        className="rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-white"
                                        value={recipient.channel_preference}
                                        onChange={(e) => setRecipient({ ...recipient, channel_preference: e.target.value })}
                                    >
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                        <option value="whatsapp">WhatsApp</option>
                                    </select>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={addRecipient}
                                        className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        Add
                                    </button>
                                </div>
                                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                    {form.recipients.map((rcp, idx) => (
                                        <li key={`${rcp.email}-${idx}`} className="flex items-center justify-between">
                                            <span>
                                                {rcp.name}{' '}
                                                <span className="text-slate-500">
                                                    &lt;{rcp.email}&gt; · {rcp.channel_preference ?? 'email'}
                                                </span>
                                            </span>
                                        <button
                                            type="button"
                                            className="text-xs text-rose-400"
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    recipients: prev.recipients.filter((_, i) => i !== idx),
                                                }))
                                            }
                                        >
                                            remove
                                        </button>
                                    </li>
                                ))}
                                {form.recipients.length === 0 && <li className="text-slate-500">No contacts yet.</li>}
                            </ul>
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-indigo-500 py-3 text-sm font-semibold text-white shadow-indigo-500/30"
                        >
                            Save draft
                        </button>
                    </form>
                </div>

                <div className="rounded-3xl border border-slate-900 bg-slate-950/40 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Your vault</h2>
                            <p className="text-sm text-slate-400">Draft, armed, and delivered notes.</p>
                        </div>
                        <span className="text-sm text-slate-400">{status === 'loading' ? 'Refreshing…' : null}</span>
                    </div>
                    <div className="mt-4 space-y-3">
                        {items.map((message) => (
                            <div key={message.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-white">{message.title}</p>
                                        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{message.status}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {message.status === 'armed' ? (
                                            <button
                                                type="button"
                                                className="rounded-xl border border-slate-700 px-3 py-1 text-xs text-slate-200"
                                                onClick={() => dispatch(disarmLegacyMessage(message.id))}
                                            >
                                                Disarm
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="rounded-xl border border-indigo-500 px-3 py-1 text-xs text-indigo-300"
                                                onClick={() => dispatch(armLegacyMessage(message.id))}
                                            >
                                                Arm
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-slate-300">
                                    Recipients: {message.recipients?.map((r) => r.name).join(', ') || 'nobody yet'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Next check-in:{' '}
                                    {message.next_check_in_due_at
                                        ? new Date(message.next_check_in_due_at).toLocaleString()
                                        : 'not scheduled'}
                                </p>
                            </div>
                        ))}
                        {items.length === 0 && (
                            <p className="text-sm text-slate-500">No messages yet. Draft one on the left.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LegacyPage;
