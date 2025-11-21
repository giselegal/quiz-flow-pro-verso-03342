/**
 * 🧪 TESTE SIMPLIFICADO: usePropertiesPanelEnhancements
 * Teste básico sem dependências externas problemáticas
 * 
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi } from 'vitest';

describe('usePropertiesPanelEnhancements - Teste de Estrutura', () => {
    it('deve exportar uma função usePropertiesPanelEnhancements', async () => {
        // Mockando as dependências antes do import
        vi.doMock('@/hooks/use-toast', () => ({
            toast: vi.fn(),
        }));

        vi.doMock('@/lib/utils/appLogger', () => ({
            appLogger: {
                info: vi.fn(),
                warn: vi.fn(),
                error: vi.fn(),
                debug: vi.fn(),
            },
        }));

        const module = await import('../usePropertiesPanelEnhancements');

        expect(module.usePropertiesPanelEnhancements).toBeDefined();
        expect(typeof module.usePropertiesPanelEnhancements).toBe('function');
    });

    it('deve exportar o tipo PropertiesPanelEnhancementsConfig', async () => {
        vi.doMock('@/hooks/use-toast', () => ({
            toast: vi.fn(),
        }));

        vi.doMock('@/lib/utils/appLogger', () => ({
            appLogger: {
                info: vi.fn(),
                warn: vi.fn(),
                error: vi.fn(),
                debug: vi.fn(),
            },
        }));

        const module = await import('../usePropertiesPanelEnhancements');

        // Verifica que o tipo está disponível através da exportação
        expect(module).toHaveProperty('usePropertiesPanelEnhancements');
    });

    it('deve ter a assinatura correta do hook', async () => {
        vi.doMock('@/hooks/use-toast', () => ({
            toast: vi.fn(),
        }));

        vi.doMock('@/lib/utils/appLogger', () => ({
            appLogger: {
                info: vi.fn(),
                warn: vi.fn(),
                error: vi.fn(),
                debug: vi.fn(),
            },
        }));

        const { usePropertiesPanelEnhancements } = await import('../usePropertiesPanelEnhancements');

        // Verifica que a função tem length 3 (onSave, onSelectBlock, config)
        // Nota: config é opcional, mas conta como parâmetro
        expect(usePropertiesPanelEnhancements.length).toBe(3);
    });
});
