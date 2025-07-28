
import React from 'react';
import { useNode } from '@craftjs/core';

export const CraftPricingBlock: React.FC = () => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group p-6 border rounded-lg text-center"
    >
      <p className="text-sm text-gray-500 line-through">R$ 197</p>
      <p className="text-3xl font-bold text-green-600">R$ 97</p>
    </div>
  );
};

(CraftPricingBlock as any).craft = {
  displayName: 'Preço'
};
