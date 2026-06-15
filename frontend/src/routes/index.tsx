import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout } from '../layouts/AuthLayout';
import { PatientLayout } from '../layouts/PatientLayout';
import { DoctorLayout } from '../layouts/DoctorLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Dashboards
import { PatientDashboard } from '../pages/patient/Dashboard';
// Doctor Pages
import { DoctorDashboard } from '../pages/doctor/Dashboard';
import { SlotsPage } from '../pages/doctor/SlotsPage';
import { CreateSlotPage } from '../pages/doctor/CreateSlotPage';
import { EditSlotPage } from '../pages/doctor/EditSlotPage';
import { AppointmentsPage as DoctorAppointmentsPage } from '../pages/doctor/AppointmentsPage';
import { AppointmentDetailsPage as DoctorAppointmentDetailsPage } from '../pages/doctor/AppointmentDetailsPage';
import { ProfilePage as DoctorProfilePage } from '../pages/doctor/ProfilePage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/Dashboard';
import { UsersPage as AdminUsersPage } from '../pages/admin/UsersPage';
import { UserDetailsPage as AdminUserDetailsPage } from '../pages/admin/UserDetailsPage';
import { DoctorsPage as AdminDoctorsPage } from '../pages/admin/DoctorsPage';
import { DoctorDetailsPage as AdminDoctorDetailsPage } from '../pages/admin/DoctorDetailsPage';
import { AppointmentsPage as AdminAppointmentsPage } from '../pages/admin/AppointmentsPage';
import { ReportsPage as AdminReportsPage } from '../pages/admin/ReportsPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Patient Pages
import { DoctorsPage } from '../pages/patient/DoctorsPage';
import { DoctorDetailsPage } from '../pages/patient/DoctorDetailsPage';
import { AppointmentsPage } from '../pages/patient/AppointmentsPage';
import { ProfilePage } from '../pages/patient/ProfilePage';

// Guards
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';



const RootRoute = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/auth/login" replace />;
  const redirectMap = {
    PATIENT: '/patient',
    DOCTOR: '/doctor',
    ADMIN: '/admin'
  };
  return <Navigate to={redirectMap[user.role as keyof typeof redirectMap] || '/auth/login'} replace />;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<RootRoute />} />

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Patient Routes */}
        <Route path="/patient" element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
          <Route element={<PatientLayout />}>
            <Route index element={<PatientDashboard />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="doctors/:id" element={<DoctorDetailsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
          <Route element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="slots" element={<SlotsPage />} />
            <Route path="slots/create" element={<CreateSlotPage />} />
            <Route path="slots/:id/edit" element={<EditSlotPage />} />
            <Route path="appointments" element={<DoctorAppointmentsPage />} />
            <Route path="appointments/:id" element={<DoctorAppointmentDetailsPage />} />
            <Route path="profile" element={<DoctorProfilePage />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="users/:id" element={<AdminUserDetailsPage />} />
            <Route path="doctors" element={<AdminDoctorsPage />} />
            <Route path="doctors/:id" element={<AdminDoctorDetailsPage />} />
            <Route path="appointments" element={<AdminAppointmentsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
