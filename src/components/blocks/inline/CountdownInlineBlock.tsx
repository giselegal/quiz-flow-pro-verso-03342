import { cn } from "../../../lib/utils";
import type { BlockComponentProps } from "../../../types/blocks";
import { InlineBlockProps } from "../../../types/inlineBlocks";
import React, { useEffect, useState } from "react";

interface Props extends BlockComponentProps {
  // Props específicas do componente
}

interface Props extends BlockComponentProps {
  // Props específicas do componente
}

interface Props extends BlockComponentProps {
  // Props específicas do componente
}

interface Props extends BlockComponentProps {
  // Props específicas do componente
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value: string | number, type: string): string => {
  const numValue = typeof value === "string" ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return "";

  const prefix =
    type === "top"
      ? "mt"
      : type === "bottom"
        ? "mb"
        : type === "left"
          ? "ml"
          : "mr";

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

const CountdownInlineBlock: React.FC<InlineBlockProps> = ({
  block,
  onPropertyChange,
  isSelected,
  onClick,
}) => {
  // Safety check for block and properties
  if (!block) {
    console.warn("⚠️ CountdownInlineBlock: block is undefined");
    return <div style={{ color: "#432818" }}>Error: Block not found</div>;
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

  const {
    size = "md",
    theme = "default",
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
  } = style;

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
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
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
        return "bg-[#432818]/10 border-[#432818]/30 text-[#432818]";
      default:
        return "bg-[#432818]/10 border-[#432818]/30 text-[#432818]";
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
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, "top"),
        getMarginClass(marginBottom, "bottom"),
        getMarginClass(marginLeft, "left"),
        getMarginClass(marginRight, "right")
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
          isSelected && "ring-2 ring-[#432818] ring-offset-2"
        )}
      >
        <div style={{ color: "#6B4F43" }}>{expiredMessage}</div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-200",
        isSelected && "ring-2 ring-[#432818] ring-offset-2"
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
