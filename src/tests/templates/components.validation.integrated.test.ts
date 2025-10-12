import { describe, it, expect } from 'vitest';
import { validateTemplate } from '@/../server/templates/validation';
import { ComponentKind } from '@/../server/templates/components';
import { TemplateAggregate } from '@/../server/templates/models';

// Cria draft mínimo com componente tipado inválido (QuestionSingle com <2 options)

describe('template validation integra componentes', () => {
    it('reporta issues de componente tipado', () => {
        const draft: any = {
            id: 'tpl_test',
            schemaVersion: '1.0.1-components',
            meta: { name: 'Teste', slug: 'teste', description: '', tags: [], seo: {}, tracking: {} },
            stages: [{ id: 'stage_1', type: 'result', order: 0, enabled: true, componentIds: ['cmp_1'], meta: {} }],
            components: {
                cmp_1: {
                    id: 'cmp_1',
                    kind: ComponentKind.QuestionSingle,
                    version: '1.0.0',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    props: { title: 'Pergunta inválida', options: [{ id: 'o1', label: 'Só uma' }] }
                }
            },
            logic: { scoring: { mode: 'sum', weights: {}, normalization: { percent: true } }, branching: [] },
            outcomes: [{ id: 'out', minScore: 0, maxScore: 10, template: 'X' }],
            status: 'draft', history: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), draftVersion: 1
        };
        const aggregate: TemplateAggregate = { draft } as any;
        const report = validateTemplate(aggregate);
        expect(report.errors.find(e => e.code.startsWith('COMP_QuestionSingle'))).toBeDefined();
    });
});
