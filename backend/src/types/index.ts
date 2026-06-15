import { Request } from 'express';

export type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface JwtPayload {
  id: string;
  role: Role;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
