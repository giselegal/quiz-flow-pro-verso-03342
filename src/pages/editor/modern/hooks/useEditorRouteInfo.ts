import { useMemo } from 'react';
// Ajuste de caminho: uso de alias para evitar profundidade relativa incorreta
import { QUIZ_ESTILO_TEMPLATE_ID, canonicalizeQuizEstiloId, warnIfDeprecatedQuizEstilo, isQuizEstiloId, ALL_QUIZ_ESTILO_ALIASES } from '../../../../domain/quiz/quiz-estilo-ids';

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
            warnIfDeprecatedQuizEstilo(templateParam);
            const canonical = canonicalizeQuizEstiloId(templateParam) || templateParam;
            if (isQuizEstiloId(templateParam)) {
                return { templateId: canonical, funnelId: null, type: 'quiz-template' };
            }
            return { templateId: canonical, funnelId: null, type: 'template' };
        }

        if (path.startsWith('/editor/') && path.length > '/editor/'.length) {
            const identifier = path.replace('/editor/', '');
            warnIfDeprecatedQuizEstilo(identifier);
            const canonical = canonicalizeQuizEstiloId(identifier) || identifier;

            // Conjunto rápido para match exato de aliases quiz-estilo.
            const quizAliasSet = new Set(ALL_QUIZ_ESTILO_ALIASES);
            if (quizAliasSet.has(identifier)) {
                return { templateId: QUIZ_ESTILO_TEMPLATE_ID, funnelId: null, type: 'quiz-template' };
            }

            // Prefixos reconhecidos explicitamente como templates genéricos.
            const TEMPLATE_PREFIXES = ['template-', 'default-', 'optimized-', 'style-', 'step-'];
            const isGenericTemplate = TEMPLATE_PREFIXES.some(p => identifier.startsWith(p));

            if (isGenericTemplate) {
                return { templateId: canonical, funnelId: null, type: 'template' };
            }

            // Qualquer outro id não listado é tratado como funnelId (instância concreta), mesmo que contenha "quiz-estilo-" seguido de sufixo (ex: quiz-estilo-demo).
            return { templateId: null, funnelId: canonical, type: 'funnel' };
        }

        return {
            funnelId: funnelIdProp || null,
            templateId: templateIdProp || null,
            type: templateIdProp ? 'template' : (funnelIdProp ? 'funnel' : 'auto')
        };
    }, [funnelIdProp, templateIdProp]);
}

export default useEditorRouteInfo;