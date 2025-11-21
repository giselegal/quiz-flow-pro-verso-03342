/**
 * 🗂️ VERSIONING SERVICE - STUB
 * Stub temporário para desbloquear build
 */

import { appLogger } from '@/lib/utils/appLogger';

export interface Version {
  id: string;
  timestamp: string;
  metadata: {
    author?: string;
    tags?: string[];
    description?: string;
  };
  changes: any[];
}

export interface VersionSnapshot {
  id: string;
  version: string;
  type: 'auto' | 'manual' | 'milestone';
  timestamp: Date | string;
  description?: string;
  metadata: {
    author?: string;
    tags?: string[];
    description?: string;
    stagesCount?: number;
    blocksCount?: number;
    changesCount?: number;
  };
  data: any;
}

export interface VersionComparison {
  id: string;
  timestamp: string;
  versionA: VersionSnapshot;
  versionB: VersionSnapshot;
  summary: {
    blocksAdded: number;
    blocksRemoved: number;
    blocksModified: number;
    stepsChanged: number;
  };
  changes: Array<{
    id: string;
    type: 'added' | 'modified' | 'removed';
    path: string;
    oldValue?: any;
    newValue?: any;
    entity: string;
    description: string;
  }>;
}

export class VersioningService {
  async getVersions(): Promise<Version[]> {
    appLogger.warn('[VersioningService] Stub - getVersions não implementado');
    return [];
  }

  async saveVersion(data: any): Promise<string> {
    appLogger.warn('[VersioningService] Stub - saveVersion não implementado');
    return 'stub-version-id';
  }

  async restoreVersion(versionId: string): Promise<void> {
    appLogger.warn('[VersioningService] Stub - restoreVersion não implementado', { versionId });
  }
}

export const versioningService = new VersioningService();
export default versioningService;
