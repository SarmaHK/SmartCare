import { Response, NextFunction } from 'express';
import { AppError } from '../utils/errors/AppError';
import { AuthenticatedRequest } from '../types';
import { Role } from '@prisma/client';

export const authorize = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied', 403));
    }

    next();
  };
};
