import { describe, it, expect } from 'vitest';
import {
    CanonicalStepSchema,
    CanonicalQuizDefinitionSchema
} from './schemas';

// Helpers para criar variantes mínimas válidas
const intro = (id: string, next: string) => ({ id, type: 'intro', title: 'Intro', next });
const question = (id: string, next: string) => ({
    id,
    type: 'question',
    questionText: 'Pergunta',
    requiredSelections: 1,
    options: [
        { id: id + '-opt1', text: 'Opção 1' },
        { id: id + '-opt2', text: 'Opção 2' }
    ],
    next
});
const strategic = (id: string, next: string) => ({
    id,
    type: 'strategic-question',
    questionText: 'Estratégica',
    options: [
        { id: id + '-opt1', text: 'A' },
        { id: id + '-opt2', text: 'B' }
    ],
    next
});
const transition = (id: string, next: string) => ({ id, type: 'transition', title: 'Transição', next });
const transitionResult = (id: string, next: string) => ({ id, type: 'transition-result', title: 'Transição Resultado', next });
const result = (id: string, next: string) => ({ id, type: 'result', title: 'Resultado', next });
const offer = (id: string) => ({
    id,
    type: 'offer',
    variants: [
        {
            matchValue: 'any',
            title: 'Oferta',
            description: 'Desc',
            buttonText: 'Comprar',
            testimonial: { quote: 'Ótimo', author: 'Cliente' }
        }
    ]
});

describe('CanonicalStepSchema variants', () => {
    it('valida intro', () => {
        expect(CanonicalStepSchema.safeParse(intro('intro-1', 'q-1')).success).toBe(true);
    });
    it('valida question', () => {
        expect(CanonicalStepSchema.safeParse(question('q-1', 'sq-1')).success).toBe(true);
    });
    it('valida strategic-question', () => {
        expect(CanonicalStepSchema.safeParse(strategic('sq-1', 'tr-1')).success).toBe(true);
    });
    it('valida transition', () => {
        expect(CanonicalStepSchema.safeParse(transition('tr-1', 'trr-1')).success).toBe(true);
    });
    it('valida transition-result', () => {
        expect(CanonicalStepSchema.safeParse(transitionResult('trr-1', 'res-1')).success).toBe(true);
    });
    it('valida result', () => {
        expect(CanonicalStepSchema.safeParse(result('res-1', 'offer-1')).success).toBe(true);
    });
    it('valida offer', () => {
        expect(CanonicalStepSchema.safeParse(offer('offer-1')).success).toBe(true);
    });
    it('rejeita type inválido', () => {
        const invalid: any = { id: 'x-1', type: 'foo', title: 'X' };
        expect(CanonicalStepSchema.safeParse(invalid).success).toBe(false);
    });
});

describe('CanonicalQuizDefinitionSchema', () => {
    it('valida definição completa com todas variantes', () => {
        const steps = [
            intro('intro-1', 'q-1'),
            question('q-1', 'sq-1'),
            strategic('sq-1', 'tr-1'),
            transition('tr-1', 'trr-1'),
            transitionResult('trr-1', 'res-1'),
            result('res-1', 'offer-1'),
            offer('offer-1')
        ];

        const definition = {
            version: '1.0',
            hash: 'abcd1234',
            steps,
            offerMapping: { strategicFinalStepId: 'sq-1' },
            progress: { countedStepIds: steps.filter(s => s.type !== 'intro').map(s => s.id) }
        };

        const parsed = CanonicalQuizDefinitionSchema.safeParse(definition);
        if (!parsed.success) {
            console.error(parsed.error.format());
        }
        expect(parsed.success).toBe(true);
    });

    it('falha quando next referencia step inexistente', () => {
        const steps = [intro('intro-1', 'missing')];
        const definition = {
            version: '1.0',
            hash: 'abcd1234',
            steps,
            offerMapping: { strategicFinalStepId: 'intro-1' },
            progress: { countedStepIds: ['intro-1'] }
        };
        const parsed = CanonicalQuizDefinitionSchema.safeParse(definition);
        expect(parsed.success).toBe(false);
    });
});
