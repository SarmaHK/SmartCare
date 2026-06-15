import prisma from '../../config/prisma';
import { AppError } from '../../utils/errors/AppError';
import { Role } from '@prisma/client';

export const getProfile = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, role: Role.PATIENT },
    include: {
      patientProfile: true
    }
  });

  if (!user) {
    throw new AppError('Patient not found', 404);
  }

  // If patientProfile doesn't exist, create it
  if (!user.patientProfile) {
    const newProfile = await prisma.patientProfile.create({
      data: {
        userId: user.id
      }
    });
    user.patientProfile = newProfile;
  }

  const { password, ...userWithoutPassword } = user;
  return {
    ...user.patientProfile,
    user: userWithoutPassword
  };
};

export const updateProfile = async (userId: number, data: any) => {
  const profile = await prisma.patientProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    throw new AppError('Profile not found', 404);
  }

  const updatedProfile = await prisma.patientProfile.update({
    where: { userId },
    data: {
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      address: data.address,
      emergencyContact: data.emergencyContact,
      medicalHistory: data.medicalHistory,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          profileImage: true,
        }
      }
    }
  });

  if (data.user) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.user.fullName,
        phone: data.user.phone,
      }
    });
    if (data.user.fullName) updatedProfile.user.fullName = data.user.fullName;
    if (data.user.phone) updatedProfile.user.phone = data.user.phone;
  }

  return updatedProfile;
};
