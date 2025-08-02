
import React from 'react';
import { cn } from '../../../../lib/utils';

interface SpacerInlineBlockProps {
  height?: string;
  backgroundColor?: string;
  className?: string;
  [key: string]: any;
}

const SpacerInlineBlock: React.FC<SpacerInlineBlockProps> = ({
  height = '2rem',
  backgroundColor = 'transparent',
  className,
  ...props
}) => {
  return (
    <div
      className={cn('w-full', className)}
      style={{
        height,
        backgroundColor
      }}
      {...props}
    />
  );
};

export default SpacerInlineBlock;
