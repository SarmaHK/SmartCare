import React, { useState, useEffect, useRef } from 'react';
import { Bell, Clock } from 'lucide-react';
import { notificationService, type Notification } from '../../services/notification.service';
import { cn } from '../../utils/cn';
import { formatDistanceToNow } from 'date-fns';

export const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getMyNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-secondary-400 transition-colors hover:bg-secondary-50 hover:text-secondary-600"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right overflow-hidden rounded-xl border border-secondary-200 bg-white py-1 shadow-soft-lg z-50 animate-slide-up flex flex-col max-h-[400px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-secondary-100">
            <h3 className="font-semibold text-secondary-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-secondary-500 flex flex-col items-center">
                <Bell className="h-8 w-8 text-secondary-300 mb-2" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-secondary-100">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={cn(
                      "p-4 transition-colors hover:bg-secondary-50 cursor-pointer group relative",
                      !notification.isRead && "bg-primary-50/50"
                    )}
                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                  >
                    {!notification.isRead && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary-500" />
                    )}
                    <div className="pl-3">
                      <p className={cn("text-sm font-medium mb-1", !notification.isRead ? "text-secondary-900" : "text-secondary-700")}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-secondary-600 line-clamp-2 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-secondary-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
