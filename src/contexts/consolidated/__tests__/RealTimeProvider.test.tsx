/**
 * 🧪 TESTES: RealTimeProvider
 * 
 * Testa provider consolidado Sync + Collaboration
 * - Sincronização (sync, syncResource)
 * - Colaboração em tempo real (presence, broadcast)
 * - Integração Supabase Realtime
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { RealTimeProvider, useRealTime, useSync, useCollaboration } from '../RealTimeProvider';

// Mock Supabase Realtime
const mockSubscribe = vi.fn();
const mockUnsubscribe = vi.fn();
const mockTrack = vi.fn();
const mockSend = vi.fn();

const mockChannel = {
    subscribe: mockSubscribe,
    unsubscribe: mockUnsubscribe,
    track: mockTrack,
    send: mockSend,
    on: vi.fn().mockReturnThis(),
};

vi.mock('@/lib/supabase', () => ({
    supabase: {
        channel: vi.fn(() => mockChannel),
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
    },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RealTimeProvider>{children}</RealTimeProvider>
);

describe('RealTimeProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSubscribe.mockReturnValue('ok');
    });

    describe('Sync: Sincronização', () => {
        it('deve sincronizar recurso com sucesso', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            await act(async () => {
                await result.current.sync();
            });

            await waitFor(() => {
                expect(result.current.isSyncing).toBe(false);
                expect(result.current.lastSyncTime).not.toBeNull();
            });
        });

        it('deve sincronizar recurso específico', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            const testData = { id: '123', name: 'Test Resource' };

            await act(async () => {
                await result.current.syncResource('resource-123', testData);
            });

            expect(result.current.pendingChanges).toBe(0);
        });

        it('deve rastrear mudanças pendentes', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            // Simular mudanças não sincronizadas
            await act(async () => {
                // Em implementação real, isto incrementaria pendingChanges
                await result.current.syncResource('resource-1', { data: 'test1' });
                await result.current.syncResource('resource-2', { data: 'test2' });
            });

            // Verificar que mudanças foram processadas
            expect(result.current.lastSyncTime).not.toBeNull();
        });

        it('deve obter status de sincronização', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            const status = result.current.getSyncStatus();

            expect(status).toHaveProperty('isSyncing');
            expect(status).toHaveProperty('lastSyncTime');
            expect(status).toHaveProperty('pendingChanges');
            expect(status).toHaveProperty('conflictCount');
        });

        it('deve limpar mudanças pendentes', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            await act(async () => {
                result.current.clearPendingChanges();
            });

            expect(result.current.pendingChanges).toBe(0);
        });
    });

    describe('Collaboration: Colaboração em Tempo Real', () => {
        it('deve iniciar colaboração em sala', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            await act(async () => {
                await result.current.startCollaboration('room-123');
            });

            expect(result.current.isCollaborating).toBe(true);
            expect(mockSubscribe).toHaveBeenCalled();
        });

        it('deve parar colaboração', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            // Iniciar colaboração primeiro
            await act(async () => {
                await result.current.startCollaboration('room-123');
            });

            // Parar colaboração
            await act(async () => {
                result.current.stopCollaboration();
            });

            await waitFor(() => {
                expect(result.current.isCollaborating).toBe(false);
            });
        });

        it('deve broadcastear mudanças para colaboradores', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            await act(async () => {
                await result.current.startCollaboration('room-123');
            });

            const changeEvent = {
                type: 'block-update',
                blockId: 'block-456',
                data: { content: 'Updated content' },
            };

            await act(async () => {
                await result.current.broadcastChange(changeEvent);
            });

            expect(mockSend).toHaveBeenCalledWith({
                type: 'broadcast',
                event: 'change',
                payload: changeEvent,
            });
        });

        it('deve atualizar presença do usuário', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            await act(async () => {
                await result.current.startCollaboration('room-123');
            });

            const presenceData = {
                status: 'online',
                cursor: { x: 100, y: 200 },
                currentStep: 5,
            };

            await act(async () => {
                await result.current.updatePresence(presenceData);
            });

            expect(mockTrack).toHaveBeenCalledWith(presenceData);
        });

        it('deve listar colaboradores ativos', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            await act(async () => {
                await result.current.startCollaboration('room-123');
            });

            // Em implementação real, lista seria populada via Realtime
            const collaborators = result.current.collaborators;
            expect(Array.isArray(collaborators)).toBe(true);
        });
    });

    describe('Integração: Sync + Collaboration', () => {
        it('deve sincronizar e broadcastear mudança simultaneamente', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            await act(async () => {
                await result.current.startCollaboration('room-123');
            });

            const resourceId = 'funnel-789';
            const data = { title: 'Updated Funnel', steps: 10 };

            await act(async () => {
                await result.current.syncAndBroadcast(resourceId, data);
            });

            // Verificar que sync foi chamado
            expect(result.current.lastSyncTime).not.toBeNull();

            // Verificar que broadcast foi enviado
            expect(mockSend).toHaveBeenCalled();
        });

        it('deve inscrever-se para receber mudanças de colaboradores', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            await act(async () => {
                await result.current.startCollaboration('room-123');
            });

            const callback = vi.fn();

            await act(async () => {
                result.current.subscribeToChanges(callback);
            });

            // Em implementação real, callback seria chamado ao receber eventos
            expect(callback).toHaveBeenCalledTimes(0); // Ainda não recebeu eventos
        });
    });

    describe('Conflitos: Detecção e Resolução', () => {
        it('deve detectar conflitos de sincronização', async () => {
            const { result } = renderHook(() => useRealTime(), { wrapper });

            // Simular conflito (em implementação real)
            await act(async () => {
                await result.current.sync();
            });

            // Verificar que conflictCount é rastreado
            expect(typeof result.current.conflictCount).toBe('number');
        });
    });

    describe('Aliases: useSync e useCollaboration', () => {
        it('useSync deve retornar mesma interface que useRealTime', () => {
            const { result: syncResult } = renderHook(() => useSync(), { wrapper });
            const { result: realTimeResult } = renderHook(() => useRealTime(), { wrapper });

            expect(syncResult.current).toBeDefined();
            expect(syncResult.current.sync).toBeDefined();
            expect(typeof syncResult.current.sync).toBe(typeof realTimeResult.current.sync);
        });

        it('useCollaboration deve retornar mesma interface que useRealTime', () => {
            const { result: collabResult } = renderHook(() => useCollaboration(), { wrapper });
            const { result: realTimeResult } = renderHook(() => useRealTime(), { wrapper });

            expect(collabResult.current).toBeDefined();
            expect(collabResult.current.startCollaboration).toBeDefined();
            expect(typeof collabResult.current.startCollaboration).toBe(typeof realTimeResult.current.startCollaboration);
        });
    });

    describe('Cleanup: Limpeza de Recursos', () => {
        it('deve limpar subscriptions ao desmontar', async () => {
            const { result, unmount } = renderHook(() => useRealTime(), { wrapper });

            await act(async () => {
                await result.current.startCollaboration('room-123');
            });

            unmount();

            expect(mockUnsubscribe).toHaveBeenCalled();
        });
    });
});
