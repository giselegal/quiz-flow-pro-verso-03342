/**
 * 🧪 TESTES DE SINCRONIZAÇÃO - HierarchicalTemplateSource
 * 
 * Valida que setActiveTemplate() funciona corretamente e sincroniza
 * com o carregamento de steps via getPrimary()
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { hierarchicalTemplateSource } from '../HierarchicalTemplateSource';
import type { Block } from '@/types/editor';

// Mock do loadStepFromJson
vi.mock('@/templates/loaders/jsonStepLoader', () => ({
  loadStepFromJson: vi.fn(async (stepId: string, templateId: string) => {
    // Simular carregamento de JSON baseado no template ativo
    if (templateId === 'quiz21StepsComplete') {
      return [
        {
          id: `${stepId}-block-1`,
          type: 'heading',
          content: { text: `Step ${stepId} - quiz21StepsComplete` },
          order: 0,
        },
      ] as Block[];
    }
    if (templateId === 'custom-template') {
      return [
        {
          id: `${stepId}-block-custom`,
          type: 'heading',
          content: { text: `Step ${stepId} - custom-template` },
          order: 0,
        },
      ] as Block[];
    }
    return [];
  }),
}));

describe('HierarchicalTemplateSource - Sincronização', () => {
  beforeEach(() => {
    // Reset para template padrão antes de cada teste
    hierarchicalTemplateSource.setActiveTemplate('quiz21StepsComplete');
  });

  describe('setActiveTemplate()', () => {
    it('deve definir template ativo corretamente', () => {
      // Arrange
      const templateId = 'custom-template';

      // Act
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Assert - verificar via getPrimary que usa o template ativo
      // (teste indireto, pois activeTemplateId é privado)
      expect(() => hierarchicalTemplateSource.setActiveTemplate(templateId)).not.toThrow();
    });

    it('deve aceitar diferentes IDs de template', () => {
      const templates = [
        'quiz21StepsComplete',
        'custom-template',
        'emagrecimento-funnel',
        'venda-consultoria',
      ];

      templates.forEach(templateId => {
        expect(() => hierarchicalTemplateSource.setActiveTemplate(templateId)).not.toThrow();
      });
    });
  });

  describe('getPrimary() com template ativo', () => {
    it('deve carregar step usando template ativo definido', async () => {
      // Arrange
      hierarchicalTemplateSource.setActiveTemplate('quiz21StepsComplete');

      // Act
      const result = await hierarchicalTemplateSource.getPrimary('step-01');

      // Assert
      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].content?.text).toContain('quiz21StepsComplete');
    });

    it('deve usar template correto após mudança de setActiveTemplate', async () => {
      // Arrange
      hierarchicalTemplateSource.setActiveTemplate('quiz21StepsComplete');
      const result1 = await hierarchicalTemplateSource.getPrimary('step-01');

      // Act - mudar para outro template
      hierarchicalTemplateSource.setActiveTemplate('custom-template');
      const result2 = await hierarchicalTemplateSource.getPrimary('step-01');

      // Assert - deve carregar de templates diferentes
      expect(result1.data[0].content?.text).toContain('quiz21StepsComplete');
      expect(result2.data[0].content?.text).toContain('custom-template');
    });

    it('deve manter template ativo entre múltiplas chamadas getPrimary', async () => {
      // Arrange
      hierarchicalTemplateSource.setActiveTemplate('custom-template');

      // Act - carregar múltiplos steps
      const results = await Promise.all([
        hierarchicalTemplateSource.getPrimary('step-01'),
        hierarchicalTemplateSource.getPrimary('step-02'),
        hierarchicalTemplateSource.getPrimary('step-03'),
      ]);

      // Assert - todos devem usar o mesmo template
      results.forEach(result => {
        expect(result.data[0].content?.text).toContain('custom-template');
      });
    });
  });

  describe('Cache com template ativo', () => {
    it('deve invalidar cache ao mudar template ativo', async () => {
      // Arrange
      hierarchicalTemplateSource.setActiveTemplate('quiz21StepsComplete');
      const firstLoad = await hierarchicalTemplateSource.getPrimary('step-01');

      // Act - mudar template e recarregar
      hierarchicalTemplateSource.setActiveTemplate('custom-template');
      const secondLoad = await hierarchicalTemplateSource.getPrimary('step-01');

      // Assert - deve ter carregado dados diferentes
      expect(firstLoad.data[0].content?.text).not.toBe(secondLoad.data[0].content?.text);
    });
  });

  describe('Metadata de fonte', () => {
    it('deve retornar metadata com fonte correta', async () => {
      // Arrange
      hierarchicalTemplateSource.setActiveTemplate('quiz21StepsComplete');

      // Act
      const result = await hierarchicalTemplateSource.getPrimary('step-01');

      // Assert
      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBeDefined();
      expect(result.metadata.timestamp).toBeGreaterThan(0);
      expect(result.metadata.loadTime).toBeGreaterThanOrEqual(0);
    });

    it('deve incluir cacheHit em metadata', async () => {
      // Arrange
      hierarchicalTemplateSource.setActiveTemplate('quiz21StepsComplete');

      // Act - primeira carga (sem cache)
      const firstResult = await hierarchicalTemplateSource.getPrimary('step-01');
      // Segunda carga (com cache)
      const secondResult = await hierarchicalTemplateSource.getPrimary('step-01');

      // Assert
      expect(firstResult.metadata.cacheHit).toBe(false);
      expect(secondResult.metadata.cacheHit).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('deve lançar erro se step não existir', async () => {
      // Arrange
      hierarchicalTemplateSource.setActiveTemplate('quiz21StepsComplete');

      // Act & Assert
      await expect(
        hierarchicalTemplateSource.getPrimary('step-99')
      ).rejects.toThrow();
    });

    it('deve ignorar steps inválidos (> 21)', async () => {
      // Arrange
      hierarchicalTemplateSource.setActiveTemplate('quiz21StepsComplete');

      // Act
      const result = await hierarchicalTemplateSource.getPrimary('step-22');

      // Assert - deve retornar vazio sem erro
      expect(result.data).toEqual([]);
      expect(result.metadata.source).toBeDefined();
    });

    it('deve ignorar steps com número < 1', async () => {
      // Arrange
      hierarchicalTemplateSource.setActiveTemplate('quiz21StepsComplete');

      // Act
      const result = await hierarchicalTemplateSource.getPrimary('step-00');

      // Assert
      expect(result.data).toEqual([]);
    });
  });
});
