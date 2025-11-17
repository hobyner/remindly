import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchReminders } from '../store/slices/remindersSlice';
import { fetchTemplates } from '../store/slices/templatesSlice';
import { fetchContacts } from '../store/slices/contactsSlice';
import { fetchLegacyMessages } from '../store/slices/legacySlice';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FiClock, FiLock, FiMail, FiMessageCircle, FiRepeat, FiShield, FiZap } from 'react-icons/fi';

dayjs.extend(relativeTime);

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
    const legacy = useAppSelector((state) => state.legacy);

    useEffect(() => {
        dispatch(fetchReminders());
        dispatch(fetchTemplates());
        dispatch(fetchContacts());
        if (legacy.status === 'idle') {
            dispatch(fetchLegacyMessages());
        }
    }, [dispatch, legacy.status]);

    const upcoming = reminders.filter((reminder) => dayjs(reminder.send_at).isAfter(dayjs())).slice(0, 5);
    const legacyUpcoming = (legacy.summary.upcoming ?? []).filter((item) => item.next_check_in_due_at).slice(0, 4);

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Active Reminders" value={reminders.length} icon={FiZap} trend="+12% vs last week" />
                <StatCard title="Templates" value={templates.length} icon={FiRepeat} trend="Auto-messaging ready" />
                <StatCard title="Contacts" value={contacts.length} icon={FiMessageCircle} trend="Scalable outreach" />
                <StatCard title="Channels" value="WhatsApp + Email" icon={FiMail} trend="Meta Cloud connected" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <StatCard
                    title="Legacy drafts"
                    value={legacy.summary.drafts}
                    icon={FiLock}
                    trend="Notes waiting to arm"
                />
                <StatCard
                    title="Armed notes"
                    value={legacy.summary.armed}
                    icon={FiShield}
                    trend="Ready to deliver on heartbeat"
                />
                <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-5 shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-400">Next heartbeat</p>
                        <span className="rounded-full bg-slate-800/70 p-2 text-indigo-300">
                            <FiClock />
                        </span>
                    </div>
                    <p className="mt-4 text-3xl font-semibold text-white">
                        {legacy.summary.next_check_in_due_at
                            ? dayjs(legacy.summary.next_check_in_due_at).fromNow()
                            : 'No schedule'}
                    </p>
                    <p className="text-xs text-slate-500">
                        {legacy.summary.next_check_in_due_at
                            ? dayjs(legacy.summary.next_check_in_due_at).format('MMM D, HH:mm')
                            : 'Arm a note to start check-ins'}
                    </p>
                </div>
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

            <section className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Legacy</p>
                <h2 className="text-xl font-semibold text-white">Upcoming check-ins</h2>
                <div className="mt-4 space-y-4">
                    {legacyUpcoming.length === 0 && (
                        <p className="text-sm text-slate-400">No armed notes yet. Arm one to activate heartbeats.</p>
                    )}
                    {legacyUpcoming.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.status}</p>
                            <p className="text-xs text-slate-400">
                                Next check-in {dayjs(item.next_check_in_due_at).format('MMM D, HH:mm')}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default DashboardPage;
