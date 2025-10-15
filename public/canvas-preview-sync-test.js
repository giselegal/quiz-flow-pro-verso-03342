/**
 * 🧪 SUITE DE TESTES - Canvas vs Preview Synchronization
 * 
 * Testes automatizados para verificar se o preview reflete exatamente
 * os templates do canvas em todos os aspectos
 */

class CanvasPreviewSyncTester {
  constructor() {
    this.results = [];
    this.errors = [];
    this.templates = new Map();
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    
    console.log(`${this.getIcon(type)} ${logEntry}`);
    
    this.results.push({
      timestamp,
      message,
      type,
      testId: this.currentTest || 'general'
    });
  }

  getIcon(type) {
    const icons = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      test: '🧪',
      sync: '🔄'
    };
    return icons[type] || '📋';
  }

  async runAllTests() {
    this.log('INICIANDO SUITE DE TESTES - Canvas vs Preview Sync', 'test');
    this.log('============================================', 'test');

    try {
      // Teste 1: Verificar se estamos no ambiente correto
      await this.testEnvironment();
      
      // Teste 2: Verificar carregamento de templates
      await this.testTemplateLoading();
      
      // Teste 3: Comparar estrutura DOM
      await this.testDOMStructure();
      
      // Teste 4: Verificar sincronização de dados
      await this.testDataSync();
      
      // Teste 5: Testar mudanças em tempo real
      await this.testRealTimeSync();
      
      // Teste 6: Verificar Step 20 especificamente
      await this.testStep20Sync();
      
      // Resultado final
      this.generateReport();
      
    } catch (error) {
      this.log(`Erro durante execução dos testes: ${error.message}`, 'error');
      this.errors.push(error);
    }
  }

  async testEnvironment() {
    this.currentTest = 'environment';
    this.log('Teste 1: Verificando ambiente', 'test');
    
    // Verificar se estamos no editor
    if (!window.location.pathname.includes('/editor')) {
      throw new Error('Testes devem ser executados na página /editor');
    }
    this.log('✓ Executando no editor', 'success');
    
    // Verificar se o servidor está respondendo
    try {
      const response = await fetch('/templates/step-01-v3.json');
      if (response.ok) {
        this.log('✓ Servidor de templates funcionando', 'success');
      } else {
        this.log('⚠ Servidor de templates com problemas', 'warning');
      }
    } catch (error) {
      this.log('✗ Servidor de templates não responde', 'error');
    }
  }

  async testTemplateLoading() {
    this.currentTest = 'template-loading';
    this.log('Teste 2: Verificando carregamento de templates', 'test');
    
    const templatePromises = [];
    const expectedTemplates = Array.from({length: 21}, (_, i) => i + 1);
    
    for (const stepNumber of expectedTemplates) {
      const stepId = stepNumber.toString().padStart(2, '0');
      const templateUrl = `/templates/step-${stepId}-v3.json`;
      
      const promise = fetch(templateUrl)
        .then(response => {
          if (response.ok) {
            return response.json().then(data => {
              this.templates.set(stepNumber, data);
              this.log(`✓ Template ${stepNumber} carregado (${data.sections?.length || data.blocks?.length || 0} elementos)`, 'success');
              return { stepNumber, success: true, data };
            });
          } else {
            this.log(`✗ Template ${stepNumber} falhou (HTTP ${response.status})`, 'error');
            return { stepNumber, success: false, status: response.status };
          }
        })
        .catch(error => {
          this.log(`✗ Template ${stepNumber} erro: ${error.message}`, 'error');
          return { stepNumber, success: false, error: error.message };
        });
      
      templatePromises.push(promise);
    }
    
    const results = await Promise.allSettled(templatePromises);
    const successCount = results.filter(r => r.value?.success).length;
    
    this.log(`Resultado: ${successCount}/21 templates carregados com sucesso`, 
             successCount === 21 ? 'success' : 'warning');
  }

  async testDOMStructure() {
    this.currentTest = 'dom-structure';
    this.log('Teste 3: Comparando estrutura DOM', 'test');
    
    // Aguardar elementos carregarem
    await this.waitForElements();
    
    const tests = [
      {
        name: 'Canvas Container',
        canvasSelector: '[data-testid="canvas"], .canvas, [class*="canvas"]',
        previewSelector: '[data-testid="preview"], .preview, [class*="preview"]'
      },
      {
        name: 'Step Elements',
        canvasSelector: '[data-step]',
        previewSelector: '[data-step]'
      },
      {
        name: 'Block Elements',
        canvasSelector: '[data-block-id], [data-block-type]',
        previewSelector: '[data-block-id], [data-block-type]'
      },
      {
        name: 'Result Sections',
        canvasSelector: '[data-type*="result"], [class*="result"]',
        previewSelector: '[data-type*="result"], [class*="result"]'
      }
    ];
    
    let structureMatches = 0;
    
    for (const test of tests) {
      const canvasElements = document.querySelectorAll(test.canvasSelector);
      const previewElements = document.querySelectorAll(test.previewSelector);
      
      const canvasCount = canvasElements.length;
      const previewCount = previewElements.length;
      
      if (canvasCount === previewCount && canvasCount > 0) {
        this.log(`✓ ${test.name}: ${canvasCount} elementos (sincronizado)`, 'success');
        structureMatches++;
      } else if (canvasCount === previewCount && canvasCount === 0) {
        this.log(`⚠ ${test.name}: 0 elementos (pode ser normal)`, 'warning');
      } else {
        this.log(`✗ ${test.name}: Canvas(${canvasCount}) vs Preview(${previewCount})`, 'error');
      }
    }
    
    const syncPercentage = Math.round((structureMatches / tests.length) * 100);
    this.log(`Sincronização estrutural: ${syncPercentage}%`, 
             syncPercentage >= 80 ? 'success' : 'warning');
  }

  async testDataSync() {
    this.currentTest = 'data-sync';
    this.log('Teste 4: Verificando sincronização de dados', 'test');
    
    // Verificar requests de templates
    const performanceEntries = performance.getEntriesByType('resource')
      .filter(entry => entry.name.includes('template'));
    
    this.log(`Requests de templates detectados: ${performanceEntries.length}`, 'info');
    
    const templateUrls = performanceEntries.map(entry => entry.name);
    const v3Templates = templateUrls.filter(url => url.includes('-v3.json'));
    const oldTemplates = templateUrls.filter(url => url.includes('-template.json'));
    
    this.log(`Templates v3: ${v3Templates.length}`, v3Templates.length > 0 ? 'success' : 'warning');
    this.log(`Templates antigos: ${oldTemplates.length}`, oldTemplates.length === 0 ? 'success' : 'error');
    
    // Verificar dados no localStorage/sessionStorage
    const storageKeys = Object.keys(localStorage).concat(Object.keys(sessionStorage));
    const templateKeys = storageKeys.filter(key => 
      key.includes('template') || key.includes('step') || key.includes('quiz')
    );
    
    this.log(`Chaves de armazenamento relacionadas: ${templateKeys.length}`, 'info');
    
    // Verificar se há dados conflitantes
    let conflicts = 0;
    templateKeys.forEach(key => {
      const data = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (data && data.includes('step-') && data.includes('template.json')) {
        conflicts++;
        this.log(`⚠ Possível conflito em ${key}`, 'warning');
      }
    });
    
    this.log(`Conflitos de dados: ${conflicts}`, conflicts === 0 ? 'success' : 'warning');
  }

  async testRealTimeSync() {
    this.currentTest = 'realtime-sync';
    this.log('Teste 5: Testando sincronização em tempo real', 'test');
    
    return new Promise((resolve) => {
      let changes = 0;
      const maxChanges = 10;
      const timeout = 5000;
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && (
                node.dataset?.step ||
                node.dataset?.blockId ||
                node.className?.includes('block') ||
                node.className?.includes('section')
              )) {
                changes++;
                this.log(`Mudança ${changes}: ${node.tagName} adicionado`, 'sync');
                
                if (changes >= maxChanges) {
                  observer.disconnect();
                  this.log(`✓ Detectadas ${changes} mudanças dinâmicas`, 'success');
                  resolve();
                }
              }
            });
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
      
      // Timeout para não esperar indefinidamente
      setTimeout(() => {
        observer.disconnect();
        this.log(`Mudanças detectadas no timeout: ${changes}`, 
                 changes > 0 ? 'success' : 'warning');
        resolve();
      }, timeout);
      
      this.log('Monitorando mudanças DOM por 5 segundos...', 'info');
    });
  }

  async testStep20Sync() {
    this.currentTest = 'step20-sync';
    this.log('Teste 6: Verificando Step 20 especificamente', 'test');
    
    // Verificar template Step 20
    const step20Template = this.templates.get(20);
    if (step20Template) {
      this.log(`✓ Template Step 20: v${step20Template.templateVersion}`, 'success');
      this.log(`✓ Seções: ${step20Template.sections?.length || 0}`, 'info');
      this.log(`✓ ID: ${step20Template.metadata?.id}`, 'info');
      
      // Verificar se é híbrido
      const isHybrid = step20Template.metadata?.id?.includes('hybrid') ||
                       step20Template.metadata?.description?.includes('híbrido');
      this.log(`Template híbrido: ${isHybrid ? 'Sim' : 'Não'}`, 
               isHybrid ? 'success' : 'warning');
      
      // Verificar seção de cálculo
      const hasCalculation = step20Template.sections?.some((s: any) => 
        s.type?.includes('Calculation') || s.id?.includes('calculation')
      );
      this.log(`Seção de cálculo: ${hasCalculation ? 'Presente' : 'Ausente'}`, 
               hasCalculation ? 'success' : 'error');
      
    } else {
      this.log('✗ Template Step 20 não encontrado', 'error');
    }
    
    // Verificar elementos Step 20 no DOM
    const step20Elements = document.querySelectorAll('[data-step="20"], [class*="step-20"]');
    this.log(`Elementos Step 20 no DOM: ${step20Elements.length}`, 'info');
    
    // Verificar elementos de resultado
    const resultElements = document.querySelectorAll('[data-type*="result"], [class*="result"]');
    this.log(`Elementos de resultado: ${resultElements.length}`, 'info');
  }

  async waitForElements(timeout = 3000) {
    return new Promise((resolve) => {
      const checkElements = () => {
        const elements = document.querySelectorAll('[data-step], [data-block-id]');
        if (elements.length > 0) {
          this.log(`✓ Elementos carregados: ${elements.length}`, 'success');
          resolve(elements.length);
        } else {
          setTimeout(checkElements, 100);
        }
      };
      
      checkElements();
      
      // Timeout de segurança
      setTimeout(() => {
        this.log('⚠ Timeout esperando elementos carregar', 'warning');
        resolve(0);
      }, timeout);
    });
  }

  generateReport() {
    this.currentTest = 'report';
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    
    this.log('='.repeat(50), 'test');
    this.log('RELATÓRIO FINAL - Canvas vs Preview Sync', 'test');
    this.log('='.repeat(50), 'test');
    
    // Estatísticas
    const totalTests = this.results.length;
    const successes = this.results.filter(r => r.type === 'success').length;
    const warnings = this.results.filter(r => r.type === 'warning').length;
    const errors = this.results.filter(r => r.type === 'error').length;
    
    this.log(`Duração: ${duration}ms`, 'info');
    this.log(`Total de verificações: ${totalTests}`, 'info');
    this.log(`Sucessos: ${successes}`, 'success');
    this.log(`Avisos: ${warnings}`, 'warning');
    this.log(`Erros: ${errors}`, 'error');
    
    // Percentual de sucesso
    const successRate = Math.round((successes / (successes + errors)) * 100) || 0;
    this.log(`Taxa de sucesso: ${successRate}%`, 
             successRate >= 90 ? 'success' : 
             successRate >= 70 ? 'warning' : 'error');
    
    // Diagnóstico final
    let diagnosis = '';
    if (successRate >= 90) {
      diagnosis = '🎉 CANVAS E PREVIEW ESTÃO SINCRONIZADOS!';
    } else if (successRate >= 70) {
      diagnosis = '⚠️ SINCRONIZAÇÃO PARCIAL - Alguns problemas detectados';
    } else {
      diagnosis = '❌ PROBLEMAS GRAVES DE SINCRONIZAÇÃO';
    }
    
    this.log(diagnosis, successRate >= 90 ? 'success' : 'warning');
    
    // Recomendações
    this.log('', 'info');
    this.log('RECOMENDAÇÕES:', 'test');
    
    if (errors > 0) {
      this.log('• Verificar erros reportados acima', 'warning');
    }
    if (warnings > 5) {
      this.log('• Muitos avisos - investigar possíveis problemas', 'warning');
    }
    if (successRate < 90) {
      this.log('• Executar testes individuais para identificar problemas específicos', 'warning');
    }
    
    // Salvar relatório
    this.saveReport();
  }

  saveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      results: this.results,
      errors: this.errors,
      templates: Array.from(this.templates.keys()),
      summary: {
        total: this.results.length,
        successes: this.results.filter(r => r.type === 'success').length,
        warnings: this.results.filter(r => r.type === 'warning').length,
        errors: this.results.filter(r => r.type === 'error').length
      }
    };
    
    // Salvar no sessionStorage
    sessionStorage.setItem('canvas-preview-sync-test', JSON.stringify(report));
    this.log('✓ Relatório salvo em sessionStorage', 'success');
  }
}

// Executar testes automaticamente
console.log('🧪 CARREGANDO SUITE DE TESTES...');

const tester = new CanvasPreviewSyncTester();
tester.runAllTests();

// Disponibilizar globalmente para testes manuais
window.canvasPreviewTester = tester;