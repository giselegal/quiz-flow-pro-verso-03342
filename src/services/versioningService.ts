/**
 * 🎯 VERSIONING SERVICE TYPES
 * Tipos para o serviço de versionamento
 */

import type { UnifiedFunnel } from './UnifiedCRUDService';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface VersionSnapshot {
    id: string;
    version: string;
    timestamp: Date;
    type: 'auto' | 'manual' | 'milestone';
    description?: string;
    funnel: UnifiedFunnel;
    metadata: {
        author?: string;
        sessionId?: string;
        stagesCount: number;
        blocksCount: number;
        changesCount: number;
        tags?: string[];
    };
}

export interface VersionComparison {
    versionA: VersionSnapshot;
    versionB: VersionSnapshot;
    summary: {
        blocksAdded: number;
        blocksModified: number;
        blocksRemoved: number;
        stepsChanged: number;
    };
    changes: Array<{
        id: string;
        type: 'added' | 'modified' | 'removed' | 'moved';
        entity: 'block' | 'stage' | 'property';
        entityId?: string;
        description: string;
        before?: any;
        after?: any;
    }>;
}

export interface VersioningStats {
    totalSnapshots: number;
    autoSnapshots: number;
    manualSnapshots: number;
    milestones: number;
    lastSnapshotDate: Date | null;
    averageChangesPerSnapshot: number;
    storageUsed: number;
}

// =============================================================================
// SERVICE PLACEHOLDER
// =============================================================================

export const versioningService = {
    createSnapshot: async (
        funnel: UnifiedFunnel,
        type: 'auto' | 'manual' | 'milestone' = 'manual',
        description?: string
    ): Promise<VersionSnapshot> => {
        throw new Error('VersioningService not implemented yet');
    },

    getSnapshot: (id: string): VersionSnapshot | null => null,

    getSnapshots: (): VersionSnapshot[] => [],

    getAllSnapshots: (): VersionSnapshot[] => [],

    getLatestSnapshot: (): VersionSnapshot | null => null,

    deleteSnapshot: async (id: string): Promise<boolean> => false,

    compareVersions: (idA: string, idB: string): VersionComparison | null => null,

    restoreSnapshot: async (id: string): Promise<UnifiedFunnel | null> => null,

    getStats: (): VersioningStats => ({
        totalSnapshots: 0,
        autoSnapshots: 0,
        manualSnapshots: 0,
        milestones: 0,
        lastSnapshotDate: null,
        averageChangesPerSnapshot: 0,
        storageUsed: 0,
    }),
};