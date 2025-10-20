import React, { Suspense } from 'react';
const Inner = React.lazy(() => import('@/components/editor-bridge/quiz-modular').then(m => ({ default: m.ModularOfferStep })));
export default function ModularOfferStep(props: any) {
    return (
        <Suspense fallback={null}>
            <Inner {...props} />
        </Suspense>
    );
}
