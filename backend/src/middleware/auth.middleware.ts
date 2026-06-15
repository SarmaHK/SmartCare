import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/errors/AppError';
import { AuthenticatedRequest, JwtPayload } from '../types';

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Unauthorized', 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Unauthorized', 401));
    } else {
      next(error);
    }
  }
};
