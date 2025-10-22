import { describe, it, expect } from 'vitest';
import { propertySchemas } from '@/config/propertySchemas';
import { adaptSchemaToUnifiedProperties } from '@/config/schemaAdapter';

describe('schemaAdapter', () => {
  it('adapta quiz-intro-header com tipos e categorias mapeados', () => {
    const schema = propertySchemas['quiz-intro-header'];
    expect(schema).toBeTruthy();

    const unified = adaptSchemaToUnifiedProperties(schema);
    const keys = unified.map(u => u.key);

    // Campos esperados
    expect(keys).toContain('alignment');
    expect(keys).toContain('fontSize');
    expect(keys).toContain('fontWeight');

    // select deve mapear para 'select'
    const alignment = unified.find(u => u.key === 'alignment');
    expect(alignment?.type).toBe('select');
    expect(alignment?.category).toBe('style');

    // transform.scaleOrigin deve mapear categoria para 'style'
    const scaleOrigin = unified.find(u => u.key === 'scaleOrigin');
    expect(scaleOrigin?.category).toBe('style');
  });

  it('adapta form-input e mapeia options-list como array', () => {
    const schema = propertySchemas['form-input'];
    expect(schema).toBeTruthy();

    const unified = adaptSchemaToUnifiedProperties(schema);

    // inputType/type como selects
    const typeField = unified.find(u => u.key === 'type');
    expect(typeField?.type).toBe('select');

    // required deve ser preservado
    const nameField = unified.find(u => u.key === 'name');
    expect(nameField?.required).toBe(true);
  });
});
