import ScalableQuizRenderer from '@/components/core/ScalableQuizRenderer';
import React from 'react';

/**
 * 🎯 QUIZ MODULAR - VERSÃO PRODUÇÃO SIMPLIFICADA
 * 
 * Agora usa o novo ScalableQuizRenderer com HybridTemplateService!
 * ✅ Sistema escalável e configurável via JSON
 * ✅ API conectada aos dados reais
 * ✅ Performance otimizada
 */
export interface QuizModularPageProps {
  /** Etapa inicial opcional (1..21) vinda das rotas */
  initialStep?: number;
}

const QuizModularPage: React.FC<QuizModularPageProps> = () => {
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
          <ScalableQuizRenderer
            funnelId="quiz21StepsComplete-production"
            mode="production"
            className="production-quiz"
            onComplete={(results) => {
              console.log('🎉 Quiz finalizado!', results);
              // Aqui pode adicionar integração com analytics, redirecionamento, etc.
            }}
            onStepChange={(step, data) => {
              console.log(`📍 Step ${step}:`, data);
              // Tracking de progresso do usuário
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizModularPage;
