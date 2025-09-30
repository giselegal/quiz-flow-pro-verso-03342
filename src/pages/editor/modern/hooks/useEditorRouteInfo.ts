import { useMemo } from 'react';
// Ajuste de caminho: uso de alias para evitar profundidade relativa incorreta
import { QUIZ_ESTILO_TEMPLATE_ID } from '@/domain/quiz/quiz-estilo-ids';

export interface RouteExtraction {
    funnelId: string | null;
    templateId: string | null;
    type: 'funnel' | 'template' | 'quiz-template' | 'auto';
}

interface UseEditorRouteInfoOptions {
    funnelIdProp?: string;
    templateIdProp?: string;
}

export function useEditorRouteInfo({ funnelIdProp, templateIdProp }: UseEditorRouteInfoOptions): RouteExtraction {
    return useMemo(() => {
        const path = typeof window !== 'undefined' ? window.location.pathname : '';
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
        const templateParam = urlParams.get('template');
        const funnelParam = urlParams.get('funnel');

        if (funnelParam) {
            return { templateId: null, funnelId: funnelParam, type: 'funnel' };
        }
        if (templateParam) {
            if (templateParam === QUIZ_ESTILO_TEMPLATE_ID) {
                return { templateId: templateParam, funnelId: null, type: 'quiz-template' };
            }
            return { templateId: templateParam, funnelId: null, type: 'template' };
        }

        if (path.startsWith('/editor/') && path.length > '/editor/'.length) {
            const identifier = path.replace('/editor/', '');
            const looksLikeTemplate = /^(step-|template|quiz|test|funnel|default-|optimized-|style-)/i.test(identifier);
            if (looksLikeTemplate) {
                return { templateId: identifier, funnelId: null, type: 'template' };
            }
            return { templateId: null, funnelId: identifier, type: 'funnel' };
        }

        return {
            funnelId: funnelIdProp || null,
            templateId: templateIdProp || null,
            type: templateIdProp ? 'template' : (funnelIdProp ? 'funnel' : 'auto')
        };
    }, [funnelIdProp, templateIdProp]);
}

export default useEditorRouteInfo;