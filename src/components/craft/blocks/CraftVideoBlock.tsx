
import React from 'react';
import { useNode } from '@craftjs/core';

export const CraftVideoBlock: React.FC = () => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group"
    >
      <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
        <p className="text-gray-500">Vídeo</p>
      </div>
    </div>
  );
};

(CraftVideoBlock as any).craft = {
  displayName: 'Vídeo'
};
