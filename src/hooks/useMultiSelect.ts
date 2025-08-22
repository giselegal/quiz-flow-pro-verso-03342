import { useCallback, useState, useEffect, useRef } from 'react';

export interface MultiSelectState {
  selectedBlocks: Set<string>;
  lastSelectedIndex: number | null;
  selectionMode: 'single' | 'multi';
  isSelecting: boolean;
}

export interface MultiSelectActions {
  selectBlock: (blockId: string, index: number, ctrlKey?: boolean, shiftKey?: boolean) => void;
  deselectBlock: (blockId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  selectRange: (fromIndex: number, toIndex: number) => void;
  toggleBlock: (blockId: string, index: number) => void;
  isSelected: (blockId: string) => boolean;
  getSelectedCount: () => number;
  getSelectedBlocks: () => string[];
  getSelectedIndices: () => number[];
}

export const useMultiSelect = (
  blocks: any[],
  onSelectionChange?: (selectedBlocks: string[]) => void
) => {
  const [state, setState] = useState<MultiSelectState>({
    selectedBlocks: new Set(),
    lastSelectedIndex: null,
    selectionMode: 'single',
    isSelecting: false,
  });

  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

  // 🎯 Selecionar bloco
  const selectBlock = useCallback((
    blockId: string,
    index: number,
    ctrlKey = false,
    shiftKey = false
  ) => {
    setState(prev => {
      const newSelectedBlocks = new Set(prev.selectedBlocks);
      
      // Shift+Click: Seleção em range
      if (shiftKey && prev.lastSelectedIndex !== null) {
        const fromIndex = Math.min(prev.lastSelectedIndex, index);
        const toIndex = Math.max(prev.lastSelectedIndex, index);
        
        // Adicionar todos os blocos no range
        for (let i = fromIndex; i <= toIndex; i++) {
          const block = blocksRef.current[i];
          if (block?.id) {
            newSelectedBlocks.add(block.id);
          }
        }
        
        return {
          ...prev,
          selectedBlocks: newSelectedBlocks,
          selectionMode: 'multi',
          isSelecting: true,
        };
      }
      
      // Ctrl+Click: Toggle seleção
      if (ctrlKey) {
        if (newSelectedBlocks.has(blockId)) {
          newSelectedBlocks.delete(blockId);
        } else {
          newSelectedBlocks.add(blockId);
        }
        
        return {
          ...prev,
          selectedBlocks: newSelectedBlocks,
          lastSelectedIndex: index,
          selectionMode: newSelectedBlocks.size > 1 ? 'multi' : 'single',
          isSelecting: newSelectedBlocks.size > 0,
        };
      }
      
      // Click normal: Seleção única
      newSelectedBlocks.clear();
      newSelectedBlocks.add(blockId);
      
      return {
        ...prev,
        selectedBlocks: newSelectedBlocks,
        lastSelectedIndex: index,
        selectionMode: 'single',
        isSelecting: true,
      };
    });
  }, []);

  // ❌ Desselecionar bloco específico
  const deselectBlock = useCallback((blockId: string) => {
    setState(prev => {
      const newSelectedBlocks = new Set(prev.selectedBlocks);
      newSelectedBlocks.delete(blockId);
      
      return {
        ...prev,
        selectedBlocks: newSelectedBlocks,
        selectionMode: newSelectedBlocks.size > 1 ? 'multi' : 'single',
        isSelecting: newSelectedBlocks.size > 0,
      };
    });
  }, []);

  // 🎯 Selecionar todos
  const selectAll = useCallback(() => {
    setState(prev => {
      const newSelectedBlocks = new Set<string>();
      blocksRef.current.forEach(block => {
        if (block?.id) {
          newSelectedBlocks.add(block.id);
        }
      });
      
      return {
        ...prev,
        selectedBlocks: newSelectedBlocks,
        selectionMode: 'multi',
        isSelecting: true,
        lastSelectedIndex: blocksRef.current.length - 1,
      };
    });
  }, []);

  // 🚫 Desselecionar todos
  const deselectAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedBlocks: new Set(),
      selectionMode: 'single',
      isSelecting: false,
      lastSelectedIndex: null,
    }));
  }, []);

  // 📏 Selecionar range
  const selectRange = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      const newSelectedBlocks = new Set<string>();
      const start = Math.min(fromIndex, toIndex);
      const end = Math.max(fromIndex, toIndex);
      
      for (let i = start; i <= end; i++) {
        const block = blocksRef.current[i];
        if (block?.id) {
          newSelectedBlocks.add(block.id);
        }
      }
      
      return {
        ...prev,
        selectedBlocks: newSelectedBlocks,
        selectionMode: 'multi',
        isSelecting: true,
        lastSelectedIndex: toIndex,
      };
    });
  }, []);

  // 🔄 Toggle seleção de bloco
  const toggleBlock = useCallback((blockId: string, index: number) => {
    setState(prev => {
      const newSelectedBlocks = new Set(prev.selectedBlocks);
      
      if (newSelectedBlocks.has(blockId)) {
        newSelectedBlocks.delete(blockId);
      } else {
        newSelectedBlocks.add(blockId);
      }
      
      return {
        ...prev,
        selectedBlocks: newSelectedBlocks,
        lastSelectedIndex: index,
        selectionMode: newSelectedBlocks.size > 1 ? 'multi' : 'single',
        isSelecting: newSelectedBlocks.size > 0,
      };
    });
  }, []);

  // ✅ Verificar se bloco está selecionado
  const isSelected = useCallback((blockId: string) => {
    return state.selectedBlocks.has(blockId);
  }, [state.selectedBlocks]);

  // 📊 Obter contagem de selecionados
  const getSelectedCount = useCallback(() => {
    return state.selectedBlocks.size;
  }, [state.selectedBlocks]);

  // 📋 Obter lista de blocos selecionados
  const getSelectedBlocks = useCallback(() => {
    return Array.from(state.selectedBlocks);
  }, [state.selectedBlocks]);

  // 📍 Obter índices dos blocos selecionados
  const getSelectedIndices = useCallback(() => {
    const indices: number[] = [];
    blocksRef.current.forEach((block, index) => {
      if (block?.id && state.selectedBlocks.has(block.id)) {
        indices.push(index);
      }
    });
    return indices.sort((a, b) => a - b);
  }, [state.selectedBlocks]);

  // 🔔 Notificar mudanças na seleção
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(getSelectedBlocks());
    }
  }, [state.selectedBlocks, onSelectionChange, getSelectedBlocks]);

  // ⌨️ Handlers de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape: Desselecionar todos
      if (event.key === 'Escape') {
        deselectAll();
        return;
      }
      
      // Ctrl+A: Selecionar todos
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault();
        selectAll();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [deselectAll, selectAll]);

  const actions: MultiSelectActions = {
    selectBlock,
    deselectBlock,
    selectAll,
    deselectAll,
    selectRange,
    toggleBlock,
    isSelected,
    getSelectedCount,
    getSelectedBlocks,
    getSelectedIndices,
  };

  return {
    ...state,
    ...actions,
  };
};

export default useMultiSelect;
