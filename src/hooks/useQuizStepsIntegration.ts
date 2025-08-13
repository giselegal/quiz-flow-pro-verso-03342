import { toast } from '@/components/ui/use-toast';
import { useEditor } from '@/context/EditorContext';
import templateService, { type TemplateData } from '@/services/templateService';
import { QuizQuestion } from '@/types/quiz';
import { useEffect, useState } from 'react';
import { QuizMetadata, useQuizCRUD } from './useQuizCRUD';

export interface Step21Integration {
  stepNumber: number;
  template: TemplateData | null;
  questions: QuizQuestion[];
  isQuizStep: boolean;
}

/**
 * 🎯 HOOK PARA INTEGRAÇÃO QUIZ + 21 ETAPAS
 *
 * Integra o sistema de Quiz com as 21 etapas do editor-fixed:
 * - Identifica etapas que são perguntas de quiz
 * - Converte templates em perguntas editáveis
 * - Sincroniza estado entre quiz e etapas
 * - Salva quiz completo com todas as etapas
 */
export const useQuizStepsIntegration = () => {
  const [stepsIntegration, setStepsIntegration] = useState<Step21Integration[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQuizMetadata, setCurrentQuizMetadata] = useState<QuizMetadata | null>(null);

  const {
    activeStageId,
    stageActions: { setActiveStage },
    computed: { currentBlocks },
  } = useEditor();

  const { saveQuiz, loading: savingQuiz } = useQuizCRUD();

  // ===== IDENTIFICAR ETAPAS DE QUIZ =====
  const isQuizStep = (stepNumber: number, template: TemplateData | null): boolean => {
    if (!template) return false;

    // Verificar se contém blocos de quiz
    const hasQuizBlocks = template.blocks?.some(
      block =>
        block.type.includes('question') ||
        block.type.includes('options') ||
        block.type.includes('quiz')
    );

    // Etapas específicas que são sempre quiz (baseado no sistema atual)
    const quizSteps = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    return hasQuizBlocks || quizSteps.includes(stepNumber);
  };

  // ===== CONVERTER TEMPLATE EM QUESTÕES =====
  const convertTemplateToQuestions = (
    template: TemplateData,
    stepNumber: number
  ): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];

    // Procurar blocos que representam perguntas
    template.blocks?.forEach((block, index) => {
      if (block.type.includes('question') || block.type.includes('options')) {
        const question: QuizQuestion = {
          id: `step-${stepNumber}-q-${index}`,
          title:
            block.properties?.question ||
            block.properties?.content ||
            `Pergunta da Etapa ${stepNumber}`,
          question:
            block.properties?.question ||
            block.properties?.content ||
            `Pergunta da Etapa ${stepNumber}`,
          text:
            block.properties?.question ||
            block.properties?.content ||
            `Pergunta da Etapa ${stepNumber}`,
          type: 'normal',
          options: block.properties?.options || [
            { id: 'opt1', text: 'Opção 1', value: 'option1' },
            { id: 'opt2', text: 'Opção 2', value: 'option2' },
            { id: 'opt3', text: 'Opção 3', value: 'option3' },
          ],
          multiSelect: block.properties?.allowMultiple ? 3 : 1,
          order: index,
          points: 1,
        };

        questions.push(question);
      }
    });

    // Se não encontrou perguntas específicas, criar uma baseada no template
    if (questions.length === 0 && isQuizStep(stepNumber, template)) {
      questions.push({
        id: `step-${stepNumber}-default`,
        title: `Questão - ${template.metadata.name}`,
        question: `Questão - ${template.metadata.name}`,
        text: `Questão - ${template.metadata.name}`,
        type: 'normal',
        options: [
          { id: 'opt1', text: 'Opção A', value: 'a' },
          { id: 'opt2', text: 'Opção B', value: 'b' },
          { id: 'opt3', text: 'Opção C', value: 'c' },
          { id: 'opt4', text: 'Opção D', value: 'd' },
        ],
        multiSelect: 1,
        order: 0,
        points: 1,
      });
    }

    return questions;
  };

  // ===== CARREGAR TODAS AS 21 ETAPAS =====
  const loadAllSteps = async () => {
    setLoading(true);

    try {
      const integrations: Step21Integration[] = [];

      for (let step = 1; step <= 21; step++) {
        const template = await templateService.getTemplateByStep(step);
        const isQuiz = isQuizStep(step, template);
        const questions = template && isQuiz ? convertTemplateToQuestions(template, step) : [];

        integrations.push({
          stepNumber: step,
          template,
          questions,
          isQuizStep: isQuiz,
        });
      }

      setStepsIntegration(integrations);

      // Inicializar metadados do quiz
      if (!currentQuizMetadata) {
        setCurrentQuizMetadata({
          title: 'Quiz das 21 Etapas',
          description: 'Quiz completo gerado a partir das 21 etapas do editor',
          category: 'lifestyle',
          difficulty: 'medium',
          timeLimit: undefined,
          isPublic: false,
          settings: {
            showProgress: true,
            randomizeQuestions: false,
            allowRetake: true,
            passScore: 70,
          },
        });
      }
    } catch (error) {
      console.error('Erro ao carregar etapas:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar etapas do quiz',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ===== ATUALIZAR QUESTÃO DE UMA ETAPA =====
  const updateStepQuestion = (
    stepNumber: number,
    questionIndex: number,
    updatedQuestion: QuizQuestion
  ) => {
    setStepsIntegration(prev =>
      prev.map(integration => {
        if (integration.stepNumber === stepNumber) {
          const newQuestions = [...integration.questions];
          newQuestions[questionIndex] = updatedQuestion;
          return { ...integration, questions: newQuestions };
        }
        return integration;
      })
    );
  };

  // ===== ADICIONAR QUESTÃO A UMA ETAPA =====
  const addQuestionToStep = (stepNumber: number) => {
    setStepsIntegration(prev =>
      prev.map(integration => {
        if (integration.stepNumber === stepNumber) {
          const newQuestion: QuizQuestion = {
            id: `step-${stepNumber}-q-${integration.questions.length}`,
            title: `Nova Questão - Etapa ${stepNumber}`,
            question: `Nova Questão - Etapa ${stepNumber}`,
            text: `Nova Questão - Etapa ${stepNumber}`,
            type: 'normal',
            options: [
              { id: 'opt1', text: 'Opção 1', value: 'option1' },
              { id: 'opt2', text: 'Opção 2', value: 'option2' },
            ],
            multiSelect: 1,
            order: integration.questions.length,
            points: 1,
          };

          return {
            ...integration,
            questions: [...integration.questions, newQuestion],
            isQuizStep: true,
          };
        }
        return integration;
      })
    );
  };

  // ===== REMOVER QUESTÃO DE UMA ETAPA =====
  const removeQuestionFromStep = (stepNumber: number, questionIndex: number) => {
    setStepsIntegration(prev =>
      prev.map(integration => {
        if (integration.stepNumber === stepNumber) {
          const newQuestions = integration.questions.filter((_, index) => index !== questionIndex);
          return {
            ...integration,
            questions: newQuestions,
            isQuizStep: newQuestions.length > 0 || integration.isQuizStep,
          };
        }
        return integration;
      })
    );
  };

  // ===== SALVAR QUIZ COMPLETO DAS 21 ETAPAS =====
  const saveCompleteQuiz = async (): Promise<boolean> => {
    if (!currentQuizMetadata) {
      toast({
        title: 'Erro',
        description: 'Metadados do quiz não configurados',
        variant: 'destructive',
      });
      return false;
    }

    // Coletar todas as questões de todas as etapas
    const allQuestions: QuizQuestion[] = [];
    let questionOrder = 0;

    stepsIntegration.forEach(integration => {
      if (integration.isQuizStep && integration.questions.length > 0) {
        integration.questions.forEach(question => {
          allQuestions.push({
            ...question,
            order: questionOrder++,
            title: `${question.title} (Etapa ${integration.stepNumber})`,
          });
        });
      }
    });

    if (allQuestions.length === 0) {
      toast({
        title: 'Aviso',
        description: 'Nenhuma questão encontrada para salvar',
        variant: 'destructive',
      });
      return false;
    }

    const quizId = await saveQuiz(currentQuizMetadata, allQuestions);

    if (quizId) {
      toast({
        title: 'Sucesso!',
        description: `Quiz completo salvo com ${allQuestions.length} questões`,
      });
      return true;
    }

    return false;
  };

  // ===== NAVEGAR PARA PRÓXIMA ETAPA DE QUIZ =====
  const goToNextQuizStep = () => {
    const currentStep = parseInt(activeStageId?.replace('step-', '') || '1');
    const nextQuizStep = stepsIntegration.find(
      integration => integration.stepNumber > currentStep && integration.isQuizStep
    );

    if (nextQuizStep) {
      setActiveStage(`step-${nextQuizStep.stepNumber.toString().padStart(2, '0')}`);
    } else {
      toast({
        title: 'Fim do Quiz',
        description: 'Você chegou à última etapa de quiz',
      });
    }
  };

  // ===== OBTER ESTATÍSTICAS DO QUIZ =====
  const getQuizStats = () => {
    const quizSteps = stepsIntegration.filter(s => s.isQuizStep);
    const totalQuestions = stepsIntegration.reduce((total, s) => total + s.questions.length, 0);
    const estimatedTime = Math.max(1, Math.ceil(totalQuestions * 1.5)); // 1.5min por questão

    return {
      totalSteps: 21,
      quizSteps: quizSteps.length,
      totalQuestions,
      estimatedTime,
      completedSteps: 0, // TODO: Implementar tracking
      completion: 0, // TODO: Implementar tracking
    };
  };

  // ===== CARREGAR AUTOMATICAMENTE =====
  useEffect(() => {
    loadAllSteps();
  }, []);

  return {
    // Estado
    stepsIntegration,
    loading: loading || savingQuiz,
    currentQuizMetadata,

    // Ações
    updateStepQuestion,
    addQuestionToStep,
    removeQuestionFromStep,
    saveCompleteQuiz,
    goToNextQuizStep,
    setCurrentQuizMetadata,

    // Computed
    getQuizStats,

    // Helpers
    isQuizStep: (step: number) => {
      const integration = stepsIntegration.find(s => s.stepNumber === step);
      return integration?.isQuizStep || false;
    },
  };
};
