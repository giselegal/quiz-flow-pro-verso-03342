
import React from 'react';
import { useNode } from '@craftjs/core';

interface CraftOfferBlockProps {
  title: string;
  price: string;
}

export const CraftOfferBlock: React.FC<CraftOfferBlockProps> = ({
  title = 'Oferta Especial',
  price = 'R$ 97'
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group p-6 border rounded-lg bg-green-50"
    >
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-3xl font-bold text-green-600">{price}</p>
    </div>
  );
};

(CraftOfferBlock as any).craft = {
  displayName: 'Oferta',
  props: {
    title: 'Oferta Especial',
    price: 'R$ 97'
  }
};
