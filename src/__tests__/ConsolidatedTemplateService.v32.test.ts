/**
 * 🧪 TESTES: ConsolidatedTemplateService v3.2
 * 
 * Valida priorização de JSONs individuais v3.2 sobre master JSON v3.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { consolidatedTemplateService } from '@/services/core/ConsolidatedTemplateService';

// Mock de fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('ConsolidatedTemplateService - v3.2 Priority', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Hierarquia de Prioridade', () => {
    it('PRIORIDADE 1: deve carregar de /templates/step-XX-v3.json primeiro', async () => {
      // Mock: v3.2 individual disponível
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          templateVersion: '3.2',
          id: 'step-01',
          type: 'question',
          blocks: [{ id: 'b1', type: 'text', content: 'V3.2 content' }],
        }),
      });

      const template = await consolidatedTemplateService.getTemplate('step-01');

      expect(mockFetch).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/templates/step-01-v3.json'),
        expect.any(Object)
      );
      expect(template).toBeTruthy();
    });

    it('PRIORIDADE 2: deve fallback para master JSON se v3.2 individual não existir', async () => {
      // Mock 1: v3.2 individual não encontrado
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      // Mock 2: master JSON disponível
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          templateVersion: '3.0',
          steps: {
            'step-01': {
              id: 'step-01',
              type: 'question',
              blocks: [{ id: 'b1', type: 'text', content: 'Master JSON content' }],
            },
          },
        }),
      });

      const template = await consolidatedTemplateService.getTemplate('step-01');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/templates/step-01-v3.json'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/templates/quiz21-complete.json'),
        expect.any(Object)
      );
      expect(template).toBeTruthy();
    });
  });

  describe('normalizeStepId', () => {
    it('deve normalizar IDs para formato padded', async () => {
      // Testar indiretamente através de getTemplate
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          templateVersion: '3.2',
          id: 'step-01',
          blocks: [],
        }),
      });

      // Todos devem buscar /templates/step-01-v3.json
      await consolidatedTemplateService.getTemplate('step-1');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/templates/step-01-v3.json'),
        expect.any(Object)
      );

      mockFetch.mockClear();
      await consolidatedTemplateService.getTemplate('1');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/templates/step-01-v3.json'),
        expect.any(Object)
      );

      mockFetch.mockClear();
      await consolidatedTemplateService.getTemplate('step-01');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/templates/step-01-v3.json'),
        expect.any(Object)
      );
    });

    it('deve lidar com números de dois dígitos', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          templateVersion: '3.2',
          id: 'step-21',
          blocks: [],
        }),
      });

      await consolidatedTemplateService.getTemplate('step-21');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/templates/step-21-v3.json'),
        expect.any(Object)
      );
    });
  });

  describe('Detecção de Versão', () => {
    it('deve logar informações sobre v3.2+', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          templateVersion: '3.2',
          id: 'step-01',
          blocks: [],
        }),
      });

      await consolidatedTemplateService.getTemplate('step-01');

      // Verificar que logging menciona v3.2
      expect(consoleSpy).toHaveBeenCalled();
      const logs = consoleSpy.mock.calls.map((call) => call.join(' '));
      const hasV32Log = logs.some((log) => log.includes('3.2') || log.includes('v3.2'));
      expect(hasV32Log).toBe(true);

      consoleSpy.mockRestore();
    });
  });
});

describe('ConsolidatedTemplateService - Compatibilidade Retroativa', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('deve processar templates v3.0 sem erros', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        templateVersion: '3.0',
        id: 'step-01',
        blocks: [{ id: 'b1', type: 'text', content: 'V3.0 content' }],
      }),
    });

    const template = await consolidatedTemplateService.getTemplate('step-01');

    expect(template).toBeTruthy();
  });

  it('deve processar templates v3.1 sem erros', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        templateVersion: '3.1',
        id: 'step-01',
        blocks: [{ id: 'b1', type: 'text', content: 'V3.1 content' }],
      }),
    });

    const template = await consolidatedTemplateService.getTemplate('step-01');

    expect(template).toBeTruthy();
  });
});
