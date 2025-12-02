import { useCallback, useMemo, useState } from 'react';
import { funnelService } from '@/services/canonical/FunnelService';
import type { CreateFunnelInput, UpdateFunnelInput, FunnelMetadata } from '@/types/funnel';

type ActionState = { loading: boolean; error: string | null };

export function useFunnelActions() {
  const [state, setState] = useState<ActionState>({ loading: false, error: null });

  const run = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setState({ loading: true, error: null });
    try {
      const res = await fn();
      setState({ loading: false, error: null });
      return res;
    } catch (e: any) {
      setState({ loading: false, error: e?.message || 'Erro desconhecido' });
      throw e;
    }
  }, []);

  const get = useCallback((id: string) => run(() => funnelService.getFunnel(id)), [run]);
  const list = useCallback((filters?: { type?: FunnelMetadata['type']; status?: FunnelMetadata['status']; isActive?: boolean }) => run(() => funnelService.listFunnels(filters)), [run]);
  const create = useCallback((input: CreateFunnelInput) => run(() => funnelService.createFunnel(input)), [run]);
  const update = useCallback((id: string, input: UpdateFunnelInput) => run(() => funnelService.updateFunnel(id, input)), [run]);
  const remove = useCallback((id: string) => run(() => funnelService.deleteFunnel(id)), [run]);
  const duplicate = useCallback((id: string, newName?: string) => run(() => funnelService.duplicateFunnel(id, newName)), [run]);

  return useMemo(() => ({ ...state, get, list, create, update, remove, duplicate }), [state, get, list, create, update, remove, duplicate]);
}

export type UseFunnelActions = ReturnType<typeof useFunnelActions>;
