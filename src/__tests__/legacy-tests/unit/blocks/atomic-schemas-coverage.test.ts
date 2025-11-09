import { describe, it, expect, beforeAll } from 'vitest';
import { initializeSchemaRegistry, SchemaAPI } from '@/config/schemas';

// Verifica cobertura mínima de schemas para blocos atômicos do resultado
// Agora garantidos via SchemaAPI (registry dinâmico), não mais pelo fallback legacy

describe('Atomic Result Blocks - schema coverage (SchemaAPI)', () => {
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

  beforeAll(() => {
    initializeSchemaRegistry();
  });

  it('tipos registrados na SchemaAPI', () => {
    for (const t of types) {
      expect(SchemaAPI.has(t), `Schema não registrado: ${t}`).toBe(true);
    }
  });

  it('carrega schemas com propriedades', async () => {
    for (const t of types) {
      const schema = await SchemaAPI.get(t);
      expect(schema, `Schema ausente para ${t}`).toBeTruthy();
      expect(Array.isArray(schema!.properties), `Schema ${t} sem properties`).toBe(true);
      expect(schema!.properties!.length, `Schema ${t} sem propriedades`).toBeGreaterThan(0);
    }
  });
});
