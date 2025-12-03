import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { canonicalFunnelService } from '@/services/funnel/CanonicalFunnelService';
import { useFunnel, useFunnelList, funnelKeys, type UseFunnelOptions } from './useFunnel';

/**
 * useFunnelController
 *
 * Controlador unificado para operações de funil.
 * - Leitura com React Query (useFunnel/useFunnelList)
 * - Ações via serviço canônico
 * - Invalidação de cache pós-mutações
 */
export function useFunnelController(
  funnelId?: string,
  options: UseFunnelOptions = {}
) {
  const queryClient = useQueryClient();
  const service = canonicalFunnelService;

  // Dados reativos do funil (quando ID fornecido)
  const funnelQuery = funnelId ? useFunnel(funnelId, options) : null;

  // Listagem reativa (opcional por consumidor)
  const listQuery = useFunnelList({}, { enabled: false });

  const listFunnels = useCallback(async (filters?: Record<string, any>) => {
    const data = await service.listFunnels(filters || {});
    // Atualiza cache da lista sem precisar reconsultar
    queryClient.setQueryData(funnelKeys.list(filters || {}), data);
    return data;
  }, [queryClient, service]);

  const createFunnel = useCallback(async (payload: any) => {
    const created = await service.createFunnel(payload);
    await queryClient.invalidateQueries({ queryKey: funnelKeys.lists() });
    return created;
  }, [queryClient, service]);

  const updateFunnel = useCallback(async (id: string, updates: any) => {
    const updated = await service.updateFunnel(id, updates);
    // Atualiza cache do detalhe e lista
    queryClient.invalidateQueries({ queryKey: funnelKeys.detail(id) });
    queryClient.invalidateQueries({ queryKey: funnelKeys.lists() });
    return updated;
  }, [queryClient, service]);

  const duplicateFunnel = useCallback(async (id: string, newName?: string) => {
    const duplicated = await service.duplicateFunnel(id, newName);
    await queryClient.invalidateQueries({ queryKey: funnelKeys.lists() });
    return duplicated;
  }, [queryClient, service]);

  const deleteFunnel = useCallback(async (id: string) => {
    const ok = await service.deleteFunnel(id);
    await queryClient.invalidateQueries({ queryKey: funnelKeys.detail(id) });
    await queryClient.invalidateQueries({ queryKey: funnelKeys.lists() });
    return ok;
  }, [queryClient, service]);

  const reload = useCallback(async () => {
    if (!funnelId) return;
    await queryClient.invalidateQueries({ queryKey: funnelKeys.detail(funnelId) });
  }, [queryClient, funnelId]);

  return {
    // Dados
    funnel: funnelQuery?.data ?? null,
    isLoading: funnelQuery?.isLoading ?? false,
    isError: funnelQuery?.isError ?? false,
    error: funnelQuery?.error ?? null,

    // Ações
    listFunnels,
    createFunnel,
    updateFunnel,
    duplicateFunnel,
    deleteFunnel,
    reload,

    // Também exporta queries brutas, se necessário
    query: funnelQuery,
    listQuery,
  };
}

export default useFunnelController;
