
import React from 'react';
import { useNode } from '@craftjs/core';

export const CraftFAQBlock: React.FC = () => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group p-6 border rounded-lg"
    >
      <h3 className="font-bold mb-2">Perguntas Frequentes</h3>
      <div className="space-y-2">
        <div className="p-2 border rounded">
          <p className="font-semibold">Pergunta 1?</p>
          <p className="text-sm text-gray-600">Resposta...</p>
        </div>
      </div>
    </div>
  );
};

(CraftFAQBlock as any).craft = {
  displayName: 'FAQ'
};
