
import React from 'react';
import { useNode } from '@craftjs/core';

export const CraftSocialProofBlock: React.FC = () => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group p-6 border rounded-lg text-center"
    >
      <p className="text-2xl font-bold">1.000+</p>
      <p className="text-gray-600">Pessoas já participaram</p>
    </div>
  );
};

(CraftSocialProofBlock as any).craft = {
  displayName: 'Prova Social'
};
