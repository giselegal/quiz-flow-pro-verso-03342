import { QuizRenderer } from '@/components/core/QuizRenderer';
import React from 'react';

/**
 * 🎯 QUIZ MODULAR - VERSÃO PRODUÇÃO SIMPLIFICADA
 * 
 * Usa o mesmo QuizRenderer do editor em mode='production'
 * Elimina toda a complexidade desnecessária
 */
export interface QuizModularPageProps {
  /** Etapa inicial opcional (1..21) vinda das rotas */
  initialStep?: number;
}

const normalizeStep = (n: any): number => {
  const num = parseInt(String(n ?? ''), 10);
  if (!Number.isFinite(num)) return 1;
  if (num < 1) return 1;
  if (num > 21) return 21;
  return num;
};

const detectInitialStepFromLocation = (): number => {
  try {
    if (typeof window === 'undefined') return 1;
    const p = window.location.pathname;
    // Suporta /step20 e /quiz/20 e /quiz/step20
    const direct = p.match(/(?:^|\/)step-?([0-9]{1,2})$/i);
    if (direct && direct[1]) return normalizeStep(direct[1]);
    const quizParam = p.match(/\/quiz\/(?:step)?([0-9]{1,2})$/i);
    if (quizParam && quizParam[1]) return normalizeStep(quizParam[1]);
  } catch { }
  return 1;
};

const QuizModularPage: React.FC<QuizModularPageProps> = ({ initialStep }) => {
  // Prioridade: prop > URL (fallback) > 1
  const resolvedInitialStep = normalizeStep(initialStep ?? detectInitialStepFromLocation());

  // Fundo configurável por etapa
  const bgStyle = {
    from: '#FAF9F7',
    via: '#F5F2E9',
    to: '#EEEBE1'
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br"
      style={{
        backgroundImage: `linear-gradient(135deg, ${bgStyle.from}, ${bgStyle.via}, ${bgStyle.to})`,
      }}
    >
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <QuizRenderer
            mode="production"
            initialStep={resolvedInitialStep}
            className="production-quiz"
          />
        </div>
      </div>
    </div>
  );
};

export default QuizModularPage;
