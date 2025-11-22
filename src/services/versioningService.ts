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
// STORAGE CONSTANTS
// =============================================================================

const STORAGE_KEY = 'quiz-flow-version-snapshots';
const MAX_SNAPSHOTS = 50; // Maximum number of snapshots to keep

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateId(): string {
  return `snapshot_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function generateVersion(type: 'auto' | 'manual' | 'milestone'): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').split('T');
  const prefix = type === 'milestone' ? 'M' : type === 'auto' ? 'A' : 'V';
  return `${prefix}-${timestamp[0]}-${timestamp[1].split('Z')[0]}`;
}

function countBlocks(funnel: UnifiedFunnel): number {
  if (!funnel.stages) return 0;
  return funnel.stages.reduce((total, stage) => {
    return total + (stage.components?.length || 0);
  }, 0);
}

function calculateChanges(oldFunnel: UnifiedFunnel | null, newFunnel: UnifiedFunnel): number {
  if (!oldFunnel) return 0;
  let changes = 0;
  
  // Count stage changes
  if (oldFunnel.stages?.length !== newFunnel.stages?.length) {
    changes += Math.abs((oldFunnel.stages?.length || 0) - (newFunnel.stages?.length || 0));
  }
  
  // Count block changes
  const oldBlocks = countBlocks(oldFunnel);
  const newBlocks = countBlocks(newFunnel);
  changes += Math.abs(oldBlocks - newBlocks);
  
  return changes;
}

// In-memory fallback storage for environments without localStorage (e.g., Node.js tests)
let memoryStorage: VersionSnapshot[] = [];

function isLocalStorageAvailable(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage !== null;
  } catch {
    return false;
  }
}

function loadSnapshots(): VersionSnapshot[] {
  try {
    if (!isLocalStorageAvailable()) {
      // Use in-memory storage for Node.js/test environments
      return memoryStorage;
    }
    
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const snapshots = JSON.parse(data);
    // Convert timestamp strings back to Date objects
    return snapshots.map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp),
    }));
  } catch (error) {
    console.error('Failed to load snapshots:', error);
    return [];
  }
}

function saveSnapshots(snapshots: VersionSnapshot[]): void {
  try {
    if (!isLocalStorageAvailable()) {
      // Use in-memory storage for Node.js/test environments
      memoryStorage = snapshots;
      return;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
  } catch (error) {
    console.error('Failed to save snapshots:', error);
    // Only throw in browser environments where localStorage should work
    if (!isLocalStorageAvailable()) {
      // Fallback to memory storage in non-browser environments
      memoryStorage = snapshots;
    } else {
      throw new Error('Failed to save snapshot to storage');
    }
  }
}

function compareObjects(objA: any, objB: any, path: string = ''): Array<{
  type: 'added' | 'modified' | 'removed';
  path: string;
  before?: any;
  after?: any;
}> {
  const changes: Array<{ type: 'added' | 'modified' | 'removed'; path: string; before?: any; after?: any }> = [];
  
  if (typeof objA !== typeof objB) {
    changes.push({ type: 'modified', path, before: objA, after: objB });
    return changes;
  }
  
  if (typeof objA !== 'object' || objA === null || objB === null) {
    if (objA !== objB) {
      changes.push({ type: 'modified', path, before: objA, after: objB });
    }
    return changes;
  }
  
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  
  // Check for removed and modified keys
  for (const key of keysA) {
    const newPath = path ? `${path}.${key}` : key;
    if (!(key in objB)) {
      changes.push({ type: 'removed', path: newPath, before: objA[key] });
    } else {
      changes.push(...compareObjects(objA[key], objB[key], newPath));
    }
  }
  
  // Check for added keys
  for (const key of keysB) {
    if (!(key in objA)) {
      const newPath = path ? `${path}.${key}` : key;
      changes.push({ type: 'added', path: newPath, after: objB[key] });
    }
  }
  
  return changes;
}

// =============================================================================
// SERVICE IMPLEMENTATION
// =============================================================================

export const versioningService = {
  createSnapshot: async (
    funnel: UnifiedFunnel,
    type: 'auto' | 'manual' | 'milestone' = 'manual',
    description?: string
  ): Promise<VersionSnapshot> => {
    const snapshots = loadSnapshots();
    const latestSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
    
    const snapshot: VersionSnapshot = {
      id: generateId(),
      version: generateVersion(type),
      timestamp: new Date(),
      type,
      description,
      funnel: JSON.parse(JSON.stringify(funnel)), // Deep clone
      metadata: {
        sessionId: `session_${Date.now()}`,
        stagesCount: funnel.stages?.length || 0,
        blocksCount: countBlocks(funnel),
        changesCount: calculateChanges(latestSnapshot?.funnel || null, funnel),
      },
    };
    
    snapshots.push(snapshot);
    
    // Keep only the last MAX_SNAPSHOTS
    if (snapshots.length > MAX_SNAPSHOTS) {
      snapshots.splice(0, snapshots.length - MAX_SNAPSHOTS);
    }
    
    saveSnapshots(snapshots);
    return snapshot;
  },

  getSnapshot: (id: string): VersionSnapshot | null => {
    const snapshots = loadSnapshots();
    return snapshots.find(s => s.id === id) || null;
  },

  getSnapshots: (): VersionSnapshot[] => {
    return loadSnapshots();
  },

  getAllSnapshots: (): VersionSnapshot[] => {
    return loadSnapshots();
  },

  getLatestSnapshot: (): VersionSnapshot | null => {
    const snapshots = loadSnapshots();
    return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  },

  deleteSnapshot: async (id: string): Promise<boolean> => {
    const snapshots = loadSnapshots();
    const index = snapshots.findIndex(s => s.id === id);
    
    if (index === -1) return false;
    
    snapshots.splice(index, 1);
    saveSnapshots(snapshots);
    return true;
  },

  compareVersions: (idA: string, idB: string): VersionComparison | null => {
    const snapshots = loadSnapshots();
    const snapshotA = snapshots.find(s => s.id === idA);
    const snapshotB = snapshots.find(s => s.id === idB);
    
    if (!snapshotA || !snapshotB) return null;
    
    const blocksA = countBlocks(snapshotA.funnel);
    const blocksB = countBlocks(snapshotB.funnel);
    const stagesA = snapshotA.funnel.stages?.length || 0;
    const stagesB = snapshotB.funnel.stages?.length || 0;
    
    const objectChanges = compareObjects(snapshotA.funnel, snapshotB.funnel);
    
    const changes = objectChanges.map((change, index) => ({
      id: `change_${index}`,
      type: change.type === 'added' ? 'added' as const : 
            change.type === 'removed' ? 'removed' as const : 'modified' as const,
      entity: change.path.includes('stage') ? 'stage' as const :
              change.path.includes('component') || change.path.includes('block') ? 'block' as const : 'property' as const,
      entityId: change.path,
      description: `${change.type} ${change.path}`,
      before: change.before,
      after: change.after,
    }));
    
    return {
      versionA: snapshotA,
      versionB: snapshotB,
      summary: {
        blocksAdded: Math.max(0, blocksB - blocksA),
        blocksModified: changes.filter(c => c.type === 'modified' && c.entity === 'block').length,
        blocksRemoved: Math.max(0, blocksA - blocksB),
        stepsChanged: Math.abs(stagesB - stagesA),
      },
      changes,
    };
  },

  restoreSnapshot: async (id: string): Promise<UnifiedFunnel | null> => {
    const snapshot = versioningService.getSnapshot(id);
    if (!snapshot) return null;
    
    // Return a deep clone of the funnel
    return JSON.parse(JSON.stringify(snapshot.funnel));
  },

  getStats: (): VersioningStats => {
    const snapshots = loadSnapshots();
    
    if (snapshots.length === 0) {
      return {
        totalSnapshots: 0,
        autoSnapshots: 0,
        manualSnapshots: 0,
        milestones: 0,
        lastSnapshotDate: null,
        averageChangesPerSnapshot: 0,
        storageUsed: 0,
      };
    }
    
    const autoSnapshots = snapshots.filter(s => s.type === 'auto').length;
    const manualSnapshots = snapshots.filter(s => s.type === 'manual').length;
    const milestones = snapshots.filter(s => s.type === 'milestone').length;
    const lastSnapshotDate = snapshots[snapshots.length - 1].timestamp;
    
    const totalChanges = snapshots.reduce((sum, s) => sum + s.metadata.changesCount, 0);
    const averageChangesPerSnapshot = totalChanges / snapshots.length;
    
    // Estimate storage used
    let storageUsed = 0;
    try {
      if (isLocalStorageAvailable()) {
        const storageString = localStorage.getItem(STORAGE_KEY) || '';
        storageUsed = new Blob([storageString]).size;
      } else {
        // For non-browser environments, estimate from memory storage
        const memoryString = JSON.stringify(snapshots);
        storageUsed = new Blob([memoryString]).size;
      }
    } catch (error) {
      // Fallback: rough estimate based on JSON length
      const jsonString = JSON.stringify(snapshots);
      storageUsed = jsonString.length;
    }
    
    return {
      totalSnapshots: snapshots.length,
      autoSnapshots,
      manualSnapshots,
      milestones,
      lastSnapshotDate,
      averageChangesPerSnapshot,
      storageUsed,
    };
  },
};


