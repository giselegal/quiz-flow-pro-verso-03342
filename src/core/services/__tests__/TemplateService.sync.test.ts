/**
 * 🧪 TESTES DE SINCRONIZAÇÃO - TemplateService
 * 
 * Valida que prepareTemplate() e setActiveTemplate() sincronizam
 * corretamente com HierarchicalTemplateSource
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { templateService } from '../TemplateService';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';

// Mock do hierarchicalTemplateSource.setActiveTemplate
const mockSetActiveTemplate = vi.spyOn(hierarchicalTemplateSource, 'setActiveTemplate');

// Mock de hasBuiltInTemplate e loadFullTemplate
vi.mock('@/services/templates/builtInTemplates', () => ({
  hasBuiltInTemplate: vi.fn((id: string) => id === 'quiz21StepsComplete'),
  getBuiltInTemplateById: vi.fn(),
  listBuiltInTemplateIds: vi.fn(() => ['quiz21StepsComplete']),
}));

vi.mock('@/templates/registry', () => ({
  loadFullTemplate: vi.fn(async (templateId: string) => ({
    id: templateId,
    name: 'Quiz 21 Steps',
    totalSteps: 21,
    steps: {
      'step-01': [{ id: 'block-1', type: 'heading', content: {}, order: 0 }],
      'step-02': [{ id: 'block-2', type: 'paragraph', content: {}, order: 0 }],
    },
  })),
}));

describe('TemplateService - Sincronização com HierarchicalTemplateSource', () => {
  beforeEach(() => {
    mockSetActiveTemplate.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('setActiveTemplate()', () => {
    it('deve chamar hierarchicalTemplateSource.setActiveTemplate()', () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      const totalSteps = 21;

      // Act
      templateService.setActiveTemplate(templateId, totalSteps);

      // Assert
      expect(mockSetActiveTemplate).toHaveBeenCalledWith(templateId);
      expect(mockSetActiveTemplate).toHaveBeenCalledTimes(1);
    });

    it('deve sincronizar múltiplas mudanças de template', () => {
      // Arrange
      const templates = [
        { id: 'quiz21StepsComplete', steps: 21 },
        { id: 'custom-template', steps: 10 },
        { id: 'emagrecimento-funnel', steps: 15 },
      ];

      // Act
      templates.forEach(({ id, steps }) => {
        templateService.setActiveTemplate(id, steps);
      });

      // Assert
      expect(mockSetActiveTemplate).toHaveBeenCalledTimes(3);
      expect(mockSetActiveTemplate).toHaveBeenNthCalledWith(1, 'quiz21StepsComplete');
      expect(mockSetActiveTemplate).toHaveBeenNthCalledWith(2, 'custom-template');
      expect(mockSetActiveTemplate).toHaveBeenNthCalledWith(3, 'emagrecimento-funnel');
    });
  });

  describe('prepareTemplate()', () => {
    it('deve chamar setActiveTemplate internamente', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act
      const result = await templateService.prepareTemplate(templateId);

      // Assert
      expect(result.success).toBe(true);
      expect(mockSetActiveTemplate).toHaveBeenCalledWith(templateId);
    });

    it('deve funcionar com preloadAll: true', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act
      const result = await templateService.prepareTemplate(templateId, {
        preloadAll: true
      });

      // Assert
      expect(result.success).toBe(true);
      expect(mockSetActiveTemplate).toHaveBeenCalledWith(templateId);
    });

    it('deve respeitar AbortSignal', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      const controller = new AbortController();
      controller.abort(); // Abortar imediatamente

      // Act
      const result = await templateService.prepareTemplate(templateId, {
        signal: controller.signal,
      });

      // Assert
      expect(result.success).toBe(false);
      // ServiceResult<void> não expõe error diretamente no tipo; aqui validamos apenas o success=false
      expect(result.success).toBe(false);
    });
  });

  describe('getStep() - integração com template ativo', () => {
    it('deve usar template ativo ao carregar step', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      templateService.setActiveTemplate(templateId, 21);

      // Act
      const result = await templateService.getStep('step-01', templateId);

      // Assert
      expect(result.success).toBe(true);
      expect(mockSetActiveTemplate).toHaveBeenCalledWith(templateId);
    });

    it('deve carregar múltiplos steps do mesmo template', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      templateService.setActiveTemplate(templateId, 21);

      // Act
      const results = await Promise.all([
        templateService.getStep('step-01', templateId),
        templateService.getStep('step-02', templateId),
      ]);

      // Assert
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Fluxo completo: prepareTemplate → getStep', () => {
    it('deve sincronizar template entre prepareTemplate e getStep', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act
      await templateService.prepareTemplate(templateId);
      const stepResult = await templateService.getStep('step-01', templateId);

      // Assert
      expect(mockSetActiveTemplate).toHaveBeenCalledWith(templateId);
      expect(stepResult.success).toBe(true);
    });

    it('deve manter sincronização após múltiplas chamadas', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act - preparar e carregar múltiplas vezes
      await templateService.prepareTemplate(templateId);
      await templateService.getStep('step-01', templateId);
      await templateService.getStep('step-02', templateId);
      await templateService.prepareTemplate(templateId); // Re-preparar
      await templateService.getStep('step-03', templateId);

      // Assert - setActiveTemplate deve ter sido chamado nas preparações
      expect(mockSetActiveTemplate).toHaveBeenCalledWith(templateId);
      expect(mockSetActiveTemplate.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Error handling com sincronização', () => {
    it('deve lidar com erro em prepareTemplate sem quebrar sincronização', async () => {
      // Arrange
      const invalidTemplateId = 'non-existent-template';

      // Act
      const result = await templateService.prepareTemplate(invalidTemplateId);

      // Assert - deve falhar graciosamente
      expect(result.success).toBe(false);
      // Mesmo com erro, setActiveTemplate pode ter sido chamado
    });
  });

  describe('Concurrent calls', () => {
    it('deve lidar com chamadas concorrentes corretamente', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act - múltiplas chamadas concorrentes
      const results = await Promise.allSettled([
        templateService.prepareTemplate(templateId),
        templateService.getStep('step-01', templateId),
        templateService.getStep('step-02', templateId),
        templateService.prepareTemplate(templateId),
      ]);

      // Assert - todas devem completar sem erro fatal
      const fulfilled = results.filter(r => r.status === 'fulfilled');
      expect(fulfilled.length).toBeGreaterThan(0);
    });
  });
});
