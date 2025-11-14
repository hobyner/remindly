import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchReminders } from '../store/slices/remindersSlice';
import { fetchTemplates } from '../store/slices/templatesSlice';
import { fetchContacts } from '../store/slices/contactsSlice';
import dayjs from 'dayjs';
import { FiMail, FiMessageCircle, FiRepeat, FiZap } from 'react-icons/fi';

function StatCard({ title, value, icon: Icon, trend }) {
    return (
        <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-5 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{title}</p>
                <span className="rounded-full bg-slate-800/70 p-2 text-indigo-300">
                    <Icon />
                </span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
            <p className="text-xs text-emerald-400">{trend}</p>
        </div>
    );
}

function DashboardPage() {
    const dispatch = useAppDispatch();
    const reminders = useAppSelector((state) => state.reminders.items);
    const templates = useAppSelector((state) => state.templates.items);
    const contacts = useAppSelector((state) => state.contacts.items);

    useEffect(() => {
        dispatch(fetchReminders());
        dispatch(fetchTemplates());
        dispatch(fetchContacts());
    }, [dispatch]);

    const upcoming = reminders.filter((reminder) => dayjs(reminder.send_at).isAfter(dayjs())).slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Active Reminders" value={reminders.length} icon={FiZap} trend="+12% vs last week" />
                <StatCard title="Templates" value={templates.length} icon={FiRepeat} trend="Auto-messaging ready" />
                <StatCard title="Contacts" value={contacts.length} icon={FiMessageCircle} trend="Scalable outreach" />
                <StatCard title="Channels" value="WhatsApp + Email" icon={FiMail} trend="Meta Cloud connected" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="lg:col-span-2 rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Upcoming</p>
                            <h2 className="text-xl font-semibold text-white">Next reminders</h2>
                        </div>
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                            Auto-messaging on
                        </span>
                    </div>
                    <div className="mt-6 space-y-4">
                        {upcoming.length === 0 && (
                            <p className="text-sm text-slate-400">No upcoming reminders yet. Create one to get started.</p>
                        )}
                        {upcoming.map((reminder) => (
                            <div
                                key={reminder.id}
                                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
                            >
                                <div>
                                    <p className="text-sm text-slate-500">{reminder.type}</p>
                                    <p className="text-lg font-semibold text-white">{reminder.title}</p>
                                    <p className="text-xs text-slate-400">
                                        {reminder.contact?.first_name} via {reminder.channel}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-white">
                                        {dayjs(reminder.send_at).format('MMM D, HH:mm')}
                                    </p>
                                    <p className="text-xs text-slate-500">{reminder.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Templates</p>
                    <h2 className="text-xl font-semibold text-white">Auto-messaging</h2>
                    <div className="mt-4 space-y-4">
                        {templates.slice(0, 4).map((template) => (
                            <div key={template.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{template.category}</p>
                                <p className="text-base font-semibold text-white">{template.name}</p>
                                <p className="text-xs text-slate-400 line-clamp-2">{template.body}</p>
                            </div>
                        ))}
                        {templates.length === 0 && (
                            <p className="text-sm text-slate-400">No templates yet. Design one for birthdays, bills & more.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default DashboardPage;
