import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useDoctorStore } from '../../store/doctorStore';
import { useScheduleStore } from '../../store/scheduleStore';
import BookingSteps from '../../components/forms/BookingSteps';
import DatePicker from '../../components/forms/DatePicker';
import TimeSlotPicker from '../../components/forms/TimeSlotPicker';
import BookingForm from '../../components/forms/BookingForm';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { fadeInUp, scaleIn } from '../../hooks/useAnimations';
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

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Auto-select doctor from URL param
  useEffect(() => {
    const doctorId = searchParams.get('doctor');
    if (doctorId && doctors.length > 0) {
      const doc = doctors.find((d: any) => d.id === doctorId || d.user_id === doctorId);
      if (doc) {
        setBookingData((prev: any) => ({ ...prev, doctorId: doc.id, doctor: doc }));
        if (currentStep === 1) setCurrentStep(2);
      }
    }
  }, [searchParams, doctors, currentStep]);

  // Fetch slots when date and doctor are selected
  useEffect(() => {
    if (bookingData.doctorId && bookingData.date) {
      fetchAvailableSlots(bookingData.doctorId, bookingData.date);
    }
  }, [bookingData.doctorId, bookingData.date, fetchAvailableSlots]);

  const selectedDoctor = bookingData.doctor || doctors.find((d: any) => d.id === bookingData.doctorId);

  const nextStep = () => setCurrentStep((prev: number) => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep((prev: number) => Math.max(prev - 1, 1));
  const resetBooking = () => {
    setCurrentStep(1);
    setBookingData({});
    setIsBookingComplete(false);
  };

  const handleDoctorSelect = (doctor: any) => {
    setBookingData((prev: any) => ({ ...prev, doctorId: doctor.id, doctor }));
    nextStep();
  };

  const handleDateSelect = (date: string) => {
    setBookingData((prev: any) => ({ ...prev, date, time: '' }));
  };

  const handleTimeSelect = (time: string) => {
    setBookingData((prev: any) => ({ ...prev, time }));
  };

  const handleFormSubmit = (data: BookingFormData) => {
    setBookingData((prev: any) => ({
      ...prev,
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      patientPhone: data.patientPhone,
      notes: data.notes || '',
    }));
    nextStep();
  };

  const handleConfirm = async () => {
    try {
      // Assuming times are in "HH:MM" format
      const [start_time] = bookingData.time.split(' - ');
      // Let's assume slots are 30 mins
      const end_time = new Date(new Date(`2000-01-01T${start_time}`).getTime() + 30 * 60000).toTimeString().substring(0, 5);

      await bookAppointment({
        doctor_id: bookingData.doctorId,
        date: bookingData.date,
        start_time,
        end_time,
        reason: bookingData.notes || 'Consultation'
      });
      toast.success('Appointment booked successfully!');
      setIsBookingComplete(true);
      setCurrentStep(6);
    } catch (error: any) {
      toast.error(error.message || 'Failed to book appointment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Book an Appointment</h2>
        <p className="text-gray-500">Follow the steps below to schedule your appointment.</p>
      </div>

        {/* Steps */}
        <BookingSteps currentStep={currentStep} />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            className="mt-6"
          >
            <Card className="p-6">
              {/* Step 1 — Select Doctor */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Doctor</h3>
                  <p className="text-gray-500 text-sm mb-6">Choose your preferred healthcare professional.</p>
                  <div className="grid sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {doctors.map((doctor: any) => (
                      <button
                        key={doctor.id}
                        onClick={() => handleDoctorSelect(doctor)}
                        className={`text-left p-4 rounded-xl border-2 transition-all duration-200 hover:border-primary hover:shadow-md ${
                          bookingData.doctorId === doctor.id
                            ? 'border-primary bg-primary-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                             <User className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{doctor.user_id}</p>
                            <p className="text-primary text-xs">{doctor.specialization}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-medium">5.0</span>
                              <span className="text-xs text-gray-500">• {formatCurrency(doctor.consultation_fee)}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 — Select Date */}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Date</h3>
                  <p className="text-gray-500 text-sm mb-6">Choose your preferred appointment date.</p>
                  {selectedDoctor && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{selectedDoctor.user_id}</p>
                        <p className="text-primary text-xs">{selectedDoctor.specialization}</p>
                      </div>
                    </div>
                  )}
                  <DatePicker selectedDate={bookingData.date} onSelect={handleDateSelect} />
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={prevStep} fullWidth>Back</Button>
                    <Button onClick={nextStep} disabled={!bookingData.date} fullWidth>
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3 — Select Time */}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Time</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Available slots for {bookingData.date ? formatDate(bookingData.date) : 'selected date'}
                  </p>
                  
                  {/* Map strings like "09:00:00" to "09:00 - 09:30" format that TimeSlotPicker expects */}
                  <TimeSlotPicker
                    slots={availableSlots.map((s: string) => {
                      const end = new Date(new Date(`2000-01-01T${s}`).getTime() + 30 * 60000).toTimeString().substring(0, 5);
                      return {
                        time: `${s.substring(0,5)} - ${end}`,
                        isAvailable: true
                      };
                    })}
                    selectedTime={bookingData.time}
                    onSelect={handleTimeSelect}
                  />
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={prevStep} fullWidth>Back</Button>
                    <Button onClick={nextStep} disabled={!bookingData.time} fullWidth>
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4 — Patient Details */}
              {currentStep === 4 && (
                <BookingForm
                  onSubmit={handleFormSubmit}
                  onBack={prevStep}
                  defaultValues={{
                    patientName: bookingData.patientName,
                    patientEmail: bookingData.patientEmail,
                    patientPhone: bookingData.patientPhone,
                    notes: bookingData.notes,
                  }}
                />
              )}

              {/* Step 5 — Summary */}
              {currentStep === 5 && selectedDoctor && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Summary</h3>
                  <div className="space-y-4">
                    {/* Doctor */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200">
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                          <User className="w-7 h-7 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedDoctor.user_id}</p>
                        <p className="text-primary text-sm">{selectedDoctor.specialization}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                          <Calendar className="w-4 h-4" />
                          Date
                        </div>
                        <p className="font-medium text-gray-900">{formatDate(bookingData.date)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                          <Clock className="w-4 h-4" />
                          Time
                        </div>
                        <p className="font-medium text-gray-900">{bookingData.time}</p>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="p-4 rounded-xl bg-white border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <User className="w-4 h-4" />
                        Patient Details
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-900">{bookingData.patientName}</span></div>
                        <div><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-900">{bookingData.patientEmail}</span></div>
                        <div><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{bookingData.patientPhone}</span></div>
                        {bookingData.notes && (
                          <div className="sm:col-span-2"><span className="text-gray-500">Notes:</span> <span className="font-medium text-gray-900">{bookingData.notes}</span></div>
                        )}
                      </div>
                    </div>

                    {/* Fee */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-primary-50 border border-primary-100">
                      <span className="text-gray-600 font-medium">Consultation Fee</span>
                      <span className="text-xl font-bold text-primary">{formatCurrency(selectedDoctor.consultation_fee)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={prevStep} fullWidth disabled={isLoading}>Back</Button>
                    <Button onClick={handleConfirm} fullWidth rightIcon={<ArrowRight className="w-4 h-4" />} disabled={isLoading}>
                      {isLoading ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 6 — Confirmation */}
              {currentStep === 6 && isBookingComplete && selectedDoctor && (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-500 mb-8">Your appointment has been successfully booked.</p>

                  {/* Confirmation Card */}
                  <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 p-6 text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedDoctor.user_id}</p>
                        <p className="text-primary text-sm">{selectedDoctor.specialization}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="font-medium text-gray-900">{formatDate(bookingData.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time</span>
                        <span className="font-medium text-gray-900">{bookingData.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Patient</span>
                        <span className="font-medium text-gray-900">{bookingData.patientName}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 flex justify-between">
                        <span className="text-gray-500">Fee</span>
                        <span className="font-bold text-primary">{formatCurrency(selectedDoctor.consultation_fee)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto">
                    <Button variant="outline" onClick={() => navigate('/patient/appointments')} fullWidth>
                      View Appointments
                    </Button>
                    <Button onClick={() => { resetBooking(); navigate('/patient'); }} fullWidth>
                      Back to Dashboard
                    </Button>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
    </div>
  );
};

export default BookAppointment;
