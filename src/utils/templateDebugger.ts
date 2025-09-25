/**
 * 🔧 TEMPLATE DEBUGGER - SISTEMA DE DEBUG PARA TEMPLATES
 * 
 * Utilitário para debug e monitoramento do sistema de templates
 */

interface TemplateDebugInfo {
  templateId: string;
  source: string;
  hasContent: boolean;
  blockCount: number;
  loadTime: number;
  error?: string;
  metadata?: any;
}

class TemplateDebugger {
  private static debugLog: TemplateDebugInfo[] = [];
  private static maxLogSize = 100;

  /**
   * 📊 REGISTRAR CARREGAMENTO DE TEMPLATE
   */
  static logTemplateLoad(
    templateId: string,
    source: string,
    blocks: any[],
    loadTime: number,
    error?: string,
    metadata?: any
  ): void {
    const debugInfo: TemplateDebugInfo = {
      templateId,
      source,
      hasContent: Array.isArray(blocks) && blocks.length > 0,
      blockCount: Array.isArray(blocks) ? blocks.length : 0,
      loadTime,
      error,
      metadata
    };

    this.debugLog.unshift(debugInfo);
    
    // Manter apenas os últimos registros
    if (this.debugLog.length > this.maxLogSize) {
      this.debugLog.splice(this.maxLogSize);
    }

    // Log no console
    const status = error ? '❌' : (debugInfo.hasContent ? '✅' : '⚠️');
    console.log(`${status} [TemplateDebugger] ${templateId} | ${source} | ${debugInfo.blockCount} blocks | ${loadTime.toFixed(2)}ms`);
    
    if (error) {
      console.error(`❌ [TemplateDebugger] Error for ${templateId}:`, error);
    }
  }

  /**
   * 📋 OBTER RELATÓRIO DE DEBUG
   */
  static getDebugReport(): {
    totalLoads: number;
    successfulLoads: number;
    failedLoads: number;
    emptyLoads: number;
    averageLoadTime: number;
    sourceBreakdown: Record<string, number>;
    recentLogs: TemplateDebugInfo[];
  } {
    const totalLoads = this.debugLog.length;
    const successfulLoads = this.debugLog.filter(log => !log.error && log.hasContent).length;
    const failedLoads = this.debugLog.filter(log => log.error).length;
    const emptyLoads = this.debugLog.filter(log => !log.error && !log.hasContent).length;
    
    const averageLoadTime = totalLoads > 0 
      ? this.debugLog.reduce((sum, log) => sum + log.loadTime, 0) / totalLoads
      : 0;

    const sourceBreakdown: Record<string, number> = {};
    this.debugLog.forEach(log => {
      sourceBreakdown[log.source] = (sourceBreakdown[log.source] || 0) + 1;
    });

    return {
      totalLoads,
      successfulLoads,
      failedLoads,
      emptyLoads,
      averageLoadTime,
      sourceBreakdown,
      recentLogs: this.debugLog.slice(0, 10)
    };
  }

  /**
   * 🔍 VERIFICAR ESTADO DOS TEMPLATES
   */
  static async analyzeTemplateSystem(): Promise<{
    availableTemplates: string[];
    missingTemplates: string[];
    emptyTemplates: string[];
    recommendations: string[];
  }> {
    const expectedTemplates = Array.from({ length: 21 }, (_, i) => `step-${i + 1}`);
    const availableTemplates: string[] = [];
    const missingTemplates: string[] = [];
    const emptyTemplates: string[] = [];
    const recommendations: string[] = [];

    // Verificar template principal
    try {
      const { QUIZ_STYLE_21_STEPS_TEMPLATE } = await import('@/templates/quiz21StepsComplete');
      
      for (const stepId of expectedTemplates) {
        const blocks = (QUIZ_STYLE_21_STEPS_TEMPLATE as any)[stepId];
        
        if (!blocks) {
          missingTemplates.push(stepId);
        } else if (!Array.isArray(blocks) || blocks.length === 0) {
          emptyTemplates.push(stepId);
        } else {
          availableTemplates.push(stepId);
        }
      }
      
      console.log('🎯 [TemplateDebugger] Template principal verificado:', {
        available: availableTemplates.length,
        missing: missingTemplates.length,
        empty: emptyTemplates.length
      });
      
    } catch (error) {
      console.error('❌ [TemplateDebugger] Erro ao verificar template principal:', error);
      recommendations.push('Template principal (quiz21StepsComplete) não acessível');
    }

    // Gerar recomendações
    if (missingTemplates.length > 0) {
      recommendations.push(`Implementar templates ausentes: ${missingTemplates.join(', ')}`);
    }
    
    if (emptyTemplates.length > 0) {
      recommendations.push(`Adicionar conteúdo aos templates vazios: ${emptyTemplates.join(', ')}`);
    }
    
    if (availableTemplates.length < expectedTemplates.length * 0.8) {
      recommendations.push('Sistema de templates está incompleto - considerar fallbacks robustos');
    }

    return {
      availableTemplates,
      missingTemplates,
      emptyTemplates,
      recommendations
    };
  }

  /**
   * 🧪 TESTE RÁPIDO DE TEMPLATES
   */
  static async quickTest(): Promise<void> {
    console.log('🧪 [TemplateDebugger] Iniciando teste rápido...');
    
    const testSteps = ['step-1', 'step-12', 'step-20', 'step-21'];
    const { unifiedTemplateService } = await import('@/services/UnifiedTemplateService');
    
    for (const stepId of testSteps) {
      const startTime = performance.now();
      
      try {
        const blocks = await unifiedTemplateService.loadStepBlocks(stepId);
        const loadTime = performance.now() - startTime;
        
        this.logTemplateLoad(stepId, 'UnifiedTemplateService', blocks, loadTime);
      } catch (error) {
        const loadTime = performance.now() - startTime;
        this.logTemplateLoad(stepId, 'UnifiedTemplateService', [], loadTime, error instanceof Error ? error.message : String(error));
      }
    }
    
    console.log('🧪 [TemplateDebugger] Teste rápido concluído');
    console.table(this.getDebugReport());
  }

  /**
   * 🗑️ LIMPAR LOGS
   */
  static clearLogs(): void {
    this.debugLog = [];
    console.log('🗑️ [TemplateDebugger] Logs limpos');
  }

  /**
   * 📤 EXPORTAR LOGS PARA ANÁLISE
   */
  static exportLogs(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      report: this.getDebugReport(),
      fullLogs: this.debugLog
    }, null, 2);
  }
}

// 🌍 EXPOR PARA CONSOLE GLOBAL (DESENVOLVIMENTO)
if (typeof window !== 'undefined') {
  (window as any).templateDebugger = TemplateDebugger;
}

export default TemplateDebugger;