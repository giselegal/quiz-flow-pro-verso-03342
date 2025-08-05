import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import type { BlockComponentProps } from "@/types/blocks";

const QuizOfferCountdownBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    countdownMinutes = 15,
    title = "Oferta expira em:",
    backgroundColor = "#dc2626",
    textColor = "#ffffff",
  } = block?.properties || {};

  const [timeLeft, setTimeLeft] = useState(countdownMinutes * 60);

  useEffect(() => {
    if (!isEditing) {
      const timer = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isEditing, countdownMinutes]);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`
        w-full py-4 px-4 transition-all duration-200
        ${isSelected ? "ring-1 ring-gray-400/40 bg-gray-50/30" : "hover:shadow-sm"}
        ${className}
      `}
      style={{ backgroundColor }}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4">
          <Clock className="w-6 h-6" style={{ color: textColor }} />
          <span className="text-lg font-semibold" style={{ color: textColor }}>
            {title}
          </span>
          <span className="text-3xl font-bold font-mono" style={{ color: textColor }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizOfferCountdownBlock;
