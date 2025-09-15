/**
 * 🎯 PÁGINA CONSOLIDADA DO EDITOR PRO
 * 
 * Página final consolidada com Clean Architecture v2.0
 * Substituindo completamente o sistema legacy
 */

import React from 'react';
import EditorConsolidatedPro from '@/components/editor/EditorConsolidatedPro';

interface EditorProConsolidatedPageProps {
  initialStep?: number;
  funnelId?: string;
}

const EditorProConsolidatedPage: React.FC<EditorProConsolidatedPageProps> = ({
  initialStep = 1,
  funnelId = 'quiz-style-21-steps'
}) => {
  console.log('🎯 EditorProConsolidatedPage: Carregando Clean Architecture v2.0');
  
  return (
    <EditorConsolidatedPro
      stepNumber={initialStep}
      funnelId={funnelId}
      debugMode={process.env.NODE_ENV === 'development'}
      enablePerformanceMonitoring={true}
      onStepChange={(stepId) => {
        console.log('📍 Step changed:', stepId);
        // TODO: Implementar navegação de URL quando necessário
      }}
      onSave={(stepId, data) => {
        console.log('💾 Save triggered:', { stepId, data });
        // TODO: Implementar persistência quando necessário
      }}
    />
  );
};

export default EditorProConsolidatedPage;