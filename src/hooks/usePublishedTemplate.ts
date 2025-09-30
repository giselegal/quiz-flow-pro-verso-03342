import { useEffect, useState } from 'react';
import { getPublishedTemplate, clearPublishedTemplateCache, PublishedTemplateData } from '@/services/PublishedTemplateRuntimeService';

interface UsePublishedTemplateOptions {
  templateId: string;
  refreshFlag?: boolean;
}

interface UsePublishedTemplateState {
  loading: boolean;
  error?: string;
  data: PublishedTemplateData | null;
  reload: () => Promise<void>;
}

export function usePublishedTemplate(options: UsePublishedTemplateOptions): UsePublishedTemplateState {
  const { templateId, refreshFlag } = options;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [data, setData] = useState<PublishedTemplateData | null>(null);

  async function load(force?: boolean) {
    setLoading(true);
    setError(undefined);
    try {
      if (force) clearPublishedTemplateCache(templateId);
      const result = await getPublishedTemplate(templateId, { force });
      setData(result);
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar template publicado');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(Boolean(refreshFlag));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, refreshFlag]);

  return {
    loading,
    error,
    data,
    reload: () => load(true)
  };
}

export default usePublishedTemplate;
