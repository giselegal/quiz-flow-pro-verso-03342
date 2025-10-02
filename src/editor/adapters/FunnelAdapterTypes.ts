// Arquitetura de Adapters Multi-Funil
// Permite converter entre UnifiedFunnelData (fonte persistida) e FunnelSnapshot (usado pela fachada)

import type { FunnelSnapshot } from '@/editor/facade/FunnelEditingFacade';
import type { UnifiedFunnelData } from '@/services/FunnelUnifiedService';

export interface IFunnelAdapter {
    readonly type: string;
    supports(funnel: UnifiedFunnelData | null): boolean;
    toSnapshot(funnel: UnifiedFunnelData | null): FunnelSnapshot;
    applySnapshot(snapshot: FunnelSnapshot, base: UnifiedFunnelData): UnifiedFunnelData; // não salva, apenas retorna estrutura atualizada
}

export interface AdapterResolution {
    adapter: IFunnelAdapter;
    snapshot: FunnelSnapshot;
}
