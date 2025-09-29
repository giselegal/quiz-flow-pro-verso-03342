/**
 * 🔍 CONTEXT DIAGNOSTICS - Utilitário para Diagnóstico de Contextos
 * 
 * Ferramenta para identificar e corrigir problemas de contexto do React
 * que causam o erro #300.
 */

export interface ContextDiagnostics {
  timestamp: string;
  url: string;
  userAgent: string;
  reactVersion: string;
  contextErrors: any[];
  globalErrors: any;
  editorElements: number;
  providerElements: number;
  localStorage: number;
  sessionStorage: number;
  contextProviders: string[];
  missingProviders: string[];
  recommendations: string[];
}

/**
 * Coletar diagnósticos completos do sistema
 */
export function collectContextDiagnostics(): ContextDiagnostics {
  const diagnostics: ContextDiagnostics = {
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'SSR',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
    reactVersion: (React as any).version || 'Unknown',
    contextErrors: (window as any).__EDITOR_CONTEXT_ERROR__ || [],
    globalErrors: (window as any).__FIRST_GLOBAL_ERROR__ || null,
    editorElements: typeof document !== 'undefined' ? 
      document.querySelectorAll('[class*="editor"], [class*="Editor"]').length : 0,
    providerElements: typeof document !== 'undefined' ? 
      document.querySelectorAll('[class*="provider"], [class*="Provider"]').length : 0,
    localStorage: typeof localStorage !== 'undefined' ? 
      Object.keys(localStorage).filter(key => key.includes('editor') || key.includes('funnel')).length : 0,
    sessionStorage: typeof sessionStorage !== 'undefined' ? 
      Object.keys(sessionStorage).filter(key => key.includes('editor') || key.includes('funnel')).length : 0,
    contextProviders: [],
    missingProviders: [],
    recommendations: []
  };

  // Verificar providers disponíveis
  if (typeof document !== 'undefined') {
    const providerElements = document.querySelectorAll('[class*="Provider"]');
    diagnostics.contextProviders = Array.from(providerElements).map(el => 
      el.className.split(' ').find(cls => cls.includes('Provider')) || 'Unknown'
    );
  }

  // Verificar providers necessários
  const requiredProviders = [
    'EditorProvider',
    'PureBuilderProvider',
    'CRUDIntegrationProvider',
    'FunnelMasterProvider',
    'UnifiedCRUDProvider'
  ];

  diagnostics.missingProviders = requiredProviders.filter(provider => 
    !diagnostics.contextProviders.some(available => 
      available.toLowerCase().includes(provider.toLowerCase())
    )
  );

  // Gerar recomendações
  if (diagnostics.contextErrors.length > 0) {
    diagnostics.recommendations.push('Limpar erros de contexto existentes');
  }

  if (diagnostics.missingProviders.length > 0) {
    diagnostics.recommendations.push(`Adicionar providers faltantes: ${diagnostics.missingProviders.join(', ')}`);
  }

  if (diagnostics.globalErrors) {
    diagnostics.recommendations.push('Resolver erro global detectado');
  }

  if (diagnostics.localStorage > 10) {
    diagnostics.recommendations.push('Limpar localStorage (muitos itens de editor)');
  }

  return diagnostics;
}

/**
 * Limpar contextos problemáticos
 */
export function clearProblematicContexts(): void {
  if (typeof window === 'undefined') return;

  try {
    // Limpar erros de contexto
    delete (window as any).__EDITOR_CONTEXT_ERROR__;
    delete (window as any).__FIRST_GLOBAL_ERROR__;
    delete (window as any).__EDITOR_CONTEXT__;

    // Limpar localStorage problemático
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.includes('editor') && (key.includes('error') || key.includes('context'))
    );
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Limpar sessionStorage problemático
    const sessionKeysToRemove = Object.keys(sessionStorage).filter(key => 
      key.includes('editor') && (key.includes('error') || key.includes('context'))
    );
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));

    console.log('✅ Contextos problemáticos limpos');
  } catch (error) {
    console.error('❌ Erro ao limpar contextos:', error);
  }
}

/**
 * Verificar se o contexto está saudável
 */
export function isContextHealthy(): boolean {
  const diagnostics = collectContextDiagnostics();
  
  return (
    diagnostics.contextErrors.length === 0 &&
    diagnostics.missingProviders.length === 0 &&
    !diagnostics.globalErrors
  );
}

/**
 * Auto-corrigir problemas de contexto
 */
export function autoFixContextIssues(): boolean {
  try {
    clearProblematicContexts();
    
    // Aguardar um pouco para o React se estabilizar
    setTimeout(() => {
      if (!isContextHealthy()) {
        console.warn('⚠️ Ainda há problemas de contexto após auto-correção');
      }
    }, 1000);

    return true;
  } catch (error) {
    console.error('❌ Erro na auto-correção:', error);
    return false;
  }
}

/**
 * Monitorar contextos em tempo real
 */
export function startContextMonitoring(): () => void {
  if (typeof window === 'undefined') return () => {};

  let monitoringInterval: NodeJS.Timeout;

  const monitor = () => {
    if (!isContextHealthy()) {
      console.warn('⚠️ Problemas de contexto detectados:', collectContextDiagnostics());
    }
  };

  monitoringInterval = setInterval(monitor, 5000);

  return () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
    }
  };
}
