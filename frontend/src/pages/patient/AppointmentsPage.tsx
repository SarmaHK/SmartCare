import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { TableSkeleton } from '../../components/common/Skeleton';
import { appointmentService, type Appointment } from '../../services/appointment.service';
import { AppointmentTable } from './components/AppointmentTable';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { toast } from 'react-hot-toast';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setIsLoading(true);
    try {
      const response = await appointmentService.getMyAppointments();
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancelClick = (id: number) => {
    setSelectedAppointmentId(id);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointmentId) return;
    setIsProcessing(true);
    try {
      const response = await appointmentService.cancelAppointment(
        selectedAppointmentId,
        'Cancelled by patient'
      );
      if (response.success) {
        toast.success('Appointment cancelled successfully');
        setCancelModalOpen(false);
        fetchAppointments();
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to cancel appointment';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Appointments"
        description="View and manage your upcoming and past medical appointments."
      />

      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <AppointmentTable appointments={appointments} onView={handleCancelClick} />
      )}

      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        onConfirm={confirmCancel}
        onCancel={() => setCancelModalOpen(false)}
        isLoading={isProcessing}
        confirmText="Yes, Cancel"
        isDestructive
      />
    </div>
  );
};
