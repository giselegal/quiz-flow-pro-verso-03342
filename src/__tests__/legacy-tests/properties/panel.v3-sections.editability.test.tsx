import { describe, it, expect, beforeAll } from 'vitest';
import { render, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import DynamicPropertiesForm from '@/components/editor/quiz/components/DynamicPropertiesForm';
import { initializeSchemaRegistry, SchemaAPI } from '@/config/schemas';

const SECTION_TYPES = [
    'HeroSection',
    'StyleProfileSection',
    'ResultCalculationSection',
    'MethodStepsSection',
    'BonusSection',
    'SocialProofSection',
    'OfferSection',
    'GuaranteeSection',
    'TransformationSection',
];

describe('Properties Panel v3 - Sections complexas (sanity)', () => {
    beforeAll(() => initializeSchemaRegistry());

    it('monta formulário e emite patch para ao menos 1 campo por seção', async () => {
        const failures: string[] = [];

        for (const type of SECTION_TYPES) {
            const schema = await SchemaAPI.get(type);
            expect(schema, `${type}: schema não encontrado`).toBeTruthy();
            const props = (schema?.properties || []).filter((p: any) => !['object', 'array', 'json'].includes(p.type));
            if (props.length === 0) continue;

            const values: Record<string, any> = {};
            props.forEach((p: any) => { values[p.key] = undefined; });

            let lastPatch: Record<string, any> | null = null;
            const { unmount } = render(
                <DynamicPropertiesForm type={type} values={values} onChange={(patch) => { lastPatch = patch; }} />,
            );

            const first = props[0];
            await waitFor(() => {
                const exists = !!document.querySelector(`[name="${first.key}"]`) || !!document.querySelector(`#${CSS.escape(first.key)}`) || !!document.querySelector(`label[for="${CSS.escape(first.key)}"]`);
                if (!exists) throw new Error('esperando montar');
            });

            const ctrl = (document.querySelector(`[name="${first.key}"]`) || document.querySelector(`#${CSS.escape(first.key)}`)) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
            if (ctrl) {
                const isCheckbox = (ctrl as HTMLInputElement).type === 'checkbox' || first.type === 'boolean';
                if (ctrl.tagName === 'SELECT' || first.type === 'select' || first.type === 'enum') {
                    fireEvent.change(ctrl as HTMLSelectElement, { target: { value: (first.enumValues?.[0] || '') as string } });
                } else if (isCheckbox) {
                    fireEvent.click(ctrl as HTMLInputElement);
                } else {
                    fireEvent.change(ctrl as HTMLInputElement, { target: { value: 'X' } });
                }
                expect(lastPatch, `${type}: não emitiu patch ao editar ${first.key}`).toBeTruthy();
            }

            unmount();
        }

        expect(failures, failures.join('\n')).toEqual([]);
    });
});
