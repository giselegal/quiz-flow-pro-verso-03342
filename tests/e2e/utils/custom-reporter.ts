/**
 * 📊 SISTEMA DE RELATÓRIOS PERSONALIZADOS
 * 
 * Gerador de relatórios detalhados para testes E2E
 * com métricas, análises e exportação em múltiplos formatos.
 */

import { FullResult, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

export interface CustomTestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted';
  duration: number;
  retries: number;
  error?: string;
  screenshot?: string;
  category: string;
  performance?: {
    firstContentfulPaint?: number;
    loadTime?: number;
    memoryUsage?: number;
  };
  accessibility?: {
    violations: number;
    wcagLevel: string;
  };
  visual?: {
    screenshots: number;
    visualDifferences: number;
  };
}

export interface TestReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
    timestamp: string;
    environment: string;
  };
  categories: {
    [key: string]: {
      total: number;
      passed: number;
      failed: number;
      successRate: number;
    };
  };
  performance: {
    averageLoadTime: number;
    averageFirstContentfulPaint: number;
    slowestTests: Array<{ name: string; duration: number }>;
    memoryIssues: Array<{ name: string; usage: number }>;
  };
  accessibility: {
    totalViolations: number;
    severityBreakdown: { [key: string]: number };
    wcagCompliance: number;
  };
  visual: {
    totalScreenshots: number;
    visualRegressions: number;
    newBaselines: number;
  };
  tests: CustomTestResult[];
}

class CustomReporter {
  private results: CustomTestResult[] = [];
  private reportDir: string;
  private startTime: number = 0;

  constructor() {
    this.reportDir = path.join(process.cwd(), 'test-results', 'reports');
    this.ensureReportDir();
  }

  private ensureReportDir() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  onBegin() {
    this.startTime = Date.now();
    console.log('📊 Iniciando geração de relatórios personalizados...');
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const category = this.extractCategory(test.title);
    
    const customResult: CustomTestResult = {
      testName: test.title,
      status: result.status,
      duration: result.duration,
      retries: result.retry,
      error: result.error?.message,
      category,
      screenshot: this.findScreenshot(test, result),
    };

    // Extrair métricas de performance dos logs
    const performanceData = this.extractPerformanceData(result);
    if (performanceData) {
      customResult.performance = performanceData;
    }

    // Extrair dados de acessibilidade
    const accessibilityData = this.extractAccessibilityData(result);
    if (accessibilityData) {
      customResult.accessibility = accessibilityData;
    }

    // Extrair dados visuais
    const visualData = this.extractVisualData(result);
    if (visualData) {
      customResult.visual = visualData;
    }

    this.results.push(customResult);
  }

  async onEnd(result: FullResult) {
    const report = this.generateReport(result);
    
    // Gerar relatórios em diferentes formatos
    await this.generateHTMLReport(report);
    await this.generateJSONReport(report);
    await this.generateCSVReport(report);
    await this.generateMarkdownReport(report);
    
    console.log(`📊 Relatórios gerados em: ${this.reportDir}`);
  }

  private extractCategory(testTitle: string): string {
    const categories = {
      'Acessibilidade': /acessibilidade|accessibility|aria|wcag/i,
      'Performance': /performance|speed|load|memory/i,
      'Visual': /visual|screenshot|regression|appearance/i,
      'Funcional': /functional|feature|user.*flow|interaction/i,
      'Responsividade': /responsive|mobile|tablet|desktop|viewport/i,
      'Segurança': /security|auth|permission|cors/i,
      'API': /api|endpoint|service|integration/i,
      'Navegação': /navigation|routing|url|link/i,
    };

    for (const [category, pattern] of Object.entries(categories)) {
      if (pattern.test(testTitle)) {
        return category;
      }
    }

    return 'Geral';
  }

  private findScreenshot(test: TestCase, result: TestResult): string | undefined {
    if (result.attachments) {
      const screenshot = result.attachments.find(
        att => att.name === 'screenshot' || att.contentType?.includes('image')
      );
      return screenshot?.path;
    }
    return undefined;
  }

  private extractPerformanceData(result: TestResult): CustomTestResult['performance'] | undefined {
    // Extrair dados de performance dos logs do console
    const stdout = result.stdout?.find(chunk => 
      chunk.toString().includes('Métricas de performance')
    );
    
    if (stdout) {
      try {
        const metricsMatch = stdout.toString().match(/{"firstContentfulPaint":(\d+).*"loadComplete":(\d+).*"usedJSHeapSize":(\d+)/);
        if (metricsMatch) {
          return {
            firstContentfulPaint: parseInt(metricsMatch[1]),
            loadTime: parseInt(metricsMatch[2]),
            memoryUsage: parseInt(metricsMatch[3]),
          };
        }
      } catch (error) {
        // Ignorar erros de parsing
      }
    }

    return undefined;
  }

  private extractAccessibilityData(result: TestResult): CustomTestResult['accessibility'] | undefined {
    const stdout = result.stdout?.find(chunk => 
      chunk.toString().includes('violações de acessibilidade') ||
      chunk.toString().includes('accessibility violations')
    );
    
    if (stdout) {
      try {
        const violationsMatch = stdout.toString().match(/(\d+)\s+violações?/i);
        if (violationsMatch) {
          return {
            violations: parseInt(violationsMatch[1]),
            wcagLevel: 'AA', // Assumir WCAG AA por padrão
          };
        }
      } catch (error) {
        // Ignorar erros de parsing
      }
    }

    return undefined;
  }

  private extractVisualData(result: TestResult): CustomTestResult['visual'] | undefined {
    if (result.attachments) {
      const screenshots = result.attachments.filter(
        att => att.contentType?.includes('image')
      );
      
      if (screenshots.length > 0) {
        return {
          screenshots: screenshots.length,
          visualDifferences: result.status === 'failed' ? 1 : 0,
        };
      }
    }

    return undefined;
  }

  private generateReport(result: FullResult): TestReport {
    const duration = Date.now() - this.startTime;
    
    // Resumo geral
    const summary = {
      total: this.results.length,
      passed: this.results.filter(r => r.status === 'passed').length,
      failed: this.results.filter(r => r.status === 'failed').length,
      skipped: this.results.filter(r => r.status === 'skipped').length,
      duration,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };

    // Análise por categoria
    const categories: TestReport['categories'] = {};
    const categoryGroups = this.results.reduce((acc, test) => {
      if (!acc[test.category]) acc[test.category] = [];
      acc[test.category].push(test);
      return acc;
    }, {} as { [key: string]: CustomTestResult[] });

    Object.entries(categoryGroups).forEach(([category, tests]) => {
      const passed = tests.filter(t => t.status === 'passed').length;
      categories[category] = {
        total: tests.length,
        passed,
        failed: tests.filter(t => t.status === 'failed').length,
        successRate: Math.round((passed / tests.length) * 100),
      };
    });

    // Análise de performance
    const performanceTests = this.results.filter(r => r.performance);
    const performance = {
      averageLoadTime: this.calculateAverage(performanceTests.map(r => r.performance?.loadTime).filter((val): val is number => val !== undefined)),
      averageFirstContentfulPaint: this.calculateAverage(performanceTests.map(r => r.performance?.firstContentfulPaint).filter((val): val is number => val !== undefined)),
      slowestTests: this.results
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5)
        .map(r => ({ name: r.testName, duration: r.duration })),
      memoryIssues: performanceTests
        .filter(r => r.performance?.memoryUsage && r.performance.memoryUsage > 50)
        .map(r => ({ name: r.testName, usage: r.performance?.memoryUsage || 0 })),
    };

    // Análise de acessibilidade
    const accessibilityTests = this.results.filter(r => r.accessibility);
    const totalViolations = accessibilityTests.reduce((sum, r) => sum + (r.accessibility?.violations || 0), 0);
    const accessibility = {
      totalViolations,
      severityBreakdown: { high: 0, medium: 0, low: 0 }, // Placeholder
      wcagCompliance: accessibilityTests.length > 0 ? 
        Math.round(((accessibilityTests.length - accessibilityTests.filter(r => (r.accessibility?.violations || 0) > 0).length) / accessibilityTests.length) * 100) : 0,
    };

    // Análise visual
    const visualTests = this.results.filter(r => r.visual);
    const visual = {
      totalScreenshots: visualTests.reduce((sum, r) => sum + (r.visual?.screenshots || 0), 0),
      visualRegressions: visualTests.reduce((sum, r) => sum + (r.visual?.visualDifferences || 0), 0),
      newBaselines: 0, // Placeholder
    };

    return {
      summary,
      categories,
      performance,
      accessibility,
      visual,
      tests: this.results,
    };
  }

  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  }

  private async generateHTMLReport(report: TestReport) {
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Testes E2E - Quiz Flow Pro</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; text-align: center; }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.1em; opacity: 0.9; }
        
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
        .stat-card h3 { color: #666; font-size: 0.9em; text-transform: uppercase; margin-bottom: 10px; }
        .stat-card .number { font-size: 2.5em; font-weight: bold; margin-bottom: 5px; }
        .stat-card .number.passed { color: #4caf50; }
        .stat-card .number.failed { color: #f44336; }
        .stat-card .number.total { color: #2196f3; }
        .stat-card .number.duration { color: #ff9800; }
        
        .section { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .section h2 { color: #333; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #eee; }
        
        .categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
        .category-card { padding: 15px; border-left: 4px solid #2196f3; background: #f8f9fa; border-radius: 0 4px 4px 0; }
        .category-card h4 { color: #333; margin-bottom: 8px; }
        .progress-bar { background: #eee; height: 8px; border-radius: 4px; overflow: hidden; margin: 10px 0; }
        .progress-fill { background: linear-gradient(90deg, #4caf50, #8bc34a); height: 100%; transition: width 0.3s ease; }
        
        .test-list { display: grid; gap: 10px; }
        .test-item { padding: 15px; border-radius: 6px; border-left: 4px solid #ddd; }
        .test-item.passed { background: #e8f5e8; border-left-color: #4caf50; }
        .test-item.failed { background: #ffebee; border-left-color: #f44336; }
        .test-item.skipped { background: #fff3e0; border-left-color: #ff9800; }
        .test-header { display: flex; justify-content: between; align-items: center; margin-bottom: 5px; }
        .test-name { font-weight: 600; flex-grow: 1; }
        .test-duration { font-size: 0.9em; color: #666; }
        .test-category { display: inline-block; background: #e3f2fd; color: #1976d2; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin-right: 8px; }
        
        .chart-container { height: 300px; background: #f8f9fa; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #666; margin: 20px 0; }
        
        @media (max-width: 768px) {
            .container { padding: 15px; }
            .header { padding: 20px; }
            .header h1 { font-size: 2em; }
            .summary { grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .categories { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Relatório de Testes E2E</h1>
            <p>Quiz Flow Pro - ${report.summary.timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <h3>Total de Testes</h3>
                <div class="number total">${report.summary.total}</div>
                <p>Testes executados</p>
            </div>
            <div class="stat-card">
                <h3>Passou</h3>
                <div class="number passed">${report.summary.passed}</div>
                <p>${Math.round((report.summary.passed / report.summary.total) * 100)}% de sucesso</p>
            </div>
            <div class="stat-card">
                <h3>Falhou</h3>
                <div class="number failed">${report.summary.failed}</div>
                <p>${Math.round((report.summary.failed / report.summary.total) * 100)}% de falhas</p>
            </div>
            <div class="stat-card">
                <h3>Duração</h3>
                <div class="number duration">${Math.round(report.summary.duration / 1000)}s</div>
                <p>Tempo total</p>
            </div>
        </div>
        
        <div class="section">
            <h2>📊 Análise por Categoria</h2>
            <div class="categories">
                ${Object.entries(report.categories).map(([name, data]) => `
                    <div class="category-card">
                        <h4>${name}</h4>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>${data.passed}/${data.total} passaram</span>
                            <span>${data.successRate}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${data.successRate}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2>⚡ Performance</h2>
            <div class="summary">
                <div class="stat-card">
                    <h3>Tempo de Carregamento</h3>
                    <div class="number">${report.performance.averageLoadTime}ms</div>
                    <p>Média</p>
                </div>
                <div class="stat-card">
                    <h3>First Contentful Paint</h3>
                    <div class="number">${report.performance.averageFirstContentfulPaint}ms</div>
                    <p>Média</p>
                </div>
                <div class="stat-card">
                    <h3>Problemas de Memória</h3>
                    <div class="number failed">${report.performance.memoryIssues.length}</div>
                    <p>Testes acima de 50MB</p>
                </div>
            </div>
            
            <h4>Testes Mais Lentos:</h4>
            <ul>
                ${report.performance.slowestTests.map(test => 
                    `<li>${test.name}: ${Math.round(test.duration)}ms</li>`
                ).join('')}
            </ul>
        </div>
        
        <div class="section">
            <h2>♿ Acessibilidade</h2>
            <div class="summary">
                <div class="stat-card">
                    <h3>Violações WCAG</h3>
                    <div class="number ${report.accessibility.totalViolations === 0 ? 'passed' : 'failed'}">${report.accessibility.totalViolations}</div>
                    <p>Total encontradas</p>
                </div>
                <div class="stat-card">
                    <h3>Conformidade WCAG</h3>
                    <div class="number ${report.accessibility.wcagCompliance > 80 ? 'passed' : 'failed'}">${report.accessibility.wcagCompliance}%</div>
                    <p>Taxa de conformidade</p>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>📸 Testes Visuais</h2>
            <div class="summary">
                <div class="stat-card">
                    <h3>Screenshots</h3>
                    <div class="number">${report.visual.totalScreenshots}</div>
                    <p>Total capturados</p>
                </div>
                <div class="stat-card">
                    <h3>Regressões Visuais</h3>
                    <div class="number ${report.visual.visualRegressions === 0 ? 'passed' : 'failed'}">${report.visual.visualRegressions}</div>
                    <p>Diferenças detectadas</p>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>📋 Detalhes dos Testes</h2>
            <div class="test-list">
                ${report.tests.map(test => `
                    <div class="test-item ${test.status}">
                        <div class="test-header">
                            <div class="test-name">
                                <span class="test-category">${test.category}</span>
                                ${test.testName}
                            </div>
                            <div class="test-duration">${Math.round(test.duration)}ms</div>
                        </div>
                        ${test.error ? `<div style="color: #f44336; font-size: 0.9em; margin-top: 8px;">❌ ${test.error}</div>` : ''}
                        ${test.performance ? `
                            <div style="font-size: 0.9em; color: #666; margin-top: 5px;">
                                ⚡ FCP: ${test.performance.firstContentfulPaint}ms | 
                                Load: ${test.performance.loadTime}ms | 
                                Memory: ${test.performance.memoryUsage}MB
                            </div>
                        ` : ''}
                        ${test.accessibility ? `
                            <div style="font-size: 0.9em; color: #666; margin-top: 5px;">
                                ♿ ${test.accessibility.violations} violações WCAG-${test.accessibility.wcagLevel}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
</body>
</html>`;

    const htmlPath = path.join(this.reportDir, 'test-report.html');
    fs.writeFileSync(htmlPath, html, 'utf8');
  }

  private async generateJSONReport(report: TestReport) {
    const jsonPath = path.join(this.reportDir, 'test-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
  }

  private async generateCSVReport(report: TestReport) {
    const csvHeaders = [
      'Test Name',
      'Category',
      'Status',
      'Duration (ms)',
      'Retries',
      'Error',
      'FCP (ms)',
      'Load Time (ms)',
      'Memory (MB)',
      'A11y Violations',
      'Screenshots'
    ];

    const csvRows = report.tests.map(test => [
      `"${test.testName}"`,
      test.category,
      test.status,
      test.duration.toString(),
      test.retries.toString(),
      test.error ? `"${test.error.replace(/"/g, '""')}"` : '',
      test.performance?.firstContentfulPaint?.toString() || '',
      test.performance?.loadTime?.toString() || '',
      test.performance?.memoryUsage?.toString() || '',
      test.accessibility?.violations?.toString() || '',
      test.visual?.screenshots?.toString() || ''
    ]);

    const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    const csvPath = path.join(this.reportDir, 'test-report.csv');
    fs.writeFileSync(csvPath, csvContent, 'utf8');
  }

  private async generateMarkdownReport(report: TestReport) {
    const md = `# 🧪 Relatório de Testes E2E - Quiz Flow Pro

**Data:** ${new Date(report.summary.timestamp).toLocaleString('pt-BR')}  
**Ambiente:** ${report.summary.environment}  
**Duração Total:** ${Math.round(report.summary.duration / 1000)}s

## 📊 Resumo Executivo

| Métrica | Valor | Percentual |
|---------|-------|-----------|
| **Total de Testes** | ${report.summary.total} | 100% |
| **✅ Passou** | ${report.summary.passed} | ${Math.round((report.summary.passed / report.summary.total) * 100)}% |
| **❌ Falhou** | ${report.summary.failed} | ${Math.round((report.summary.failed / report.summary.total) * 100)}% |
| **⏭️ Pulado** | ${report.summary.skipped} | ${Math.round((report.summary.skipped / report.summary.total) * 100)}% |

## 🎯 Análise por Categoria

${Object.entries(report.categories).map(([name, data]) => `
### ${name}
- **Taxa de Sucesso:** ${data.successRate}%
- **Passou:** ${data.passed}/${data.total}
- **Falhou:** ${data.failed}/${data.total}
`).join('')}

## ⚡ Performance

- **Tempo Médio de Carregamento:** ${report.performance.averageLoadTime}ms
- **First Contentful Paint Médio:** ${report.performance.averageFirstContentfulPaint}ms
- **Problemas de Memória:** ${report.performance.memoryIssues.length} testes

### Testes Mais Lentos
${report.performance.slowestTests.map((test, i) => `${i + 1}. ${test.name}: ${Math.round(test.duration)}ms`).join('\n')}

## ♿ Acessibilidade

- **Total de Violações WCAG:** ${report.accessibility.totalViolations}
- **Taxa de Conformidade:** ${report.accessibility.wcagCompliance}%

## 📸 Testes Visuais

- **Screenshots Capturados:** ${report.visual.totalScreenshots}
- **Regressões Visuais:** ${report.visual.visualRegressions}

## 📋 Detalhes dos Testes

${report.tests.map(test => `
### ${test.testName}
- **Categoria:** ${test.category}
- **Status:** ${test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏭️'} ${test.status}
- **Duração:** ${Math.round(test.duration)}ms
- **Tentativas:** ${test.retries}
${test.error ? `- **Erro:** ${test.error}` : ''}
${test.performance ? `- **Performance:** FCP ${test.performance.firstContentfulPaint}ms, Load ${test.performance.loadTime}ms, Memory ${test.performance.memoryUsage}MB` : ''}
${test.accessibility ? `- **Acessibilidade:** ${test.accessibility.violations} violações WCAG-${test.accessibility.wcagLevel}` : ''}
`).join('')}

---
*Relatório gerado automaticamente pelo sistema de testes E2E do Quiz Flow Pro*`;

    const mdPath = path.join(this.reportDir, 'test-report.md');
    fs.writeFileSync(mdPath, md, 'utf8');
  }
}

export default CustomReporter;