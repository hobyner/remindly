import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchProfile } from './store/slices/authSlice';
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import RemindersPage from './pages/RemindersPage';
import TemplatesPage from './pages/TemplatesPage';
import SettingsPage from './pages/SettingsPage';
import BillingPage from './pages/BillingPage';
import LegacyPage from './pages/LegacyPage';
import ContactsPage from './pages/ContactsPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/admin/AdminDashboard';

const PrivateRoute = ({ children }) => {
    const token = useAppSelector((state) => state.auth.token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AdminRoute = ({ children }) => {
    const token = useAppSelector((state) => state.auth.token);
    const user = useAppSelector((state) => state.auth.user);
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    if (!user?.is_admin) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

function App() {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);

    useEffect(() => {
        if (token) {
            dispatch(fetchProfile());
        }
    }, [dispatch, token]);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            <Route
                element={
                    <PrivateRoute>
                        <AppLayout />
                    </PrivateRoute>
                }
            >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/reminders" element={<RemindersPage />} />
                <Route path="/legacy" element={<LegacyPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route
                path="/admin/*"
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
