import React, { Suspense } from 'react';
// Lazy via editor-bridge evita import estático de editor/*
const Inner = React.lazy(() => import('@/components/editor-bridge/quiz-modular').then(m => ({ default: m.ModularIntroStep })));

export default function ModularIntroStep(props: any) {
    return (
        <Suspense fallback={null}>
            <Inner {...props} />
        </Suspense>
    );
}
