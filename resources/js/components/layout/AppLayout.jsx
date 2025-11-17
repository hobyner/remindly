import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { FiBell, FiCalendar, FiCreditCard, FiHome, FiLogOut, FiSettings, FiFileText, FiShield, FiMenu, FiX, FiUsers } from 'react-icons/fi';

const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: FiHome },
    { label: 'Calendar', path: '/calendar', icon: FiCalendar },
    { label: 'Reminders', path: '/reminders', icon: FiBell },
    { label: 'Legacy', path: '/legacy', icon: FiShield },
    { label: 'Contacts', path: '/contacts', icon: FiUsers },
    { label: 'Templates', path: '/templates', icon: FiFileText },
    { label: 'Billing', path: '/billing', icon: FiCreditCard },
    { label: 'Settings', path: '/settings', icon: FiSettings },
];

function AppLayout() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-950">
            <aside className="hidden w-64 flex-col justify-between border-r border-slate-900 bg-slate-950/80 p-6 lg:flex">
                <div>
                    <div className="mb-8">
                        <div className="text-lg font-semibold tracking-tight text-white">BeyondMessage</div>
                        <p className="text-sm text-slate-400">Legacy messaging + reminder automation</p>
                    </div>
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dashboard'}
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
                            {user?.is_admin && (
                                <Link
                                    to="/admin"
                                    className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 transition hover:border-indigo-500 hover:text-white"
                                >
                                    Admin
                                </Link>
                            )}
                            <button
                                type="button"
                                className="rounded-full border border-slate-700 p-2 text-white lg:hidden"
                                onClick={() => setMobileOpen(true)}
                            >
                                <FiMenu />
                            </button>
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
            {mobileOpen && (
                <div className="fixed inset-0 z-40 bg-slate-950/95 p-6 lg:hidden">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-white">BeyondMessage</p>
                        <button
                            type="button"
                            className="rounded-full border border-slate-700 p-2 text-white"
                            onClick={() => setMobileOpen(false)}
                        >
                            <FiX />
                        </button>
                    </div>
                    <div className="mt-8 space-y-3">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dashboard'}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition ${
                                        isActive
                                            ? 'bg-indigo-500/20 text-white'
                                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="text-lg" />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="mt-8 w-full rounded-2xl border border-slate-800 px-4 py-2 text-center text-sm text-slate-200"
                        onClick={() => {
                            setMobileOpen(false);
                            dispatch(logoutUser());
                        }}
                    >
                        <FiLogOut className="mr-2 inline" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default AppLayout;
