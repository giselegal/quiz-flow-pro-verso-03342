import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { templateRegistry } from '../UnifiedTemplateRegistry';

// Minimal Block type align for test assertions
interface Block {
  id: string;
  type: string;
  order: number;
  properties?: Record<string, any>;
  content?: Record<string, any>;
}

declare global {
  // eslint-disable-next-line no-var
  var fetch: typeof fetch;
}

describe('UnifiedTemplateRegistry', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Clean L1 cache per test to avoid state leakage between tests
    templateRegistry.clearL1();
  });

  afterEach(() => {
    // Restore fetch after each test
    global.fetch = originalFetch as any;
    vi.restoreAllMocks();
  });

  it('loads step from per-step JSON and caches in L1', async () => {
    const stepId = 'step-01';
    const blocks: Block[] = [
      { id: 'b1', type: 'text', order: 0, properties: {}, content: {} },
      { id: 'b2', type: 'button', order: 1, properties: {}, content: {} },
    ];

    const responses = new Map<string, Response>([
      [
        `/templates/blocks/${stepId}.json`,
        new Response(JSON.stringify({ blocks }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
      ],
    ]);

    const fetchSpy = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      const resp = responses.get(url);
      return Promise.resolve(resp ?? new Response('Not found', { status: 404 }));
    });

    global.fetch = fetchSpy as any;

    const first = await templateRegistry.getStep(stepId);
    expect(first).toHaveLength(2);
    expect(first[0].id).toBe('b1');
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Second call should hit L1 cache and not call fetch again
    const second = await templateRegistry.getStep(stepId);
    expect(second).toHaveLength(2);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('falls back to -v3 and plain /templates when blocks file missing', async () => {
    const stepId = 'step-02';
    const blocks: Block[] = [
      { id: 'x1', type: 'text', order: 0 },
    ];

    const responses = new Map<string, Response>([
      [
        `/templates/${stepId}-v3.json`,
        new Response(JSON.stringify({ blocks }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
      ],
    ]);

    const fetchSpy = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      const resp = responses.get(url);
      return Promise.resolve(resp ?? new Response('Not found', { status: 404 }));
    });

    global.fetch = fetchSpy as any;

    const result = await templateRegistry.getStep(stepId);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('x1');
    // Should have attempted blocks first, then -v3
    expect(fetchSpy).toHaveBeenCalledWith(`/templates/blocks/${stepId}.json`);
    expect(fetchSpy).toHaveBeenCalledWith(`/templates/${stepId}-v3.json`);
  });
});
