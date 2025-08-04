import React from "react";
import { StyleResult } from "@/types/quiz";

export interface PrimaryStyleCardProps {
  primaryStyle: StyleResult;
  customDescription?: any;
  customImage?: any;
}

export const PrimaryStyleCard: React.FC<PrimaryStyleCardProps> = ({
  primaryStyle,
  customDescription,
  customImage,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-2">{primaryStyle.category}</h3>
      <p className="text-gray-600 mb-4">
        {customDescription ||
          `Seu estilo predominante é ${primaryStyle.category}`}
      </p>
      {customImage && (
        <img
          src={customImage}
          alt={primaryStyle.category}
          className="w-full rounded-lg"
        />
      )}
    </div>
  );
};

export default PrimaryStyleCard;
