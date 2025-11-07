import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperUnifiedProvider } from '@/providers/SuperUnifiedProvider';
import QuizModularEditor from '@/components/editor/quiz/QuizModularEditor';

export interface RenderEditorOptions {
    resourceId?: string;
    funnelId?: string;
    initialStep?: number;
    isReadOnly?: boolean;
}

export const TestEditorWrapper: React.FC<RenderEditorOptions> = ({
    resourceId = 'quiz21StepsComplete',
    funnelId,
    initialStep = 1,
    isReadOnly = false,
}) => {
    const qc = React.useMemo(() => new QueryClient(), []);
    return (
        <QueryClientProvider client={qc}>
            <SuperUnifiedProvider funnelId={funnelId} autoLoad={false} debugMode={true}>
                <QuizModularEditor resourceId={resourceId} isReadOnly={isReadOnly} initialStepKey={`step-${String(initialStep).padStart(2, '0')}`} />
            </SuperUnifiedProvider>
        </QueryClientProvider>
    );
};

export default TestEditorWrapper;