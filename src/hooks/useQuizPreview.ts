/**
 * 🎯 USE QUIZ PREVIEW - Hook para Preview de Quiz
 * 
 * Hook personalizado para gerenciar o preview do quiz durante a edição.
 * Funcionalidades:
 * - ✅ Preview em tempo real
 * - ✅ Simulação de usuário
 * - ✅ Validação de fluxo
 * - ✅ Métricas de performance
 * - ✅ Teste de responsividade
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface QuizStep {
  id: string;
  name: string;
  type: string;
  content: any;
  settings: any;
  styles: any;
  order: number;
  isActive: boolean;
}

interface PreviewState {
  currentStep: string;
  isPlaying: boolean;
  playbackSpeed: number;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  showMetrics: boolean;
  userAnswers: Record<string, any>;
  startTime: Date | null;
  endTime: Date | null;
  stepTimes: Record<string, number>;
}

interface PreviewActions {
  // Navegação
  goToStep: (stepId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
  
  // Controles de reprodução
  play: () => void;
  pause: () => void;
  setPlaybackSpeed: (speed: number) => void;
  
  // Modos de preview
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  toggleMetrics: () => void;
  
  // Simulação de usuário
  simulateUser: (answers: Record<string, any>) => void;
  recordAnswer: (stepId: string, answer: any) => void;
  
  // Métricas
  getMetrics: () => {
    totalTime: number;
    averageStepTime: number;
    completionRate: number;
    stepMetrics: Array<{
      stepId: string;
      stepName: string;
      timeSpent: number;
      hasAnswer: boolean;
    }>;
  };
}

interface UseQuizPreviewOptions {
  steps: QuizStep[];
  onStepChange?: (stepId: string) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
  defaultSpeed?: number;
}

export function useQuizPreview(options: UseQuizPreviewOptions): PreviewState & PreviewActions {
  const {
    steps,
    onStepChange,
    onComplete,
    autoPlay = false,
    defaultSpeed = 1
  } = options;

  const [state, setState] = useState<PreviewState>({
    currentStep: steps[0]?.id || '',
    isPlaying: autoPlay,
    playbackSpeed: defaultSpeed,
    previewMode: 'desktop',
    showMetrics: false,
    userAnswers: {},
    startTime: null,
    endTime: null,
    stepTimes: {}
  });

  const stepStartTimeRef = useRef<Date | null>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-play
  useEffect(() => {
    if (state.isPlaying && steps.length > 0) {
      const currentIndex = steps.findIndex(step => step.id === state.currentStep);
      if (currentIndex < steps.length - 1) {
        autoPlayTimeoutRef.current = setTimeout(() => {
          nextStep();
        }, 3000 / state.playbackSpeed);
      } else {
        setState(prev => ({ ...prev, isPlaying: false }));
      }
    }

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [state.isPlaying, state.currentStep, state.playbackSpeed, steps]);

  // Iniciar cronômetro quando mudar de etapa
  useEffect(() => {
    if (state.currentStep) {
      stepStartTimeRef.current = new Date();
    }
  }, [state.currentStep]);

  const goToStep = useCallback((stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    // Registrar tempo da etapa anterior
    if (stepStartTimeRef.current && state.currentStep) {
      const timeSpent = Date.now() - stepStartTimeRef.current.getTime();
      setState(prev => ({
        ...prev,
        stepTimes: {
          ...prev.stepTimes,
          [state.currentStep]: timeSpent
        }
      }));
    }

    setState(prev => ({
      ...prev,
      currentStep: stepId
    }));

    onStepChange?.(stepId);
  }, [steps, state.currentStep, onStepChange]);

  const nextStep = useCallback(() => {
    const currentIndex = steps.findIndex(step => step.id === state.currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      goToStep(nextStep.id);
    } else {
      // Quiz completo
      setState(prev => ({
        ...prev,
        isPlaying: false,
        endTime: new Date()
      }));
      onComplete?.();
    }
  }, [steps, state.currentStep, goToStep, onComplete]);

  const previousStep = useCallback(() => {
    const currentIndex = steps.findIndex(step => step.id === state.currentStep);
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      goToStep(prevStep.id);
    }
  }, [steps, state.currentStep, goToStep]);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: steps[0]?.id || '',
      isPlaying: false,
      userAnswers: {},
      startTime: null,
      endTime: null,
      stepTimes: {}
    }));
  }, [steps]);

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, playbackSpeed: speed }));
  }, []);

  const setPreviewMode = useCallback((mode: 'desktop' | 'tablet' | 'mobile') => {
    setState(prev => ({ ...prev, previewMode: mode }));
  }, []);

  const toggleMetrics = useCallback(() => {
    setState(prev => ({ ...prev, showMetrics: !prev.showMetrics }));
  }, []);

  const simulateUser = useCallback((answers: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      userAnswers: answers,
      startTime: new Date()
    }));
  }, []);

  const recordAnswer = useCallback((stepId: string, answer: any) => {
    setState(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [stepId]: answer
      }
    }));
  }, []);

  const getMetrics = useCallback(() => {
    const totalTime = state.endTime && state.startTime 
      ? state.endTime.getTime() - state.startTime.getTime()
      : 0;

    const stepMetrics = steps.map(step => ({
      stepId: step.id,
      stepName: step.name,
      timeSpent: state.stepTimes[step.id] || 0,
      hasAnswer: !!state.userAnswers[step.id]
    }));

    const averageStepTime = stepMetrics.length > 0
      ? stepMetrics.reduce((sum, step) => sum + step.timeSpent, 0) / stepMetrics.length
      : 0;

    const completionRate = stepMetrics.length > 0
      ? (stepMetrics.filter(step => step.hasAnswer).length / stepMetrics.length) * 100
      : 0;

    return {
      totalTime,
      averageStepTime,
      completionRate,
      stepMetrics
    };
  }, [state.endTime, state.startTime, state.stepTimes, state.userAnswers, steps]);

  return {
    ...state,
    goToStep,
    nextStep,
    previousStep,
    reset,
    play,
    pause,
    setPlaybackSpeed,
    setPreviewMode,
    toggleMetrics,
    simulateUser,
    recordAnswer,
    getMetrics
  };
}
