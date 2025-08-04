import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Edit3,
  Bell,
  MessageSquare,
  User,
  DollarSign,
  AlertCircle,
} from "lucide-react";

type NotificationType = "message" | "user" | "payment" | "alert" | "general";

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

const NotificationInlineBlock: React.FC<NotificationInlineBlockProps> = ({
  notifications = [
    {
      id: "1",
      icon: "🗞️",
      title: "Novo evento",
      subtitle: "Cakto",
      backgroundColor: "rgb(0, 201, 167)",
    },
    {
      id: "2",
      icon: "💬",
      title: "Nova mensagem",
      subtitle: "Cakto",
      backgroundColor: "rgb(255, 61, 113)",
    },
    {
      id: "3",
      icon: "👤",
      title: "Usuário se cadastrou",
      subtitle: "Cakto",
      backgroundColor: "rgb(0, 201, 167)",
    },
    {
      id: "4",
      icon: "💸",
      title: "Pagamento recebido",
      subtitle: "Cakto",
      backgroundColor: "rgb(255, 184, 0)",
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
        "group/canvas-item inline-block relative w-full",
        "min-h-[1.25rem] border-2 border-dashed rounded-md p-4",
        "hover:border-blue-500 transition-all cursor-pointer",
        isHovered ? "border-blue-500" : "border-gray-300",
        disabled && "opacity-75 cursor-not-allowed",
        className,
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
                "mx-auto w-full transition-all duration-200 ease-in-out",
                animated && "hover:scale-[103%]",
              )}
              style={{
                opacity: 1,
                transform: "none",
                transformOrigin: "50% 0% 0px",
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
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onPropertyChange && !disabled) {
                          const newTitle = prompt(
                            "Novo título:",
                            notification.title,
                          );
                          if (newTitle !== null) {
                            const updatedNotifications = [...notifications];
                            updatedNotifications[index] = {
                              ...notification,
                              title: newTitle,
                            };
                            onPropertyChange(
                              "notifications",
                              updatedNotifications,
                            );
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
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onPropertyChange && !disabled) {
                          const newSubtitle = prompt(
                            "Novo subtítulo:",
                            notification.subtitle,
                          );
                          if (newSubtitle !== null) {
                            const updatedNotifications = [...notifications];
                            updatedNotifications[index] = {
                              ...notification,
                              subtitle: newSubtitle,
                            };
                            onPropertyChange(
                              "notifications",
                              updatedNotifications,
                            );
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
          <Edit3 className="w-4 h-4 text-blue-500" />
        </div>
      )}

      {/* Hover Toolbar (inspirado no modelo) */}
      {isHovered && !disabled && (
        <div className="absolute top-2 left-1 min-w-[50px] w-auto bg-blue-500 border-none rounded-md text-white p-0 flex flex-row z-50">
          <span className="flex items-center justify-center w-auto h-auto p-2 cursor-move hover:bg-blue-700">
            <Bell className="h-4 w-4" />
          </span>
          <span className="flex items-center justify-center w-auto h-auto p-2 cursor-pointer hover:bg-blue-700">
            <Edit3 className="h-4 w-4" />
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificationInlineBlock;
