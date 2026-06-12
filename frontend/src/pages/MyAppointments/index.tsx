import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useAppointmentStore } from '../../store/appointmentStore';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import { AppointmentCardSkeleton } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import DatePicker from '../../components/forms/DatePicker';
import toast from 'react-hot-toast';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const MyAppointments: React.FC = () => {
  const { appointments, isLoading, fetchPatientAppointments, cancelAppointment, rescheduleAppointment } = useAppointmentStore();
  const [activeTab, setActiveTab] = useState('all');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');

  useEffect(() => { fetchPatientAppointments(); }, [fetchPatientAppointments]);

  const handleCancel = async () => {
    if (!cancelId) return;
    try { await cancelAppointment(cancelId); toast.success('Appointment cancelled'); }
    catch {}
    finally { setCancelId(null); }
  };

  const handleReschedule = async () => {
    if (!rescheduleId || !newDate) return;
    try {
      await rescheduleAppointment(rescheduleId, { date: newDate, start_time: '10:00:00' });
      toast.success('Appointment rescheduled');
      setRescheduleId(null); setNewDate('');
    } catch {}
  };

  const filtered = appointments.filter((a: any) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return a.status === 'PENDING' || a.status === 'CONFIRMED';
    if (activeTab === 'completed') return a.status === 'COMPLETED';
    if (activeTab === 'cancelled') return a.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Appointments</h2>
        <p className="text-[13px] text-slate-500 mt-0.5">Manage and track your appointments</p>
      </div>

      {/* Tabs — underline style */}
      <div className="border-b border-slate-200">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.value
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <AppointmentCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-5 h-5 text-slate-400" />}
          title="No appointments found"
          description={activeTab === 'all' ? "You don't have any appointments yet." : `No ${activeTab} appointments.`}
          actionLabel="Book Appointment"
          onAction={() => window.location.href = '/patient/book'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((a: any) => (
            <AppointmentCard key={a.id} appointment={a} onCancel={(id) => setCancelId(id)} onReschedule={(id) => setRescheduleId(id)} />
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      <Modal isOpen={!!cancelId} onClose={() => setCancelId(null)} title="Cancel Appointment" size="sm">
        <p className="text-[13px] text-slate-600 mb-5">Are you sure? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCancelId(null)} fullWidth>Keep</Button>
          <Button variant="danger" onClick={handleCancel} fullWidth>Cancel Appointment</Button>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal isOpen={!!rescheduleId} onClose={() => { setRescheduleId(null); setNewDate(''); }} title="Reschedule Appointment">
        <p className="text-[13px] text-slate-600 mb-4">Select a new date.</p>
        <DatePicker selectedDate={newDate} onSelect={setNewDate} />
        <div className="flex gap-3 mt-5">
          <Button variant="outline" onClick={() => { setRescheduleId(null); setNewDate(''); }} fullWidth>Cancel</Button>
          <Button onClick={handleReschedule} disabled={!newDate} fullWidth>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyAppointments;
