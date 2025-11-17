import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAdminOverview } from '../../store/slices/adminSlice';
import dayjs from 'dayjs';

function Stat({ label, value }) {
    return (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-3xl font-semibold text-white">{value}</p>
        </div>
    );
}

function AdminDashboard() {
    const dispatch = useAppDispatch();
    const admin = useAppSelector((state) => state.admin);

    useEffect(() => {
        if (admin.status === 'idle') {
            dispatch(fetchAdminOverview());
        }
    }, [dispatch, admin.status]);

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Stat label="Users" value={admin.stats.users ?? 0} />
                <Stat label="Reminders" value={admin.stats.reminders ?? 0} />
                <Stat label="Legacy messages" value={admin.stats.legacy_messages ?? 0} />
                <Stat label="Payments" value={admin.stats.payments ?? 0} />
            </div>

            <section className="rounded-3xl border border-slate-900 bg-slate-900/60 p-6">
                <h2 className="text-xl font-semibold text-white">Recent users</h2>
                <table className="mt-4 w-full text-sm">
                    <thead>
                        <tr className="text-left text-slate-400">
                            <th className="py-2">Name</th>
                            <th className="py-2">Email</th>
                            <th className="py-2">Role</th>
                            <th className="py-2">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admin.users.map((user) => (
                            <tr key={user.id} className="border-t border-slate-900 text-slate-200">
                                <td className="py-2">{user.name}</td>
                                <td className="py-2 text-slate-400">{user.email}</td>
                                <td className="py-2 text-slate-400">{user.is_admin ? 'Admin' : 'User'}</td>
                                <td className="py-2 text-slate-500">{dayjs(user.created_at).format('MMM D, YYYY')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-6">
                    <h2 className="text-xl font-semibold text-white">Recent reminders</h2>
                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                        {admin.reminders.map((reminder) => (
                            <li key={reminder.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                                <p className="font-semibold text-white">{reminder.title}</p>
                                <p className="text-xs text-slate-500">{reminder.channel} · {reminder.status}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-6">
                    <h2 className="text-xl font-semibold text-white">Recent legacy notes</h2>
                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                        {admin.legacy_messages.map((legacy) => (
                            <li key={legacy.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                                <p className="font-semibold text-white">{legacy.title}</p>
                                <p className="text-xs text-slate-500">{legacy.status}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="rounded-3xl border border-slate-900 bg-slate-900/60 p-6">
                <h2 className="text-xl font-semibold text-white">Recent payments</h2>
                <table className="mt-4 w-full text-sm">
                    <thead>
                        <tr className="text-left text-slate-400">
                            <th className="py-2">Amount</th>
                            <th className="py-2">Provider</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admin.payments.map((payment) => (
                            <tr key={payment.id} className="border-t border-slate-900 text-slate-200">
                                <td className="py-2">{payment.amount}</td>
                                <td className="py-2 text-slate-400">{payment.provider}</td>
                                <td className="py-2 text-slate-400">{payment.status}</td>
                                <td className="py-2 text-slate-500">{dayjs(payment.created_at).format('MMM D, YYYY')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default AdminDashboard;
