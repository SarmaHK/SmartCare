import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useDoctorStore } from '../../store/doctorStore';
import { useScheduleStore } from '../../store/scheduleStore';
import BookingSteps from '../../components/forms/BookingSteps';
import DatePicker from '../../components/forms/DatePicker';
import TimeSlotPicker from '../../components/forms/TimeSlotPicker';
import BookingForm from '../../components/forms/BookingForm';
import Button from '../../components/common/Button';
import { formatDate, formatCurrency, getInitials } from '../../utils/formatters';
import type { BookingFormData } from '../../utils/validators';
import toast from 'react-hot-toast';

const BookAppointment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doctors, fetchDoctors } = useDoctorStore();
  const { bookAppointment, isLoading } = useAppointmentStore();
  const { availableSlots, fetchAvailableSlots } = useScheduleStore();

  const [currentStep, setCurrentStep] = useState<any>(1);
  const [bookingData, setBookingData] = useState<any>({});
  const [isBookingComplete, setIsBookingComplete] = useState(false);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  useEffect(() => {
    const doctorId = searchParams.get('doctor');
    if (doctorId && doctors.length > 0) {
      const doc = doctors.find((d: any) => d.id === doctorId || d.user_id === doctorId);
      if (doc) {
        setBookingData((p: any) => ({ ...p, doctorId: doc.id, doctor: doc }));
        if (currentStep === 1) setCurrentStep(2);
      }
    }
  }, [searchParams, doctors, currentStep]);

  useEffect(() => {
    if (bookingData.doctorId && bookingData.date) {
      fetchAvailableSlots(bookingData.doctorId, bookingData.date);
    }
  }, [bookingData.doctorId, bookingData.date, fetchAvailableSlots]);

  const selectedDoctor = bookingData.doctor || doctors.find((d: any) => d.id === bookingData.doctorId);
  const next = () => setCurrentStep((p: number) => Math.min(p + 1, 6));
  const prev = () => setCurrentStep((p: number) => Math.max(p - 1, 1));

  const handleConfirm = async () => {
    try {
      const [start_time] = bookingData.time.split(' - ');
      const end_time = new Date(new Date(`2000-01-01T${start_time}`).getTime() + 30 * 60000).toTimeString().substring(0, 5);
      await bookAppointment({ doctor_id: bookingData.doctorId, date: bookingData.date, start_time, end_time, reason: bookingData.notes || 'Consultation' });
      toast.success('Appointment booked!');
      setIsBookingComplete(true);
      setCurrentStep(6);
    } catch (e: any) { toast.error(e.message || 'Booking failed'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Book an Appointment</h2>
        <p className="text-[13px] text-slate-500 mt-0.5">Follow the steps to schedule your appointment</p>
      </div>

      <BookingSteps currentStep={currentStep} />

      <div className="bg-white border border-slate-200 rounded-[4px] shadow-sm p-6">
        {/* Step 1 — Doctor */}
        {currentStep === 1 && (
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Select a Doctor</h3>
            <p className="text-[13px] text-slate-500 mb-5">Choose your preferred healthcare professional.</p>
            <div className="grid sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto">
              {doctors.map((doc: any) => (
                <button key={doc.id} onClick={() => { setBookingData((p: any) => ({ ...p, doctorId: doc.id, doctor: doc })); next(); }}
                  className={`text-left p-4 rounded-[4px] border transition-colors hover:bg-slate-50 ${
                    bookingData.doctorId === doc.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-white">{getInitials(doc.user_id || 'DR')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-slate-800 truncate">{doc.user_id}</p>
                      <p className="text-[12px] text-blue-600">{doc.specialization}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[11px] font-medium text-slate-600">5.0</span>
                        <span className="text-[11px] text-slate-400">· {formatCurrency(doc.consultation_fee)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Date */}
        {currentStep === 2 && (
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Select a Date</h3>
            <p className="text-[13px] text-slate-500 mb-5">Choose your preferred appointment date.</p>
            {selectedDoctor && (
              <div className="flex items-center gap-3 p-3 rounded-[3px] bg-slate-50 border border-slate-200 mb-5">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">{getInitials(selectedDoctor.user_id || 'DR')}</span>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-slate-800">{selectedDoctor.user_id}</p>
                  <p className="text-[11px] text-slate-500">{selectedDoctor.specialization}</p>
                </div>
              </div>
            )}
            <DatePicker selectedDate={bookingData.date} onSelect={(d) => setBookingData((p: any) => ({ ...p, date: d, time: '' }))} />
            <div className="flex gap-3 mt-5">
              <Button variant="outline" onClick={prev} fullWidth>Back</Button>
              <Button onClick={next} disabled={!bookingData.date} fullWidth>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 3 — Time */}
        {currentStep === 3 && (
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Select a Time</h3>
            <p className="text-[13px] text-slate-500 mb-5">Available slots for {bookingData.date ? formatDate(bookingData.date) : 'selected date'}</p>
            <TimeSlotPicker
              slots={availableSlots.map((s: string) => {
                const end = new Date(new Date(`2000-01-01T${s}`).getTime() + 30 * 60000).toTimeString().substring(0, 5);
                return { time: `${s.substring(0, 5)} - ${end}`, isAvailable: true };
              })}
              selectedTime={bookingData.time}
              onSelect={(t) => setBookingData((p: any) => ({ ...p, time: t }))}
            />
            <div className="flex gap-3 mt-5">
              <Button variant="outline" onClick={prev} fullWidth>Back</Button>
              <Button onClick={next} disabled={!bookingData.time} fullWidth>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 4 — Patient Details */}
        {currentStep === 4 && (
          <BookingForm onSubmit={(data: BookingFormData) => { setBookingData((p: any) => ({ ...p, ...data })); next(); }} onBack={prev}
            defaultValues={{ patientName: bookingData.patientName, patientEmail: bookingData.patientEmail, patientPhone: bookingData.patientPhone, notes: bookingData.notes }} />
        )}

        {/* Step 5 — Summary */}
        {currentStep === 5 && selectedDoctor && (
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-5">Booking Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-[3px] bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{getInitials(selectedDoctor.user_id || 'DR')}</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">{selectedDoctor.user_id}</p>
                  <p className="text-[12px] text-blue-600">{selectedDoctor.specialization}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-[3px] bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mb-1"><Calendar className="w-3.5 h-3.5" />Date</div>
                  <p className="text-[13px] font-medium text-slate-800">{formatDate(bookingData.date)}</p>
                </div>
                <div className="p-3 rounded-[3px] bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mb-1"><Clock className="w-3.5 h-3.5" />Time</div>
                  <p className="text-[13px] font-medium text-slate-800">{bookingData.time}</p>
                </div>
              </div>

              <div className="p-3 rounded-[3px] border border-slate-200">
                <p className="text-[12px] text-slate-500 mb-2 font-medium">Patient Details</p>
                <div className="grid sm:grid-cols-2 gap-2 text-[13px]">
                  <div><span className="text-slate-500">Name:</span> <span className="font-medium text-slate-800">{bookingData.patientName}</span></div>
                  <div><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-800">{bookingData.patientEmail}</span></div>
                  <div><span className="text-slate-500">Phone:</span> <span className="font-medium text-slate-800">{bookingData.patientPhone}</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-[3px] bg-blue-50 border border-blue-200">
                <span className="text-[13px] font-medium text-slate-700">Consultation Fee</span>
                <span className="text-lg font-bold text-slate-900">{formatCurrency(selectedDoctor.consultation_fee)}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <Button variant="outline" onClick={prev} fullWidth disabled={isLoading}>Back</Button>
              <Button onClick={handleConfirm} fullWidth rightIcon={<ArrowRight className="w-4 h-4" />} isLoading={isLoading}>Confirm Booking</Button>
            </div>
          </div>
        )}

        {/* Step 6 — Confirmation */}
        {currentStep === 6 && isBookingComplete && selectedDoctor && (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Confirmed</h3>
            <p className="text-[13px] text-slate-500 mb-6">Your appointment has been successfully booked.</p>

            <div className="max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-[4px] p-5 text-left space-y-2.5 text-[13px]">
              <div className="flex justify-between"><span className="text-slate-500">Doctor</span><span className="font-medium text-slate-800">{selectedDoctor.user_id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-medium text-slate-800">{formatDate(bookingData.date)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-medium text-slate-800">{bookingData.time}</span></div>
              <div className="pt-2 border-t border-slate-200 flex justify-between"><span className="text-slate-500">Fee</span><span className="font-bold text-slate-900">{formatCurrency(selectedDoctor.consultation_fee)}</span></div>
            </div>

            <div className="flex gap-3 mt-6 max-w-sm mx-auto">
              <Button variant="outline" onClick={() => navigate('/patient/appointments')} fullWidth>View Appointments</Button>
              <Button onClick={() => navigate('/patient')} fullWidth>Dashboard</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
