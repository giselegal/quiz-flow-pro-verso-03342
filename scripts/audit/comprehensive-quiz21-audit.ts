/**
 * 🔍 SCRIPT DE AUDITORIA COMPLETA: quiz21StepsComplete
 * 
 * Realiza auditoria detalhada do funil conforme requisitos:
 * 1. Verificação de carregamento (JSON, tempos, consistência)
 * 2. Teste dos modos de operação (Editar, Visualizar Editor, Visualizar Publicado)
 * 3. Painel de propriedades
 * 4. Identificação de gargalos
 * 5. Análise de performance
 */

import { chromium, Browser, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:8081';
const EDITOR_URL = `${BASE_URL}/editor?resource=quiz21StepsComplete`;
const OUTPUT_DIR = '/tmp/audit-quiz21-results';

interface AuditResult {
  timestamp: string;
  section: string;
  findings: AuditFinding[];
  metrics?: Record<string, any>;
  screenshots?: string[];
}

interface AuditFinding {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  description: string;
  recommendation?: string;
  evidence?: string[];
}

class Quiz21Auditor {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private results: AuditResult[] = [];
  private startTime: number = 0;

  async initialize() {
    console.log('🚀 Inicializando auditoria...');
    this.startTime = Date.now();
    
    // Criar diretório de saída
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Inicializar navegador
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
    
    // Configurar listeners de console e erros
    this.setupListeners();
  }

  private setupListeners() {
    if (!this.page) return;

    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    const networkErrors: string[] = [];

    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    this.page.on('requestfailed', request => {
      networkErrors.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    });

    // Armazenar para uso posterior
    (this.page as any)._auditData = {
      consoleErrors,
      consoleWarnings,
      networkErrors,
    };
  }

  async screenshot(name: string): Promise<string> {
    if (!this.page) throw new Error('Page not initialized');
    
    const filename = `${name}-${Date.now()}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);
    await this.page.screenshot({ path: filepath, fullPage: true });
    
    console.log(`📸 Screenshot salvo: ${filename}`);
    return filepath;
  }

  async measureLoadTime(operation: () => Promise<void>): Promise<number> {
    const start = Date.now();
    await operation();
    return Date.now() - start;
  }

  // ========================================================================
  // 1. VERIFICAÇÃO DE CARREGAMENTO
  // ========================================================================

  async auditLoading(): Promise<AuditResult> {
    console.log('\n📦 1. VERIFICAÇÃO DE CARREGAMENTO');
    const findings: AuditFinding[] = [];
    const metrics: Record<string, any> = {};
    const screenshots: string[] = [];

    try {
      // Medir tempo de carregamento inicial
      const loadTime = await this.measureLoadTime(async () => {
        await this.page!.goto(EDITOR_URL, { 
          waitUntil: 'domcontentloaded',
          timeout: 30000 
        });
      });

      metrics.initialLoadTime = loadTime;
      console.log(`  ⏱️  Tempo de carregamento inicial: ${loadTime}ms`);

      if (loadTime > 10000) {
        findings.push({
          id: 'LOAD-001',
          severity: 'HIGH',
          category: 'Performance',
          description: `Tempo de carregamento muito alto: ${loadTime}ms`,
          recommendation: 'Otimizar lazy loading e code splitting'
        });
      } else if (loadTime > 5000) {
        findings.push({
          id: 'LOAD-002',
          severity: 'MEDIUM',
          category: 'Performance',
          description: `Tempo de carregamento acima do ideal: ${loadTime}ms`,
          recommendation: 'Considerar otimizações adicionais'
        });
      }

      // Aguardar editor carregar
      await this.page!.waitForSelector('[data-testid="modular-layout"]', { timeout: 15000 });
      screenshots.push(await this.screenshot('01-initial-load'));

      // Verificar se todos os 21 steps foram carregados
      const stepCount = await this.page!.locator('[data-testid="step-navigator-item"]').count();
      metrics.stepsLoaded = stepCount;
      console.log(`  📊 Steps carregados: ${stepCount}/21`);

      if (stepCount !== 21) {
        findings.push({
          id: 'LOAD-003',
          severity: 'CRITICAL',
          category: 'Dados',
          description: `Apenas ${stepCount} de 21 steps foram carregados`,
          recommendation: 'Verificar carregamento de dados do template'
        });
      }

      // Verificar erros de console
      const auditData = (this.page as any)._auditData;
      metrics.consoleErrors = auditData.consoleErrors.length;
      metrics.consoleWarnings = auditData.consoleWarnings.length;
      metrics.networkErrors = auditData.networkErrors.length;

      console.log(`  ❌ Erros de console: ${auditData.consoleErrors.length}`);
      console.log(`  ⚠️  Warnings de console: ${auditData.consoleWarnings.length}`);
      console.log(`  🌐 Erros de rede: ${auditData.networkErrors.length}`);

      if (auditData.consoleErrors.length > 0) {
        findings.push({
          id: 'LOAD-004',
          severity: 'HIGH',
          category: 'Erros',
          description: `${auditData.consoleErrors.length} erros de console detectados`,
          evidence: auditData.consoleErrors.slice(0, 5),
          recommendation: 'Corrigir erros de JavaScript'
        });
      }

      if (auditData.networkErrors.length > 2) {
        findings.push({
          id: 'LOAD-005',
          severity: 'MEDIUM',
          category: 'Rede',
          description: `${auditData.networkErrors.length} requisições falhadas`,
          evidence: auditData.networkErrors.slice(0, 5),
          recommendation: 'Verificar endpoints e recursos'
        });
      }

    } catch (error: any) {
      findings.push({
        id: 'LOAD-ERROR',
        severity: 'CRITICAL',
        category: 'Sistema',
        description: `Erro durante auditoria de carregamento: ${error.message}`,
      });
    }

    return {
      timestamp: new Date().toISOString(),
      section: '1. Verificação de Carregamento',
      findings,
      metrics,
      screenshots
    };
  }

  // ========================================================================
  // 2. TESTE DOS MODOS DE OPERAÇÃO
  // ========================================================================

  async auditOperationModes(): Promise<AuditResult> {
    console.log('\n🎭 2. TESTE DOS MODOS DE OPERAÇÃO');
    const findings: AuditFinding[] = [];
    const screenshots: string[] = [];

    try {
      // Verificar que estamos em modo de edição
      const canvasColumn = this.page!.getByTestId('column-canvas');
      const isVisible = await canvasColumn.isVisible({ timeout: 5000 });

      if (!isVisible) {
        findings.push({
          id: 'MODE-001',
          severity: 'CRITICAL',
          category: 'UI',
          description: 'Canvas do editor não está visível',
          recommendation: 'Verificar inicialização do editor'
        });
      } else {
        screenshots.push(await this.screenshot('02-edit-mode'));
      }

      // Testar navegação entre steps
      console.log('  🔄 Testando navegação entre steps...');
      const navigationTimes: number[] = [];
      
      for (const stepNum of [1, 5, 10, 15, 20, 21]) {
        try {
          const navTime = await this.measureLoadTime(async () => {
            const stepButton = this.page!.locator(`[data-testid="step-navigator-item"][data-step-order="${stepNum}"]`).first();
            await stepButton.click({ timeout: 5000 });
            await this.page!.waitForTimeout(500);
          });
          
          navigationTimes.push(navTime);
          console.log(`    Step ${stepNum}: ${navTime}ms`);
        } catch (error: any) {
          findings.push({
            id: `MODE-NAV-${stepNum}`,
            severity: 'HIGH',
            category: 'Navegação',
            description: `Falha ao navegar para step ${stepNum}: ${error.message}`,
          });
        }
      }

      if (navigationTimes.length > 0) {
        const avgNavTime = navigationTimes.reduce((a, b) => a + b, 0) / navigationTimes.length;
        console.log(`  📊 Tempo médio de navegação: ${avgNavTime.toFixed(2)}ms`);

        if (avgNavTime > 2000) {
          findings.push({
            id: 'MODE-002',
            severity: 'HIGH',
            category: 'Performance',
            description: `Navegação entre steps muito lenta: ${avgNavTime.toFixed(2)}ms`,
            recommendation: 'Otimizar renderização e prefetch de steps'
          });
        }
      }

      // Verificar painel de propriedades
      const propertiesPanel = this.page!.getByTestId('column-properties');
      const propertiesVisible = await propertiesPanel.isVisible({ timeout: 2000 });
      
      if (!propertiesVisible) {
        findings.push({
          id: 'MODE-003',
          severity: 'MEDIUM',
          category: 'UI',
          description: 'Painel de propriedades não está visível',
          recommendation: 'Verificar layout do editor'
        });
      }

      screenshots.push(await this.screenshot('03-properties-panel'));

    } catch (error: any) {
      findings.push({
        id: 'MODE-ERROR',
        severity: 'CRITICAL',
        category: 'Sistema',
        description: `Erro durante auditoria de modos: ${error.message}`,
      });
    }

    return {
      timestamp: new Date().toISOString(),
      section: '2. Teste dos Modos de Operação',
      findings,
      screenshots
    };
  }

  // ========================================================================
  // 3. PAINEL DE PROPRIEDADES
  // ========================================================================

  async auditPropertiesPanel(): Promise<AuditResult> {
    console.log('\n⚙️  3. PAINEL DE PROPRIEDADES');
    const findings: AuditFinding[] = [];
    const screenshots: string[] = [];

    try {
      // Navegar para step 1
      const step1Button = this.page!.locator('[data-testid="step-navigator-item"][data-step-order="1"]').first();
      await step1Button.click();
      await this.page!.waitForTimeout(1000);

      // Verificar se há blocos no canvas
      const canvas = this.page!.getByTestId('column-canvas');
      const blocks = canvas.locator('[data-block-id]');
      const blockCount = await blocks.count();

      console.log(`  📦 Blocos encontrados no step 1: ${blockCount}`);

      if (blockCount === 0) {
        findings.push({
          id: 'PROP-001',
          severity: 'HIGH',
          category: 'Dados',
          description: 'Nenhum bloco encontrado no step 1',
          recommendation: 'Verificar carregamento de blocos'
        });
      } else {
        // Tentar selecionar primeiro bloco
        try {
          await blocks.first().click({ timeout: 3000 });
          await this.page!.waitForTimeout(500);
          
          // Verificar se painel de propriedades atualizou
          const propertiesPanel = this.page!.getByTestId('column-properties');
          const propertiesContent = await propertiesPanel.textContent();
          
          if (!propertiesContent || propertiesContent.trim().length === 0) {
            findings.push({
              id: 'PROP-002',
              severity: 'MEDIUM',
              category: 'UI',
              description: 'Painel de propriedades não atualizou ao selecionar bloco',
              recommendation: 'Verificar sincronização entre canvas e propriedades'
            });
          }

          screenshots.push(await this.screenshot('04-block-selected'));

        } catch (error: any) {
          findings.push({
            id: 'PROP-003',
            severity: 'MEDIUM',
            category: 'Interação',
            description: `Não foi possível selecionar bloco: ${error.message}`,
          });
        }
      }

      // Verificar campos editáveis
      const propertiesPanel = this.page!.getByTestId('column-properties');
      const inputFields = await propertiesPanel.locator('input, textarea, select').count();
      
      console.log(`  🔧 Campos editáveis encontrados: ${inputFields}`);

      if (inputFields === 0) {
        findings.push({
          id: 'PROP-004',
          severity: 'LOW',
          category: 'UI',
          description: 'Nenhum campo editável encontrado no painel de propriedades',
          recommendation: 'Verificar se o bloco selecionado tem propriedades editáveis'
        });
      }

    } catch (error: any) {
      findings.push({
        id: 'PROP-ERROR',
        severity: 'CRITICAL',
        category: 'Sistema',
        description: `Erro durante auditoria do painel: ${error.message}`,
      });
    }

    return {
      timestamp: new Date().toISOString(),
      section: '3. Painel de Propriedades',
      findings,
      screenshots
    };
  }

  // ========================================================================
  // 4. IDENTIFICAÇÃO DE GARGALOS
  // ========================================================================

  async auditBottlenecks(): Promise<AuditResult> {
    console.log('\n🔍 4. IDENTIFICAÇÃO DE GARGALOS');
    const findings: AuditFinding[] = [];
    const metrics: Record<string, any> = {};

    try {
      // Medir uso de memória (via performance API)
      const memoryUsage = await this.page!.evaluate(() => {
        if ('memory' in performance && (performance as any).memory) {
          return {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
          };
        }
        return null;
      });

      if (memoryUsage) {
        metrics.memory = memoryUsage;
        console.log(`  💾 Memória JS usada: ${(memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
        
        const usagePercent = (memoryUsage.usedJSHeapSize / memoryUsage.jsHeapSizeLimit) * 100;
        if (usagePercent > 80) {
          findings.push({
            id: 'BOTTLE-001',
            severity: 'HIGH',
            category: 'Performance',
            description: `Alto uso de memória: ${usagePercent.toFixed(2)}%`,
            recommendation: 'Verificar memory leaks e otimizar componentes'
          });
        }
      }

      // Verificar elementos de acessibilidade
      const buttonsWithoutLabel = await this.page!.locator('button:not([aria-label]):not([aria-labelledby])').count();
      const inputsWithoutLabel = await this.page!.locator('input:not([aria-label]):not([aria-labelledby]):not([id])').count();

      metrics.a11y = {
        buttonsWithoutLabel,
        inputsWithoutLabel
      };

      console.log(`  ♿ Botões sem aria-label: ${buttonsWithoutLabel}`);
      console.log(`  ♿ Inputs sem label: ${inputsWithoutLabel}`);

      if (buttonsWithoutLabel > 20) {
        findings.push({
          id: 'BOTTLE-002',
          severity: 'MEDIUM',
          category: 'Acessibilidade',
          description: `${buttonsWithoutLabel} botões sem aria-label`,
          recommendation: 'Adicionar labels de acessibilidade'
        });
      }

      // Verificar loading spinners persistentes
      const loadingSpinners = await this.page!.locator('[data-loading="true"], .loading, [aria-busy="true"]').count();
      
      if (loadingSpinners > 0) {
        findings.push({
          id: 'BOTTLE-003',
          severity: 'MEDIUM',
          category: 'UX',
          description: `${loadingSpinners} loading spinners ativos podem indicar operações travadas`,
          recommendation: 'Verificar operações assíncronas'
        });
      }

    } catch (error: any) {
      findings.push({
        id: 'BOTTLE-ERROR',
        severity: 'CRITICAL',
        category: 'Sistema',
        description: `Erro durante auditoria de gargalos: ${error.message}`,
      });
    }

    return {
      timestamp: new Date().toISOString(),
      section: '4. Identificação de Gargalos',
      findings,
      metrics
    };
  }

  // ========================================================================
  // GERAÇÃO DO RELATÓRIO
  // ========================================================================

  async generateReport() {
    console.log('\n📝 Gerando relatório final...');
    
    const totalTime = Date.now() - this.startTime;
    
    const report = {
      metadata: {
        timestamp: new Date().toISOString(),
        duration: `${(totalTime / 1000).toFixed(2)}s`,
        url: EDITOR_URL,
        auditor: 'Quiz21 Comprehensive Auditor v1.0'
      },
      summary: {
        totalFindings: this.results.reduce((sum, r) => sum + r.findings.length, 0),
        critical: this.results.reduce((sum, r) => sum + r.findings.filter(f => f.severity === 'CRITICAL').length, 0),
        high: this.results.reduce((sum, r) => sum + r.findings.filter(f => f.severity === 'HIGH').length, 0),
        medium: this.results.reduce((sum, r) => sum + r.findings.filter(f => f.severity === 'MEDIUM').length, 0),
        low: this.results.reduce((sum, r) => sum + r.findings.filter(f => f.severity === 'LOW').length, 0),
      },
      results: this.results
    };

    // Salvar relatório JSON
    const reportPath = path.join(OUTPUT_DIR, 'audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✅ Relatório salvo em: ${reportPath}`);

    // Gerar relatório Markdown
    const mdReport = this.generateMarkdownReport(report);
    const mdPath = path.join(OUTPUT_DIR, 'AUDIT_REPORT.md');
    fs.writeFileSync(mdPath, mdReport);
    console.log(`✅ Relatório MD salvo em: ${mdPath}`);

    return report;
  }

  private generateMarkdownReport(report: any): string {
    let md = '# 🔍 RELATÓRIO DE AUDITORIA COMPLETA\n\n';
    md += `## quiz21StepsComplete\n\n`;
    md += `**Data:** ${report.metadata.timestamp}\n`;
    md += `**Duração:** ${report.metadata.duration}\n`;
    md += `**URL:** ${report.metadata.url}\n\n`;

    md += '## 📊 RESUMO EXECUTIVO\n\n';
    md += `- 🔴 **Crítico:** ${report.summary.critical}\n`;
    md += `- 🟠 **Alto:** ${report.summary.high}\n`;
    md += `- 🟡 **Médio:** ${report.summary.medium}\n`;
    md += `- 🟢 **Baixo:** ${report.summary.low}\n`;
    md += `- **Total de Achados:** ${report.summary.totalFindings}\n\n`;

    // Detalhes por seção
    for (const result of report.results) {
      md += `## ${result.section}\n\n`;
      
      if (result.metrics) {
        md += '### 📈 Métricas\n\n';
        md += '```json\n';
        md += JSON.stringify(result.metrics, null, 2);
        md += '\n```\n\n';
      }

      if (result.findings.length > 0) {
        md += '### 🔎 Achados\n\n';
        for (const finding of result.findings) {
          const emoji = {
            'CRITICAL': '🔴',
            'HIGH': '🟠',
            'MEDIUM': '🟡',
            'LOW': '🟢',
            'INFO': 'ℹ️'
          }[finding.severity] || '⚪';
          
          md += `#### ${emoji} ${finding.id}: ${finding.description}\n\n`;
          md += `- **Severidade:** ${finding.severity}\n`;
          md += `- **Categoria:** ${finding.category}\n`;
          
          if (finding.recommendation) {
            md += `- **Recomendação:** ${finding.recommendation}\n`;
          }
          
          if (finding.evidence && finding.evidence.length > 0) {
            md += `- **Evidências:**\n`;
            for (const evidence of finding.evidence.slice(0, 3)) {
              md += `  - ${evidence}\n`;
            }
          }
          
          md += '\n';
        }
      } else {
        md += '✅ Nenhum problema encontrado nesta seção.\n\n';
      }

      if (result.screenshots && result.screenshots.length > 0) {
        md += '### 📸 Screenshots\n\n';
        for (const screenshot of result.screenshots) {
          md += `- ${path.basename(screenshot)}\n`;
        }
        md += '\n';
      }
    }

    return md;
  }

  // ========================================================================
  // EXECUÇÃO PRINCIPAL
  // ========================================================================

  async run() {
    try {
      await this.initialize();

      // Executar auditorias
      this.results.push(await this.auditLoading());
      this.results.push(await this.auditOperationModes());
      this.results.push(await this.auditPropertiesPanel());
      this.results.push(await this.auditBottlenecks());

      // Gerar relatório
      const report = await this.generateReport();

      console.log('\n' + '='.repeat(80));
      console.log('✅ AUDITORIA CONCLUÍDA COM SUCESSO!');
      console.log('='.repeat(80));
      console.log(`\n📊 Total de achados: ${report.summary.totalFindings}`);
      console.log(`   🔴 Crítico: ${report.summary.critical}`);
      console.log(`   🟠 Alto: ${report.summary.high}`);
      console.log(`   🟡 Médio: ${report.summary.medium}`);
      console.log(`   🟢 Baixo: ${report.summary.low}`);
      console.log(`\n📁 Resultados salvos em: ${OUTPUT_DIR}`);

      return report;

    } catch (error) {
      console.error('❌ Erro durante auditoria:', error);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Execução
const auditor = new Quiz21Auditor();
auditor.run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export { Quiz21Auditor };
