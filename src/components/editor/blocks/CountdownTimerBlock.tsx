import React, { useState, useEffect } from "react";
import { InlineEditableText } from "./InlineEditableText";
import {
  Clock,
  Zap,
  AlertTriangle,
  Flame,
  Timer,
  Calendar,
} from "lucide-react";
import type { BlockComponentProps, CountdownTimerBlock } from "@/types/blocks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountdownTimerBlockProps extends BlockComponentProps {
  block: CountdownTimerBlock;
}

interface TimeUnit {
  value: number;
  label: string;
  shortLabel: string;
}

const CountdownTimerBlock: React.FC<CountdownTimerBlockProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    title = "Oferta por Tempo Limitado",
    subtitle = "Aproveite antes que expire!",
    endDate,
    durationMinutes = 15,
    urgencyText = "Restam apenas:",
    showDays = true,
    showHours = true,
    showMinutes = true,
    showSeconds = true,
    layout = "cards",
    theme = "urgent",
    autoStart = true,
    showUrgencyMessages = true,
    urgencyThreshold = 5,
    backgroundColor = "#ffffff",
    textColor = "#432818",
    accentColor = "#dc2626",
    pulseAnimation = true,
    showProgress = false,
  } = block.properties;

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });

  const [isExpired, setIsExpired] = useState(false);
  const [initialTotal, setInitialTotal] = useState(0);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  // Calculate target date
  const getTargetDate = () => {
    if (endDate) {
      return new Date(endDate);
    } else {
      // Use duration from now
      const now = new Date();
      return new Date(now.getTime() + durationMinutes * 60 * 1000);
    }
  };

  // Update countdown
  useEffect(() => {
    if (!autoStart || isEditing) return;

    const targetDate = getTargetDate();

    // Set initial total for progress calculation
    if (initialTotal === 0) {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      setInitialTotal(Math.max(0, Math.floor(diff / 1000)));
    }

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        setIsExpired(true);
        return;
      }

      const total = Math.floor(difference / 1000);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, total });
      setIsExpired(false);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [autoStart, isEditing, endDate, durationMinutes, initialTotal]);

  const getThemeClasses = () => {
    switch (theme) {
      case "elegant":
        return {
          container: "bg-gradient-to-r from-[#B89B7A] to-[#A68A6A] text-white",
          card: "bg-white/20 backdrop-blur-sm border border-white/30",
          text: "text-white",
          accent: "text-yellow-300",
        };
      case "minimal":
        return {
          container: "bg-gray-50 text-gray-800",
          card: "bg-white border border-gray-200",
          text: "text-gray-800",
          accent: "text-gray-600",
        };
      case "neon":
        return {
          container: "bg-black text-green-400",
          card: "bg-gray-900 border border-green-400 shadow-lg shadow-green-400/20",
          text: "text-green-400",
          accent: "text-green-300",
        };
      case "urgent":
      default:
        return {
          container: "bg-red-600 text-white",
          card: "bg-white/10 backdrop-blur-sm border border-white/20",
          text: "text-white",
          accent: "text-yellow-300",
        };
    }
  };

  const themeClasses = getThemeClasses();
  const isUrgent = timeLeft.total <= urgencyThreshold * 60 && !isExpired;
  const progressPercentage =
    initialTotal > 0
      ? ((initialTotal - timeLeft.total) / initialTotal) * 100
      : 0;

  const renderTimeUnit = (unit: TimeUnit, index: number) => {
    const shouldShow =
      (unit.label === "dias" && showDays) ||
      (unit.label === "horas" && showHours) ||
      (unit.label === "minutos" && showMinutes) ||
      (unit.label === "segundos" && showSeconds);

    if (!shouldShow) return null;

    switch (layout) {
      case "compact":
        return (
          <span key={unit.label} className="inline-flex items-baseline gap-1">
            <span
              className={cn(
                "text-xl sm:text-2xl md:text-3xl font-bold tabular-nums",
                pulseAnimation && isUrgent && "animate-pulse",
              )}
            >
              {unit.value.toString().padStart(2, "0")}
            </span>
            <span className="text-xs sm:text-sm opacity-80">
              {unit.shortLabel}
            </span>
            {index < 3 && <span className="mx-0.5 sm:mx-1 opacity-60">:</span>}
          </span>
        );

      case "digital":
        return (
          <div key={unit.label} className="flex flex-col items-center">
            <div
              className={cn(
                "bg-black/80 text-green-400 px-2 py-1 sm:px-3 sm:py-2 rounded font-mono text-xl sm:text-2xl md:text-3xl font-bold border",
                "border-green-400/30 shadow-lg",
                pulseAnimation && isUrgent && "animate-pulse",
              )}
            >
              {unit.value.toString().padStart(2, "0")}
            </div>
            <span className="text-xs mt-1 opacity-80">{unit.label}</span>
          </div>
        );

      case "circular":
        const circumference = 2 * Math.PI * 40;
        const strokeDasharray = circumference;
        const strokeDashoffset =
          circumference -
          (unit.value / (unit.label === "segundos" ? 60 : 24)) * circumference;

        return (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20">
              <svg
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="opacity-20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={accentColor}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={cn(
                    "text-base sm:text-lg md:text-xl font-bold tabular-nums",
                    pulseAnimation && isUrgent && "animate-pulse",
                  )}
                >
                  {unit.value}
                </span>
              </div>
            </div>
            <span className="text-xs mt-1 opacity-80">{unit.label}</span>
          </div>
        );

      case "cards":
      default:
        return (
          <motion.div
            key={unit.label}
            initial={{ scale: 1 }}
            animate={{
              scale:
                pulseAnimation && isUrgent && unit.label === "segundos"
                  ? [1, 1.05, 1]
                  : 1,
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Card className={themeClasses.card}>
              <CardContent className="p-3 sm:p-4 text-center">
                <div
                  className={cn(
                    "text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums mb-1",
                    themeClasses.text,
                  )}
                >
                  {unit.value.toString().padStart(2, "0")}
                </div>
                <div
                  className={cn(
                    "text-xs sm:text-sm opacity-80",
                    themeClasses.accent,
                  )}
                >
                  {unit.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  const units: TimeUnit[] = [
    { value: timeLeft.days, label: "dias", shortLabel: "d" },
    { value: timeLeft.hours, label: "horas", shortLabel: "h" },
    { value: timeLeft.minutes, label: "minutos", shortLabel: "m" },
    { value: timeLeft.seconds, label: "segundos", shortLabel: "s" },
  ];

  const getUrgencyMessage = () => {
    if (!showUrgencyMessages) return null;

    if (isExpired) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 text-red-600 font-bold"
        >
          <AlertTriangle className="w-5 h-5" />
          Oferta Expirada!
        </motion.div>
      );
    }

    if (isUrgent) {
      return (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="flex items-center justify-center gap-2 text-red-500 font-bold"
        >
          <Flame className="w-5 h-5" />
          Últimos minutos!
        </motion.div>
      );
    }

    return null;
  };

  if (!autoStart && isEditing) {
    // Show static preview in editing mode
    return (
      <div
        className={cn(
          "bg-gray-100 p-4 sm:p-6 md:p-8 rounded-lg text-gray-500 flex flex-col items-center justify-center min-h-[150px] sm:min-h-[180px] md:min-h-[200px] cursor-pointer transition-all duration-200",
          isSelected && "ring-1 ring-gray-400/40 bg-gray-50/30",
          !isSelected && "hover:shadow-sm",
          className,
        )}
        onClick={onClick}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <Timer className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 sm:mb-4 opacity-50" />
        <p className="text-center text-sm sm:text-base">
          Countdown Timer (Preview)
        </p>
        <p className="text-xs sm:text-sm text-center mt-2">
          Configure o timer no painel de propriedades
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "py-4 sm:py-6 md:py-8 px-4 cursor-pointer transition-all duration-200 w-full",
        isSelected && "ring-1 ring-gray-400/40 bg-gray-50/30",
        !isSelected && "hover:shadow-sm",
        themeClasses.container,
        className,
      )}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
      style={{
        backgroundColor:
          backgroundColor !== "#ffffff" ? backgroundColor : undefined,
      }}
    >
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        {title && (
          <h2
            className={cn(
              "text-xl sm:text-2xl md:text-3xl font-bold mb-2",
              themeClasses.text,
            )}
          >
            <InlineEditableText
              value={title}
              onChange={(value: string) => handlePropertyChange("title", value)}
              className="inline-block"
              placeholder="Título do countdown"
            />
          </h2>
        )}
        {subtitle && (
          <p
            className={cn(
              "text-base sm:text-lg mb-3 sm:mb-4",
              themeClasses.accent,
            )}
          >
            <InlineEditableText
              value={subtitle}
              onChange={(value: string) =>
                handlePropertyChange("subtitle", value)
              }
              className="inline-block"
              placeholder="Subtítulo do countdown"
            />
          </p>
        )}

        {urgencyText && !isExpired && (
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">
              {urgencyText}
            </span>
          </div>
        )}

        {getUrgencyMessage()}
      </div>

      {/* Timer Display */}
      <div className="max-w-4xl mx-auto">
        {layout === "compact" ? (
          <div className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold font-mono">
            {units.map((unit, index) => renderTimeUnit(unit, index))}
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-3 sm:gap-4 justify-center",
              layout === "circular" ? "grid-cols-2" : "grid-cols-2",
            )}
          >
            {units.map((unit, index) => renderTimeUnit(unit, index))}
          </div>
        )}

        {/* Progress Bar */}
        {showProgress && initialTotal > 0 && !isExpired && (
          <div className="mt-6 sm:mt-8">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-center text-xs sm:text-sm mt-2 opacity-80">
              {Math.round(progressPercentage)}% da oferta já expirou
            </p>
          </div>
        )}
      </div>

      {/* Editor Info */}
      {isEditing && (
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-black/20 rounded-md">
          <p className="text-xs sm:text-sm opacity-80">
            Modo de edição: Layout {layout} • Tema {theme} •
            {isExpired ? "Expirado" : `${timeLeft.total}s restantes`}
          </p>
        </div>
      )}
    </div>
  );
};

export default CountdownTimerBlock;
