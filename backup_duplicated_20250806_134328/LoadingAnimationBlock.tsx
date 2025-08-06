import React from "react";
import { cn } from "@/lib/utils";
import type { BlockData } from "@/types/blocks";

interface LoadingAnimationProps {
  block: BlockData;
  className?: string;
  onUpdate?: (updates: Partial<BlockData>) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

const LoadingAnimationBlock: React.FC<LoadingAnimationProps> = ({
  block,
  className,
  onUpdate,
  isSelected,
  onSelect,
}) => {
  const properties = block.properties || {};
  const { type = "spinner", size = "medium", color = "#B89B7A", duration = 3000 } = properties;

  const handleClick = () => {
    onSelect?.();
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case "small":
        return "w-6 h-6";
      case "large":
        return "w-12 h-12";
      default:
        return "w-8 h-8";
    }
  };

  const renderSpinner = () => (
    <div
      className={cn("animate-spin rounded-full border-2 border-gray-300", getSizeClass(size))}
      style={{
        borderTopColor: color,
        animationDuration: `${duration / 1000}s`,
      }}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={cn(
            "rounded-full animate-pulse",
            size === "small" ? "w-2 h-2" : size === "large" ? "w-4 h-4" : "w-3 h-3"
          )}
          style={{
            backgroundColor: color,
            animationDelay: `${i * 200}ms`,
            animationDuration: `${duration / 1000}s`,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn("rounded-full animate-pulse", getSizeClass(size))}
      style={{
        backgroundColor: color,
        animationDuration: `${duration / 1000}s`,
      }}
    />
  );

  const renderAnimation = () => {
    switch (type) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  return (
    <div
      className={cn(
        "loading-animation w-full flex items-center justify-center py-8",
        "transition-all duration-200",
        isSelected && "ring-2 ring-[#B89B7A] bg-[#B89B7A]/10",
        className
      )}
      onClick={handleClick}
    >
      {renderAnimation()}
    </div>
  );
};

export default LoadingAnimationBlock;
