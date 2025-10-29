import React, { Suspense } from 'react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
// Lazy via editor-bridge evita import estático de editor/*
const Inner = React.lazy(() => import('@/components/editor-bridge/quiz-modular').then(m => ({ default: m.ModularIntroStep })));

export default function ModularIntroStep(props: any) {
    return (
        <ErrorBoundary componentName="ModularIntroStep">
            <Suspense fallback={<div className="p-4 text-sm text-slate-500">Carregando componente modular...</div>}>
                <Inner {...props} />
            </Suspense>
        </ErrorBoundary>
    );
}
