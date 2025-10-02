import type { UnifiedFunnelData } from '@/services/FunnelUnifiedService';
import { IFunnelAdapter, AdapterResolution } from './FunnelAdapterTypes';
import { quizFunnelAdapter } from './QuizFunnelAdapter';
import type { FunnelSnapshot } from '@/editor/facade/FunnelEditingFacade';

const registry: IFunnelAdapter[] = [quizFunnelAdapter];

export function registerFunnelAdapter(adapter: IFunnelAdapter) {
    if (!registry.includes(adapter)) registry.push(adapter);
}

export function resolveAdapter(funnel: UnifiedFunnelData | null): AdapterResolution {
    const adapter = registry.find(a => a.supports(funnel)) || quizFunnelAdapter;
    return { adapter, snapshot: adapter.toSnapshot(funnel) };
}

export async function applySnapshotAndPersist(adapter: IFunnelAdapter, snapshot: FunnelSnapshot, funnel: UnifiedFunnelData, save: (updated: UnifiedFunnelData) => Promise<void>) {
    const updated = adapter.applySnapshot(snapshot, funnel);
    await save(updated);
}
