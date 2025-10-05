// =============================================================
// ModernUnifiedEditor - Editor WYSIWYG Unificado (VERSÃO ATUAL ESTÁVEL)
// Renderiza QuizFunnelEditorWYSIWYG.legacy integrado com sistema UnifiedCRUD
// Versão funcional atual com 4 colunas WYSIWYG
// =============================================================
import React, { Suspense } from 'react';
import { useUnifiedCRUDOptional } from '@/context/UnifiedCRUDProvider';
import '../../components/editor/quiz/QuizEditorStyles.css';

export interface ModernUnifiedEditorProps {
    funnelId?: string;
    templateId?: string;
    className?: string;
}

const QuizFunnelEditor = React.lazy(() => import('../../components/editor/quiz/QuizFunnelEditorWYSIWYG.legacy'));
// Provider de blocos do quiz
import { BlockRegistryProvider, ResultHeadlineBlock, OfferCoreBlock, ResultSecondaryListBlock, OfferUrgencyBlock } from '@/runtime/quiz/blocks/BlockRegistry';

const ModernUnifiedEditor: React.FC<ModernUnifiedEditorProps> = (props) => {
    const crud = useUnifiedCRUDOptional();

    return (
        <div className={`quiz-editor-container flex flex-col w-full h-full ${props.className || ''}`}>
            <div className="flex-1 min-h-0">
                <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando editor WYSIWYG...</div>}>
                    {!crud ? (
                        <div className="p-6 text-sm text-red-600" data-testid="missing-crud-provider">
                            ⚠️ UnifiedCRUDProvider ausente. Envolva <code>ModernUnifiedEditor</code> com <code>&lt;UnifiedCRUDProvider&gt;</code>.
                        </div>
                    ) : (
                        <BlockRegistryProvider definitions={[ResultHeadlineBlock, OfferCoreBlock, ResultSecondaryListBlock, OfferUrgencyBlock]}>
                            <div data-testid="quiz-editor-container">
                                <QuizFunnelEditor funnelId={props.funnelId} templateId={props.templateId} />
                            </div>
                        </BlockRegistryProvider>
                    )}
                </Suspense>
            </div>
        </div>
    );
};

export default ModernUnifiedEditor;
