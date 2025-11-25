import { describe, expect, it } from 'vitest';
import { buildZodSchemaFromBlockSchema } from '../zodSchemaBuilder';
import type { BlockTypeSchema, PropertySchema } from '../SchemaInterpreter';

const makeBlockSchema = (properties: Record<string, PropertySchema>): BlockTypeSchema => ({
  type: 'test-block',
  label: 'Test Block',
  category: 'content',
  description: 'Schema usado em testes unitários',
  properties,
});

describe('zodSchemaBuilder', () => {
  it('aplica min/max length e pattern para campos de string', () => {
    const schema = buildZodSchemaFromBlockSchema(makeBlockSchema({
      title: {
        type: 'string',
        control: 'text',
        label: 'Título',
        required: true,
        validation: {
          minLength: 3,
          maxLength: 8,
          pattern: '^[A-Z].*',
        },
      },
    }));

    expect(schema.safeParse({ title: 'Inicio' }).success).toBe(true);
    expect(schema.safeParse({ title: 'ab' }).success).toBe(false);
    expect(schema.safeParse({ title: 'ValorMuitoLongo' }).success).toBe(false);
    expect(schema.safeParse({ title: 'lower' }).success).toBe(false);
  });

  it('respeita opções em dropdowns', () => {
    const schema = buildZodSchemaFromBlockSchema(makeBlockSchema({
      alignment: {
        type: 'string',
        control: 'dropdown',
        label: 'Alinhamento',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' },
        ],
      },
    }));

    expect(schema.safeParse({ alignment: 'center' }).success).toBe(true);
    expect(schema.safeParse({ alignment: 'top' }).success).toBe(false);
  });

  it('valida arrays/options-list e aplica minItems', () => {
    const schema = buildZodSchemaFromBlockSchema(makeBlockSchema({
      options: {
        type: 'json',
        control: 'options-list',
        label: 'Opções',
        required: true,
        validation: {
          minItems: 2,
        },
      },
    }));

    expect(schema.safeParse({ options: [{ id: '1' }, { id: '2' }] }).success).toBe(true);
    expect(schema.safeParse({ options: [{ id: '1' }] }).success).toBe(false);
    expect(schema.safeParse({ options: 'valor inválido' }).success).toBe(false);
  });

  it('aplica valores padrão para propriedades opcionais', () => {
    const schema = buildZodSchemaFromBlockSchema(makeBlockSchema({
      subtitle: {
        type: 'string',
        control: 'text',
        label: 'Subtítulo',
        default: 'Padrão',
      },
    }));

    const parsed = schema.parse({});
    expect(parsed.subtitle).toBe('Padrão');
  });

  it('executa validações customizadas', () => {
    const schema = buildZodSchemaFromBlockSchema(makeBlockSchema({
      slug: {
        type: 'string',
        control: 'text',
        label: 'Slug',
        validation: {
          custom: (value: string) => (value?.startsWith('quiz-') ? true : 'Slug deve iniciar com "quiz-"'),
        },
      },
    }));

    expect(schema.safeParse({ slug: 'quiz-123' }).success).toBe(true);
    const invalid = schema.safeParse({ slug: 'invalid' });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(invalid.error.issues[0].message).toContain('Slug deve iniciar');
    }
  });
});
