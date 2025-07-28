
import React from 'react';
import { useNode } from '@craftjs/core';

export const CraftProgressBlock: React.FC = () => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group p-4"
    >
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
      </div>
      <p className="text-sm text-gray-600 mt-2">Progresso: 3/10</p>
    </div>
  );
};

(CraftProgressBlock as any).craft = {
  displayName: 'Progresso'
};
