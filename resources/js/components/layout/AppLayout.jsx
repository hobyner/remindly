import { NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { FiBell, FiCalendar, FiCreditCard, FiHome, FiLogOut, FiSettings, FiTemplate } from 'react-icons/fi';

const navItems = [
    { label: 'Dashboard', path: '/', icon: FiHome },
    { label: 'Calendar', path: '/calendar', icon: FiCalendar },
    { label: 'Reminders', path: '/reminders', icon: FiBell },
    { label: 'Templates', path: '/templates', icon: FiTemplate },
    { label: 'Billing', path: '/billing', icon: FiCreditCard },
    { label: 'Settings', path: '/settings', icon: FiSettings },
];

function AppLayout() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="flex min-h-screen bg-slate-950">
            <aside className="hidden w-64 flex-col justify-between border-r border-slate-900 bg-slate-950/80 p-6 lg:flex">
                <div>
                    <div className="mb-8">
                        <div className="text-lg font-semibold tracking-tight text-white">Remindly</div>
                        <p className="text-sm text-slate-400">Smart reminders + WhatsApp automation</p>
                    </div>
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? 'bg-indigo-500/20 text-white'
                                            : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="text-lg" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="text-sm font-semibold text-white">{user?.name}</div>
                    <div className="text-xs text-slate-400">{user?.email}</div>
                    <button
                        type="button"
                        onClick={() => dispatch(logoutUser())}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white"
                    >
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1">
                <div className="sticky top-0 z-10 border-b border-slate-900 bg-slate-950/90 px-4 py-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-slate-500">Welcome back</p>
                            <p className="text-base font-semibold text-white">{user?.name}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                            <div className="hidden rounded-full border border-slate-800 px-3 py-1 font-semibold text-slate-300 shadow-sm md:block">
                                {user?.current_plan ?? 'Free Plan'}
                            </div>
                            <button
                                type="button"
                                className="rounded-full border border-slate-800 px-3 py-1 text-slate-300 transition hover:border-indigo-500 hover:text-white"
                                onClick={() => dispatch(logoutUser())}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AppLayout;
