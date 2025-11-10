/**
 * 🎯 STEP STATE SOURCE - FASE 4.2
 * 
 * Fonte única de verdade para currentStep
 * Elimina dessincronização entre providers
 * 
 * Pattern: Observable + Singleton
 */

export interface StepStateSource {
  /** Passo atual (1-indexed) */
  readonly currentStep: number;
  
  /** Atualizar passo e notificar subscribers */
  setCurrentStep(step: number): void;
  
  /** Inscrever-se para mudanças de step */
  subscribe(listener: (step: number) => void): () => void;
  
  /** Limpar todos os subscribers */
  clear(): void;
}

// ============================================================================
// IMPLEMENTATION
// ============================================================================

class StepStateSourceImpl implements StepStateSource {
  private _currentStep: number = 1;
  private listeners = new Set<(step: number) => void>();

  get currentStep(): number {
    return this._currentStep;
  }

  setCurrentStep(step: number): void {
    if (step < 1) {
      appLogger.warn('[StepStateSource] Invalid step:', { data: [step, '- must be >= 1'] });
      return;
    }

    if (this._currentStep === step) {
      return; // No change
    }

    const prevStep = this._currentStep;
    this._currentStep = step;

    if (process.env.NODE_ENV === 'development') {
      appLogger.info('[StepStateSource] Step changed:', { data: [{
                from: prevStep,
                to: step,
                listeners: this.listeners.size,
              }] });
    }

    // Notify all subscribers
    this.listeners.forEach((listener) => {
      try {
        listener(step);
      } catch (error) {
        appLogger.error('[StepStateSource] Listener error:', { data: [error] });
      }
    });
  }

  subscribe(listener: (step: number) => void): () => void {
    this.listeners.add(listener);

    if (process.env.NODE_ENV === 'development') {
      appLogger.info('[StepStateSource] Subscriber added. Total:', { data: [this.listeners.size] });
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
      
      if (process.env.NODE_ENV === 'development') {
        appLogger.info('[StepStateSource] Subscriber removed. Total:', { data: [this.listeners.size] });
      }
    };
  }

  clear(): void {
    this.listeners.clear();
    
    if (process.env.NODE_ENV === 'development') {
      appLogger.info('[StepStateSource] All subscribers cleared');
    }
  }

  // Debug utility
  getDebugInfo() {
    return {
      currentStep: this._currentStep,
      subscriberCount: this.listeners.size,
    };
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createStepStateSource(): StepStateSource {
  return new StepStateSourceImpl();
}

// ============================================================================
// SINGLETON (para uso em app global)
// ============================================================================

let globalStepStateSource: StepStateSource | null = null;

export function getGlobalStepStateSource(): StepStateSource {
  if (!globalStepStateSource) {
    globalStepStateSource = createStepStateSource();
  }
  return globalStepStateSource;
}

export function resetGlobalStepStateSource(): void {
  if (globalStepStateSource) {
    globalStepStateSource.clear();
    globalStepStateSource = null;
  }
}

// ============================================================================
// REACT HOOK
// ============================================================================

import { useState, useEffect } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

export function useStepStateSource(source: StepStateSource) {
  const [currentStep, setCurrentStep] = useState(source.currentStep);

  useEffect(() => {
    // Sync initial value
    setCurrentStep(source.currentStep);

    // Subscribe to changes
    return source.subscribe((step) => {
      setCurrentStep(step);
    });
  }, [source]);

  return currentStep;
}

// Type already exported at top of file
