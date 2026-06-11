import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
// lucide-react icons used in the stats config
import { useDashboardStore } from '../../store/dashboardStore';
import StatsCard from '../../components/dashboard/StatsCard';
import Badge from '../../components/common/Badge';
import { PageLoader } from '../../components/common/Loader';
import { staggerContainer, fadeInUp } from '../../hooks/useAnimations';
import { formatDate } from '../../utils/formatters';

const DoctorDashboard: React.FC = () => {
  const { stats, recentAppointments, isLoading, fetchDoctorDashboard } = useDashboardStore();

  useEffect(() => {
    fetchDoctorDashboard('doc-001'); // Simulating logged-in doctor
  }, [fetchDoctorDashboard]);

  if (isLoading) return <PageLoader />;

  const statsCards = [
    { label: "Today's Appointments", value: stats.todayAppointments, icon: 'Calendar', color: '#0EA5E9', trend: 12 },
    { label: 'Upcoming Appointments', value: stats.upcomingAppointments, icon: 'Clock', color: '#8B5CF6', trend: 8 },
    { label: 'Total Patients', value: stats.totalPatients, icon: 'Users', color: '#22C55E', trend: 15 },
    { label: 'Total Appointments', value: stats.totalAppointments, icon: 'Activity', color: '#F59E0B', trend: 5 },
  ];

  return (
    <div>
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Welcome back, Dr. Sarah Mitchell</h2>
        <p className="text-text-secondary mt-1">Here's an overview of your practice today.</p>
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

      {/* Appointments Table */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <div className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-text-primary">Recent Appointments</h3>
            <span className="text-sm text-text-muted">{recentAppointments.length} appointments</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Patient</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Time</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{apt.patientName}</p>
                        <p className="text-xs text-text-muted">{apt.patientEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(apt.date)}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{apt.time}</td>
                    <td className="px-6 py-4">
                      <Badge status={apt.status} dot size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorDashboard;
