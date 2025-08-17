// @ts-nocheck
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Edit3, Bell, MessageSquare, User, DollarSign, AlertCircle } from 'lucide-react';

type NotificationType = 'message' | 'user' | 'payment' | 'alert' | 'general';

interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
}

interface NotificationInlineBlockProps {
  notifications?: NotificationItem[];
  maxVisible?: number;
  animated?: boolean;
  onClick?: () => void;
  className?: string;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const NotificationInlineBlock: React.FC<NotificationInlineBlockProps> = ({
  notifications = [
    {
      id: '1',
      icon: '🗞️',
      title: 'Novo evento',
      subtitle: 'Cakto',
      backgroundColor: 'rgb(0, 201, 167)',
    },
    {
      id: '2',
      icon: '💬',
      title: 'Nova mensagem',
      subtitle: 'Cakto',
      backgroundColor: 'rgb(255, 61, 113)',
    },
    {
      id: '3',
      icon: '👤',
      title: 'Usuário se cadastrou',
      subtitle: 'Cakto',
      backgroundColor: 'rgb(0, 201, 167)',
    },
    {
      id: '4',
      icon: '💸',
      title: 'Pagamento recebido',
      subtitle: 'Cakto',
      backgroundColor: 'rgb(255, 184, 0)',
    },
  ],
  maxVisible = 4,
  animated = true,
  onClick,
  className,
  onPropertyChange,
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const visibleNotifications = notifications.slice(0, maxVisible);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'group/canvas-item inline-block relative w-full',
        'min-h-[1.25rem] border-2 border-dashed rounded-md p-4',
        'hover:border-[#B89B7A] transition-all cursor-pointer',
        isHovered ? 'border-[#B89B7A]' : 'border-gray-300',
        disabled && 'opacity-75 cursor-not-allowed',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex h-fit w-full flex-col overflow-hidden pb-2">
        <div className="flex flex-col items-center gap-4">
          {visibleNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={cn(
                'mx-auto w-full transition-all duration-200 ease-in-out',
                animated && 'hover:scale-[103%]'
              )}
              style={{
                opacity: 1,
                transform: 'none',
                transformOrigin: '50% 0% 0px',
              }}
            >
              <figure className="relative mx-auto min-h-fit w-full max-w-sm cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-200 ease-in-out hover:scale-[103%] bg-white shadow-sm border border-gray-100">
                <div className="flex flex-row items-center gap-3">
                  <div
                    className="flex size-10 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: notification.backgroundColor }}
                  >
                    <span className="text-lg">{notification.icon}</span>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <figcaption
                      className="flex flex-row items-center whitespace-pre text-lg font-medium cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        if (onPropertyChange && !disabled) {
                          const newTitle = prompt('Novo título:', notification.title);
                          if (newTitle !== null) {
                            const updatedNotifications = [...notifications];
                            updatedNotifications[index] = {
                              ...notification,
                              title: newTitle,
                            };
                            onPropertyChange('notifications', updatedNotifications);
                          }
                        }
                      }}
                    >
                      <span className="text-sm sm:text-lg text-[#432818]">
                        {notification.title}
                      </span>
                    </figcaption>
                    <p
                      className="text-sm font-normal text-[#8F7A6A] cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        if (onPropertyChange && !disabled) {
                          const newSubtitle = prompt('Novo subtítulo:', notification.subtitle);
                          if (newSubtitle !== null) {
                            const updatedNotifications = [...notifications];
                            updatedNotifications[index] = {
                              ...notification,
                              subtitle: newSubtitle,
                            };
                            onPropertyChange('notifications', updatedNotifications);
                          }
                        }
                      }}
                    >
                      {notification.subtitle}
                    </p>
                  </div>
                </div>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* Edit indicator */}
      {!disabled && (
        <div className="absolute top-2 right-2 opacity-0 group-hover/canvas-item:opacity-100 transition-opacity z-50">
          <Edit3 className="w-4 h-4 text-[#B89B7A]" />
        </div>
      )}

      {/* Hover Toolbar (inspirado no modelo) */}
      {isHovered && !disabled && (
        <div className="absolute top-2 left-1 min-w-[50px] w-auto bg-[#B89B7A]/100 border-none rounded-md text-white p-0 flex flex-row z-50">
          <span className="flex items-center justify-center w-auto h-auto p-2 cursor-move hover:bg-[#A38A69]">
            <Bell className="h-4 w-4" />
          </span>
          <span className="flex items-center justify-center w-auto h-auto p-2 cursor-pointer hover:bg-[#A38A69]">
            <Edit3 className="h-4 w-4" />
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificationInlineBlock;
