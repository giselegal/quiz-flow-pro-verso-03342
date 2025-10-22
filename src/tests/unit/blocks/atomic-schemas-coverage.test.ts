import { describe, it, expect } from 'vitest';
import { getBlockSchema } from '@/components/editor/quiz/schema/blockSchema';

// Verifica cobertura mínima de schemas para blocos atômicos do resultado
// Usa o fallback do editor (blockSchema.ts); a UI moderna usa SchemaAPI quando disponível

describe('Atomic Result Blocks - schema coverage (fallback editor schema)', () => {
  const types = [
    'result-header',
    'result-description',
    'result-image',
    'result-main',
    'result-style',
    'result-characteristics',
    'result-secondary-styles',
    'result-cta',
    'result-cta-primary',
    'result-cta-secondary',
    'result-share',
  ];

  for (const t of types) {
    it(`getBlockSchema(${t}) deve existir`, () => {
      const schema = getBlockSchema(t);
      expect(schema, `Schema ausente para ${t}`).toBeTruthy();
      expect(schema?.properties?.length, `Schema ${t} sem propriedades`).toBeGreaterThan(0);
    });
  }
});
