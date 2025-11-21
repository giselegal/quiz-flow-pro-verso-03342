/**
 * 🧪 TESTES: usePropertiesPanelEnhancements
 * Validação do hook de melhorias do painel de propriedades
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePropertiesPanelEnhancements } from '../usePropertiesPanelEnhancements';

describe('usePropertiesPanelEnhancements', () => {
    let onSave: ReturnType<typeof vi.fn>;
    let onSelectBlock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        onSave = vi.fn().mockResolvedValue(undefined);
        onSelectBlock = vi.fn();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    describe('Debounced Save', () => {
        it('deve debouncer múltiplas chamadas de salvamento', async () => {
            const { result } = renderHook(() =>
                usePropertiesPanelEnhancements(onSave, onSelectBlock, {
                    debounceMs: 400,
                    enableFeedback: false,
                })
            );

            // Fazer 3 chamadas rápidas
            act(() => {
                result.current.debouncedSave('block-1', { text: 'Test 1' });
                result.current.debouncedSave('block-1', { text: 'Test 2' });
                result.current.debouncedSave('block-1', { text: 'Test 3' });
            });

            // Nenhuma chamada ainda (debounce)
            expect(onSave).not.toHaveBeenCalled();
            expect(result.current.isSaving).toBe(false);

            // Avançar tempo para disparar debounce
            act(() => {
                vi.advanceTimersByTime(400);
            });

            // Aguardar conclusão do salvamento
            await waitFor(() => {
                expect(result.current.isSaving).toBe(false);
            });

            // Deve ter sido chamado apenas 1 vez com o último valor
            expect(onSave).toHaveBeenCalledTimes(1);
            expect(onSave).toHaveBeenCalledWith('block-1', { text: 'Test 3' });
        });

        it('deve processar salvamentos de múltiplos blocos', async () => {
            const { result } = renderHook(() =>
                usePropertiesPanelEnhancements(onSave, onSelectBlock, {
                    debounceMs: 300,
                    enableFeedback: false,
                })
            );

            act(() => {
                result.current.debouncedSave('block-1', { text: 'Block 1' });
                result.current.debouncedSave('block-2', { text: 'Block 2' });
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            await waitFor(() => {
                expect(result.current.isSaving).toBe(false);
            });

            // Deve salvar ambos os blocos
            expect(onSave).toHaveBeenCalledTimes(2);
        });

        it('deve indicar estado de salvamento', async () => {
            const { result } = renderHook(() =>
                usePropertiesPanelEnhancements(onSave, onSelectBlock, {
                    debounceMs: 200,
                    enableFeedback: false,
                })
            );

            expect(result.current.isSaving).toBe(false);

            act(() => {
                result.current.debouncedSave('block-1', { text: 'Test' });
            });

            act(() => {
                vi.advanceTimersByTime(200);
            });

            // Durante o salvamento
            await waitFor(() => {
                expect(result.current.isSaving).toBe(true);
            });

            // Após conclusão
            await waitFor(() => {
                expect(result.current.isSaving).toBe(false);
            });
        });
    });

    describe('Auto-select', () => {
        it('deve selecionar primeiro bloco quando seleção é inválida', () => {
            const { result } = renderHook(() =>
                usePropertiesPanelEnhancements(onSave, onSelectBlock, {
                    enableAutoSelect: true,
                })
            );

            const blocks = [
                { id: 'block-1', type: 'text', properties: {} },
                { id: 'block-2', type: 'button', properties: {} },
            ];

            act(() => {
                const selected = result.current.autoSelectFirstBlock(blocks as any, 'invalid-id');
                expect(selected).toBe('block-1');
            });

            expect(onSelectBlock).toHaveBeenCalledWith('block-1');
        });

        it('deve manter seleção válida', () => {
            const { result } = renderHook(() =>
                usePropertiesPanelEnhancements(onSave, onSelectBlock, {
                    enableAutoSelect: true,
                })
            );

            const blocks = [
                { id: 'block-1', type: 'text', properties: {} },
                { id: 'block-2', type: 'button', properties: {} },
            ];

            act(() => {
                const selected = result.current.autoSelectFirstBlock(blocks as any, 'block-2');
                expect(selected).toBe('block-2');
            });

            expect(onSelectBlock).not.toHaveBeenCalled();
        });

        it('não deve auto-selecionar quando desabilitado', () => {
            const { result } = renderHook(() =>
                usePropertiesPanelEnhancements(onSave, onSelectBlock, {
                    enableAutoSelect: false,
                })
            );

            const blocks = [{ id: 'block-1', type: 'text', properties: {} }];

            act(() => {
                const selected = result.current.autoSelectFirstBlock(blocks as any, null);
                expect(selected).toBe(null);
            });

            expect(onSelectBlock).not.toHaveBeenCalled();
        });

        it('deve selecionar primeiro bloco quando lista vazia de seleção', () => {
            const { result } = renderHook(() =>
                usePropertiesPanelEnhancements(onSave, onSelectBlock, {
                    enableAutoSelect: true,
                })
            );

            const blocks = [
                { id: 'block-1', type: 'text', properties: {} },
            ];

            act(() => {
                const selected = result.current.autoSelectFirstBlock(blocks as any, null);
                expect(selected).toBe('block-1');
            });

            expect(onSelectBlock).toHaveBeenCalledWith('block-1');
        });
    });

    describe('Clear Selection', () => {
        it('deve limpar seleção', () => {
            const { result } = renderHook(() =>
                usePropertiesPanelEnhancements(onSave, onSelectBlock)
            );

            act(() => {
                result.current.clearSelection();
            });

            expect(onSelectBlock).toHaveBeenCalledWith(null);
        });
    });

    describe('Error Handling', () => {
        it('deve lidar com erros de salvamento', async () => {
            const errorOnSave = vi.fn().mockRejectedValue(new Error('Save failed'));

            const { result } = renderHook(() =>
                usePropertiesPanelEnhancements(errorOnSave, onSelectBlock, {
                    debounceMs: 100,
                    enableFeedback: false,
                })
            );

            act(() => {
                result.current.debouncedSave('block-1', { text: 'Test' });
            });

            act(() => {
                vi.advanceTimersByTime(100);
            });

            // Deve retornar ao estado não-salvando após erro
            await waitFor(() => {
                expect(result.current.isSaving).toBe(false);
            });

            expect(errorOnSave).toHaveBeenCalledTimes(1);
        });
    });

    describe('Configuration', () => {
        it('deve usar configuração padrão', () => {
            const { result } = renderHook(() =>
                usePropertiesPanelEnhancements(onSave, onSelectBlock)
            );

            expect(result.current.isSaving).toBe(false);
            expect(typeof result.current.debouncedSave).toBe('function');
            expect(typeof result.current.autoSelectFirstBlock).toBe('function');
            expect(typeof result.current.clearSelection).toBe('function');
        });

        it('deve respeitar debounceMs customizado', async () => {
            const { result } = renderHook(() =>
                usePropertiesPanelEnhancements(onSave, onSelectBlock, {
                    debounceMs: 500,
                    enableFeedback: false,
                })
            );

            act(() => {
                result.current.debouncedSave('block-1', { text: 'Test' });
            });

            // Não deve disparar antes de 500ms
            act(() => {
                vi.advanceTimersByTime(400);
            });

            expect(onSave).not.toHaveBeenCalled();

            // Deve disparar após 500ms
            act(() => {
                vi.advanceTimersByTime(100);
            });

            await waitFor(() => {
                expect(onSave).toHaveBeenCalled();
            });
        });
    });

    describe('Cleanup', () => {
        it('deve limpar timeouts ao desmontar', () => {
            const { result, unmount } = renderHook(() =>
                usePropertiesPanelEnhancements(onSave, onSelectBlock, {
                    debounceMs: 500,
                    enableFeedback: false,
                })
            );

            act(() => {
                result.current.debouncedSave('block-1', { text: 'Test' });
            });

            unmount();

            // Avançar tempo após unmount
            act(() => {
                vi.advanceTimersByTime(500);
            });

            // Não deve disparar callback após unmount
            expect(onSave).not.toHaveBeenCalled();
        });
    });
});
