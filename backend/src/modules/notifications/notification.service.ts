import prisma from '../../config/prisma';

export const createNotification = async (userId: number, title: string, message: string) => {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
    }
  });
};

export const getMyNotifications = async (userId: number) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50 // Limit to 50 recent notifications
  });
};

export const markAsRead = async (id: number, userId: number) => {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== userId) {
    throw new Error('Notification not found');
  }

  return await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });
};

export const markAllAsRead = async (userId: number) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
};
