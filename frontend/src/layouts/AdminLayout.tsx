import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Home, Users, Stethoscope, Calendar, BarChart2 } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/admin' },
    { icon: <Users className="w-5 h-5" />, label: 'Users', path: '/admin/users' },
    { icon: <Stethoscope className="w-5 h-5" />, label: 'Doctors', path: '/admin/doctors' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Appointments', path: '/admin/appointments' },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Reports', path: '/admin/reports' },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      roleName="Administrator"
      role="Admin"
      portalTitle="Admin Portal"
      maxWidth="7xl"
    />
  );
};
