
import React from 'react';
import { cn } from '@/lib/utils';

export interface StyleResultData {
  id: string;
  name: string;
  description: string;
  percentage: number;
  imageUrl: string;
  characteristics: string[];
}

export interface StyleResultProps {
  primaryStyle: StyleResultData;
  showPercentage?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const StyleResult: React.FC<StyleResultProps> = ({
  primaryStyle,
  showPercentage = true,
  style,
  className
}) => {
  return (
    <div 
      className={cn(
        'bg-white p-8 rounded-xl shadow-lg border-2 border-[#B89B7A]/20',
        'text-center max-w-md mx-auto',
        className
      )}
      style={style}
    >
      <div className="mb-6">
        <img 
          src={primaryStyle.imageUrl} 
          alt={primaryStyle.name}
          className="w-32 h-32 mx-auto rounded-full object-cover shadow-md"
        />
      </div>
      
      <h2 className="text-2xl font-bold text-[#432818] mb-4">
        {primaryStyle.name}
      </h2>
      
      {showPercentage && (
        <div className="mb-4">
          <span className="text-3xl font-bold text-[#B89B7A]">
            {primaryStyle.percentage}%
          </span>
          <p className="text-sm text-[#8F7A6A] mt-1">
            compatibilidade
          </p>
        </div>
      )}
      
      <p className="text-[#5D4A3A] mb-6 leading-relaxed">
        {primaryStyle.description}
      </p>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#432818]">
          Características:
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {primaryStyle.characteristics.map((char, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[#B89B7A]/20 text-[#432818] rounded-full text-sm"
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StyleResult;
