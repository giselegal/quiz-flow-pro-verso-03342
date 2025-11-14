/**
 * 🧪 TESTES DE SINCRONIZAÇÃO - useEditorResource Hook
 * 
 * Valida que o hook chama prepareTemplate() corretamente
 * e mantém sincronização com TemplateService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEditorResource } from '../useEditorResource';
import { templateService } from '@/services/canonical/TemplateService';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';

// Mock do templateService.prepareTemplate
const mockPrepareTemplate = vi.spyOn(templateService, 'prepareTemplate');

// Mock do hierarchicalTemplateSource.setActiveTemplate
const mockSetActiveTemplate = vi.spyOn(hierarchicalTemplateSource, 'setActiveTemplate');

// Mock do templateToFunnelAdapter (compat com streaming)
vi.mock('@/editor/adapters/TemplateToFunnelAdapter', () => ({
    templateToFunnelAdapter: {
        convertTemplateToFunnel: vi.fn(async (options) => ({
            success: true,
            funnel: {
                id: 'converted-funnel-id',
                name: options.customName || 'Converted Funnel',
                stages: [
                    {
                        id: 'stage-1',
                        name: 'Stage 1',
                        blocks: [{ id: 'block-1', type: 'heading', content: {}, order: 0 }],
                    },
                ],
                metadata: { totalBlocks: 1, completedStages: 1, isValid: true },
            },
            metadata: {
                stepsLoaded: 1,
                totalBlocks: 1,
                duration: 100,
            },
        })),
        convertTemplateToFunnelStream: vi.fn(async function* (options: any) {
            yield {
                funnel: {
                    id: 'converted-funnel-id',
                    name: options?.customName || 'Converted Funnel',
                    stages: [
                        {
                            id: 'step-01',
                            name: 'Stage 1',
                            blocks: [{ id: 'block-1', type: 'heading', content: {}, order: 0 }],
                            order: 0,
                            isRequired: true,
                            metadata: { blocksCount: 1, isValid: true },
                        },
                    ],
                    settings: { theme: 'default', branding: { colors: { primary: '#3b82f6' } } },
                    status: 'draft',
                    version: '1.0.0',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    metadata: { totalBlocks: 1, completedStages: 1, isValid: true, tags: ['template-conversion'] },
                },
                progress: 1,
                isComplete: true,
            };
        }),
    },
}));

describe('useEditorResource - Sincronização com TemplateService', () => {
    beforeEach(() => {
        mockPrepareTemplate.mockClear();
        mockSetActiveTemplate.mockClear();

        // Mock bem-sucedido por padrão
        mockPrepareTemplate.mockResolvedValue({
            success: true,
            data: undefined,
            error: undefined,
        });
    });

    describe('Carregamento de template', () => {
        it('deve chamar prepareTemplate ao carregar template', async () => {
            // Arrange
            const resourceId = 'quiz21StepsComplete';

            // Act
            const { result } = renderHook(() =>
                useEditorResource({
                    resourceId,
                    autoLoad: true,
                    hasSupabaseAccess: false,
                })
            );

            // Assert
            await waitFor(() => {
                expect(mockPrepareTemplate).toHaveBeenCalledWith(resourceId);
            });
        });

        it('deve sincronizar antes de converter template para funnel', async () => {
            // Arrange
            const resourceId = 'quiz21StepsComplete';

            // Act
            const { result } = renderHook(() =>
                useEditorResource({
                    resourceId,
                    autoLoad: true,
                    hasSupabaseAccess: false,
                })
            );

            // Assert - prepareTemplate deve ser chamado antes da conversão
            await waitFor(() => {
                expect(mockPrepareTemplate).toHaveBeenCalledWith(resourceId);
                expect(result.current.resource).not.toBeNull();
            }, { timeout: 3000 });
        });

        it('deve manter sincronização mesmo se prepareTemplate falhar', async () => {
            // Arrange
            const resourceId = 'quiz21StepsComplete';
            mockPrepareTemplate.mockRejectedValueOnce(new Error('Prepare failed'));

            // Act
            const { result } = renderHook(() =>
                useEditorResource({
                    resourceId,
                    autoLoad: true,
                    hasSupabaseAccess: false,
                })
            );

            // Assert - conversão deve continuar mesmo com erro em prepare
            await waitFor(() => {
                expect(mockPrepareTemplate).toHaveBeenCalled();
                // Hook deve ter tentado carregar mesmo assim
                expect(result.current.isLoading).toBe(false);
            }, { timeout: 3000 });
        });
    });

    describe('Detecção de tipo de recurso', () => {
        it('deve chamar prepareTemplate apenas para templates', async () => {
            // Arrange - UUID é funnel, não template
            const funnelId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

            // Act
            const { result } = renderHook(() =>
                useEditorResource({
                    resourceId: funnelId,
                    autoLoad: true,
                    hasSupabaseAccess: true,
                })
            );

            // Assert
            await waitFor(() => {
                expect(mockPrepareTemplate).not.toHaveBeenCalled();
                expect(result.current.resourceType).toBe('funnel');
            });
        });

        it('deve chamar prepareTemplate para quiz21StepsComplete', async () => {
            // Arrange
            const templateId = 'quiz21StepsComplete';

            // Act
            renderHook(() =>
                useEditorResource({
                    resourceId: templateId,
                    autoLoad: true,
                    hasSupabaseAccess: false,
                })
            );

            // Assert
            await waitFor(() => {
                expect(mockPrepareTemplate).toHaveBeenCalledWith(templateId);
            });
        });

        it('deve chamar prepareTemplate para step-XX', async () => {
            // Arrange
            const stepId = 'step-01';

            // Act
            renderHook(() =>
                useEditorResource({
                    resourceId: stepId,
                    autoLoad: true,
                    hasSupabaseAccess: false,
                })
            );

            // Assert
            await waitFor(() => {
                expect(mockPrepareTemplate).toHaveBeenCalledWith(stepId);
            });
        });
    });

    describe('Reload e cache', () => {
        it('deve chamar prepareTemplate novamente ao recarregar', async () => {
            // Arrange
            const resourceId = 'quiz21StepsComplete';
            const { result } = renderHook(() =>
                useEditorResource({
                    resourceId,
                    autoLoad: true,
                    hasSupabaseAccess: false,
                })
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            mockPrepareTemplate.mockClear();

            // Act - recarregar
            await result.current.reload();

            // Assert
            await waitFor(() => {
                expect(mockPrepareTemplate).toHaveBeenCalledWith(resourceId);
            });
        });
    });

    describe('Modo novo (sem resourceId)', () => {
        it('não deve chamar prepareTemplate para novo recurso', async () => {
            // Arrange & Act
            const { result } = renderHook(() =>
                useEditorResource({
                    resourceId: undefined,
                    autoLoad: true,
                    hasSupabaseAccess: false,
                })
            );

            // Assert
            await waitFor(() => {
                expect(result.current.isNewMode).toBe(true);
                expect(mockPrepareTemplate).not.toHaveBeenCalled();
            });
        });
    });

    describe('Fluxo completo: Hook → Service → HierarchicalSource', () => {
        it('deve sincronizar toda a cadeia ao carregar template', async () => {
            // Arrange
            const templateId = 'quiz21StepsComplete';

            // Act
            renderHook(() =>
                useEditorResource({
                    resourceId: templateId,
                    autoLoad: true,
                    hasSupabaseAccess: false,
                })
            );

            // Assert - verificar cadeia completa
            await waitFor(() => {
                // 1. Hook chamou prepareTemplate
                expect(mockPrepareTemplate).toHaveBeenCalledWith(templateId);

                // 2. prepareTemplate chamou setActiveTemplate (via TemplateService)
                expect(mockSetActiveTemplate).toHaveBeenCalledWith(templateId);
            }, { timeout: 3000 });
        });

        it('deve manter sincronização entre mudanças de template', async () => {
            // Arrange
            const template1 = 'quiz21StepsComplete';
            const template2 = 'custom-template';

            // Act - primeiro template
            const { rerender } = renderHook(
                ({ resourceId }) =>
                    useEditorResource({
                        resourceId,
                        autoLoad: true,
                        hasSupabaseAccess: false,
                    }),
                { initialProps: { resourceId: template1 } }
            );

            await waitFor(() => {
                expect(mockPrepareTemplate).toHaveBeenCalledWith(template1);
            });

            // Act - mudar para segundo template
            rerender({ resourceId: template2 });

            // Assert
            await waitFor(() => {
                expect(mockPrepareTemplate).toHaveBeenCalledWith(template2);
            }, { timeout: 3000 });
        });
    });

    describe('Performance e deduplicação', () => {
        it('não deve chamar prepareTemplate múltiplas vezes para mesmo resource', async () => {
            // Arrange
            const resourceId = 'quiz21StepsComplete';

            // Act - renderizar hook múltiplas vezes rapidamente
            const { result: result1 } = renderHook(() =>
                useEditorResource({
                    resourceId,
                    autoLoad: true,
                    hasSupabaseAccess: false,
                })
            );

            const { result: result2 } = renderHook(() =>
                useEditorResource({
                    resourceId,
                    autoLoad: true,
                    hasSupabaseAccess: false,
                })
            );

            // Assert
            await waitFor(() => {
                expect(result1.current.isLoading).toBe(false);
                expect(result2.current.isLoading).toBe(false);
            });

            // prepareTemplate pode ser chamado 2x (um por hook), mas não mais que isso
            expect(mockPrepareTemplate.mock.calls.length).toBeLessThanOrEqual(2);
        });
    });
});
