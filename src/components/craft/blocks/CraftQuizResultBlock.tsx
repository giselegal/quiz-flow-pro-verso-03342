
import React from 'react';
import { useNode } from '@craftjs/core';

interface CraftQuizResultBlockProps {
  title: string;
  description: string;
}

export const CraftQuizResultBlock: React.FC<CraftQuizResultBlockProps> = ({
  title = 'Seu Resultado',
  description = 'Baseado em suas respostas...'
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group p-6 border rounded-lg bg-blue-50"
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

(CraftQuizResultBlock as any).craft = {
  displayName: 'Resultado Quiz',
  props: {
    title: 'Seu Resultado',
    description: 'Baseado em suas respostas...'
  }
};
