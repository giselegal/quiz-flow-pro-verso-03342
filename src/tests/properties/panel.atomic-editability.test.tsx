import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import DynamicPropertiesForm from '@/components/editor/quiz/components/DynamicPropertiesForm';
import { initializeSchemaRegistry, SchemaAPI } from '@/config/schemas';

const ATOMIC_TYPES = [
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

describe('Properties Panel - Atomic blocks editability (SchemaAPI)', () => {
  beforeAll(() => initializeSchemaRegistry());

  it('monta formulário e emite patch para ao menos 1 campo por tipo', async () => {
    for (const type of ATOMIC_TYPES) {
      const schema = await SchemaAPI.get(type);
      expect(schema, `${type}: schema não encontrado`).toBeTruthy();
      const props = (schema?.properties || []).filter((p: any) => !['object', 'array', 'json'].includes(p.type));
      if (props.length === 0) continue;

      const values: Record<string, any> = {};
      props.forEach((p: any) => { values[p.key] = undefined; });

      let lastPatch: Record<string, any> | null = null;
      const { unmount } = render(
        <DynamicPropertiesForm type={type} values={values} onChange={(patch) => { lastPatch = patch; }} />
      );

      const first = props[0];
      await waitFor(() => {
        const exists = !!document.querySelector(`[name="${first.key}"]`) || !!document.querySelector(`#${CSS.escape(first.key)}`) || !!document.querySelector(`label[for="${CSS.escape(first.key)}"]`);
        if (!exists) throw new Error('esperando montar');
      });

      const ctrl = (document.querySelector(`[name="${first.key}"]`) || document.querySelector(`#${CSS.escape(first.key)}`)) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (ctrl) {
        if (ctrl.tagName === 'SELECT') {
          fireEvent.change(ctrl, { target: { value: (first.enumValues?.[0] || '') as string } });
        } else {
          fireEvent.change(ctrl, { target: { value: 'X' } });
        }
        expect(lastPatch, `${type}: não emitiu patch ao editar ${first.key}`).toBeTruthy();
      }

      unmount();
    }
  });
});
