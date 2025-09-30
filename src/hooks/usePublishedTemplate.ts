import { useEffect, useState } from 'react';
import { getPublishedTemplate, clearPublishedTemplateCache, PublishedTemplateData } from '@/services/PublishedTemplateRuntimeService';
import { canonicalizeQuizEstiloId, isQuizEstiloId } from '@/domain/quiz/quiz-estilo-ids';

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
    const { templateId: rawTemplateId, refreshFlag } = options;
    // Canonicaliza se for quiz-estilo
    const templateId = isQuizEstiloId(rawTemplateId) ? (canonicalizeQuizEstiloId(rawTemplateId) || rawTemplateId) : rawTemplateId;
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
    }, [templateId, refreshFlag, rawTemplateId]);

    return {
        loading,
        error,
        data,
        reload: () => load(true)
    };
}

export default usePublishedTemplate;
