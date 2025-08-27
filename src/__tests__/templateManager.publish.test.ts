import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock do templateService para evitar chamadas reais e controlar retornos
vi.mock('../services/templateService', () => {
  return {
    templateService: {
      getTemplateByStep: vi.fn(async (stepNumber: number) => {
        // Retorna um template básico quando solicitado
        return {
          blocks: [
            {
              id: `tmpl-step-${stepNumber}-header`,
              type: 'text-inline',
              properties: { content: `Template Step ${stepNumber}` },
            },
          ],
        } as any;
      }),
      convertTemplateBlocksToEditorBlocks: (blocks: any[]) =>
        (blocks || []).map((b, idx) => ({
          id: b.id,
          type: b.type,
          order: idx,
          properties: b.properties || {},
          content: b.properties || {},
        })),
    },
  };
});

import type { Block } from '@/types/editor';
import { TemplateManager } from '@/utils/TemplateManager';

describe('TemplateManager publish/unpublish flow', () => {
  const stepId = 'step-3';

  // Configura ambiente JSDOM para disponibilizar window/localStorage/CustomEvent
  beforeEach(() => {
    // Se já existir window de execuções anteriores, reaproveita
    if (!(globalThis as any).window || !(globalThis as any).document) {
      const { JSDOM } = require('jsdom');
      const dom = new JSDOM('<!doctype html><html><body></body></html>', {
        url: 'http://localhost',
      });
      (globalThis as any).window = dom.window;
      (globalThis as any).document = dom.window.document;
      (globalThis as any).CustomEvent = dom.window.CustomEvent;
      (globalThis as any).Event = dom.window.Event;
      (globalThis as any).localStorage = dom.window.localStorage;
    }
  });

  beforeEach(() => {
    // Limpa localStorage e cache interno entre testes
    localStorage.clear();
    TemplateManager.clearCache();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should dispatch event and persist to localStorage on publish', async () => {
    const blocks: Block[] = [
      { id: 'b1', type: 'text-inline', order: 0, properties: { content: 'Hello' }, content: {} },
    ];

    const spy = vi.fn();
    window.addEventListener('quiz-template-updated', spy as EventListener);

    TemplateManager.publishStep(stepId, blocks);

    const stored = JSON.parse(
      localStorage.getItem('quiz_published_blocks_' + stepId) || 'null'
    ) as any;
    expect(stored).toBeTruthy();
    expect(stored.blocks?.length).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('loadStepBlocks should prioritize published blocks over template service', async () => {
    const published: Block[] = [
      {
        id: 'pb1',
        type: 'text-inline',
        order: 0,
        properties: { content: 'Published content' },
        content: { content: 'Published content' },
      },
    ];

    TemplateManager.publishStep(stepId, published);

    const loaded = await TemplateManager.loadStepBlocks(stepId);
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe('pb1');
    expect(loaded[0].properties?.content).toBe('Published content');
  });

  it('unpublish should remove override and event should fire; subsequent load uses template service', async () => {
    const published: Block[] = [
      { id: 'pb2', type: 'text-inline', order: 0, properties: { content: 'X' }, content: {} },
    ];
    TemplateManager.publishStep(stepId, published);

    const spy = vi.fn();
    window.addEventListener('quiz-template-updated', spy as EventListener);
    TemplateManager.unpublishStep(stepId);

    expect(localStorage.getItem('quiz_published_blocks_' + stepId)).toBeNull();
    expect(spy).toHaveBeenCalled();

    const loaded = await TemplateManager.loadStepBlocks(stepId);
    // Com mock do templateService, espera 1 bloco vindo do template (id começa com tmpl)
    expect(loaded.length).toBeGreaterThan(0);
    expect(String(loaded[0].id)).toContain('tmpl-step-3');
  });
});
