/**
 * 🌉 BRIDGE SYNC HOOK
 * 
 * Sincroniza automaticamente o estado do ModernQuizEditor (Zustand)
 * com o EditorStateProvider (Context API) do sistema legado.
 * 
 * Resolve GARGALO #2: Dois sistemas de estado paralelos
 * 
 * FUNCIONALIDADES:
 * - Sync unidirecional: ModernQuizEditor → EditorStateProvider
 * - Conversão automática de tipos (QuizBlock → Block)
 * - Dirty tracking sincronizado
 * - Performance otimizada com debounce
 * 
 * USO:
 * ```tsx
 * function ModernQuizEditorConnected() {
 *   useBridgeSync(); // ← Ativa sincronização
 *   return <ModernQuizEditor />;
 * }
 * ```
 */

import { useEffect, useRef } from 'react';
import { useQuizStore } from '../store/quizStore';
import { useEditorState } from '@/core/contexts/EditorContext/EditorStateProvider';
import { quizBlockToBlock } from '@/components/editor/quiz/types';
import { appLogger } from '@/lib/utils/logger';

interface UseBridgeSyncOptions {
  /** Ativar sincronização (padrão: true) */
  enabled?: boolean;
  
  /** Delay em ms para debounce de sincronização (padrão: 300ms) */
  debounceMs?: number;
  
  /** Log detalhado de sincronização (padrão: false) */
  verbose?: boolean;
}

/**
 * Hook que sincroniza ModernQuizEditor com EditorStateProvider
 */
export function useBridgeSync(options: UseBridgeSyncOptions = {}) {
  const {
    enabled = true,
    debounceMs = 300,
    verbose = false,
  } = options;

  // Estados do ModernQuizEditor
  const { quiz, isDirty } = useQuizStore();
  
  // Contexto do EditorStateProvider
  const editorContext = useEditorState();
  
  // Ref para debounce
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<string>('');

  useEffect(() => {
    if (!enabled || !quiz?.steps || !editorContext) {
      if (verbose) {
        appLogger.debug('[BridgeSync] Sync desabilitado ou contexto ausente', {
          enabled,
          hasQuiz: !!quiz,
          hasContext: !!editorContext,
        });
      }
      return;
    }

    // Cancelar sync anterior
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }

    // Debounce: aguardar estabilização de mudanças
    syncTimerRef.current = setTimeout(() => {
      try {
        // Gerar hash para detectar mudanças
        const currentHash = JSON.stringify(quiz.steps.map(s => ({
          id: s.id,
          blocks: s.blocks.map(b => b.id),
        })));

        // Skip se não houve mudanças
        if (currentHash === lastSyncRef.current) {
          if (verbose) {
            appLogger.debug('[BridgeSync] Skip: nenhuma mudança detectada');
          }
          return;
        }

        lastSyncRef.current = currentHash;

        if (verbose) {
          appLogger.info('[BridgeSync] Iniciando sincronização', {
            stepsCount: quiz.steps.length,
            isDirty,
          });
        }

        // Sync: ModernQuizEditor → EditorStateProvider
        quiz.steps.forEach((step, index) => {
          const stepNumber = index + 1;
          
          // Converter QuizBlock[] para Block[]
          const blocks = step.blocks.map(quizBlockToBlock);

          if (verbose) {
            appLogger.debug(`[BridgeSync] Sync step ${stepNumber}`, {
              stepId: step.id,
              blocksCount: blocks.length,
            });
          }

          // Atualizar blocos no EditorStateProvider
          editorContext.setStepBlocks(stepNumber, blocks);
        });

        // Marcar como modificado se dirty
        if (isDirty) {
          const timestamp = Date.now();
          editorContext.markModified(`modern-quiz-${timestamp}`);
          
          if (verbose) {
            appLogger.debug('[BridgeSync] Marcado como modificado');
          }
        }

        appLogger.info('✅ [BridgeSync] Sincronização completa', {
          steps: quiz.steps.length,
          totalBlocks: quiz.steps.reduce((sum, s) => sum + s.blocks.length, 0),
        });

      } catch (error) {
        appLogger.error('❌ [BridgeSync] Erro na sincronização', error);
      }
    }, debounceMs);

    // Cleanup
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, [
    enabled,
    quiz,
    isDirty,
    editorContext,
    debounceMs,
    verbose,
  ]);

  // Retornar informações úteis para debug
  return {
    isEnabled: enabled,
    lastSync: lastSyncRef.current,
    hasContext: !!editorContext,
  };
}

/**
 * Hook auxiliar para sync bidirecional (experimenal)
 * 
 * TODO: Implementar sync reverso (EditorStateProvider → ModernQuizEditor)
 * para suportar edição em ambos os sistemas simultaneamente
 */
export function useBidirectionalBridgeSync(options: UseBridgeSyncOptions = {}) {
  // Forward sync (implementado)
  const forwardSync = useBridgeSync(options);

  // Reverse sync (TODO)
  // const editorState = useEditorState();
  // const { setQuiz } = useQuizStore();
  
  // useEffect(() => {
  //   // Detectar mudanças no EditorStateProvider
  //   // Converter Block[] → QuizBlock[]
  //   // Atualizar useQuizStore
  // }, [editorState.stepBlocks]);

  return {
    forward: forwardSync,
    reverse: null, // TODO
  };
}
