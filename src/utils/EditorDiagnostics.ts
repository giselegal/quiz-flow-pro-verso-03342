// @ts-nocheck
/**
 * 🔍 SISTEMA DE DIAGNÓSTICO DO EDITOR
 * ==================================
 *
 * Analisa e resolve problemas de templates, performance e inicialização
 */

import { TemplateJsonLoader } from './TemplateJsonLoader';
import { TemplateManager } from './TemplateManager';

export interface DiagnosticResult {
  category: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
  fix?: () => Promise<void>;
}

export class EditorDiagnostics {
  private static results: DiagnosticResult[] = [];

  /**
   * 🔍 Executar diagnóstico completo
   */
  static async runFullDiagnostic(): Promise<DiagnosticResult[]> {
    console.log('🔍 Iniciando diagnóstico completo do editor...');
    this.results = [];

    // Testar templates JSON
    await this.testTemplateAvailability();
    await this.testTemplateLoading();
    await this.testTemplateContent();

    // Testar performance
    await this.testPerformanceMetrics();

    // Testar inicialização
    await this.testInitializationFlow();

    console.log('✅ Diagnóstico completo finalizado:', this.results);
    return this.results;
  }

  /**
   * 🧪 Testar disponibilidade dos templates
   */
  private static async testTemplateAvailability(): Promise<void> {
    const templatePaths = [
      '/templates/step-01-template.json',
      '/templates/step-02-template.json',
      '/templates/step-03-template.json',
      '/templates/step-04-template.json',
      '/templates/step-05-template.json',
      '/templates/step-06-template.json',
      '/templates/step-07-template.json',
      '/templates/step-08-template.json',
      '/templates/step-09-template.json',
      '/templates/step-10-template.json',
      '/templates/step-11-template.json',
      '/templates/step-12-template.json',
      '/templates/step-13-template.json',
      '/templates/step-14-template.json',
      '/templates/step-15-template.json',
      '/templates/step-16-template.json',
      '/templates/step-17-template.json',
      '/templates/step-18-template.json',
      '/templates/step-19-template.json',
      '/templates/step-20-template.json',
      '/templates/step-21-template.json',
    ];

    let availableCount = 0;
    const missingTemplates = [];

    for (const path of templatePaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          availableCount++;
        } else {
          missingTemplates.push(path);
        }
      } catch (error) {
        missingTemplates.push(path);
      }
    }

    if (availableCount === 21) {
      this.results.push({
        category: 'Templates',
        status: 'success',
        message: `✅ Todos os 21 templates estão disponíveis`,
        details: { available: availableCount, total: 21 },
      });
    } else {
      this.results.push({
        category: 'Templates',
        status: 'error',
        message: `❌ ${21 - availableCount} templates estão faltando`,
        details: { missing: missingTemplates, available: availableCount, total: 21 },
      });
    }
  }

  /**
   * 🧪 Testar carregamento dos templates
   */
  private static async testTemplateLoading(): Promise<void> {
    const stepIds = Array.from({ length: 21 }, (_, i) => `step-${i + 1}`);
    let loadedCount = 0;
    const failedLoads = [];

    for (const stepId of stepIds) {
      try {
        const blocks = await TemplateManager.loadStepBlocks(stepId);
        if (blocks && blocks.length > 0) {
          loadedCount++;
        } else {
          failedLoads.push({ stepId, reason: 'Empty blocks array' });
        }
      } catch (error) {
        failedLoads.push({
          stepId,
          reason: error instanceof Error ? error.message : String(error),
        });
      }
    }

    if (loadedCount === 21) {
      this.results.push({
        category: 'Template Loading',
        status: 'success',
        message: `✅ Todos os 21 templates carregaram corretamente`,
        details: { loaded: loadedCount, total: 21 },
      });
    } else {
      this.results.push({
        category: 'Template Loading',
        status: 'error',
        message: `❌ ${21 - loadedCount} templates falharam ao carregar`,
        details: { failed: failedLoads, loaded: loadedCount, total: 21 },
      });
    }
  }

  /**
   * 🧪 Testar conteúdo dos templates
   */
  private static async testTemplateContent(): Promise<void> {
    const sampleSteps = ['step-1', 'step-2', 'step-10', 'step-21'];
    const contentIssues = [];

    for (const stepId of sampleSteps) {
      try {
        const blocks = await TemplateManager.loadStepBlocks(stepId);

        // Verificar se tem blocos
        if (!blocks || blocks.length === 0) {
          contentIssues.push({ stepId, issue: 'No blocks found' });
          continue;
        }

        // Verificar estrutura dos blocos
        for (const block of blocks) {
          if (!block.id) {
            contentIssues.push({ stepId, issue: 'Block missing ID', block });
          }
          if (!block.type) {
            contentIssues.push({ stepId, issue: 'Block missing type', block });
          }
          if (!block.properties && !block.content) {
            contentIssues.push({ stepId, issue: 'Block missing properties/content', block });
          }
        }
      } catch (error) {
        contentIssues.push({
          stepId,
          issue: error instanceof Error ? error.message : String(error),
        });
      }
    }

    if (contentIssues.length === 0) {
      this.results.push({
        category: 'Template Content',
        status: 'success',
        message: `✅ Conteúdo dos templates está estruturado corretamente`,
        details: { samplesChecked: sampleSteps.length },
      });
    } else {
      this.results.push({
        category: 'Template Content',
        status: 'warning',
        message: `⚠️ ${contentIssues.length} problemas de conteúdo encontrados`,
        details: { issues: contentIssues },
      });
    }
  }

  /**
   * 🧪 Testar métricas de performance
   */
  private static async testPerformanceMetrics(): Promise<void> {
    const performanceIssues = [];

    // Testar tempo de carregamento de template
    const startTime = performance.now();
    try {
      await TemplateManager.loadStepBlocks('step-1');
      const loadTime = performance.now() - startTime;

      if (loadTime > 500) {
        performanceIssues.push({
          metric: 'Template Load Time',
          value: loadTime,
          threshold: 500,
          status: 'slow',
        });
      }
    } catch (error) {
      performanceIssues.push({
        metric: 'Template Load',
        error: error instanceof Error ? error.message : String(error),
        status: 'failed',
      });
    }

    // Verificar uso de setTimeout
    const originalSetTimeout = window.setTimeout;
    let setTimeoutCalls = 0;
    let longTimeouts = 0;

    window.setTimeout = ((fn: any, delay: any) => {
      setTimeoutCalls++;
      if (delay > 100) longTimeouts++;
      return originalSetTimeout.call(window, fn, delay);
    }) as any;

    // Restaurar após teste
    setTimeout(() => {
      window.setTimeout = originalSetTimeout;
    }, 1000);

    if (performanceIssues.length === 0) {
      this.results.push({
        category: 'Performance',
        status: 'success',
        message: `✅ Métricas de performance estão dentro dos limites`,
        details: { setTimeoutCalls, longTimeouts },
      });
    } else {
      this.results.push({
        category: 'Performance',
        status: 'warning',
        message: `⚠️ ${performanceIssues.length} problemas de performance detectados`,
        details: { issues: performanceIssues, setTimeoutCalls, longTimeouts },
      });
    }
  }

  /**
   * 🧪 Testar fluxo de inicialização
   */
  private static async testInitializationFlow(): Promise<void> {
    const initIssues = [];

    // Testar cache
    try {
      TemplateManager.clearCache();
      await TemplateManager.loadStepBlocks('step-1');
      const cached = await TemplateManager.loadStepBlocks('step-1');

      if (!cached) {
        initIssues.push({ issue: 'Cache não está funcionando' });
      }
    } catch (error) {
      initIssues.push({
        issue: 'Erro no sistema de cache',
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Testar preload
    try {
      await TemplateManager.preloadCommonTemplates();
    } catch (error) {
      initIssues.push({
        issue: 'Erro no preload de templates',
        error: error instanceof Error ? error.message : String(error),
      });
    }

    if (initIssues.length === 0) {
      this.results.push({
        category: 'Initialization',
        status: 'success',
        message: `✅ Fluxo de inicialização funcionando corretamente`,
      });
    } else {
      this.results.push({
        category: 'Initialization',
        status: 'error',
        message: `❌ ${initIssues.length} problemas de inicialização encontrados`,
        details: { issues: initIssues },
      });
    }
  }

  /**
   * 🔧 Aplicar correções automáticas
   */
  static async applyAutomaticFixes(): Promise<DiagnosticResult[]> {
    console.log('🔧 Aplicando correções automáticas...');

    const fixes = [];

    // Limpar cache e recarregar
    try {
      TemplateManager.clearCache();
      TemplateJsonLoader.clearCache();
      await TemplateManager.preloadCommonTemplates();

      fixes.push({
        category: 'Auto-Fix',
        status: 'success' as const,
        message: '✅ Cache limpo e templates recarregados',
      });
    } catch (error) {
      fixes.push({
        category: 'Auto-Fix',
        status: 'error' as const,
        message: '❌ Erro ao aplicar correções',
        details: { error: error instanceof Error ? error.message : String(error) },
      });
    }

    return fixes;
  }

  /**
   * 📊 Gerar relatório detalhado
   */
  static generateReport(): string {
    const report = ['🔍 RELATÓRIO DE DIAGNÓSTICO DO EDITOR', '='.repeat(50), ''];

    const categories = [...new Set(this.results.map(r => r.category))];

    for (const category of categories) {
      const categoryResults = this.results.filter(r => r.category === category);
      report.push(`📋 ${category.toUpperCase()}`);

      for (const result of categoryResults) {
        const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
        report.push(`  ${icon} ${result.message}`);

        if (result.details) {
          report.push(`     Detalhes: ${JSON.stringify(result.details, null, 2)}`);
        }
      }
      report.push('');
    }

    report.push('📈 RESUMO GERAL');
    const successCount = this.results.filter(r => r.status === 'success').length;
    const warningCount = this.results.filter(r => r.status === 'warning').length;
    const errorCount = this.results.filter(r => r.status === 'error').length;

    report.push(`✅ Sucessos: ${successCount}`);
    report.push(`⚠️ Avisos: ${warningCount}`);
    report.push(`❌ Erros: ${errorCount}`);

    return report.join('\n');
  }
}

// Função para diagnóstico rápido no console
(window as any).diagEditor = async () => {
  const results = await EditorDiagnostics.runFullDiagnostic();
  console.log(EditorDiagnostics.generateReport());
  return results;
};

export default EditorDiagnostics;
