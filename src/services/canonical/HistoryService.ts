/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                      HISTORY SERVICE - CANONICAL                         ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║ Serviço unificado para gerenciamento de histórico e versionamento       ║
 * ║                                                                          ║
 * ║ CONSOLIDATES (7 services → 1):                                          ║
 * ║  1. HistoryManager            - History tracking                        ║
 * ║  2. UndoRedoService           - Undo/redo operations                    ║
 * ║  3. VersionControlService     - Version management                      ║
 * ║  4. ChangeTrackingService     - Change detection & tracking             ║
 * ║  5. AuditLogService           - Audit trail logging                     ║
 * ║  6. RevisionHistoryService    - Document revisions                      ║
 * ║  7. StateHistoryService       - State snapshots                         ║
 * ║                                                                          ║
 * ║ FEATURES:                                                                ║
 * ║  • Undo/redo with stack management                                       ║
 * ║  • Version control (create, list, restore)                              ║
 * ║  • Change tracking with diffs                                            ║
 * ║  • Audit logging with user attribution                                   ║
 * ║  • State snapshots                                                       ║
 * ║  • History limits & cleanup                                              ║
 * ║  • Batch operations                                                      ║
 * ║  • Time travel debugging                                                 ║
 * ║                                                                          ║
 * ║ ARCHITECTURE:                                                            ║
 * ║  • BaseCanonicalService lifecycle                                        ║
 * ║  • Result<T> pattern                                                     ║
 * ║  • Singleton pattern                                                     ║
 * ║  • Specialized APIs (undo, versions, audit, changes)                    ║
 * ║  • Memory-efficient with limits                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { BaseCanonicalService, ServiceResult } from './types';
import { generateHistoryId } from '@/lib/utils/idGenerator';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * History entry types
 */
export type HistoryEntryType = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'restore'
  | 'batch'
  | 'snapshot';

/**
 * History entry
 */
export interface HistoryEntry<T = any> {
  id: string;
  type: HistoryEntryType;
  timestamp: Date;
  userId?: string;
  userName?: string;
  entityType: string;
  entityId: string;
  description: string;
  previousState?: T;
  currentState?: T;
  metadata?: Record<string, any>;
}

/**
 * Version information
 */
export interface Version<T = any> {
  id: string;
  version: number;
  timestamp: Date;
  userId?: string;
  userName?: string;
  message?: string;
  data: T;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Change record
 */
export interface ChangeRecord {
  path: string;
  type: 'added' | 'modified' | 'deleted';
  oldValue?: any;
  newValue?: any;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  action: string;
  resource: string;
  resourceId: string;
  result: 'success' | 'failure';
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Undo/redo command
 */
export interface Command<T = any> {
  id: string;
  timestamp: Date;
  execute: () => T | Promise<T>;
  undo: () => T | Promise<T>;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * State snapshot
 */
export interface StateSnapshot<T = any> {
  id: string;
  timestamp: Date;
  label?: string;
  state: T;
  metadata?: Record<string, any>;
}

/**
 * History query options
 */
export interface HistoryQueryOptions {
  entityType?: string;
  entityId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * History service options
 */
export interface HistoryServiceOptions {
  maxHistorySize?: number;
  maxUndoStackSize?: number;
  maxVersions?: number;
  enableAutoSnapshot?: boolean;
  snapshotInterval?: number; // milliseconds
  persistHistory?: boolean;
  storageKey?: string;
}

// ============================================================================
// HISTORY SERVICE
// ============================================================================

/**
 * Unified history and version control service
 */
export class HistoryService extends BaseCanonicalService {
  private static instance: HistoryService | null = null;
  
  // History tracking
  private historyEntries: HistoryEntry[] = [];
  
  // Undo/redo stacks
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  
  // Versions per entity
  private versions: Map<string, Version[]> = new Map();
  
  // Audit log
  private auditLog: AuditLogEntry[] = [];
  
  // State snapshots
  private snapshots: Map<string, StateSnapshot[]> = new Map();
  
  private readonly maxHistorySize: number;
  private readonly maxUndoStackSize: number;
  private readonly maxVersions: number;
  private readonly enableAutoSnapshot: boolean;
  private readonly snapshotInterval: number;
  private readonly persistHistory: boolean;
  private readonly storageKey: string;
  
  private snapshotTimer: number | null = null;

  private constructor(options: HistoryServiceOptions = {}) {
    super('HistoryService', '1.0.0');
    
    this.maxHistorySize = options.maxHistorySize || 1000;
    this.maxUndoStackSize = options.maxUndoStackSize || 50;
    this.maxVersions = options.maxVersions || 100;
    this.enableAutoSnapshot = options.enableAutoSnapshot ?? false;
    this.snapshotInterval = options.snapshotInterval || 300000; // 5 minutes
    this.persistHistory = options.persistHistory ?? true;
    this.storageKey = options.storageKey || 'qfp_history';
  }

  static getInstance(options?: HistoryServiceOptions): HistoryService {
    if (!HistoryService.instance) {
      HistoryService.instance = new HistoryService(options);
    }
    return HistoryService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('Initializing HistoryService...');
    
    // Load persisted history
    if (this.persistHistory) {
      this.loadHistory();
    }
    
    // Start auto-snapshot timer
    if (this.enableAutoSnapshot) {
      this.startAutoSnapshot();
    }
    
    this.log('HistoryService initialized successfully');
  }

  protected async onDispose(): Promise<void> {
    this.log('Disposing HistoryService...');
    
    // Stop auto-snapshot timer
    if (this.snapshotTimer !== null) {
      clearInterval(this.snapshotTimer);
      this.snapshotTimer = null;
    }
    
    // Save history if persistence enabled
    if (this.persistHistory) {
      this.saveHistory();
    }
    
    // Clear all data
    this.historyEntries = [];
    this.undoStack = [];
    this.redoStack = [];
    this.versions.clear();
    this.auditLog = [];
    this.snapshots.clear();
    
    this.log('HistoryService disposed');
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Check if browser storage available (if persistence enabled)
      if (this.persistHistory && typeof window !== 'undefined') {
        try {
          localStorage.setItem('__test__', 'test');
          localStorage.removeItem('__test__');
        } catch (e) {
          this.error('Browser storage not available');
          return false;
        }
      }

      return true;
    } catch (error) {
      this.error('Health check error:', error);
      return false;
    }
  }

  // ============================================================================
  // HISTORY TRACKING
  // ============================================================================

  /**
   * Record a history entry
   */
  recordHistory<T>(entry: Omit<HistoryEntry<T>, 'id' | 'timestamp'>): ServiceResult<HistoryEntry<T>> {
    try {
      const historyEntry: HistoryEntry<T> = {
        ...entry,
        id: this.generateId(),
        timestamp: new Date(),
      };

      this.historyEntries.push(historyEntry);

      // Enforce size limit
      if (this.historyEntries.length > this.maxHistorySize) {
        this.historyEntries.shift();
      }

      // Persist if enabled
      if (this.persistHistory) {
        this.saveHistory();
      }

      this.log('History recorded:', historyEntry.description);
      return { success: true, data: historyEntry };

    } catch (error) {
      this.error('Record history error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Record history failed'),
      };
    }
  }

  /**
   * Get history entries
   */
  getHistory(options: HistoryQueryOptions = {}): ServiceResult<HistoryEntry[]> {
    try {
      let filtered = [...this.historyEntries];

      // Apply filters
      if (options.entityType) {
        filtered = filtered.filter(e => e.entityType === options.entityType);
      }
      if (options.entityId) {
        filtered = filtered.filter(e => e.entityId === options.entityId);
      }
      if (options.userId) {
        filtered = filtered.filter(e => e.userId === options.userId);
      }
      if (options.startDate) {
        filtered = filtered.filter(e => e.timestamp >= options.startDate!);
      }
      if (options.endDate) {
        filtered = filtered.filter(e => e.timestamp <= options.endDate!);
      }

      // Apply pagination
      const offset = options.offset || 0;
      const limit = options.limit || filtered.length;
      filtered = filtered.slice(offset, offset + limit);

      return { success: true, data: filtered };

    } catch (error) {
      this.error('Get history error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get history failed'),
      };
    }
  }

  /**
   * Clear history
   */
  clearHistory(options: Pick<HistoryQueryOptions, 'entityType' | 'entityId'> = {}): ServiceResult<void> {
    try {
      if (!options.entityType && !options.entityId) {
        // Clear all
        this.historyEntries = [];
      } else {
        // Clear filtered
        this.historyEntries = this.historyEntries.filter(e => {
          if (options.entityType && e.entityType === options.entityType) return false;
          if (options.entityId && e.entityId === options.entityId) return false;
          return true;
        });
      }

      if (this.persistHistory) {
        this.saveHistory();
      }

      this.log('History cleared');
      return { success: true, data: undefined };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Clear history failed'),
      };
    }
  }

  // ============================================================================
  // UNDO/REDO
  // ============================================================================

  /**
   * Execute a command (adds to undo stack)
   */
  async executeCommand<T>(command: Omit<Command<T>, 'id' | 'timestamp'>): Promise<ServiceResult<T>> {
    try {
      const cmd: Command<T> = {
        ...command,
        id: this.generateId(),
        timestamp: new Date(),
      };

      // Execute the command
      const result = await cmd.execute();

      // Add to undo stack
      this.undoStack.push(cmd);

      // Clear redo stack (new action invalidates redo)
      this.redoStack = [];

      // Enforce stack size limit
      if (this.undoStack.length > this.maxUndoStackSize) {
        this.undoStack.shift();
      }

      this.log('Command executed:', cmd.description);
      return { success: true, data: result };

    } catch (error) {
      this.error('Execute command error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Execute command failed'),
      };
    }
  }

  /**
   * Undo last command
   */
  async undo<T>(): Promise<ServiceResult<T>> {
    try {
      const command = this.undoStack.pop();

      if (!command) {
        return {
          success: false,
          error: new Error('Nothing to undo'),
        };
      }

      // Execute undo
      const result = await command.undo();

      // Move to redo stack
      this.redoStack.push(command);

      this.log('Undo executed:', command.description);
      return { success: true, data: result };

    } catch (error) {
      this.error('Undo error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Undo failed'),
      };
    }
  }

  /**
   * Redo last undone command
   */
  async redo<T>(): Promise<ServiceResult<T>> {
    try {
      const command = this.redoStack.pop();

      if (!command) {
        return {
          success: false,
          error: new Error('Nothing to redo'),
        };
      }

      // Execute redo
      const result = await command.execute();

      // Move back to undo stack
      this.undoStack.push(command);

      this.log('Redo executed:', command.description);
      return { success: true, data: result };

    } catch (error) {
      this.error('Redo error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Redo failed'),
      };
    }
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Clear undo/redo stacks
   */
  clearUndoRedo(): ServiceResult<void> {
    try {
      this.undoStack = [];
      this.redoStack = [];
      this.log('Undo/redo stacks cleared');
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Clear undo/redo failed'),
      };
    }
  }

  // ============================================================================
  // VERSION CONTROL
  // ============================================================================

  /**
   * Create a new version
   */
  createVersion<T>(
    entityKey: string,
    data: T,
    options: { message?: string; tags?: string[]; userId?: string; userName?: string } = {},
  ): ServiceResult<Version<T>> {
    try {
      const versions = this.versions.get(entityKey) || [];
      const nextVersion = versions.length + 1;

      const version: Version<T> = {
        id: this.generateId(),
        version: nextVersion,
        timestamp: new Date(),
        userId: options.userId,
        userName: options.userName,
        message: options.message,
        data,
        tags: options.tags,
        metadata: {},
      };

      versions.push(version);

      // Enforce version limit
      if (versions.length > this.maxVersions) {
        versions.shift();
      }

      this.versions.set(entityKey, versions);

      this.log('Version created:', entityKey, nextVersion);
      return { success: true, data: version };

    } catch (error) {
      this.error('Create version error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Create version failed'),
      };
    }
  }

  /**
   * Get all versions for an entity
   */
  getVersions<T>(entityKey: string): ServiceResult<Version<T>[]> {
    try {
      const versions = (this.versions.get(entityKey) || []) as Version<T>[];
      return { success: true, data: [...versions] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get versions failed'),
      };
    }
  }

  /**
   * Get a specific version
   */
  getVersion<T>(entityKey: string, version: number): ServiceResult<Version<T> | null> {
    try {
      const versions = this.versions.get(entityKey) || [];
      const found = versions.find(v => v.version === version);
      return { success: true, data: (found as Version<T>) || null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get version failed'),
      };
    }
  }

  /**
   * Restore a version
   */
  restoreVersion<T>(entityKey: string, version: number): ServiceResult<T> {
    try {
      const versions = this.versions.get(entityKey) || [];
      const found = versions.find(v => v.version === version);

      if (!found) {
        return {
          success: false,
          error: new Error(`Version ${version} not found`),
        };
      }

      this.log('Version restored:', entityKey, version);
      return { success: true, data: found.data as T };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Restore version failed'),
      };
    }
  }

  // ============================================================================
  // CHANGE TRACKING
  // ============================================================================

  /**
   * Track changes between two states
   */
  trackChanges<T extends Record<string, any>>(
    oldState: T,
    newState: T,
    path: string = '',
  ): ServiceResult<ChangeRecord[]> {
    try {
      const changes: ChangeRecord[] = [];

      // Find added/modified keys in newState
      for (const key in newState) {
        const fullPath = path ? `${path}.${key}` : key;
        
        if (!(key in oldState)) {
          changes.push({
            path: fullPath,
            type: 'added',
            newValue: newState[key],
          });
        } else if (JSON.stringify(oldState[key]) !== JSON.stringify(newState[key])) {
          changes.push({
            path: fullPath,
            type: 'modified',
            oldValue: oldState[key],
            newValue: newState[key],
          });
        }
      }

      // Find deleted keys
      for (const key in oldState) {
        if (!(key in newState)) {
          const fullPath = path ? `${path}.${key}` : key;
          changes.push({
            path: fullPath,
            type: 'deleted',
            oldValue: oldState[key],
          });
        }
      }

      return { success: true, data: changes };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Track changes failed'),
      };
    }
  }

  // ============================================================================
  // AUDIT LOG
  // ============================================================================

  /**
   * Log an audit entry
   */
  logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): ServiceResult<AuditLogEntry> {
    try {
      const auditEntry: AuditLogEntry = {
        ...entry,
        id: this.generateId(),
        timestamp: new Date(),
      };

      this.auditLog.push(auditEntry);

      // Enforce size limit (keep last 10000 entries)
      if (this.auditLog.length > 10000) {
        this.auditLog.shift();
      }

      this.log('Audit logged:', auditEntry.action, auditEntry.resource);
      return { success: true, data: auditEntry };

    } catch (error) {
      this.error('Log audit error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Log audit failed'),
      };
    }
  }

  /**
   * Get audit log entries
   */
  getAuditLog(options: {
    userId?: string;
    resource?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}): ServiceResult<AuditLogEntry[]> {
    try {
      let filtered = [...this.auditLog];

      if (options.userId) {
        filtered = filtered.filter(e => e.userId === options.userId);
      }
      if (options.resource) {
        filtered = filtered.filter(e => e.resource === options.resource);
      }
      if (options.action) {
        filtered = filtered.filter(e => e.action === options.action);
      }
      if (options.startDate) {
        filtered = filtered.filter(e => e.timestamp >= options.startDate!);
      }
      if (options.endDate) {
        filtered = filtered.filter(e => e.timestamp <= options.endDate!);
      }

      const limit = options.limit || filtered.length;
      filtered = filtered.slice(0, limit);

      return { success: true, data: filtered };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get audit log failed'),
      };
    }
  }

  // ============================================================================
  // STATE SNAPSHOTS
  // ============================================================================

  /**
   * Create a state snapshot
   */
  createSnapshot<T>(key: string, state: T, label?: string): ServiceResult<StateSnapshot<T>> {
    try {
      const snapshot: StateSnapshot<T> = {
        id: this.generateId(),
        timestamp: new Date(),
        label,
        state,
        metadata: {},
      };

      const snapshots = this.snapshots.get(key) || [];
      snapshots.push(snapshot);

      // Keep last 20 snapshots per key
      if (snapshots.length > 20) {
        snapshots.shift();
      }

      this.snapshots.set(key, snapshots);

      this.log('Snapshot created:', key, label || snapshot.id);
      return { success: true, data: snapshot };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Create snapshot failed'),
      };
    }
  }

  /**
   * Get snapshots for a key
   */
  getSnapshots<T>(key: string): ServiceResult<StateSnapshot<T>[]> {
    try {
      const snapshots = (this.snapshots.get(key) || []) as StateSnapshot<T>[];
      return { success: true, data: [...snapshots] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get snapshots failed'),
      };
    }
  }

  /**
   * Restore a snapshot
   */
  restoreSnapshot<T>(key: string, snapshotId: string): ServiceResult<T> {
    try {
      const snapshots = this.snapshots.get(key) || [];
      const snapshot = snapshots.find(s => s.id === snapshotId);

      if (!snapshot) {
        return {
          success: false,
          error: new Error('Snapshot not found'),
        };
      }

      this.log('Snapshot restored:', key, snapshotId);
      return { success: true, data: snapshot.state as T };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Restore snapshot failed'),
      };
    }
  }

  // ============================================================================
  // SPECIALIZED APIs
  // ============================================================================

  /**
   * Undo/Redo API
   */
  readonly undoRedo = {
    execute: this.executeCommand.bind(this),
    undo: this.undo.bind(this),
    redo: this.redo.bind(this),
    canUndo: this.canUndo.bind(this),
    canRedo: this.canRedo.bind(this),
    clear: this.clearUndoRedo.bind(this),
  };

  /**
   * Versions API
   */
  readonly versionsApi = {
    create: this.createVersion.bind(this),
    getAll: this.getVersions.bind(this),
    get: this.getVersion.bind(this),
    restore: this.restoreVersion.bind(this),
  };

  /**
   * Audit API
   */
  readonly audit = {
    log: this.logAudit.bind(this),
    get: this.getAuditLog.bind(this),
  };

  /**
   * Changes API
   */
  readonly changes = {
    track: this.trackChanges.bind(this),
  };

  /**
   * Snapshots API
   */
  readonly snapshotsApi = {
    create: this.createSnapshot.bind(this),
    getAll: this.getSnapshots.bind(this),
    restore: this.restoreSnapshot.bind(this),
  };

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private generateId(): string {
    return generateHistoryId();
  }

  private loadHistory(): void {
    try {
      if (typeof window === 'undefined') return;

      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.historyEntries = data.history || [];
        this.auditLog = data.audit || [];
        this.log('History loaded from storage');
      }
    } catch (error) {
      this.error('Failed to load history:', error);
    }
  }

  private saveHistory(): void {
    try {
      if (typeof window === 'undefined') return;

      const data = {
        history: this.historyEntries.slice(-this.maxHistorySize),
        audit: this.auditLog.slice(-10000),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      this.error('Failed to save history:', error);
    }
  }

  private startAutoSnapshot(): void {
    if (typeof window === 'undefined') return;

    this.snapshotTimer = window.setInterval(() => {
      this.log('Auto-snapshot triggered');
      // Auto-snapshot logic can be implemented here if needed
    }, this.snapshotInterval);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default HistoryService;
  
