import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface RoleGuardProps {
  allowedRoles: string[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles: _allowedRoles }) => {
  // Placeholder logic - to be replaced with real auth check
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Bypass role check for now since auth is not connected yet
  // if (!allowedRoles.includes(userRole)) {
  //   return <Navigate to="/auth/login" replace />;
  // }

  return <Outlet />;
};
