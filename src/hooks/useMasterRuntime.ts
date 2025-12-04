import { useEffect, useState } from 'react';

interface MasterRuntime {
  runtime?: any;
  scoringRules?: any;
  loading: boolean;
  error?: Error;
}

/**
 * Lê /templates/.obsolete/quiz21-v4.json e expõe runtime + metadata.scoringRules
 * com cache leve em memória (por sessão).
 * ✅ FASE 2 FIX: Path corrigido para arquivo que existe em .obsolete
 */
export function useMasterRuntime(): MasterRuntime {
  const [state, setState] = useState<MasterRuntime>({ loading: true });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cacheKey = '__MASTER_RUNTIME_CACHE__';
        const cached = (globalThis as any)[cacheKey];
        if (cached) {
          if (mounted) setState({ ...cached, loading: false });
          return;
        }

        // ✅ FASE 2 FIX: Path corrigido para arquivo que existe
        const res = await fetch('/templates/.obsolete/quiz21-v4.json', { cache: 'no-cache' });
        const data = await res.json();
        const runtime = data?.runtime;
        const scoringRules = data?.metadata?.scoringRules;
        const payload = { runtime, scoringRules };
        (globalThis as any)[cacheKey] = payload;
        if (mounted) setState({ ...payload, loading: false });
      } catch (e: any) {
        if (mounted) setState({ loading: false, error: e });
      }
    })();
    return () => { mounted = false; };
  }, []);

  return state;
}

export default useMasterRuntime;
