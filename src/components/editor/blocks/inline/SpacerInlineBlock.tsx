import React from 'react';
import { cn } from '../../../../lib/utils';

interface SpacerInlineBlockProps {
  height?: number;
  width?: number;
  className?: string;
  [key: string]: any;
}

const SpacerInlineBlock: React.FC<SpacerInlineBlockProps> = ({
  height = 40,
  width = 100,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-lg",
        className
      )}
      style={{ height: `${height}px`, width: `${width}%` }}
      {...props}
    >
      <span className="text-xs text-gray-400 font-medium">
        Espaçador ({height}px)
      </span>
    </div>
  );
};

export default SpacerInlineBlock;
