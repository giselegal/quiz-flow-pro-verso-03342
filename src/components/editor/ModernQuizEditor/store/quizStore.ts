/**
 * 🎯 Quiz Store - Estado principal do quiz JSON
 * 
 * Gerencia:
 * - Carregamento do JSON do quiz
 * - Edição de steps e blocos
 * - Histórico para Undo/Redo
 * - Auto-save
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';
import type { HistoryEntry } from './types';

interface QuizStore {
  // ========================================================================
  // ESTADO
  // ========================================================================
  quiz: QuizSchema | null;
  isLoading: boolean;
  error: string | null;
  
  // Histórico para Undo/Redo
  history: QuizSchema[];
  historyIndex: number;
  maxHistory: number;
  
  // Metadados
  isDirty: boolean;
  lastSaved: Date | null;
  autoSaveTimer?: any;
  
  // ========================================================================
  // AÇÕES - CARREGAMENTO
  // ========================================================================
  
  /**
   * Carregar quiz do JSON
   */
  loadQuiz: (quiz: QuizSchema) => void;
  
  /**
   * Limpar quiz atual
   */
  clearQuiz: () => void;
  
  // ========================================================================
  // AÇÕES - EDIÇÃO DE BLOCOS
  // ========================================================================
  
  /**
   * Atualizar propriedades de um bloco
   */
  updateBlock: (stepId: string, blockId: string, properties: Record<string, any>) => void;
  
  /**
   * Adicionar novo bloco a um step
   */
  addBlock: (stepId: string, blockType: string, order: number) => void;

  /**
   * Duplicar bloco com clone completo
   */
  duplicateBlock: (stepId: string, blockId: string) => void;
  
  /**
   * Deletar bloco de um step
   */
  deleteBlock: (stepId: string, blockId: string) => void;
  
  /**
   * Reordenar blocos dentro de um step
   */
  reorderBlocks: (stepId: string, fromIndex: number, toIndex: number) => void;
  
  // ========================================================================
  // AÇÕES - HISTÓRICO
  // ========================================================================
  
  /**
   * Desfazer última ação
   */
  undo: () => void;
  
  /**
   * Refazer ação desfeita
   */
  redo: () => void;
  
  /**
   * Adicionar snapshot ao histórico
   */
  addToHistory: () => void;
  
  // ========================================================================
  // AÇÕES - PERSISTÊNCIA
  // ========================================================================
  
  /**
   * Salvar quiz (placeholder - implementar integração com backend)
   */
  save: () => Promise<void>;
  scheduleAutoSave: () => void;
  
  /**
   * Marcar como salvo
   */
  markAsSaved: () => void;
}

export const useQuizStore = create<QuizStore>()(
  immer((set, get) => ({
    // ========================================================================
    // ESTADO INICIAL
    // ========================================================================
    quiz: null,
    isLoading: false,
    error: null,
    history: [],
    historyIndex: -1,
    maxHistory: 50,
    isDirty: false,
    lastSaved: null,
    
    // ========================================================================
    // IMPLEMENTAÇÕES - CARREGAMENTO
    // ========================================================================
    
    loadQuiz: (quiz) => {
      set((state) => {
        state.quiz = quiz;
        state.isLoading = false;
        state.error = null;
        state.isDirty = false;
        state.history = [quiz];
        state.historyIndex = 0;
        state.lastSaved = new Date();
      });
    },
    
    clearQuiz: () => {
      set((state) => {
        state.quiz = null;
        state.history = [];
        state.historyIndex = -1;
        state.isDirty = false;
        state.lastSaved = null;
      });
    },
    
    // ========================================================================
    // IMPLEMENTAÇÕES - EDIÇÃO DE BLOCOS
    // ========================================================================
    
    updateBlock: (stepId, blockId, properties) => {
      set((state) => {
        if (!state.quiz) return;
        
        const step = state.quiz.steps.find(s => s.id === stepId);
        if (!step) return;
        
        const block = step.blocks.find(b => b.id === blockId);
        if (!block) return;
        
        // Atualizar propriedades (Immer cuida da imutabilidade)
        block.properties = { ...block.properties, ...properties };
        state.isDirty = true;
      });
      
      // Adicionar ao histórico após mudança
      get().addToHistory();
      get().scheduleAutoSave();
    },
    
    addBlock: (stepId, blockType, order) => {
      set((state) => {
        if (!state.quiz) return;
        
        const step = state.quiz.steps.find(s => s.id === stepId);
        if (!step) return;
        
        const newBlock = {
          id: `block-${Date.now()}`,
          type: blockType,
          order,
          properties: {},
          content: {},
          parentId: null,
        };
        
        step.blocks.push(newBlock as any); // Fase 2: implementar factory de blocos tipados
        state.isDirty = true;
      });
      
      get().addToHistory();
      get().scheduleAutoSave();
    },

    duplicateBlock: (stepId, blockId) => {
      set((state) => {
        if (!state.quiz) return;
        const step = state.quiz.steps.find((s: any) => s.id === stepId);
        if (!step) return;
        const idx = step.blocks.findIndex((b: any) => b.id === blockId);
        if (idx === -1) return;
        const original = step.blocks[idx];
        const newId = `${original.id}-copy-${Date.now()}`;
        const clone = {
          id: newId,
          type: original.type,
          order: (original.order || 0) + 1,
          properties: JSON.parse(JSON.stringify(original.properties || {})),
          content: JSON.parse(JSON.stringify(original.content || {})),
          parentId: original.parentId ?? null,
          metadata: JSON.parse(JSON.stringify(original.metadata || {})),
        } as any;

        // Inserir após original
        step.blocks.splice(idx + 1, 0, clone);
        // Reatribuir ordem sequencial
        step.blocks = step.blocks.map((b: any, i: number) => ({ ...b, order: i + 1 }));
        state.isDirty = true;
      });
      get().addToHistory();
      get().scheduleAutoSave();
    },
    
    deleteBlock: (stepId, blockId) => {
      set((state) => {
        if (!state.quiz) return;
        
        const step = state.quiz.steps.find(s => s.id === stepId);
        if (!step) return;
        
        step.blocks = step.blocks.filter(b => b.id !== blockId);
        state.isDirty = true;
      });
      
      get().addToHistory();
      get().scheduleAutoSave();
    },
    
    reorderBlocks: (stepId, fromIndex, toIndex) => {
      set((state) => {
        if (!state.quiz) return;
        
        const step = state.quiz.steps.find(s => s.id === stepId);
        if (!step) return;
        
        const blocks = [...step.blocks];
        const [removed] = blocks.splice(fromIndex, 1);
        blocks.splice(toIndex, 0, removed);
        
        // Atualizar ordem
        step.blocks = blocks.map((block, index) => ({
          ...block,
          order: index + 1,
        }));
        
        state.isDirty = true;
      });
      
      get().addToHistory();
      get().scheduleAutoSave();
    },
    
    // ========================================================================
    // IMPLEMENTAÇÕES - HISTÓRICO
    // ========================================================================
    
    addToHistory: () => {
      set((state) => {
        if (!state.quiz) return;
        
        // Remover itens após o índice atual (se houver redo disponível)
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        
        // Adicionar snapshot atual
        newHistory.push(JSON.parse(JSON.stringify(state.quiz)));
        
        // Limitar histórico
        if (newHistory.length > state.maxHistory) {
          newHistory.shift();
        } else {
          state.historyIndex++;
        }
        
        state.history = newHistory;
      });
    },
    
    undo: () => {
      set((state) => {
        if (state.historyIndex <= 0) return;
        
        state.historyIndex--;
        state.quiz = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.isDirty = true;
      });
    },
    
    redo: () => {
      set((state) => {
        if (state.historyIndex >= state.history.length - 1) return;
        
        state.historyIndex++;
        state.quiz = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        state.isDirty = true;
      });
    },
    
    // ========================================================================
    // IMPLEMENTAÇÕES - PERSISTÊNCIA
    // ========================================================================
    
    save: async () => {
      const state = get();
      if (!state.quiz || !state.isDirty) return;
      console.log('💾 Salvando quiz...', state.quiz);

      try {
        const res = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quiz: state.quiz,
            metadata: {
              savedAt: new Date().toISOString(),
              version: (state.quiz as any)?.version ?? 1,
            },
          }),
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`Falha ao salvar: ${res.status} ${msg}`);
        }
        set((s) => {
          s.isDirty = false;
          s.lastSaved = new Date();
        });
        console.log('✅ Quiz salvo com sucesso');
      } catch (err) {
        console.error('❌ Erro ao salvar quiz', err);
        set((s) => { s.error = (err as Error).message; });
      }
    },

    scheduleAutoSave: () => {
      const state = get();
      if (!state.isDirty) return;
      // Limpar timer anterior
      if (state.autoSaveTimer) {
        clearTimeout(state.autoSaveTimer);
      }
      // Agendar para 1s
      const timer = setTimeout(() => {
        get().save();
      }, 1000);
      set((s) => { s.autoSaveTimer = timer; });
    },
    
    markAsSaved: () => {
      set((state) => {
        state.isDirty = false;
        state.lastSaved = new Date();
      });
    },
  }))
);
