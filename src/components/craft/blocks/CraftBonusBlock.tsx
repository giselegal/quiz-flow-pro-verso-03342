
import React from 'react';
import { useNode } from '@craftjs/core';

export const CraftBonusBlock: React.FC = () => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group p-6 border rounded-lg bg-yellow-50"
    >
      <h3 className="text-lg font-bold mb-2">🎁 Bônus Especial</h3>
      <p className="text-gray-700">Receba gratuitamente...</p>
    </div>
  );
};

(CraftBonusBlock as any).craft = {
  displayName: 'Bônus'
};
