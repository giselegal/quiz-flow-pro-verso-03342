
import React from 'react';
import { BlockComponentProps } from '@/types/blocks';

const HeaderBlock: React.FC<BlockComponentProps> = ({ block, className = '' }) => {
  return (
    <div className={`header-block ${className}`}>
      <h1 className="text-2xl font-bold">
        {block.properties?.text || 'Header Text'}
      </h1>
    </div>
  );
};

export default HeaderBlock;
