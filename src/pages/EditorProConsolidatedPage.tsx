/**
 * 🎯 PÁGINA CONSOLIDADA DO EDITOR PRO
 * 
 * Versão standalone que funciona sem conflitos de providers
 * Implementação direta e estável
 */

import React from 'react';
import { EditorStandalone } from '@/components/editor/EditorStandalone';

interface EditorProConsolidatedPageProps {
  initialStep?: number;
  funnelId?: string;
}

const EditorProConsolidatedPage: React.FC<EditorProConsolidatedPageProps> = ({
  initialStep = 1,
  funnelId = 'quiz-style-21-steps'
}) => {
  console.log('🎯 EditorProConsolidatedPage: Carregando versão standalone (sem conflitos)');
  
  return (
    <EditorStandalone
      stepNumber={initialStep}
      funnelId={funnelId}
      debugMode={process.env.NODE_ENV === 'development'}
    />
  );
};

export default EditorProConsolidatedPage;