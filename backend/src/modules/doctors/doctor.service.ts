import bcrypt from 'bcrypt';
import prisma from '../../config/prisma';
import { AppError } from '../../utils/errors/AppError';
import { CreateDoctorInput, UpdateDoctorInput } from './doctor.types';
import { Role } from '@prisma/client';

export const getAllDoctors = async () => {
  const doctors = await prisma.user.findMany({
    where: {
      role: Role.DOCTOR,
      isActive: true,
    },
    include: {
      doctorProfile: true,
      _count: {
        select: { appointmentSlots: true }
      }
    },
  });

  return doctors.map(({ password, ...doc }) => doc);
};

export const getDoctorById = async (id: number) => {
  const doctor = await prisma.user.findFirst({
    where: {
      id,
      role: Role.DOCTOR,
    },
    include: {
      doctorProfile: true,
    },
  });

  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  const { password, ...docWithoutPassword } = doctor;
  return docWithoutPassword;
};

export const createDoctor = async (data: CreateDoctorInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { phone: data.phone }],
    },
  });

  if (existingUser) {
    throw new AppError('Email or phone already in use', 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: Role.DOCTOR,
        isActive: true,
      },
    });

    const profile = await tx.doctorProfile.create({
      data: {
        userId: user.id,
        specialization: data.specialization,
        qualification: data.qualification,
        experienceYears: data.experienceYears || 0,
        consultationFee: data.consultationFee || 0,
        bio: data.bio,
      },
    });

    return { user, profile };
  });

  const { password, ...userWithoutPassword } = result.user;
  return { ...userWithoutPassword, profile: result.profile };
};

export const updateDoctor = async (id: number, data: UpdateDoctorInput) => {
  const doctor = await prisma.user.findFirst({
    where: { id, role: Role.DOCTOR },
    include: { doctorProfile: true },
  });

  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  // If email or phone changes, normally we check duplicates, but we only have phone in update schema
  if (data.phone && data.phone !== doctor.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: data.phone }
    });
    if (existingPhone) throw new AppError('Phone already in use', 409);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.phone && { phone: data.phone }),
      ...(typeof data.isActive === 'boolean' && { isActive: data.isActive }),
      doctorProfile: {
        update: {
          ...(data.specialization && { specialization: data.specialization }),
          ...(data.qualification && { qualification: data.qualification }),
          ...(data.experienceYears !== undefined && { experienceYears: data.experienceYears }),
          ...(data.consultationFee !== undefined && { consultationFee: data.consultationFee }),
          ...(data.bio && { bio: data.bio }),
        }
      }
    },
    include: { doctorProfile: true }
  });

  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const deleteDoctor = async (id: number) => {
  const doctor = await prisma.user.findFirst({
    where: { id, role: Role.DOCTOR },
  });

  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });

  return { success: true };
};
