import prisma from '../../config/prisma';
import { AppError } from '../../utils/errors/AppError';
import { UpdateUserStatusInput } from './admin.types';
import { AppointmentStatus, Role, Prisma } from '@prisma/client';

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalDoctors,
    totalPatients,
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    pendingAppointments
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.DOCTOR } }),
    prisma.user.count({ where: { role: Role.PATIENT } }),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: AppointmentStatus.COMPLETED } }),
    prisma.appointment.count({ where: { status: AppointmentStatus.CANCELLED } }),
    prisma.appointment.count({ where: { status: AppointmentStatus.PENDING } })
  ]);

  return {
    totalUsers,
    totalDoctors,
    totalPatients,
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    pendingAppointments
  };
};

export const getAllUsers = async (skip = 0, take = 10, search?: string, role?: Role) => {
  const where: Prisma.UserWhereInput = {};
  
  if (role) {
    where.role = role;
  }
  
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } }
    ];
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  return {
    data,
    meta: { total, skip, take }
  };
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      doctorProfile: true,
      patientProfile: true
    }
  });

  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const updateUserStatus = async (id: number, data: UpdateUserStatusInput) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError('User not found', 404);

  return await prisma.user.update({
    where: { id },
    data: { isActive: data.isActive },
    select: { id: true, fullName: true, isActive: true }
  });
};

export const getAllDoctors = async () => {
  return await prisma.user.findMany({
    where: { role: Role.DOCTOR },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      isActive: true,
      doctorProfile: true
    }
  });
};

export const getDoctorSummary = async (doctorId: number) => {
  const doctor = await prisma.user.findFirst({ where: { id: doctorId, role: Role.DOCTOR } });
  if (!doctor) throw new AppError('Doctor not found', 404);

  const [totalAppointments, completedAppointments, cancelledAppointments] = await Promise.all([
    prisma.appointment.count({ where: { doctorId } }),
    prisma.appointment.count({ where: { doctorId, status: AppointmentStatus.COMPLETED } }),
    prisma.appointment.count({ where: { doctorId, status: AppointmentStatus.CANCELLED } }),
  ]);

  return {
    doctorId,
    totalAppointments,
    completedAppointments,
    cancelledAppointments
  };
};

export const getAllAppointments = async (skip = 0, take = 10, status?: AppointmentStatus, doctorId?: number, patientId?: number, date?: string) => {
  const where: any = {};
  if (status) where.status = status;
  if (doctorId) where.doctorId = doctorId;
  if (patientId) where.patientId = patientId;
  if (date) {
    where.slot = {
      slotDate: new Date(date)
    };
  }

  const [data, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      skip,
      take,
      include: {
        patient: { select: { id: true, fullName: true } },
        doctor: { select: { id: true, fullName: true } },
        slot: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.appointment.count({ where })
  ]);

  return {
    data,
    meta: { total, skip, take }
  };
};

export const getAppointmentReports = async () => {
  const now = new Date();
  
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  
  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);

  const [dailyAppointments, weeklyAppointments, monthlyAppointments] = await Promise.all([
    prisma.appointment.count({
      where: { slot: { slotDate: { equals: startOfDay } } }
    }),
    prisma.appointment.count({
      where: { slot: { slotDate: { gte: startOfWeek } } }
    }),
    prisma.appointment.count({
      where: { slot: { slotDate: { gte: startOfMonth } } }
    })
  ]);

  return {
    dailyAppointments,
    weeklyAppointments,
    monthlyAppointments
  };
};
