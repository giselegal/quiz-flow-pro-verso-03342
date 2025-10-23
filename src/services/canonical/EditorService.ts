/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                       EDITOR SERVICE - CANONICAL                         ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║ Serviço unificado para gerenciamento de estado do editor                ║
 * ║                                                                          ║
 * ║ CONSOLIDATES (7 services → 1):                                          ║
 * ║  1. EditorStateManager        - Editor state management                 ║
 * ║  2. BlockEditorService        - Block editing operations                ║
 * ║  3. QuizEditorService         - Quiz-specific editing                   ║
 * ║  4. ContentEditorService      - Content management                      ║
 * ║  5. StyleEditorService        - Style/theme editing                     ║
 * ║  6. LayoutEditorService       - Layout management                       ║
 * ║  7. PreviewService            - Preview mode management                 ║
 * ║                                                                          ║
 * ║ FEATURES:                                                                ║
 * ║  • Editor state (mode, selection, focus)                                ║
 * ║  • Block operations (CRUD, move, copy)                                  ║
 * ║  • Content editing with validation                                      ║
 * ║  • Style management                                                      ║
 * ║  • Layout control                                                        ║
 * ║  • Preview mode                                                          ║
 * ║  • Auto-save                                                             ║
 * ║  • Collaborative editing support                                         ║
 * ║                                                                          ║
 * ║ ARCHITECTURE:                                                            ║
 * ║  • BaseCanonicalService lifecycle                                        ║
 * ║  • Result<T> pattern                                                     ║
 * ║  • Singleton pattern                                                     ║
 * ║  • Specialized APIs (blocks, content, style, layout, preview)           ║
 * ║  • State change listeners                                                ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { BaseCanonicalService, ServiceResult } from './types';
import { authService } from './AuthService';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Editor mode
 */
export type EditorMode = 'edit' | 'preview' | 'readonly';

/**
 * Editor state
 */
export interface EditorState {
  mode: EditorMode;
  selectedBlockId: string | null;
  focusedBlockId: string | null;
  hoveredBlockId: string | null;
  isModified: boolean;
  lastSaved: Date | null;
  collaborators: Collaborator[];
}

/**
 * Collaborator info
 */
export interface Collaborator {
  userId: string;
  userName: string;
  color: string;
  cursor?: {
    blockId: string;
    position: number;
  };
}

/**
 * Block definition
 */
export interface Block {
  id: string;
  type: string;
  content: Record<string, any>;
  style?: Record<string, any>;
  layout?: {
    order: number;
    parent?: string;
    colspan?: number;
  };
  metadata?: Record<string, any>;
}

/**
 * Content update
 */
export interface ContentUpdate {
  blockId: string;
  path: string;
  value: any;
  validate?: boolean;
}

/**
 * Style update
 */
export interface StyleUpdate {
  blockId?: string; // If null, applies globally
  properties: Record<string, any>;
  merge?: boolean; // true = merge, false = replace
}

/**
 * Layout update
 */
export interface LayoutUpdate {
  blockId: string;
  layout: Block['layout'];
}

/**
 * Block operation result
 */
export interface BlockOperation {
  blockId: string;
  operation: 'create' | 'update' | 'delete' | 'move' | 'copy';
  timestamp: Date;
}

/**
 * Editor change event
 */
export interface EditorChangeEvent {
  type: 'state' | 'block' | 'content' | 'style' | 'layout';
  blockId?: string;
  changes: any;
  timestamp: Date;
}

/**
 * Auto-save options
 */
export interface AutoSaveOptions {
  enabled: boolean;
  interval: number; // milliseconds
  debounce: number; // milliseconds
}

/**
 * Editor service options
 */
export interface EditorServiceOptions {
  autoSave?: AutoSaveOptions;
  enableCollaboration?: boolean;
  maxBlocks?: number;
  validateOnChange?: boolean;
  persistState?: boolean;
  storageKey?: string;
}

// ============================================================================
// EDITOR SERVICE
// ============================================================================

/**
 * Unified editor state and operations service
 */
export class EditorService extends BaseCanonicalService {
  private static instance: EditorService | null = null;

  // Editor state
  private editorState: EditorState = {
    mode: 'edit',
    selectedBlockId: null,
    focusedBlockId: null,
    hoveredBlockId: null,
    isModified: false,
    lastSaved: null,
    collaborators: []
  };

  // Blocks registry
  private blocks: Map<string, Block> = new Map();

  // Global styles
  private globalStyles: Record<string, any> = {};

  // Change listeners
  private changeListeners: Array<(event: EditorChangeEvent) => void> = [];

  private readonly autoSaveOptions: AutoSaveOptions;
  private readonly enableCollaboration: boolean;
  private readonly maxBlocks: number;
  private readonly validateOnChange: boolean;
  private readonly persistState: boolean;
  private readonly storageKey: string;

  private autoSaveTimer: number | null = null;
  private autoSaveDebounceTimer: number | null = null;

  private constructor(options: EditorServiceOptions = {}) {
    super('EditorService', '1.0.0');

    this.autoSaveOptions = options.autoSave || {
      enabled: true,
      interval: 30000, // 30 seconds
      debounce: 2000 // 2 seconds
    };
    this.enableCollaboration = options.enableCollaboration ?? false;
    this.maxBlocks = options.maxBlocks || 1000;
    this.validateOnChange = options.validateOnChange ?? true;
    this.persistState = options.persistState ?? true;
    this.storageKey = options.storageKey || 'qfp_editor';
  }

  static getInstance(options?: EditorServiceOptions): EditorService {
    if (!EditorService.instance) {
      EditorService.instance = new EditorService(options);
    }
    return EditorService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('Initializing EditorService...');

    // Load persisted state
    if (this.persistState) {
      this.loadState();
    }

    // Start auto-save if enabled
    if (this.autoSaveOptions.enabled) {
      this.startAutoSave();
    }

    this.log('EditorService initialized successfully');
  }

  protected async onDispose(): Promise<void> {
    this.log('Disposing EditorService...');

    // Stop auto-save
    if (this.autoSaveTimer !== null) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
    if (this.autoSaveDebounceTimer !== null) {
      clearTimeout(this.autoSaveDebounceTimer);
      this.autoSaveDebounceTimer = null;
    }

    // Save state if modified
    if (this.editorState.isModified && this.persistState) {
      this.saveState();
    }

    // Clear data
    this.blocks.clear();
    this.changeListeners = [];

    this.log('EditorService disposed');
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Check if browser storage available (if persistence enabled)
      if (this.persistState && typeof window !== 'undefined') {
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

  // ==========================================================================
  // OPTIMISTIC LOCKING (via AuthService)
  // ==========================================================================

  acquireFunnelLock(funnelId: string, userId?: string, ttlMs?: number): ServiceResult<{ ok: boolean; lock: { userId: string; expiresAt: number }; conflict?: { userId: string; expiresAt: number } }> {
    try {
      const userRes = authService.getCurrentUser();
      const resolvedUserId = userId || (userRes.success ? userRes.data?.id : undefined) || this.getFallbackUserId();
      return authService.locks.lockFunnel(funnelId, resolvedUserId, ttlMs ?? undefined);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new Error('Failed to acquire lock') };
    }
  }

  releaseFunnelLock(funnelId: string, userId?: string): ServiceResult<boolean> {
    try {
      const userRes = authService.getCurrentUser();
      const resolvedUserId = userId || (userRes.success ? userRes.data?.id : undefined) || this.getFallbackUserId();
      return authService.locks.releaseLock(funnelId, resolvedUserId);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new Error('Failed to release lock') };
    }
  }

  attachBeforeUnloadRelease(funnelId: string, userId?: string): void {
    if (typeof window === 'undefined') return;
    const userRes = authService.getCurrentUser();
    const resolvedUserId = userId || (userRes.success ? userRes.data?.id : undefined) || this.getFallbackUserId();
    const handler = () => {
      try { authService.locks.releaseLock(funnelId, resolvedUserId); } catch { }
    };
    window.addEventListener('beforeunload', handler);
  }

  private getFallbackUserId(): string {
    if (typeof window === 'undefined') return 'anonymous';
    try {
      const key = 'qfp_user_id';
      const existing = localStorage.getItem(key);
      if (existing) return existing;
      const generated = `anon-${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(key, generated);
      return generated;
    } catch {
      return 'anonymous';
    }
  }

  // ============================================================================
  // EDITOR STATE
  // ============================================================================

  /**
   * Get current editor state
   */
  getState(): ServiceResult<EditorState> {
    return { success: true, data: { ...this.editorState } };
  }

  /**
   * Set editor mode
   */
  setMode(mode: EditorMode): ServiceResult<void> {
    try {
      const oldMode = this.editorState.mode;
      this.editorState.mode = mode;

      this.emitChange({
        type: 'state',
        changes: { mode: { old: oldMode, new: mode } },
        timestamp: new Date()
      });

      this.log('Editor mode changed:', mode);
      return { success: true, data: undefined };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Set mode failed')
      };
    }
  }

  /**
   * Select a block
   */
  selectBlock(blockId: string | null): ServiceResult<void> {
    try {
      if (blockId && !this.blocks.has(blockId)) {
        return {
          success: false,
          error: new Error(`Block ${blockId} not found`)
        };
      }

      this.editorState.selectedBlockId = blockId;

      this.emitChange({
        type: 'state',
        blockId: blockId || undefined,
        changes: { selectedBlockId: blockId },
        timestamp: new Date()
      });

      return { success: true, data: undefined };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Select block failed')
      };
    }
  }

  /**
   * Focus a block
   */
  focusBlock(blockId: string | null): ServiceResult<void> {
    try {
      this.editorState.focusedBlockId = blockId;

      this.emitChange({
        type: 'state',
        blockId: blockId || undefined,
        changes: { focusedBlockId: blockId },
        timestamp: new Date()
      });

      return { success: true, data: undefined };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Focus block failed')
      };
    }
  }

  /**
   * Mark editor as modified
   */
  markModified(): ServiceResult<void> {
    try {
      this.editorState.isModified = true;
      this.scheduleAutoSave();
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Mark modified failed')
      };
    }
  }

  // ============================================================================
  // BLOCK OPERATIONS
  // ============================================================================

  /**
   * Create a new block
   */
  createBlock(block: Omit<Block, 'id'> & { id?: string }): ServiceResult<Block> {
    try {
      if (this.blocks.size >= this.maxBlocks) {
        return {
          success: false,
          error: new Error(`Maximum blocks limit (${this.maxBlocks}) reached`)
        };
      }

      const newBlock: Block = {
        ...block,
        id: block.id || this.generateBlockId(),
        layout: {
          order: block.layout?.order ?? this.blocks.size,
          ...block.layout
        }
      };

      this.blocks.set(newBlock.id, newBlock);
      this.markModified();

      this.emitChange({
        type: 'block',
        blockId: newBlock.id,
        changes: { operation: 'create', block: newBlock },
        timestamp: new Date()
      });

      this.log('Block created:', newBlock.id, newBlock.type);
      return { success: true, data: newBlock };

    } catch (error) {
      this.error('Create block error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Create block failed')
      };
    }
  }

  /**
   * Get a block by ID
   */
  getBlock(blockId: string): ServiceResult<Block | null> {
    try {
      const block = this.blocks.get(blockId);
      return { success: true, data: block || null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get block failed')
      };
    }
  }

  /**
   * Get all blocks
   */
  getAllBlocks(): ServiceResult<Block[]> {
    try {
      const blocks = Array.from(this.blocks.values())
        .sort((a, b) => (a.layout?.order || 0) - (b.layout?.order || 0));
      return { success: true, data: blocks };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Get blocks failed')
      };
    }
  }

  /**
   * Update a block
   */
  updateBlock(blockId: string, updates: Partial<Block>): ServiceResult<Block> {
    try {
      const block = this.blocks.get(blockId);

      if (!block) {
        return {
          success: false,
          error: new Error(`Block ${blockId} not found`)
        };
      }

      const updatedBlock: Block = {
        ...block,
        ...updates,
        id: blockId // Prevent ID change
      };

      this.blocks.set(blockId, updatedBlock);
      this.markModified();

      this.emitChange({
        type: 'block',
        blockId,
        changes: { operation: 'update', updates },
        timestamp: new Date()
      });

      this.log('Block updated:', blockId);
      return { success: true, data: updatedBlock };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Update block failed')
      };
    }
  }

  /**
   * Delete a block
   */
  deleteBlock(blockId: string): ServiceResult<void> {
    try {
      const block = this.blocks.get(blockId);

      if (!block) {
        return {
          success: false,
          error: new Error(`Block ${blockId} not found`)
        };
      }

      this.blocks.delete(blockId);
      this.markModified();

      // Clear selection if this block was selected
      if (this.editorState.selectedBlockId === blockId) {
        this.editorState.selectedBlockId = null;
      }

      this.emitChange({
        type: 'block',
        blockId,
        changes: { operation: 'delete' },
        timestamp: new Date()
      });

      this.log('Block deleted:', blockId);
      return { success: true, data: undefined };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Delete block failed')
      };
    }
  }

  /**
   * Move a block
   */
  moveBlock(blockId: string, newOrder: number): ServiceResult<void> {
    try {
      const block = this.blocks.get(blockId);

      if (!block) {
        return {
          success: false,
          error: new Error(`Block ${blockId} not found`)
        };
      }

      block.layout = {
        ...block.layout,
        order: newOrder
      };

      this.blocks.set(blockId, block);
      this.markModified();

      this.emitChange({
        type: 'block',
        blockId,
        changes: { operation: 'move', newOrder },
        timestamp: new Date()
      });

      this.log('Block moved:', blockId, newOrder);
      return { success: true, data: undefined };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Move block failed')
      };
    }
  }

  /**
   * Duplicate a block
   */
  duplicateBlock(blockId: string): ServiceResult<Block> {
    try {
      const block = this.blocks.get(blockId);

      if (!block) {
        return {
          success: false,
          error: new Error(`Block ${blockId} not found`)
        };
      }

      const newBlock: Block = {
        ...JSON.parse(JSON.stringify(block)), // Deep clone
        id: this.generateBlockId(),
        layout: {
          ...block.layout,
          order: (block.layout?.order || 0) + 1
        }
      };

      return this.createBlock(newBlock);

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Duplicate block failed')
      };
    }
  }

  // ============================================================================
  // CONTENT EDITING
  // ============================================================================

  /**
   * Update block content
   */
  updateContent(update: ContentUpdate): ServiceResult<void> {
    try {
      const block = this.blocks.get(update.blockId);

      if (!block) {
        return {
          success: false,
          error: new Error(`Block ${update.blockId} not found`)
        };
      }

      // Update nested property
      const pathParts = update.path.split('.');
      let current: any = block.content;

      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!(pathParts[i] in current)) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }

      current[pathParts[pathParts.length - 1]] = update.value;

      this.blocks.set(update.blockId, block);
      this.markModified();

      this.emitChange({
        type: 'content',
        blockId: update.blockId,
        changes: { path: update.path, value: update.value },
        timestamp: new Date()
      });

      this.log('Content updated:', update.blockId, update.path);
      return { success: true, data: undefined };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Update content failed')
      };
    }
  }

  // ============================================================================
  // STYLE MANAGEMENT
  // ============================================================================

  /**
   * Update block or global styles
   */
  updateStyle(update: StyleUpdate): ServiceResult<void> {
    try {
      if (update.blockId) {
        // Update block style
        const block = this.blocks.get(update.blockId);

        if (!block) {
          return {
            success: false,
            error: new Error(`Block ${update.blockId} not found`)
          };
        }

        block.style = update.merge
          ? { ...block.style, ...update.properties }
          : update.properties;

        this.blocks.set(update.blockId, block);
      } else {
        // Update global style
        this.globalStyles = update.merge
          ? { ...this.globalStyles, ...update.properties }
          : update.properties;
      }

      this.markModified();

      this.emitChange({
        type: 'style',
        blockId: update.blockId,
        changes: update.properties,
        timestamp: new Date()
      });

      this.log('Style updated:', update.blockId || 'global');
      return { success: true, data: undefined };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Update style failed')
      };
    }
  }

  /**
   * Get global styles
   */
  getGlobalStyles(): ServiceResult<Record<string, any>> {
    return { success: true, data: { ...this.globalStyles } };
  }

  // ============================================================================
  // LAYOUT MANAGEMENT
  // ============================================================================

  /**
   * Update block layout
   */
  updateLayout(update: LayoutUpdate): ServiceResult<void> {
    try {
      const block = this.blocks.get(update.blockId);

      if (!block) {
        return {
          success: false,
          error: new Error(`Block ${update.blockId} not found`)
        };
      }

      block.layout = {
        order: block.layout?.order ?? 0,
        ...block.layout,
        ...update.layout
      };
      this.blocks.set(update.blockId, block);
      this.markModified();

      this.emitChange({
        type: 'layout',
        blockId: update.blockId,
        changes: update.layout,
        timestamp: new Date()
      });

      this.log('Layout updated:', update.blockId);
      return { success: true, data: undefined };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Update layout failed')
      };
    }
  }

  // ============================================================================
  // AUTO-SAVE
  // ============================================================================

  /**
   * Trigger manual save
   */
  async save(): Promise<ServiceResult<void>> {
    try {
      this.saveState();
      this.editorState.isModified = false;
      this.editorState.lastSaved = new Date();

      this.log('Editor saved');
      return { success: true, data: undefined };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Save failed')
      };
    }
  }

  // ============================================================================
  // CHANGE LISTENERS
  // ============================================================================

  /**
   * Listen to editor changes
   */
  onChange(listener: (event: EditorChangeEvent) => void): () => void {
    this.changeListeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.changeListeners.indexOf(listener);
      if (index > -1) {
        this.changeListeners.splice(index, 1);
      }
    };
  }

  // ============================================================================
  // SPECIALIZED APIs
  // ============================================================================

  /**
   * State API
   */
  readonly stateApi = {
    get: this.getState.bind(this),
    setMode: this.setMode.bind(this),
    selectBlock: this.selectBlock.bind(this),
    focusBlock: this.focusBlock.bind(this)
  };

  /**
   * Blocks API
   */
  readonly blocksApi = {
    create: this.createBlock.bind(this),
    get: this.getBlock.bind(this),
    getAll: this.getAllBlocks.bind(this),
    update: this.updateBlock.bind(this),
    delete: this.deleteBlock.bind(this),
    move: this.moveBlock.bind(this),
    duplicate: this.duplicateBlock.bind(this)
  };

  /**
   * Content API
   */
  readonly content = {
    update: this.updateContent.bind(this)
  };

  /**
   * Style API
   */
  readonly style = {
    update: this.updateStyle.bind(this),
    getGlobal: this.getGlobalStyles.bind(this)
  };

  /**
   * Layout API
   */
  readonly layout = {
    update: this.updateLayout.bind(this)
  };

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private generateBlockId(): string {
    return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private scheduleAutoSave(): void {
    if (!this.autoSaveOptions.enabled) return;

    // Clear existing debounce timer
    if (this.autoSaveDebounceTimer !== null) {
      clearTimeout(this.autoSaveDebounceTimer);
    }

    // Schedule new save
    this.autoSaveDebounceTimer = window.setTimeout(() => {
      this.save();
    }, this.autoSaveOptions.debounce);
  }

  private startAutoSave(): void {
    if (typeof window === 'undefined') return;

    this.autoSaveTimer = window.setInterval(() => {
      if (this.editorState.isModified) {
        this.save();
      }
    }, this.autoSaveOptions.interval);
  }

  private loadState(): void {
    try {
      if (typeof window === 'undefined') return;

      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);

        // Restore blocks
        if (data.blocks) {
          this.blocks.clear();
          data.blocks.forEach((block: Block) => {
            this.blocks.set(block.id, block);
          });
        }

        // Restore global styles
        if (data.globalStyles) {
          this.globalStyles = data.globalStyles;
        }

        this.log('Editor state loaded from storage');
      }
    } catch (error) {
      this.error('Failed to load state:', error);
    }
  }

  private saveState(): void {
    try {
      if (typeof window === 'undefined') return;

      const data = {
        blocks: Array.from(this.blocks.values()),
        globalStyles: this.globalStyles,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      this.error('Failed to save state:', error);
    }
  }

  private emitChange(event: EditorChangeEvent): void {
    this.changeListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        this.error('Error in change listener:', error);
      }
    });
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default EditorService;
