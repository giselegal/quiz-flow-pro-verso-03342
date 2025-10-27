/**
 * 📜 HISTORY SERVICE
 * 
 * Gerencia sistema de undo/redo com limite de memória
 * Extraído do EditorProviderUnified para reduzir complexidade
 * 
 * @version 1.0.0
 */

export interface HistoryEntry<T> {
  state: T;
  timestamp: number;
}

export class HistoryService<T = any> {
  private history: HistoryEntry<T>[] = [];
  private currentIndex: number = -1;
  private maxSize: number = 30;

  constructor(maxSize: number = 30) {
    this.maxSize = maxSize;
  }

  /**
   * Adiciona novo estado ao histórico
   * Remove histórico futuro se estiver no meio da pilha
   */
  push(state: T): void {
    // Remove future history se estamos no meio
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Adiciona novo state (shallow clone para performance)
    this.history.push({
      state: this.cloneState(state),
      timestamp: Date.now(),
    });

    // Limita tamanho do histórico
    if (this.history.length > this.maxSize) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  /**
   * Desfaz última ação
   * @returns Estado anterior ou null se não houver
   */
  undo(): T | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex].state;
    }
    return null;
  }

  /**
   * Refaz última ação desfeita
   * @returns Próximo estado ou null se não houver
   */
  redo(): T | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex].state;
    }
    return null;
  }

  /**
   * Verifica se pode desfazer
   */
  get canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Verifica se pode refazer
   */
  get canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Limpa todo o histórico
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Retorna tamanho atual do histórico
   */
  get size(): number {
    return this.history.length;
  }

  /**
   * Clone shallow do estado
   * Para estados complexos, sobrescrever na subclasse
   */
  protected cloneState(state: T): T {
    if (typeof state === 'object' && state !== null) {
      return { ...state } as T;
    }
    return state;
  }
}

/**
 * História especializada para EditorState com clone profundo de stepBlocks
 */
export class EditorHistoryService extends HistoryService<any> {
  protected cloneState(state: any): any {
    return {
      ...state,
      stepBlocks: { ...state.stepBlocks },
    };
  }
}

export default HistoryService;
