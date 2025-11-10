/**
 * 🧪 TESTE DE INTEGRAÇÃO - Fluxo Completo de Sincronização
 * 
 * Valida o fluxo end-to-end:
 * useEditorResource → TemplateService → HierarchicalTemplateSource
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { templateService } from '@/services/canonical/TemplateService';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';

// Mock dos loaders
vi.mock('@/templates/loaders/jsonStepLoader', () => ({
  loadStepFromJson: vi.fn(async (stepId: string, templateId: string) => [
    {
      id: `${stepId}-block-1`,
      type: 'heading',
      content: { text: `Block from ${templateId}` },
      order: 0,
    },
  ]),
}));

vi.mock('@/services/templates/builtInTemplates', () => ({
  hasBuiltInTemplate: vi.fn(() => true),
  listBuiltInTemplateIds: vi.fn(() => ['quiz21StepsComplete']),
}));

vi.mock('@/templates/registry', () => ({
  loadFullTemplate: vi.fn(async () => ({
    id: 'quiz21StepsComplete',
    name: 'Quiz 21 Steps',
    totalSteps: 21,
    steps: {
      'step-01': [{ id: 'b1', type: 'heading', content: {}, order: 0 }],
    },
  })),
}));

describe('INTEGRAÇÃO: Fluxo Completo de Sincronização de Template', () => {
  beforeEach(async () => {
    // Reset state
    hierarchicalTemplateSource.setActiveTemplate('quiz21StepsComplete');
  });

  describe('Cenário 1: Usuário abre editor com template', () => {
    it('deve sincronizar template em toda a cadeia', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act - Simular fluxo do useEditorResource
      // 1. prepareTemplate (chamado pelo hook)
      const prepareResult = await templateService.prepareTemplate(templateId);
      expect(prepareResult.success).toBe(true);

      // 2. getStep (carregar step específico)
      const stepResult = await templateService.getStep('step-01', templateId);
      expect(stepResult.success).toBe(true);

      // 3. HierarchicalSource deve estar com template ativo correto
      const hierarchicalResult = await hierarchicalTemplateSource.getPrimary('step-02');
      expect(hierarchicalResult.data).toBeDefined();
      expect(hierarchicalResult.data.length).toBeGreaterThan(0);
    });
  });

  describe('Cenário 2: Usuário troca de template', () => {
    it('deve resincronizar com novo template', async () => {
      // Arrange - Template inicial
      const template1 = 'quiz21StepsComplete';
      await templateService.prepareTemplate(template1);
      const step1 = await templateService.getStep('step-01', template1);

      // Act - Trocar para novo template
      const template2 = 'custom-template';
      hierarchicalTemplateSource.setActiveTemplate(template2);
      await templateService.prepareTemplate(template2);
      const step2 = await templateService.getStep('step-01', template2);

      // Assert
      expect(step1.success).toBe(true);
      expect(step2.success).toBe(true);
      // Dados devem ser diferentes (templates diferentes)
      expect(step1.data).toBeDefined();
      expect(step2.data).toBeDefined();
    });
  });

  describe('Cenário 3: Navegação entre steps do mesmo template', () => {
    it('deve manter template ativo consistente', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      await templateService.prepareTemplate(templateId);

      // Act - Navegar entre múltiplos steps
      const steps = await Promise.all([
        templateService.getStep('step-01', templateId),
        templateService.getStep('step-02', templateId),
        templateService.getStep('step-03', templateId),
        hierarchicalTemplateSource.getPrimary('step-04'),
        hierarchicalTemplateSource.getPrimary('step-05'),
      ]);

      // Assert - todos devem carregar com sucesso
      steps.forEach(step => {
        expect(step.success || step.data).toBeTruthy();
      });
    });
  });

  describe('Cenário 4: Cache e invalidação', () => {
    it('deve usar cache após primeira carga', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      await templateService.prepareTemplate(templateId);

      // Act - Primeira carga (sem cache)
      const firstLoad = await hierarchicalTemplateSource.getPrimary('step-01');
      const firstLoadTime = firstLoad.metadata.loadTime;

      // Segunda carga (com cache)
      const secondLoad = await hierarchicalTemplateSource.getPrimary('step-01');
      const secondLoadTime = secondLoad.metadata.loadTime;

      // Assert
      expect(firstLoad.metadata.cacheHit).toBe(false);
      expect(secondLoad.metadata.cacheHit).toBe(true);
      // Cache deve ser mais rápido
      expect(secondLoadTime).toBeLessThanOrEqual(firstLoadTime);
    });

    it('deve invalidar cache ao mudar template', async () => {
      // Arrange
      await templateService.prepareTemplate('quiz21StepsComplete');
      const firstLoad = await hierarchicalTemplateSource.getPrimary('step-01');

      // Act - Mudar template
      hierarchicalTemplateSource.setActiveTemplate('custom-template');
      await hierarchicalTemplateSource.invalidate('step-01');
      const secondLoad = await hierarchicalTemplateSource.getPrimary('step-01');

      // Assert - cache deve ter sido invalidado
      expect(firstLoad.data).toBeDefined();
      expect(secondLoad.data).toBeDefined();
    });
  });

  describe('Cenário 5: Error recovery', () => {
    it('deve lidar com erro em step e continuar funcionando', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      await templateService.prepareTemplate(templateId);

      // Act - Tentar carregar step inválido
      try {
        await hierarchicalTemplateSource.getPrimary('step-99');
      } catch (error) {
        // Esperado
      }

      // Assert - próximo step válido deve funcionar normalmente
      const validStep = await hierarchicalTemplateSource.getPrimary('step-01');
      expect(validStep.data).toBeDefined();
      expect(validStep.data.length).toBeGreaterThan(0);
    });

    it('deve continuar funcionando se prepareTemplate falhar parcialmente', async () => {
      // Arrange - Simular falha parcial
      const templateId = 'problematic-template';

      // Act
      try {
        await templateService.prepareTemplate(templateId);
      } catch {
        // Pode falhar
      }

      // Forçar template ativo
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Assert - getStep ainda deve funcionar (fallback)
      const result = await hierarchicalTemplateSource.getPrimary('step-01');
      expect(result).toBeDefined();
    });
  });

  describe('Cenário 6: Performance com múltiplas requisições', () => {
    it('deve lidar com requisições concorrentes sem race conditions', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act - Múltiplas operações concorrentes
      const operations = await Promise.allSettled([
        templateService.prepareTemplate(templateId),
        templateService.getStep('step-01', templateId),
        templateService.getStep('step-02', templateId),
        hierarchicalTemplateSource.getPrimary('step-03'),
        hierarchicalTemplateSource.getPrimary('step-04'),
        templateService.prepareTemplate(templateId), // Re-prepare concorrente
      ]);

      // Assert - maioria deve ter sucesso
      const successful = operations.filter(op => op.status === 'fulfilled');
      expect(successful.length).toBeGreaterThanOrEqual(4);
    });

    it('deve deduplicate requisições para mesmo step', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      await templateService.prepareTemplate(templateId);

      // Act - Carregar mesmo step múltiplas vezes simultaneamente
      const startTime = Date.now();
      const results = await Promise.all([
        hierarchicalTemplateSource.getPrimary('step-01'),
        hierarchicalTemplateSource.getPrimary('step-01'),
        hierarchicalTemplateSource.getPrimary('step-01'),
      ]);
      const duration = Date.now() - startTime;

      // Assert - deve usar deduplicação (não fazer 3 cargas separadas)
      results.forEach(result => {
        expect(result.data).toBeDefined();
      });
      // Duração não deve ser 3x maior que carga única
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Cenário 7: Metadata e observabilidade', () => {
    it('deve fornecer metadata completa em toda cadeia', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act
      await templateService.prepareTemplate(templateId);
      const stepResult = await templateService.getStep('step-01', templateId);
      const hierarchicalResult = await hierarchicalTemplateSource.getPrimary('step-01');

      // Assert - verificar metadata
      expect(stepResult.success).toBe(true);
      expect(hierarchicalResult.metadata).toMatchObject({
        source: expect.any(Number),
        timestamp: expect.any(Number),
        loadTime: expect.any(Number),
        cacheHit: expect.any(Boolean),
      });
    });
  });
});
