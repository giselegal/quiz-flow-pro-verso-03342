import { useContext } from 'react'
import type { CombinedQuizContextValue } from './CombinedQuizStepsProvider'
import { CombinedQuizContext } from './CombinedQuizStepsProvider'

export function useCombinedQuiz(): CombinedQuizContextValue {
  const context = useContext(CombinedQuizContext)
  if (!context) {
    throw new Error('useCombinedQuiz must be used within CombinedQuizStepsProvider')
  }
  return context
}

export function useQuizFlow() {
  const ctx = useCombinedQuiz()
  return {
    currentStep: ctx.currentStep,
    totalSteps: ctx.totalSteps,
    goToStep: ctx.goToStep,
    goToNext: ctx.goToNext,
    goToPrevious: ctx.goToPrevious,
    canGoNext: ctx.canGoNext,
    canGoPrevious: ctx.canGoPrevious,
  }
}

export function useQuiz21Steps() {
  const ctx = useCombinedQuiz()
  return {
    currentStep: ctx.currentStep,
    answers: ctx.answers,
    saveAnswer: ctx.saveAnswer,
    getAnswer: ctx.getAnswer,
    getAllAnswers: ctx.getAllAnswers,
    analytics: ctx.analytics,
    trackStepStart: ctx.trackStepStart,
    trackStepEnd: ctx.trackStepEnd,
  }
}

export function useEditorQuiz() {
  const ctx = useCombinedQuiz()
  return {
    currentStep: ctx.currentStep,
    validation: ctx.validation,
    validateStep: ctx.validateStep,
    isStepValid: ctx.isStepValid,
  }
}
