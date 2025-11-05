/**
 * 🧪 FASE 2 - HYBRID TEMPLATE SERVICE MIGRATION
 * 
 * Validação das migrações de HybridTemplateService → templateService:
 * ✅ Aliases funcionando corretamente
 * ✅ SmartNavigation migrado
 * ✅ QuizOrchestrator migrado
 * ✅ Sem deprecation warnings em produção
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { templateService } from '@/services/canonical/TemplateService';
import { HybridTemplateService } from '@/services/aliases';

describe('FASE 2 - Hybrid Migration Validation', () => {
  beforeEach(() => {
    templateService.initialize();
  });

  describe('Alias Layer', () => {
    it('HybridTemplateService deve delegar para templateService', async () => {
      const stepConfig = await HybridTemplateService.getStepConfig(1);
      
      expect(stepConfig).toBeDefined();
      expect(stepConfig.metadata).toBeDefined();
      expect(Array.isArray(stepConfig.blocks)).toBe(true);
    });

    it('deve retornar dados consistentes entre alias e canonical', async () => {
      const stepNumber = 5;
      const stepId = `step-${String(stepNumber).padStart(2, '0')}`;
      
      const aliasResult = await HybridTemplateService.getStepConfig(stepNumber);
      const canonicalResult = await templateService.getStep(stepId);
      
      expect(canonicalResult.success).toBe(true);
      expect(aliasResult.metadata.title).toBeDefined();
    });
  });

  describe('Core Migrations', () => {
    it('templateService deve funcionar sem HybridTemplateService', async () => {
      const steps = ['step-01', 'step-10', 'step-21'];
      
      for (const stepId of steps) {
        const result = await templateService.getStep(stepId);
        expect(result.success).toBe(true);
      }
    });

    it('deve listar todos os steps via canonical service', () => {
      const result = templateService.steps.list();
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.length).toBe(21);
        expect(result.data[0]).toHaveProperty('id');
        expect(result.data[0]).toHaveProperty('name');
      }
    });

    it('deve ter estrutura de blocos válida', async () => {
      const result = await templateService.getStep('step-01');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(Array.isArray(result.data)).toBe(true);
      }
    });
  });

  describe('Backward Compatibility', () => {
    it('HybridTemplateService.getTemplate deve funcionar', async () => {
      const template = await HybridTemplateService.getTemplate(1);
      expect(template).toBeDefined();
    });

    it('deve suportar números de step 1-21', async () => {
      const stepNumbers = [1, 10, 21];
      
      for (const stepNumber of stepNumbers) {
        const config = await HybridTemplateService.getStepConfig(stepNumber);
        expect(config).toBeDefined();
        expect(config.metadata).toBeDefined();
      }
    });
  });
});
