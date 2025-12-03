/**
 * 🎯 Quiz Store - Estado principal do quiz JSON
 * 
 * Gerencia:
 * - Carregamento do JSON do quiz
 * - Edição de steps e blocos
 * - Histórico para Undo/Redo
 * - Auto-save
 * - 🆕 Multi-layer cache integration (L1+L2+L3)
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';
import type { HistoryEntry } from './types';
import { multiLayerCache, cacheKeys, cacheTTL } from '@/config/cache.config';

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
   * 🆕 Carregar quiz do cache ou servidor
   */
  loadQuizFromCache: (quizId: string) => Promise<QuizSchema | null>;
  
  /**
   * 🆕 Invalidar cache do quiz
   */
  invalidateQuizCache: (quizId: string) => Promise<void>;
  
  /**
   * Definir quiz (alias para loadQuiz)
   */
  setQuiz: (quiz: QuizSchema) => void;
  
  /**
   * Limpar quiz atual
   */
  clearQuiz: () => void;
  
  /**
   * Validar quiz completo e retornar erros
   */
  validateQuiz: () => { valid: boolean; errors: string[] };
  
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
      
      // 🆕 Cache the quiz in all layers
      // Use unique identifier to avoid cache collisions
      const quizId = quiz?.metadata?.id || `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      multiLayerCache.set('templates', cacheKeys.quiz(quizId), quiz, cacheTTL.quiz)
        .catch((err) => console.warn('⚠️ Failed to cache quiz:', err));
    },
    
    // 🆕 Load quiz from cache first, then fallback to server
    loadQuizFromCache: async (quizId: string) => {
      set((state) => { state.isLoading = true; });
      
      try {
        // Try cache first (L1 → L2 → L3)
        const cached = await multiLayerCache.get<QuizSchema>('templates', cacheKeys.quiz(quizId));
        
        if (cached) {
          console.log('💾 [CACHE HIT] Quiz loaded from cache:', quizId);
          get().loadQuiz(cached);
          return cached;
        }
        
        console.log('❌ [CACHE MISS] Quiz not in cache:', quizId);
        
        // Fallback: Try localStorage (legacy support)
        const localData = localStorage.getItem(`quiz-saved-${quizId}`);
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (parsed?.quiz) {
              console.log('💾 [LOCALSTORAGE] Quiz loaded from localStorage:', quizId);
              get().loadQuiz(parsed.quiz);
              return parsed.quiz;
            }
          } catch {
            console.warn('⚠️ Failed to parse localStorage quiz');
          }
        }
        
        set((state) => { 
          state.isLoading = false; 
          state.error = 'Quiz não encontrado no cache';
        });
        return null;
        
      } catch (error) {
        console.error('❌ Error loading quiz from cache:', error);
        set((state) => { 
          state.isLoading = false; 
          state.error = (error as Error).message;
        });
        return null;
      }
    },
    
    // 🆕 Invalidate quiz cache
    invalidateQuizCache: async (quizId: string) => {
      console.log('🗑️ Invalidating quiz cache:', quizId);
      await multiLayerCache.delete('templates', cacheKeys.quiz(quizId));
    },
    
    setQuiz: (quiz) => {
      get().loadQuiz(quiz);
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
    
    validateQuiz: () => {
      const quiz = get().quiz;
      if (!quiz) return { valid: false, errors: ['Nenhum quiz carregado'] };
      
      const errors: string[] = [];
      
      // Validar metadados básicos
      if (!quiz.metadata?.name || quiz.metadata.name.trim().length < 3) {
        errors.push('Nome do quiz deve ter pelo menos 3 caracteres');
      }
      
      // Validar steps
      if (!quiz.steps || quiz.steps.length === 0) {
        errors.push('Quiz deve ter pelo menos 1 step');
      }
      
      (quiz.steps || []).forEach((step: any, idx: number) => {
        if (!step.id) errors.push(`Step ${idx + 1}: ID obrigatório`);
        if (!step.blocks || step.blocks.length === 0) {
          errors.push(`Step ${step.id || idx + 1}: deve ter pelo menos 1 bloco`);
        }
        
        (step.blocks || []).forEach((blk: any, bidx: number) => {
          if (!blk.id) errors.push(`Step ${step.id}, bloco ${bidx + 1}: ID obrigatório`);
          if (!blk.type) errors.push(`Step ${step.id}, bloco ${blk.id || bidx + 1}: tipo obrigatório`);
        });
      });
      
      return { valid: errors.length === 0, errors };
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
      
      // Validar antes de salvar
      const validation = get().validateQuiz();
      if (!validation.valid) {
        const errorMsg = `Erros de validação:\n${validation.errors.join('\n')}`;
        console.error('❌ Validação falhou', validation.errors);
        set((s) => { s.error = errorMsg; });
        // Ainda salvar para não perder dados, mas marcar erro
      }
      
      console.log('💾 Salvando quiz...', state.quiz);

      try {
        // Extrair funnelId do metadata ou usar padrão
        const funnelId = state.quiz?.metadata?.id || 'quiz-default';
        
        // Usar edge function do Supabase
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        // ✅ FALLBACK: Se Supabase não configurado, salvar em localStorage
        if (!supabaseUrl || !supabaseKey) {
          console.warn('⚠️ Supabase não configurado. Salvando em localStorage...');
          
          const saveData = {
            funnelId,
            quiz: state.quiz,
            metadata: {
              savedAt: new Date().toISOString(),
              validation: validation.valid ? 'passed' : 'failed',
              errors: validation.valid ? [] : validation.errors,
              source: 'editor-local',
            },
          };
          
          localStorage.setItem(`quiz-saved-${funnelId}`, JSON.stringify(saveData));
          
          // 🆕 Update cache after save
          await multiLayerCache.set('templates', cacheKeys.quiz(funnelId), state.quiz, cacheTTL.quiz);
          
          set((s) => {
            s.isDirty = false;
            s.lastSaved = new Date();
            if (validation.valid) s.error = null;
          });
          
          console.log('✅ Quiz salvo em localStorage:', funnelId);
          return;
        }

        const res = await fetch(`${supabaseUrl}/functions/v1/quiz-save`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          },
          body: JSON.stringify({
            funnelId,
            quiz: state.quiz,
            metadata: {
              savedAt: new Date().toISOString(),
              validation: validation.valid ? 'passed' : 'failed',
              errors: validation.valid ? [] : validation.errors,
              source: 'editor',
            },
          }),
        });
        
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`Falha ao salvar: ${res.status} ${msg}`);
        }
        
        const result = await res.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Erro desconhecido ao salvar');
        }
        
        set((s) => {
          s.isDirty = false;
          s.lastSaved = new Date();
          if (validation.valid) s.error = null;
        });
        
        // 🆕 Update cache after successful save
        await multiLayerCache.set('templates', cacheKeys.quiz(funnelId), state.quiz, cacheTTL.quiz);
        
        console.log('✅ Quiz salvo com sucesso:', result.data);
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
  })),
);
