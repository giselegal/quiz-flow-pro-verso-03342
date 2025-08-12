import React, { useEffect, useState } from 'react';

interface EditorNotificationProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
}

export const EditorNotification: React.FC<EditorNotificationProps> = ({
  message,
  type = 'success',
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: {
      background: 'linear-gradient(135deg, #10B981, #059669)',
      color: '#ffffff',
      border: '1px solid #059669',
    },
    info: {
      background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
      color: '#ffffff',
      border: '1px solid #2563EB',
    },
    warning: {
      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
      color: '#ffffff',
      border: '1px solid #D97706',
    },
    error: {
      background: 'linear-gradient(135deg, #EF4444, #DC2626)',
      color: '#ffffff',
      border: '1px solid #DC2626',
    },
  };

  const typeIcons = {
    success: '✅',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        maxWidth: '400px',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: '500',
        animation: 'slideInRight 0.3s ease-out',
        backdropFilter: 'blur(10px)',
        ...typeStyles[type],
      }}
    >
      <span style={{ fontSize: '18px' }}>{typeIcons[type]}</span>
      <div style={{ flex: 1 }}>{message}</div>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '0',
          opacity: 0.8,
        }}
      >
        ×
      </button>
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default EditorNotification;
