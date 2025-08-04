import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Edit3 } from 'lucide-react';

interface LoaderInlineBlockProps {
  title?: string;
  percentage?: number;
  description?: string;
  animated?: boolean;
  color?: string;
  onClick?: () => void;
  className?: string;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

const LoaderInlineBlock: React.FC<LoaderInlineBlockProps> = ({
  title = 'Carregando...',
  percentage = 60,
  description = 'Analisando seu estilo pessoal...',
  animated = true,
  color = '#B89B7A',
  onClick,
  className,
  onPropertyChange,
  disabled = false,
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentProgress(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCurrentProgress(percentage);
    }
  }, [percentage, animated]);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'group/canvas-item inline-block w-full',
        'min-h-[1.25rem] relative border-2 border-dashed rounded-md p-4',
        'hover:border-2 hover:border-blue-500 transition-all cursor-pointer',
        isHovered ? 'border-blue-500' : 'border-gray-300',
        disabled && 'opacity-75 cursor-not-allowed',
        className,
      )}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid w-full items-center gap-1.5">
        {/* Header */}
        <div className="w-full flex justify-between flex-row">
          <div className="font-bold text-[#432818]">{title}</div>
          <div className="font-normal text-[#8F7A6A]">{percentage}%</div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-zinc-300">
          <div
            className="h-full w-full flex-1 transition-all duration-1000 ease-out rounded-full"
            style={{
              backgroundColor: color,
              transform: `translateX(-${100 - currentProgress}%)`,
            }}
          />
        </div>

        {/* Description */}
        <div className="text-[#8F7A6A] font-normal mt-2 text-center text-sm">{description}</div>
      </div>

      {/* Edit indicator */}
      {!disabled && (
        <div className="absolute top-2 right-2 opacity-0 group-hover/canvas-item:opacity-100 transition-opacity">
          <Edit3 className="w-4 h-4 text-blue-500" />
        </div>
      )}
    </div>
  );
};

export default LoaderInlineBlock;
