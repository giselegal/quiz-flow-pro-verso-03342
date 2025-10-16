/**
 * 🔄 EDITOR PERSISTENCE SERVICE - SPRINT 4
 * 
 * Serviço completo de persistência do editor com:
 * - Auto-save inteligente com debounce
 * - Histórico persistente em localStorage
 * - Versionamento automático
 * - Recovery de crashes
 * 
 * @version 1.0.0
 * @date 2025-01-16
 */

import { Block } from '@/types/editor';

export interface EditorSnapshot {
  id: string;
  timestamp: number;
  stepBlocks: Record<string, Block[]>;
  metadata: {
    funnelId: string;
    version: number;
    autoSave: boolean;
  };
}

export interface HistoryEntry {
  snapshots: EditorSnapshot[];
  maxSize: number;
  currentIndex: number;
}

const STORAGE_KEYS = {
  HISTORY: 'editor_history',
  AUTO_SAVE: 'editor_auto_save',
  LAST_EDIT: 'editor_last_edit',
  CRASH_RECOVERY: 'editor_crash_recovery'
} as const;

/**
 * Serviço de persistência do editor
 */
class EditorPersistenceService {
  private static instance: EditorPersistenceService;
  private saveTimeout: NodeJS.Timeout | null = null;
  private saveCallbacks: Set<(snapshot: EditorSnapshot) => void> = new Set();

  private constructor() {}

  static getInstance(): EditorPersistenceService {
    if (!EditorPersistenceService.instance) {
      EditorPersistenceService.instance = new EditorPersistenceService();
    }
    return EditorPersistenceService.instance;
  }

  /**
   * Auto-save com debounce
   */
  async autoSave(
    stepBlocks: Record<string, Block[]>,
    funnelId: string,
    debounceMs: number = 3000
  ): Promise<void> {
    // Cancelar save anterior se existir
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    return new Promise((resolve) => {
      this.saveTimeout = setTimeout(async () => {
        const snapshot = this.createSnapshot(stepBlocks, funnelId, true);
        
        // Salvar em localStorage
        localStorage.setItem(STORAGE_KEYS.AUTO_SAVE, JSON.stringify(snapshot));
        localStorage.setItem(STORAGE_KEYS.LAST_EDIT, Date.now().toString());
        
        // Notificar callbacks
        this.saveCallbacks.forEach(cb => cb(snapshot));
        
        console.log('💾 Auto-save completed:', snapshot.id);
        resolve();
      }, debounceMs);
    });
  }

  /**
   * Salvar snapshot manual
   */
  async saveSnapshot(
    stepBlocks: Record<string, Block[]>,
    funnelId: string
  ): Promise<EditorSnapshot> {
    const snapshot = this.createSnapshot(stepBlocks, funnelId, false);
    
    // Adicionar ao histórico
    this.addToHistory(snapshot);
    
    // Salvar último edit
    localStorage.setItem(STORAGE_KEYS.LAST_EDIT, Date.now().toString());
    
    console.log('💾 Manual snapshot saved:', snapshot.id);
    return snapshot;
  }

  /**
   * Criar snapshot
   */
  private createSnapshot(
    stepBlocks: Record<string, Block[]>,
    funnelId: string,
    autoSave: boolean
  ): EditorSnapshot {
    const history = this.getHistory();
    const version = history.snapshots.length > 0
      ? history.snapshots[history.snapshots.length - 1].metadata.version + 1
      : 1;

    return {
      id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      stepBlocks: JSON.parse(JSON.stringify(stepBlocks)), // Deep clone
      metadata: {
        funnelId,
        version,
        autoSave
      }
    };
  }

  /**
   * Adicionar snapshot ao histórico
   */
  private addToHistory(snapshot: EditorSnapshot): void {
    const history = this.getHistory();
    
    // Adicionar novo snapshot
    history.snapshots.push(snapshot);
    
    // Limitar tamanho do histórico
    if (history.snapshots.length > history.maxSize) {
      history.snapshots.shift();
    } else {
      history.currentIndex = history.snapshots.length - 1;
    }
    
    // Salvar histórico
    this.saveHistory(history);
  }

  /**
   * Obter histórico
   */
  getHistory(): HistoryEntry {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.createEmptyHistory();
      }
    }
    
    return this.createEmptyHistory();
  }

  /**
   * Criar histórico vazio
   */
  private createEmptyHistory(): HistoryEntry {
    return {
      snapshots: [],
      maxSize: 10,
      currentIndex: -1
    };
  }

  /**
   * Salvar histórico
   */
  private saveHistory(history: HistoryEntry): void {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }

  /**
   * Restaurar snapshot
   */
  async restoreSnapshot(snapshotId: string): Promise<EditorSnapshot | null> {
    const history = this.getHistory();
    const snapshot = history.snapshots.find(s => s.id === snapshotId);
    
    if (!snapshot) {
      console.warn(`⚠️ Snapshot not found: ${snapshotId}`);
      return null;
    }
    
    console.log('🔄 Restoring snapshot:', snapshotId);
    return snapshot;
  }

  /**
   * Obter último auto-save
   */
  getLastAutoSave(): EditorSnapshot | null {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTO_SAVE);
    
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  /**
   * Verificar se há auto-save recente
   */
  hasRecentAutoSave(maxAgeMs: number = 300000): boolean {
    const lastEdit = localStorage.getItem(STORAGE_KEYS.LAST_EDIT);
    
    if (!lastEdit) return false;
    
    const lastEditTime = parseInt(lastEdit, 10);
    const age = Date.now() - lastEditTime;
    
    return age < maxAgeMs;
  }

  /**
   * Salvar crash recovery
   */
  saveCrashRecovery(stepBlocks: Record<string, Block[]>, funnelId: string): void {
    const snapshot = this.createSnapshot(stepBlocks, funnelId, true);
    localStorage.setItem(STORAGE_KEYS.CRASH_RECOVERY, JSON.stringify(snapshot));
  }

  /**
   * Obter crash recovery
   */
  getCrashRecovery(): EditorSnapshot | null {
    const stored = localStorage.getItem(STORAGE_KEYS.CRASH_RECOVERY);
    
    if (!stored) return null;
    
    try {
      const snapshot = JSON.parse(stored);
      
      // Verificar se não está muito antigo (>1 hora)
      const age = Date.now() - snapshot.timestamp;
      if (age > 3600000) {
        this.clearCrashRecovery();
        return null;
      }
      
      return snapshot;
    } catch {
      return null;
    }
  }

  /**
   * Limpar crash recovery
   */
  clearCrashRecovery(): void {
    localStorage.removeItem(STORAGE_KEYS.CRASH_RECOVERY);
  }

  /**
   * Limpar histórico antigo (>7 dias)
   */
  cleanOldHistory(): void {
    const history = this.getHistory();
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    history.snapshots = history.snapshots.filter(
      snapshot => snapshot.timestamp > sevenDaysAgo
    );
    
    this.saveHistory(history);
    console.log('🗑️ Old history cleaned');
  }

  /**
   * Subscribe to save events
   */
  onSave(callback: (snapshot: EditorSnapshot) => void): () => void {
    this.saveCallbacks.add(callback);
    
    return () => {
      this.saveCallbacks.delete(callback);
    };
  }

  /**
   * Obter estatísticas
   */
  getStats(): {
    historySize: number;
    lastSaveTime: number | null;
    hasAutoSave: boolean;
    hasCrashRecovery: boolean;
  } {
    const history = this.getHistory();
    const lastEdit = localStorage.getItem(STORAGE_KEYS.LAST_EDIT);
    
    return {
      historySize: history.snapshots.length,
      lastSaveTime: lastEdit ? parseInt(lastEdit, 10) : null,
      hasAutoSave: !!localStorage.getItem(STORAGE_KEYS.AUTO_SAVE),
      hasCrashRecovery: !!this.getCrashRecovery()
    };
  }

  /**
   * Limpar tudo
   */
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    console.log('🗑️ All persistence data cleared');
  }
}

// Export singleton
export const editorPersistence = EditorPersistenceService.getInstance();
export default editorPersistence;
