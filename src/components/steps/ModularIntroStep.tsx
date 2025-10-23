// Deprecated: mantenha este arquivo como shim para compatibilidade; redireciona para wrapper modular real.
import React from 'react';
const Inner = React.lazy(() => import('@/components/core/quiz-modular/ModularIntroStep'));
export default function ModularIntroStepShim(props: any) {
    return <React.Suspense fallback={null}><Inner {...props} /></React.Suspense>;
}
