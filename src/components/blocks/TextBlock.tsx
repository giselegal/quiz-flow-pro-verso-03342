
import React from 'react';
import { BlockComponentProps } from '@/types/blocks';

const TextBlock: React.FC<BlockComponentProps> = ({ block, className = '' }) => {
  return (
    <div className={`text-block ${className}`}>
      <p className="text-base">
        {block.properties?.text || 'Text content'}
      </p>
    </div>
  );
};

export default TextBlock;
