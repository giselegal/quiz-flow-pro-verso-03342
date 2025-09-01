// hooks/useQuizResult.ts
import { useState, useEffect, useCallback } from 'react';
import { StyleResult } from '@/types/quiz';
import { StorageService } from '@/services/core/StorageService';
import { calculateAndSaveQuizResult } from '@/utils/quizResultCalculator';

export const useQuizResult = () => {
  const [primaryStyle, setPrimaryStyle] = useState<StyleResult | null>(null);
  const [secondaryStyles, setSecondaryStyles] = useState<StyleResult[]>([]);
  
  const loadFromStorage = useCallback(() => {
    try {
      const parsedResult = StorageService.safeGetJSON<any>('quizResult');
      if (parsedResult) {
        setPrimaryStyle(parsedResult.primaryStyle ?? null);
        setSecondaryStyles(parsedResult.secondaryStyles || []);
      } else {
        // Se não houver resultado salvo, tentar calcular
        console.log('Nenhum resultado encontrado, tentando calcular...');
        // Calcular e, quando pronto, atualizar estado imediatamente e notificar listeners
        Promise.resolve(calculateAndSaveQuizResult())
          .then(result => {
            if (result) {
              try {
                setPrimaryStyle(result.primaryStyle ?? null);
                setSecondaryStyles(result.secondaryStyles || []);
              } catch {}
              // Emite evento para outros consumidores que dependem de eventos
              try { window.dispatchEvent(new Event('quiz-result-updated')); } catch {}
            }
          })
          .catch(err => {
            console.error('Erro ao calcular resultado do quiz:', err);
          });
      }
    } catch (error) {
      console.error('Error loading quiz result:', error);
    }
  }, []);
  
  useEffect(() => {
    loadFromStorage();
    const handler = () => loadFromStorage();
    
    // Reage a mudanças do localStorage (em outras abas) e a eventos customizados internos
    window.addEventListener('storage', handler);
    window.addEventListener('quiz-result-updated', handler as EventListener);
    window.addEventListener('quiz-result-refresh', handler as EventListener);
    
    // Adicionar listener para respostas atualizadas
    const answerHandler = () => {
      // Verificar se todas as perguntas foram respondidas
      const answers = StorageService.safeGetJSON<any[]>('quizAnswers') || [];
      const uniqueSteps = [...new Set(answers.map(a => a.step))];
      
      // Se tiver respostas das etapas 2-11, recalcular o resultado
      if (uniqueSteps.length >= 10) {
        calculateAndSaveQuizResult();
      }
    };
    
    window.addEventListener('quiz-answer-updated', answerHandler);
    
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('quiz-result-updated', handler as EventListener);
      window.removeEventListener('quiz-result-refresh', handler as EventListener);
      window.removeEventListener('quiz-answer-updated', answerHandler);
    };
  }, [loadFromStorage]);
  
  return {
    primaryStyle,
    secondaryStyles,
  };
};