import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/cards/Card';
import { StatsCard } from '../../components/cards/StatsCard';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { DashboardSkeleton } from '../../components/common/Skeleton';
import { Calendar, Clock, Plus, Activity, ArrowRight, User, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService, type Appointment } from '../../services/appointment.service';
import { AppointmentCard } from './components/AppointmentCard';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const response = await appointmentService.getMyAppointments();
      if (response.success) {
        setAppointments(response.data);
      }
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
  const nextAppointment = upcomingAppointments.sort(
    (a, b) => new Date(a.slot.slotDate).getTime() - new Date(b.slot.slotDate).getTime()
  )[0];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.fullName?.split(' ')[0]}`}
        description="Here's an overview of your upcoming appointments and health activity."
        action={
          <Button onClick={() => navigate('/patient/doctors')} leftIcon={<Plus className="h-4 w-4" />}>
            Book Appointment
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          icon={<Calendar className="h-6 w-6" />}
          iconClassName="bg-primary-50 text-primary-600"
        />
        <StatsCard
          title="Completed Visits"
          value={completedAppointments.length}
          icon={<Clock className="h-6 w-6" />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatsCard
          title="Total Appointments"
          value={appointments.length}
          icon={<Activity className="h-6 w-6" />}
          iconClassName="bg-sky-50 text-sky-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900">Next Appointment</h2>
            {nextAppointment && (
              <button
                type="button"
                onClick={() => navigate('/patient/appointments')}
                className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
          {nextAppointment ? (
            <AppointmentCard appointment={nextAppointment} />
          ) : (
            <EmptyState
              icon={<Calendar className="h-7 w-7" />}
              title="No upcoming appointments"
              description="Schedule a consultation with one of our qualified healthcare professionals."
              action={
                <Button onClick={() => navigate('/patient/doctors')} variant="outline">
                  Find a Doctor
                </Button>
              }
            />
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Find Doctors', icon: Stethoscope, path: '/patient/doctors' },
                { label: 'My Appointments', icon: Calendar, path: '/patient/appointments' },
                { label: 'Update Profile', icon: User, path: '/patient/profile' },
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

          <Card className="border-primary-100 bg-primary-50/30">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-primary-800">Need medical advice?</p>
              <p className="mt-1 text-xs text-primary-600/80">
                Browse our directory of specialists and book a consultation online.
              </p>
              <Button
                size="sm"
                className="mt-4 w-full"
                onClick={() => navigate('/patient/doctors')}
              >
                Browse Doctors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
