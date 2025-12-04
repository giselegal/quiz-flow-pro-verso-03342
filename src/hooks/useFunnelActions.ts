import { useCallback, useMemo, useState } from 'react';
import { funnelService as canonicalFunnelService, type CreateFunnelInput, type UpdateFunnelInput, type FunnelMetadata } from '@/services';

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

  const svc = canonicalFunnelService;
  const get = useCallback((id: string) => run(() => svc.getFunnel(id)), [run, svc]);
  const list = useCallback((filters?: { type?: FunnelMetadata['type']; status?: FunnelMetadata['status']; isActive?: boolean }) => run(() => svc.listFunnels(filters)), [run, svc]);
  const create = useCallback((input: CreateFunnelInput) => run(() => svc.createFunnel(input)), [run, svc]);
  const update = useCallback((id: string, input: UpdateFunnelInput) => run(() => svc.updateFunnel(id, input)), [run, svc]);
  const remove = useCallback((id: string) => run(() => svc.deleteFunnel(id)), [run, svc]);
  const duplicate = useCallback((id: string, newName?: string) => run(() => svc.duplicateFunnel(id, newName)), [run, svc]);

  return useMemo(() => ({ ...state, get, list, create, update, remove, duplicate }), [state, get, list, create, update, remove, duplicate]);
}

export type UseFunnelActions = ReturnType<typeof useFunnelActions>;
