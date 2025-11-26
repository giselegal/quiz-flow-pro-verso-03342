/**
 * 🧪 TESTES: ConsolidatedFunnelService
 * 
 * Suite completa de testes para validar operações CRUD, cache, métricas e analytics
 * Target: 80%+ coverage
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { consolidatedFunnelService, type FunnelData } from '@/services/core/ConsolidatedFunnelService';
import { supabase } from '@/services/integrations/supabase/customClient';

// Mock do Supabase
vi.mock('@/services/integrations/supabase/customClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('ConsolidatedFunnelService', () => {
  const mockFunnelData: FunnelData = {
    id: 'funnel-123',
    name: 'Test Funnel',
    description: 'Test Description',
    user_id: 'user-456',
    is_published: true,
    version: 1,
    status: 'published',
    config: { theme: 'dark' },
    settings: { autoSave: true },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Limpar cache antes de cada teste
    (consolidatedFunnelService as any).cache.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ========================================================================
  // HEALTH CHECK
  // ========================================================================

  describe('healthCheck', () => {
    it('deve retornar true quando Supabase está saudável', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({ error: null }),
      });

      (supabase.from as any).mockReturnValue({
        select: mockSelect,
      });

      const result = await consolidatedFunnelService.healthCheck();

      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('funnels');
      expect(mockSelect).toHaveBeenCalledWith('count(*)');
    });

    it('deve retornar false quando Supabase tem erro', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({ error: { message: 'Connection failed' } }),
      });

      (supabase.from as any).mockReturnValue({
        select: mockSelect,
      });

      const result = await consolidatedFunnelService.healthCheck();

      expect(result).toBe(false);
    });

    it('deve retornar false quando ocorre exceção', async () => {
      (supabase.from as any).mockImplementation(() => {
        throw new Error('Network error');
      });

      const result = await consolidatedFunnelService.healthCheck();

      expect(result).toBe(false);
    });
  });

  // ========================================================================
  // GET ALL FUNNELS
  // ========================================================================

  describe('getAllFunnels', () => {
    it('deve retornar todos os funnels do Supabase', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [mockFunnelData],
        error: null,
      });

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: mockOrder,
        }),
      });

      const result = await consolidatedFunnelService.getAllFunnels();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'funnel-123',
        name: 'Test Funnel',
      });
      expect(supabase.from).toHaveBeenCalledWith('funnels');
      expect(mockOrder).toHaveBeenCalledWith('updated_at', { ascending: false });
    });

    it('deve normalizar config e settings dos funnels', async () => {
      const funnelWithoutConfig = {
        ...mockFunnelData,
        config: null,
        settings: { key: 'value' },
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [funnelWithoutConfig],
            error: null,
          }),
        }),
      });

      const result = await consolidatedFunnelService.getAllFunnels();

      expect(result[0].config).toEqual({ key: 'value' });
    });

    it('deve usar cache quando disponível', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [mockFunnelData],
        error: null,
      });

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: mockOrder,
        }),
      });

      // Primeira chamada - popula cache
      await consolidatedFunnelService.getAllFunnels();

      // Segunda chamada - deve usar cache
      await consolidatedFunnelService.getAllFunnels();

      // Supabase deve ter sido chamado apenas uma vez
      expect(mockOrder).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro quando Supabase falha', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      });

      await expect(consolidatedFunnelService.getAllFunnels()).rejects.toThrow(
        'Failed to fetch funnels: Database error'
      );
    });
  });

  // ========================================================================
  // GET FUNNEL BY ID
  // ========================================================================

  describe('getFunnelById', () => {
    it('deve retornar funnel específico por ID', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockFunnelData,
        error: null,
      });

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: mockSingle,
          }),
        }),
      });

      const result = await consolidatedFunnelService.getFunnelById('funnel-123');

      expect(result).toMatchObject({
        id: 'funnel-123',
        name: 'Test Funnel',
      });
      expect(supabase.from).toHaveBeenCalledWith('funnels');
    });

    it('deve usar cache para IDs já consultados', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockFunnelData,
        error: null,
      });

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: mockSingle,
          }),
        }),
      });

      // Primeira chamada
      await consolidatedFunnelService.getFunnelById('funnel-123');
      // Segunda chamada - deve usar cache
      await consolidatedFunnelService.getFunnelById('funnel-123');

      expect(mockSingle).toHaveBeenCalledTimes(1);
    });

    it('deve retornar null quando funnel não existe', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' },
            }),
          }),
        }),
      });

      const result = await consolidatedFunnelService.getFunnelById('non-existent');

      expect(result).toBeNull();
    });

    it('deve lançar erro em caso de falha no banco', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Connection error', code: 'ECONNREFUSED' },
            }),
          }),
        }),
      });

      await expect(consolidatedFunnelService.getFunnelById('funnel-123')).rejects.toThrow(
        'Failed to fetch funnel: Connection error'
      );
    });
  });

  // ========================================================================
  // CREATE FUNNEL
  // ========================================================================

  describe('createFunnel', () => {
    it('deve criar novo funnel com sucesso', async () => {
      const newFunnelData = {
        name: 'New Funnel',
        description: 'New Description',
        user_id: 'user-789',
        config: { theme: 'light' },
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: { ...mockFunnelData, ...newFunnelData },
        error: null,
      });

      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: mockSingle,
          }),
        }),
      });

      const result = await consolidatedFunnelService.createFunnel(newFunnelData);

      expect(result).toMatchObject({
        name: 'New Funnel',
        user_id: 'user-789',
      });
      expect(result.created_at).toBeDefined();
      expect(result.updated_at).toBeDefined();
    });

    it('deve limpar cache após criar funnel', async () => {
      const clearCacheSpy = vi.spyOn(consolidatedFunnelService as any, 'clearCache');

      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockFunnelData,
              error: null,
            }),
          }),
        }),
      });

      await consolidatedFunnelService.createFunnel({
        name: 'Test',
        user_id: 'user-1',
      });

      expect(clearCacheSpy).toHaveBeenCalled();
    });

    it('deve lançar erro quando criação falha', async () => {
      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Validation failed' },
            }),
          }),
        }),
      });

      await expect(
        consolidatedFunnelService.createFunnel({
          name: 'Invalid',
          user_id: 'user-1',
        })
      ).rejects.toThrow('Failed to create funnel: Validation failed');
    });
  });

  // ========================================================================
  // UPDATE FUNNEL
  // ========================================================================

  describe('updateFunnel', () => {
    it('deve atualizar funnel existente', async () => {
      const updates = {
        name: 'Updated Name',
        config: { theme: 'blue' },
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: { ...mockFunnelData, ...updates },
        error: null,
      });

      (supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: mockSingle,
            }),
          }),
        }),
      });

      const result = await consolidatedFunnelService.updateFunnel('funnel-123', updates);

      expect(result.name).toBe('Updated Name');
      expect(result.updated_at).toBeDefined();
    });

    it('deve limpar cache após atualização', async () => {
      const clearCacheSpy = vi.spyOn(consolidatedFunnelService as any, 'clearCache');

      (supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockFunnelData,
                error: null,
              }),
            }),
          }),
        }),
      });

      await consolidatedFunnelService.updateFunnel('funnel-123', { name: 'New' });

      expect(clearCacheSpy).toHaveBeenCalled();
    });

    it('deve lançar erro quando atualização falha', async () => {
      (supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Update failed' },
              }),
            }),
          }),
        }),
      });

      await expect(
        consolidatedFunnelService.updateFunnel('funnel-123', { name: 'New' })
      ).rejects.toThrow('Failed to update funnel: Update failed');
    });
  });

  // ========================================================================
  // DELETE FUNNEL
  // ========================================================================

  describe('deleteFunnel', () => {
    it('deve deletar funnel com sucesso', async () => {
      const mockDelete = vi.fn().mockResolvedValue({
        error: null,
      });

      (supabase.from as any).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: mockDelete,
        }),
      });

      await consolidatedFunnelService.deleteFunnel('funnel-123');

      expect(supabase.from).toHaveBeenCalledWith('funnels');
      expect(mockDelete).toHaveBeenCalledWith('id', 'funnel-123');
    });

    it('deve limpar cache após deletar', async () => {
      const clearCacheSpy = vi.spyOn(consolidatedFunnelService as any, 'clearCache');

      (supabase.from as any).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: null,
          }),
        }),
      });

      await consolidatedFunnelService.deleteFunnel('funnel-123');

      expect(clearCacheSpy).toHaveBeenCalled();
    });

    it('deve lançar erro quando deleção falha', async () => {
      (supabase.from as any).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: 'Delete failed' },
          }),
        }),
      });

      await expect(consolidatedFunnelService.deleteFunnel('funnel-123')).rejects.toThrow(
        'Failed to delete funnel: Delete failed'
      );
    });
  });

  // ========================================================================
  // GET DASHBOARD SUMMARY
  // ========================================================================

  describe('getDashboardSummary', () => {
    it('deve retornar resumo do dashboard com métricas', async () => {
      const mockFunnels = [
        { ...mockFunnelData, is_published: true },
        { ...mockFunnelData, id: 'f2', is_published: false },
      ];

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'funnels') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: mockFunnels,
                error: null,
              }),
            }),
          };
        }
        if (table === 'quiz_sessions') {
          return {
            select: vi.fn().mockResolvedValue({
              data: [
                { id: '1', status: 'completed', funnel_id: 'funnel-123' },
                { id: '2', status: 'in_progress', funnel_id: 'funnel-123' },
              ],
              error: null,
            }),
          };
        }
        return { select: vi.fn() };
      });

      const result = await consolidatedFunnelService.getDashboardSummary();

      expect(result).toMatchObject({
        totalFunnels: 2,
        activeFunnels: 1,
        draftFunnels: 1,
      });
      expect(result.totalSessions).toBe(2);
      expect(result.totalCompletions).toBe(1);
    });

    it('deve calcular métricas com múltiplas sessões', async () => {
      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'funnels') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [mockFunnelData],
                error: null,
              }),
            }),
          };
        }
        if (table === 'quiz_sessions') {
          return {
            select: vi.fn().mockResolvedValue({
              data: [
                { id: '1', status: 'completed', funnel_id: 'funnel-123' },
                { id: '2', status: 'completed', funnel_id: 'funnel-123' },
                { id: '3', status: 'in_progress', funnel_id: 'funnel-123' },
                { id: '4', status: 'in_progress', funnel_id: 'funnel-123' },
              ],
              error: null,
            }),
          };
        }
        return { select: vi.fn() };
      });

      const result = await consolidatedFunnelService.getDashboardSummary();

      expect(result.totalSessions).toBe(4);
      expect(result.totalCompletions).toBe(2);
      expect(result.averageConversionRate).toBeGreaterThanOrEqual(0);
    });
  });

  // ========================================================================
  // CACHE STATS
  // ========================================================================

  describe('getCacheStats', () => {
    it('deve retornar estatísticas do cache', () => {
      const stats = consolidatedFunnelService.getCacheStats();

      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('hitRate');
      expect(typeof stats.size).toBe('number');
      expect(typeof stats.hitRate).toBe('number');
    });

    it('deve refletir cache populado', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [mockFunnelData],
            error: null,
          }),
        }),
      });

      // Popula cache
      await consolidatedFunnelService.getAllFunnels();

      const stats = consolidatedFunnelService.getCacheStats();

      expect(stats.size).toBeGreaterThan(0);
    });
  });

  // ========================================================================
  // GET NAME
  // ========================================================================

  describe('getName', () => {
    it('deve retornar nome correto do serviço', () => {
      const name = consolidatedFunnelService.getName();

      expect(name).toBe('ConsolidatedFunnelService');
    });
  });
});
