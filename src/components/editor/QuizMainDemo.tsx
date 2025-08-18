import React from 'react';
import { QuizDemoApp } from './interactive/QuizDemoApp';

/**
 * 🎯 PÁGINA PRINCIPAL DE DEMONSTRAÇÃO
 *
 * Ponto de entrada para demonstrar todas as funcionalidades implementadas
 */
export const QuizMainDemo: React.FC = () => {
  return (
    <div className="w-full h-full">
      <QuizDemoApp />
    </div>
  );
};
