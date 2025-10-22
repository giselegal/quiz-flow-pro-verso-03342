import { describe, it, expect, beforeAll } from 'vitest';
import { initializeSchemaRegistry, SchemaAPI } from '@/config/schemas';

const RESULT_TYPES = [
  'result-header',
  'result-description',
  'result-image',
  'result-cta',
  'result-progress-bars',
  'result-main',
  'result-style',
  'result-characteristics',
  'result-secondary-styles',
  'result-cta-primary',
  'result-cta-secondary',
  'result-share',
];

describe('SchemaAPI - Result atomic blocks', () => {
  beforeAll(() => {
    initializeSchemaRegistry();
  });

  it('registra todos os tipos esperados', () => {
    for (const t of RESULT_TYPES) {
      expect(SchemaAPI.has(t)).toBe(true);
    }
  });

  it('carrega schemas com sucesso (get)', async () => {
    for (const t of RESULT_TYPES) {
      const schema = await SchemaAPI.get(t);
      expect(schema).toBeTruthy();
      expect(schema?.type).toBe(t);
      // deve ter propriedades e grupos
      expect(Array.isArray(schema?.properties)).toBe(true);
      expect((schema?.properties?.length || 0) > 0).toBe(true);
    }
  });
});
