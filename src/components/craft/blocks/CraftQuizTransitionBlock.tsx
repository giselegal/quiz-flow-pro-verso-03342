
import React from 'react';
import { useNode } from '@craftjs/core';

interface CraftQuizTransitionBlockProps {
  message: string;
}

export const CraftQuizTransitionBlock: React.FC<CraftQuizTransitionBlockProps> = ({
  message = 'Calculando resultado...'
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group text-center p-8"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-lg">{message}</p>
    </div>
  );
};

(CraftQuizTransitionBlock as any).craft = {
  displayName: 'Transição Quiz',
  props: {
    message: 'Calculando resultado...'
  }
};
