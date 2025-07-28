
import React from 'react';
import { useNode } from '@craftjs/core';

export const CraftCountdownBlock: React.FC = () => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group p-6 border rounded-lg text-center"
    >
      <div className="text-2xl font-bold text-red-600">
        15:00
      </div>
      <p className="text-sm text-gray-600">Tempo restante</p>
    </div>
  );
};

(CraftCountdownBlock as any).craft = {
  displayName: 'Contador'
};
