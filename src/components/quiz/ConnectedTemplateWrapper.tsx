/**
 * 🔗 CONNECTED TEMPLATE WRAPPER
 *
 * Conecta templates TSX e JSON aos hooks de quiz (useQuizLogic, useSupabaseQuiz)
 * Centraliza a lógica de integração entre UI e business logic
 */

import React, { useCallback, useEffect } from 'react';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { useSupabaseQuiz } from '@/hooks/useSupabaseQuiz';
import caktoquizQuestions from '@/data/caktoquizQuestions';

interface ConnectedTemplateWrapperProps {
  children: React.ReactNode;
  stepNumber: number;
  stepType: 'intro' | 'question' | 'strategic' | 'result';
  sessionId: string;
}

/**
 * Wrapper que conecta templates aos hooks centrais
 * - Escuta eventos customizados dos componentes (quiz-selection-change, quiz-form-complete)
 * - Chama métodos apropriados do useQuizLogic e useSupabaseQuiz
 * - Gerencia fluxo de dados entre UI e business logic
 */
export const ConnectedTemplateWrapper: React.FC<ConnectedTemplateWrapperProps> = ({
  children,
  stepNumber,
  stepType,
  sessionId,
}) => {
  const quizLogic = useQuizLogic();
  const supabaseQuiz = useSupabaseQuiz(caktoquizQuestions);

  // ✅ HANDLER: Captura de nome (Etapa 1)
  const handleNameCapture = useCallback(
    (event: CustomEvent) => {
      const { formData, isValid } = event.detail;

      if (stepNumber === 1 && formData?.name && isValid) {
        console.log('👤 ConnectedTemplateWrapper: Capturando nome do usuário', formData.name);

        // Conectar ao useQuizLogic
        quizLogic.setUserNameFromInput(formData.name);

        // ✅ INTEGRAR COM SUPABASE: Iniciar quiz quando nome for capturado
        if (formData.email) {
          supabaseQuiz
            .startQuiz({
              name: formData.name,
              email: formData.email,
              quizId: sessionId,
            })
            .then(result => {
              console.log('🚀 Quiz iniciado no Supabase:', result);
            })
            .catch(error => {
              console.error('❌ Erro ao iniciar quiz no Supabase:', error);
            });
        }
      }
    },
    [stepNumber, quizLogic, supabaseQuiz, sessionId]
  );

  // ✅ HANDLER: Respostas às questões (Etapas 2-11)
  const handleQuestionAnswer = useCallback(
    (event: CustomEvent) => {
      const { selectedOptions, isValid } = event.detail;

      if (stepType === 'question' && stepNumber >= 2 && stepNumber <= 11 && isValid) {
        console.log('📊 ConnectedTemplateWrapper: Processando respostas', {
          stepNumber,
          selectedOptions,
        });

        // Mapear step number para question ID
        const questionId = `q${stepNumber - 1}`; // Step 2 = q1, Step 3 = q2, etc.

        // Processar cada opção selecionada
        selectedOptions.forEach((optionId: string) => {
          console.log('✅ Registrando resposta:', { questionId, optionId });
          quizLogic.answerQuestion(questionId, optionId);

          // ✅ SALVAR NO SUPABASE
          supabaseQuiz
            .saveAnswer(questionId, optionId)
            .then(() => {
              console.log('💾 Resposta salva no Supabase:', { questionId, optionId });
            })
            .catch(error => {
              console.error('❌ Erro ao salvar no Supabase:', error);
            });
        });
      }
    },
    [stepType, stepNumber, quizLogic, supabaseQuiz]
  );

  // ✅ HANDLER: Questões estratégicas (Etapas 12-18)
  const handleStrategicAnswer = useCallback(
    (event: CustomEvent) => {
      const { selectedOptions, isValid } = event.detail;

      if (stepType === 'strategic' && stepNumber >= 12 && stepNumber <= 18 && isValid) {
        console.log('🎯 ConnectedTemplateWrapper: Processando resposta estratégica', {
          stepNumber,
          selectedOptions,
        });

        // Mapear step number para strategic question ID
        const questionId = `strategic-q${stepNumber - 11}`; // Step 12 = strategic-q1, etc.

        // Processar respostas estratégicas
        selectedOptions.forEach((optionId: string) => {
          quizLogic.answerStrategicQuestion(
            questionId,
            optionId,
            'strategic', // categoria
            'user-preference' // tipo estratégico
          );
        });
      }
    },
    [stepType, stepNumber, quizLogic]
  );

  // ✅ HANDLER: Cálculo de resultados (Etapas 19-21)
  const handleResultCalculation = useCallback(() => {
    if (stepType === 'result' && stepNumber >= 19) {
      console.log('🏆 ConnectedTemplateWrapper: Calculando resultados finais');

      // Completar quiz e calcular scores
      quizLogic.completeQuiz();

      // ✅ SALVAR RESULTADO NO SUPABASE
      supabaseQuiz
        .completeQuiz()
        .then(result => {
          console.log('🎉 Resultado salvo no Supabase:', result);
        })
        .catch(error => {
          console.error('❌ Erro ao salvar resultado no Supabase:', error);
        });
    }
  }, [stepType, stepNumber, quizLogic, supabaseQuiz]);

  // ✅ REGISTRAR EVENT LISTENERS
  useEffect(() => {
    // Eventos de formulário (Step 1)
    window.addEventListener('quiz-form-complete', handleNameCapture as EventListener);

    // Eventos de seleção (Steps 2-18)
    window.addEventListener('quiz-selection-change', handleQuestionAnswer as EventListener);
    window.addEventListener('quiz-selection-change', handleStrategicAnswer as EventListener);

    return () => {
      window.removeEventListener('quiz-form-complete', handleNameCapture as EventListener);
      window.removeEventListener('quiz-selection-change', handleQuestionAnswer as EventListener);
      window.removeEventListener('quiz-selection-change', handleStrategicAnswer as EventListener);
    };
  }, [handleNameCapture, handleQuestionAnswer, handleStrategicAnswer]);

  // ✅ AUTO-CALCULAR RESULTADOS (Steps 19-21)
  useEffect(() => {
    if (stepType === 'result' && stepNumber >= 19) {
      // Delay para permitir que todas as respostas sejam processadas
      const timer = setTimeout(handleResultCalculation, 100);
      return () => clearTimeout(timer);
    }
  }, [stepType, stepNumber, handleResultCalculation]);

  // ✅ DEBUG: Log do estado atual
  useEffect(() => {
    console.log('🔗 ConnectedTemplateWrapper State:', {
      stepNumber,
      stepType,
      sessionId,
      currentAnswers: quizLogic.answers.length,
      strategicAnswers: quizLogic.strategicAnswers.length,
      userName: quizLogic.userName,
      quizCompleted: quizLogic.quizCompleted,
      quizResult: quizLogic.quizResult ? 'Available' : 'Not calculated',
    });
  }, [
    stepNumber,
    stepType,
    sessionId,
    quizLogic.answers.length,
    quizLogic.strategicAnswers.length,
    quizLogic.userName,
    quizLogic.quizCompleted,
    quizLogic.quizResult,
  ]);

  return (
    <div className="connected-template-wrapper" data-step={stepNumber} data-type={stepType}>
      {children}
    </div>
  );
};

export default ConnectedTemplateWrapper;
