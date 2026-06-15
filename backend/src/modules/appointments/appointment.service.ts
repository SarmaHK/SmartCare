import prisma from '../../config/prisma';
import { AppError } from '../../utils/errors/AppError';
import { BookInput, RescheduleInput, StatusUpdateInput } from './appointment.types';
import { AppointmentStatus, Role } from '@prisma/client';

export const bookAppointment = async (patientId: number, data: BookInput) => {
  const doctor = await prisma.user.findFirst({ where: { id: data.doctorId, role: Role.DOCTOR } });
  if (!doctor) throw new AppError('Doctor not found', 404);

  const slot = await prisma.appointmentSlot.findFirst({ where: { id: data.slotId, doctorId: data.doctorId } });
  if (!slot) throw new AppError('Slot not found', 404);
  if (slot.isAvailable === true) throw new AppError('Slot is already booked', 400);

  // Prevent double booking for the same patient at the exact same slot
  const existingAppt = await prisma.appointment.findFirst({
    where: { patientId, slotId: data.slotId, status: { not: AppointmentStatus.CANCELLED } }
  });
  if (existingAppt) throw new AppError('You have already booked this slot', 409);

  return prisma.$transaction(async (tx) => {
    // 1. Mark slot as booked (isAvailable: true mapped to is_booked=1)
    await tx.appointmentSlot.update({
      where: { id: data.slotId },
      data: { isAvailable: true }
    });

    // 2. Create appointment
    const appointment = await tx.appointment.create({
      data: {
        patientId,
        doctorId: data.doctorId,
        slotId: data.slotId,
        notes: data.notes,
        status: AppointmentStatus.PENDING
      },
      include: {
        doctor: { select: { fullName: true, doctorProfile: { select: { specialization: true } } } },
        patient: { select: { fullName: true } },
        slot: true
      }
    });

    // 3. Notify Doctor
    await tx.notification.create({
      data: {
        userId: data.doctorId,
        title: 'New Appointment Booked',
        message: `Patient ${appointment.patient.fullName} has booked an appointment for ${slot.slotDate.toISOString().split('T')[0]} at ${slot.startTime.toISOString().substring(11, 16)}.`
      }
    });

    return appointment;
  });
};

export const getMyAppointments = async (patientId: number) => {
  const appointments = await prisma.appointment.findMany({
    where: { patientId },
    include: {
      doctor: { select: { fullName: true, doctorProfile: { select: { specialization: true, consultationFee: true } } } },
      slot: true
    },
    orderBy: { slot: { slotDate: 'desc' } }
  });

  return appointments.map(appt => {
    const { doctor, ...rest } = appt;
    return {
      ...rest,
      doctor: {
        ...(doctor.doctorProfile || {}),
        user: { fullName: doctor.fullName }
      }
    };
  });
};

export const getDoctorAppointments = async (
  doctorId: number,
  params?: { page?: number; limit?: number; patientName?: string; status?: string }
) => {
  const { page = 1, limit = 100, patientName, status } = params || {};
  const skip = (page - 1) * limit;

  const whereClause: any = { doctorId };
  if (status) whereClause.status = status;
  if (patientName) {
    whereClause.patient = {
      fullName: { contains: patientName }
    };
  }

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: { select: { fullName: true, phone: true } },
        slot: true
      },
      orderBy: { slot: { slotDate: 'desc' } },
      skip,
      take: limit,
    }),
    prisma.appointment.count({ where: whereClause })
  ]);

  return { 
    appointments: appointments.map(appt => {
      const { patient, ...rest } = appt;
      return {
        ...rest,
        patient: {
          user: { fullName: patient.fullName, phone: patient.phone }
        }
      };
    }), 
    total 
  };
};

export const getAppointmentById = async (id: number, userId: number, userRole: Role) => {
  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          patientProfile: true
        }
      },
      doctor: {
        select: {
          id: true,
          fullName: true,
          doctorProfile: true
        }
      },
      slot: true
    }
  });

  if (!appt) throw new AppError('Appointment not found', 404);

  if (userRole === Role.PATIENT && appt.patientId !== userId) {
    throw new AppError('You do not own this appointment', 403);
  }
  if (userRole === Role.DOCTOR && appt.doctorId !== userId) {
    throw new AppError('You do not own this appointment', 403);
  }

  const { patient, doctor, ...rest } = appt;
  
  return {
    ...rest,
    doctor: {
      ...(doctor.doctorProfile || {}),
      user: { fullName: doctor.fullName }
    },
    patient: {
      user: { fullName: patient.fullName, phone: patient.phone, email: patient.email },
      bloodGroup: patient.patientProfile?.bloodGroup,
      medicalHistory: patient.patientProfile?.medicalHistory,
      dateOfBirth: patient.patientProfile?.dateOfBirth,
      gender: patient.patientProfile?.gender
    }
  };
};

export const getAllAppointments = async (skip = 0, take = 10, status?: AppointmentStatus, doctorId?: number) => {
  const whereClause: any = {};
  if (status) whereClause.status = status;
  if (doctorId) whereClause.doctorId = doctorId;

  const [data, total] = await Promise.all([
    prisma.appointment.findMany({
      where: whereClause,
      skip,
      take,
      include: {
        patient: { select: { id: true, fullName: true } },
        doctor: { select: { id: true, fullName: true } },
        slot: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.appointment.count({ where: whereClause })
  ]);

  return {
    data: data.map(appt => {
      const { doctor, patient, ...rest } = appt;
      return {
        ...rest,
        doctor: {
          id: doctor.id,
          user: { fullName: doctor.fullName }
        },
        patient: {
          id: patient.id,
          user: { fullName: patient.fullName }
        }
      };
    }),
    meta: {
      total,
      skip,
      take
    }
  };
};

export const cancelAppointment = async (id: number, userId: number, userRole: Role) => {
  const appointment = await prisma.appointment.findUnique({ where: { id }, include: { slot: true, patient: { select: { fullName: true } }, doctor: { select: { fullName: true } } } });
  if (!appointment) throw new AppError('Appointment not found', 404);

  if (userRole === Role.PATIENT && appointment.patientId !== userId) {
    throw new AppError('You do not own this appointment', 403);
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new AppError('Cannot cancel a completed appointment', 400);
  }
  
  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new AppError('Appointment is already cancelled', 400);
  }

  return prisma.$transaction(async (tx) => {
    // 1. Release slot (isAvailable: false -> is_booked=0)
    await tx.appointmentSlot.update({
      where: { id: appointment.slotId },
      data: { isAvailable: false }
    });

    // 2. Mark Appt Cancelled
    const updated = await tx.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CANCELLED }
    });

    // 3. Notify relevant parties
    const dateStr = appointment.slot.slotDate.toISOString().split('T')[0];
    const timeStr = appointment.slot.startTime.toISOString().substring(11, 16);
    
    if (userRole === Role.PATIENT) {
      await tx.notification.create({
        data: {
          userId: appointment.doctorId,
          title: 'Appointment Cancelled',
          message: `Patient ${appointment.patient.fullName} has cancelled their appointment on ${dateStr} at ${timeStr}.`
        }
      });
    } else if (userRole === Role.DOCTOR) {
      await tx.notification.create({
        data: {
          userId: appointment.patientId,
          title: 'Appointment Cancelled',
          message: `Dr. ${appointment.doctor.fullName} has cancelled your appointment on ${dateStr} at ${timeStr}.`
        }
      });
    } else {
      // Admin cancelled
      await tx.notification.createMany({
        data: [
          {
            userId: appointment.doctorId,
            title: 'Appointment Cancelled by Admin',
            message: `The appointment with ${appointment.patient.fullName} on ${dateStr} at ${timeStr} was cancelled by an administrator.`
          },
          {
            userId: appointment.patientId,
            title: 'Appointment Cancelled by Admin',
            message: `Your appointment with Dr. ${appointment.doctor.fullName} on ${dateStr} at ${timeStr} was cancelled by an administrator.`
          }
        ]
      });
    }

    return updated;
  });
};

export const rescheduleAppointment = async (id: number, userId: number, userRole: Role, data: RescheduleInput) => {
  const appointment = await prisma.appointment.findUnique({ where: { id }, include: { slot: true, patient: { select: { fullName: true } }, doctor: { select: { fullName: true } } } });
  if (!appointment) throw new AppError('Appointment not found', 404);

  if (userRole === Role.PATIENT && appointment.patientId !== userId) {
    throw new AppError('You do not own this appointment', 403);
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new AppError('Cannot reschedule a completed appointment', 400);
  }
  
  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new AppError('Cannot reschedule a cancelled appointment', 400);
  }

  // Verify new slot
  const newSlot = await prisma.appointmentSlot.findUnique({ where: { id: data.newSlotId } });
  if (!newSlot) throw new AppError('New slot not found', 404);
  if (newSlot.doctorId !== appointment.doctorId) throw new AppError('Cannot reschedule to a different doctor', 400);
  if (newSlot.isAvailable === true) throw new AppError('New slot is already booked', 400);

  // Past dates cannot be rescheduled (for the new slot)
  const today = new Date().toISOString().split('T')[0];
  if (newSlot.slotDate.toISOString().split('T')[0] < today) {
    throw new AppError('Cannot reschedule to a past date', 400);
  }

  return prisma.$transaction(async (tx) => {
    // 1. Release old slot
    await tx.appointmentSlot.update({
      where: { id: appointment.slotId },
      data: { isAvailable: false }
    });

    // 2. Claim new slot
    await tx.appointmentSlot.update({
      where: { id: data.newSlotId },
      data: { isAvailable: true }
    });

    // 3. Update appointment
    const updated = await tx.appointment.update({
      where: { id },
      data: { slotId: data.newSlotId }
    });

    // 4. Notify the relevant parties
    const dateStr = newSlot.slotDate.toISOString().split('T')[0];
    const timeStr = newSlot.startTime.toISOString().substring(11, 16);

    if (userRole === Role.PATIENT) {
      await tx.notification.create({
        data: {
          userId: appointment.doctorId,
          title: 'Appointment Rescheduled',
          message: `Patient ${appointment.patient.fullName} has rescheduled their appointment to ${dateStr} at ${timeStr}.`
        }
      });
    } else if (userRole === Role.DOCTOR) {
      await tx.notification.create({
        data: {
          userId: appointment.patientId,
          title: 'Appointment Rescheduled',
          message: `Dr. ${appointment.doctor.fullName} has rescheduled your appointment to ${dateStr} at ${timeStr}.`
        }
      });
    } else {
      // Admin
      await tx.notification.createMany({
        data: [
          {
            userId: appointment.doctorId,
            title: 'Appointment Rescheduled by Admin',
            message: `The appointment with ${appointment.patient.fullName} was rescheduled by an administrator to ${dateStr} at ${timeStr}.`
          },
          {
            userId: appointment.patientId,
            title: 'Appointment Rescheduled by Admin',
            message: `Your appointment with Dr. ${appointment.doctor.fullName} was rescheduled by an administrator to ${dateStr} at ${timeStr}.`
          }
        ]
      });
    }

    return updated;
  });
};

export const updateAppointmentStatus = async (id: number, doctorId: number, userRole: Role, data: StatusUpdateInput) => {
  const appointment = await prisma.appointment.findUnique({ where: { id }, include: { patient: { select: { fullName: true } }, doctor: { select: { fullName: true } } } });
  if (!appointment) throw new AppError('Appointment not found', 404);

  if (userRole === Role.DOCTOR && appointment.doctorId !== doctorId) {
    throw new AppError('You do not own this appointment', 403);
  }

  const current = appointment.status;
  const target = data.status;

  // Validation Matrix
  // PENDING -> CONFIRMED, CANCELLED
  // CONFIRMED -> COMPLETED, CANCELLED
  // COMPLETED -> (Invalid)
  // CANCELLED -> (Invalid)

  if (current === AppointmentStatus.COMPLETED) throw new AppError('Completed appointments cannot be modified', 400);
  if (current === AppointmentStatus.CANCELLED) throw new AppError('Cancelled appointments cannot be modified', 400);

  if (current === AppointmentStatus.PENDING && target !== AppointmentStatus.CONFIRMED && target !== AppointmentStatus.CANCELLED) {
    throw new AppError(`Cannot transition from ${current} to ${target}`, 400);
  }

  if (current === AppointmentStatus.CONFIRMED && target !== AppointmentStatus.COMPLETED && target !== AppointmentStatus.CANCELLED) {
    throw new AppError(`Cannot transition from ${current} to ${target}`, 400);
  }

  return prisma.$transaction(async (tx) => {
    // If moving to CANCELLED, release the slot
    if (target === AppointmentStatus.CANCELLED) {
      await tx.appointmentSlot.update({
        where: { id: appointment.slotId },
        data: { isAvailable: false }
      });
    }

    const updated = await tx.appointment.update({
      where: { id },
      data: { status: target }
    });

    // Notify patient and/or doctor
    if (userRole === Role.ADMIN) {
      await tx.notification.createMany({
        data: [
          {
            userId: appointment.patientId,
            title: target === AppointmentStatus.CONFIRMED ? 'Appointment Confirmed' : 'Appointment Status Updated',
            message: target === AppointmentStatus.CONFIRMED 
              ? 'Your appointment has been confirmed by an administrator.' 
              : `Your appointment status has been updated to ${target} by an administrator.`
          },
          {
            userId: appointment.doctorId,
            title: 'Appointment Status Updated by Admin',
            message: `The appointment with ${appointment.patient.fullName} has been updated to ${target} by an administrator.`
          }
        ]
      });
    } else {
      await tx.notification.create({
        data: {
          userId: appointment.patientId,
          title: target === AppointmentStatus.CONFIRMED ? 'Appointment Confirmed' : 'Appointment Status Updated',
          message: target === AppointmentStatus.CONFIRMED 
            ? 'Your appointment has been confirmed by the doctor.' 
            : `Your appointment status is now ${target}.`
        }
      });
    }

    return updated;
  });
};
