'use client';

import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationComponentProps extends NotificationProps {
  onRemove: (id: string) => void;
}

const notificationStyles = {
  success: {
    bg: 'bg-green-900/90',
    border: 'border-green-500',
    icon: FaCheckCircle,
    iconColor: 'text-green-400'
  },
  error: {
    bg: 'bg-red-900/90',
    border: 'border-red-500',
    icon: FaExclamationTriangle,
    iconColor: 'text-red-400'
  },
  info: {
    bg: 'bg-blue-900/90',
    border: 'border-blue-500',
    icon: FaInfoCircle,
    iconColor: 'text-blue-400'
  },
  warning: {
    bg: 'bg-yellow-900/90',
    border: 'border-yellow-500',
    icon: FaExclamationTriangle,
    iconColor: 'text-yellow-400'
  }
};

export default function Notification({ id, type, title, message, duration = 5000, onRemove }: NotificationComponentProps) {
  const [isVisible, setIsVisible] = useState(true);
  const styles = notificationStyles[type];
  const Icon = styles.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(id), 300); // Remove after animation
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full ${styles.bg} backdrop-blur-xl border ${styles.border} rounded-xl shadow-2xl`}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <Icon className={`mt-0.5 flex-shrink-0 ${styles.iconColor}`} size={20} />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
                <p className="text-sm text-gray-200">{message}</p>
              </div>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => onRemove(id), 300);
                }}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Notification Manager Hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notification: Omit<NotificationProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration });
  };

  const showError = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration });
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration });
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration });
  };

  return {
    notifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeNotification
  };
}

// Notification Container Component
export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
}
