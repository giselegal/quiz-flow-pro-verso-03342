// @ts-nocheck
/**
 * 🔍 Diagnósticos do Editor - Sistema de 21 Etapas
 * 
 * Este módulo fornece ferramentas para investigar os gargalos e pontos cegos
 * identificados no funil de 21 etapas do /editor
 */

// Helper function for consistent logging
const devLog = (message: string, ...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[EditorDiagnostics] ${message}`, ...args);
  }
};

// Tipos para diagnósticos
interface DiagnosticResult {
  success: boolean;
  message: string;
  data?: any;
  timestamp: number;
}

interface StepDiagnostic {
  stepNumber: number;
  hasBlocks: boolean;
  blockCount: number;
  isCurrentStep: boolean;
  isValid: boolean;
  errors: string[];
}

interface EditorContextDiagnostic {
  contextAvailable: boolean;
  currentStep: number | null;
  stepBlocksInitialized: boolean;
  totalSteps: number;
  errors: string[];
}

/**
 * 1. Diagnóstico do Contexto do Editor
 * Verifica se o EditorProvider está disponível e funcionando
 */
export const diagnoseEditorContext = (): EditorContextDiagnostic => {
  const result: EditorContextDiagnostic = {
    contextAvailable: false,
    currentStep: null,
    stepBlocksInitialized: false,
    totalSteps: 0,
    errors: []
  };

  try {
    // Verifica se o hook useEditor está disponível globalmente
    const editorContext = (window as any).__EDITOR_CONTEXT__;
    
    if (!editorContext) {
      result.errors.push('Contexto do editor não encontrado em window.__EDITOR_CONTEXT__');
      return result;
    }

    result.contextAvailable = true;
    result.currentStep = editorContext.currentStep;
    result.stepBlocksInitialized = Boolean(editorContext.stepBlocks);
    result.totalSteps = editorContext.stepBlocks ? Object.keys(editorContext.stepBlocks).length : 0;

    // Validações específicas
    if (result.currentStep < 1 || result.currentStep > 21) {
      result.errors.push(`currentStep fora do intervalo válido: ${result.currentStep}`);
    }

    if (!result.stepBlocksInitialized) {
      result.errors.push('stepBlocks não inicializado');
    }

    devLog('🔍 Diagnóstico do Contexto:', result);
    
  } catch (error) {
    result.errors.push(`Erro ao acessar contexto: ${error.message}`);
  }

  return result;
};

/**
 * 2. Diagnóstico da Etapa Atual
 * Valida se currentStep está no range correto e se os handlers funcionam
 */
export const diagnoseCurrentStep = (): DiagnosticResult => {
  try {
    const context = (window as any).__EDITOR_CONTEXT__;
    if (!context) {
      return {
        success: false,
        message: 'Contexto do editor não disponível',
        timestamp: Date.now()
      };
    }

    const currentStep = context.currentStep;
    const isValidRange = currentStep >= 1 && currentStep <= 21;
    
    const result: DiagnosticResult = {
      success: isValidRange,
      message: isValidRange 
        ? `currentStep válido: ${currentStep}` 
        : `currentStep inválido: ${currentStep} (deve estar entre 1-21)`,
      data: {
        currentStep,
        isValidRange,
        hasSetCurrentStepAction: Boolean(context.actions?.setCurrentStep)
      },
      timestamp: Date.now()
    };

    // Testa o handler setCurrentStep
    if (context.actions?.setCurrentStep) {
      try {
        // Tenta definir uma etapa válida
        context.actions.setCurrentStep(currentStep);
        result.data.setCurrentStepWorks = true;
      } catch (error) {
        result.data.setCurrentStepWorks = false;
        result.data.setCurrentStepError = error.message;
      }
    }

    devLog('🔍 Diagnóstico currentStep:', result);
    return result;

  } catch (error) {
    return {
      success: false,
      message: `Erro no diagnóstico: ${error.message}`,
      timestamp: Date.now()
    };
  }
};

/**
 * 3. Diagnóstico do Carregamento de Blocos
 * Testa getBlocksForStep para todas as etapas
 */
export const diagnoseBlockLoading = (): DiagnosticResult => {
  try {
    const context = (window as any).__EDITOR_CONTEXT__;
    if (!context) {
      return {
        success: false,
        message: 'Contexto do editor não disponível',
        timestamp: Date.now()
      };
    }

    const stepBlocks = context.stepBlocks || {};
    const diagnostics: StepDiagnostic[] = [];
    let totalBlocks = 0;
    let emptySteps = 0;

    // Testa todas as 21 etapas
    for (let step = 1; step <= 21; step++) {
      const stepKey = `step-${step}`;
      const blocks = stepBlocks[stepKey] || [];
      const blockCount = Array.isArray(blocks) ? blocks.length : 0;
      
      const diagnostic: StepDiagnostic = {
        stepNumber: step,
        hasBlocks: blockCount > 0,
        blockCount,
        isCurrentStep: step === context.currentStep,
        isValid: true,
        errors: []
      };

      // Validações específicas
      if (!Array.isArray(blocks)) {
        diagnostic.isValid = false;
        diagnostic.errors.push(`Blocos não é um array para ${stepKey}`);
      }

      if (blockCount === 0) {
        emptySteps++;
      } else {
        totalBlocks += blockCount;
      }

      diagnostics.push(diagnostic);
    }

    const result: DiagnosticResult = {
      success: emptySteps < 21, // Pelo menos uma etapa deve ter blocos
      message: `${21 - emptySteps} etapas com blocos, ${emptySteps} vazias, ${totalBlocks} blocos total`,
      data: {
        diagnostics,
        totalBlocks,
        emptySteps,
        stepsWithBlocks: 21 - emptySteps,
        stepBlocksKeys: Object.keys(stepBlocks)
      },
      timestamp: Date.now()
    };

    devLog('🔍 Diagnóstico Carregamento de Blocos:', result);
    return result;

  } catch (error) {
    return {
      success: false,
      message: `Erro no diagnóstico: ${error.message}`,
      timestamp: Date.now()
    };
  }
};

/**
 * 4. Diagnóstico da Lógica de Cálculo de Etapas
 * Valida stepHasBlocks para todas as etapas
 */
export const diagnoseStepCalculation = (): DiagnosticResult => {
  try {
    const context = (window as any).__EDITOR_CONTEXT__;
    if (!context) {
      return {
        success: false,
        message: 'Contexto do editor não disponível',
        timestamp: Date.now()
      };
    }

    const stepValidation = context.stepValidation || {};
    const stepBlocks = context.stepBlocks || {};
    const discrepancies: any[] = [];

    // Compara stepValidation com a realidade dos blocos
    for (let step = 1; step <= 21; step++) {
      const stepKey = `step-${step}`;
      const blocks = stepBlocks[stepKey] || [];
      const actualHasBlocks = Array.isArray(blocks) && blocks.length > 0;
      const validationSaysHasBlocks = Boolean(stepValidation[step]);

      if (actualHasBlocks !== validationSaysHasBlocks) {
        discrepancies.push({
          step,
          actualHasBlocks,
          validationSaysHasBlocks,
          blockCount: blocks.length
        });
      }
    }

    const result: DiagnosticResult = {
      success: discrepancies.length === 0,
      message: discrepancies.length === 0 
        ? 'Lógica de cálculo consistente para todas as etapas'
        : `${discrepancies.length} discrepâncias encontradas na lógica de cálculo`,
      data: {
        discrepancies,
        stepValidation,
        totalSteps: 21,
        validatedSteps: Object.keys(stepValidation).length
      },
      timestamp: Date.now()
    };

    devLog('🔍 Diagnóstico Lógica de Cálculo:', result);
    return result;

  } catch (error) {
    return {
      success: false,
      message: `Erro no diagnóstico: ${error.message}`,
      timestamp: Date.now()
    };
  }
};

/**
 * 5. Diagnóstico de Eventos Globais
 * Testa os eventos de navegação e atualização
 */
export const diagnoseGlobalEvents = (): DiagnosticResult => {
  try {
    const eventTests: any[] = [];

    // Testa navigate-to-step
    let navigateEventFired = false;
    const navigateHandler = (event: any) => {
      navigateEventFired = true;
      eventTests.push({
        event: 'navigate-to-step',
        fired: true,
        payload: event.detail,
        timestamp: Date.now()
      });
    };

    window.addEventListener('navigate-to-step', navigateHandler);

    // Dispara evento de teste
    window.dispatchEvent(new CustomEvent('navigate-to-step', {
      detail: { step: 2, source: 'diagnostic-test' }
    }));

    // Aguarda um pouco para o evento processar
    setTimeout(() => {
      window.removeEventListener('navigate-to-step', navigateHandler);
    }, 100);

    // Testa quiz-navigate-to-step
    let quizNavigateEventFired = false;
    const quizNavigateHandler = (event: any) => {
      quizNavigateEventFired = true;
      eventTests.push({
        event: 'quiz-navigate-to-step',
        fired: true,
        payload: event.detail,
        timestamp: Date.now()
      });
    };

    window.addEventListener('quiz-navigate-to-step', quizNavigateHandler);

    window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', {
      detail: { step: 3, source: 'diagnostic-test' }
    }));

    setTimeout(() => {
      window.removeEventListener('quiz-navigate-to-step', quizNavigateHandler);
    }, 100);

    const result: DiagnosticResult = {
      success: navigateEventFired || quizNavigateEventFired,
      message: `Eventos testados: navigate-to-step=${navigateEventFired}, quiz-navigate-to-step=${quizNavigateEventFired}`,
      data: {
        eventTests,
        navigateEventFired,
        quizNavigateEventFired
      },
      timestamp: Date.now()
    };

    devLog('🔍 Diagnóstico Eventos Globais:', result);
    return result;

  } catch (error) {
    return {
      success: false,
      message: `Erro no diagnóstico: ${error.message}`,
      timestamp: Date.now()
    };
  }
};

/**
 * 6. Teste de Navegação Rápida
 * Simula navegação rápida entre etapas para detectar race conditions
 */
export const testRapidNavigation = async (): Promise<DiagnosticResult> => {
  try {
    const context = (window as any).__EDITOR_CONTEXT__;
    if (!context?.actions?.setCurrentStep) {
      return {
        success: false,
        message: 'setCurrentStep não disponível',
        timestamp: Date.now()
      };
    }

    const originalStep = context.currentStep;
    const navigationLog: any[] = [];

    // Navegação rápida: 1 -> 5 -> 10 -> 21 -> 1
    const testSteps = [1, 5, 10, 21, 1];
    
    for (const step of testSteps) {
      const before = context.currentStep;
      context.actions.setCurrentStep(step);
      await new Promise(resolve => setTimeout(resolve, 50)); // Aguarda 50ms
      const after = context.currentStep;
      
      navigationLog.push({
        targetStep: step,
        beforeStep: before,
        afterStep: after,
        success: after === step,
        timestamp: Date.now()
      });
    }

    // Restaura etapa original
    context.actions.setCurrentStep(originalStep);

    const failedNavigations = navigationLog.filter(log => !log.success);

    const result: DiagnosticResult = {
      success: failedNavigations.length === 0,
      message: failedNavigations.length === 0 
        ? 'Navegação rápida funcionou corretamente'
        : `${failedNavigations.length} falhas na navegação rápida`,
      data: {
        navigationLog,
        failedNavigations,
        originalStep,
        restoredStep: context.currentStep
      },
      timestamp: Date.now()
    };

    devLog('🔍 Teste Navegação Rápida:', result);
    return result;

  } catch (error) {
    return {
      success: false,
      message: `Erro no teste: ${error.message}`,
      timestamp: Date.now()
    };
  }
};

/**
 * 7. Diagnóstico Completo
 * Executa todos os diagnósticos em sequência
 */
export const runCompleteDiagnostics = async (): Promise<{
  summary: DiagnosticResult;
  details: Record<string, any>;
}> => {
  devLog('🚀 Iniciando diagnósticos completos do editor...');

  const details: Record<string, any> = {};

  try {
    // 1. Contexto do Editor
    details.editorContext = diagnoseEditorContext();

    // 2. Etapa Atual
    details.currentStep = diagnoseCurrentStep();

    // 3. Carregamento de Blocos
    details.blockLoading = diagnoseBlockLoading();

    // 4. Lógica de Cálculo
    details.stepCalculation = diagnoseStepCalculation();

    // 5. Eventos Globais
    details.globalEvents = diagnoseGlobalEvents();

    // 6. Navegação Rápida (assíncrono)
    details.rapidNavigation = await testRapidNavigation();

    // Análise geral
    const allTests = Object.values(details);
    const successfulTests = allTests.filter((test: any) => test.success).length;
    const totalTests = allTests.length;

    const summary: DiagnosticResult = {
      success: successfulTests === totalTests,
      message: `${successfulTests}/${totalTests} testes passaram`,
      data: {
        successfulTests,
        totalTests,
        successRate: (successfulTests / totalTests) * 100
      },
      timestamp: Date.now()
    };

    devLog('🎯 Diagnósticos completos finalizados:', { summary, details });

    // Salva no window para acesso via DevTools
    (window as any).__EDITOR_DIAGNOSTICS__ = { summary, details };

    return { summary, details };

  } catch (error) {
    const errorSummary: DiagnosticResult = {
      success: false,
      message: `Erro geral nos diagnósticos: ${error.message}`,
      timestamp: Date.now()
    };

    return {
      summary: errorSummary,
      details
    };
  }
};

// Exporta função para uso no console do navegador
if (typeof window !== 'undefined') {
  (window as any).runEditorDiagnostics = runCompleteDiagnostics;
  (window as any).diagnoseEditorContext = diagnoseEditorContext;
  (window as any).diagnoseCurrentStep = diagnoseCurrentStep;
  (window as any).diagnoseBlockLoading = diagnoseBlockLoading;
  (window as any).diagnoseStepCalculation = diagnoseStepCalculation;
  (window as any).diagnoseGlobalEvents = diagnoseGlobalEvents;
  (window as any).testRapidNavigation = testRapidNavigation;
}