import React, { useMemo } from 'react';
import { useRoute } from 'wouter';
import QuizApp from '@/components/quiz/QuizApp';
import { useFunnelLivePreview } from '@/hooks/useFunnelLivePreview';

export default function LivePreviewPage() {
    const [match, params] = useRoute('/preview/:funnelId');
    const funnelId = useMemo(() => {
        if (match) return params?.funnelId as string | undefined;
        // Fallback: tentar query string ?funnel=...
        try {
            const sp = new URLSearchParams(window.location.search);
            return sp.get('funnel') || undefined;
        } catch {
            return undefined;
        }
    }, [match, params]);
    const { liveSteps } = useFunnelLivePreview(funnelId);

    const isConnected = !!liveSteps;
    return (
        <div className="min-h-screen bg-white">
            <div className="fixed top-3 right-3 z-50 text-xs px-2 py-1 rounded shadow-sm border bg-white">
                {isConnected ? (
                    <span className="text-green-600">● Live</span>
                ) : (
                    <span className="text-gray-400">● Aguardando</span>
                )}
                {funnelId && <span className="ml-2 text-gray-500">{funnelId}</span>}
            </div>
            <QuizApp funnelId={funnelId} externalSteps={liveSteps || undefined} />
        </div>
    );
}
