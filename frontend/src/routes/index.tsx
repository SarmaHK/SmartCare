import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Placeholders for dashboard index pages
import DoctorDashboard from '../pages/doctor/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminDoctors from '../pages/admin/Doctors';
import BookAppointment from '../pages/patient/BookAppointment';
import MyAppointments from '../pages/patient/MyAppointments';

import NotFound from '../pages/NotFound';
import { 
  ROUTES, 
  PATIENT_SIDEBAR_LINKS, 
  DOCTOR_SIDEBAR_LINKS, 
  ADMIN_SIDEBAR_LINKS 
} from '../utils/constants';

import { ProtectedRoute } from '../layouts/ProtectedRoute';
import { RoleGuard } from '../layouts/RoleGuard';
import PatientDashboard from '../pages/patient/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
  },
  {
    path: '/patient',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['PATIENT']} />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <DashboardLayout links={PATIENT_SIDEBAR_LINKS} title="Patient Dashboard" role="patient" />,
        children: [
          { index: true, element: <PatientDashboard /> },
          { path: 'appointments', element: <MyAppointments /> },
          { path: 'book', element: <BookAppointment /> },
          { path: 'profile', element: <div className="p-4">Profile Settings</div> },
        ],
      }
    ]
  },
  {
    path: '/doctor',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['DOCTOR']} />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <DashboardLayout links={DOCTOR_SIDEBAR_LINKS} title="Doctor Dashboard" role="doctor" />,
        children: [
          { index: true, element: <DoctorDashboard /> },
          { path: 'appointments', element: <div className="p-4">Doctor Appointments</div> },
          { path: 'schedule', element: <div className="p-4">Doctor Schedule</div> },
          { path: 'patients', element: <div className="p-4">Patient List</div> },
          { path: 'profile', element: <div className="p-4">Profile Settings</div> },
        ]
      }
    ]
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ADMIN']} />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <DashboardLayout links={ADMIN_SIDEBAR_LINKS} title="Admin Dashboard" role="admin" />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'doctors', element: <AdminDoctors /> },
          { path: 'appointments', element: <div className="p-4">All Appointments</div> },
          { path: 'schedules', element: <div className="p-4">Manage Schedules</div> },
          { path: 'patients', element: <div className="p-4">Manage Patients</div> },
          { path: 'settings', element: <div className="p-4">System Settings</div> },
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
