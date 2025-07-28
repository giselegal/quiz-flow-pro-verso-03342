
import React from 'react';
import { useNode } from '@craftjs/core';

export const CraftGuaranteeBlock: React.FC = () => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group p-6 border rounded-lg bg-green-50"
    >
      <h3 className="text-lg font-bold mb-2">🛡️ Garantia de 30 dias</h3>
      <p className="text-gray-700">Devolução garantida...</p>
    </div>
  );
};

(CraftGuaranteeBlock as any).craft = {
  displayName: 'Garantia'
};
