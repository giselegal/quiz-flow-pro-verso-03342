import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DynamicPropertiesForm from '@/components/editor/quiz/components/DynamicPropertiesForm';
import { initializeSchemaRegistry, SchemaAPI } from '@/config/schemas';
import React from 'react';

interface Section { type: string; id?: string; content?: Record<string, any>; style?: Record<string, any>; }

function readV3Sections(): Section[] {
    const dir = path.resolve(__dirname, '../../../public/templates');
    const files = fs.readdirSync(dir).filter(f => /step-\d{2}-v3\.json$/.test(f));
    const sections: Section[] = [];
    for (const file of files) {
        const json = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
        const list = Array.isArray(json.sections) ? json.sections : [];
        list.forEach((s: any) => sections.push(s as Section));
    }
    return sections;
}

function uniqueTypes(sections: Section[]): string[] {
    return Array.from(new Set(sections.map(s => s.type))).sort();
}

function collectUsedContentKeysByType(sections: Section[]): Record<string, Set<string>> {
    const map: Record<string, Set<string>> = {};
    for (const s of sections) {
        const keys = s.content && typeof s.content === 'object' ? Object.keys(s.content) : [];
        if (!map[s.type]) map[s.type] = new Set();
        keys.forEach(k => map[s.type].add(k));
    }
    return map;
}

// Tipos complexos do v3 (props/sections) que não vamos validar UI detalhada agora
const COMPLEX_V3_SECTION_TYPES = new Set([
    'HeroSection',
    'StyleProfileSection',
    'ResultCalculationSection',
    'MethodStepsSection',
    'BonusSection',
    'SocialProofSection',
    'OfferSection',
    'GuaranteeSection',
    'TransformationSection',
]);

// Tipos de campos que não renderizam input simples no DynamicPropertiesForm
const NON_BASIC_FIELD_TYPES = new Set(['object', 'json', 'array']);

function isImageFieldKey(key: string) {
    return key === 'imageUrl' || key === 'imageAlt' || key === 'logoUrl' || key === 'logoAlt';
}

function findSchemaProp(schema: any, key: string) {
    return (schema?.properties || []).find((p: any) => p.key === key);
}

describe('Properties Panel v3 - Editabilidade prática', () => {
    let sections: Section[];
    let usedByType: Record<string, Set<string>>;
    let types: string[];

    beforeAll(() => {
        initializeSchemaRegistry();
        sections = readV3Sections();
        usedByType = collectUsedContentKeysByType(sections);
        types = uniqueTypes(sections);
    });

    it('renderiza campos de content do v3 e emite patch ao editar (amostragem por tipo)', async () => {
        const failures: string[] = [];

        for (const type of types) {
            // Pular sections complexas do v3 (terão suíte dedicada)
            if (COMPLEX_V3_SECTION_TYPES.has(type)) continue;

            const schema = await SchemaAPI.get(type);
            if (!schema) {
                failures.push(`${type}: schema não encontrado`);
                continue;
            }

            const usedKeys = Array.from(usedByType[type] || []);
            if (usedKeys.length === 0) continue; // nada a validar

            // Valores iniciais para o formulário
            const initialValues: Record<string, any> = {};
            for (const k of usedKeys) initialValues[k] = undefined;

            let lastPatch: Record<string, any> | null = null;
            const onChange = (patch: Record<string, any>) => { lastPatch = patch; };

            const { unmount } = render(
                <DynamicPropertiesForm type={type} values={initialValues} onChange={onChange} />
            );

            // Aguarda o lazy-load do schema moderno refletir no formulário
            const firstBasicProp = (schema.properties || []).find((p: any) => !NON_BASIC_FIELD_TYPES.has(p.type) || p.type === 'options-list');
            if (firstBasicProp) {
                await waitFor(() => {
                    const existsByName = !!document.querySelector(`[name="${firstBasicProp.key}"]`);
                    const existsById = !!document.querySelector(`#${CSS.escape(firstBasicProp.key)}`);
                    const existsByLabel = !!document.querySelector(`label[for="${CSS.escape(firstBasicProp.key)}"]`);
                    // Para options-list, valida por botão de adicionar item
                    const existsOptions = firstBasicProp.type === 'options-list' && !!screen.queryByRole('button', { name: /Adicionar item/i });
                    if (!existsByName && !existsById && !existsByLabel && !existsOptions) throw new Error('waiting schema mount');
                });
            }

            for (const key of usedKeys) {
                const prop = findSchemaProp(schema, key);
                if (!prop) {
                    failures.push(`${type}: prop ausente no schema -> ${key}`);
                    continue;
                }
                if (NON_BASIC_FIELD_TYPES.has(prop.type) && prop.type !== 'options-list') {
                    // pular campos complexos (ex.: pricing object)
                    continue;
                }

                // Deve existir um controle com name=key; fallback para id=key ou label[for=key] para editores customizados
                let control: Element | null = document.querySelector(`[name="${key}"]`);
                if (!control) control = document.querySelector(`#${CSS.escape(key)}`);
                const label = document.querySelector(`label[for="${CSS.escape(key)}"]`);
                if (!control) {
                    if (prop.type === 'options-list') {
                        const addBtn = screen.queryByRole('button', { name: /Adicionar item/i });
                        if (!addBtn) failures.push(`${type}: campo options-list não renderizado -> ${key}`);
                        continue;
                    }
                    // Campos de imagem e outros componetes customizados podem não expor input diretamente; aceite a existência do label
                    if (isImageFieldKey(key) && label) {
                        // presente, porém UI custom com uploader; não vamos simular patch aqui
                        continue;
                    }
                    failures.push(`${type}: controle não encontrado para key=${key}`);
                    continue;
                }

                // Simular edição conforme tipo
                const nextStr = 'TESTE';
                if (prop.type === 'string' || (prop as any).type === 'text' || prop.type === 'richtext') {
                    const input = control as HTMLInputElement | HTMLTextAreaElement | null;
                    if (input) {
                        fireEvent.change(input, { target: { value: nextStr } });
                        expect(lastPatch).toBeTruthy();
                        expect(Object.prototype.hasOwnProperty.call(lastPatch!, key)).toBe(true);
                    }
                } else if (prop.type === 'number') {
                    const input = control as HTMLInputElement | null;
                    if (input) {
                        fireEvent.change(input, { target: { value: '123' } });
                        expect(lastPatch).toBeTruthy();
                        expect(Object.prototype.hasOwnProperty.call(lastPatch!, key)).toBe(true);
                    }
                } else if (prop.type === 'boolean') {
                    const input = control as HTMLInputElement | null;
                    if (input) {
                        fireEvent.click(input);
                        expect(lastPatch).toBeTruthy();
                        expect(Object.prototype.hasOwnProperty.call(lastPatch!, key)).toBe(true);
                    }
                } else if (prop.type === 'select' || prop.type === 'enum') {
                    const select = control as HTMLSelectElement | null;
                    if (select) {
                        fireEvent.change(select, { target: { value: (prop.enumValues || [])[0] || '' } });
                        expect(lastPatch).toBeTruthy();
                        expect(Object.prototype.hasOwnProperty.call(lastPatch!, key)).toBe(true);
                    }
                } else if (prop.type === 'options-list') {
                    // Já validado acima que o editor foi renderizado
                }
            }

            unmount();
        }

        expect(failures, failures.join('\n')).toEqual([]);
    });
});
