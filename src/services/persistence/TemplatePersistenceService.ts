/**
 * 🔄 TEMPLATE PERSISTENCE SERVICE
 * 
 * Serviço responsável por persistir mudanças do canvas no quiz21-complete.json
 * 
 * Funcionalidades:
 * - Salvar reordenação de blocos
 * - Salvar adição de novos blocos
 * - Salvar remoção de blocos
 * - Salvar propriedades editadas
 * - Auto-save opcional
 */

import { Block } from '@/types/editor';

interface PersistenceOptions {
  autoSave?: boolean;
  autoSaveInterval?: number; // ms
  onSave?: (success: boolean) => void;
  onError?: (error: Error) => void;
}

interface TemplateStructure {
  id: string;
  name: string;
  description: string;
  version: string;
  steps: Array<{
    id: string;
    name: string;
    category: string;
    allowNext: boolean;
    allowPrevious: boolean;
    requiresValidation: boolean;
    blocks: Block[];
  }>;
}

class TemplatePersistenceService {
  private autoSaveTimer?: NodeJS.Timeout;
  private pendingChanges: Map<string, any> = new Map();
  private options: PersistenceOptions;

  constructor(options: PersistenceOptions = {}) {
    this.options = {
      autoSave: false,
      autoSaveInterval: 5000,
      ...options
    };

    if (this.options.autoSave) {
      this.startAutoSave();
    }
  }

  /**
   * 💾 SALVAR TEMPLATE COMPLETO
   */
  async saveTemplate(template: TemplateStructure): Promise<boolean> {
    try {
      console.log('💾 [Persistence] Salvando template completo...');
      
      // Em desenvolvimento, usa API backend
      if (import.meta.env.DEV) {
        const response = await fetch('/api/templates/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(template)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ [Persistence] Template salvo com sucesso');
        this.options.onSave?.(true);
        return true;
      }

      // Em produção, salva no localStorage como backup
      localStorage.setItem('quiz21-template-backup', JSON.stringify(template));
      console.log('✅ [Persistence] Backup salvo no localStorage');
      this.options.onSave?.(true);
      return true;

    } catch (error) {
      console.error('❌ [Persistence] Erro ao salvar:', error);
      this.options.onError?.(error as Error);
      return false;
    }
  }

  /**
   * 🔄 SALVAR REORDENAÇÃO DE BLOCOS
   */
  async saveBlockReorder(stepId: string, blocks: Block[]): Promise<boolean> {
    console.log(`🔄 [Persistence] Salvando reordenação do step ${stepId}`);
    
    this.pendingChanges.set(`reorder-${stepId}`, {
      type: 'reorder',
      stepId,
      blocks: blocks.map(b => ({ id: b.id, type: b.type }))
    });

    if (this.options.autoSave) {
      return true; // Auto-save cuidará disso
    }

    return this.flushChanges();
  }

  /**
   * ➕ SALVAR ADIÇÃO DE BLOCO
   */
  async saveBlockAdd(stepId: string, block: Block, position: number): Promise<boolean> {
    console.log(`➕ [Persistence] Salvando adição de bloco ao step ${stepId}`);
    
    this.pendingChanges.set(`add-${stepId}-${block.id}`, {
      type: 'add',
      stepId,
      block,
      position
    });

    if (this.options.autoSave) {
      return true;
    }

    return this.flushChanges();
  }

  /**
   * ➖ SALVAR REMOÇÃO DE BLOCO
   */
  async saveBlockRemove(stepId: string, blockId: string): Promise<boolean> {
    console.log(`➖ [Persistence] Salvando remoção de bloco do step ${stepId}`);
    
    this.pendingChanges.set(`remove-${stepId}-${blockId}`, {
      type: 'remove',
      stepId,
      blockId
    });

    if (this.options.autoSave) {
      return true;
    }

    return this.flushChanges();
  }

  /**
   * ✏️ SALVAR PROPRIEDADES EDITADAS
   */
  async saveBlockUpdate(stepId: string, blockId: string, data: any): Promise<boolean> {
    console.log(`✏️ [Persistence] Salvando atualização de propriedades`);
    
    this.pendingChanges.set(`update-${stepId}-${blockId}`, {
      type: 'update',
      stepId,
      blockId,
      data
    });

    if (this.options.autoSave) {
      return true;
    }

    return this.flushChanges();
  }

  /**
   * 🔄 FLUSH - Aplicar mudanças pendentes
   */
  private async flushChanges(): Promise<boolean> {
    if (this.pendingChanges.size === 0) {
      return true;
    }

    try {
      console.log(`🔄 [Persistence] Aplicando ${this.pendingChanges.size} mudanças pendentes...`);
      
      const changes = Array.from(this.pendingChanges.values());
      
      if (import.meta.env.DEV) {
        const response = await fetch('/api/templates/apply-changes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ changes })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      this.pendingChanges.clear();
      console.log('✅ [Persistence] Mudanças aplicadas com sucesso');
      return true;

    } catch (error) {
      console.error('❌ [Persistence] Erro ao aplicar mudanças:', error);
      this.options.onError?.(error as Error);
      return false;
    }
  }

  /**
   * ⏰ AUTO-SAVE
   */
  private startAutoSave() {
    console.log(`⏰ [Persistence] Auto-save ativado (intervalo: ${this.options.autoSaveInterval}ms)`);
    
    this.autoSaveTimer = setInterval(() => {
      if (this.pendingChanges.size > 0) {
        console.log('⏰ [Persistence] Executando auto-save...');
        this.flushChanges();
      }
    }, this.options.autoSaveInterval);
  }

  private stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = undefined;
    }
  }

  /**
   * 🔍 VERIFICAR MUDANÇAS PENDENTES
   */
  hasPendingChanges(): boolean {
    return this.pendingChanges.size > 0;
  }

  getPendingChangesCount(): number {
    return this.pendingChanges.size;
  }

  /**
   * 🧹 LIMPAR
   */
  clear() {
    this.pendingChanges.clear();
    this.stopAutoSave();
  }

  /**
   * 💾 FORÇAR SAVE IMEDIATO
   */
  async forceSave(): Promise<boolean> {
    return this.flushChanges();
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const templatePersistence = new TemplatePersistenceService({
  autoSave: import.meta.env.DEV, // Auto-save apenas em DEV
  autoSaveInterval: 10000, // 10 segundos
  onSave: (success) => {
    if (success) {
      // Disparar evento customizado para UI mostrar feedback
      window.dispatchEvent(new CustomEvent('template-saved', { 
        detail: { timestamp: Date.now() } 
      }));
    }
  },
  onError: (error) => {
    console.error('Erro ao persistir template:', error);
    window.dispatchEvent(new CustomEvent('template-save-error', { 
      detail: { error: error.message } 
    }));
  }
});

export default TemplatePersistenceService;
