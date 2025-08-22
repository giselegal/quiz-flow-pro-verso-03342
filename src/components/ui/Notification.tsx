import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg',
        'animate-in slide-in-from-right-full duration-300',
        typeStyles[type]
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icons[type]}</span>
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-2 text-gray-500 hover:text-gray-700"
          aria-label="Fechar notificação"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Hook para gerenciar notificações
export const useNotification = () => {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      message: string;
      type: 'success' | 'error' | 'warning' | 'info';
      duration?: number;
    }>
  >([]);

  const addNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration = 3000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type, duration }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotificationContainer = () => (
    <>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );

  return {
    addNotification,
    NotificationContainer,
    success: (message: string, duration?: number) =>
      addNotification(message, 'success', duration),
    error: (message: string, duration?: number) =>
      addNotification(message, 'error', duration),
    warning: (message: string, duration?: number) =>
      addNotification(message, 'warning', duration),
    info: (message: string, duration?: number) =>
      addNotification(message, 'info', duration),
  };
};
