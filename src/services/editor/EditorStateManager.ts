/**
 * 🎛️ EDITOR STATE MANAGER
 * 
 * Gerencia operações de estado do editor (CRUD de blocos)
 * Coordena HistoryService e TemplateLoader
 * Extraído do EditorProviderUnified para reduzir complexidade
 * 
 * @version 1.0.0
 */

import { Block } from '@/types/editor';
import { EditorHistoryService } from './HistoryService';
import { TemplateLoader } from './TemplateLoader';
import { arrayMove } from '@dnd-kit/sortable';

export interface EditorState {
  stepBlocks: Record<string, Block[]>;
  stepSources?: Record<string, 'normalized-json' | 'modular-json' | 'individual-json' | 'master-json' | 'ts-template'>;
  currentStep: number;
  selectedBlockId: string | null;
  stepValidation: Record<number, boolean>;
  isLoading: boolean;
  databaseMode: 'local' | 'supabase';
  isSupabaseEnabled: boolean;
}

export interface StateUpdateCallback {
  (updater: (prev: EditorState) => EditorState): void;
}

export class EditorStateManager {
  private history: EditorHistoryService;
  private loader: TemplateLoader;
  private updateState: StateUpdateCallback;

  constructor(
    updateState: StateUpdateCallback,
    history: EditorHistoryService,
    loader: TemplateLoader,
  ) {
    this.updateState = updateState;
    this.history = history;
    this.loader = loader;
  }

  /**
   * Duplica um bloco dentro de um step e retorna o novo ID
   */
  async duplicateBlock(stepKey: string, blockId: string): Promise<string> {
    let createdId = '';
    this.updateState(prev => {
      const currentBlocks = prev.stepBlocks[stepKey] || [];
      const idx = currentBlocks.findIndex(b => b.id === blockId);
      if (idx === -1) return prev;

      const ids = new Set(currentBlocks.map(b => b.id));
      const source = currentBlocks[idx] as any;

      // Coleta descendentes (DFS) com base em parentId
      const childrenMap = new Map<string, any[]>();
      currentBlocks.forEach((b: any) => {
        const p = (b.parentId || null) as string | null;
        if (!childrenMap.has(p || '__root__')) childrenMap.set(p || '__root__', []);
        childrenMap.get(p || '__root__')!.push(b);
      });

      const collectSubtree = (rootId: string): any[] => {
        const result: any[] = [];
        const stack: string[] = [rootId];
        while (stack.length) {
          const cur = stack.pop()!;
          const node = currentBlocks.find(b => b.id === cur) as any;
          if (node) {
            result.push(node);
            const kids = (childrenMap.get(cur) || []) as any[];
            // Empilhar em ordem inversa para preservar ordem natural ao desempilhar
            for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i].id);
          }
        }
        return result;
      };

      const subtree = collectSubtree(source.id);

      // Gerador de IDs únicos baseado no id original do bloco
      const makeUniqueId = (base: string): string => {
        let candidate = `${base}-copy`;
        let n = 1;
        while (ids.has(candidate)) {
          n += 1;
          candidate = `${base}-copy-${n}`;
        }
        ids.add(candidate);
        return candidate;
      };

      const idMap = new Map<string, string>();
      // Cria primeiro o ID do root para poder mapear filhos
      idMap.set(source.id, makeUniqueId(source.id));

      // Gera duplicatas mantendo relação de parentId (apontando para novos IDs)
      const duplicates: Block[] = subtree.map((orig: any, i) => {
        const isRoot = i === 0;
        if (!isRoot && !idMap.has(orig.id)) idMap.set(orig.id, makeUniqueId(orig.id));
        const newId = idMap.get(orig.id)!;
        const newParentId = orig.parentId ? (idMap.get(orig.parentId) || orig.parentId) : null;
        const dup: Block = {
          ...(orig as Block),
          id: newId,
          // order será reatribuído globalmente adiante
          order: orig.order,
          ...(newParentId ? { parentId: newParentId } : { parentId: null }),
        } as any as Block;
        return dup;
      });

      // Posição de inserção: logo após a maior posição de índice entre os nós da subárvore (mantém proximidade)
      const subtreeIndices = subtree.map(n => currentBlocks.findIndex(b => b.id === n.id)).filter(i => i >= 0);
      const insertPos = (subtreeIndices.length ? Math.max(...subtreeIndices) : idx) + 1;

      const newBlocks = [...currentBlocks];
      newBlocks.splice(insertPos, 0, ...duplicates);
      const reordered = newBlocks.map((b, i) => ({ ...b, order: i }));

      const newRootId = idMap.get(source.id)!;
      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: reordered,
        },
        selectedBlockId: newRootId,
      } as EditorState;

      createdId = newRootId;
      this.history.push(newState);
      return newState;
    });

    return createdId;
  }

  /**
   * Insere múltiplos blocos (snippets) preservando hierarquia relativa via parentId
   * Retorna os novos IDs inseridos na ordem gerada
   */
  async insertSnippetBlocks(stepKey: string, snippetBlocks: Block[]): Promise<string[]> {
    const createdIds: string[] = [];
    this.updateState(prev => {
      const currentBlocks = prev.stepBlocks[stepKey] || [];

      const timestamp = Date.now();
      const idMap = new Map<string, string>();

      // Gera IDs consistentes por tipo e momento (curto, legível)
      const makeId = (origId: string, type: string, idx: number): string => {
        let candidate = `${type}-snip-${timestamp}-${idx}`;
        let n = 1;
        const used = new Set(currentBlocks.map(b => b.id));
        while (used.has(candidate)) { n += 1; candidate = `${type}-snip-${timestamp}-${idx}-${n}`; }
        return candidate;
      };

      // Construir clones preservando relação de parentId enquanto possível
      const clones: Block[] = snippetBlocks.map((b: any, idx: number) => {
        const newId = makeId(b.id, String(b.type || 'block'), idx);
        idMap.set(b.id, newId);
        createdIds.push(newId);
        return {
          ...(b as Block),
          id: newId,
          // parentId preservado apenas se fizer parte do snippet; caso contrário, torna-se root
          ...(b.parentId ? { parentId: idMap.get(b.parentId) || null } : { parentId: null }),
        } as any as Block;
      });

      // Inserir clones ao final mantendo ordem relativa de entrada
      const newBlocks = [...currentBlocks, ...clones];
      const reordered = newBlocks.map((b, i) => ({ ...b, order: i }));

      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: reordered,
        },
      } as EditorState;

      this.history.push(newState);
      return newState;
    });

    return createdIds;
  }

  /**
   * Move/reordena bloco (e sua posição relativa entre irmãos) para um parent alvo.
   * Se overBlockId for fornecido, posiciona antes dele dentro do mesmo parent.
   */
  async moveBlock(stepKey: string, blockId: string, targetParentId: string | null, overBlockId: string | null): Promise<void> {
    this.updateState(prev => {
      const blocks = (prev.stepBlocks[stepKey] || []).map(b => ({ ...b })) as any[];
      const active = blocks.find(b => b.id === blockId);
      if (!active) return prev;

      // Índices auxiliares
      const byId = new Map<string, any>(blocks.map(b => [b.id, b]));
      const childrenMap = new Map<string | null, any[]>();
      for (const b of blocks) {
        const p = (b.parentId || null) as string | null;
        const arr = childrenMap.get(p) || [];
        arr.push(b);
        childrenMap.set(p, arr);
      }
      const getSiblings = (pid: string | null) => (childrenMap.get(pid || null) || [])
        .filter(Boolean)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      // Determinar parent alvo: prioridade para targetParentId; se ausente e houver over, usar parent do over; senão manter parent atual
      const fromParent = active.parentId || null;
      let toParent = targetParentId != null ? targetParentId : fromParent;
      if (targetParentId == null && overBlockId) {
        const overNode = byId.get(overBlockId);
        if (overNode) toParent = overNode.parentId || null;
      }

      // Guardas de segurança
      if (toParent === active.id) {
        // Não permitir parent = o próprio nó
        return prev;
      }

      // Prevenir ciclos: não mover para dentro de sua própria subárvore
      const collectDescendants = (rootId: string): Set<string> => {
        const result = new Set<string>();
        const stack = [rootId];
        while (stack.length) {
          const cur = stack.pop()!;
          const kids = childrenMap.get(cur) || [];
          for (const k of kids) {
            if (!result.has(k.id)) {
              result.add(k.id);
              stack.push(k.id);
            }
          }
        }
        return result;
      };
      const descendants = collectDescendants(active.id);
      if (toParent && descendants.has(toParent)) {
        // Alvo é um descendente -> operação inválida
        return prev;
      }

      // Se over aponta para o próprio nó, é no-op
      if (overBlockId && overBlockId === active.id && (fromParent || null) === (toParent || null)) {
        return prev;
      }

      // Remover ativo da lista de origem
      const originSibs = getSiblings(fromParent).filter(b => b.id !== active.id);
      originSibs.forEach((b, i) => { b.order = i; });

      // Atualizar parent
      active.parentId = toParent || null;

      // Lista de destino (sem o ativo)
      const targetSibs = getSiblings(toParent).filter(b => b.id !== active.id);

      // Índice atual do ativo (se mesmo parent)
      const currentIndexInTarget = targetSibs.findIndex(b => b.id === active.id);

      // Calcular índice de inserção
      let insertIndex: number = targetSibs.length; // default: fim
      if (overBlockId) {
        const idx = targetSibs.findIndex(b => b.id === overBlockId);
        if (idx >= 0) insertIndex = idx; // inserir antes do over
      }

      // No-op: mesmo parent e posição igual
      if ((fromParent || null) === (toParent || null)) {
        const sourceSibs = getSiblings(fromParent).filter(b => b.id !== active.id);
        const oldIndex = (getSiblings(fromParent).findIndex(b => b.id === active.id));
        // Se oldIndex == -1 significa que getSiblings(fromParent) já não inclui mais o ativo por causa da atualização anterior
        // Recuperar pelo order do próprio ativo
        const inferredOldIndex = oldIndex >= 0 ? oldIndex : active.order ?? sourceSibs.length;
        if (inferredOldIndex === insertIndex || (overBlockId === null && inferredOldIndex === sourceSibs.length)) {
          return prev;
        }
      }

      // Inserir no destino
      targetSibs.splice(insertIndex, 0, active);
      targetSibs.forEach((b, i) => { b.order = i; });

      // Atualizar childrenMap com as listas reordenadas
      childrenMap.set(fromParent, originSibs);
      childrenMap.set(toParent, targetSibs);

      // Reconstituir vetor final mantendo demais blocos inalterados
      const newBlocks = blocks.map(b => {
        // orders já atualizados nas referências dos próprios objetos
        return b;
      });

      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: newBlocks as Block[],
        },
      } as EditorState;

      this.history.push(newState);
      return newState;
    });
  }
  /**
   * Adiciona bloco ao final de um step
   */
  async addBlock(stepKey: string, block: Block): Promise<void> {
    this.updateState(prev => {
      const currentBlocks = prev.stepBlocks[stepKey] || [];
      const newBlock = {
        ...block,
        order: currentBlocks.length,
      };
      
      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: [...currentBlocks, newBlock],
        },
      };
      
      this.history.push(newState);
      return newState;
    });
  }

  /**
   * Adiciona bloco em índice específico
   */
  async addBlockAtIndex(stepKey: string, block: Block, index: number): Promise<void> {
    this.updateState(prev => {
      const currentBlocks = prev.stepBlocks[stepKey] || [];
      const newBlock = { ...block, order: index };
      const newBlocks = [...currentBlocks];
      newBlocks.splice(index, 0, newBlock);
      
      // Reordenar índices
      const reorderedBlocks = newBlocks.map((b, i) => ({ ...b, order: i }));
      
      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: reorderedBlocks,
        },
      };
      
      this.history.push(newState);
      return newState;
    });
  }

  /**
   * Remove bloco de um step
   */
  async removeBlock(stepKey: string, blockId: string): Promise<void> {
    this.updateState(prev => {
      const currentBlocks = prev.stepBlocks[stepKey] || [];
      const filteredBlocks = currentBlocks
        .filter(b => b.id !== blockId)
        .map((b, i) => ({ ...b, order: i }));
      
      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: filteredBlocks,
        },
        selectedBlockId: prev.selectedBlockId === blockId ? null : prev.selectedBlockId,
      };
      
      this.history.push(newState);
      return newState;
    });
  }

  /**
   * Reordena blocos dentro de um step
   */
  async reorderBlocks(stepKey: string, oldIndex: number, newIndex: number): Promise<void> {
    this.updateState(prev => {
      const currentBlocks = prev.stepBlocks[stepKey] || [];
      const reorderedBlocks = arrayMove(currentBlocks, oldIndex, newIndex)
        .map((b, i) => ({ ...b, order: i }));
      
      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: reorderedBlocks,
        },
      };
      
      this.history.push(newState);
      return newState;
    });
  }

  /**
   * Atualiza propriedades de um bloco
   */
  async updateBlock(
    stepKey: string, 
    blockId: string, 
    updates: Record<string, any>,
  ): Promise<void> {
    this.updateState(prev => {
      const currentBlocks = prev.stepBlocks[stepKey] || [];
      const updatedBlocks = currentBlocks.map(block =>
        block.id === blockId
          ? { ...block, ...updates }
          : block,
      );
      
      const newState = {
        ...prev,
        stepBlocks: {
          ...prev.stepBlocks,
          [stepKey]: updatedBlocks,
        },
      };
      
      this.history.push(newState);
      return newState;
    });
  }

  /**
   * Garante que um step está carregado
   */
  async ensureStepLoaded(
    step: number | string,
    currentState: EditorState,
  ): Promise<Partial<EditorState>> {
    const normalizedKey = this.normalizeStepKey(step);
    const existingBlocks = currentState.stepBlocks[normalizedKey];

    // Skip se já carregado
    if (existingBlocks && existingBlocks.length > 0) {
      console.log(`⏭️ Skip: ${normalizedKey} já carregado`);
      return {};
    }

    try {
      const { blocks, source } = await this.loader.loadStep(normalizedKey);
      
      return {
        stepBlocks: {
          ...currentState.stepBlocks,
          [normalizedKey]: blocks,
        },
        stepSources: {
          ...(currentState.stepSources || {}),
          [normalizedKey]: source,
        },
      };
    } catch (error) {
      console.error(`❌ Erro ao carregar ${normalizedKey}:`, error);
      return {};
    }
  }

  /**
   * Normaliza chave do step
   */
  private normalizeStepKey(step: number | string): string {
    const rawKey = typeof step === 'string' ? step : `step-${step}`;
    const match = rawKey.match(/^step-(\d{1,2})$/);
    return match ? `step-${parseInt(match[1], 10).toString().padStart(2, '0')}` : rawKey;
  }

  /**
   * Desfaz última ação
   */
  undo(): EditorState | null {
    return this.history.undo();
  }

  /**
   * Refaz última ação desfeita
   */
  redo(): EditorState | null {
    return this.history.redo();
  }

  /**
   * Estado do histórico
   */
  get canUndo(): boolean {
    return this.history.canUndo;
  }

  get canRedo(): boolean {
    return this.history.canRedo;
  }

  /**
   * Limpa histórico
   */
  clearHistory(): void {
    this.history.clear();
  }
}

export default EditorStateManager;
