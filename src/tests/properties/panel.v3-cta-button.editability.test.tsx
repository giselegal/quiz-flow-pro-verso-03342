import { describe, it, expect, beforeAll } from 'vitest';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import DynamicPropertiesForm from '@/components/editor/quiz/components/DynamicPropertiesForm';
import { initializeSchemaRegistry, SchemaAPI } from '@/config/schemas';

const CTA_KEYS = [
    'text', // via buttonTextField
    'url',  // via buttonUrlField
    'label',
    'href',
    'icon',
    'iconAnimation',
    'style',
    'colorsFrom',
    'colorsTo',
    'size',
    'fullWidth', // base
    'fullWidthMobile',
    'position',
    'showTransition',
    'transitionTitle',
    'transitionSubtitle',
    'transitionBackground',
    'transitionBorder',
    'analyticsEventName',
    'analyticsCategory',
    'analyticsLabel',
] as const;

describe('Properties Panel - CTAButton (v3) editability', () => {
    beforeAll(() => initializeSchemaRegistry());

    it('renderiza campos do CTAButton e emite patch ao editar', async () => {
        const type = 'CTAButton';
        const schema = await SchemaAPI.get(type);
        if (!schema) {
            throw new Error('Schema CTAButton não encontrado');
        }

        const values: Record<string, any> = {};
        CTA_KEYS.forEach((k) => { values[k] = undefined; });

        let lastPatch: Record<string, any> | null = null;
        render(<DynamicPropertiesForm type={type} values={values} onChange={(p) => { lastPatch = p; }} />);

        // aguarda montar algum controle básico
        const first = (schema.properties || []).find((p: any) => ['string', 'text', 'richtext', 'number', 'boolean', 'select', 'enum'].includes(p.type));
        if (first) {
            await waitFor(() => {
                const exists = !!document.querySelector(`[name="${first.key}"]`) || !!document.querySelector(`#${CSS.escape(first.key)}`) || !!document.querySelector(`label[for="${CSS.escape(first.key)}"]`);
                if (!exists) throw new Error('esperando montar CTA');
            });
        }

        const failures: string[] = [];

        for (const key of CTA_KEYS) {
            const prop = (schema.properties || []).find((p: any) => p.key === key);
            if (!prop) {
                failures.push(`prop ausente no schema: ${key}`);
                continue;
            }

            // encontrar um controle vinculado
            let control: Element | null = document.querySelector(`[name="${key}"]`);
            if (!control) control = document.querySelector(`#${CSS.escape(key)}`);

            if (!control) {
                // aceita label para inputs customizados
                const hasLabel = !!document.querySelector(`label[for="${CSS.escape(key)}"]`);
                if (!hasLabel) failures.push(`controle não encontrado para ${key}`);
                continue;
            }

            const el = control as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            if (el.tagName === 'SELECT' || prop.type === 'select' || prop.type === 'enum') {
                fireEvent.change(el as HTMLSelectElement, { target: { value: (prop.enumValues?.[0] || '') as string } });
            } else if (prop.type === 'boolean') {
                fireEvent.click(el as HTMLInputElement);
            } else {
                fireEvent.change(el as HTMLInputElement, { target: { value: 'X' } });
            }

            expect(lastPatch, `não emitiu patch ao editar ${key}`).toBeTruthy();
            expect(Object.prototype.hasOwnProperty.call(lastPatch!, key), `patch não contém ${key}`).toBe(true);
        }

        expect(failures, failures.join('\n')).toEqual([]);
    });
});
