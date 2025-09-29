/**
 * 🧪 USE EDITOR VALIDATION - Hook para Validação do Editor
 * 
 * Hook personalizado para executar testes de validação do editor
 * de forma reativa e gerenciar o estado dos testes.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { runFullTestSuite, runQuickTest, isSystemHealthy, TestReport } from '@/utils/automatedTestRunner';

export interface ValidationState {
  isRunning: boolean;
  isHealthy: boolean | null;
  lastReport: TestReport | null;
  error: string | null;
  lastChecked: Date | null;
}

export interface ValidationActions {
  runFullTest: () => Promise<TestReport>;
  runQuickTest: () => Promise<boolean>;
  checkHealth: () => Promise<boolean>;
  clearError: () => void;
}

export function useEditorValidation() {
  const [state, setState] = useState<ValidationState>({
    isRunning: false,
    isHealthy: null,
    lastReport: null,
    error: null,
    lastChecked: null
  });

  const runFullTest = useCallback(async (): Promise<TestReport> => {
    setState(prev => ({ ...prev, isRunning: true, error: null }));
    
    try {
      const report = await runFullTestSuite();
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        isHealthy: report.summary.failed === 0,
        lastReport: report,
        lastChecked: new Date()
      }));
      
      return report;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        error: error.message,
        isHealthy: false
      }));
      throw error;
    }
  }, []);

  const runQuickTest = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isRunning: true, error: null }));
    
    try {
      const isHealthy = await runQuickTest();
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        isHealthy,
        lastChecked: new Date()
      }));
      
      return isHealthy;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        error: error.message,
        isHealthy: false
      }));
      return false;
    }
  }, []);

  const checkHealth = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isRunning: true, error: null }));
    
    try {
      const isHealthy = await isSystemHealthy();
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        isHealthy,
        lastChecked: new Date()
      }));
      
      return isHealthy;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        error: error.message,
        isHealthy: false
      }));
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-verificação na montagem
  useEffect(() => {
    const autoCheck = async () => {
      try {
        await checkHealth();
      } catch (error) {
        console.warn('⚠️ Auto-verificação falhou:', error);
      }
    };

    autoCheck();
  }, [checkHealth]);

  const actions: ValidationActions = {
    runFullTest,
    runQuickTest,
    checkHealth,
    clearError
  };

  return {
    ...state,
    actions
  };
}

/**
 * Hook para monitoramento contínuo
 */
export function useEditorMonitoring(intervalMs: number = 30000) {
  const validation = useEditorValidation();
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(async () => {
      try {
        await validation.actions.checkHealth();
      } catch (error) {
        console.warn('⚠️ Monitoramento falhou:', error);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isMonitoring, intervalMs, validation.actions]);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  return {
    ...validation,
    isMonitoring,
    startMonitoring,
    stopMonitoring
  };
}

/**
 * Hook para validação específica de componentes
 */
export function useComponentValidation(componentName: string) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkComponent = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      // Verificar se o componente está disponível
      let component;
      
      switch (componentName) {
        case 'SafeEditorWrapper':
          component = await import('@/components/editor/SafeEditorWrapper');
          break;
        case 'SafeUnifiedEditorCore':
          component = await import('@/components/editor/SafeUnifiedEditorCore');
          break;
        case 'EditorFallback':
          component = await import('@/components/error/EditorFallback');
          break;
        default:
          throw new Error(`Componente desconhecido: ${componentName}`);
      }

      if (component && component.default) {
        setIsValid(true);
      } else {
        setIsValid(false);
        setError('Componente não exportado corretamente');
      }
    } catch (err) {
      setIsValid(false);
      setError(err.message);
    } finally {
      setIsChecking(false);
    }
  }, [componentName]);

  useEffect(() => {
    checkComponent();
  }, [checkComponent]);

  return {
    isValid,
    isChecking,
    error,
    checkComponent
  };
}
