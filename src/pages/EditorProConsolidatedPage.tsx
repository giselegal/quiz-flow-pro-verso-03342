/**
 * 🎯 PÁGINA CONSOLIDADA DO EDITOR PRO
 * 
 * Página final consolidada que substitui o UniversalStepEditorProDemo
 * com a arquitetura definitiva otimizada.
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
  return (
    <EditorConsolidatedPro
      stepNumber={initialStep}
      funnelId={funnelId}
      debugMode={process.env.NODE_ENV === 'development'}
    />
  );
};

export default EditorProConsolidatedPage;