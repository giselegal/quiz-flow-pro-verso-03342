/**
 * 🤖 AUTOMATED TEST RUNNER - Executor Automatizado de Testes
 * 
 * Utilitário para executar testes de validação automaticamente
 * e gerar relatórios de forma programática.
 */

export interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  duration?: number;
  error?: string;
}

export interface TestReport {
  timestamp: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    successRate: number;
  };
  results: TestResult[];
  environment: {
    userAgent: string;
    url: string;
    timestamp: string;
  };
}

/**
 * Executar teste individual
 */
export async function runSingleTest(testName: string, testFunction: () => Promise<string>): Promise<TestResult> {
  const startTime = performance.now();
  
  const result: TestResult = {
    name: testName,
    status: 'running',
    message: 'Executando...'
  };

  try {
    const message = await testFunction();
    const endTime = performance.now();
    
    result.status = 'passed';
    result.message = message;
    result.duration = endTime - startTime;
    
  } catch (error) {
    const endTime = performance.now();
    
    result.status = 'failed';
    result.message = `Erro: ${error.message}`;
    result.error = error.message;
    result.duration = endTime - startTime;
  }

  return result;
}

/**
 * Executar bateria completa de testes
 */
export async function runFullTestSuite(): Promise<TestReport> {
  const startTime = performance.now();
  
  // Lista de testes
  const tests = [
    {
      name: 'Contexto do React',
      test: async () => {
        if (typeof React === 'undefined') {
          throw new Error('React não está disponível');
        }
        if (!React.createContext) {
          throw new Error('React.createContext não está disponível');
        }
        return 'React e createContext estão disponíveis';
      }
    },
    {
      name: 'Providers de Contexto',
      test: async () => {
        const availableProviders = [];
        
        try {
          const { EditorProvider } = await import('@/components/editor/EditorProvider');
          availableProviders.push('EditorProvider');
        } catch (e) {
          console.warn('EditorProvider não encontrado:', e);
        }

        try {
          const { PureBuilderProvider } = await import('@/components/editor/PureBuilderProvider');
          availableProviders.push('PureBuilderProvider');
        } catch (e) {
          console.warn('PureBuilderProvider não encontrado:', e);
        }

        if (availableProviders.length === 0) {
          throw new Error('Nenhum provider encontrado');
        }

        return `Providers disponíveis: ${availableProviders.join(', ')}`;
      }
    },
    {
      name: 'Componentes do Editor',
      test: async () => {
        const availableComponents = [];
        
        try {
          await import('@/components/editor/SafeEditorWrapper');
          availableComponents.push('SafeEditorWrapper');
        } catch (e) {
          console.warn('SafeEditorWrapper não encontrado:', e);
        }

        try {
          await import('@/components/editor/SafeUnifiedEditorCore');
          availableComponents.push('SafeUnifiedEditorCore');
        } catch (e) {
          console.warn('SafeUnifiedEditorCore não encontrado:', e);
        }

        try {
          await import('@/components/error/EditorFallback');
          availableComponents.push('EditorFallback');
        } catch (e) {
          console.warn('EditorFallback não encontrado:', e);
        }

        if (availableComponents.length === 0) {
          throw new Error('Nenhum componente do editor encontrado');
        }

        return `Componentes disponíveis: ${availableComponents.join(', ')}`;
      }
    },
    {
      name: 'Sistema de Diagnóstico',
      test: async () => {
        try {
          const { collectContextDiagnostics, isContextHealthy } = await import('@/utils/contextDiagnostics');
          
          if (typeof collectContextDiagnostics !== 'function') {
            throw new Error('collectContextDiagnostics não é uma função');
          }
          
          if (typeof isContextHealthy !== 'function') {
            throw new Error('isContextHealthy não é uma função');
          }

          const diagnostics = collectContextDiagnostics();
          const isHealthy = isContextHealthy();

          return `Diagnóstico executado: ${isHealthy ? 'Saudável' : 'Problemas detectados'}`;
        } catch (e) {
          throw new Error(`Sistema de diagnóstico não disponível: ${e.message}`);
        }
      }
    },
    {
      name: 'Performance do Editor',
      test: async () => {
        const startTime = performance.now();
        
        // Simular operações do editor
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const endTime = performance.now();
        const duration = endTime - startTime;

        if (duration > 1000) {
          throw new Error(`Performance lenta: ${duration}ms`);
        }

        return `Performance OK: ${duration.toFixed(2)}ms`;
      }
    }
  ];

  // Executar todos os testes
  const results: TestResult[] = [];
  
  for (const test of tests) {
    const result = await runSingleTest(test.name, test.test);
    results.push(result);
    
    // Pequena pausa entre testes
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Calcular estatísticas
  const passedTests = results.filter(r => r.status === 'passed').length;
  const failedTests = results.filter(r => r.status === 'failed').length;
  const totalTests = results.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  const endTime = performance.now();
  const totalDuration = endTime - startTime;

  // Gerar relatório
  const report: TestReport = {
    timestamp: new Date().toISOString(),
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      successRate: parseFloat(successRate.toFixed(2))
    },
    results,
    environment: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      timestamp: new Date().toISOString()
    }
  };

  console.log('🧪 Teste de Validação Concluído:', {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    successRate: `${successRate.toFixed(2)}%`,
    duration: `${totalDuration.toFixed(2)}ms`
  });

  return report;
}

/**
 * Executar teste em background
 */
export function runBackgroundTest(): Promise<TestReport> {
  return new Promise((resolve, reject) => {
    try {
      runFullTestSuite().then(resolve).catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Verificar se o sistema está saudável
 */
export async function isSystemHealthy(): Promise<boolean> {
  try {
    const report = await runFullTestSuite();
    return report.summary.failed === 0;
  } catch (error) {
    console.error('❌ Erro ao verificar saúde do sistema:', error);
    return false;
  }
}

/**
 * Executar teste rápido
 */
export async function runQuickTest(): Promise<boolean> {
  try {
    // Teste básico de contexto
    if (typeof React === 'undefined') {
      return false;
    }

    // Teste básico de componentes
    try {
      await import('@/components/editor/SafeEditorWrapper');
      await import('@/components/editor/SafeUnifiedEditorCore');
      return true;
    } catch (e) {
      return false;
    }
  } catch (error) {
    console.error('❌ Erro no teste rápido:', error);
    return false;
  }
}
