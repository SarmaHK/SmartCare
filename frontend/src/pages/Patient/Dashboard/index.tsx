import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Activity, ArrowRight, FileText } from 'lucide-react';
import { mockAppointments, mockDoctors } from '../../../mock';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';

const PatientDashboard: React.FC = () => {
  const patientId = 'p1'; // Mock patient ID
  const myAppointments = mockAppointments.filter(app => app.patientId === patientId);
  const upcoming = myAppointments.filter(app => app.status === 'upcoming').slice(0, 3);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, John!</h2>
          <p className="text-gray-500 mt-1">Here is a summary of your appointments and health activity.</p>
        </div>
        <Link to="/patient/book">
          <Button leftIcon={<Calendar className="w-4 h-4" />}>
            Book Appointment
          </Button>
        </Link>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center">
          <div className="p-4 bg-primary-50 rounded-lg text-primary mr-4">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Upcoming Appointments</p>
            <p className="text-2xl font-bold text-gray-900">{upcoming.length}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center">
          <div className="p-4 bg-emerald-50 rounded-lg text-emerald-600 mr-4">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Appointments</p>
            <p className="text-2xl font-bold text-gray-900">{myAppointments.length}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center">
          <div className="p-4 bg-amber-50 rounded-lg text-amber-600 mr-4">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Health Profile</p>
            <p className="text-2xl font-bold text-gray-900">95% Complete</p>
          </div>
        </Card>
      </div>

      {/* Tables & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments Table */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <Link to="/patient/appointments" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="py-3 px-6 font-medium">Doctor</th>
                  <th className="py-3 px-6 font-medium">Date & Time</th>
                  <th className="py-3 px-6 font-medium">Type</th>
                  <th className="py-3 px-6 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcoming.map(app => {
                  const doctor = mockDoctors.find(d => d.id === app.doctorId);
                  return (
                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={doctor?.image} alt={doctor?.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-gray-900">{doctor?.name}</p>
                            <p className="text-xs text-gray-500">{doctor?.specialization}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900">{app.date}</p>
                        <p className="text-xs text-gray-500">{app.time}</p>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 capitalize">
                        Consultation
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Badge variant="info" className="bg-sky-100 text-sky-700">Upcoming</Badge>
                      </td>
                    </tr>
                  );
                })}
                {upcoming.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No upcoming appointments.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/patient/book" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary-50/50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Book New</p>
                  <p className="text-xs text-gray-500">Schedule an appointment</p>
                </div>
              </Link>
              <Link to="/patient/profile" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary-50/50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Update Profile</p>
                  <p className="text-xs text-gray-500">Manage medical records</p>
                </div>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Appointment Completed</p>
                  <p className="text-xs text-gray-500 mt-1">Dr. Sarah Jenkins - General Practice</p>
                  <p className="text-xs text-gray-400 mt-0.5">2 days ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Appointment Scheduled</p>
                  <p className="text-xs text-gray-500 mt-1">Dr. Michael Chen - Cardiology</p>
                  <p className="text-xs text-gray-400 mt-0.5">1 week ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
