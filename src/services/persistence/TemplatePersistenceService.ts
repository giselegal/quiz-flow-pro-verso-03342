/**
 * 🔄 TEMPLATE PERSISTENCE SERVICE
 * 
 * Serviço responsável por persistir mudanças do canvas no quiz21-complete.json
 * 
 * ⚠️ ATUALIZADO PARA USAR CANONICAL SERVICES
 * - Usa EditorService canônico para operações de blocos
 * - Usa TemplateService canônico para persistência
 * - Integrado com sistema de auto-save do EditorService
 * 
 * Funcionalidades:
 * - Salvar reordenação de blocos
 * - Salvar adição de novos blocos
 * - Salvar remoção de blocos
 * - Salvar propriedades editadas
 * - Auto-save opcional
 */

import { Block } from '@/types/editor';
import { EditorService } from '@/services/canonical/EditorService';
import { TemplateService, Template } from '@/services/canonical/TemplateService';

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
  private editorService: EditorService;
  private templateService: TemplateService;
  private autoSaveTimer?: NodeJS.Timeout;
  private pendingChanges: Map<string, any> = new Map();
  private options: PersistenceOptions;

  constructor(options: PersistenceOptions = {}) {
    this.options = {
      autoSave: false,
      autoSaveInterval: 5000,
      ...options
    };

    // Inicializar serviços canônicos
    this.editorService = EditorService.getInstance({
      autoSave: {
        enabled: this.options.autoSave || false,
        interval: this.options.autoSaveInterval || 30000,
        debounce: 2000
      },
      persistState: true,
      validateOnChange: true
    });

    this.templateService = TemplateService.getInstance();

    // Escutar mudanças do EditorService
    this.editorService.onChange((event) => {
      if (event.type === 'block' && this.options.autoSave) {
        this.handleBlockChange(event);
      }
    });

    if (this.options.autoSave) {
      this.startAutoSave();
    }
  }

  /**
   * � HANDLE BLOCK CHANGE (chamado pelo EditorService)
   */
  private handleBlockChange(event: any): void {
    console.log('🔄 [Persistence] Block change detected:', event);
    this.pendingChanges.set(`change-${Date.now()}`, event);
  }

  /**
   * �💾 SALVAR TEMPLATE COMPLETO
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
    
    try {
      // Usar EditorService para atualizar a ordem dos blocos
      blocks.forEach((block, index) => {
        const result = this.editorService.moveBlock(block.id, index);
        if (!result.success) {
          console.error(`Erro ao mover bloco ${block.id}:`, result.error);
        }
      });

      // Registrar mudança pendente para API backend
      this.pendingChanges.set(`reorder-${stepId}`, {
        type: 'reorder',
        stepId,
        blocks: blocks.map(b => ({ id: b.id, type: b.type }))
      });

      if (this.options.autoSave) {
        return true; // Auto-save cuidará disso
      }

      return this.flushChanges();
    } catch (error) {
      console.error('❌ [Persistence] Erro ao salvar reordenação:', error);
      this.options.onError?.(error as Error);
      return false;
    }
  }

  /**
   * ➕ SALVAR ADIÇÃO DE BLOCO
   */
  async saveBlockAdd(stepId: string, block: Block, position: number): Promise<boolean> {
    console.log(`➕ [Persistence] Salvando adição de bloco ao step ${stepId}`);
    
    try {
      // Usar EditorService para criar o bloco
      const result = this.editorService.createBlock({
        type: block.type,
        content: (block as any).data || (block as any).content || {},
        layout: {
          order: position >= 0 ? position : 0,
          parent: stepId
        }
      });

      if (!result.success) {
        throw new Error(`Falha ao criar bloco: ${result.error?.message}`);
      }

      // Se position especificado, mover para posição correta
      if (position >= 0 && result.data) {
        this.editorService.moveBlock(result.data.id, position);
      }

      // Registrar mudança pendente para API backend
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
    } catch (error) {
      console.error('❌ [Persistence] Erro ao salvar adição:', error);
      this.options.onError?.(error as Error);
      return false;
    }
  }

  /**
   * ➖ SALVAR REMOÇÃO DE BLOCO
   */
  async saveBlockRemove(stepId: string, blockId: string): Promise<boolean> {
    console.log(`➖ [Persistence] Salvando remoção de bloco do step ${stepId}`);
    
    try {
      // Usar EditorService para deletar o bloco
      const result = this.editorService.deleteBlock(blockId);
      
      if (!result.success) {
        throw new Error(`Falha ao deletar bloco: ${result.error?.message}`);
      }

      // Registrar mudança pendente para API backend
      this.pendingChanges.set(`remove-${stepId}-${blockId}`, {
        type: 'remove',
        stepId,
        blockId
      });

      if (this.options.autoSave) {
        return true;
      }

      return this.flushChanges();
    } catch (error) {
      console.error('❌ [Persistence] Erro ao salvar remoção:', error);
      this.options.onError?.(error as Error);
      return false;
    }
  }

  /**
   * ✏️ SALVAR PROPRIEDADES EDITADAS
   */
  async saveBlockUpdate(stepId: string, blockId: string, data: any): Promise<boolean> {
    console.log(`✏️ [Persistence] Salvando atualização de propriedades`);
    
    try {
      // Usar EditorService para atualizar o bloco
      const result = this.editorService.updateBlock(blockId, {
        content: data
      });

      if (!result.success) {
        throw new Error(`Falha ao atualizar bloco: ${result.error?.message}`);
      }

      // Registrar mudança pendente para API backend
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
    } catch (error) {
      console.error('❌ [Persistence] Erro ao salvar atualização:', error);
      this.options.onError?.(error as Error);
      return false;
    }
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
