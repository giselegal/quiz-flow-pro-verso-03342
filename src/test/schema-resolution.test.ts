import { describe, it, expect } from 'vitest';
import { blockPropertySchemas } from '@/config/blockPropertySchemas';
import { getBlockDefinition } from '@/config/funnelBlockDefinitions';

// Pequeno teste de contrato: preferir blockPropertySchemas ao invés do fallback legado
// Cobrimos alguns tipos chave referenciados nos templates e editor
const PRIMARY_TYPES = [
    'quiz-intro-header',
    'options-grid',
    'button-inline',
    'form-container',
    'form-input',
    'image-display-inline',
    'text-inline',
    'style-card-inline',
    'style-cards-grid',
    'urgency-timer-inline',
] as const;

describe('Schema resolution preference', () => {
    it('should resolve primary schemas from blockPropertySchemas for key types', () => {
        const missing: string[] = [];

        for (const type of PRIMARY_TYPES) {
            const schema = (blockPropertySchemas as any)[type];
            if (!schema) missing.push(type);
        }

        // Caso algum esteja ausente, falha indicando quais devem ser priorizados
        expect(missing, `Faltando schema canônico em blockPropertySchemas: ${missing.join(', ')}`).toEqual([]);
    });

    it('should still expose a legacy fallback function (callable without throwing)', () => {
        // O fallback não precisa retornar objeto para tipos inexistentes, mas deve ser chamável sem lançar erro
        expect(() => getBlockDefinition('non-existent-type')).not.toThrow();
    });
});
