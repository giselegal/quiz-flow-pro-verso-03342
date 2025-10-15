/**
 * Persistence Service Stub - Legacy compatibility
 */
import type { FunnelState } from '../types';

export interface FunnelPersistenceData {
    id: string;
    state: FunnelState;
}

export interface SaveFunnelOptions {
    autoPublish?: boolean;
    userId?: string;
}

export interface LoadFunnelOptions {
    includeUnpublished?: boolean;
}

export interface FunnelListItem {
    id: string;
    name: string;
    category: string;
    updatedAt: string;
}

export class PersistenceService {
    async saveFunnel(state: FunnelState, options?: SaveFunnelOptions): Promise<void> { 
        return; 
    }
    async loadFunnel(funnelId: string): Promise<FunnelState | null> { 
        return null; 
    }
    async listFunnels(userId?: string, options?: LoadFunnelOptions): Promise<FunnelListItem[]> { 
        return []; 
    }
    async deleteFunnel(funnelId: string): Promise<boolean> { 
        return true; 
    }
}

export const persistenceService = new PersistenceService();
