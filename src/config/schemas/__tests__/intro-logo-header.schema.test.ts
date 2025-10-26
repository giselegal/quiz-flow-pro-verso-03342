import { describe, it, expect } from 'vitest';
import { initializeSchemaRegistry, SchemaAPI } from '@/config/schemas/dynamic';

describe('SchemaAPI - intro-logo-header', () => {
  it('schema está registrado e carregável', async () => {
    // Inicializa o registro (lazy)
    initializeSchemaRegistry();

    // Verifica registro
    expect(SchemaAPI.has('intro-logo-header')).toBe(true);

    // Carrega schema via API
    const schema = await SchemaAPI.get('intro-logo-header');
    expect(schema).toBeTruthy();
    expect((schema as any).type || (schema as any).id).toBe('intro-logo-header');
    const fields = (schema as any).fields || (schema as any).properties || [];
    expect(Array.isArray(fields)).toBe(true);
  });
});
