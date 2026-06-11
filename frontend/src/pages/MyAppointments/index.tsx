import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useAppointmentStore } from '../../store/appointmentStore';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import { AppointmentCardSkeleton } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import DatePicker from '../../components/forms/DatePicker';
import { staggerContainer } from '../../hooks/useAnimations';
import { cn } from '../../utils/formatters';
import toast from 'react-hot-toast';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const MyAppointments: React.FC = () => {
  const {
    appointments, isLoading,
    fetchPatientAppointments, cancelAppointment, rescheduleAppointment,
  } = useAppointmentStore();

  const [activeTab, setActiveTab] = useState('all');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    fetchPatientAppointments();
  }, [fetchPatientAppointments]);

  const handleCancel = async () => {
    if (cancelId) {
      try {
        await cancelAppointment(cancelId);
        toast.success('Appointment cancelled successfully');
      } catch (error) {
        // Error already handled in store via toast (in real app) or logged
      } finally {
        setCancelId(null);
      }
    }
  };

  const handleReschedule = async () => {
    if (rescheduleId && newDate) {
      try {
        await rescheduleAppointment(rescheduleId, { date: newDate, start_time: '10:00:00' });
        toast.success('Appointment rescheduled successfully');
        setRescheduleId(null);
        setNewDate('');
      } catch (error) {
        // Handled in store
      }
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(app => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return app.status === 'PENDING' || app.status === 'CONFIRMED';
    if (activeTab === 'completed') return app.status === 'COMPLETED';
    if (activeTab === 'cancelled') return app.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-500 mt-1">Manage and track your healthcare appointments.</p>
        </div>
      </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-8 border border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === tab.value
                  ? 'bg-gray-100 text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Appointments */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <AppointmentCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-8 h-8 text-primary" />}
            title="No appointments found"
            description={
              activeTab === 'all'
                ? "You don't have any appointments yet. Book your first appointment to get started."
                : `No ${activeTab} appointments.`
            }
            actionLabel="Book Appointment"
            onAction={() => window.location.href = '/patient/book'}
          />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={(id) => setCancelId(id)}
                onReschedule={(id) => setRescheduleId(id)}
              />
            ))}
          </motion.div>
        )}

        {/* Cancel Modal */}
        <Modal
          isOpen={!!cancelId}
          onClose={() => setCancelId(null)}
          title="Cancel Appointment"
          size="sm"
        >
          <p className="text-gray-500 text-sm mb-6">
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCancelId(null)} fullWidth>
              Keep Appointment
            </Button>
            <Button variant="danger" onClick={handleCancel} fullWidth>
              Cancel Appointment
            </Button>
          </div>
        </Modal>

        {/* Reschedule Modal */}
        <Modal
          isOpen={!!rescheduleId}
          onClose={() => { setRescheduleId(null); setNewDate(''); }}
          title="Reschedule Appointment"
        >
          <p className="text-gray-500 text-sm mb-4">
            Select a new date for your appointment.
          </p>
          <DatePicker selectedDate={newDate} onSelect={setNewDate} />
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => { setRescheduleId(null); setNewDate(''); }} fullWidth>
              Cancel
            </Button>
            <Button onClick={handleReschedule} disabled={!newDate} fullWidth>
              Confirm Reschedule
            </Button>
          </div>
        </Modal>
    </div>
  );
};

export default MyAppointments;
