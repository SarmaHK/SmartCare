import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useDoctorStore } from '../../store/doctorStore';
import BookingSteps from '../../components/forms/BookingSteps';
import DatePicker from '../../components/forms/DatePicker';
import TimeSlotPicker from '../../components/forms/TimeSlotPicker';
import BookingForm from '../../components/forms/BookingForm';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { fadeInUp, scaleIn } from '../../hooks/useAnimations';
import type { BookingFormData } from '../../utils/validators';
import type { Doctor, TimeSlot } from '../../types';

const BookAppointment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doctors, fetchDoctors } = useDoctorStore();
  const {
    currentStep, bookingData, isBookingComplete,
    setCurrentStep, nextStep, prevStep, updateBookingData, confirmBooking, resetBooking,
  } = useAppointmentStore();

  useEffect(() => {
    fetchDoctors();
    return () => resetBooking();
  }, []);

  // Auto-select doctor from URL param
  useEffect(() => {
    const doctorId = searchParams.get('doctor');
    if (doctorId && doctors.length > 0) {
      const doc = doctors.find((d) => d.id === doctorId);
      if (doc) {
        updateBookingData({ doctorId: doc.id, doctor: doc });
        if (currentStep === 1) setCurrentStep(2);
      }
    }
  }, [searchParams, doctors]);

  const selectedDoctor = bookingData.doctor || doctors.find((d) => d.id === bookingData.doctorId);

  // Get available slots for selected date
  const getSlotsForDate = (): TimeSlot[] => {
    if (!selectedDoctor || !bookingData.date) return [];
    const selectedDate = new Date(bookingData.date);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const daySlots = selectedDoctor.availableSlots.find((s) => s.day === dayName);
    return daySlots?.slots || [];
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    updateBookingData({ doctorId: doctor.id, doctor });
    nextStep();
  };

  const handleDateSelect = (date: string) => {
    updateBookingData({ date, time: '' });
  };

  const handleTimeSelect = (time: string) => {
    updateBookingData({ time });
  };

  const handleFormSubmit = (data: BookingFormData) => {
    updateBookingData({
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      patientPhone: data.patientPhone,
      notes: data.notes || '',
    });
    nextStep();
  };

  const handleConfirm = () => {
    confirmBooking();
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
            <Card padding="lg">
              {/* Step 1 — Select Doctor */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Select a Doctor</h3>
                  <p className="text-text-secondary text-sm mb-6">Choose your preferred healthcare professional.</p>
                  <div className="grid sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {doctors.filter((d) => d.isAvailable).map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => handleDoctorSelect(doctor)}
                        className={`text-left p-4 rounded-xl border-2 transition-all duration-200 hover:border-primary hover:shadow-md ${
                          bookingData.doctorId === doctor.id
                            ? 'border-primary bg-primary-50'
                            : 'border-border'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-xl" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-text-primary text-sm truncate">{doctor.name}</p>
                            <p className="text-primary text-xs">{doctor.specialization}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-medium">{doctor.rating}</span>
                              <span className="text-xs text-text-muted">• {formatCurrency(doctor.consultationFee)}</span>
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
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Select a Date</h3>
                  <p className="text-text-secondary text-sm mb-6">Choose your preferred appointment date.</p>
                  {selectedDoctor && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100 mb-6">
                      <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-10 h-10 rounded-xl" />
                      <div>
                        <p className="font-medium text-text-primary text-sm">{selectedDoctor.name}</p>
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
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Select a Time</h3>
                  <p className="text-text-secondary text-sm mb-6">
                    Available slots for {bookingData.date ? formatDate(bookingData.date) : 'selected date'}
                  </p>
                  <TimeSlotPicker
                    slots={getSlotsForDate()}
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
                  <h3 className="text-lg font-semibold text-text-primary mb-6">Booking Summary</h3>
                  <div className="space-y-4">
                    {/* Doctor */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
                      <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-14 h-14 rounded-xl" />
                      <div>
                        <p className="font-semibold text-text-primary">{selectedDoctor.name}</p>
                        <p className="text-primary text-sm">{selectedDoctor.specialization}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-background border border-border">
                        <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
                          <Calendar className="w-4 h-4" />
                          Date
                        </div>
                        <p className="font-medium text-text-primary">{formatDate(bookingData.date)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-background border border-border">
                        <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
                          <Clock className="w-4 h-4" />
                          Time
                        </div>
                        <p className="font-medium text-text-primary">{bookingData.time}</p>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="p-4 rounded-xl bg-background border border-border">
                      <div className="flex items-center gap-2 text-text-muted text-sm mb-2">
                        <User className="w-4 h-4" />
                        Patient Details
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        <div><span className="text-text-muted">Name:</span> <span className="font-medium text-text-primary">{bookingData.patientName}</span></div>
                        <div><span className="text-text-muted">Email:</span> <span className="font-medium text-text-primary">{bookingData.patientEmail}</span></div>
                        <div><span className="text-text-muted">Phone:</span> <span className="font-medium text-text-primary">{bookingData.patientPhone}</span></div>
                        {bookingData.notes && (
                          <div className="sm:col-span-2"><span className="text-text-muted">Notes:</span> <span className="font-medium text-text-primary">{bookingData.notes}</span></div>
                        )}
                      </div>
                    </div>

                    {/* Fee */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-primary-50 border border-primary-100">
                      <span className="text-text-secondary font-medium">Consultation Fee</span>
                      <span className="text-xl font-bold text-primary">{formatCurrency(selectedDoctor.consultationFee)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={prevStep} fullWidth>Back</Button>
                    <Button onClick={handleConfirm} fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Confirm Booking
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
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Booking Confirmed!</h3>
                  <p className="text-text-secondary mb-8">Your appointment has been successfully booked.</p>

                  {/* Confirmation Card */}
                  <div className="max-w-md mx-auto bg-background rounded-2xl border border-border p-6 text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-12 h-12 rounded-xl" />
                      <div>
                        <p className="font-semibold text-text-primary">{selectedDoctor.name}</p>
                        <p className="text-primary text-sm">{selectedDoctor.specialization}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Date</span>
                        <span className="font-medium text-text-primary">{formatDate(bookingData.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Time</span>
                        <span className="font-medium text-text-primary">{bookingData.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Patient</span>
                        <span className="font-medium text-text-primary">{bookingData.patientName}</span>
                      </div>
                      <div className="pt-2 border-t border-border flex justify-between">
                        <span className="text-text-muted">Fee</span>
                        <span className="font-bold text-primary">{formatCurrency(selectedDoctor.consultationFee)}</span>
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
