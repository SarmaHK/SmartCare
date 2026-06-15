import prisma from '../../config/prisma';
import { AppError } from '../../utils/errors/AppError';
import { CreateSlotInput, UpdateSlotInput } from './slot.types';
import { Role } from '@prisma/client';

const extractTime = (dateObj: Date) => {
  return dateObj.toISOString().split('T')[1];
};

export const createSlot = async (doctorId: number, data: CreateSlotInput) => {
  // Verify doctor exists and is active
  const doctor = await prisma.user.findFirst({
    where: { id: doctorId, role: Role.DOCTOR, isActive: true }
  });
  if (!doctor) throw new AppError('Doctor not found or inactive', 404);

  // Check past dates
  const today = new Date().toISOString().split('T')[0];
  if (data.slotDate < today) {
    throw new AppError('Cannot create slots in the past', 400);
  }

  const newStartStr = `1970-01-01T${data.startTime}:00.000Z`;
  const newEndStr = `1970-01-01T${data.endTime}:00.000Z`;
  const newStart = new Date(newStartStr);
  const newEnd = new Date(newEndStr);

  // Check Overlaps
  const existingSlots = await prisma.appointmentSlot.findMany({
    where: { doctorId, slotDate: new Date(data.slotDate) }
  });

  const hasOverlap = existingSlots.some(slot => {
    const eStart = new Date(`1970-01-01T${extractTime(slot.startTime)}`);
    const eEnd = new Date(`1970-01-01T${extractTime(slot.endTime)}`);
    return eStart < newEnd && eEnd > newStart;
  });

  if (hasOverlap) {
    throw new AppError('Slot overlaps with an existing slot', 409);
  }

  const slot = await prisma.appointmentSlot.create({
    data: {
      doctorId,
      slotDate: new Date(data.slotDate),
      startTime: newStart,
      endTime: newEnd,
      // @ts-ignore: ts-node cache issue with Prisma types
      location: data.location,
      isAvailable: false // Maps to is_booked = false (meaning it IS available)
    }
  });

  return slot;
};

export const getAvailableSlots = async (doctorId?: number, date?: string) => {
  const whereClause: any = {
    isAvailable: false // Maps to is_booked = false
  };

  if (doctorId) whereClause.doctorId = doctorId;
  if (date) whereClause.slotDate = new Date(date);

  const slots = await prisma.appointmentSlot.findMany({
    where: whereClause,
    orderBy: [{ slotDate: 'asc' }, { startTime: 'asc' }],
    include: {
      doctor: {
        select: { id: true, fullName: true, doctorProfile: { select: { specialization: true } } }
      }
    }
  });

  return slots;
};

export const getDoctorSlots = async (doctorId: number) => {
  return await prisma.appointmentSlot.findMany({
    where: { doctorId },
    orderBy: [{ slotDate: 'desc' }, { startTime: 'asc' }],
  });
};

export const getSlotById = async (id: number, doctorId: number, userRole: Role) => {
  const slot = await prisma.appointmentSlot.findUnique({ where: { id } });
  
  if (!slot) throw new AppError('Slot not found', 404);
  
  // If doctor, ensure they own it
  if (userRole === Role.DOCTOR && slot.doctorId !== doctorId) {
    throw new AppError('You do not own this slot', 403);
  }

  return slot;
};

export const updateSlot = async (id: number, doctorId: number, userRole: Role, data: UpdateSlotInput) => {
  const slot = await prisma.appointmentSlot.findUnique({ where: { id } });
  
  if (!slot) throw new AppError('Slot not found', 404);
  
  // If doctor, ensure they own it
  if (userRole === Role.DOCTOR && slot.doctorId !== doctorId) {
    throw new AppError('You do not own this slot', 403);
  }

  // Cannot update booked slot
  if (slot.isAvailable === true) {
    throw new AppError('Cannot update a booked slot', 400);
  }

  // Calculate fields for overlap check
  const newDateStr = data.slotDate || slot.slotDate.toISOString().split('T')[0];
  const newStartStr = data.startTime ? `1970-01-01T${data.startTime}:00.000Z` : `1970-01-01T${extractTime(slot.startTime)}`;
  const newEndStr = data.endTime ? `1970-01-01T${data.endTime}:00.000Z` : `1970-01-01T${extractTime(slot.endTime)}`;
  
  const newStart = new Date(newStartStr);
  const newEnd = new Date(newEndStr);

  if (newEnd <= newStart) {
    throw new AppError('End time must be after start time', 400);
  }

  // Check Overlaps (excluding this slot)
  const existingSlots = await prisma.appointmentSlot.findMany({
    where: { 
      doctorId: slot.doctorId, 
      slotDate: new Date(newDateStr),
      id: { not: id }
    }
  });

  const hasOverlap = existingSlots.some(s => {
    const eStart = new Date(`1970-01-01T${extractTime(s.startTime)}`);
    const eEnd = new Date(`1970-01-01T${extractTime(s.endTime)}`);
    return eStart < newEnd && eEnd > newStart;
  });

  if (hasOverlap) {
    throw new AppError('Slot overlaps with an existing slot', 409);
  }

  return await prisma.appointmentSlot.update({
    where: { id },
    data: {
      ...(data.slotDate && { slotDate: new Date(data.slotDate) }),
      ...(data.startTime && { startTime: newStart }),
      ...(data.endTime && { endTime: newEnd }),
      // @ts-ignore: ts-node cache issue with Prisma types
      ...(data.location !== undefined && { location: data.location }),
    }
  });
};

export const deleteSlot = async (id: number, doctorId: number, userRole: Role) => {
  const slot = await prisma.appointmentSlot.findUnique({ where: { id } });
  
  if (!slot) throw new AppError('Slot not found', 404);

  if (userRole === Role.DOCTOR && slot.doctorId !== doctorId) {
    throw new AppError('You do not own this slot', 403);
  }

  // Cannot delete a booked slot
  if (slot.isAvailable === true) {
    throw new AppError('Cannot delete a booked slot', 400);
  }

  await prisma.appointmentSlot.delete({ where: { id } });
  return { success: true };
};
