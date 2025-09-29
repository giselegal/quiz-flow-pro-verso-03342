// Stub VersioningService to fix import errors
export interface VersionChange {
  id: string;
  type: 'create' | 'update' | 'delete' | 'restore';
  timestamp: Date;
  description: string;
}

export interface VersionSnapshot {
  id: string;
  timestamp: Date;
  data: any;
  metadata?: {
    tags?: string[];
  };
}

export interface VersionComparison {
  added: any[];
  removed: any[];
  modified: any[];
}

export type HistoryFilter = 'all' | 'create' | 'update' | 'delete' | 'restore';

export class VersioningService {
  async createVersion(data: any): Promise<void> {
    console.log('Creating version:', data);
  }

  async getVersionHistory(): Promise<VersionChange[]> {
    return [];
  }

  async restoreVersion(versionId: string): Promise<void> {
    console.log('Restoring version:', versionId);
  }

  async createSnapshot(data: any): Promise<VersionSnapshot> {
    return {
      id: 'snapshot-' + Date.now(),
      timestamp: new Date(),
      data,
      metadata: { tags: [] }
    };
  }

  async getVersions(): Promise<VersionSnapshot[]> {
    return [];
  }

  async getVersion(versionId: string): Promise<VersionSnapshot | null> {
    return null;
  }

  async compareVersions(v1: string, v2: string): Promise<VersionComparison> {
    return { added: [], removed: [], modified: [] };
  }

  async recordChange(type: VersionChange['type'], description: string): Promise<void> {
    console.log('Recording change:', type, description);
  }
}

export const versioningService = new VersioningService();