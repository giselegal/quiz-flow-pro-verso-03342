import { QuizRenderer } from '@/components/core/QuizRenderer';
import React from 'react';

interface UnifiedQuizPageProps {
  mode?: 'production' | 'preview';
  initialStep?: number;
  className?: string;
}

/**
 * 🏭 PÁGINA DE PRODUÇÃO UNIFICADA
 *
 * Usa o mesmo motor de renderização do editor
 * Garante preview = produção (100%)
 */
export const UnifiedQuizPage: React.FC<UnifiedQuizPageProps> = ({
  mode = 'production',
  initialStep = 1,
  className = '',
}) => {
  const handleStepChange = (step: number) => {
    console.log(`Página de produção - Etapa ${step}`);

    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'quiz_step_change', {
        event_category: 'Quiz',
        event_label: `Step ${step}`,
        value: step,
      });
    }
  };

  return (
    <div
      className={`unified-quiz-page min-h-screen bg-gradient-to-b from-blue-50 to-white ${className}`}
    >
      <div className="container mx-auto px-4 py-8">
        <QuizRenderer
          mode={mode}
          onStepChange={handleStepChange}
          initialStep={initialStep}
          className="quiz-production-container"
        />
      </div>
    </div>
  );
};

export default UnifiedQuizPage;
