// Métricas simples de acompanhamento da decomposição de componentes
import { AnyComponent, ComponentKind } from './components';

interface ComponentDecompositionMetrics {
    total: number;
    rawLegacyBundles: number;
    typed: number;
    byKind: Record<string, number>;
    lastScanAt?: string;
}

const metrics: ComponentDecompositionMetrics = {
    total: 0,
    rawLegacyBundles: 0,
    typed: 0,
    byKind: {},
};

export function scanComponents(list: AnyComponent[]) {
    metrics.total = list.length;
    metrics.rawLegacyBundles = list.filter(c => c.kind === ComponentKind.RawLegacyBundle).length;
    metrics.typed = list.filter(c => c.kind !== ComponentKind.RawLegacyBundle).length;
    metrics.byKind = {};
    for (const c of list) metrics.byKind[c.kind] = (metrics.byKind[c.kind] || 0) + 1;
    metrics.lastScanAt = new Date().toISOString();
}

export function getComponentDecompositionMetrics(): ComponentDecompositionMetrics {
    return { ...metrics, byKind: { ...metrics.byKind } };
}
