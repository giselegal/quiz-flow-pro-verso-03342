import { validateNextStep, validateCompleteFunnel } from '@/utils/quizValidationUtils';
import type { QuizStep } from '@/data/quizSteps';

describe('validateNextStep (dinâmico / normalização)', () => {
    function mk(step: Partial<QuizStep> & { id: string }): QuizStep & { id: string } {
        return {
            type: 'question',
            options: [{ id: 'opt1', text: 'Opção 1', image: 'x.png' }, { id: 'opt2', text: 'Opção 2', image: 'y.png' }, { id: 'opt3', text: 'Opção 3', image: 'y.png' }, { id: 'opt4', text: 'Opção 4', image: 'y.png' }, { id: 'opt5', text: 'Opção 5', image: 'y.png' }, { id: 'opt6', text: 'Opção 6', image: 'y.png' }, { id: 'opt7', text: 'Opção 7', image: 'y.png' }, { id: 'opt8', text: 'Opção 8', image: 'y.png' }],
            nextStep: undefined,
            ...step
        } as any;
    }

    it('aceita última etapa sem nextStep com 20 etapas', () => {
        const steps: Record<string, QuizStep> = {} as any;
        for (let i = 1; i <= 20; i++) {
            const id = `step-${String(i).padStart(2, '0')}`;
            steps[id] = mk({ id, nextStep: i < 20 ? `step-${String(i + 1).padStart(2, '0')}` : undefined });
        }
        const result = validateCompleteFunnel(steps);
        expect(result.errors.filter(e => e.field === 'nextStep').length).toBe(0);
        expect(result.isValid).toBe(true);
    });

    it('normaliza ids numéricos 0..19 e valida com sucesso', () => {
        const steps: Record<string, QuizStep> = {} as any;
        for (let n = 0; n < 20; n++) {
            const id = String(n); // ids numéricos incorretos
            steps[id] = mk({ id, nextStep: n < 19 ? String(n + 1) : undefined });
        }
        const result = validateCompleteFunnel(steps);
        // Deve gerar warning de normalização
        expect(result.warnings.some(w => w.message.includes('normalizados'))).toBe(true);
        // Não deve gerar erros de nextStep inexistente após normalização
        expect(result.errors.filter(e => e.field === 'nextStep').length).toBe(0);
    });

    it('detecta nextStep inexistente após normalização', () => {
        const steps: Record<string, QuizStep> = {} as any;
        for (let n = 0; n < 20; n++) {
            const id = String(n);
            // quebrar chain no meio
            const next = n === 5 ? '999' : (n < 19 ? String(n + 1) : undefined);
            steps[id] = mk({ id, nextStep: next });
        }
        const result = validateCompleteFunnel(steps);
        const missingErrors = result.errors.filter(e => e.field === 'nextStep');
        expect(missingErrors.length).toBeGreaterThan(0);
        // Mensagem deve citar 999
        expect(missingErrors[0].message).toContain('999');
    });
});
