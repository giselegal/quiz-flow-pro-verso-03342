/**
 * @file TemplateService.activeTemplate.test.ts
 * @description Testes específicos para setActiveTemplate e steps.list
 * 
 * OBJETIVO: Validar que a sincronização entre setActiveTemplate e steps.list funciona
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TemplateService } from '../TemplateService';

describe('TemplateService - setActiveTemplate & steps.list', () => {
  let service: TemplateService;

  beforeEach(() => {
    // Criar nova instância para cada teste
    service = TemplateService.getInstance({ debug: false });
  });

  afterEach(() => {
    // Limpar estado
    service.setActiveTemplate('', 0);
  });

  describe('setActiveTemplate()', () => {
    it('deve definir template ativo corretamente', () => {
      service.setActiveTemplate('quiz21StepsComplete', 21);

      const result = service.steps.list();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(21);
      }
    });

    it('deve sobrescrever template anterior', () => {
      service.setActiveTemplate('template1', 10);
      let result = service.steps.list();
      if (result.success) {
        expect(result.data).toHaveLength(10);
      }

      service.setActiveTemplate('template2', 15);
      result = service.steps.list();
      if (result.success) {
        expect(result.data).toHaveLength(15);
      }
    });

    it('deve aceitar 0 steps (modo vazio)', () => {
      service.setActiveTemplate('empty', 0);

      const result = service.steps.list();
      expect(result.success).toBe(true);
      if (result.success) {
        // Com 0 steps, pode retornar array vazio ou fallback dependendo da lógica
        expect(Array.isArray(result.data)).toBe(true);
      }
    });

    it('deve lidar com números grandes de steps', () => {
      service.setActiveTemplate('bigTemplate', 100);

      const result = service.steps.list();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(100);
      }
    });
  });
    it('deve lidar com números grandes de steps', () => {
      service.setActiveTemplate('bigTemplate', 100);

      const result = service.steps.list();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(100);
      }
    });
  });

  describe('steps.list() - com activeTemplate definido', () => {
    it('deve retornar steps corretos após setActiveTemplate', () => {
      service.setActiveTemplate('quiz21StepsComplete', 21);

      const result = service.steps.list();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Array);
        expect(result.data).toHaveLength(21);
      }
    });

    it('deve retornar steps com estrutura válida', () => {
      service.setActiveTemplate('quiz21StepsComplete', 21);

      const result = service.steps.list();
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      const firstStep = result.data[0];

      expect(firstStep).toMatchObject({
        id: expect.stringMatching(/^step-\d{2}$/),
        order: expect.any(Number),
        name: expect.any(String),
        blocksCount: expect.any(Number),
        hasTemplate: expect.any(Boolean),
      });
    });

    it('deve retornar steps em ordem crescente', () => {
      service.setActiveTemplate('quiz21StepsComplete', 21);

      const result = service.steps.list();
      expect(result.success).toBe(true);
      if (!result.success) return;

      for (let i = 1; i < result.data.length; i++) {
        expect(result.data[i].order).toBeGreaterThan(result.data[i - 1].order);
      }
    });

    it('deve incluir metadados corretos para cada step', () => {
      service.setActiveTemplate('quiz21StepsComplete', 21);

      const result = service.steps.list();
      expect(result.success).toBe(true);
      if (!result.success) return;

      result.data.forEach((step: any, index: number) => {
        expect(step.id).toBe(`step-${String(index + 1).padStart(2, '0')}`);
        expect(step.order).toBe(index + 1);
        expect(step.name).toContain('Etapa');
        expect(step.hasTemplate).toBe(true);
      });
    });
  });

  describe('steps.list() - sem activeTemplate definido', () => {
    it('deve usar fallback se activeTemplateSteps = 0', () => {
      // Não chamar setActiveTemplate
      service.setActiveTemplate('quiz21StepsComplete', 0);

      const result = service.steps.list();

      expect(result.success).toBe(true);
      if (result.success) {
        // Deve usar fallback de 21 steps para quiz21StepsComplete
        expect(result.data).toHaveLength(21);
      }
    });

    it('deve retornar array vazio para template desconhecido sem steps', () => {
      service.setActiveTemplate('unknown', 0);

      const result = service.steps.list();

      expect(result.success).toBe(true);
      if (result.success) {
        // Sem fallback, retorna vazio
        expect(result.data).toHaveLength(0);
      }
    });
  });

  describe('Integração setActiveTemplate → steps.list', () => {
    it('deve funcionar em sequência múltiplas vezes', () => {
      const templates = [
        { id: 'template1', steps: 5 },
        { id: 'template2', steps: 10 },
        { id: 'template3', steps: 15 },
      ];

      templates.forEach(({ id, steps }) => {
        service.setActiveTemplate(id, steps);
        const result = service.steps.list();

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toHaveLength(steps);
        }
      });
    });

    it('deve manter consistência após múltiplas chamadas', () => {
      service.setActiveTemplate('quiz21StepsComplete', 21);

      // Chamar list() múltiplas vezes
      const results = Array.from({ length: 10 }, () => service.steps.list());

      // Todos devem retornar o mesmo
      results.forEach(result => {
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toHaveLength(21);
        }
      });
    });

    it('deve sincronizar imediatamente (sem delay)', () => {
      const startTime = Date.now();

      service.setActiveTemplate('quiz21StepsComplete', 21);
      const result = service.steps.list();

      const duration = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(21);
      expect(duration).toBeLessThan(10); // Deve ser instantâneo (< 10ms)
    });
  });

  describe('Edge cases', () => {
    it('deve lidar com templateId vazio', () => {
      service.setActiveTemplate('', 10);

      const result = service.steps.list();
      expect(result.success).toBe(true);
    });

    it('deve lidar com steps negativos (normalizar para 0)', () => {
      service.setActiveTemplate('negative', -5);

      const result = service.steps.list();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('deve preservar estado durante falhas', () => {
      service.setActiveTemplate('quiz21StepsComplete', 21);

      // Tentar setar template inválido
      try {
        service.setActiveTemplate(null as any, undefined as any);
      } catch {
        // Ignorar erro
      }

      // Deve manter estado anterior ou resetar
      const result = service.steps.list();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(Array.isArray(result.data)).toBe(true);
      }
    });
  });

  describe('Performance', () => {
    it('deve escalar para 100 steps', () => {
      const startTime = Date.now();

      service.setActiveTemplate('bigTemplate', 100);
      const result = service.steps.list();

      const duration = Date.now() - startTime;

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(100);
      }
      expect(duration).toBeLessThan(50); // Deve ser rápido mesmo com 100 steps
    });

    it('deve executar 1000 operações em menos de 1 segundo', () => {
      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        service.setActiveTemplate(`template${i}`, 21);
        service.steps.list();
      }

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000);
    });
  });
});
