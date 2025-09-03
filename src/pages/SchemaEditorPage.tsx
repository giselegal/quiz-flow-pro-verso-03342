import React from 'react';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { Quiz21StepsProvider } from '@/components/quiz/Quiz21StepsProvider';
import { QuizFlowProvider } from '@/context/QuizFlowProvider';
import { FunnelsProvider } from '@/context/FunnelsContext';
import SchemaDrivenEditorResponsive from '@/components/editor/SchemaDrivenEditorResponsive';
import { useLocation } from 'wouter';

/**
 * Página dedicada para o editor SchemaDrivenEditorResponsive
 * Mantém a mesma cadeia de providers do MainEditor, mas renderiza o editor alternativo.
 */
const SchemaEditorPage: React.FC = () => {
    const [location] = useLocation();
    const params = React.useMemo(() => new URLSearchParams(location.split('?')[1] || ''), [location]);
    const funnelId = params.get('funnel') || (import.meta as any)?.env?.VITE_SUPABASE_FUNNEL_ID;
    const quizId = (import.meta as any)?.env?.VITE_SUPABASE_QUIZ_ID || funnelId || 'local-funnel';
    const stepParam = params.get('step');
    const initialStep = stepParam ? Math.max(1, Math.min(21, parseInt(stepParam))) : undefined;
    const enableSupabase = (import.meta as any)?.env?.VITE_ENABLE_SUPABASE === 'true';

    return (
        <ErrorBoundary>
            <FunnelsProvider debug={true}>
                <EditorProvider
                    enableSupabase={enableSupabase}
                    funnelId={funnelId || undefined}
                    quizId={quizId}
                    storageKey="schema-editor-state"
                    initial={initialStep ? { currentStep: initialStep } : undefined}
                >
                    <Quiz21StepsProvider debug={true} initialStep={initialStep}>
                        <QuizFlowProvider initialStep={initialStep} totalSteps={21}>
                            <SchemaDrivenEditorResponsive />
                        </QuizFlowProvider>
                    </Quiz21StepsProvider>
                </EditorProvider>
            </FunnelsProvider>
        </ErrorBoundary>
    );
};

export default SchemaEditorPage;
