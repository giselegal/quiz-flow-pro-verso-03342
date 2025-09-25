/**
 * 🎯 MOCK RESULT GENERATOR
 * 
 * Gerador de resultados mockados para teste do editor Step 20
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuizResultEditor } from '@/hooks/useQuizResultEditor';
import { RefreshCw, Dice6, Shuffle } from 'lucide-react';

interface MockResultGeneratorProps {
  className?: string;
}

export const MockResultGenerator: React.FC<MockResultGeneratorProps> = ({
  className = ''
}) => {
  const {
    availableStyles,
    switchPrimaryStyle,
    generateMockResult
  } = useQuizResultEditor();

  // Gerar resultado aleatório
  const generateRandomResult = () => {
    const mockAnswers = {
      2: ['opcao1', 'opcao2', 'opcao3'],
      3: ['opcao2', 'opcao4', 'opcao5'],
      4: ['opcao1', 'opcao3', 'opcao6'],
      5: ['opcao2', 'opcao3', 'opcao4'],
      6: ['opcao1', 'opcao4', 'opcao5'],
      7: ['opcao2', 'opcao5', 'opcao6'],
      8: ['opcao1', 'opcao2', 'opcao4'],
      9: ['opcao3', 'opcao4', 'opcao6'],
      10: ['opcao1', 'opcao5', 'opcao6'],
      11: ['opcao2', 'opcao3', 'opcao5'],
      13: ['opcao1'],
      14: ['opcao2'],
      15: ['opcao3'],
      16: ['opcao1'],
      17: ['opcao2'],
      18: ['opcao3']
    };
    
    generateMockResult(mockAnswers);
  };

  // Simular resultado específico para um estilo
  const generateSpecificResult = (styleId: string) => {
    const mockAnswersForStyle = generateAnswersForStyle(styleId);
    generateMockResult(mockAnswersForStyle);
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <h3 className="font-semibold text-stone-800 mb-3">
          Gerador de Resultados Mockados
        </h3>
        <p className="text-sm text-stone-600 mb-4">
          Teste diferentes resultados para validar o design da página
        </p>

        <div className="space-y-3">
          {/* Resultado aleatório */}
          <Button
            variant="outline"
            onClick={generateRandomResult}
            className="w-full justify-start gap-2"
          >
            <Dice6 className="w-4 h-4" />
            Gerar Resultado Aleatório
          </Button>

          {/* Alternar estilo rapidamente */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-stone-700">
              Testar Estilos Específicos:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableStyles.slice(0, 4).map((style) => (
                <Button
                  key={style.id}
                  variant="outline"
                  size="sm"
                  onClick={() => generateSpecificResult(style.id)}
                  className="text-xs"
                >
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: style.color }}
                  />
                  {style.style}
                </Button>
              ))}
            </div>
          </div>

          {/* Misturar estilos */}
          <Button
            variant="outline"
            onClick={() => {
              const randomStyle = availableStyles[Math.floor(Math.random() * availableStyles.length)];
              switchPrimaryStyle(randomStyle.id);
            }}
            className="w-full justify-start gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Misturar Estilo Principal
          </Button>

          {/* Reset para padrão */}
          <Button
            variant="outline"
            onClick={() => switchPrimaryStyle('classico')}
            className="w-full justify-start gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Voltar ao Clássico
          </Button>
        </div>

        {/* Dicas */}
        <div className="mt-4 p-3 bg-stone-50 rounded-lg text-xs">
          <div className="font-medium text-stone-700 mb-1">💡 Dicas:</div>
          <ul className="text-stone-600 space-y-1">
            <li>• Use diferentes estilos para testar o layout</li>
            <li>• O resultado aleatório simula respostas variadas</li>
            <li>• Cada estilo tem características únicas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Gerar respostas mockadas que favorecem um estilo específico
function generateAnswersForStyle(styleId: string): Record<number, string[]> {
  const base = {
    2: ['opcao1', 'opcao2', 'opcao3'],
    3: ['opcao2', 'opcao4', 'opcao5'],
    4: ['opcao1', 'opcao3', 'opcao6'],
    5: ['opcao2', 'opcao3', 'opcao4'],
    6: ['opcao1', 'opcao4', 'opcao5'],
    7: ['opcao2', 'opcao5', 'opcao6'],
    8: ['opcao1', 'opcao2', 'opcao4'],
    9: ['opcao3', 'opcao4', 'opcao6'],
    10: ['opcao1', 'opcao5', 'opcao6'],
    11: ['opcao2', 'opcao3', 'opcao5'],
    13: ['opcao1'],
    14: ['opcao2'],
    15: ['opcao3'],
    16: ['opcao1'],
    17: ['opcao2'],
    18: ['opcao3']
  };

  // Ajustar respostas para favorecer o estilo escolhido
  switch (styleId) {
    case 'classico':
      return {
        ...base,
        2: ['opcao1', 'opcao1', 'opcao1'], // Mais respostas que favorecem clássico
        3: ['opcao1', 'opcao1', 'opcao2'],
        13: ['opcao1'],
        14: ['opcao1']
      };
    case 'romantico':
      return {
        ...base,
        2: ['opcao2', 'opcao2', 'opcao2'],
        3: ['opcao2', 'opcao2', 'opcao3'],
        13: ['opcao2'],
        14: ['opcao2']
      };
    case 'dramatico':
      return {
        ...base,
        2: ['opcao3', 'opcao3', 'opcao3'],
        3: ['opcao3', 'opcao3', 'opcao4'],
        13: ['opcao3'],
        14: ['opcao3']
      };
    case 'natural':
      return {
        ...base,
        2: ['opcao4', 'opcao4', 'opcao4'],
        3: ['opcao4', 'opcao4', 'opcao5'],
        13: ['opcao4'],
        14: ['opcao4']
      };
    case 'criativo':
      return {
        ...base,
        2: ['opcao5', 'opcao5', 'opcao5'],
        3: ['opcao5', 'opcao5', 'opcao6'],
        13: ['opcao5'],
        14: ['opcao5']
      };
    default:
      return base;
  }
}

export default MockResultGenerator;