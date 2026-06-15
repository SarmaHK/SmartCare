import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/cards/Card';
import { appointmentService, type Appointment } from '../../services/appointment.service';
import { StatusUpdateDropdown } from './components/StatusUpdateDropdown';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';
import { ArrowLeft, User, Phone, Mail, Droplet, Clock, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchAppointmentDetails(id);
  }, [id]);

  async function fetchAppointmentDetails(aptId: string) {
    try {
      const response = await appointmentService.getAppointmentById(aptId);
      if (response.success) {
        setAppointment(response.data);
      }
    } catch (error) {
      toast.error('Failed to load appointment details');
      navigate('/doctor/appointments');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (!appointment) return null;

  const patient = appointment.patient;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/doctor/appointments')}
          className="p-2 hover:bg-secondary-100 rounded-full transition-colors text-secondary-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader 
          title="Appointment Details" 
          description="Review patient information and update appointment status."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patient Profile & Notes */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 font-bold text-2xl">
                  {patient?.user?.fullName?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary-900">{patient?.user?.fullName || `Patient #${appointment.patientId}`}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-secondary-600">
                    <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {patient?.user?.phone || 'N/A'}</span>
                    <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {patient?.user?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-secondary-50 rounded-xl mb-6 text-sm">
                <div>
                  <p className="text-secondary-500 mb-1">Blood Group</p>
                  <p className="font-semibold text-secondary-900 flex items-center gap-1">
                    <Droplet className="w-4 h-4 text-red-500" />
                    {patient?.bloodGroup || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-secondary-500 mb-1">Gender</p>
                  <p className="font-semibold text-secondary-900">{patient?.gender || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-secondary-500 mb-1">Date of Birth</p>
                  <p className="font-semibold text-secondary-900">
                    {patient?.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MMMM d, yyyy') : 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-secondary-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-secondary-500" />
                  Medical History
                </h4>
                <p className="text-sm text-secondary-600 p-4 bg-white border border-secondary-200 rounded-lg whitespace-pre-wrap">
                  {patient?.medicalHistory || 'No medical history provided.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-secondary-600 whitespace-pre-wrap">
                {appointment.notes || 'No specific notes provided by the patient for this appointment.'}
              </p>
              {appointment.cancelReason && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-bold text-red-800 mb-1">Cancellation Reason:</p>
                  <p className="text-sm text-red-700">{appointment.cancelReason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status & Schedule */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Date</p>
                  <p className="font-bold text-secondary-900">{format(new Date(appointment.slot.slotDate), 'MMMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Time</p>
                  <p className="font-bold text-secondary-900">
                    {appointment.slot.startTime.substring(11, 16)} - {appointment.slot.endTime.substring(11, 16)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 flex justify-between items-center">
                <span className="text-sm font-medium text-secondary-700">Current Status:</span>
                <Badge variant={
                  appointment.status === 'CONFIRMED' ? 'success' :
                  appointment.status === 'PENDING' ? 'warning' :
                  appointment.status === 'CANCELLED' ? 'danger' : 'info'
                }>
                  {appointment.status}
                </Badge>
              </div>

              <div className="pt-4 border-t border-secondary-200">
                <StatusUpdateDropdown 
                  appointmentId={appointment.id}
                  currentStatus={appointment.status}
                  onStatusUpdated={() => fetchAppointmentDetails(id!)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
