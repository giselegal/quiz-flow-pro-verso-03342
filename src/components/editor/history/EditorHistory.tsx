import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { BlockData } from '@/types/blocks';
import { AlertCircle, CheckCircle, Clock, History, Redo2, Save, Undo2 } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useOptimizedScheduler from '@/hooks/useOptimizedScheduler';

interface EditorAction {
  type: 'add' | 'update' | 'delete' | 'move';
  blockId: string;
  previousState?: BlockData;
  newState?: BlockData;
  timestamp: number;
}

interface EditorHistoryProps {
  blocks: BlockData[];
  onBlocksChange: (blocks: BlockData[]) => void;
  onSave?: () => void;
  autoSave?: boolean;
  className?: string;
}

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

const EditorHistory: React.FC<EditorHistoryProps> = ({
  blocks,
  onBlocksChange,
  onSave,
  autoSave = true,
  className,
}) => {
  const [history, setHistory] = useState<EditorAction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    warnings: [],
    errors: [],
  });

  const previousBlocksRef = useRef<BlockData[]>(blocks);
  const { debounce } = useOptimizedScheduler();

  // Validar blocos
  const validateBlocks = useCallback((blocksToValidate: BlockData[]): ValidationResult => {
    const warnings: string[] = [];
    const errors: string[] = [];

    blocksToValidate.forEach(block => {
      // Validações básicas
      if (!block.id) {
        errors.push(`Bloco sem ID encontrado`);
      }

      if (!block.type) {
        errors.push(`Bloco ${block.id} sem tipo definido`);
      }

      // Validações específicas por tipo
      if (block.type === 'options-grid') {
        const options = block.properties?.options;
        if (!options || !Array.isArray(options) || options.length === 0) {
          warnings.push(`Grade de opções ${block.id} está vazia`);
        }
      }

      if (block.type === 'text-inline' || block.type === 'heading-inline') {
        if (!block.properties?.content) {
          warnings.push(`Bloco de texto ${block.id} está vazio`);
        }
      }

      if (block.type === 'image-display-inline') {
        if (!block.properties?.imageUrl) {
          warnings.push(`Bloco de imagem ${block.id} sem URL`);
        }
      }

      if (block.type === 'button-inline') {
        if (!block.properties?.text) {
          warnings.push(`Botão ${block.id} sem texto`);
        }
        if (!block.properties?.href && !block.properties?.onClick) {
          warnings.push(`Botão ${block.id} sem ação definida`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
    };
  }, []);

  // Adicionar ação ao histórico
  const addToHistory = useCallback(
    (action: Omit<EditorAction, 'timestamp'>) => {
      const newAction: EditorAction = {
        ...action,
        timestamp: Date.now(),
      };

      setHistory(prev => {
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(newAction);

        // Limitar histórico a 50 ações
        return newHistory.slice(-50);
      });

      setCurrentIndex(prev => Math.min(prev + 1, 49));
    },
    [currentIndex]
  );

  // Detectar mudanças nos blocos
  useEffect(() => {
    const currentBlocks = blocks;
    const previousBlocks = previousBlocksRef.current;

    if (JSON.stringify(currentBlocks) !== JSON.stringify(previousBlocks)) {
      // Determinar tipo de mudança
      const currentIds = new Set(currentBlocks.map(b => b.id));
      const previousIds = new Set(previousBlocks.map(b => b.id));

      // Blocos adicionados
      currentBlocks.forEach(block => {
        if (!previousIds.has(block.id)) {
          addToHistory({
            type: 'add',
            blockId: block.id,
            newState: block,
          });
        }
      });

      // Blocos removidos
      previousBlocks.forEach(block => {
        if (!currentIds.has(block.id)) {
          addToHistory({
            type: 'delete',
            blockId: block.id,
            previousState: block,
          });
        }
      });

      // Blocos modificados
      currentBlocks.forEach(currentBlock => {
        const previousBlock = previousBlocks.find(b => b.id === currentBlock.id);
        if (previousBlock && JSON.stringify(currentBlock) !== JSON.stringify(previousBlock)) {
          addToHistory({
            type: 'update',
            blockId: currentBlock.id,
            previousState: previousBlock,
            newState: currentBlock,
          });
        }
      });

      previousBlocksRef.current = currentBlocks;

      // Validar após mudança
      setValidationResult(validateBlocks(currentBlocks));

      // Auto-save (debounced)
      if (autoSave) {
        debounce('editor-history-autosave', () => {
          handleSave();
        }, 2000);
      }
    }
  }, [blocks, addToHistory, validateBlocks, autoSave]);

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (!canUndo) return;

    const action = history[currentIndex];
    let newBlocks = [...blocks];

    switch (action.type) {
      case 'add':
        newBlocks = newBlocks.filter(b => b.id !== action.blockId);
        break;
      case 'delete':
        if (action.previousState) {
          newBlocks.push(action.previousState);
        }
        break;
      case 'update':
        if (action.previousState) {
          const index = newBlocks.findIndex(b => b.id === action.blockId);
          if (index !== -1) {
            newBlocks[index] = action.previousState;
          }
        }
        break;
    }

    setCurrentIndex(prev => prev - 1);
    onBlocksChange(newBlocks);
  }, [canUndo, history, currentIndex, blocks, onBlocksChange]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;

    const nextIndex = currentIndex + 1;
    const action = history[nextIndex];
    let newBlocks = [...blocks];

    switch (action.type) {
      case 'add':
        if (action.newState) {
          newBlocks.push(action.newState);
        }
        break;
      case 'delete':
        newBlocks = newBlocks.filter(b => b.id !== action.blockId);
        break;
      case 'update':
        if (action.newState) {
          const index = newBlocks.findIndex(b => b.id === action.blockId);
          if (index !== -1) {
            newBlocks[index] = action.newState;
          }
        }
        break;
    }

    setCurrentIndex(nextIndex);
    onBlocksChange(newBlocks);
  }, [canRedo, history, currentIndex, blocks, onBlocksChange]);

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave();
      setLastSaved(Date.now());
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getLastActionDescription = () => {
    if (history.length === 0) return 'Nenhuma ação';

    const lastAction = history[history.length - 1];
    const timeAgo = Math.floor((Date.now() - lastAction.timestamp) / 1000);

    let description = '';
    switch (lastAction.type) {
      case 'add':
        description = 'Bloco adicionado';
        break;
      case 'delete':
        description = 'Bloco removido';
        break;
      case 'update':
        description = 'Bloco atualizado';
        break;
      case 'move':
        description = 'Bloco movido';
        break;
    }

    return `${description} • ${timeAgo}s atrás`;
  };

  const getTimeSinceLastSave = () => {
    const seconds = Math.floor((Date.now() - lastSaved) / 1000);
    if (seconds < 60) return `${seconds}s atrás`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m atrás`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h atrás`;
  };

  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-2', className)}>
        {/* Controles de Undo/Redo */}
        <div className="flex bg-white rounded-lg border border-[#B89B7A]/30 p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={!canUndo}
                className="disabled:opacity-50"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Desfazer (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={!canRedo}
                className="disabled:opacity-50"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refazer (Ctrl+Y)</TooltipContent>
          </Tooltip>
        </div>

        {/* Status de validação */}
        <Card className="bg-white border-[#B89B7A]/30">
          <CardContent className="px-3 py-1 flex items-center gap-2">
            {validationResult.errors.length > 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div style={{ color: '#432818' }}>
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{validationResult.errors.length}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-xs">
                    <p className="font-medium mb-1">Erros:</p>
                    {validationResult.errors.map((error, i) => (
                      <p key={i} className="text-sm">
                        • {error}
                      </p>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">OK</span>
              </div>
            )}

            {validationResult.warnings.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    {validationResult.warnings.length} avisos
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-xs">
                    <p className="font-medium mb-1">Avisos:</p>
                    {validationResult.warnings.map((warning, i) => (
                      <p key={i} className="text-sm">
                        • {warning}
                      </p>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </CardContent>
        </Card>

        {/* Histórico e Save */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div style={{ color: '#6B4F43' }}>
                <History className="w-4 h-4" />
                {history.length}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getLastActionDescription()}</p>
            </TooltipContent>
          </Tooltip>

          {onSave && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="border-[#B89B7A]/30 hover:border-[#B89B7A]"
              >
                <Save className={cn('w-4 h-4 mr-1', isSaving && 'animate-pulse')} />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div style={{ color: '#8B7355' }}>
                    <Clock className="w-3 h-3" />
                    {getTimeSinceLastSave()}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Último salvamento</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EditorHistory;
