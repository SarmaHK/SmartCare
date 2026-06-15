import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors/AppError';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any[] | undefined = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    const issues = err.issues ?? (err as { errors?: typeof err.issues }).errors ?? [];
    const fieldLabels: Record<string, string> = {
      fullName: 'Full name',
      email: 'Email',
      password: 'Password',
      phone: 'Phone number',
      role: 'Role',
    };
    errors = issues.map((issue) => {
      const field = String(issue.path[issue.path.length - 1] ?? 'field');
      const label = fieldLabels[field] || field;
      let fieldMessage = issue.message;
      if (issue.code === 'invalid_type' && (issue as { received?: string }).received === 'undefined') {
        fieldMessage = `${label} is required`;
      }
      return { path: issue.path, field, message: fieldMessage };
    });
    message =
      errors.length === 1
        ? (errors[0] as { message: string }).message
        : errors.map((e: { message: string }) => e.message).join('. ');
  } else {
    // Log unexpected errors
    logger.error('Unexpected Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
