import React, { Suspense } from 'react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
const Inner = React.lazy(() => import('@/components/editor-bridge/quiz-modular').then(m => ({ default: m.ModularTransitionStep })));
export default function ModularTransitionStep(props: any) {
    return (
        <ErrorBoundary componentName="ModularTransitionStep">
            <Suspense fallback={<div className="p-4 text-sm text-slate-500">Carregando componente modular...</div>}>
                <Inner {...props} />
            </Suspense>
        </ErrorBoundary>
    );
}
