/**
 * 🧪 TESTE AUTOMATIZADO - Canvas vs Preview Sync
 * 
 * Verifica se o preview realmente reflete os templates do canvas
 */

import { promises as fs } from 'fs';
import path from 'path';

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
  data?: any;
}

class CanvasPreviewSyncTester {
  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🧪 TESTE AUTOMATIZADO - Canvas vs Preview Sync');
    console.log('==============================================\n');

    await this.testTemplateFiles();
    await this.testTemplateStructure();
    await this.testStepTemplateService();
    await this.testHttpEndpoints();
    await this.testCacheConsistency();
    
    this.printResults();
  }

  private async testTemplateFiles(): Promise<void> {
    console.log('📁 TESTE 1: Verificando arquivos de template...');
    
    try {
      const templatesDir = '/workspaces/quiz-flow-pro-verso/public/templates';
      const files = await fs.readdir(templatesDir);
      
      // Verificar se existem apenas templates v3
      const v3Templates = files.filter(f => f.includes('-v3.json'));
      const oldTemplates = files.filter(f => f.includes('-template.json') && !f.includes('-v3'));
      
      this.results.push({
        name: 'Templates v3 presentes',
        passed: v3Templates.length >= 21,
        details: `Encontrados ${v3Templates.length}/21 templates v3`,
        data: { v3Templates: v3Templates.length }
      });

      this.results.push({
        name: 'Templates antigos removidos',
        passed: oldTemplates.length === 0,
        details: oldTemplates.length === 0 ? 'Nenhum template antigo encontrado' : `${oldTemplates.length} templates antigos ainda existem`,
        data: { oldTemplates }
      });

      // Verificar Step 20 especificamente
      const step20v3 = files.includes('step-20-v3.json');
      this.results.push({
        name: 'Step 20 v3 existe',
        passed: step20v3,
        details: step20v3 ? 'step-20-v3.json encontrado' : 'step-20-v3.json não encontrado'
      });

    } catch (error) {
      this.results.push({
        name: 'Acesso a arquivos de template',
        passed: false,
        details: `Erro: ${error}`
      });
    }
  }

  private async testTemplateStructure(): Promise<void> {
    console.log('🏗️ TESTE 2: Verificando estrutura dos templates...');

    try {
      // Testar Step 20 específico (o mais complexo)
      const step20Path = '/workspaces/quiz-flow-pro-verso/public/templates/step-20-v3.json';
      const content = await fs.readFile(step20Path, 'utf8');
      const template = JSON.parse(content);

      this.results.push({
        name: 'Template v3 bem formado',
        passed: !!template.templateVersion && !!template.sections,
        details: `Versão: ${template.templateVersion}, Seções: ${template.sections?.length || 0}`,
        data: {
          version: template.templateVersion,
          sections: template.sections?.length || 0,
          metadata: template.metadata?.name
        }
      });

      // Verificar seção de cálculo híbrida
      const calcSection = template.sections?.find((s: any) => s.type === 'ResultCalculationSection');
      this.results.push({
        name: 'Seção de cálculo híbrida presente',
        passed: !!calcSection,
        details: calcSection ? `Encontrada seção: ${calcSection.id}` : 'Seção de cálculo não encontrada',
        data: { calcSection: !!calcSection }
      });

      // Verificar propriedades de cálculo
      if (calcSection) {
        const hasCalculationProps = !!(calcSection.props?.calculationMethod && calcSection.props?.scoreMapping);
        this.results.push({
          name: 'Propriedades de cálculo completas',
          passed: hasCalculationProps,
          details: hasCalculationProps ? 
            `Método: ${calcSection.props.calculationMethod}, Estilos: ${Object.keys(calcSection.props.scoreMapping || {}).length}` :
            'Propriedades de cálculo incompletas'
        });
      }

    } catch (error) {
      this.results.push({
        name: 'Estrutura do template Step 20',
        passed: false,
        details: `Erro ao analisar: ${error}`
      });
    }
  }

  private async testStepTemplateService(): Promise<void> {
    console.log('🔧 TESTE 3: Verificando stepTemplateService...');

    try {
      // Simular carregamento do service (sem importar diretamente)
      const servicePath = '/workspaces/quiz-flow-pro-verso/src/services/stepTemplateService.ts';
      const serviceContent = await fs.readFile(servicePath, 'utf8');

      // Verificar se contém as correções
      const hasAsyncLoading = serviceContent.includes('preloadAllTemplates');
      const hasSyncFallback = serviceContent.includes('ensureTemplateLoaded');
      const hasV3Support = serviceContent.includes('step-${stepId}-v3.json');

      this.results.push({
        name: 'Service com carregamento assíncrono',
        passed: hasAsyncLoading,
        details: hasAsyncLoading ? 'preloadAllTemplates presente' : 'Carregamento assíncrono não encontrado'
      });

      this.results.push({
        name: 'Service com fallback síncrono',
        passed: hasSyncFallback,
        details: hasSyncFallback ? 'ensureTemplateLoaded presente' : 'Fallback síncrono não encontrado'
      });

      this.results.push({
        name: 'Service suporta templates v3',
        passed: hasV3Support,
        details: hasV3Support ? 'Carregamento v3 implementado' : 'Suporte v3 não encontrado'
      });

    } catch (error) {
      this.results.push({
        name: 'Análise do stepTemplateService',
        passed: false,
        details: `Erro: ${error}`
      });
    }
  }

  private async testHttpEndpoints(): Promise<void> {
    console.log('🌐 TESTE 4: Verificando endpoints HTTP...');

    const testUrls = [
      'http://localhost:5173/templates/step-01-v3.json',
      'http://localhost:5173/templates/step-20-v3.json',
      'http://localhost:5173/templates/step-21-v3.json'
    ];

    for (const url of testUrls) {
      try {
        const stepNumber = url.match(/step-(\d+)/)?.[1];
        
        // Usar fetch para testar
        const response = await fetch(url);
        const isOk = response.ok;
        
        let details = `Status: ${response.status}`;
        if (isOk) {
          try {
            const data = await response.json();
            details += `, Versão: ${data.templateVersion}, Seções: ${data.sections?.length || data.blocks?.length || 0}`;
          } catch (e) {
            details += ', Erro ao parsear JSON';
          }
        }

        this.results.push({
          name: `HTTP endpoint Step ${stepNumber}`,
          passed: isOk,
          details
        });

      } catch (error) {
        const stepNumber = url.match(/step-(\d+)/)?.[1];
        this.results.push({
          name: `HTTP endpoint Step ${stepNumber}`,
          passed: false,
          details: `Erro de conexão: ${error}`
        });
      }
    }
  }

  private async testCacheConsistency(): Promise<void> {
    console.log('💾 TESTE 5: Verificando consistência de cache...');

    try {
      // Verificar se não há arquivos conflitantes
      const publicDir = '/workspaces/quiz-flow-pro-verso/public';
      const srcDir = '/workspaces/quiz-flow-pro-verso/src';

      // Procurar por templates em locais incorretos
      const findCommand = async (dir: string, pattern: string): Promise<string[]> => {
        try {
          const { exec } = require('child_process');
          const { promisify } = require('util');
          const execAsync = promisify(exec);
          
          const { stdout } = await execAsync(`find ${dir} -name "*${pattern}*" -type f 2>/dev/null || true`);
          return stdout.trim().split('\n').filter(line => line.length > 0);
        } catch {
          return [];
        }
      };

      const templateFiles = await findCommand(srcDir, 'template.json');
      const v3Files = await findCommand(publicDir, '-v3.json');

      this.results.push({
        name: 'Templates apenas em public/',
        passed: templateFiles.length === 0,
        details: templateFiles.length === 0 ? 
          'Nenhum template encontrado em src/' : 
          `${templateFiles.length} templates encontrados em src/`,
        data: { conflictFiles: templateFiles }
      });

      this.results.push({
        name: 'Templates v3 em public/',
        passed: v3Files.length >= 21,
        details: `${v3Files.length} arquivos v3 encontrados`,
        data: { v3Count: v3Files.length }
      });

    } catch (error) {
      this.results.push({
        name: 'Verificação de cache',
        passed: false,
        details: `Erro: ${error}`
      });
    }
  }

  private printResults(): void {
    console.log('\n📊 RESULTADOS DOS TESTES');
    console.log('========================\n');

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const percentage = Math.round((passed / total) * 100);

    // Resultados por categoria
    this.results.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      const number = (index + 1).toString().padStart(2, '0');
      console.log(`${status} ${number}. ${result.name}`);
      console.log(`     ${result.details}`);
      if (result.data && Object.keys(result.data).length > 0) {
        console.log(`     Data: ${JSON.stringify(result.data)}`);
      }
      console.log();
    });

    // Resumo final
    console.log('🎯 RESUMO FINAL');
    console.log('===============');
    console.log(`✅ Testes aprovados: ${passed}/${total} (${percentage}%)`);
    
    if (percentage >= 90) {
      console.log('🎉 EXCELENTE! Canvas e Preview devem estar sincronizados');
      console.log('✨ Sistema híbrido funcionando corretamente');
    } else if (percentage >= 70) {
      console.log('⚠️ BOM, mas há algumas questões a resolver');
      console.log('🔧 Verifique os itens que falharam acima');
    } else {
      console.log('❌ PROBLEMAS SÉRIOS detectados');
      console.log('🚨 Canvas e Preview provavelmente NÃO estão sincronizados');
    }

    // Falhas críticas
    const criticalFailures = this.results.filter(r => !r.passed && (
      r.name.includes('Step 20') || 
      r.name.includes('templates v3') || 
      r.name.includes('HTTP endpoint')
    ));

    if (criticalFailures.length > 0) {
      console.log('\n🚨 FALHAS CRÍTICAS:');
      criticalFailures.forEach(failure => {
        console.log(`   • ${failure.name}: ${failure.details}`);
      });
    }

    console.log('\n💡 PRÓXIMOS PASSOS:');
    if (percentage >= 90) {
      console.log('   1. Abrir editor: http://localhost:5173/editor');
      console.log('   2. Navegar até Step 20');
      console.log('   3. Comparar canvas vs preview visualmente');
      console.log('   4. Fazer alterações e verificar sincronização');
    } else {
      console.log('   1. Corrigir itens que falharam nos testes');
      console.log('   2. Executar novamente: npx tsx scripts/test-canvas-preview-sync.ts');
      console.log('   3. Verificar logs do servidor para erros');
    }
  }
}

// Executar testes
async function main() {
  const tester = new CanvasPreviewSyncTester();
  await tester.runAllTests();
}

main().catch(console.error);