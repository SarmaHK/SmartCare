import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from '../repositories/AuthRepository';
import { AppError } from '../errors/AppError';
import { env } from '../config/env';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(userData: any) {
    const existingUser = await this.authRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new AppError('Email is already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userId = await this.authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    const token = this.generateToken(userId, userData.role, userData.email);

    return {
      user: {
        id: userId,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
      token,
    };
  }

  async login(credentials: any) {
    const user = await this.authRepository.findUserByEmail(credentials.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user.id, user.role, user.email);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  private generateToken(id: string, role: string, email: string): string {
    return jwt.sign(
      { id, role, email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );
  }
}
