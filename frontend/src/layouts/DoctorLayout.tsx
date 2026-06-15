import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Home, Calendar, Clock, User } from 'lucide-react';

export const DoctorLayout: React.FC = () => {
  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/doctor' },
    { icon: <Clock className="w-5 h-5" />, label: 'My Slots', path: '/doctor/slots' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Appointments', path: '/doctor/appointments' },
    { icon: <User className="w-5 h-5" />, label: 'Profile', path: '/doctor/profile' },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      roleName="Doctor"
      role="Doctor"
      portalTitle="Doctor Portal"
      maxWidth="6xl"
    />
  );
};
