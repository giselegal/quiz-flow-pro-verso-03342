/**
 * 🎯 USE EDITOR HOOK - Presentation Layer
 * 
 * Custom hook for editor state management and operations.
 * Provides reactive interface to EditorService operations.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { EditorState, Block } from '@/core/domains';
import { EditorService, EditorSession, EditorHistory } from '@/application/services/EditorService';

const editorService = new EditorService();

export interface UseEditorState {
  session: EditorSession | null;
  editorState: EditorState | null;
  selectedBlocks: string[];
  history: EditorHistory | null;
  canUndo: boolean;
  canRedo: boolean;
  isAutoSaving: boolean;
  lastSavedAt: Date | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseEditorActions {
  // Session management
  createSession: (entityId: string, entityType: 'quiz' | 'funnel', userId?: string) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  closeSession: () => Promise<void>;
  
  // State management
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  
  // Block operations
  addBlock: (blockType: string, content: any, position?: { x: number; y: number }) => Promise<void>;
  updateBlock: (blockId: string, updates: Partial<Block>) => Promise<void>;
  deleteBlock: (blockId: string) => Promise<void>;
  duplicateBlock: (blockId: string) => Promise<void>;
  moveBlock: (blockId: string, newPosition: { x: number; y: number }) => Promise<void>;
  selectBlocks: (blockIds: string[]) => Promise<void>;
  selectBlock: (blockId: string) => Promise<void>;
  deselectAll: () => Promise<void>;
  
  // Clipboard operations
  copyBlocks: (blockIds?: string[]) => Promise<void>;
  cutBlocks: (blockIds?: string[]) => Promise<void>;
  pasteBlocks: (position?: { x: number; y: number }) => Promise<void>;
  
  // Save/Load operations
  save: () => Promise<void>;
  exportState: () => Promise<string>;
  importState: (stateJson: string) => Promise<void>;
  
  // Utility
  clearError: () => void;
  reset: () => void;
}

export function useEditor(
  entityId?: string,
  entityType?: 'quiz' | 'funnel'
): UseEditorState & UseEditorActions {
  const [state, setState] = useState<UseEditorState>({
    session: null,
    editorState: null,
    selectedBlocks: [],
    history: null,
    canUndo: false,
    canRedo: false,
    isAutoSaving: false,
    lastSavedAt: null,
    isLoading: false,
    error: null
  });

  const sessionIdRef = useRef<string | null>(null);

  // 🔍 Internal state updaters
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const updateState = useCallback((updates: Partial<UseEditorState>) => {
    setState(prev => ({ ...prev, ...updates, isLoading: false }));
  }, []);

  const syncStateFromSession = useCallback((session: EditorSession) => {
    updateState({
      session,
      editorState: session.currentState,
      selectedBlocks: session.currentState.selectedBlockId ? [session.currentState.selectedBlockId] : [],
      history: session.history,
      canUndo: session.history.currentIndex > 0,
      canRedo: session.history.currentIndex < session.history.states.length - 1,
      isAutoSaving: session.isAutoSaving,
      lastSavedAt: session.lastSavedAt || null,
      error: null
    });
  }, [updateState]);

  // 🔍 Session Management
  const createSession = useCallback(async (
    entityId: string,
    entityType: 'quiz' | 'funnel',
    userId?: string
  ) => {
    try {
      setLoading(true);
      const session = await editorService.createEditorSession(entityId, entityType, userId);
      sessionIdRef.current = session.id;
      syncStateFromSession(session);
    } catch (error) {
      setError(`Failed to create editor session: ${error}`);
    }
  }, [setLoading, syncStateFromSession, setError]);

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setLoading(true);
      const session = await editorService.getEditorSession(sessionId);
      if (!session) {
        setError('Editor session not found');
        return;
      }
      sessionIdRef.current = session.id;
      syncStateFromSession(session);
    } catch (error) {
      setError(`Failed to load editor session: ${error}`);
    }
  }, [setLoading, syncStateFromSession, setError]);

  const closeSession = useCallback(async () => {
    if (!sessionIdRef.current) return;

    try {
      setLoading(true);
      await editorService.closeEditorSession(sessionIdRef.current);
      sessionIdRef.current = null;
      setState({
        session: null,
        editorState: null,
        selectedBlocks: [],
        history: null,
        canUndo: false,
        canRedo: false,
        isAutoSaving: false,
        lastSavedAt: null,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setError(`Failed to close editor session: ${error}`);
    }
  }, [setLoading, setError]);

  // 🔍 State Management
  const undo = useCallback(async () => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const session = await editorService.undo(sessionIdRef.current);
      if (session) {
        syncStateFromSession(session);
      }
    } catch (error) {
      setError(`Failed to undo: ${error}`);
    }
  }, [sessionIdRef, setLoading, syncStateFromSession, setError]);

  const redo = useCallback(async () => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const session = await editorService.redo(sessionIdRef.current);
      if (session) {
        syncStateFromSession(session);
      }
    } catch (error) {
      setError(`Failed to redo: ${error}`);
    }
  }, [sessionIdRef, setLoading, syncStateFromSession, setError]);

  // 🔍 Block Operations
  const addBlock = useCallback(async (
    blockType: string,
    content: any
  ) => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const session = await editorService.addBlock(
        sessionIdRef.current,
        blockType,
        content
      );
      syncStateFromSession(session);
    } catch (error) {
      setError(`Failed to add block: ${error}`);
    }
  }, [sessionIdRef, setLoading, syncStateFromSession, setError]);

  const updateBlock = useCallback(async (
    blockId: string,
    updates: Partial<Block>
  ) => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const session = await editorService.updateBlock(
        sessionIdRef.current,
        blockId,
        updates
      );
      syncStateFromSession(session);
    } catch (error) {
      setError(`Failed to update block: ${error}`);
    }
  }, [sessionIdRef, setLoading, syncStateFromSession, setError]);

  const deleteBlock = useCallback(async (blockId: string) => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const session = await editorService.deleteBlock(sessionIdRef.current, blockId);
      syncStateFromSession(session);
    } catch (error) {
      setError(`Failed to delete block: ${error}`);
    }
  }, [sessionIdRef, setLoading, syncStateFromSession, setError]);

  const duplicateBlock = useCallback(async (blockId: string) => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const session = await editorService.duplicateBlock(sessionIdRef.current, blockId);
      syncStateFromSession(session);
    } catch (error) {
      setError(`Failed to duplicate block: ${error}`);
    }
  }, [sessionIdRef, setLoading, syncStateFromSession, setError]);

  const moveBlock = useCallback(async (
    blockId: string,
    newPosition: { x: number; y: number }
  ) => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const session = await editorService.moveBlock(
        sessionIdRef.current,
        blockId,
        newPosition
      );
      syncStateFromSession(session);
    } catch (error) {
      setError(`Failed to move block: ${error}`);
    }
  }, [sessionIdRef, setLoading, syncStateFromSession, setError]);

  const selectBlocks = useCallback(async (blockIds: string[]) => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const session = await editorService.selectBlocks(sessionIdRef.current, blockIds);
      syncStateFromSession(session);
    } catch (error) {
      setError(`Failed to select blocks: ${error}`);
    }
  }, [sessionIdRef, setLoading, syncStateFromSession, setError]);

  const selectBlock = useCallback(async (blockId: string) => {
    await selectBlocks([blockId]);
  }, [selectBlocks]);

  const deselectAll = useCallback(async () => {
    await selectBlocks([]);
  }, [selectBlocks]);

  // 🔍 Clipboard Operations
  const copyBlocks = useCallback(async (blockIds?: string[]) => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    const targetBlockIds = blockIds || state.selectedBlocks;
    if (targetBlockIds.length === 0) {
      setError('No blocks selected to copy');
      return;
    }

    try {
      setLoading(true);
      const session = await editorService.copyBlocks(sessionIdRef.current, targetBlockIds);
      syncStateFromSession(session);
    } catch (error) {
      setError(`Failed to copy blocks: ${error}`);
    }
  }, [sessionIdRef, state.selectedBlocks, setLoading, syncStateFromSession, setError]);

  const cutBlocks = useCallback(async (blockIds?: string[]) => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    const targetBlockIds = blockIds || state.selectedBlocks;
    if (targetBlockIds.length === 0) {
      setError('No blocks selected to cut');
      return;
    }

    try {
      setLoading(true);
      const session = await editorService.cutBlocks(sessionIdRef.current, targetBlockIds);
      syncStateFromSession(session);
    } catch (error) {
      setError(`Failed to cut blocks: ${error}`);
    }
  }, [sessionIdRef, state.selectedBlocks, setLoading, syncStateFromSession, setError]);

  const pasteBlocks = useCallback(async (position?: { x: number; y: number }) => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const session = await editorService.pasteBlocks(sessionIdRef.current, position);
      syncStateFromSession(session);
    } catch (error) {
      setError(`Failed to paste blocks: ${error}`);
    }
  }, [sessionIdRef, setLoading, syncStateFromSession, setError]);

  // 🔍 Save/Load Operations
  const save = useCallback(async () => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const success = await editorService.saveEditorState(sessionIdRef.current);
      if (success) {
        updateState({ lastSavedAt: new Date(), error: null });
      } else {
        setError('Failed to save editor state');
      }
    } catch (error) {
      setError(`Failed to save: ${error}`);
    }
  }, [sessionIdRef, setLoading, updateState, setError]);

  const exportState = useCallback(async (): Promise<string> => {
    if (!sessionIdRef.current) {
      throw new Error('No active session');
    }

    try {
      return await editorService.exportEditorState(sessionIdRef.current);
    } catch (error) {
      setError(`Failed to export state: ${error}`);
      throw error;
    }
  }, [sessionIdRef, setError]);

  const importState = useCallback(async (stateJson: string) => {
    if (!sessionIdRef.current) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const session = await editorService.importEditorState(sessionIdRef.current, stateJson);
      syncStateFromSession(session);
    } catch (error) {
      setError(`Failed to import state: ${error}`);
    }
  }, [sessionIdRef, setLoading, syncStateFromSession, setError]);

  // 🔍 Utility functions
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    sessionIdRef.current = null;
    setState({
      session: null,
      editorState: null,
      selectedBlocks: [],
      history: null,
      canUndo: false,
      canRedo: false,
      isAutoSaving: false,
      lastSavedAt: null,
      isLoading: false,
      error: null
    });
  }, []);

  // 🔍 Auto-create session if entity info provided
  useEffect(() => {
    if (entityId && entityType && !state.session) {
      createSession(entityId, entityType);
    }
  }, [entityId, entityType, state.session, createSession]);

  // 🔍 Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            event.preventDefault();
            redo();
            break;
          case 's':
            event.preventDefault();
            save();
            break;
          case 'c':
            if (state.selectedBlocks.length > 0) {
              event.preventDefault();
              copyBlocks();
            }
            break;
          case 'x':
            if (state.selectedBlocks.length > 0) {
              event.preventDefault();
              cutBlocks();
            }
            break;
          case 'v':
            event.preventDefault();
            pasteBlocks();
            break;
          case 'a':
            if (state.editorState && state.editorState.selectedBlockId) {
              event.preventDefault();
              selectBlocks([state.editorState.selectedBlockId]);
            }
            break;
        }
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        if (state.selectedBlocks.length > 0) {
          event.preventDefault();
          state.selectedBlocks.forEach(blockId => deleteBlock(blockId));
        }
      } else if (event.key === 'Escape') {
        deselectAll();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    undo, redo, save, copyBlocks, cutBlocks, pasteBlocks, selectBlocks, deleteBlock, deselectAll,
    state.selectedBlocks, state.editorState
  ]);

  return {
    // State
    ...state,
    
    // Actions
    createSession,
    loadSession,
    closeSession,
    
    undo,
    redo,
    
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    selectBlocks,
    selectBlock,
    deselectAll,
    
    copyBlocks,
    cutBlocks,
    pasteBlocks,
    
    save,
    exportState,
    importState,
    
    clearError,
    reset
  };
}