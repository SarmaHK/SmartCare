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
