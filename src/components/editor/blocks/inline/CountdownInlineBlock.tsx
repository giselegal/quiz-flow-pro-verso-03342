import React, { useState, useEffect } from "react";
import { InlineBlockProps } from "@/types/inlineBlocks";
import { cn } from "@/lib/utils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownInlineBlock: React.FC<InlineBlockProps> = ({
  block,
  onPropertyChange,
  isSelected,
  onClick,
}) => {
  // Safety check for block and properties
  if (!block) {
    console.warn("⚠️ CountdownInlineBlock: block is undefined");
    return (
      <div className="p-2 bg-red-50 text-red-600">Error: Block not found</div>
    );
  }

  // Safe destructuring with fallbacks
  const properties = block.properties || {};
  const content = properties.content || {};
  const style = properties.style || {};

  const {
    targetDate = "",
    format = "full",
    expiredMessage = "Tempo esgotado!",
  } = content;

  const { size = "md", theme = "default" } = style;

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  console.log("🔄 CountdownInlineBlock render:", {
    blockId: block.id,
    hasProperties: !!block.properties,
    targetDate,
    format,
  });

  useEffect(() => {
    if (!targetDate) return;

    const updateCountdown = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return { number: "text-xl", label: "text-xs", container: "p-2" };
      case "md":
        return { number: "text-2xl", label: "text-sm", container: "p-3" };
      case "lg":
        return { number: "text-4xl", label: "text-base", container: "p-4" };
      default:
        return { number: "text-2xl", label: "text-sm", container: "p-3" };
    }
  };

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case "urgent":
        return "bg-red-50 border-red-200 text-red-800";
      case "elegant":
        return "bg-gray-50 border-gray-200 text-gray-800";
      case "default":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const sizeClasses = getSizeClasses(size);
  const themeClasses = getThemeClasses(theme);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div
      className={cn(
        "text-center border rounded-lg",
        sizeClasses.container,
        themeClasses,
      )}
    >
      <div className={cn("font-bold", sizeClasses.number)}>{value}</div>
      <div className={cn("uppercase", sizeClasses.label)}>{label}</div>
    </div>
  );

  if (isExpired) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "text-center cursor-pointer p-4 rounded-lg transition-all duration-200",
          "bg-gray-50 border border-gray-200",
          isSelected && "ring-2 ring-blue-500 ring-offset-2",
        )}
      >
        <div className="text-lg font-medium text-gray-600">
          {expiredMessage}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-200",
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
      )}
    >
      <div className="flex justify-center space-x-2">
        {format === "full" && (
          <>
            <TimeUnit value={timeLeft.days} label="dias" />
            <TimeUnit value={timeLeft.hours} label="horas" />
            <TimeUnit value={timeLeft.minutes} label="min" />
            <TimeUnit value={timeLeft.seconds} label="seg" />
          </>
        )}

        {format === "hours" && (
          <>
            <TimeUnit
              value={timeLeft.hours + timeLeft.days * 24}
              label="horas"
            />
            <TimeUnit value={timeLeft.minutes} label="min" />
          </>
        )}

        {format === "minutes" && (
          <TimeUnit
            value={
              timeLeft.minutes + timeLeft.hours * 60 + timeLeft.days * 24 * 60
            }
            label="minutos"
          />
        )}
      </div>
    </div>
  );
};

export default CountdownInlineBlock;
