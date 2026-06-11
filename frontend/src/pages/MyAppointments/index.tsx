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
import type { AppointmentStatus } from '../../types';
import toast from 'react-hot-toast';

const TABS: { label: string; value: AppointmentStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const MyAppointments: React.FC = () => {
  const {
    filteredAppointments, activeTab, isLoading,
    fetchAppointments, setActiveTab, cancelAppointment, rescheduleAppointment,
  } = useAppointmentStore();

  const [cancelId, setCancelId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = () => {
    if (cancelId) {
      cancelAppointment(cancelId);
      toast.success('Appointment cancelled successfully');
      setCancelId(null);
    }
  };

  const handleReschedule = () => {
    if (rescheduleId && newDate) {
      rescheduleAppointment(rescheduleId, newDate, '10:00 AM');
      toast.success('Appointment rescheduled successfully');
      setRescheduleId(null);
      setNewDate('');
    }
  };

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
        <div className="flex gap-1 bg-background rounded-xl p-1 mb-8 border border-border">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === tab.value
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
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
            onAction={() => window.location.href = '/book'}
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
          <p className="text-text-secondary text-sm mb-6">
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
          <p className="text-text-secondary text-sm mb-4">
            Select a new date for your appointment.
          </p>
          <DatePicker selectedDate={newDate} onSelect={setNewDate} daysCount={14} />
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
