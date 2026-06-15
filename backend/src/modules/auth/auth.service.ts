import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterInput, LoginInput } from './auth.types';
import prisma from '../../config/prisma';
import { env } from '../../config/env';
import { AppError } from '../../utils/errors/AppError';

export const registerUser = async (data: RegisterInput) => {
  // Check if email exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('Email is already in use', 409);
  }

  // Check if phone exists
  const existingPhone = await prisma.user.findUnique({
    where: { phone: data.phone },
  });

  if (existingPhone) {
    throw new AppError('Phone number is already in use', 409);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: data.role,
    },
  });

  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  
  // Generate JWT
  const token = jwt.sign(
    { id: user.id.toString(), role: user.role, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );

  return { user: userWithoutPassword, token };
};

export const loginUser = async (data: LoginInput) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.isActive) {
    throw new AppError('Invalid email or password', 401);
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id.toString(), role: user.role, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const getCurrentUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.isActive) {
    throw new AppError('User not found or inactive', 404);
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
