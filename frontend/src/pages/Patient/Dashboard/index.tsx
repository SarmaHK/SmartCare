import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MoreVertical, ChevronDown, Activity } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useDashboardStore } from '../../../store/dashboardStore';
import { useAppointmentStore } from '../../../store/appointmentStore';

const PatientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchPatientStats, isLoading: statsLoading } = useDashboardStore();
  const { appointments, fetchPatientAppointments, isLoading: appsLoading } = useAppointmentStore();

  useEffect(() => {
    fetchPatientStats();
    fetchPatientAppointments();
  }, [fetchPatientStats, fetchPatientAppointments]);

  const upcoming = appointments.filter(
    (app: any) => app.status === 'PENDING' || app.status === 'CONFIRMED'
  ).slice(0, 5);

  if (statsLoading || appsLoading) {
    return <div className="flex items-center justify-center h-64 text-sm text-slate-400">Loading dashboard...</div>;
  }

  // Helper for a simple radial chart SVG
  const RadialChart = ({ percentage, label, subLabel }: { percentage: number, label: string, subLabel: string }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="none" />
            <circle
              cx="40" cy="40" r={radius} stroke="#4f46e5" strokeWidth="8" fill="none"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[15px] font-bold text-slate-800">{percentage}%</span>
          </div>
        </div>
        <p className="text-[12px] font-medium text-slate-600 mt-2 text-center leading-tight max-w-[60px]">{label}</p>
        <p className="text-[10px] text-slate-400 text-center">{subLabel}</p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Left/Main Column (spans 8 cols) */}
      <div className="xl:col-span-8 flex flex-col gap-8">
        
        {/* Banner */}
        <div className="bg-white rounded-3xl p-8 flex justify-between items-center relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-[60%]">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Hello {user?.name?.split(' ')[0] || 'User'}!</h1>
            <p className="text-[14px] text-slate-600 mb-6 leading-relaxed">
              You have {upcoming.length} upcoming appointments.<br/>
              It is a lot of work for today! So let's start!
            </p>
            <Link to="/patient/appointments" className="text-[13px] text-blue-600 font-semibold underline hover:text-blue-800">
              review it
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 h-full w-[50%] flex items-end justify-end">
            <img src="/images/dashboard-banner.png" alt="Dashboard Illustration" className="h-[120%] object-contain origin-bottom-right translate-y-4" />
          </div>
        </div>

        {/* Middle Row: Performance & Visit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Performance Chart */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-slate-800">Performance</h2>
              <button className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-200/50 px-3 py-1.5 rounded-full">
                December <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm flex-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[13px] font-semibold text-slate-800 mb-1">Health Score:</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-slate-900">95.4</span>
                    <span className="text-[10px] text-slate-400 max-w-[80px] leading-tight mb-1">Overall health assessment</span>
                  </div>
                </div>
                <button className="border border-slate-200 rounded-full px-4 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">
                  All metrics
                </button>
              </div>

              {/* Fake Bar Chart */}
              <div className="flex items-end justify-between h-32 mt-4 px-2">
                {[
                  { val: 85.3, h: 'h-[60%]', lbl: 'BP' },
                  { val: 64.7, h: 'h-[40%]', lbl: 'Sugar' },
                  { val: 84.2, h: 'h-[55%]', lbl: 'Heart' },
                  { val: 45.6, h: 'h-[30%]', lbl: 'Weight' },
                  { val: 43.5, h: 'h-[28%]', lbl: 'Sleep' },
                  { val: 74.4, h: 'h-[50%]', lbl: 'Diet' }
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700">{bar.val}</span>
                    <div className="w-8 h-32 bg-slate-100 rounded-t-md flex items-end overflow-hidden">
                      <div className={`w-full ${bar.h} bg-[#4f46e5] rounded-t-md transition-all`}></div>
                    </div>
                    <span className="text-[9px] text-slate-500">{bar.lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* My Visit Radial Charts */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-slate-800">My visit</h2>
              <button className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-200/50 px-3 py-1.5 rounded-full">
                December <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm flex-1 grid grid-cols-2 gap-y-6">
              <RadialChart percentage={92} label="Attendance" subLabel="records" />
              <RadialChart percentage={83} label="Checkups" subLabel="routine" />
              <RadialChart percentage={78} label="Vitals" subLabel="logged" />
              <RadialChart percentage={97} label="Prescripts" subLabel="active" />
            </div>
          </div>
        </div>

        {/* Linked Doctors */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-[16px] font-bold text-slate-800">Linked Doctors</h2>
            <button className="text-[13px] font-semibold text-blue-600 hover:underline">See all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mocked Doctor Cards matching design */}
            <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                  <img src="https://i.pravatar.cc/150?img=32" alt="Doctor" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-800">Dr. Mary Johnson</p>
                  <p className="text-[11px] text-slate-500">Cardiology</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-slate-400 hover:text-blue-600"><Mail className="w-4 h-4" /></button>
                <button className="text-slate-400 hover:text-blue-600"><Phone className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Doctor" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-800">Dr. James Brown</p>
                  <p className="text-[11px] text-slate-500">General Practice</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-slate-400 hover:text-blue-600"><Mail className="w-4 h-4" /></button>
                <button className="text-slate-400 hover:text-blue-600"><Phone className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Calendar Sidebar) */}
      <div className="xl:col-span-4 flex flex-col gap-8">
        
        {/* Calendar Timeline */}
        <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[16px] font-bold text-slate-800">Calendar</h2>
              <p className="text-[11px] text-slate-400">{upcoming.length} events today</p>
            </div>
            <button className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              Today <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Timeline View */}
          <div className="flex-1 relative pb-4">
            <div className="absolute left-[39px] top-4 bottom-4 w-px bg-slate-200 border-l-2 border-dashed border-slate-200"></div>
            
            <div className="space-y-6 relative z-10">
              {upcoming.length > 0 ? upcoming.map((app: any, idx: number) => {
                const isActive = idx === 0; // Highlight first as active
                return (
                  <div key={app.id} className="flex gap-4 items-start">
                    <span className="text-[11px] font-bold text-slate-500 pt-3 w-8 text-right flex-shrink-0">
                      {app.start_time.substring(0,5)}
                    </span>
                    <div className={`flex-1 rounded-2xl p-4 flex gap-3 shadow-sm transition-colors ${
                      isActive ? 'bg-[#4f46e5] text-white' : 'bg-slate-50 text-slate-800'
                    }`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-white/20' : 'bg-slate-200 text-slate-500'
                      }`}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-[13px] font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                          Dr. {app.doctor_name || 'Doctor'}
                        </p>
                        <p className={`text-[11px] mt-0.5 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                          {app.start_time.substring(0,5)} - {app.end_time.substring(0,5)}, ID: {app.id.substring(0,4)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className="text-center py-10 text-[13px] text-slate-400">No appointments today.</div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[14px] font-bold text-slate-800">Upcoming events</h2>
              <button className="text-[11px] font-semibold text-blue-600 hover:underline">See all</button>
            </div>
            <div className="space-y-3">
              {/* Fake events to match design */}
              <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=100&q=80" alt="event" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-slate-800 leading-tight">Annual Health Checkup Event coming soon in...</p>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> 14 December 2023 &nbsp; 12:00 pm
                  </p>
                </div>
                <button className="text-slate-400"><MoreVertical className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
