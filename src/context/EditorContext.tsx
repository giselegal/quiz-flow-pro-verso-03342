import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useEditorSupabase } from '@/hooks/useEditorSupabase';
import { Block } from '@/types/editor';
import { generateSemanticId } from '@/utils/semanticIdGenerator';

// Define the types for the editor state
export interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  isPreviewing: boolean;
  funnelId: string;
  supabaseEnabled: boolean;
  isGlobalStylesOpen: boolean;
}

// Define the actions that can be dispatched to the reducer
export type EditorAction =
  | { type: 'SET_BLOCKS'; payload: Block[] }
  | { type: 'ADD_BLOCK'; payload: Block }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; content: any } }
  | { type: 'DELETE_BLOCK'; payload: string }
  | { type: 'SELECT_BLOCK'; payload: string | null }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SET_FUNNEL_ID'; payload: string }
  | { type: 'TOGGLE_SUPABASE'; payload: boolean }
  | { type: 'REORDER_BLOCKS'; payload: { sourceIndex: number; destinationIndex: number } }
  | { type: 'SET_GLOBAL_STYLES_OPEN'; payload: boolean };

// Define the reducer function that will update the state
export const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'SET_BLOCKS':
      return { ...state, blocks: action.payload };
    case 'ADD_BLOCK':
      return { ...state, blocks: [...state.blocks, action.payload] };
    case 'UPDATE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map(block =>
          block.id === action.payload.id ? { ...block, content: action.payload.content } : block
        ),
      };
    case 'DELETE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.filter(block => block.id !== action.payload),
        selectedBlockId: state.selectedBlockId === action.payload ? null : state.selectedBlockId,
      };
    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.payload };
    case 'TOGGLE_PREVIEW':
      return { ...state, isPreviewing: !state.isPreviewing };
    case 'SET_FUNNEL_ID':
      return { ...state, funnelId: action.payload };
    case 'TOGGLE_SUPABASE':
      return { ...state, supabaseEnabled: action.payload };
    case 'REORDER_BLOCKS': {
      const { sourceIndex, destinationIndex } = action.payload;
      const blocks = [...state.blocks];
      const [removed] = blocks.splice(sourceIndex, 1);
      blocks.splice(destinationIndex, 0, removed);
      return { ...state, blocks };
    }
    case 'SET_GLOBAL_STYLES_OPEN':
      return { ...state, isGlobalStylesOpen: action.payload };
    default:
      return state;
  }
};

// Define the initial state for the editor
const initialState: EditorState = {
  blocks: [],
  selectedBlockId: null,
  isPreviewing: false,
  funnelId: 'default-funnel-id',
  supabaseEnabled: false,
  isGlobalStylesOpen: false,
};

// Create the editor context
export const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  addBlock: (type: Block['type']) => Promise<string>;
  updateBlock: (id: string, content: any) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  selectBlock: (id: string | null) => void;
  togglePreview: () => void;
  setFunnelId: (funnelId: string) => void;
  toggleSupabase: (enabled: boolean) => void;
  reorderBlocks: (sourceIndex: number, destinationIndex: number) => Promise<void>;
  isSaving: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  lastSync: string | null;
  isGlobalStylesOpen: boolean;
  setGlobalStylesOpen: (open: boolean) => void;
}>({
  state: initialState,
  dispatch: () => null,
  addBlock: () => Promise.resolve(''),
  updateBlock: () => Promise.resolve(),
  deleteBlock: () => Promise.resolve(),
  selectBlock: () => null,
  togglePreview: () => null,
  setFunnelId: () => null,
  toggleSupabase: () => null,
  reorderBlocks: () => Promise.resolve(),
  isSaving: false,
  connectionStatus: 'disconnected',
  lastSync: null,
  isGlobalStylesOpen: false,
  setGlobalStylesOpen: () => null,
});

// Create a custom hook to use the editor context
export const useEditor = () => useContext(EditorContext);

const getDefaultContent = (type: Block['type']) => {
  switch (type) {
    case 'headline':
      return { title: 'Novo Título', subtitle: '' };
    case 'text':
      return { text: 'Novo texto' };
    case 'image':
      return { imageUrl: '', imageAlt: '', caption: '' };
    case 'benefits':
      return { title: 'Benefícios', items: [] };
    default:
      return {};
  }
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  
  // Fix the hook call - pass just the funnelId string
  const supabaseHook = useEditorSupabase(state.funnelId);
  
  const {
    components: supabaseComponents,
    isLoading: supabaseLoading,
    error: supabaseError,
    loadComponents,
    addComponent: addSupabaseComponent,
    updateComponent: updateSupabaseComponent,
    deleteComponent: deleteSupabaseComponent,
    reorderComponents,
    // Add missing properties with default values
    connectionStatus = 'disconnected',
    isSaving = false,
    lastSync = null
  } = supabaseHook;

  useEffect(() => {
    if (state.supabaseEnabled) {
      loadComponents();
    }
  }, [state.supabaseEnabled, loadComponents]);

  useEffect(() => {
    if (supabaseError) {
      toast.error(`Supabase Error: ${supabaseError}`);
    }
  }, [supabaseError]);

  useEffect(() => {
    // Convert Supabase components to blocks when they load
    if (supabaseComponents && supabaseComponents.length > 0) {
      const blocks = convertSupabaseToBlocks(supabaseComponents);
      dispatch({ type: 'SET_BLOCKS', payload: blocks });
    }
  }, [supabaseComponents]);

  const addBlock = useCallback(async (type: Block['type']) => {
    const blockId = generateSemanticId({
      context: 'editor',
      type: 'block',
      identifier: type,
      index: Math.floor(Math.random() * 1000),
    });

    const newBlock: Block = {
      id: blockId,
      type,
      content: getDefaultContent(type),
      properties: {},
      order: state.blocks.length,
    };

    dispatch({ type: 'ADD_BLOCK', payload: newBlock });

    // Add to Supabase if enabled and connected
    if (state.supabaseEnabled && connectionStatus === 'connected') {
      try {
        await addSupabaseComponent(type, 1, newBlock.content, state.blocks.length);
      } catch (error) {
        console.error('Failed to sync block to Supabase:', error);
      }
    }

    return blockId;
  }, [state.blocks.length, state.supabaseEnabled, connectionStatus, addSupabaseComponent]);

  const updateBlock = useCallback(async (id: string, content: any) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id, content } });

    // Update in Supabase if enabled and connected
    if (state.supabaseEnabled && connectionStatus === 'connected') {
      try {
        await updateSupabaseComponent(id, { properties: content });
      } catch (error) {
        console.error('Failed to sync block update to Supabase:', error);
      }
    }
  }, [state.supabaseEnabled, connectionStatus, updateSupabaseComponent]);

  const deleteBlock = useCallback(async (id: string) => {
    dispatch({ type: 'DELETE_BLOCK', payload: id });

    // Delete from Supabase if enabled and connected
    if (state.supabaseEnabled && connectionStatus === 'connected') {
      try {
        await deleteSupabaseComponent(id);
      } catch (error) {
        console.error('Failed to delete block from Supabase:', error);
      }
    }
  }, [state.supabaseEnabled, connectionStatus, deleteSupabaseComponent]);

  const reorderBlocks = useCallback(async (sourceIndex: number, destinationIndex: number) => {
    dispatch({ type: 'REORDER_BLOCKS', payload: { sourceIndex, destinationIndex } });

    // Reorder in Supabase if enabled and connected
    if (state.supabaseEnabled && connectionStatus === 'connected') {
      try {
        const blockIds = state.blocks.map(block => block.id);
        const reorderedIds = [...blockIds];
        const [removed] = reorderedIds.splice(sourceIndex, 1);
        reorderedIds.splice(destinationIndex, 0, removed);
        
        await reorderComponents(reorderedIds);
      } catch (error) {
        console.error('Failed to reorder blocks in Supabase:', error);
      }
    }
  }, [state.blocks, state.supabaseEnabled, connectionStatus, reorderComponents]);

  const selectBlock = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_BLOCK', payload: id });
  }, []);

  const togglePreview = useCallback(() => {
    dispatch({ type: 'TOGGLE_PREVIEW' });
  }, []);

  const setFunnelId = useCallback((funnelId: string) => {
    dispatch({ type: 'SET_FUNNEL_ID', payload: funnelId });
  }, []);

  const toggleSupabase = useCallback((enabled: boolean) => {
    dispatch({ type: 'TOGGLE_SUPABASE', payload: enabled });
  }, []);

  const setGlobalStylesOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_GLOBAL_STYLES_OPEN', payload: open });
  }, []);

  // Fix the conversion from Supabase components to blocks
  const convertSupabaseToBlocks = useCallback((components: any[]) => {
    return components.map((component: any) => ({
      id: component.id,
      type: component.component_type_key,
      content: component.properties || {},
      properties: component.properties || {},
      order: component.order_index || 0
    }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      addBlock,
      updateBlock,
      deleteBlock,
      selectBlock,
      togglePreview,
      setFunnelId,
      toggleSupabase,
      reorderBlocks,
      isSaving,
      connectionStatus,
      lastSync,
      isGlobalStylesOpen: state.isGlobalStylesOpen,
      setGlobalStylesOpen,
    }),
    [
      state,
      dispatch,
      addBlock,
      updateBlock,
      deleteBlock,
      selectBlock,
      togglePreview,
      setFunnelId,
      toggleSupabase,
      reorderBlocks,
      isSaving,
      connectionStatus,
      lastSync,
      state.isGlobalStylesOpen,
      setGlobalStylesOpen,
    ]
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
