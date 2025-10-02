// =============================================================
// ModernUnifiedEditor (Pivot Wrapper Limpo)
// Default => QuizFunnelEditor | ?legacy=1 => ModernUnifiedEditor.legacy
// Pronto para futura injeção da FunnelEditingFacade
// =============================================================
import React, { Suspense, useMemo } from 'react';

export interface ModernUnifiedEditorProps {
    funnelId?: string;
    templateId?: string;
    className?: string;
}

const QuizFunnelEditor = React.lazy(() => import('../../components/editor/quiz/QuizFunnelEditor'));
const LegacyModernUnifiedEditor = React.lazy(() => import('./ModernUnifiedEditor.legacy'));

const TransitionBanner: React.FC<{ isLegacy: boolean }> = ({ isLegacy }) => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    const toggleUrl = (wantLegacy: boolean) => {
        const p = new URLSearchParams(params);
        if (wantLegacy) p.set('legacy', '1'); else p.delete('legacy');
        const qs = p.toString();
        return qs ? `${path}?${qs}` : path;
    };
    return (
        <div className="w-full bg-amber-50 border-b border-amber-200 px-3 py-1 text-xs text-amber-800 flex items-center gap-3">
            <strong className="font-medium">Pivot ativo:</strong>
            <span>{isLegacy ? 'Legacy ModernUnifiedEditor' : 'QuizFunnelEditor (novo padrão)'}</span>
            <a href={toggleUrl(!isLegacy)} className="underline hover:opacity-80">{isLegacy ? 'Ir para novo' : 'Voltar legacy'}</a>
        </div>
    );
};

const ModernUnifiedEditor: React.FC<ModernUnifiedEditorProps> = (props) => {
    const isLegacy = useMemo(() => {
        if (typeof window === 'undefined') return false;
        return new URLSearchParams(window.location.search).get('legacy') === '1';
    }, []);

    return (
        <div className={`flex flex-col w-full h-full ${props.className || ''}`}>
            <TransitionBanner isLegacy={isLegacy} />
            <div className="flex-1 min-h-0">
                <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando editor...</div>}>
                    {isLegacy ? (
                        <LegacyModernUnifiedEditor {...props} />
                    ) : (
                        <QuizFunnelEditor funnelId={props.funnelId} templateId={props.templateId} />
                    )}
                </Suspense>
            </div>
        </div>
    );
};

export default ModernUnifiedEditor;
