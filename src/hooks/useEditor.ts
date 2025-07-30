
import { useState, useCallback, useEffect } from 'react';
import { Block, EditorConfig, EditableContent, BlockType, EditorBlock } from '@/types/editor';
import { toast } from '@/components/ui/use-toast';
import { useHistory } from './useHistory';
import { getDefaultContentForType } from '@/utils/editorDefaults';
import { generateId } from '@/utils/idGenerator';

export const useEditor = () => {
  const [config, setConfig] = useState<EditorConfig>({
    blocks: []
  });
  
  // Load config from localStorage on initial load
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('editor_config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Error loading editor config:', error);
    }
  }, []);

  // Setup history for undo/redo
  const { past, present, future, saveState, undo, redo } = useHistory<EditorConfig>(config);

  useEffect(() => {
    if (present && present !== config) {
      setConfig(present);
    }
  }, [present]);

  const addBlock = useCallback((type: BlockType) => {
    const newBlock: EditorBlock = {
      id: generateId(),
      type,
      content: getDefaultContentForType(type),
      order: config.blocks.length
    };
    
    const newConfig: EditorConfig = {
      ...config,
      blocks: [...config.blocks, newBlock]
    };
    
    setConfig(newConfig);
    saveState(newConfig);
    return newBlock.id;
  }, [config, saveState]);

  const updateBlock = useCallback((id: string, content: Partial<EditableContent>) => {
    const newConfig: EditorConfig = {
      ...config,
      blocks: config.blocks.map(block => 
        block.id === id ? { ...block, content: { ...block.content, ...content } } : block
      ) as EditorBlock[]
    };
    
    setConfig(newConfig);
    saveState(newConfig);
  }, [config, saveState]);

  const deleteBlock = useCallback((id: string) => {
    const newBlocks = config.blocks.filter(block => block.id !== id);
    
    const newConfig: EditorConfig = {
      ...config,
      blocks: newBlocks.map((block, index) => ({ ...block, order: index })) as EditorBlock[]
    };
    
    setConfig(newConfig);
    saveState(newConfig);
  }, [config, saveState]);

  const reorderBlocks = useCallback((sourceIndex: number, destinationIndex: number) => {
    const newBlocks = Array.from(config.blocks);
    const [removed] = newBlocks.splice(sourceIndex, 1);
    newBlocks.splice(destinationIndex, 0, removed);
    
    const newConfig: EditorConfig = {
      ...config,
      blocks: newBlocks.map((block, index) => ({ ...block, order: index })) as EditorBlock[]
    };
    
    setConfig(newConfig);
    saveState(newConfig);
  }, [config, saveState]);

  const saveConfig = useCallback(() => {
    try {
      localStorage.setItem('editor_config', JSON.stringify(config));
      toast({
        title: "Configuração salva",
        description: "Suas alterações foram salvas com sucesso."
      });
      return true;
    } catch (error) {
      console.error('Error saving editor config:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive"
      });
      return false;
    }
  }, [config]);

  return {
    config,
    setConfig,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    saveConfig,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0
  };
};
