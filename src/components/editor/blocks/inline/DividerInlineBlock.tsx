import React from 'react';
import { cn } from '../../../../lib/utils';

interface DividerInlineBlockProps {
  style?: 'solid' | 'dashed' | 'dotted';
  thickness?: number;
  color?: string;
  marginY?: number;
  className?: string;
  [key: string]: any;
}

const DividerInlineBlock: React.FC<DividerInlineBlockProps> = ({
  style = 'solid',
  thickness = 1,
  color = '#e2e8f0',
  marginY = 20,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('w-full flex items-center justify-center', className)}
      style={{ marginTop: `${marginY}px`, marginBottom: `${marginY}px` }}
      {...props}
    >
      <hr
        className="w-full"
        style={{
          borderStyle: style,
          borderWidth: `${thickness}px 0 0 0`,
          borderColor: color,
          margin: 0,
        }}
      />
    </div>
  );
};

export default DividerInlineBlock;
