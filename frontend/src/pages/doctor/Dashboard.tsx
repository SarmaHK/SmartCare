import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/cards/Card';
import { StatsCard } from '../../components/cards/StatsCard';
import { Button } from '../../components/common/Button';
import { DashboardSkeleton } from '../../components/common/Skeleton';
import { Clock, Plus, Activity, CheckCircle, Users, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService, type Appointment } from '../../services/appointment.service';
import { slotService, type Slot } from '../../services/slot.service';
import { DoctorAppointmentTable } from './components/DoctorAppointmentTable';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [aptRes, slotRes] = await Promise.all([
        appointmentService.getDoctorAppointments({ limit: 100 }),
        slotService.getMySlots(),
      ]);

      if (aptRes.success) setAppointments(aptRes.data.appointments);
      if (slotRes.success) setSlots(slotRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  }

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
  );
  const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED');
  const availableSlots = slots.filter((s) => s.isAvailable);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, Dr. ${user?.fullName?.split(' ')[0]}`}
        description="Manage your schedule, appointments, and patient consultations."
        action={
          <Button
            onClick={() => navigate('/doctor/slots/create')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create Slot
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Upcoming Patients"
          value={upcomingAppointments.length}
          icon={<Users className="h-6 w-6" />}
          iconClassName="bg-primary-50 text-primary-600"
        />
        <StatsCard
          title="Completed"
          value={completedAppointments.length}
          icon={<CheckCircle className="h-6 w-6" />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatsCard
          title="Available Slots"
          value={availableSlots.length}
          icon={<Clock className="h-6 w-6" />}
          iconClassName="bg-sky-50 text-sky-600"
        />
        <StatsCard
          title="Total Slots"
          value={slots.length}
          icon={<Activity className="h-6 w-6" />}
          iconClassName="bg-secondary-100 text-secondary-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900">Upcoming Appointments</h2>
            <button
              type="button"
              onClick={() => navigate('/doctor/appointments')}
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <DoctorAppointmentTable appointments={upcomingAppointments.slice(0, 5)} />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Manage Slots', icon: Clock, path: '/doctor/slots' },
                { label: 'All Appointments', icon: Calendar, path: '/doctor/appointments' },
                { label: 'Update Profile', icon: Users, path: '/doctor/profile' },
              ].map(({ label, icon: Icon, path }) => (
                <Button
                  key={path}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(path)}
                  leftIcon={<Icon className="h-4 w-4" />}
                >
                  {label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
