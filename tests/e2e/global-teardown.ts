/**
 * 🧹 TEARDOWN GLOBAL DOS TESTES E2E
 * 
 * Limpeza executada após todos os testes.
 * Gera relatórios finais, limpa recursos e arquiva resultados.
 */

import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Iniciando teardown global dos testes E2E...');
  
  try {
    // 1. Gerar relatório de execução
    await generateExecutionSummary();
    
    // 2. Arquivar screenshots de falhas
    await archiveFailureScreenshots();
    
    // 3. Consolidar logs de teste
    await consolidateTestLogs();
    
    // 4. Gerar métricas de performance
    await generatePerformanceMetrics();
    
    // 5. Limpar arquivos temporários
    await cleanupTempFiles();
    
    // 6. Validar integridade dos resultados
    await validateTestResults();
    
    console.log('✅ Teardown global concluído com sucesso');
  } catch (error) {
    console.error('❌ Erro no teardown global:', error);
    // Não fazer throw para não falhar o processo de teste
  }
}

/**
 * Gerar resumo da execução dos testes
 */
async function generateExecutionSummary() {
  console.log('📊 Gerando resumo da execução...');
  
  const testConfigPath = path.join(process.cwd(), 'test-results', 'test-config.json');
  const resultsPath = path.join(process.cwd(), 'test-results', 'results.json');
  
  if (!fs.existsSync(resultsPath)) {
    console.log('⚠️ Arquivo de resultados não encontrado');
    return;
  }
  
  const startConfig = fs.existsSync(testConfigPath) 
    ? JSON.parse(fs.readFileSync(testConfigPath, 'utf8'))
    : { startTime: new Date().toISOString() };
    
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  const endTime = new Date().toISOString();
  
  const summary = {
    execution: {
      startTime: startConfig.startTime,
      endTime,
      duration: new Date(endTime).getTime() - new Date(startConfig.startTime).getTime(),
      environment: process.env.NODE_ENV || 'development',
      ci: !!process.env.CI,
    },
    
    statistics: {
      totalSuites: results.suites?.length || 0,
      totalTests: results.stats?.expected || 0,
      passed: results.stats?.passed || 0,
      failed: results.stats?.failed || 0,
      flaky: results.stats?.flaky || 0,
      skipped: results.stats?.skipped || 0,
      interrupted: results.stats?.interrupted || 0,
    },
    
    performance: {
      totalDuration: results.stats?.duration || 0,
      parallelWorkers: results.config?.workers || 1,
      retries: results.config?.retries || 0,
    },
    
    artifacts: {
      screenshots: await countFiles('test-results/**/screenshots/*.png'),
      videos: await countFiles('test-results/**/videos/*.webm'),
      traces: await countFiles('test-results/**/traces/*.zip'),
      reports: await countFiles('test-results/**/*.html'),
    },
    
    // Detalhes específicos do Quiz Flow Pro
    categories: await analyzeCategoryResults(results),
    browsers: await analyzeBrowserResults(results),
    
    metadata: {
      nodeVersion: process.version,
      playwrightVersion: require('@playwright/test/package.json').version,
      platform: process.platform,
      arch: process.arch,
    },
  };
  
  const summaryPath = path.join(process.cwd(), 'test-results', 'execution-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  // Também gerar um resumo legível
  const readableSummary = `
# 📊 Resumo da Execução de Testes E2E

**Data:** ${new Date(summary.execution.endTime).toLocaleString('pt-BR')}
**Duração Total:** ${Math.round(summary.execution.duration / 1000)}s
**Ambiente:** ${summary.execution.environment}

## Resultados
- **Total:** ${summary.statistics.totalTests} testes
- **✅ Passou:** ${summary.statistics.passed}
- **❌ Falhou:** ${summary.statistics.failed}
- **⏭️ Pulado:** ${summary.statistics.skipped}
- **🔄 Instável:** ${summary.statistics.flaky}

## Artefatos Gerados
- **Screenshots:** ${summary.artifacts.screenshots}
- **Vídeos:** ${summary.artifacts.videos}
- **Traces:** ${summary.artifacts.traces}
- **Relatórios:** ${summary.artifacts.reports}

## Performance
- **Duração Total:** ${Math.round(summary.performance.totalDuration / 1000)}s
- **Workers Paralelos:** ${summary.performance.parallelWorkers}
- **Tentativas:** ${summary.performance.retries}

${Object.entries(summary.categories).map(([category, stats]: [string, any]) => `
### ${category}
- Taxa de Sucesso: ${stats.successRate}%
- Passou: ${stats.passed}/${stats.total}
`).join('')}
`;
  
  const readablePath = path.join(process.cwd(), 'test-results', 'EXECUTION_SUMMARY.md');
  fs.writeFileSync(readablePath, readableSummary);
  
  console.log(`📋 Resumo salvo em: ${summaryPath}`);
}

/**
 * Arquivar screenshots de falhas para análise posterior
 */
async function archiveFailureScreenshots() {
  console.log('📸 Arquivando screenshots de falhas...');
  
  const screenshotsDir = path.join(process.cwd(), 'test-results');
  const archiveDir = path.join(process.cwd(), 'test-results', 'failure-archive');
  
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }
  
  // Procurar por screenshots em diretórios de teste
  const failureScreenshots = await findFiles(screenshotsDir, /screenshot.*\.png$/i);
  
  let archivedCount = 0;
  
  for (const screenshot of failureScreenshots) {
    try {
      const filename = path.basename(screenshot);
      const archivePath = path.join(archiveDir, `${Date.now()}-${filename}`);
      
      fs.copyFileSync(screenshot, archivePath);
      archivedCount++;
    } catch (error) {
      console.warn(`⚠️ Erro ao arquivar screenshot: ${screenshot}`);
    }
  }
  
  if (archivedCount > 0) {
    console.log(`📁 ${archivedCount} screenshots arquivados para análise`);
  }
}

/**
 * Consolidar logs de teste em um arquivo único
 */
async function consolidateTestLogs() {
  console.log('📝 Consolidando logs de teste...');
  
  const logsDir = path.join(process.cwd(), 'test-results');
  const consolidatedLogPath = path.join(logsDir, 'consolidated-logs.txt');
  
  const logSections = [
    '# LOGS CONSOLIDADOS DE TESTES E2E',
    `# Gerado em: ${new Date().toISOString()}`,
    '',
  ];
  
  // Adicionar logs de stdout se disponíveis
  try {
    const resultsPath = path.join(logsDir, 'results.json');
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      
      if (results.suites) {
        for (const suite of results.suites) {
          if (suite.specs) {
            for (const spec of suite.specs) {
              if (spec.tests) {
                for (const test of spec.tests) {
                  if (test.results) {
                    for (const result of test.results) {
                      if (result.stdout && result.stdout.length > 0) {
                        logSections.push(`## ${test.title}`);
                        logSections.push('```');
                        result.stdout.forEach((log: any) => {
                          logSections.push(log.toString());
                        });
                        logSections.push('```');
                        logSections.push('');
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('⚠️ Erro ao processar logs dos resultados:', error);
  }
  
  fs.writeFileSync(consolidatedLogPath, logSections.join('\n'));
  console.log(`📄 Logs consolidados salvos em: ${consolidatedLogPath}`);
}

/**
 * Gerar métricas de performance dos testes
 */
async function generatePerformanceMetrics() {
  console.log('⚡ Gerando métricas de performance...');
  
  const resultsPath = path.join(process.cwd(), 'test-results', 'results.json');
  
  if (!fs.existsSync(resultsPath)) {
    return;
  }
  
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  const metrics = {
    overview: {
      totalDuration: results.stats?.duration || 0,
      averageTestDuration: 0,
      slowestTest: { title: '', duration: 0 },
      fastestTest: { title: '', duration: Infinity },
    },
    
    categories: {} as { [key: string]: any },
    browsers: {} as { [key: string]: any },
    
    trends: {
      performance: [] as any[],
      memory: [] as any[],
      accessibility: [] as any[],
    },
  };
  
  // Analisar testes individuais
  let testCount = 0;
  let totalTestDuration = 0;
  
  if (results.suites) {
    for (const suite of results.suites) {
      if (suite.specs) {
        for (const spec of suite.specs) {
          if (spec.tests) {
            for (const test of spec.tests) {
              if (test.results) {
                for (const result of test.results) {
                  testCount++;
                  totalTestDuration += result.duration || 0;
                  
                  const duration = result.duration || 0;
                  
                  if (duration > metrics.overview.slowestTest.duration) {
                    metrics.overview.slowestTest = {
                      title: test.title,
                      duration,
                    };
                  }
                  
                  if (duration < metrics.overview.fastestTest.duration) {
                    metrics.overview.fastestTest = {
                      title: test.title,
                      duration,
                    };
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  metrics.overview.averageTestDuration = testCount > 0 ? totalTestDuration / testCount : 0;
  
  const metricsPath = path.join(process.cwd(), 'test-results', 'performance-metrics.json');
  fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));
  
  console.log(`⚡ Métricas de performance salvas em: ${metricsPath}`);
}

/**
 * Limpar arquivos temporários
 */
async function cleanupTempFiles() {
  console.log('🧹 Limpando arquivos temporários...');
  
  const tempDirs = [
    path.join(process.cwd(), 'test-results', 'tmp'),
    path.join(process.cwd(), '.temp'),
  ];
  
  for (const tempDir of tempDirs) {
    if (fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log(`🗑️ Diretório temporário removido: ${tempDir}`);
      } catch (error) {
        console.warn(`⚠️ Erro ao remover diretório temporário: ${tempDir}`);
      }
    }
  }
  
  // Limpar screenshots antigos (mais de 30 dias)
  const screenshotsDir = path.join(process.cwd(), 'test-results', 'failure-archive');
  if (fs.existsSync(screenshotsDir)) {
    const files = fs.readdirSync(screenshotsDir);
    let removedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(screenshotsDir, file);
      const stats = fs.statSync(filePath);
      const daysSinceModified = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceModified > 30) {
        fs.unlinkSync(filePath);
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      console.log(`🗑️ ${removedCount} arquivos antigos removidos`);
    }
  }
}

/**
 * Validar integridade dos resultados
 */
async function validateTestResults() {
  console.log('✅ Validando integridade dos resultados...');
  
  const requiredFiles = [
    'test-results/results.json',
    'test-results/execution-summary.json',
  ];
  
  const issues = [];
  
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      issues.push(`Arquivo ausente: ${file}`);
    } else {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        JSON.parse(content); // Validar JSON
      } catch (error) {
        issues.push(`Arquivo corrompido: ${file}`);
      }
    }
  }
  
  if (issues.length > 0) {
    console.warn('⚠️ Problemas de integridade encontrados:');
    issues.forEach(issue => console.warn(`   - ${issue}`));
  } else {
    console.log('✅ Todos os arquivos de resultado estão íntegros');
  }
}

// Funções auxiliares

async function countFiles(pattern: string): Promise<number> {
  try {
    const { glob } = await import('glob');
    const files = await glob(pattern);
    return files.length;
  } catch (error) {
    return 0;
  }
}

async function findFiles(dir: string, pattern: RegExp): Promise<string[]> {
  const files: string[] = [];
  
  function walkSync(currentDir: string) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkSync(fullPath);
      } else if (pattern.test(item)) {
        files.push(fullPath);
      }
    }
  }
  
  if (fs.existsSync(dir)) {
    walkSync(dir);
  }
  
  return files;
}

async function analyzeCategoryResults(results: any): Promise<{ [key: string]: any }> {
  const categories: { [key: string]: any } = {};
  
  // Implementar análise por categoria baseada nos títulos dos testes
  // Por enquanto, retornar estrutura básica
  
  return {
    'Acessibilidade': { total: 0, passed: 0, successRate: 0 },
    'Performance': { total: 0, passed: 0, successRate: 0 },
    'Visual': { total: 0, passed: 0, successRate: 0 },
    'Funcional': { total: 0, passed: 0, successRate: 0 },
  };
}

async function analyzeBrowserResults(results: any): Promise<{ [key: string]: any }> {
  const browsers: { [key: string]: any } = {};
  
  // Implementar análise por browser baseada nos projetos
  
  return {
    'chromium': { total: 0, passed: 0, successRate: 0 },
    'firefox': { total: 0, passed: 0, successRate: 0 },
    'webkit': { total: 0, passed: 0, successRate: 0 },
  };
}

export default globalTeardown;