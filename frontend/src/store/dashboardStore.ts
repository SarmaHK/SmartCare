import { create } from 'zustand';
import type { DashboardStats, Appointment, Doctor, Schedule } from '../types';
import { mockAppointments, mockDoctors, mockSchedules } from '../mock';

interface DashboardState {
  stats: DashboardStats;
  recentAppointments: Appointment[];
  doctorsList: Doctor[];
  schedulesList: Schedule[];
  isLoading: boolean;

  // Actions
  fetchDashboardData: () => void;
  fetchDoctorDashboard: (doctorId: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: {
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    activeSchedules: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    revenue: 0,
  },
  recentAppointments: [],
  doctorsList: [],
  schedulesList: [],
  isLoading: false,

  fetchDashboardData: () => {
    set({ isLoading: true });
    setTimeout(() => {
      const todayAppointments = mockAppointments.filter(
        (a) => a.date === new Date().toISOString().split('T')[0]
      ).length;
      const upcomingAppointments = mockAppointments.filter(
        (a) => a.status === 'upcoming'
      ).length;
      const completedAppointments = mockAppointments.filter(
        (a) => a.status === 'completed'
      ).length;
      const cancelledAppointments = mockAppointments.filter(
        (a) => a.status === 'cancelled'
      ).length;
      const activeSchedules = mockSchedules.filter((s) => s.isActive).length;

      set({
        stats: {
          totalDoctors: mockDoctors.length,
          totalPatients: 6,
          totalAppointments: mockAppointments.length,
          activeSchedules,
          todayAppointments,
          upcomingAppointments,
          completedAppointments,
          cancelledAppointments,
          revenue: 128500,
        },
        recentAppointments: mockAppointments.slice(0, 8),
        doctorsList: mockDoctors,
        schedulesList: mockSchedules,
        isLoading: false,
      });
    }, 500);
  },

  fetchDoctorDashboard: (doctorId: string) => {
    set({ isLoading: true });
    setTimeout(() => {
      const doctorAppointments = mockAppointments.filter(
        (a) => a.doctorId === doctorId
      );
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = doctorAppointments.filter(
        (a) => a.date === today
      ).length;
      const upcomingAppointments = doctorAppointments.filter(
        (a) => a.status === 'upcoming'
      ).length;

      const uniquePatients = new Set(doctorAppointments.map((a) => a.patientId));

      set({
        stats: {
          totalDoctors: 1,
          totalPatients: uniquePatients.size,
          totalAppointments: doctorAppointments.length,
          activeSchedules: mockSchedules.filter(
            (s) => s.doctorId === doctorId && s.isActive
          ).length,
          todayAppointments,
          upcomingAppointments,
          completedAppointments: doctorAppointments.filter(
            (a) => a.status === 'completed'
          ).length,
          cancelledAppointments: doctorAppointments.filter(
            (a) => a.status === 'cancelled'
          ).length,
          revenue: doctorAppointments.length * 250,
        },
        recentAppointments: doctorAppointments,
        isLoading: false,
      });
    }, 500);
  },
}));
