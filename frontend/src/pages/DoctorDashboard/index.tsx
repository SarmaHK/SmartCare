import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../../store/dashboardStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import StatsCard from '../../components/dashboard/StatsCard';
import Badge from '../../components/common/Badge';
import { PageLoader } from '../../components/common/Loader';
import { staggerContainer, fadeInUp } from '../../hooks/useAnimations';

const DoctorDashboard: React.FC = () => {
  const { stats, fetchDoctorStats, isLoading: statsLoading } = useDashboardStore();
  const { appointments, fetchDoctorAppointments, isLoading: appsLoading } = useAppointmentStore();

  useEffect(() => {
    fetchDoctorStats();
    fetchDoctorAppointments();
  }, [fetchDoctorStats, fetchDoctorAppointments]);

  if (statsLoading) return <PageLoader />;

  const statsCards = stats ? [
    { label: 'Today\'s Appointments', value: stats.todayAppointments || 0, icon: 'CalendarCheck', color: '#0EA5E9', trend: 0 },
    { label: 'Upcoming', value: stats.upcomingAppointments || 0, icon: 'Clock', color: '#F59E0B', trend: 5 },
    { label: 'Total Patients', value: stats.totalPatients || 0, icon: 'Users', color: '#22C55E', trend: 12 },
    { label: 'Total Appointments', value: stats.totalAppointments || 0, icon: 'Activity', color: '#8B5CF6', trend: 8 },
  ] : [];

  return (
    <div>
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h2>
        <p className="text-gray-500 mt-1">Your daily schedule and patient overview.</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {statsCards.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Appointments */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Recent & Upcoming Appointments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {!appsLoading && appointments.slice(0, 10).map((apt: any) => (
                    <tr key={apt.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{apt.patient_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(apt.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{apt.start_time}</td>
                      <td className="px-6 py-4">
                        <Badge variant="info" size="sm">{apt.status}</Badge>
                      </td>
                    </tr>
                  ))}
                  {appsLoading && <tr><td colSpan={4} className="p-4 text-center text-gray-500">Loading...</td></tr>}
                  {!appsLoading && appointments.length === 0 && (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">No appointments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
