import React, { useEffect } from 'react';
import { useDashboardStore } from '../../../store/dashboardStore';
import { useAppointmentStore } from '../../../store/appointmentStore';
import StatsCard from '../../../components/dashboard/StatsCard';
import Badge from '../../../components/common/Badge';
import { PageLoader } from '../../../components/common/Loader';

const DoctorDashboard: React.FC = () => {
  const { stats, fetchDoctorStats, isLoading: statsLoading } = useDashboardStore();
  const { appointments, fetchDoctorAppointments, isLoading: appsLoading } = useAppointmentStore();

  useEffect(() => {
    fetchDoctorStats();
    fetchDoctorAppointments();
  }, [fetchDoctorStats, fetchDoctorAppointments]);

  if (statsLoading) return <PageLoader />;

  const statsCards = stats ? [
    { label: "Today's Appts", value: stats.todayAppointments || 0, icon: 'CalendarCheck', color: '#2563eb' },
    { label: 'Upcoming', value: stats.upcomingAppointments || 0, icon: 'Clock', color: '#d97706', trend: 5 },
    { label: 'Total Patients', value: stats.totalPatients || 0, icon: 'Users', color: '#16a34a', trend: 12 },
    { label: 'Total Appts', value: stats.totalAppointments || 0, icon: 'Activity', color: '#7c3aed', trend: 8 },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Doctor Dashboard</h2>
        <p className="text-[13px] text-slate-500 mt-0.5">Your schedule and patient overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((s) => <StatsCard key={s.label} {...s} />)}
      </div>

      {/* Appointments Table */}
      <div className="bg-white border border-slate-200 rounded-[4px] shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="text-[13px] font-semibold text-slate-700">Recent & Upcoming Appointments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase">Patient</th>
                <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase">Time</th>
                <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {!appsLoading && appointments.slice(0, 10).map((apt: any) => (
                <tr key={apt.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-800">{apt.patient_id}</td>
                  <td className="px-4 py-2.5 text-[13px] text-slate-600">{new Date(apt.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5 text-[13px] text-slate-600">{apt.start_time}</td>
                  <td className="px-4 py-2.5"><Badge variant="info" size="sm">{apt.status}</Badge></td>
                </tr>
              ))}
              {appsLoading && <tr><td colSpan={4} className="px-4 py-6 text-center text-xs text-slate-400">Loading...</td></tr>}
              {!appsLoading && appointments.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-xs text-slate-400">No appointments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
