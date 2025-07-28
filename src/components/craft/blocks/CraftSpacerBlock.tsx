
import React from 'react';
import { useNode } from '@craftjs/core';

interface CraftSpacerBlockProps {
  height: number;
}

export const CraftSpacerBlock: React.FC<CraftSpacerBlockProps> = ({
  height = 40
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group bg-gray-100 border-2 border-dashed border-gray-300"
      style={{ height: `${height}px` }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
        Espaçador ({height}px)
      </div>
    </div>
  );
};

(CraftSpacerBlock as any).craft = {
  displayName: 'Espaçador',
  props: {
    height: 40
  }
};
