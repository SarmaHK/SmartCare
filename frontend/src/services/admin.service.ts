import { api } from './api';

import { type DoctorProfile } from './doctor.service';
import { type Appointment } from './appointment.service';

export interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
}

export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface DoctorSummary extends DoctorProfile {
  appointmentCount: number;
  completedCount: number;
  cancelledCount: number;
}

export interface ReportData {
  daily: { date: string; count: number }[];
  weekly: { week: string; count: number }[];
  monthly: { month: string; count: number }[];
  completionRate: number;
  cancellationRate: number;
}

type ListParams = {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  doctorId?: number;
  date?: string;
};

function toSkipTake(params?: { page?: number; limit?: number }) {
  const limit = params?.limit ?? 10;
  const page = params?.page ?? 1;
  return {
    take: limit,
    skip: (page - 1) * limit,
  };
}

function normalizeAppointment(apt: Record<string, unknown>): Appointment {
  const doctor = apt.doctor as Record<string, unknown> | undefined;
  const patient = apt.patient as Record<string, unknown> | undefined;

  const normalized = { ...(apt as unknown as Appointment) };

  if (doctor && !('user' in doctor)) {
    normalized.doctor = {
      id: doctor.id as number,
      specialization: (doctor.specialization as string) || '',
      user: {
        fullName: (doctor.fullName as string) || 'Unknown',
        phone: (doctor.phone as string) || '',
        email: (doctor.email as string) || '',
      },
    } as Appointment['doctor'];
  }

  if (patient && !('user' in patient)) {
    normalized.patient = {
      id: patient.id as number,
      user: {
        fullName: (patient.fullName as string) || 'Unknown',
        phone: (patient.phone as string) || '',
        email: (patient.email as string) || '',
      },
    } as Appointment['patient'];
  }

  return normalized;
}

export const adminService = {
  getDashboardStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (
    params?: ListParams
  ): Promise<{ success: boolean; data: { users: UserSummary[]; total: number } }> => {
    const { take, skip } = toSkipTake(params);
    const response = await api.get('/admin/users', {
      params: {
        take,
        skip,
        search: params?.search,
        role: params?.role,
      },
    });
    const body = response.data;
    const users = Array.isArray(body.data) ? body.data : body.data?.users ?? [];
    const total = body.meta?.total ?? users.length;
    return { success: body.success, data: { users, total } };
  },

  getUserById: async (
    id: number | string
  ): Promise<{ success: boolean; data: UserSummary & { doctorProfile?: DoctorProfile; patientProfile?: unknown } }> => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (
    id: number | string,
    isActive: boolean
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  getDoctors: async (
    params?: ListParams
  ): Promise<{ success: boolean; data: { doctors: DoctorSummary[]; total: number } }> => {
    const response = await api.get('/admin/doctors', { params });
    const body = response.data;
    const rawDoctors = Array.isArray(body.data) ? body.data : body.data?.doctors ?? [];
    const doctors = rawDoctors.map((doc: Record<string, unknown>) => ({
      id: doc.id,
      user: {
        fullName: doc.fullName,
        email: doc.email,
        phone: doc.phone,
      },
      specialization: (doc.doctorProfile as { specialization?: string })?.specialization ?? '',
      qualification: (doc.doctorProfile as { qualification?: string })?.qualification ?? '',
      experienceYears: (doc.doctorProfile as { experienceYears?: number })?.experienceYears ?? 0,
      consultationFee: Number((doc.doctorProfile as { consultationFee?: number })?.consultationFee ?? 0),
      bio: (doc.doctorProfile as { bio?: string })?.bio ?? '',
      appointmentCount: 0,
      completedCount: 0,
      cancelledCount: 0,
    })) as DoctorSummary[];
    return { success: body.success, data: { doctors, total: doctors.length } };
  },

  getDoctorSummary: async (
    id: number | string
  ): Promise<{ success: boolean; data: DoctorSummary & { slots: unknown[] } }> => {
    const response = await api.get(`/admin/doctors/${id}/summary`);
    return response.data;
  },

  getAppointments: async (
    params?: ListParams & { status?: string }
  ): Promise<{ success: boolean; data: { appointments: Appointment[]; total: number } }> => {
    const { take, skip } = toSkipTake(params);
    const response = await api.get('/admin/appointments', {
      params: {
        take,
        skip,
        status: params?.status,
        doctorId: params?.doctorId,
        date: params?.date,
      },
    });
    const body = response.data;
    const rawAppointments = Array.isArray(body.data) ? body.data : body.data?.appointments ?? [];
    const appointments = rawAppointments.map(normalizeAppointment);
    const total = body.meta?.total ?? appointments.length;
    return { success: body.success, data: { appointments, total } };
  },

  getReports: async (): Promise<{ success: boolean; data: ReportData }> => {
    const response = await api.get('/admin/reports/appointments');
    const body = response.data;
    const raw = body.data ?? {};

    // Backend returns aggregate counts; shape them for chart components
    const dailyCount = raw.dailyAppointments ?? 0;
    const weeklyCount = raw.weeklyAppointments ?? 0;
    const monthlyCount = raw.monthlyAppointments ?? 0;

    const statsRes = await api.get('/admin/dashboard');
    const stats = statsRes.data?.data;
    const total = stats?.totalAppointments ?? 0;
    const completed = stats?.completedAppointments ?? 0;
    const cancelled = stats?.cancelledAppointments ?? 0;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

    return {
      success: body.success,
      data: {
        daily: [{ date: today, count: dailyCount }],
        weekly: [{ week: 'This Week', count: weeklyCount }],
        monthly: [{ month: new Date().toLocaleString('en-US', { month: 'short' }), count: monthlyCount }],
        completionRate,
        cancellationRate,
      },
    };
  },
};
