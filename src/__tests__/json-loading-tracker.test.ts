/**
 * 🔍 TESTES DE RASTREAMENTO - Quais JSONs são carregados
 * 
 * Monitora e registra todos os arquivos JSON carregados durante
 * diferentes fluxos do editor para identificar padrões de acesso
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { templateService } from '@/services/canonical/TemplateService';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';

// 📋 Registro de JSONs carregados
interface JsonLoadRecord {
  timestamp: number;
  path: string;
  stepId: string;
  templateId: string;
  source: string;
  success: boolean;
}

const jsonLoadHistory: JsonLoadRecord[] = [];

// Setup dos mocks - deve vir ANTES de usar as funções
vi.mock('@/templates/loaders/jsonStepLoader', () => {
  return {
    loadStepFromJson: vi.fn(async (stepId: string, templateId: string) => {
      const record: JsonLoadRecord = {
        timestamp: Date.now(),
        path: `/templates/${templateId}/${stepId}.json`,
        stepId,
        templateId,
        source: 'json-loader',
        success: true,
      };
      
      jsonLoadHistory.push(record);
      console.log(`📄 JSON Carregado: ${record.path}`);
      
      const stepNum = parseInt(stepId.replace('step-', ''));
      if (stepNum < 1 || stepNum > 21) {
        record.success = false;
        throw new Error(`Step ${stepId} out of range`);
      }

      return [
        {
          id: `${stepId}-block-1`,
          type: 'heading',
          content: { text: `Content from ${templateId}/${stepId}` },
          order: 0,
        },
      ];
    }),
  };
});

vi.mock('@/templates/registry', () => {
  return {
    loadFullTemplate: vi.fn(async (templateId: string) => {
      const record: JsonLoadRecord = {
        timestamp: Date.now(),
        path: `/templates/${templateId}/master.v3.json`,
        stepId: 'master',
        templateId,
        source: 'template-registry',
        success: true,
      };
      
      jsonLoadHistory.push(record);
      console.log(`📄 JSON Carregado: ${record.path}`);
      
      return {
        id: templateId,
        name: `Template ${templateId}`,
        totalSteps: 21,
        steps: {
          'step-01': [{ id: 'b1', type: 'heading', content: {}, order: 0 }],
        },
      };
    }),
  };
});

vi.mock('@/services/templates/builtInTemplates', () => ({
  hasBuiltInTemplate: vi.fn(() => true),
  listBuiltInTemplateIds: vi.fn(() => ['quiz21StepsComplete']),
}));

describe('🔍 Rastreamento de Carregamento de JSONs', () => {
  beforeEach(() => {
    // Limpar histórico
    jsonLoadHistory.length = 0;
  });

  afterEach(() => {
    // Relatório final de cada teste
    console.log('\n📊 Resumo do teste:');
    console.log(`Total de JSONs carregados: ${jsonLoadHistory.length}`);
    jsonLoadHistory.forEach((record, index) => {
      console.log(`  ${index + 1}. ${record.path} [${record.source}] - ${record.success ? '✅' : '❌'}`);
    });
  });

  describe('Cenário 1: Preparação de Template', () => {
    it('deve registrar JSONs ao preparar quiz21StepsComplete', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act
      await templateService.prepareTemplate(templateId);

      // Assert
      expect(jsonLoadHistory.length).toBeGreaterThan(0);
      
      const masterLoad = jsonLoadHistory.find(r => r.stepId === 'master');
      expect(masterLoad).toBeDefined();
      expect(masterLoad?.path).toContain('master.v3.json');
      
      console.log('\n✅ JSONs carregados durante prepareTemplate:');
      jsonLoadHistory.forEach(r => {
        console.log(`   - ${r.path}`);
      });
    });

    it('deve registrar JSONs ao preparar com preloadAll', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act
      await templateService.prepareTemplate(templateId, { preloadAll: true });

      // Assert - deve ter carregado múltiplos JSONs
      expect(jsonLoadHistory.length).toBeGreaterThan(1);
      
      const stepLoads = jsonLoadHistory.filter(r => r.stepId.startsWith('step-'));
      console.log(`\n✅ Steps pré-carregados: ${stepLoads.length}`);
      
      expect(stepLoads.length).toBeGreaterThan(0);
    });
  });

  describe('Cenário 2: Carregamento de Step Individual', () => {
    it('deve registrar JSON ao carregar step-01', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Act
      await hierarchicalTemplateSource.getPrimary('step-01');

      // Assert
      const step01Load = jsonLoadHistory.find(r => r.stepId === 'step-01');
      expect(step01Load).toBeDefined();
      expect(step01Load?.path).toBe('/templates/quiz21StepsComplete/step-01.json');
      expect(step01Load?.success).toBe(true);
      
      console.log(`\n✅ JSON carregado: ${step01Load?.path}`);
    });

    it('deve registrar JSONs ao navegar entre steps', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Act - navegar step-01 → step-02 → step-03
      await hierarchicalTemplateSource.getPrimary('step-01');
      const countAfterStep01 = jsonLoadHistory.length;
      
      await hierarchicalTemplateSource.getPrimary('step-02');
      const countAfterStep02 = jsonLoadHistory.length;
      
      await hierarchicalTemplateSource.getPrimary('step-03');
      const countAfterStep03 = jsonLoadHistory.length;

      // Assert
      expect(countAfterStep01).toBe(1);
      expect(countAfterStep02).toBe(2);
      expect(countAfterStep03).toBe(3);
      
      console.log('\n✅ Navegação registrada:');
      console.log(`   step-01 → ${countAfterStep01} JSON(s)`);
      console.log(`   step-02 → ${countAfterStep02} JSON(s)`);
      console.log(`   step-03 → ${countAfterStep03} JSON(s)`);
    });

    it('deve usar cache e não recarregar JSON', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Act
      await hierarchicalTemplateSource.getPrimary('step-01');
      const countFirstLoad = jsonLoadHistory.length;
      
      await hierarchicalTemplateSource.getPrimary('step-01'); // Segunda carga (cache)
      const countSecondLoad = jsonLoadHistory.length;

      // Assert - não deve ter carregado novo JSON
      expect(countSecondLoad).toBe(countFirstLoad);
      expect(countFirstLoad).toBe(1);
      
      console.log('\n✅ Cache funcionando:');
      console.log(`   Primeira carga: ${countFirstLoad} JSON`);
      console.log(`   Segunda carga: ${countSecondLoad} JSON (sem novo carregamento)`);
    });
  });

  describe('Cenário 3: Troca de Template', () => {
    it('deve registrar JSONs de templates diferentes', async () => {
      // Arrange
      const template1 = 'quiz21StepsComplete';
      const template2 = 'custom-template';

      // Act
      hierarchicalTemplateSource.setActiveTemplate(template1);
      await hierarchicalTemplateSource.getPrimary('step-01');
      const countTemplate1 = jsonLoadHistory.length;
      
      hierarchicalTemplateSource.setActiveTemplate(template2);
      await hierarchicalTemplateSource.getPrimary('step-01');
      const countTemplate2 = jsonLoadHistory.length;

      // Assert
      expect(countTemplate1).toBe(1);
      expect(countTemplate2).toBe(2);
      
      const loadsFromTemplate1 = jsonLoadHistory.filter(r => r.templateId === template1);
      const loadsFromTemplate2 = jsonLoadHistory.filter(r => r.templateId === template2);
      
      expect(loadsFromTemplate1.length).toBe(1);
      expect(loadsFromTemplate2.length).toBe(1);
      
      console.log('\n✅ Templates diferentes:');
      console.log(`   ${template1}: ${loadsFromTemplate1.length} JSON`);
      console.log(`   ${template2}: ${loadsFromTemplate2.length} JSON`);
    });
  });

  describe('Cenário 4: Análise de Padrões de Acesso', () => {
    it('deve identificar JSONs mais acessados', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Act - simular navegação típica do usuário
      await hierarchicalTemplateSource.getPrimary('step-01');
      await hierarchicalTemplateSource.getPrimary('step-01'); // Cache
      await hierarchicalTemplateSource.getPrimary('step-02');
      await hierarchicalTemplateSource.getPrimary('step-01'); // Cache
      await hierarchicalTemplateSource.getPrimary('step-03');

      // Assert
      const accessCounts = new Map<string, number>();
      jsonLoadHistory.forEach(record => {
        const count = accessCounts.get(record.path) || 0;
        accessCounts.set(record.path, count + 1);
      });

      console.log('\n📊 Padrão de acesso aos JSONs:');
      Array.from(accessCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([path, count]) => {
          console.log(`   ${path}: ${count}x`);
        });

      // step-01 deve ter sido carregado apenas 1x (cache nas demais)
      expect(jsonLoadHistory.filter(r => r.stepId === 'step-01').length).toBe(1);
    });

    it('deve medir tempo de carregamento de JSONs', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Act
      const start = Date.now();
      await hierarchicalTemplateSource.getPrimary('step-01');
      const duration = Date.now() - start;

      // Assert
      expect(jsonLoadHistory.length).toBe(1);
      expect(jsonLoadHistory[0].timestamp).toBeGreaterThan(start - 100);
      
      console.log(`\n⏱️ Tempo de carregamento: ${duration}ms`);
      console.log(`   Timestamp: ${jsonLoadHistory[0].timestamp}`);
    });
  });

  describe('Cenário 5: Detecção de Problemas', () => {
    it('deve identificar JSONs que falharam ao carregar', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Act - tentar carregar step inválido
      try {
        await hierarchicalTemplateSource.getPrimary('step-99');
      } catch (error) {
        // Esperado
      }

      // Assert
      const failedLoads = jsonLoadHistory.filter(r => !r.success);
      expect(failedLoads.length).toBeGreaterThan(0);
      
      console.log('\n❌ JSONs que falharam:');
      failedLoads.forEach(record => {
        console.log(`   ${record.path} - ${record.stepId}`);
      });
    });

    it('deve detectar tentativas de carregar steps fora do range', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Act
      const invalidSteps = ['step-00', 'step-22', 'step-100'];
      
      for (const stepId of invalidSteps) {
        try {
          await hierarchicalTemplateSource.getPrimary(stepId);
        } catch {
          // Esperado
        }
      }

      // Assert
      const invalidAttempts = jsonLoadHistory.filter(r => {
        const num = parseInt(r.stepId.replace('step-', ''));
        return num < 1 || num > 21;
      });
      
      console.log(`\n⚠️ Tentativas de acessar steps inválidos: ${invalidAttempts.length}`);
      invalidAttempts.forEach(record => {
        console.log(`   ${record.stepId} → ${record.path}`);
      });
    });
  });

  describe('Cenário 6: Fluxo Completo do Editor', () => {
    it('deve rastrear JSONs em fluxo realista de edição', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act - simular fluxo completo
      console.log('\n🎬 Simulando fluxo de edição:');
      
      // 1. Preparar template
      console.log('   1. Preparando template...');
      await templateService.prepareTemplate(templateId);
      const afterPrepare = jsonLoadHistory.length;
      
      // 2. Carregar step inicial
      console.log('   2. Carregando step-01...');
      hierarchicalTemplateSource.setActiveTemplate(templateId);
      await hierarchicalTemplateSource.getPrimary('step-01');
      const afterStep01 = jsonLoadHistory.length;
      
      // 3. Navegar para step-02
      console.log('   3. Navegando para step-02...');
      await hierarchicalTemplateSource.getPrimary('step-02');
      const afterStep02 = jsonLoadHistory.length;
      
      // 4. Voltar para step-01 (cache)
      console.log('   4. Voltando para step-01 (cache)...');
      await hierarchicalTemplateSource.getPrimary('step-01');
      const afterBackToStep01 = jsonLoadHistory.length;

      // Assert
      expect(afterPrepare).toBeGreaterThan(0);
      expect(afterStep01).toBeGreaterThan(afterPrepare);
      expect(afterStep02).toBeGreaterThan(afterStep01);
      expect(afterBackToStep01).toBe(afterStep02); // Cache não carrega novo JSON
      
      console.log('\n📊 JSONs carregados por etapa:');
      console.log(`   Após prepareTemplate: ${afterPrepare}`);
      console.log(`   Após step-01: ${afterStep01}`);
      console.log(`   Após step-02: ${afterStep02}`);
      console.log(`   Após voltar step-01: ${afterBackToStep01} (cache)`);
    });
  });

  describe('Cenário 7: Relatório de Uso', () => {
    it('deve gerar relatório detalhado de uso de JSONs', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Act - simular sessão de edição
      const steps = ['step-01', 'step-02', 'step-03', 'step-01', 'step-04'];
      for (const step of steps) {
        await hierarchicalTemplateSource.getPrimary(step);
      }

      // Assert e Relatório
      const uniqueJsons = new Set(jsonLoadHistory.map(r => r.path));
      const totalAttempts = jsonLoadHistory.length;
      const successfulLoads = jsonLoadHistory.filter(r => r.success).length;
      
      console.log('\n📋 RELATÓRIO DE USO DE JSONs:');
      console.log(`   Total de tentativas: ${totalAttempts}`);
      console.log(`   JSONs únicos carregados: ${uniqueJsons.size}`);
      console.log(`   Carregamentos bem-sucedidos: ${successfulLoads}`);
      console.log(`   Taxa de cache hit: ${((totalAttempts - uniqueJsons.size) / totalAttempts * 100).toFixed(1)}%`);
      
      console.log('\n   JSONs carregados:');
      Array.from(uniqueJsons).forEach(path => {
        console.log(`     - ${path}`);
      });

      expect(uniqueJsons.size).toBe(4); // step-01, 02, 03, 04
      expect(totalAttempts).toBe(5); // 5 chamadas, mas 1 é cache
    });
  });
});
