
import React from 'react';
import { useNode } from '@craftjs/core';

export const CraftFormBlock: React.FC = () => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group p-4 border rounded-lg"
    >
      <form className="space-y-4">
        <input type="text" placeholder="Nome" className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          Enviar
        </button>
      </form>
    </div>
  );
};

(CraftFormBlock as any).craft = {
  displayName: 'Formulário'
};
