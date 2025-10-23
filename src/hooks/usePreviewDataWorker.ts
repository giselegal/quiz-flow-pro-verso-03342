import * as React from 'react';
import { PreviewDataWorkerService, type PreviewProcessingResult } from '@/services/performance/PreviewDataWorker';

export function usePreviewDataWorker(blocks: Array<{ id: string; type: any; content?: any }>) {
    const [result, setResult] = React.useState<PreviewProcessingResult | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        PreviewDataWorkerService.process(blocks)
            .then(res => { if (!cancelled) setResult(res); })
            .catch(err => { if (!cancelled) setError(err as Error); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [blocks]);

    return { result, loading, error };
}

export default usePreviewDataWorker;
