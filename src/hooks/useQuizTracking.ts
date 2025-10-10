import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts';
import { quizDataService, useQuizData } from '@/services/quizDataService';

// Hook para auto-tracking de cliques em elementos do quiz com integração completa
export const useQuizTracking = (questionIndex?: number) => {
  const { user } = useAuth();
  const questionStartTime = useRef<number>(Date.now());
  const hasTrackedPageView = useRef<boolean>(false);
  const { startSession, addAnswer, trackClick, finishSession, getCurrentSession } = useQuizData();

  // Inicializar sessão automaticamente e tracking de página
  useEffect(() => {
    const currentSession = getCurrentSession();
    if (!currentSession && user?.name) {
      startSession(user.name, user.email);
      // Track início do quiz
      quizDataService.trackQuizStart(user.name, user.email);
    }

    // Track page view apenas uma vez
    if (!hasTrackedPageView.current) {
      quizDataService.trackPageView();
      hasTrackedPageView.current = true;
    }
  }, [user, startSession, getCurrentSession]);

  // Reset timer quando questão muda
  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [questionIndex]);

  // Função para rastrear clique em opção do quiz
  const trackQuizOptionClick = useCallback(
    (
      optionId: string,
      optionText: string,
      questionId: string,
      elementPosition?: { x: number; y: number }
    ) => {
      trackClick('quiz_option', optionId, optionText, elementPosition, questionIndex, {
        questionId,
        selectionOrder: Date.now(),
      });
    },
    [trackClick, questionIndex]
  );

  // Função para rastrear submissão de resposta
  const trackAnswerSubmission = useCallback(
    (
      questionId: string,
      questionText: string,
      selectedOptions: string[],
      optionTexts: string[],
      stylePoints: Record<string, number>
    ) => {
      const responseTime = Date.now() - questionStartTime.current;

      addAnswer(questionId, questionText, selectedOptions, optionTexts, stylePoints, responseTime);

      // Track progresso se soubermos o número total de questões
      if (questionIndex !== undefined) {
        quizDataService.trackQuizProgress(questionIndex + 1, 19);
      }

      // Track evento de submissão
      trackClick(
        'answer_submit',
        'submit_' + questionId,
        `Submitted ${selectedOptions.length} options`,
        undefined,
        questionIndex,
        {
          questionId,
          responseTime,
          selectedOptionsCount: selectedOptions.length,
        }
      );
    },
    [addAnswer, trackClick, questionIndex]
  );

  // Função para rastrear navegação
  const trackNavigation = useCallback(
    (direction: 'next' | 'back' | 'skip', fromQuestion: number, toQuestion?: number) => {
      trackClick(
        'navigation_button',
        `nav_${direction}`,
        `Navigate ${direction}`,
        undefined,
        fromQuestion,
        {
          direction,
          fromQuestion,
          toQuestion,
        }
      );
    },
    [trackClick]
  );

  // Função para rastrear botões de CTA
  const trackCTAClick = useCallback(
    (ctaType: string, ctaText: string, targetUrl?: string) => {
      // Track no serviço consolidado de CTA
      quizDataService.trackCTAClick(ctaType, ctaText, targetUrl);

      // Track como clique regular também
      trackClick('cta_button', `cta_${ctaType}`, ctaText, undefined, questionIndex, {
        ctaType,
        targetUrl,
        timing: 'during_quiz',
      });
    },
    [trackClick, questionIndex]
  );

  // Função para rastrear elementos de interface
  const trackUIInteraction = useCallback(
    (elementType: string, elementId: string, action: string, metadata?: Record<string, any>) => {
      trackClick(elementType, elementId, action, undefined, questionIndex, {
        action,
        ...metadata,
      });
    },
    [trackClick, questionIndex]
  );

  // Função para rastrear finalização do quiz
  const trackQuizFinish = useCallback(
    (result: any) => {
      if (result?.predominantStyle?.category) {
        quizDataService.trackQuizComplete(result.predominantStyle.category);
      }
      finishSession(result);
    },
    [finishSession]
  );

  // Função para rastrear progresso de scroll
  const trackScrollProgress = useCallback((percentage: number) => {
    quizDataService.trackScrollProgress(percentage);
  }, []);

  // Função para rastrear loading/transições
  const trackLoadingState = useCallback(
    (loadingType: 'question_load' | 'result_load' | 'transition', duration?: number) => {
      trackClick(
        'loading_state',
        `loading_${loadingType}`,
        `Loading: ${loadingType}`,
        undefined,
        questionIndex,
        {
          loadingType,
          duration,
        }
      );
    },
    [trackClick, questionIndex]
  );

  return {
    trackQuizOptionClick,
    trackAnswerSubmission,
    trackNavigation,
    trackCTAClick,
    trackUIInteraction,
    trackQuizFinish,
    trackScrollProgress,
    trackLoadingState,
    finishSession,
    getCurrentSession,
  };
};

// Hook para tracking automático de cliques em qualquer elemento
export const useAutoClickTracking = (enabled: boolean = true) => {
  const { trackClick } = useQuizData();

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const elementType = target.tagName.toLowerCase();
      const elementId = target.id;
      const elementText = target.textContent?.slice(0, 50) || '';
      const position = { x: event.clientX, y: event.clientY };

      // Determinar tipo de elemento mais específico
      let specificType = elementType;
      if (target.closest('button')) specificType = 'button';
      if (target.closest('[data-quiz-option]')) specificType = 'quiz_option';
      if (target.closest('[data-cta]')) specificType = 'cta_element';
      if (target.closest('.navigation')) specificType = 'navigation';

      trackClick(specificType, elementId, elementText, position, undefined, {
        className: target.className,
        href: target.getAttribute('href'),
        dataAttributes: Array.from(target.attributes)
          .filter(attr => attr.name.startsWith('data-'))
          .reduce(
            (acc, attr) => ({
              ...acc,
              [attr.name]: attr.value,
            }),
            {}
          ),
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [enabled, trackClick]);
};

// Hook para obter estatísticas da sessão em tempo real
export const useQuizSessionStats = () => {
  const { getCurrentSession } = useQuizData();

  const getStats = useCallback(() => {
    const session = getCurrentSession();
    if (!session) return null;

    const now = new Date();
    const duration = now.getTime() - session.startTime.getTime();

    return {
      sessionId: session.sessionId,
      userName: session.userName,
      duration: Math.round(duration / 1000), // em segundos
      questionsAnswered: session.answers.length,
      totalClicks: session.clickEvents.length,
      averageResponseTime:
        session.answers.length > 0
          ? session.answers.reduce((sum, answer) => sum + answer.responseTime, 0) /
            session.answers.length
          : 0,
      clicksPerQuestion:
        session.answers.length > 0 ? session.clickEvents.length / session.answers.length : 0,
      device: session.device,
      isActive: !session.endTime,
    };
  }, [getCurrentSession]);

  return { getStats };
};
