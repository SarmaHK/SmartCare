import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/cards/Card';
import { Button } from '../../components/common/Button';
import { BookingSteps } from '../../components/common/BookingSteps';
import { Textarea } from '../../components/forms/Textarea';
import { Skeleton } from '../../components/common/Skeleton';
import { doctorService, type DoctorProfile } from '../../services/doctor.service';
import { appointmentService } from '../../services/appointment.service';
import { type Slot } from '../../services/slot.service';
import { SlotSelector } from './components/SlotSelector';
import {
  Stethoscope,
  Clock,
  Banknote,

  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const BOOKING_STEPS = [
  { id: 1, label: 'Doctor', description: 'View profile' },
  { id: 2, label: 'Date', description: 'Pick a day' },
  { id: 3, label: 'Time', description: 'Select slot' },
  { id: 4, label: 'Confirm', description: 'Book visit' },
];

export const DoctorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [notes, setNotes] = useState('');

  const currentStep = selectedSlot ? 4 : 2;

  useEffect(() => {
    if (id) fetchDoctorDetails(id);
  }, [id]);

  async function fetchDoctorDetails(doctorId: string) {
    try {
      const response = await doctorService.getDoctorById(doctorId);
      if (response.success) {
        setDoctor(response.data);
      }
    } catch {
      toast.error('Failed to load doctor details');
      navigate('/patient/doctors');
    } finally {
      setIsLoading(false);
    }
  }

  const handleBookAppointment = async () => {
    if (!doctor || !selectedSlot) return;

    setIsBooking(true);
    try {
      const response = await appointmentService.bookAppointment({
        doctorId: doctor.id,
        slotId: selectedSlot.id,
        notes: notes.trim() || undefined,
      });
      if (response.success) {
        toast.success('Appointment booked successfully!');
        navigate('/patient/appointments');
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to book appointment';
      toast.error(message);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-80" />
          <Skeleton className="h-80 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/patient/doctors')}
          className="rounded-lg p-2 text-secondary-500 transition-colors hover:bg-secondary-100 hover:text-secondary-700"
          aria-label="Back to doctors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Book Appointment</h1>
          <p className="text-sm text-secondary-500">Schedule a consultation with Dr. {doctor.user.fullName}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <BookingSteps steps={BOOKING_STEPS} currentStep={currentStep} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-700">
                {doctor.user.fullName.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-secondary-900">Dr. {doctor.user.fullName}</h2>
              <p className="mt-1 flex items-center justify-center gap-1.5 font-medium text-primary-600">
                <Stethoscope className="h-4 w-4" />
                {doctor.specialization}
              </p>

              <div className="mt-5 space-y-3 rounded-lg bg-secondary-50 p-4 text-left">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 text-secondary-500">
                    <Clock className="h-4 w-4" /> Experience
                  </span>
                  <span className="font-medium text-secondary-900">{doctor.experienceYears} Years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 text-secondary-500">
                    <Banknote className="h-4 w-4" /> Consultation Fee
                  </span>
                  <span className="font-medium text-secondary-900">Rs.{doctor.consultationFee}</span>
                </div>

              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-secondary-900">About Doctor</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary-600">
                {doctor.bio ||
                  'Professional medical practitioner committed to providing quality healthcare services.'}
              </p>
              <div className="mt-4">
                <p className="section-title mb-2">Qualifications</p>
                <span className="inline-block rounded-md bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-700">
                  {doctor.qualification}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary-600" />
                Select Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SlotSelector
                doctorId={doctor.id}
                onSelectSlot={setSelectedSlot}
                selectedSlotId={selectedSlot?.id}
              />
            </CardContent>
          </Card>

          {selectedSlot && (
            <Card className="animate-slide-up border-primary-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary-600" />
                  Confirm Your Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-4">
                  <p className="text-sm font-medium text-secondary-700">Appointment Summary</p>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-secondary-400">Date</p>
                      <p className="font-medium text-secondary-900">
                        {format(new Date(selectedSlot.slotDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-400">Time</p>
                      <p className="font-medium text-secondary-900">
                        {selectedSlot.startTime.substring(11, 16)} – {selectedSlot.endTime.substring(11, 16)}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-400">Doctor</p>
                      <p className="font-medium text-secondary-900">Dr. {doctor.user.fullName}</p>
                    </div>
                    <div>
                      <p className="text-secondary-400">Fee</p>
                      <p className="font-medium text-secondary-900">Rs.{doctor.consultationFee}</p>
                    </div>
                  </div>
                </div>

                <Textarea
                  label="Additional Notes (Optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your symptoms or reason for visit..."
                  rows={3}
                />

                <div className="flex flex-col gap-4 border-t border-secondary-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-secondary-600">
                    Fee payable at clinic:{' '}
                    <span className="font-bold text-secondary-900">Rs.{doctor.consultationFee}</span>
                  </p>
                  <Button onClick={handleBookAppointment} isLoading={isBooking} size="lg">
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
