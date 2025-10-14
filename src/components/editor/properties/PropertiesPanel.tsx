/**
 * 🎯 PROPERTIES PANEL - Painel Dinâmico de Edição de Propriedades
 * 
 * Painel lateral direito que permite editar propriedades dos blocos.
 * - Gera campos dinamicamente baseado no tipo de bloco
 * - Atualiza JSON via useStepBlocks
 * - Live preview enquanto edita (debounce 300ms)
 * - Ações: Delete, Duplicate, Move Up/Down
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useStepBlocks } from '@/editor/hooks/useStepBlocks';
import { getBlockDefinition } from '@/editor/registry/BlockRegistry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Copy, ArrowUp, ArrowDown, X, Save, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertiesPanelProps {
  blockId: string | null;
  stepIndex: number;
  onClose?: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  blockId,
  stepIndex,
  onClose
}) => {
  const {
    getBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlockUp,
    moveBlockDown,
    getBlockIndex,
    blocks
  } = useStepBlocks(stepIndex);

  const [localValues, setLocalValues] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Obter bloco atual
  const block = blockId ? getBlock(blockId) : null;
  const definition = block ? getBlockDefinition(block.type) : null;
  const blockIndex = blockId ? getBlockIndex(blockId) : -1;

  // Inicializar valores locais quando bloco muda
  useEffect(() => {
    if (block) {
      setLocalValues({
        ...block.content,
        ...block.properties
      });
      setHasChanges(false);
    }
  }, [block?.id]);

  // Debounced update
  useEffect(() => {
    if (!hasChanges || !blockId) return;

    const timer = setTimeout(() => {
      // Separar content e properties
      const content: Record<string, any> = {};
      const properties: Record<string, any> = {};

      Object.entries(localValues).forEach(([key, value]) => {
        // Se está nas defaultProps.content, vai para content
        if (definition?.defaultProps.content && key in definition.defaultProps.content) {
          content[key] = value;
        } else {
          properties[key] = value;
        }
      });

      updateBlock(blockId, {
        content: Object.keys(content).length > 0 ? content : undefined,
        properties: Object.keys(properties).length > 0 ? properties : undefined
      });

      setHasChanges(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValues, hasChanges, blockId, updateBlock, definition]);

  // Handler genérico de mudança
  const handleChange = useCallback((key: string, value: any) => {
    setLocalValues(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  }, []);

  if (!block) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <span>Nenhum bloco selecionado</span>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <aside className="w-80 bg-white border-l flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-sm font-semibold">{block.type}</h2>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={() => duplicateBlock(block.id)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => deleteBlock(block.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        {definition && Object.entries(localValues).map(([key, value]) => {
          // Renderiza controles dinamicamente conforme tipo do valor
          const valueType = typeof value;

          if (valueType === 'string') {
            // Se é longo, usar textarea, senão input
            const isLong = String(value).length > 50;

            if (isLong) {
              return (
                <div key={key} className="mb-4">
                  <Label>{key}</Label>
                  <Textarea
                    value={value || ''}
                    onChange={e => handleChange(key, e.target.value)}
                  />
                </div>
              );
            }

            return (
              <div key={key} className="mb-4">
                <Label>{key}</Label>
                <Input
                  value={value || ''}
                  onChange={e => handleChange(key, e.target.value)}
                />
              </div>
            );
          }

          if (valueType === 'number') {
            return (
              <div key={key} className="mb-4">
                <Label>{key}</Label>
                <Input
                  type="number"
                  value={value || 0}
                  onChange={e => handleChange(key, Number(e.target.value))}
                />
              </div>
            );
          }

          if (valueType === 'boolean') {
            return (
              <div key={key} className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`checkbox-${key}`}
                  checked={!!value}
                  onChange={e => handleChange(key, e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor={`checkbox-${key}`}>{key}</Label>
              </div>
            );
          }

          // Para tipos complexos (arrays, objects), usar JSON
          if (valueType === 'object') {
            return (
              <div key={key} className="mb-4">
                <Label>{key}</Label>
                <Textarea
                  value={JSON.stringify(value, null, 2)}
                  onChange={e => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      handleChange(key, parsed);
                    } catch {
                      // Ignorar parse errors enquanto digita
                    }
                  }}
                  className="font-mono text-xs"
                  rows={6}
                />
              </div>
            );
          }

          return null;
        })}
      </ScrollArea>
      <div className="border-t p-4 flex gap-2">
        <Button size="sm" variant="secondary" disabled={!hasChanges} onClick={() => setHasChanges(false)}>
          Descartar
        </Button>
        <Button size="sm" variant="default" disabled={!hasChanges} onClick={() => setHasChanges(false)}>
          Salvar
        </Button>
      </div>
    </aside>
  );
};

export default PropertiesPanel;