import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiBarChart2, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';

const navItems = [{ label: 'Overview', path: '/admin', icon: FiBarChart2 }];

function AdminLayout() {
    const dispatch = useAppDispatch();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <aside className="hidden w-64 flex-col justify-between border-r border-slate-900 bg-slate-950/80 p-6 lg:flex">
                <div>
                    <div className="mb-8">
                        <p className="text-lg font-semibold text-white">BeyondMessage</p>
                        <p className="text-sm text-slate-400">Admin console</p>
                    </div>
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                end={item.path === '/admin'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-indigo-500/20 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`
                                }
                            >
                                <item.icon className="text-lg" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <button
                    type="button"
                    onClick={() => dispatch(logoutUser())}
                    className="flex items-center gap-2 rounded-2xl border border-slate-800 px-4 py-2 text-sm text-slate-200"
                >
                    <FiLogOut /> Logout
                </button>
            </aside>

            <main className="flex-1">
                <div className="sticky top-0 z-10 border-b border-slate-900 bg-slate-950/90 px-4 py-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Admin</p>
                            <h1 className="text-lg font-semibold text-white">Control center</h1>
                        </div>
                        <button
                            type="button"
                            className="rounded-full border border-slate-700 p-2 text-white lg:hidden"
                            onClick={() => setMobileNavOpen(true)}
                        >
                            <FiMenu />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>

            {mobileNavOpen && (
                <div className="fixed inset-0 z-40 bg-slate-950/95 p-6 lg:hidden">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-white">Admin</p>
                        <button
                            type="button"
                            className="rounded-full border border-slate-700 p-2 text-white"
                            onClick={() => setMobileNavOpen(false)}
                        >
                            <FiX />
                        </button>
                    </div>
                    <div className="mt-8 space-y-3">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                end={item.path === '/admin'}
                                onClick={() => setMobileNavOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition ${isActive ? 'bg-indigo-500/20 text-white' : 'text-slate-300 hover:bg-slate-900 hover:text-white'}`
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
                            setMobileNavOpen(false);
                            dispatch(logoutUser());
                        }}
                    >
                        <FiLogOut className="mr-2 inline" /> Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminLayout;
