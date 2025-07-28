
import React from 'react';
import { StyleResult, StyleData } from '@/types/quiz';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { styleResults } from '@/data/styleData';

interface ResultTestProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
}

export const ResultTest: React.FC<ResultTestProps> = ({ primaryStyle, secondaryStyles }) => {
  const getStyleData = (style: StyleResult): StyleData => {
    return styleResults[style] || {
      name: style,
      description: 'Descrição não disponível'
    };
  };

  const primaryStyleData = getStyleData(primaryStyle);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Seu Resultado</h1>
      
      <Card className="mb-4">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Estilo Primário</h2>
          <p>Nome: {primaryStyleData.name}</p>
          <p>Descrição: {primaryStyleData.description}</p>
        </div>
      </Card>

      {secondaryStyles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Estilos Secundários</h2>
          {secondaryStyles.map((style, index) => {
            const styleData = getStyleData(style);
            return (
              <Card key={index} className="mb-4">
                <div className="p-4">
                  <p>Nome: {styleData.name}</p>
                  <p>Descrição: {styleData.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Progress value={75} className="mb-4" />
    </div>
  );
};
