/**
 * 🧪 TESTE UNITÁRIO - stepTemplateService
 * 
 * Testa especificamente o serviço de templates para garantir
 * que está retornando dados corretos para canvas e preview
 */

class StepTemplateServiceTester {
  constructor() {
    this.results = [];
    this.templateCache = new Map();
    this.errors = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const icon = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      test: '🧪'
    }[type] || 'ℹ️';
    
    const logMessage = `${icon} [${timestamp}] ${message}`;
    console.log(logMessage);
    
    this.results.push({
      timestamp,
      message,
      type,
      logMessage
    });
  }

  async runAllTests() {
    this.log('TESTE UNITÁRIO - stepTemplateService', 'test');
    this.log('=====================================', 'test');
    
    try {
      await this.testServiceExists();
      await this.testTemplateLoading();
      await this.testCacheFunction();
      await this.testSynchronousLoading();
      await this.testStep20Specifically();
      await this.testErrorHandling();
      
      this.generateServiceReport();
      
    } catch (error) {
      this.log(`Erro crítico nos testes: ${error.message}`, 'error');
      this.errors.push(error);
    }
  }

  async testServiceExists() {
    this.log('Teste 1: Verificando existência do serviço', 'test');
    
    // Tentar acessar o serviço via import dinâmico
    try {
      const serviceModule = await import('/src/services/stepTemplateService.ts');
      this.stepTemplateService = serviceModule;
      this.log('✓ Módulo stepTemplateService importado com sucesso', 'success');
      
      // Verificar funções exportadas
      const functions = Object.keys(serviceModule);
      this.log(`Funções disponíveis: ${functions.join(', ')}`, 'info');
      
      // Verificar funções específicas
      const expectedFunctions = ['getTemplate', 'getStepTemplate', 'ensureTemplateLoaded'];
      const missingFunctions = expectedFunctions.filter(fn => !functions.includes(fn));
      
      if (missingFunctions.length === 0) {
        this.log('✓ Todas as funções esperadas estão disponíveis', 'success');
      } else {
        this.log(`⚠ Funções em falta: ${missingFunctions.join(', ')}`, 'warning');
      }
      
    } catch (error) {
      this.log(`✗ Erro ao importar serviço: ${error.message}`, 'error');
      
      // Tentar acessar via window (se estiver globalmente disponível)
      if (window.stepTemplateService) {
        this.log('✓ Serviço encontrado no window global', 'success');
        this.stepTemplateService = window.stepTemplateService;
      } else {
        this.log('✗ Serviço não encontrado globalmente', 'error');
      }
    }
  }

  async testTemplateLoading() {
    this.log('Teste 2: Carregamento direto de templates', 'test');
    
    const testSteps = [1, 10, 20, 21];
    
    for (const stepNumber of testSteps) {
      try {
        // Teste 1: Fetch direto
        const stepId = stepNumber.toString().padStart(2, '0');
        const templateUrl = `/templates/step-${stepId}-v3.json`;
        
        const response = await fetch(templateUrl);
        if (response.ok) {
          const templateData = await response.json();
          this.templateCache.set(stepNumber, templateData);
          
          this.log(`✓ Step ${stepNumber}: ${templateData.sections?.length || templateData.blocks?.length || 0} elementos`, 'success');
          
          // Verificar estrutura do template
          if (templateData.templateVersion) {
            this.log(`  • Versão: ${templateData.templateVersion}`, 'info');
          }
          if (templateData.metadata?.id) {
            this.log(`  • ID: ${templateData.metadata.id}`, 'info');
          }
          
        } else {
          this.log(`✗ Step ${stepNumber}: HTTP ${response.status}`, 'error');
        }
        
        // Teste 2: Via serviço (se disponível)
        if (this.stepTemplateService && this.stepTemplateService.getTemplate) {
          try {
            const serviceTemplate = await this.stepTemplateService.getTemplate(stepNumber);
            if (serviceTemplate && Object.keys(serviceTemplate).length > 0) {
              this.log(`✓ Step ${stepNumber} via serviço: OK`, 'success');
            } else {
              this.log(`✗ Step ${stepNumber} via serviço: vazio`, 'error');
            }
          } catch (serviceError) {
            this.log(`✗ Step ${stepNumber} via serviço: ${serviceError.message}`, 'error');
          }
        }
        
      } catch (error) {
        this.log(`✗ Step ${stepNumber}: ${error.message}`, 'error');
        this.errors.push({step: stepNumber, error: error.message});
      }
    }
  }

  async testCacheFunction() {
    this.log('Teste 3: Sistema de cache', 'test');
    
    // Verificar se existe cache no serviço
    if (this.stepTemplateService) {
      try {
        // Tentar acessar cache interno
        const cacheKeys = Object.keys(this.stepTemplateService);
        const cacheRelated = cacheKeys.filter(key => 
          key.toLowerCase().includes('cache') || 
          key.toLowerCase().includes('template')
        );
        
        this.log(`Cache relacionado no serviço: ${cacheRelated.join(', ')}`, 'info');
        
        // Testar preload se disponível
        if (this.stepTemplateService.preloadAllTemplates) {
          this.log('Testando preload de templates...', 'info');
          await this.stepTemplateService.preloadAllTemplates();
          this.log('✓ Preload executado com sucesso', 'success');
        }
        
      } catch (error) {
        this.log(`⚠ Erro testando cache: ${error.message}`, 'warning');
      }
    }
    
    // Verificar localStorage/sessionStorage
    const storageKeys = [...Object.keys(localStorage), ...Object.keys(sessionStorage)];
    const templateKeys = storageKeys.filter(key => 
      key.includes('template') || key.includes('step') || key.includes('cache')
    );
    
    if (templateKeys.length > 0) {
      this.log(`Templates em storage: ${templateKeys.length}`, 'info');
      templateKeys.forEach(key => {
        const data = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            this.log(`  • ${key}: ${typeof parsed}`, 'info');
          } catch (e) {
            this.log(`  • ${key}: string (${data.length} chars)`, 'info');
          }
        }
      });
    } else {
      this.log('Nenhum template encontrado em storage', 'warning');
    }
  }

  async testSynchronousLoading() {
    this.log('Teste 4: Carregamento síncrono', 'test');
    
    if (!this.stepTemplateService || !this.stepTemplateService.ensureTemplateLoaded) {
      this.log('⚠ Função ensureTemplateLoaded não disponível', 'warning');
      return;
    }
    
    const testSteps = [1, 20];
    
    for (const stepNumber of testSteps) {
      try {
        const startTime = performance.now();
        
        // Testar carregamento síncrono
        const template = await this.stepTemplateService.ensureTemplateLoaded(stepNumber);
        
        const duration = performance.now() - startTime;
        
        if (template && Object.keys(template).length > 0) {
          this.log(`✓ Step ${stepNumber} síncrono: ${duration.toFixed(2)}ms`, 'success');
          
          // Verificar conteúdo
          const elementCount = template.sections?.length || template.blocks?.length || 0;
          this.log(`  • Elementos: ${elementCount}`, 'info');
          
          if (stepNumber === 20) {
            const hasCalculation = template.sections?.some((s: any) => 
              s.type?.includes('Calculation') || s.id?.includes('calculation')
            );
            this.log(`  • Tem cálculo: ${hasCalculation ? 'Sim' : 'Não'}`, 'info');
          }
          
        } else {
          this.log(`✗ Step ${stepNumber} síncrono: retornou vazio`, 'error');
        }
        
      } catch (error) {
        this.log(`✗ Step ${stepNumber} síncrono: ${error.message}`, 'error');
      }
    }
  }

  async testStep20Specifically() {
    this.log('Teste 5: Step 20 - Análise detalhada', 'test');
    
    try {
      // Teste via fetch direto
      const response = await fetch('/templates/step-20-v3.json');
      if (response.ok) {
        const template = await response.json();
        
        this.log('✓ Template Step 20 carregado via fetch', 'success');
        this.log(`  • Versão: ${template.templateVersion}`, 'info');
        this.log(`  • Seções: ${template.sections?.length || 0}`, 'info');
        this.log(`  • ID: ${template.metadata?.id}`, 'info');
        
        // Verificar seções específicas
        if (template.sections) {
          const calculationSections = template.sections.filter((s: any) => 
            s.type?.includes('Calculation') || s.id?.includes('calculation')
          );
          
          this.log(`  • Seções de cálculo: ${calculationSections.length}`, 'info');
          
          if (calculationSections.length > 0) {
            calculationSections.forEach((section: any, index: number) => {
              this.log(`    - ${index + 1}: ${section.type} (${section.id})`, 'info');
            });
          }
          
          // Verificar seções visuais
          const visualSections = template.sections.filter((s: any) => 
            !s.type?.includes('Calculation')
          );
          this.log(`  • Seções visuais: ${visualSections.length}`, 'info');
        }
        
        // Teste via serviço
        if (this.stepTemplateService?.getTemplate) {
          const serviceTemplate = await this.stepTemplateService.getTemplate(20);
          
          if (serviceTemplate && Object.keys(serviceTemplate).length > 0) {
            const serviceElementCount = serviceTemplate.sections?.length || 0;
            const fetchElementCount = template.sections?.length || 0;
            
            if (serviceElementCount === fetchElementCount) {
              this.log('✓ Serviço e fetch retornam mesmo template', 'success');
            } else {
              this.log(`✗ Divergência: Serviço(${serviceElementCount}) vs Fetch(${fetchElementCount})`, 'error');
            }
          } else {
            this.log('✗ Serviço retornou template vazio para Step 20', 'error');
          }
        }
        
      } else {
        this.log(`✗ Fetch Step 20 falhou: HTTP ${response.status}`, 'error');
      }
      
    } catch (error) {
      this.log(`✗ Erro analisando Step 20: ${error.message}`, 'error');
    }
  }

  async testErrorHandling() {
    this.log('Teste 6: Tratamento de erros', 'test');
    
    // Testar step inválido
    try {
      const invalidStep = 999;
      const response = await fetch(`/templates/step-${invalidStep.toString().padStart(2, '0')}-v3.json`);
      
      if (!response.ok) {
        this.log('✓ Step inválido retorna erro corretamente', 'success');
      } else {
        this.log('⚠ Step inválido não retornou erro', 'warning');
      }
      
    } catch (error) {
      this.log('✓ Fetch de step inválido gera exceção corretamente', 'success');
    }
    
    // Testar serviço com parâmetros inválidos
    if (this.stepTemplateService?.getTemplate) {
      try {
        const result = await this.stepTemplateService.getTemplate(-1);
        if (!result || Object.keys(result).length === 0) {
          this.log('✓ Serviço trata step negativo corretamente', 'success');
        } else {
          this.log('⚠ Serviço não valida step negativo', 'warning');
        }
      } catch (error) {
        this.log('✓ Serviço gera erro para step negativo', 'success');
      }
    }
  }

  generateServiceReport() {
    this.log('===============================', 'test');
    this.log('RELATÓRIO - stepTemplateService', 'test');
    this.log('===============================', 'test');
    
    const successes = this.results.filter(r => r.type === 'success').length;
    const warnings = this.results.filter(r => r.type === 'warning').length;
    const errors = this.results.filter(r => r.type === 'error').length;
    
    this.log(`Sucessos: ${successes}`, 'success');
    this.log(`Avisos: ${warnings}`, 'warning');
    this.log(`Erros: ${errors}`, 'error');
    
    const successRate = Math.round((successes / (successes + errors)) * 100) || 0;
    this.log(`Taxa de sucesso: ${successRate}%`, 
             successRate >= 90 ? 'success' : 
             successRate >= 70 ? 'warning' : 'error');
    
    // Diagnóstico do serviço
    let serviceStatus = '';
    if (successRate >= 90) {
      serviceStatus = '🎉 SERVIÇO FUNCIONANDO PERFEITAMENTE!';
    } else if (successRate >= 70) {
      serviceStatus = '⚠️ SERVIÇO COM PROBLEMAS MENORES';
    } else {
      serviceStatus = '❌ SERVIÇO COM PROBLEMAS GRAVES';
    }
    
    this.log(serviceStatus, successRate >= 90 ? 'success' : 'warning');
    
    // Recomendações específicas
    if (this.errors.length > 0) {
      this.log('', 'info');
      this.log('PROBLEMAS IDENTIFICADOS:', 'test');
      this.errors.forEach((error, index) => {
        this.log(`${index + 1}. ${error.step ? `Step ${error.step}: ` : ''}${error.error || error.message}`, 'error');
      });
    }
    
    // Salvar relatório
    const report = {
      timestamp: new Date().toISOString(),
      service: 'stepTemplateService',
      results: this.results,
      errors: this.errors,
      templates: Array.from(this.templateCache.keys()),
      successRate,
      summary: {
        successes,
        warnings,
        errors,
        status: serviceStatus
      }
    };
    
    sessionStorage.setItem('stepTemplateService-test', JSON.stringify(report));
    this.log('✓ Relatório salvo em sessionStorage', 'success');
  }
}

// Executar testes
console.log('🧪 CARREGANDO TESTE UNITÁRIO - stepTemplateService...');

const serviceTester = new StepTemplateServiceTester();
serviceTester.runAllTests();

// Disponibilizar globalmente
window.stepTemplateServiceTester = serviceTester;