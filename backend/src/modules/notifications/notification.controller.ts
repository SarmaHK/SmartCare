import { Response, NextFunction } from 'express';
import * as notificationService from './notification.service';
import { AuthenticatedRequest } from '../../types';

export const getMyNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const notifications = await notificationService.getMyNotifications(Number(req.user!.id));
    res.status(200).json({ success: true, message: 'Notifications fetched successfully', data: notifications });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const notification = await notificationService.markAsRead(Number(req.params.id), Number(req.user!.id));
    res.status(200).json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await notificationService.markAllAsRead(Number(req.user!.id));
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
