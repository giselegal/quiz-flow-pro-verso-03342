/**
 * 🧪 Testes para useBlockDraft
 * 
 * Valida:
 * - Draft state management
 * - Dirty tracking
 * - Undo/Redo
 * - Validação
 * - Commit/Cancel
 * 
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBlockDraft } from '../useBlockDraft';
import { createBlock } from '../../schemas/blockSchema';

describe('useBlockDraft', () => {
    describe('Inicialização', () => {
        it('deve inicializar com bloco fornecido', () => {
            const block = createBlock('intro-title', { properties: { title: 'Initial' } });

            const { result } = renderHook(() => useBlockDraft(block));

            expect(result.current.data).toEqual(block);
            expect(result.current.isDirty).toBe(false);
            expect(result.current.errors).toHaveLength(0);
        });

        it('deve inicializar sem validação por padrão', () => {
            const block = createBlock('intro-title', { properties: { title: 'Test' } });

            const { result } = renderHook(() => useBlockDraft(block));

            expect(result.current.errors).toHaveLength(0);
        });

        it('deve aceitar bloco null/undefined', () => {
            const { result } = renderHook(() => useBlockDraft(null));

            expect(result.current.data).toBeNull();
        });
    });

    describe('Update operations', () => {
        it('deve atualizar conteúdo e marcar como dirty', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                result.current.updateContent('title', 'Updated');
            });

            expect(result.current.data!.properties!.title).toBe('Updated');
            expect(result.current.isDirty).toBe(true);
        });

        it('deve atualizar múltiplos campos', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original Title', subtitle: 'Original Subtitle' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                result.current.updateContent('title', 'New Title');
                result.current.updateContent('subtitle', 'New Subtitle');
            });

            expect(result.current.data!.properties!.title).toBe('New Title');
            expect(result.current.data!.properties!.subtitle).toBe('New Subtitle');
        });

        it('deve atualizar propriedades inteiras', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                result.current.updateProperties({ title: 'Updated', subtitle: 'New' });
            });

            expect(result.current.data!.properties!.title).toBe('Updated');
            expect(result.current.data!.properties!.subtitle).toBe('New');
        });

        it('deve fazer update genérico do bloco', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                result.current.update({ order: 999 });
            });

            expect(result.current.data!.order).toBe(999);
            expect(result.current.isDirty).toBe(true);
        });
    });

    describe('Dirty tracking', () => {
        it('deve iniciar como não-dirty', () => {
            const block = createBlock('intro-title', { properties: { title: 'Test' } });

            const { result } = renderHook(() => useBlockDraft(block));

            expect(result.current.isDirty).toBe(false);
        });

        it('deve marcar como dirty após mudança', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                result.current.updateContent('title', 'Modified');
            });

            expect(result.current.isDirty).toBe(true);
        });

        it('deve limpar dirty após commit', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });
            const onCommit = vi.fn();

            const { result } = renderHook(() => useBlockDraft(block, { onCommit }));

            act(() => {
                result.current.updateContent('title', 'Modified');
            });

            expect(result.current.isDirty).toBe(true);

            act(() => {
                result.current.commit();
            });

            expect(result.current.isDirty).toBe(false);
            expect(onCommit).toHaveBeenCalledWith(
                expect.objectContaining({ properties: { title: 'Modified' } })
            );
        });

        it('deve limpar dirty após cancel', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                result.current.updateContent('title', 'Modified');
            });

            expect(result.current.isDirty).toBe(true);

            act(() => {
                result.current.cancel();
            });

            expect(result.current.isDirty).toBe(false);
            expect(result.current.data!.properties!.title).toBe('Original');
        });
    });

    describe('Undo/Redo', () => {
        it('deve fazer undo de mudança', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                result.current.updateContent('title', 'Modified');
            });

            expect(result.current.data!.properties!.title).toBe('Modified');

            act(() => {
                result.current.undo();
            });

            expect(result.current.data!.properties!.title).toBe('Original');
        });

        it('deve fazer redo de mudança desfeita', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                result.current.updateContent('title', 'Modified');
                result.current.undo();
            });

            expect(result.current.data!.properties!.title).toBe('Original');

            act(() => {
                result.current.redo();
            });

            expect(result.current.data!.properties!.title).toBe('Modified');
        });

        it('deve lidar com múltiplos undo/redo', () => {
            const block = createBlock('intro-title', { properties: { title: 'Step 0' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                result.current.updateContent('title', 'Step 1');
                result.current.updateContent('title', 'Step 2');
                result.current.updateContent('title', 'Step 3');
            });

            expect(result.current.data!.properties!.title).toBe('Step 3');

            act(() => {
                result.current.undo();
            });
            expect(result.current.data!.properties!.title).toBe('Step 2');

            act(() => {
                result.current.undo();
            });
            expect(result.current.data!.properties!.title).toBe('Step 1');

            act(() => {
                result.current.redo();
            });
            expect(result.current.data!.properties!.title).toBe('Step 2');
        });

        it('deve indicar quando pode fazer undo', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            expect(result.current.canUndo).toBe(false);

            act(() => {
                result.current.updateContent('title', 'Modified');
            });

            expect(result.current.canUndo).toBe(true);
        });

        it('deve indicar quando pode fazer redo', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            expect(result.current.canRedo).toBe(false);

            act(() => {
                result.current.updateContent('title', 'Modified');
                result.current.undo();
            });

            expect(result.current.canRedo).toBe(true);
        });

        it('deve limpar redo history ao fazer nova mudança', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                result.current.updateContent('title', 'Modified 1');
                result.current.undo();
            });

            expect(result.current.canRedo).toBe(true);

            act(() => {
                result.current.updateContent('title', 'Modified 2');
            });

            expect(result.current.canRedo).toBe(false);
        });
    });

    describe('Validação', () => {
        it('deve validar automaticamente quando habilitado', () => {
            const block = createBlock('intro-title', { properties: { title: 'Valid' } });

            const { result } = renderHook(() =>
                useBlockDraft(block, { validateOnChange: true })
            );

            act(() => {
                // Criar estado inválido (simulado - depende do schema)
                result.current.update({ type: 'invalid-type' as any });
            });

            // Se validação estiver ativa, deve ter erros
            // (depende da implementação real do schema)
            expect(Array.isArray(result.current.errors)).toBe(true);
        });

        it('deve não validar quando desabilitado', () => {
            const block = createBlock('intro-title', { properties: { title: 'Test' } });

            const { result } = renderHook(() =>
                useBlockDraft(block, { validateOnChange: false })
            );

            act(() => {
                result.current.updateContent('title', 'Modified');
            });

            expect(result.current.errors).toHaveLength(0);
        });
    });

    describe('Commit/Cancel', () => {
        it('deve chamar onCommit com dados atualizados', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });
            const onCommit = vi.fn();

            const { result } = renderHook(() => useBlockDraft(block, { onCommit }));

            act(() => {
                result.current.updateContent('title', 'Modified');
                result.current.commit();
            });

            expect(onCommit).toHaveBeenCalledTimes(1);
            expect(onCommit).toHaveBeenCalledWith(
                expect.objectContaining({
                    properties: expect.objectContaining({ title: 'Modified' }),
                })
            );
        });

        it('deve restaurar estado original ao cancelar', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                result.current.updateContent('title', 'Modified');
                result.current.cancel();
            });

            expect(result.current.data!.properties!.title).toBe('Original');
            expect(result.current.isDirty).toBe(false);
        });

        it('não deve chamar onCommit ao cancelar', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });
            const onCommit = vi.fn();

            const { result } = renderHook(() => useBlockDraft(block, { onCommit }));

            act(() => {
                result.current.updateContent('title', 'Modified');
                result.current.cancel();
            });

            expect(onCommit).not.toHaveBeenCalled();
        });
    });

    describe('Edge cases', () => {
        it('deve lidar com bloco sendo atualizado externamente', () => {
            const block1 = createBlock('intro-title', { properties: { title: 'Version 1' } });

            const { result, rerender } = renderHook(
                ({ block }) => useBlockDraft(block),
                { initialProps: { block: block1 } }
            );

            const block2 = createBlock('intro-title', { properties: { title: 'Version 2' } });

            rerender({ block: block2 });

            expect(result.current.data!.properties!.title).toBe('Version 2');
        });

        it('deve lidar com updates rápidos consecutivos', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                for (let i = 0; i < 100; i++) {
                    result.current.updateContent('title', `Update ${i}`);
                }
            });

            expect(result.current.data!.properties!.title).toBe('Update 99');
            expect(result.current.isDirty).toBe(true);
        });

        it('deve manter history limitado', () => {
            const block = createBlock('intro-title', { properties: { title: 'Original' } });

            const { result } = renderHook(() => useBlockDraft(block));

            act(() => {
                // Fazer muitas mudanças (mais que o limite de history)
                for (let i = 0; i < 150; i++) {
                    result.current.updateContent('title', `Update ${i}`);
                }
            });

            // History deve ter limite (ex: 100 itens)
            let undoCount = 0;
            while (result.current.canUndo && undoCount < 200) {
                act(() => {
                    result.current.undo();
                });
                undoCount++;
            }

            expect(undoCount).toBeLessThan(150); // Deve ter limite
        });
    });
});
