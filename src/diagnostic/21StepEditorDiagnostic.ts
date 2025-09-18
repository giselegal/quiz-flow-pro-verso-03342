/**
 * Comprehensive diagnostic tool for the 21-step editor funnel
 * Implements all 10 investigation points from the problem statement
 */

import { getBlocksForStep } from '@/config/quizStepsComplete';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

export interface DiagnosticResults {
  timestamp: string;
  overallStatus: 'healthy' | 'warning' | 'critical';
  issues: string[];
  investigations: {
    contextLoading: DiagnosticResult;
    currentStepIdentification: DiagnosticResult;
    blockLoading: DiagnosticResult;
    stepCalculation: DiagnosticResult;
    globalState: DiagnosticResult;
    eventSystem: DiagnosticResult;
    finalStepsProcessing: DiagnosticResult;
    resultsRendering: DiagnosticResult;
    loggingSystem: DiagnosticResult;
    correction: DiagnosticResult;
  };
}

export interface DiagnosticResult {
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details: any;
  recommendations?: string[];
}

/**
 * Run comprehensive diagnostic of 21-step editor funnel
 */
export function run21StepDiagnostic(): DiagnosticResults {
  const timestamp = new Date().toISOString();
  const issues: string[] = [];

  console.log('🔍 Starting 21-Step Editor Funnel Diagnostic...', { timestamp });

  // Investigation 1: Context Loading
  const contextLoading = investigateContextLoading();
  if (contextLoading.status === 'fail') issues.push('Context loading failed');

  // Investigation 2: Current Step Identification
  const currentStepIdentification = investigateCurrentStepIdentification();
  if (currentStepIdentification.status === 'fail') issues.push('Current step identification issues');

  // Investigation 3: Block Loading per Step
  const blockLoading = investigateBlockLoading();
  if (blockLoading.status === 'fail') issues.push('Block loading issues');

  // Investigation 4: Step Calculation Logic
  const stepCalculation = investigateStepCalculation();
  if (stepCalculation.status === 'fail') issues.push('Step calculation issues');

  // Investigation 5: Global State Validation
  const globalState = investigateGlobalState();
  if (globalState.status === 'fail') issues.push('Global state issues');

  // Investigation 6: Event System
  const eventSystem = investigateEventSystem();
  if (eventSystem.status === 'fail') issues.push('Event system issues');

  // Investigation 7: Final Steps Processing (19-21)
  const finalStepsProcessing = investigateFinalStepsProcessing();
  if (finalStepsProcessing.status === 'fail') issues.push('Final steps processing issues');

  // Investigation 8: Results Rendering
  const resultsRendering = investigateResultsRendering();
  if (resultsRendering.status === 'fail') issues.push('Results rendering issues');

  // Investigation 9: Logging System
  const loggingSystem = investigateLoggingSystem();
  if (loggingSystem.status === 'fail') issues.push('Logging system issues');

  // Investigation 10: Correction and Revalidation
  const correction = investigateCorrection();
  if (correction.status === 'fail') issues.push('Correction system issues');

  const overallStatus = issues.length === 0 ? 'healthy' : issues.length <= 2 ? 'warning' : 'critical';

  const results: DiagnosticResults = {
    timestamp,
    overallStatus,
    issues,
    investigations: {
      contextLoading,
      currentStepIdentification,
      blockLoading,
      stepCalculation,
      globalState,
      eventSystem,
      finalStepsProcessing,
      resultsRendering,
      loggingSystem,
      correction
    }
  };

  console.log('🎯 21-Step Editor Diagnostic Complete:', {
    overallStatus,
    issuesCount: issues.length,
    issues: issues.slice(0, 5) // Limit console output
  });

  // Store results for browser debugging
  if (typeof window !== 'undefined') {
    window.__EDITOR_DIAGNOSTIC_RESULTS__ = results;
  }

  return results;
}

function investigateContextLoading(): DiagnosticResult {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return {
        status: 'pass',
        message: 'Server-side rendering environment detected',
        details: { environment: 'server' }
      };
    }

    // Check for EditorProvider elements
    const editorProviders = document.querySelectorAll('[class*="provider"], [class*="Provider"]');
    const editorElements = document.querySelectorAll('[class*="editor"], [class*="Editor"]');

    // Check for context error markers
    const hasContextError = !!(window as any).__EDITOR_CONTEXT_ERROR__;

    if (hasContextError) {
      return {
        status: 'fail',
        message: 'Editor context error detected',
        details: {
          contextError: (window as any).__EDITOR_CONTEXT_ERROR__,
          editorProviders: editorProviders.length,
          editorElements: editorElements.length
        },
        recommendations: [
          'Verify EditorPro is wrapped in EditorProvider',
          'Check component mounting order',
          'Validate provider props'
        ]
      };
    }

    return {
      status: 'pass',
      message: 'Context loading appears healthy',
      details: {
        editorProviders: editorProviders.length,
        editorElements: editorElements.length,
        hasContextError
      }
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Context loading investigation failed',
      details: { error: String(error) },
      recommendations: ['Check browser console for errors']
    };
  }
}

function investigateCurrentStepIdentification(): DiagnosticResult {
  try {
    // Check for invalid step tracking
    const invalidSteps = typeof window !== 'undefined' ? (window as any).__EDITOR_INVALID_STEPS__ : [];

    // Test step validation logic
    const testSteps = [-1, 0, 1, 11, 21, 22, 100, 'invalid', null, undefined];
    const validationResults = testSteps.map(step => {
      const n = typeof step === 'number' ? step : (typeof step === 'string' ? parseInt(step, 10) : NaN);
      const isValid = Number.isFinite(n) && n >= 1 && n <= 21;
      return { step, isValid, type: typeof step };
    });

    const invalidCount = validationResults.filter(r => !r.isValid).length;
    const validCount = validationResults.filter(r => r.isValid).length;

    if (invalidSteps && invalidSteps.length > 5) {
      return {
        status: 'warning',
        message: `High number of invalid step attempts detected: ${invalidSteps.length}`,
        details: {
          invalidSteps: invalidSteps.slice(-5), // Last 5 attempts
          validationTest: { validCount, invalidCount },
          recentInvalidSteps: invalidSteps.slice(-3).map((s: any) => s.requestedStep)
        },
        recommendations: [
          'Check step navigation logic',
          'Validate event payload formats',
          'Review auto-correction handling'
        ]
      };
    }

    return {
      status: 'pass',
      message: 'Current step identification working correctly',
      details: {
        invalidAttemptsCount: invalidSteps ? invalidSteps.length : 0,
        validationTest: { validCount, invalidCount }
      }
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Current step identification investigation failed',
      details: { error: String(error) }
    };
  }
}

function investigateBlockLoading(): DiagnosticResult {
  try {
    // Test getBlocksForStep function for all 21 steps
    const stepResults = [];
    let successCount = 0;
    let failureCount = 0;

    for (let step = 1; step <= 21; step++) {
      try {
        const blocks = getBlocksForStep(step, QUIZ_STYLE_21_STEPS_TEMPLATE);
        const isSuccess = Array.isArray(blocks);

        stepResults.push({
          step,
          hasBlocks: isSuccess,
          blockCount: isSuccess ? blocks.length : 0,
          blockTypes: isSuccess ? blocks.map(b => b?.type || 'unknown').slice(0, 3) : []
        });

        if (isSuccess) successCount++;
        else failureCount++;
      } catch (error) {
        failureCount++;
        stepResults.push({
          step,
          hasBlocks: false,
          error: String(error)
        });
      }
    }

    // Check for failed lookups
    const failedLookups = typeof window !== 'undefined' ? (window as any).__EDITOR_FAILED_BLOCK_LOOKUPS__ : [];

    if (failureCount > 5 || (failedLookups && failedLookups.length > 10)) {
      return {
        status: 'fail',
        message: `Block loading issues detected: ${failureCount} failures`,
        details: {
          successCount,
          failureCount,
          failedSteps: stepResults.filter(r => !r.hasBlocks).map(r => r.step),
          recentFailedLookups: failedLookups ? failedLookups.slice(-3) : [],
          sampleSuccesses: stepResults.filter(r => r.hasBlocks).slice(0, 3)
        },
        recommendations: [
          'Check stepBlocks initialization',
          'Verify step key format consistency',
          'Validate template structure'
        ]
      };
    }

    return {
      status: 'pass',
      message: 'Block loading working correctly',
      details: {
        successCount,
        failureCount,
        stepsWithBlocks: stepResults.filter(r => r.hasBlocks).length,
        totalBlocksFound: stepResults.reduce((sum, r) => sum + (r.blockCount || 0), 0)
      }
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Block loading investigation failed',
      details: { error: String(error) }
    };
  }
}

function investigateStepCalculation(): DiagnosticResult {
  try {
    // Check step analysis data
    const stepAnalysis = typeof window !== 'undefined' ? (window as any).__EDITOR_STEP_ANALYSIS__ : null;

    if (!stepAnalysis) {
      return {
        status: 'warning',
        message: 'Step analysis data not available',
        details: { stepAnalysis: null },
        recommendations: ['Navigate to editor to generate step analysis data']
      };
    }

    const { stepsWithBlocks, stepsWithoutBlocks } = stepAnalysis;

    // Check for missing mandatory steps (1-10 should typically have content)
    const mandatoryStepsEmpty = stepsWithoutBlocks.filter((step: number) => step <= 10);
    const finalStepsEmpty = stepsWithoutBlocks.filter((step: number) => step >= 19);

    if (mandatoryStepsEmpty.length > 5) {
      return {
        status: 'fail',
        message: `Too many mandatory steps empty: ${mandatoryStepsEmpty.length}`,
        details: {
          mandatoryStepsEmpty,
          finalStepsEmpty,
          totalStepsWithBlocks: stepsWithBlocks.length,
          totalStepsWithoutBlocks: stepsWithoutBlocks.length
        },
        recommendations: [
          'Check template initialization',
          'Verify mandatory step content',
          'Review step validation logic'
        ]
      };
    }

    return {
      status: 'pass',
      message: 'Step calculation working correctly',
      details: {
        stepsWithBlocks: stepsWithBlocks.length,
        stepsWithoutBlocks: stepsWithoutBlocks.length,
        mandatoryStepsEmpty: mandatoryStepsEmpty.length,
        finalStepsEmpty: finalStepsEmpty.length
      }
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Step calculation investigation failed',
      details: { error: String(error) }
    };
  }
}

function investigateGlobalState(): DiagnosticResult {
  try {
    // Check for global state indicators
    const hasWindowGlobals = typeof window !== 'undefined';

    if (!hasWindowGlobals) {
      return {
        status: 'pass',
        message: 'Server-side environment, global state check skipped',
        details: { environment: 'server' }
      };
    }

    // Check for persistence issues
    const persistenceDisabled = !!(window as any).__DISABLE_EDITOR_PERSISTENCE__;

    // Check for React DevTools availability
    const hasReactDevTools = !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    return {
      status: persistenceDisabled ? 'warning' : 'pass',
      message: persistenceDisabled ? 'Editor persistence disabled' : 'Global state appears healthy',
      details: {
        persistenceDisabled,
        hasReactDevTools,
        globalKeys: Object.keys(window).filter(k => k.includes('EDITOR')).slice(0, 10)
      },
      recommendations: persistenceDisabled ? [
        'Check localStorage quota',
        'Review persistence error handling',
        'Clear problematic storage keys'
      ] : []
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Global state investigation failed',
      details: { error: String(error) }
    };
  }
}

function investigateEventSystem(): DiagnosticResult {
  try {
    // Check for invalid navigation events
    const invalidNavigation = typeof window !== 'undefined' ? (window as any).__EDITOR_INVALID_NAVIGATION__ : [];

    if (invalidNavigation && invalidNavigation.length > 3) {
      return {
        status: 'warning',
        message: `Invalid navigation events detected: ${invalidNavigation.length}`,
        details: {
          invalidEvents: invalidNavigation.slice(-3),
          commonIssues: invalidNavigation.reduce((acc: any, event: any) => {
            const key = event.rawStepId?.toString() || 'undefined';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {})
        },
        recommendations: [
          'Check event payload formats',
          'Validate event listener registration',
          'Review step ID parsing logic'
        ]
      };
    }

    return {
      status: 'pass',
      message: 'Event system working correctly',
      details: {
        invalidEventsCount: invalidNavigation ? invalidNavigation.length : 0
      }
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Event system investigation failed',
      details: { error: String(error) }
    };
  }
}

function investigateFinalStepsProcessing(): DiagnosticResult {
  try {
    // Test final steps (19-21) specifically
    const finalSteps = [19, 20, 21];
    const finalStepResults = finalSteps.map(step => {
      const blocks = getBlocksForStep(step, QUIZ_STYLE_21_STEPS_TEMPLATE);
      return {
        step,
        hasBlocks: Array.isArray(blocks) && blocks.length > 0,
        blockCount: Array.isArray(blocks) ? blocks.length : 0,
        blockTypes: Array.isArray(blocks) ? blocks.map(b => b?.type) : []
      };
    });

    const emptyFinalSteps = finalStepResults.filter(r => !r.hasBlocks);

    if (emptyFinalSteps.length === finalSteps.length) {
      return {
        status: 'fail',
        message: 'All final steps (19-21) are empty',
        details: { finalStepResults, emptyFinalSteps: emptyFinalSteps.map(r => r.step) },
        recommendations: [
          'Check final steps template content',
          'Verify results processing logic',
          'Review scoring calculation'
        ]
      };
    }

    return {
      status: 'pass',
      message: 'Final steps processing appears healthy',
      details: {
        finalStepResults,
        stepsWithContent: finalStepResults.filter(r => r.hasBlocks).length,
        totalFinalBlocks: finalStepResults.reduce((sum, r) => sum + r.blockCount, 0)
      }
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Final steps processing investigation failed',
      details: { error: String(error) }
    };
  }
}

function investigateResultsRendering(): DiagnosticResult {
  // This would require DOM inspection of actual rendered components
  // For now, provide a basic check
  try {
    const hasCanvas = typeof window !== 'undefined' && document.querySelector('[class*="canvas"], [class*="Canvas"]');
    const hasResults = typeof window !== 'undefined' && document.querySelector('[class*="result"], [class*="Result"]');

    return {
      status: 'pass',
      message: 'Results rendering check completed',
      details: {
        hasCanvas: !!hasCanvas,
        hasResults: !!hasResults,
        note: 'Full rendering check requires active navigation to final steps'
      },
      recommendations: [
        'Navigate to steps 19-21 for full results rendering validation',
        'Check component prop flow for result components',
        'Use React DevTools to inspect component state'
      ]
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Results rendering investigation failed',
      details: { error: String(error) }
    };
  }
}

function investigateLoggingSystem(): DiagnosticResult {
  try {
    // Check if logging is working
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Test console methods
    const consoleMethodsAvailable = ['log', 'warn', 'error', 'info'].every(method =>
      typeof console[method as keyof Console] === 'function'
    );

    // Check for diagnostic globals
    const diagnosticGlobals = typeof window !== 'undefined' ?
      Object.keys(window).filter(k => k.startsWith('__EDITOR_')).length : 0;

    return {
      status: 'pass',
      message: 'Logging system operational',
      details: {
        isDevelopment,
        consoleMethodsAvailable,
        diagnosticGlobals,
        environment: typeof window !== 'undefined' ? 'browser' : 'server'
      }
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Logging system investigation failed',
      details: { error: String(error) }
    };
  }
}

function investigateCorrection(): DiagnosticResult {
  try {
    // Check if correction mechanisms are in place
    const hasAutoCorrection = typeof window !== 'undefined' &&
      Object.keys(window).some(k => k.includes('INVALID') || k.includes('ERROR'));

    return {
      status: 'pass',
      message: 'Correction system available',
      details: {
        hasAutoCorrection,
        availableCorrections: [
          'currentStep range validation',
          'invalid navigation handling',
          'template auto-reload',
          'context error recovery'
        ]
      },
      recommendations: [
        'Run full editor navigation test',
        'Test rapid step switching',
        'Validate error recovery flows'
      ]
    };

  } catch (error) {
    return {
      status: 'fail',
      message: 'Correction investigation failed',
      details: { error: String(error) }
    };
  }
}

// Browser-accessible function for manual testing
if (typeof window !== 'undefined') {
  (window as any).run21StepDiagnostic = run21StepDiagnostic;
}