import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../../store/dashboardStore';
import { useDoctorStore } from '../../store/doctorStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import StatsCard from '../../components/dashboard/StatsCard';
import Badge from '../../components/common/Badge';
import { PageLoader } from '../../components/common/Loader';
import { staggerContainer, fadeInUp } from '../../hooks/useAnimations';

const AdminDashboard: React.FC = () => {
  const { stats, fetchAdminStats, isLoading: statsLoading } = useDashboardStore();
  const { doctors, fetchDoctors, isLoading: docsLoading } = useDoctorStore();
  const { appointments, fetchAllAppointments, isLoading: appsLoading } = useAppointmentStore();

  useEffect(() => {
    fetchAdminStats();
    fetchDoctors();
    fetchAllAppointments();
  }, [fetchAdminStats, fetchDoctors, fetchAllAppointments]);

  if (statsLoading) return <PageLoader />;

  const statsCards = stats ? [
    { label: 'Total Doctors', value: stats.totalDoctors || 0, icon: 'Stethoscope', color: '#0EA5E9', trend: 10 },
    { label: 'Total Patients', value: stats.totalPatients || 0, icon: 'Users', color: '#22C55E', trend: 18 },
    { label: 'Total Appointments', value: stats.totalAppointments || 0, icon: 'CalendarCheck', color: '#8B5CF6', trend: 12 },
    { label: 'Pending Appointments', value: stats.pendingAppointments || 0, icon: 'Clock', color: '#F59E0B', trend: 5 },
  ] : [];

  return (
    <div>
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-500 mt-1">System overview and management tools.</p>
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
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Doctors</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Specialization</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {!docsLoading && doctors.slice(0, 6).map((doc: any) => (
                    <tr key={doc.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium text-gray-900">{doc.user_id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">{doc.specialization}</td>
                      <td className="px-6 py-3">
                        <Badge variant="success" size="sm">Active</Badge>
                      </td>
                    </tr>
                  ))}
                  {docsLoading && <tr><td colSpan={3} className="p-4 text-center text-gray-500">Loading...</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Recent Appointments */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Recent Appointments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {!appsLoading && appointments.slice(0, 6).map((apt: any) => (
                    <tr key={apt.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{apt.patient_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{apt.doctor_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(apt.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant="info" size="sm">{apt.status}</Badge>
                      </td>
                    </tr>
                  ))}
                  {appsLoading && <tr><td colSpan={4} className="p-4 text-center text-gray-500">Loading...</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
