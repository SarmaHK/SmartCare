import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../../store/dashboardStore';
import StatsCard from '../../components/dashboard/StatsCard';
import Badge from '../../components/common/Badge';
import { PageLoader } from '../../components/common/Loader';
import { staggerContainer, fadeInUp } from '../../hooks/useAnimations';
import { formatDate } from '../../utils/formatters';

const AdminDashboard: React.FC = () => {
  const { stats, recentAppointments, doctorsList, schedulesList, isLoading, fetchDashboardData } =
    useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) return <PageLoader />;

  const statsCards = [
    { label: 'Total Doctors', value: stats.totalDoctors, icon: 'Stethoscope', color: '#0EA5E9', trend: 10 },
    { label: 'Total Patients', value: stats.totalPatients, icon: 'Users', color: '#22C55E', trend: 18 },
    { label: 'Total Appointments', value: stats.totalAppointments, icon: 'CalendarCheck', color: '#8B5CF6', trend: 12 },
    { label: 'Active Schedules', value: stats.activeSchedules, icon: 'Clock', color: '#F59E0B', trend: 5 },
  ];

  return (
    <div>
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Admin Dashboard</h2>
        <p className="text-text-secondary mt-1">System overview and management tools.</p>
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
        {/* Doctors Table */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <div className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-text-primary">Doctors</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-background">
                    <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase">Doctor</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase">Specialization</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorsList.slice(0, 6).map((doc) => (
                    <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <img src={doc.image} alt={doc.name} className="w-8 h-8 rounded-lg" />
                          <p className="text-sm font-medium text-text-primary">{doc.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-text-secondary">{doc.specialization}</td>
                      <td className="px-6 py-3">
                        <Badge variant={doc.isAvailable ? 'success' : 'default'} size="sm">
                          {doc.isAvailable ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Schedules Table */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <div className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-text-primary">Schedules</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-background">
                    <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase">Doctor</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase">Day</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase">Hours</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {schedulesList.slice(0, 6).map((sch) => (
                    <tr key={sch.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                      <td className="px-6 py-3 text-sm font-medium text-text-primary">{sch.doctorName}</td>
                      <td className="px-6 py-3 text-sm text-text-secondary">{sch.day}</td>
                      <td className="px-6 py-3 text-sm text-text-secondary">{sch.startTime} - {sch.endTime}</td>
                      <td className="px-6 py-3">
                        <Badge variant={sch.isActive ? 'success' : 'default'} size="sm">
                          {sch.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Appointments */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <div className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-text-primary">Recent Appointments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase">Patient</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase">Doctor</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase">Time</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">{apt.patientName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img src={apt.doctorImage} alt={apt.doctorName} className="w-6 h-6 rounded-lg" />
                        <span className="text-sm text-text-secondary">{apt.doctorName}</span>
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

export default AdminDashboard;
