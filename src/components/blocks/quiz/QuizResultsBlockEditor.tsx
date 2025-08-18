// @ts-nocheck
import QuizResultsBlock from '@/components/blocks/quiz/QuizResultsBlock';
import { QuizResult, useQuizResults } from '@/hooks/useQuizResults';
import React, { useEffect, useState } from 'react';
import { QuizBlockProps } from './types';

export interface QuizResultsBlockEditorProps extends QuizBlockProps {
  properties: {
    results?: string; // JSON string com todos os resultados possíveis
    calculationMethod?: string; // JSON string com o método de cálculo
    showScores?: boolean;
    showAllResults?: boolean;
    demoResult?: string; // ID do resultado para preview no editor
  };
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const QuizResultsBlockEditor: React.FC<QuizResultsBlockEditorProps> = ({
  properties,
  id,
  onPropertyChange,
  ...props
}) => {
  // Parse das propriedades
  const parseResults = (): QuizResult[] => {
    try {
      return JSON.parse(properties?.results || '[]');
    } catch (e) {
      console.error('Erro ao parsear resultados:', e);
      return [];
    }
  };

  const parseCalculationMethod = () => {
    try {
      return JSON.parse(properties?.calculationMethod || '{"type":"sum"}');
    } catch (e) {
      console.error('Erro ao parsear método de cálculo:', e);
      return { type: 'sum' };
    }
  };

  // Estados
  const [results] = useState<QuizResult[]>(parseResults());
  const [demoResult, setDemoResult] = useState<QuizResult | null>(null);

  // Hooks
  const { determineResult } = useQuizResults();

  // Efeito para configurar o resultado de demonstração
  useEffect(() => {
    if (results.length === 0) return;

    // Se houver um demoResult nas propriedades, use-o
    if (properties?.demoResult) {
      const selectedResult = results.find(r => r.id === properties.demoResult);
      if (selectedResult) {
        setDemoResult(selectedResult);
        return;
      }
    }

    // Caso contrário, use o primeiro resultado
    setDemoResult(results[0]);
  }, [properties?.demoResult, results]);

  // Dados simulados para demonstração
  const demoScores = [
    { category: 'Elegante', score: 7, count: 3 },
    { category: 'Clássico', score: 5, count: 2 },
    { category: 'Contemporâneo', score: 3, count: 1 },
  ];

  // Manipuladores de eventos
  const handleReset = () => {
    console.log('Reset demo');
  };

  const handleShare = () => {
    console.log('Share demo');
  };

  // Renderização
  if (!demoResult) {
    return (
      <div style={{ backgroundColor: '#FAF9F7' }}>
        <p style={{ color: '#8B7355' }}>Adicione resultados para visualizar a prévia</p>
      </div>
    );
  }

  return (
    <div className="quiz-results-block-editor" data-block-id={id}>
      <QuizResultsBlock
        result={demoResult}
        categoryScores={properties?.showScores ? demoScores : undefined}
        showScores={properties?.showScores}
        onReset={handleReset}
        onShare={handleShare}
      />
    </div>
  );
};

export default QuizResultsBlockEditor;
