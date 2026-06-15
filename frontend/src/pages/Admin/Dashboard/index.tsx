import React, { useEffect } from 'react';
import { useDashboardStore } from '../../../store/dashboardStore';
import { useDoctorStore } from '../../../store/doctorStore';
import { useAppointmentStore } from '../../../store/appointmentStore';
import { useAuthStore } from '../../../store/authStore';
import { Stethoscope, Users, CalendarCheck, Clock, CheckCircle2, XCircle, ChevronDown, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { stats, fetchAdminStats, isLoading: statsLoading } = useDashboardStore();
  const { doctors, fetchDoctors, isLoading: docsLoading } = useDoctorStore();
  const { appointments, fetchAllAppointments, isLoading: appsLoading } = useAppointmentStore();

  useEffect(() => {
    fetchAdminStats();
    fetchDoctors();
    fetchAllAppointments();
  }, [fetchAdminStats, fetchDoctors, fetchAllAppointments]);

  if (statsLoading || docsLoading || appsLoading) {
    return <div className="flex items-center justify-center h-64 text-sm text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
      
      {/* Left/Main Column (spans 8 cols) */}
      <div className="xl:col-span-8 flex flex-col gap-10">
        
        {/* Banner */}
        <div className="bg-white rounded-3xl p-10 flex justify-between items-center relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-[60%]">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome, {user?.name?.split(' ')[0] || 'Admin'}!</h1>
            <p className="text-[15px] text-slate-600 mb-8 leading-relaxed">
              The system is running smoothly. There are {stats?.pendingAppointments || 0} appointments awaiting action.<br/>
              Here's your high-level overview.
            </p>
            <Link to="/admin/appointments" className="text-[14px] text-[#4f46e5] font-semibold underline hover:text-[#3730a3]">
              Review appointments
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 h-full w-[50%] flex items-end justify-end">
            <img src="/images/admin-banner.png" alt="Admin Illustration" className="h-[120%] object-contain origin-bottom-right translate-y-4" />
          </div>
        </div>

        {/* KPI Row (Now a beautifully spaced 2x2 grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {[
            { label: 'Total Doctors', value: stats?.totalDoctors || 0, icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Patients', value: stats?.totalPatients || 0, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Appointments', value: stats?.totalAppointments || 0, icon: CalendarCheck, color: 'text-[#4f46e5]', bg: 'bg-indigo-50' },
            { label: 'Pending', value: stats?.pendingAppointments || 0, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-3xl p-8 shadow-sm flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-slate-500 mb-1">{item.label}</p>
                <p className="text-4xl font-black text-slate-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Appointments Table */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-[16px] font-bold text-slate-800">Recent Appointments</h3>
            <button className="text-[13px] font-semibold text-[#4f46e5] hover:underline">See all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((apt: any) => (
                  <tr key={apt.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <p className="text-[14px] font-bold text-slate-800">Patient #{apt.patient_id}</p>
                    </td>
                    <td className="px-8 py-4 text-[13px] font-medium text-slate-600">
                      {new Date(apt.date).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                        ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : ''}
                        ${apt.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : ''}
                        ${apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : ''}
                        ${apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : ''}
                      `}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right text-slate-400 hover:text-[#4f46e5] cursor-pointer">
                      <MoreVertical className="w-4 h-4 inline-block" />
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr><td colSpan={4} className="px-8 py-10 text-center text-sm text-slate-400">No appointments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column (Sidebar equivalent) */}
      <div className="xl:col-span-4 flex flex-col gap-8">
        
        {/* Active Doctors List */}
        <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[16px] font-bold text-slate-800">Top Doctors</h2>
              <p className="text-[11px] text-slate-400">{doctors.length} doctors total</p>
            </div>
            <button className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200">
              Active <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {doctors.slice(0, 5).map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                    {/* Mock avatars */}
                    <img src={`https://i.pravatar.cc/150?img=${doc.id + 10}`} alt="Doctor" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800">Doctor #{doc.user_id}</p>
                    <p className="text-[11px] text-slate-500">{doc.specialization}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
              </div>
            ))}
            {doctors.length === 0 && (
              <div className="text-center py-6 text-[13px] text-slate-400">No doctors available.</div>
            )}
          </div>
          
          <Link to="/admin/doctors" className="mt-6 w-full py-3 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-600 text-center hover:bg-slate-50 transition-colors">
            Manage All Doctors
          </Link>
        </div>

        {/* System Alerts */}
        <div className="bg-[#4f46e5] rounded-3xl p-6 shadow-sm flex flex-col text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <h2 className="text-[16px] font-bold mb-1">System Status</h2>
            <p className="text-[12px] text-white/80 mb-6">All systems operational</p>

            <div className="space-y-3">
              <div className="bg-white/10 rounded-xl p-3 flex items-start gap-3 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-green-400/20 text-green-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[13px] font-bold">Database Backup</p>
                  <p className="text-[11px] text-white/70">Completed 2 hours ago</p>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-3 flex items-start gap-3 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-red-400/20 text-red-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[13px] font-bold">Failed Login Attempts</p>
                  <p className="text-[11px] text-white/70">3 alerts from unknown IP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
