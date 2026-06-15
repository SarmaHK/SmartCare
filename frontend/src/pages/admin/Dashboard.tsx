import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { AdminStatsCard } from './components/AdminStatsCard';
import { AdminAppointmentsTable } from './components/AdminAppointmentsTable';
import { UsersTable } from './components/UsersTable';
import { DashboardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { adminService, type DashboardStats, type UserSummary } from '../../services/admin.service';
import { type Appointment } from '../../services/appointment.service';
import { Users, Stethoscope, Activity, Calendar, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [statsRes, aptsRes, usersRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAppointments({ limit: 5 }),
        adminService.getUsers({ limit: 5 }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (aptsRes.success) setRecentAppointments(aptsRes.data.appointments ?? []);
      if (usersRes.success) setRecentUsers(usersRes.data.users ?? []);
    } catch (error) {
      console.error('Failed to fetch admin dashboard', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!stats) {
    return (
      <EmptyState
        icon={<Users className="h-7 w-7" />}
        title="Unable to load dashboard"
        description="Could not fetch system statistics. Please refresh the page."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="System Overview"
        description="Monitor platform metrics, manage users, and track healthcare activity."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6" />}
          colorClass="bg-primary-50 text-primary-600"
        />
        <AdminStatsCard
          title="Doctors"
          value={stats.totalDoctors}
          icon={<Stethoscope className="h-6 w-6" />}
          colorClass="bg-sky-50 text-sky-600"
        />
        <AdminStatsCard
          title="Patients"
          value={stats.totalPatients}
          icon={<Activity className="h-6 w-6" />}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <AdminStatsCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={<Calendar className="h-6 w-6" />}
          colorClass="bg-secondary-100 text-secondary-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatsCard
          title="Completed"
          value={stats.completedAppointments}
          icon={<CheckCircle className="h-6 w-6" />}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <AdminStatsCard
          title="Pending"
          value={stats.pendingAppointments}
          icon={<Clock className="h-6 w-6" />}
          colorClass="bg-amber-50 text-amber-600"
        />
        <AdminStatsCard
          title="Cancelled"
          value={stats.cancelledAppointments}
          icon={<XCircle className="h-6 w-6" />}
          colorClass="bg-red-50 text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900">Recent Appointments</h2>
            <button
              type="button"
              onClick={() => navigate('/admin/appointments')}
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <AdminAppointmentsTable appointments={recentAppointments} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900">Recently Joined Users</h2>
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <UsersTable users={recentUsers} onToggleStatus={() => {}} />
        </div>
      </div>
    </div>
  );
};
