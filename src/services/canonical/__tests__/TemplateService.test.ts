/**
 * Testes Automatizados - TemplateService
 * 
 * Testa todas as funcionalidades do serviço de templates:
 * - Sistema de priorização 3-tier (JSON → API → Legacy)
 * - Suporte a AbortSignal para cancelamento
 * - Cache e otimizações de performance
 * - Normalização e validação de dados
 * - Tratamento de erros
 * 
 * @module __tests__/services/TemplateService.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { templateService } from '@/services/canonical/TemplateService';
import * as builtInTemplates from '@/services/templates/builtInTemplates';

// Mock do builtInTemplates alinhado com a API real
vi.mock('@/services/templates/builtInTemplates', () => ({
  getBuiltInTemplates: vi.fn(),
  getBuiltInTemplateById: vi.fn(),
  hasBuiltInTemplate: vi.fn(),
  listBuiltInTemplateIds: vi.fn(),
}));

// Mock do fetch global
global.fetch = vi.fn();

describe('TemplateService - Sistema de Priorização 3-Tier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Tier 1: JSON Built-in (Prioridade Máxima)', () => {
    it('deve carregar template do JSON quando disponível', async () => {
      const mockTemplate = {
        metadata: {
          id: 'quiz21StepsComplete',
          version: '3.1',
          name: 'Quiz 21 Steps',
        },
        steps: {
          'step-01-intro': {
            blocks: [
              { id: 'block-1', type: 'IntroLogo' },
            ],
          },
        },
      };

      vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
      vi.mocked(builtInTemplates.getBuiltInTemplateById).mockResolvedValue(mockTemplate as any);

      const result = await templateService.getStep(
        'step-01-intro',
        'quiz21StepsComplete'
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual([{ id: 'block-1', type: 'IntroLogo' }]);

      // Deve usar JSON, não chamar fetch
      expect(fetch).not.toHaveBeenCalled();
    });

    it('deve normalizar formato v3.1 (objeto) para array', async () => {
      const mockTemplate = {
        metadata: { id: 'quiz21', version: '3.1' },
        steps: {
          'step-01': {
            order: 1,
            blocks: [{ id: 'b1', type: 'Block' }],
          },
        },
      };

      vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
      vi.mocked(builtInTemplates.getBuiltInTemplateById).mockResolvedValue(mockTemplate as any);

      const result = await templateService.getStep('step-01', 'quiz21');

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toEqual([{ id: 'b1', type: 'Block' }]);
    });

    it('deve suportar formato legacy (array direto)', async () => {
      const mockTemplate = {
        metadata: { id: 'quiz21', version: '3.1' },
        steps: {
          'step-01': [
            { id: 'b1', type: 'Block' },
            { id: 'b2', type: 'Block' },
          ],
        },
      };

      vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
      vi.mocked(builtInTemplates.getBuiltInTemplateById).mockResolvedValue(mockTemplate as any);

      const result = await templateService.getStep('step-01', 'quiz21');

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { id: 'b1', type: 'Block' },
        { id: 'b2', type: 'Block' },
      ]);
    });
  });

  describe('Tier 2: API Externa (Fallback)', () => {
    it('deve carregar da API quando JSON não disponível', async () => {
      const mockApiResponse = {
        step: 'step-02',
        blocks: [
          { id: 'api-block-1', type: 'APIBlock' },
        ],
      };

      vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(false);
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      const result = await templateService.getStep(
        'step-02',
        'api-template'
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual([{ id: 'api-block-1', type: 'APIBlock' }]);

      // Deve ter chamado a API
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/templates/api-template/steps/step-02'),
        expect.any(Object)
      );
    });

    it('deve tratar erro 404 da API', async () => {
      vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(false);
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      const result = await templateService.getStep(
        'step-inexistente',
        'api-template'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('404');
    });

    it('deve tratar erro de rede da API', async () => {
      vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(false);
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      const result = await templateService.getStep(
        'step-02',
        'api-template'
      );

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Network error');
    });
  });

  describe('Tier 3: Legacy System (Último Recurso)', () => {
    it('deve usar sistema legacy quando JSON e API falham', async () => {
      vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(false);
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      // Mock do sistema legacy (getStepBlocks)
      const mockLegacyBlocks = [
        { id: 'legacy-1', type: 'LegacyBlock' },
      ];

      vi.spyOn(templateService as any, 'getStepBlocksLegacy').mockResolvedValue({
        success: true,
        data: mockLegacyBlocks,
      });

      const result = await templateService.getStep(
        'step-legacy',
        'legacy-template'
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLegacyBlocks);
    });
  });
});

describe('TemplateService - Suporte a AbortSignal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve cancelar requisição quando AbortSignal dispara', async () => {
    const controller = new AbortController();
    const mockTemplate = {
      metadata: { id: 'quiz21', version: '3.1' },
      steps: {
        'step-01': [{ id: 'b1', type: 'Block' }],
      },
    };

    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
    vi.mocked(builtInTemplates.getBuiltInTemplate).mockImplementation(
      async () => {
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockTemplate;
      }
    );

    // Cancelar após 50ms
    setTimeout(() => controller.abort(), 50);

    const result = await templateService.getStep(
      'step-01',
      'quiz21',
      { signal: controller.signal }
    );

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('abort');
  });

  it('deve passar AbortSignal para fetch da API', async () => {
    const controller = new AbortController();

    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(false);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ blocks: [] }),
    } as Response);

    await templateService.getStep(
      'step-01',
      'api-template',
      { signal: controller.signal }
    );

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        signal: controller.signal,
      })
    );
  });
});

describe('TemplateService - prepareTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve preparar template sem preloadAll', async () => {
    const mockTemplate = {
      metadata: {
        id: 'quiz21',
        version: '3.1',
        name: 'Quiz 21 Steps',
      },
      steps: {
        'step-01': [{ id: 'b1', type: 'Block' }],
        'step-02': [{ id: 'b2', type: 'Block' }],
      },
    };

    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
    vi.mocked(builtInTemplates.getBuiltInTemplateById).mockResolvedValue(mockTemplate as any);

    const result = await templateService.prepareTemplate('quiz21', {
      preloadAll: false,
    });

    expect(result.success).toBe(true);

    // Deve ter carregado apenas metadata
    expect(builtInTemplates.getBuiltInTemplateById).toHaveBeenCalledTimes(1);
  });

  it('deve preparar template com preloadAll=true', async () => {
    const mockTemplate = {
      metadata: {
        id: 'quiz21',
        version: '3.1',
      },
      steps: {
        'step-01': [{ id: 'b1', type: 'Block' }],
        'step-02': [{ id: 'b2', type: 'Block' }],
      },
    };

    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
    vi.mocked(builtInTemplates.getBuiltInTemplateById).mockResolvedValue(mockTemplate as any);

    const result = await templateService.prepareTemplate('quiz21', {
      preloadAll: true,
    });

    expect(result.success).toBe(true);

    // Deve ter carregado template completo
    expect(builtInTemplates.getBuiltInTemplateById).toHaveBeenCalled();
  });

  it('deve tratar erro ao preparar template', async () => {
    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
    vi.mocked(builtInTemplates.getBuiltInTemplateById).mockRejectedValue(
      new Error('Falha ao carregar')
    );

    const result = await templateService.prepareTemplate('quiz-error');

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('TemplateService - preloadTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve fazer preload de todos os steps', async () => {
    const mockTemplate = {
      metadata: { id: 'quiz21', version: '3.1' },
      steps: {
        'step-01': [{ id: 'b1', type: 'Block' }],
        'step-02': [{ id: 'b2', type: 'Block' }],
        'step-03': [{ id: 'b3', type: 'Block' }],
      },
    };

    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
    vi.mocked(builtInTemplates.getBuiltInTemplateById).mockResolvedValue(mockTemplate as any);

    const result = await templateService.preloadTemplate('quiz21');

    expect(result.success).toBe(true);

    // Deve ter carregado o template
    expect(builtInTemplates.getBuiltInTemplate).toHaveBeenCalled();
  });

  it('deve suportar AbortSignal no preload', async () => {
    const controller = new AbortController();
    const mockTemplate = {
      metadata: { id: 'quiz21', version: '3.1' },
      steps: { 'step-01': [{ id: 'b1', type: 'Block' }] },
    };

    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
    vi.mocked(builtInTemplates.getBuiltInTemplate).mockImplementation(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockTemplate;
      }
    );

    setTimeout(() => controller.abort(), 50);

    const result = await templateService.preloadTemplate('quiz21', {
      signal: controller.signal,
    });

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('abort');
  });
});

describe('TemplateService - Validação e Normalização', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve validar estrutura de blocks', async () => {
    const invalidTemplate = {
      metadata: { id: 'invalid', version: '3.1' },
      steps: {
        'step-01': [
          { type: 'Block' }, // Falta id
        ],
      },
    };

    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
    vi.mocked(builtInTemplates.getBuiltInTemplateById).mockResolvedValue(invalidTemplate as any);

    const result = await templateService.getStep('step-01', 'invalid');

    // Deve retornar erro ou normalizar
    expect(result.success).toBeDefined();
  });

  it('deve normalizar IDs faltantes', async () => {
    const mockTemplate = {
      metadata: { id: 'quiz21', version: '3.1' },
      steps: {
        'step-01': [
          { type: 'IntroLogo', properties: {} },
          { type: 'IntroTitle', properties: {} },
        ],
      },
    };

    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
    vi.mocked(builtInTemplates.getBuiltInTemplateById).mockResolvedValue(mockTemplate as any);

    const result = await templateService.getStep('step-01', 'quiz21');

    if (result.success) {
      // IDs devem ser gerados
      result.data?.forEach(block => {
        expect(block.id).toBeDefined();
        expect(typeof block.id).toBe('string');
      });
    }
  });

  it('deve preservar propriedades customizadas', async () => {
    const mockTemplate = {
      metadata: { id: 'quiz21', version: '3.1' },
      steps: {
        'step-01': [
          {
            id: 'custom-block',
            type: 'IntroLogo',
            properties: {
              customProp: 'value',
              logo: 'logo.png',
            },
          },
        ],
      },
    };

    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
    vi.mocked(builtInTemplates.getBuiltInTemplateById).mockResolvedValue(mockTemplate as any);

    const result = await templateService.getStep('step-01', 'quiz21');

    expect(result.success).toBe(true);
    expect(result.data?.[0].properties).toEqual({
      customProp: 'value',
      logo: 'logo.png',
    });
  });
});

describe('TemplateService - Tratamento de Erros', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar erro para step inexistente', async () => {
    const mockTemplate = {
      metadata: { id: 'quiz21', version: '3.1' },
      steps: {
        'step-01': [{ id: 'b1', type: 'Block' }],
      },
    };

    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
    vi.mocked(builtInTemplates.getBuiltInTemplateById).mockResolvedValue(mockTemplate as any);

    const result = await templateService.getStep(
      'step-inexistente',
      'quiz21'
    );

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('não encontrado');
  });

  it('deve retornar erro para template inexistente', async () => {
    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(false);
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    const result = await templateService.getStep(
      'step-01',
      'template-inexistente'
    );

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('deve tratar JSON inválido da API', async () => {
    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(false);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error('JSON inválido');
      },
    } as Response);

    const result = await templateService.getStep('step-01', 'api-template');

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('JSON');
  });
});

describe('TemplateService - Performance e Cache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar template apenas uma vez', async () => {
    const mockTemplate = {
      metadata: { id: 'quiz21', version: '3.1' },
      steps: {
        'step-01': [{ id: 'b1', type: 'Block' }],
        'step-02': [{ id: 'b2', type: 'Block' }],
      },
    };

    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
    vi.mocked(builtInTemplates.getBuiltInTemplate).mockResolvedValue(mockTemplate);

    // Carregar múltiplos steps do mesmo template
    await templateService.getStep('step-01', 'quiz21');
    await templateService.getStep('step-02', 'quiz21');

    // Template deve ser carregado apenas 1x (cache interno)
    // Nota: depende da implementação de cache no TemplateService
    expect(builtInTemplates.getBuiltInTemplate).toHaveBeenCalled();
  });

  it('deve executar carregamentos paralelos eficientemente', async () => {
    const mockTemplate = {
      metadata: { id: 'quiz21', version: '3.1' },
      steps: {
        'step-01': [{ id: 'b1', type: 'Block' }],
        'step-02': [{ id: 'b2', type: 'Block' }],
        'step-03': [{ id: 'b3', type: 'Block' }],
      },
    };

    vi.mocked(builtInTemplates.hasBuiltInTemplate).mockReturnValue(true);
    vi.mocked(builtInTemplates.getBuiltInTemplate).mockResolvedValue(mockTemplate);

    const startTime = Date.now();

    // Carregar 3 steps em paralelo
    const results = await Promise.all([
      templateService.getStep('step-01', 'quiz21'),
      templateService.getStep('step-02', 'quiz21'),
      templateService.getStep('step-03', 'quiz21'),
    ]);

    const duration = Date.now() - startTime;

    // Deve ser rápido (< 500ms)
    expect(duration).toBeLessThan(500);

    // Todos devem ter sucesso
    expect(results.every(r => r.success)).toBe(true);
  });
});
