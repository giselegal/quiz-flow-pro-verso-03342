import React from 'react';
import { StyleResult } from '@/types/quiz';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/Card';

interface ResultTestProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
}

export const ResultTest: React.FC<ResultTestProps> = ({ primaryStyle, secondaryStyles }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Seu Resultado</h1>
      
      <Card className="mb-4">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Estilo Primário</h2>
          <p>Nome: {primaryStyle.name}</p>
          <p>Descrição: {primaryStyle.description}</p>
        </div>
      </Card>

      {secondaryStyles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Estilos Secundários</h2>
          {secondaryStyles.map((style, index) => (
            <Card key={index} className="mb-4">
              <div className="p-4">
                <p>Nome: {style.name}</p>
                <p>Descrição: {style.description}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Progress percent={75} className="mb-4" />
    </div>
  );
};
