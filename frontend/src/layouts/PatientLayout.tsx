import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Home, Users, Calendar, User } from 'lucide-react';

export const PatientLayout: React.FC = () => {
  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/patient' },
    { icon: <Users className="w-5 h-5" />, label: 'Find Doctors', path: '/patient/doctors' },
    { icon: <Calendar className="w-5 h-5" />, label: 'My Appointments', path: '/patient/appointments' },
    { icon: <User className="w-5 h-5" />, label: 'Profile', path: '/patient/profile' },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      roleName="Patient"
      role="Patient"
      portalTitle="Patient Portal"
      maxWidth="6xl"
    />
  );
};
