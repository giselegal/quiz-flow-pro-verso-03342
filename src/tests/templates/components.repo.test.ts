import { describe, it, expect, beforeEach } from 'vitest';
import { createHeader, createQuestionMulti, ComponentKind, validateComponent } from '../../../server/templates/components';
import { saveComponent, listComponents, getComponent, clearAllComponents, countComponents, deleteComponent } from '../../../server/templates/components.repo';

describe('components repo', () => {
    beforeEach(() => {
        clearAllComponents();
    });

    it('cria e lista componentes', () => {
        const h = createHeader({ title: 'Título' });
        const q = createQuestionMulti({ title: 'Pergunta', options: [{ id: 'o1', label: 'Opção 1' }, { id: 'o2', label: 'Opção 2' }], maxSelections: 2 });
        saveComponent(h);
        saveComponent(q);
        const all = listComponents();
        expect(all.length).toBe(2);
        expect(countComponents()).toBe(2);
    });

    it('filtra por kind e recupera individual', () => {
        const h = createHeader({ title: 'Header A' });
        saveComponent(h);
        const filtered = listComponents({ kinds: [ComponentKind.Header] });
        expect(filtered.length).toBe(1);
        const same = getComponent(h.id);
        expect(same?.id).toBe(h.id);
    });

    it('deleta componente e validações básicas', () => {
        const q = createQuestionMulti({ title: 'Q', options: [{ id: 'x', label: 'X' }, { id: 'y', label: 'Y' }], maxSelections: 1 }); // maxSelections warning
        saveComponent(q);
        const issues = validateComponent(q);
        expect(issues.find(i => i.severity === 'warning')).toBeDefined();
        const ok = deleteComponent(q.id);
        expect(ok).toBe(true);
        expect(getComponent(q.id)).toBeUndefined();
    });
});
