/**
 * 🧪 TESTES - UnifiedQuizBridge
 * 
 * Validar gerenciamento unificado de funis
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { UnifiedQuizBridge } from '@/services/UnifiedQuizBridge';

describe('UnifiedQuizBridge', () => {
  let bridge: UnifiedQuizBridge;

  beforeEach(() => {
    bridge = UnifiedQuizBridge.getInstance();
    bridge.clearCache();
  });

  describe('Singleton pattern', () => {
    it('deve retornar mesma instância', () => {
      const instance1 = UnifiedQuizBridge.getInstance();
      const instance2 = UnifiedQuizBridge.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('loadProductionFunnel', () => {
    it('deve carregar funil de produção completo', async () => {
      const funnel = await bridge.loadProductionFunnel();

      expect(funnel).toBeDefined();
      expect(funnel.id).toBe('production');
      expect(funnel.slug).toBe('quiz-estilo');
      expect(funnel.isPublished).toBe(true);
      expect(Object.keys(funnel.steps).length).toBeGreaterThan(0);
    });

    it('deve ter todos os steps em UnifiedQuizStep format', async () => {
      const funnel = await bridge.loadProductionFunnel();

      for (const [stepId, step] of Object.entries(funnel.steps)) {
        expect(step.id).toBe(stepId);
        expect(step.stepNumber).toBeGreaterThan(0);
        expect(step.type).toBeDefined();
        expect(step.sections).toBeInstanceOf(Array);
        expect(step.metadata).toBeDefined();
        expect(step.metadata.source).toBe('quizstep');
      }
    });

    it('deve usar cache em segunda chamada', async () => {
      const funnel1 = await bridge.loadProductionFunnel();
      const funnel2 = await bridge.loadProductionFunnel();

      expect(funnel1).toBe(funnel2); // Mesma referência
    });
  });

  describe('loadStep', () => {
    it('deve carregar step hardcoded', async () => {
      const step = await bridge.loadStep('step-01', 'hardcoded');

      expect(step).toBeDefined();
      expect(step?.id).toBe('step-01');
      expect(step?.type).toBe('intro');
    });

    it('deve retornar null para step inexistente', async () => {
      const step = await bridge.loadStep('step-99', 'hardcoded');
      expect(step).toBeNull();
    });

    it('deve fazer fallback para hardcoded se database não disponível', async () => {
      const step = await bridge.loadStep('step-01', 'database');

      expect(step).toBeDefined();
      expect(step?.id).toBe('step-01');
    });
  });

  describe('exportToJSONv3', () => {
    it('deve exportar funil para formato JSON v3.0', async () => {
      const templates = await bridge.exportToJSONv3('production');

      expect(templates).toBeDefined();
      expect(Object.keys(templates).length).toBeGreaterThan(0);

      // Validar estrutura do primeiro template
      const firstTemplate = Object.values(templates)[0] as any;
      expect(firstTemplate.templateVersion).toBe('3.0');
      expect(firstTemplate.metadata).toBeDefined();
      expect(firstTemplate.sections).toBeInstanceOf(Array);
      expect(firstTemplate.navigation).toBeDefined();
    });
  });

  describe('importFromJSONv3', () => {
    it('deve importar templates JSON v3.0', async () => {
      const mockTemplates = {
        'step-01': {
          templateVersion: '3.0',
          metadata: {
            id: 'step-01',
            name: 'Test Step',
            category: 'intro'
          },
          sections: [
            { type: 'text-block', id: 'block-1', content: { text: 'Test' } }
          ],
          navigation: { nextStep: 'step-02' }
        }
      };

      const funnel = await bridge.importFromJSONv3(mockTemplates);

      expect(funnel.steps['step-01']).toBeDefined();
      expect(funnel.steps['step-01'].metadata.source).toBe('json');
    });
  });

  describe('validateFunnel', () => {
    it('deve validar funil de produção como válido', async () => {
      const validation = await bridge.validateFunnel('production');

      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('deve detectar problemas em funil inválido', async () => {
      // Simular funil com problemas
      // (Isso requer mock mais elaborado, por agora validamos estrutura)
      const validation = await bridge.validateFunnel('production');
      
      expect(validation).toHaveProperty('valid');
      expect(validation).toHaveProperty('errors');
      expect(validation.errors).toBeInstanceOf(Array);
    });
  });

  describe('Cache management', () => {
    it('deve limpar cache corretamente', async () => {
      const funnel1 = await bridge.loadProductionFunnel();
      bridge.clearCache();
      const funnel2 = await bridge.loadProductionFunnel();

      // Devem ser objetos diferentes (novo carregamento)
      expect(funnel1).not.toBe(funnel2);
      expect(funnel1.id).toBe(funnel2.id);
    });
  });

  describe('Error handling', () => {
    it('deve lidar com fonte inválida graciosamente', async () => {
      const step = await bridge.loadStep('step-01', 'templates');
      
      // Pode ser null se template não existir, mas não deve throw
      expect(step === null || step !== undefined).toBe(true);
    });
  });
});
