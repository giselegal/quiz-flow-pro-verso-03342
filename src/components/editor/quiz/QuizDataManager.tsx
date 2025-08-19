/**
 * 💾 GERENCIADOR DE DADOS DO QUIZ
 *
 * QuizDataManager.tsx - Gerencia state, localStorage, validação e sincronização
 * Componente invisível que coordena toda a persistência de dados
 */

import React, { useCallback, useEffect, useRef } from 'react';

interface QuizDataManagerConfig {
  mode: 'editor' | 'preview' | 'production';
  quizState: {
    currentStep: number;
    sessionData: Record<string, any>;
    userAnswers: Record<string, any>;
    stepValidation: Record<number, boolean>;
  };
  dataManager: {
    onDataUpdate: (key: string, value: any) => void;
    onAnswerUpdate: (questionId: string, answer: any) => void;
  };
  validation: {
    onStepValidation: (stepNumber: number, isValid: boolean) => void;
  };
}

interface QuizDataManagerProps {
  config: QuizDataManagerConfig;
  autoSave?: boolean;
  debounceMs?: number;
  storageKey?: string;
}

export const QuizDataManager: React.FC<QuizDataManagerProps> = ({
  config,
  autoSave = true,
  debounceMs = 1000,
  storageKey = 'quiz-quest-session',
}) => {
  const { mode, quizState, dataManager, validation } = config;
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSaveRef = useRef<string>('');

  // ========================================
  // Auto-save no localStorage
  // ========================================
  const saveToStorage = useCallback(() => {
    if (mode === 'production' && autoSave) {
      try {
        const dataToSave = {
          currentStep: quizState.currentStep,
          sessionData: quizState.sessionData,
          userAnswers: quizState.userAnswers,
          timestamp: Date.now(),
        };

        const serialized = JSON.stringify(dataToSave);

        // Evitar saves desnecessários
        if (serialized !== lastSaveRef.current) {
          localStorage.setItem(storageKey, serialized);
          lastSaveRef.current = serialized;
          console.log('📱 Quiz data saved to localStorage');
        }
      } catch (error) {
        console.warn('⚠️ Failed to save quiz data:', error);
      }
    }
  }, [mode, quizState, autoSave, storageKey]);

  // ========================================
  // Debounced Auto-save
  // ========================================
  useEffect(() => {
    if (autoSave) {
      // Limpar timeout anterior
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Agendar novo save
      saveTimeoutRef.current = setTimeout(saveToStorage, debounceMs);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [quizState, autoSave, debounceMs, saveToStorage]);

  // ========================================
  // Carregar dados salvos na inicialização
  // ========================================
  useEffect(() => {
    if (mode === 'production' && autoSave) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const data = JSON.parse(saved);

          // Verificar se os dados não estão muito antigos (24h)
          const maxAge = 24 * 60 * 60 * 1000; // 24 horas
          if (Date.now() - data.timestamp < maxAge) {
            // Restaurar dados salvos
            if (data.sessionData) {
              Object.entries(data.sessionData).forEach(([key, value]) => {
                dataManager.onDataUpdate(key, value);
              });
            }

            if (data.userAnswers) {
              Object.entries(data.userAnswers).forEach(([questionId, answer]) => {
                dataManager.onAnswerUpdate(questionId, answer);
              });
            }

            console.log('📱 Quiz data restored from localStorage');
          } else {
            // Dados muito antigos, limpar
            localStorage.removeItem(storageKey);
            console.log('🧹 Old quiz data cleared');
          }
        }
      } catch (error) {
        console.warn('⚠️ Failed to restore quiz data:', error);
        localStorage.removeItem(storageKey);
      }
    }
  }, [mode, autoSave, storageKey, dataManager]);

  // ========================================
  // Validação de Etapas
  // ========================================
  useEffect(() => {
    const validateCurrentStep = () => {
      const { currentStep, sessionData, userAnswers } = quizState;
      let isValid = false;

      switch (currentStep) {
        case 1:
          // Etapa 1: Nome obrigatório
          isValid = !!(sessionData.userName && sessionData.userName.trim().length > 0);
          break;

        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
          // Etapas 2-11: 3 seleções obrigatórias
          const questionKey = `q${currentStep - 1}_`;
          const answers = Object.keys(userAnswers).filter(key => key.startsWith(questionKey));
          isValid = answers.length >= 3;
          break;

        case 12:
        case 19:
          // Etapas de transição: sempre válidas
          isValid = true;
          break;

        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
          // Etapas estratégicas: 1 seleção obrigatória
          const strategicKey = `qs${currentStep - 12}_`;
          const strategicAnswers = Object.keys(userAnswers).filter(key =>
            key.startsWith(strategicKey)
          );
          isValid = strategicAnswers.length >= 1;
          break;

        case 20:
        case 21:
          // Etapas de resultado: sempre válidas
          isValid = true;
          break;

        default:
          isValid = false;
      }

      validation.onStepValidation(currentStep, isValid);
    };

    validateCurrentStep();
  }, [quizState, validation]);

  // ========================================
  // Analytics (apenas em produção)
  // ========================================
  useEffect(() => {
    if (mode === 'production') {
      // Registrar evento de mudança de etapa
      const eventData = {
        step: quizState.currentStep,
        timestamp: Date.now(),
        sessionId: quizState.sessionData.sessionId || 'anonymous',
        hasAnswers: Object.keys(quizState.userAnswers).length > 0,
      };

      // Aqui você pode integrar com Google Analytics, Mixpanel, etc.
      console.log('📊 Step analytics:', eventData);

      // Exemplo com dataLayer do Google Analytics
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'quiz_step_view',
          quiz_step: quizState.currentStep,
          quiz_progress: (quizState.currentStep / 21) * 100,
        });
      }
    }
  }, [quizState.currentStep, mode]);

  // ========================================
  // Limpeza no unmount
  // ========================================
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Save final antes de sair
      if (mode === 'production' && autoSave) {
        saveToStorage();
      }
    };
  }, [mode, autoSave, saveToStorage]);

  // ========================================
  // Métodos Públicos (via window para debug)
  // ========================================
  useEffect(() => {
    if (mode === 'editor' && typeof window !== 'undefined') {
      (window as any).quizDebug = {
        getCurrentData: () => quizState,
        clearStorage: () => localStorage.removeItem(storageKey),
        exportData: () => {
          const data = {
            ...quizState,
            exportedAt: new Date().toISOString(),
          };
          console.log('📋 Quiz data exported:', data);
          return data;
        },
        importData: (data: any) => {
          if (data.sessionData) {
            Object.entries(data.sessionData).forEach(([key, value]) => {
              dataManager.onDataUpdate(key, value as any);
            });
          }
          if (data.userAnswers) {
            Object.entries(data.userAnswers).forEach(([questionId, answer]) => {
              dataManager.onAnswerUpdate(questionId, answer as any);
            });
          }
        },
      };
    }
  }, [mode, quizState, storageKey, dataManager]);

  // Este componente não renderiza nada visível
  return null;
};

export default QuizDataManager;
