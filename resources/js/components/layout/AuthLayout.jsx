import { Outlet } from 'react-router-dom';

function AuthLayout() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
            <div className="mb-6 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-400">BeyondMessage</p>
                <h1 className="text-3xl font-semibold text-white">Stay memorable.</h1>
                <p className="text-sm text-slate-400">Automated WhatsApp & email reminders for every moment.</p>
            </div>
            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-indigo-950/30 backdrop-blur">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
