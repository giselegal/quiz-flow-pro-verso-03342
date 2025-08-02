
import React from 'react';
import { StyleResult } from '@/types/quiz';

interface PrimaryStyleCardProps {
  style: StyleResult;
  className?: string;
}

export const PrimaryStyleCard: React.FC<PrimaryStyleCardProps> = ({ 
  style, 
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border ${className}`}>
      <h3 className="text-xl font-bold text-[#432818] mb-2">
        {style.category}
      </h3>
      <p className="text-[#8F7A6A] mb-4">
        {style.percentage.toFixed(1)}% de compatibilidade
      </p>
      {style.description && (
        <p className="text-sm text-[#8F7A6A]">
          {style.description}
        </p>
      )}
    </div>
  );
};

// Also export as default for compatibility
export default PrimaryStyleCard;
