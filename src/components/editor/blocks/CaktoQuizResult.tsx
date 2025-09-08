// @ts-nocheck
import React from 'react';
import { useQuizResult } from '@/hooks/useQuizResult';
import Step20Result from '@/components/steps/Step20Result';

/**
 * 🎯 CAKTO QUIZ RESULT - WRAPPER PARA STEP20
 * 
 * CORREÇÃO CRÍTICA: Este componente estava vazio
 * Agora usa o Step20Result criado na Fase 1
 */

interface CaktoQuizResultProps {
  className?: string;
  isPreview?: boolean;
}

const CaktoQuizResult: React.FC<CaktoQuizResultProps> = (props) => {
  const { hasResult, isLoading, error } = useQuizResult();

  // Log para debugging
  React.useEffect(() => {
    console.log('🎯 [CaktoQuizResult] Status:', { hasResult, isLoading, error });
  }, [hasResult, isLoading, error]);

  // Usar Step20Result diretamente
  return <Step20Result {...props} />;
};

export default CaktoQuizResult;