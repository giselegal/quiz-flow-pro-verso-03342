
import React from 'react';
import { useNode } from '@craftjs/core';

export const CraftTestimonialBlock: React.FC = () => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group p-6 border rounded-lg"
    >
      <p className="italic mb-4">"Excelente produto!"</p>
      <p className="font-semibold">- Cliente Satisfeito</p>
    </div>
  );
};

(CraftTestimonialBlock as any).craft = {
  displayName: 'Depoimento'
};
