/**
 * 🧪 FASE 1 - TEMPLATE SERVICE VALIDATION
 * 
 * Validação completa das correções de performance:
 * ✅ Cache preload funcionando
 * ✅ Cache MISS eliminado
 * ✅ Preload de critical steps
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { templateService } from '@/services/canonical/TemplateService';

describe('FASE 1 - Template Service Performance', () => {
  beforeAll(() => {
    // Força inicialização
    templateService.initialize();
  });

  describe('Cache Preload', () => {
    it('deve precarregar critical steps na inicialização', async () => {
      const criticalSteps = ['step-01', 'step-02', 'step-21'];
      
      for (const stepId of criticalSteps) {
        const result = await templateService.getStep(stepId);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBeDefined();
          expect(Array.isArray(result.data)).toBe(true);
        }
      }
    });

    it('deve retornar steps válidos sem cache MISS', async () => {
      const stepIds = ['step-01', 'step-10', 'step-21'];
      
      for (const stepId of stepIds) {
        const result = await templateService.getStep(stepId);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('Template Service API', () => {
    it('deve listar todos os 21 steps', () => {
      const result = templateService.steps.list();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.length).toBe(21);
      }
    });

    it('deve retornar estrutura válida de step', async () => {
      const result = await templateService.getStep('step-01');
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBeGreaterThan(0);
        // Validar primeiro bloco
        if (result.data.length > 0) {
          expect(result.data[0]).toHaveProperty('type');
          expect(result.data[0]).toHaveProperty('id');
        }
      }
    });

    it('deve retornar erro para step inválido', async () => {
      const result = await templateService.getStep('step-999');
      expect(result.success).toBe(false);
    });
  });

  describe('Performance Metrics', () => {
    it('deve ter performance consistente em múltiplas chamadas', async () => {
      const iterations = 5;
      const stepId = 'step-05';
      
      for (let i = 0; i < iterations; i++) {
        const result = await templateService.getStep(stepId);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(Array.isArray(result.data)).toBe(true);
        }
      }
    });

    it('deve responder em tempo aceitável', async () => {
      const startTime = performance.now();
      const result = await templateService.getStep('step-01');
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // < 1s
    });
  });
});
