import { create } from 'zustand';
import type { Appointment, AppointmentStatus, BookingData, BookingStep } from '../types';
import { mockAppointments } from '../mock';

interface AppointmentState {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  selectedAppointment: Appointment | null;
  activeTab: AppointmentStatus | 'all';
  isLoading: boolean;

  // Booking flow
  currentStep: BookingStep;
  bookingData: BookingData;
  isBookingComplete: boolean;

  // Actions
  fetchAppointments: () => void;
  setActiveTab: (tab: AppointmentStatus | 'all') => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;

  // Booking actions
  setCurrentStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateBookingData: (data: Partial<BookingData>) => void;
  confirmBooking: () => void;
  resetBooking: () => void;
}

const defaultBookingData: BookingData = {
  doctorId: '',
  doctor: undefined,
  date: '',
  time: '',
  patientName: '',
  patientEmail: '',
  patientPhone: '',
  notes: '',
};

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  filteredAppointments: [],
  selectedAppointment: null,
  activeTab: 'all',
  isLoading: false,

  currentStep: 1,
  bookingData: { ...defaultBookingData },
  isBookingComplete: false,

  fetchAppointments: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({ appointments: mockAppointments, isLoading: false });
      get().setActiveTab(get().activeTab);
    }, 500);
  },

  setActiveTab: (tab) => {
    const { appointments } = get();
    const filtered =
      tab === 'all'
        ? appointments
        : appointments.filter((a) => a.status === tab);
    set({ activeTab: tab, filteredAppointments: filtered });
  },

  setSelectedAppointment: (appointment) => {
    set({ selectedAppointment: appointment });
  },

  cancelAppointment: (id) => {
    set((state) => {
      const updated = state.appointments.map((a) =>
        a.id === id ? { ...a, status: 'cancelled' as AppointmentStatus, updatedAt: new Date().toISOString() } : a
      );
      return { appointments: updated };
    });
    get().setActiveTab(get().activeTab);
  },

  rescheduleAppointment: (id, newDate, newTime) => {
    set((state) => {
      const updated = state.appointments.map((a) =>
        a.id === id ? { ...a, date: newDate, time: newTime, updatedAt: new Date().toISOString() } : a
      );
      return { appointments: updated };
    });
    get().setActiveTab(get().activeTab);
  },

  // Booking flow
  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 6) {
      set({ currentStep: (currentStep + 1) as BookingStep });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as BookingStep });
    }
  },

  updateBookingData: (data) => {
    set((state) => ({
      bookingData: { ...state.bookingData, ...data },
    }));
  },

  confirmBooking: () => {
    const { bookingData, appointments } = get();

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: `pat-new-${Date.now()}`,
      patientName: bookingData.patientName,
      patientEmail: bookingData.patientEmail,
      patientPhone: bookingData.patientPhone,
      doctorId: bookingData.doctorId,
      doctorName: bookingData.doctor?.name || '',
      doctorSpecialization: bookingData.doctor?.specialization || 'General Practice',
      doctorImage: bookingData.doctor?.image || '',
      date: bookingData.date,
      time: bookingData.time,
      status: 'upcoming',
      notes: bookingData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set({
      appointments: [newAppointment, ...appointments],
      isBookingComplete: true,
      currentStep: 6,
    });
  },

  resetBooking: () => {
    set({
      currentStep: 1,
      bookingData: { ...defaultBookingData },
      isBookingComplete: false,
    });
  },
}));
