/**
 * 🎯 PROPERTIES PANEL V4 - Painel Alinhado com Zod Schema
 * 
 * ⚠️ DEPRECATED: Este painel é LEGADO. Use SinglePropertiesPanel ao invés.
 * @deprecated Migre para SinglePropertiesPanel ou PropertiesColumn
 * @see SinglePropertiesPanel - Painel canônico de propriedades
 * @see archive/legacy/README.md - Instruções de migração
 * 
 * Painel lateral direito que permite editar propriedades dos blocos.
 * ✅ Validação com Zod (QuizBlockSchemaZ)
 * ✅ Integração com useStepBlocksV4
 * ✅ Suporte a properties, content e metadata
 * ✅ Live preview com debounce (300ms)
 * ✅ Ações: Delete, Duplicate, Move Up/Down
 * 
 * @version 4.0.0 - Alinhado com quiz-schema.zod.ts
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useStepBlocks } from '@/hooks/useStepBlocksV4';
import { QuizBlockSchemaZ, type QuizBlock } from '@/schemas/quiz-schema.zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Trash2, Copy, ArrowUp, ArrowDown, X, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { appLogger } from '@/lib/utils/appLogger';

interface PropertiesPanelProps {
  blockId?: string | null;
  stepIndex?: number;
  onClose?: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  blockId,
  stepIndex = 0,
  onClose,
}) => {
  // Convert stepIndex to stepId string
  const stepId = `step-${String(stepIndex).padStart(2, '0')}`;

  // Tentar usar o hook de forma segura
  let hookResult: any = null;
  let hookError: Error | null = null;

  try {
    hookResult = useStepBlocks(stepId);
  } catch (error) {
    hookError = error as Error;
    console.warn('PropertiesPanel: useStepBlocks failed', error);
  }

  // Se o hook falhou, mostrar mensagem de erro amigável
  if (hookError || !hookResult) {
    return (
      <div className="p-4 text-center text-gray-500">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p className="mb-2">Editor context not available</p>
        <p className="text-xs text-gray-400">
          This panel requires QuizV4Provider context
        </p>
        {onClose && (
          <Button onClick={onClose} variant="outline" className="mt-4" size="sm">
            Close
          </Button>
        )}
      </div>
    );
  }

  const {
    getBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlockUp,
    moveBlockDown,
    getBlockIndex,
    blocks,
  } = hookResult;

  // Estado local para edição
  const [localBlock, setLocalBlock] = useState<QuizBlock | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Obter bloco atual
  const block = blockId ? getBlock(blockId) : null;
  const blockIndex = blockId ? getBlockIndex(blockId) : -1;

  // Sincronizar estado local com bloco atual
  useEffect(() => {
    if (block) {
      setLocalBlock({ ...block });
      setHasChanges(false);
      setValidationErrors([]);
      appLogger.debug('📝 PropertiesPanel: Block carregado', { data: [block.id, block.type] });
    }
  }, [block?.id]);

  // Debounced update com validação Zod
  useEffect(() => {
    if (!hasChanges || !blockId || !localBlock) return;

    const timer = setTimeout(() => {
      // Validar com Zod antes de salvar
      const validationResult = QuizBlockSchemaZ.safeParse(localBlock);

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err =>
          `${err.path.join('.')}: ${err.message}`,
        );
        setValidationErrors(errors);
        appLogger.error('❌ Validação Zod falhou:', { data: [errors] });
        return;
      }

      // Limpar erros e atualizar
      setValidationErrors([]);

      // Atualizar apenas os campos modificados
      const updates: Partial<QuizBlock> = {
        properties: localBlock.properties,
        content: localBlock.content,
      };

      updateBlock(blockId, updates);
      setHasChanges(false);

      appLogger.info('✅ Block atualizado com sucesso:', { data: [blockId] });
    }, 300);

    return () => clearTimeout(timer);
  }, [localBlock, hasChanges, blockId, updateBlock]);

  // Handlers para properties
  const handlePropertyChange = useCallback((key: string, value: any) => {
    if (!localBlock) return;

    setLocalBlock(prev => {
      if (!prev) return null;
      return {
        ...prev,
        properties: {
          ...prev.properties,
          [key]: value,
        },
      };
    });
    setHasChanges(true);
  }, [localBlock]);

  // Handlers para content
  const handleContentChange = useCallback((key: string, value: any) => {
    if (!localBlock) return;

    setLocalBlock(prev => {
      if (!prev) return null;
      return {
        ...prev,
        content: {
          ...prev.content,
          [key]: value,
        },
      };
    });
    setHasChanges(true);
  }, [localBlock]);

  // Handlers para metadata
  const handleMetadataChange = useCallback((key: string, value: any) => {
    if (!localBlock) return;

    setLocalBlock(prev => {
      if (!prev) return null;
      return {
        ...prev,
        metadata: {
          editable: true,
          reorderable: true,
          reusable: true,
          deletable: true,
          ...prev.metadata,
          [key]: value,
        },
      };
    });
    setHasChanges(true);
  }, [localBlock]);

  if (!block || !localBlock) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-4">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Nenhum bloco selecionado</p>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose} className="mt-4">
              <X className="w-4 h-4 mr-2" />
              Fechar
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-80 bg-white border-l flex flex-col h-full">
      {/* Header com ações */}
      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {localBlock.type}
          </Badge>
          {hasChanges && (
            <Badge variant="outline" className="text-xs text-orange-600">
              Não salvo
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          {blockIndex > 0 && (
            <Button size="icon" variant="ghost" onClick={() => moveBlockUp(block.id)} title="Mover para cima">
              <ArrowUp className="w-4 h-4" />
            </Button>
          )}
          {blockIndex < blocks.length - 1 && (
            <Button size="icon" variant="ghost" onClick={() => moveBlockDown(block.id)} title="Mover para baixo">
              <ArrowDown className="w-4 h-4" />
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={() => duplicateBlock(block.id)} title="Duplicar">
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => deleteBlock(block.id)}
            disabled={localBlock.metadata?.deletable === false}
            title={localBlock.metadata?.deletable === false ? 'Não pode ser deletado' : 'Deletar'}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Validação status */}
      {validationErrors.length > 0 && (
        <div className="p-3 bg-red-50 border-b border-red-200">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-red-900 mb-1">Erros de Validação:</p>
              <ul className="text-xs text-red-700 space-y-1">
                {validationErrors.map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {!validationErrors.length && hasChanges && (
        <div className="p-2 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-2 text-xs text-blue-700">
            <CheckCircle2 className="w-3 h-3" />
            <span>Salvando automaticamente...</span>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        {/* Seção: Properties */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Properties</h3>
            <Badge variant="outline" className="text-xs">
              {Object.keys(localBlock.properties).length} campos
            </Badge>
          </div>

          {Object.entries(localBlock.properties).map(([key, value]) => (
            <div key={`prop-${key}`} className="space-y-2">
              <Label htmlFor={`prop-${key}`} className="text-xs font-medium text-gray-700">
                {key}
              </Label>
              {typeof value === 'boolean' ? (
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`prop-${key}`}
                    checked={value}
                    onCheckedChange={(checked) => handlePropertyChange(key, checked)}
                  />
                  <Label htmlFor={`prop-${key}`} className="text-xs text-gray-600">
                    {value ? 'Sim' : 'Não'}
                  </Label>
                </div>
              ) : typeof value === 'number' ? (
                <Input
                  id={`prop-${key}`}
                  type="number"
                  value={value}
                  onChange={(e) => handlePropertyChange(key, parseFloat(e.target.value))}
                  className="text-sm"
                />
              ) : (
                <Textarea
                  id={`prop-${key}`}
                  value={String(value)}
                  onChange={(e) => handlePropertyChange(key, e.target.value)}
                  className="text-sm min-h-[60px]"
                  rows={2}
                />
              )}
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Seção: Content */}
        {localBlock.content && Object.keys(localBlock.content).length > 0 && (
          <>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Content</h3>
                <Badge variant="outline" className="text-xs">
                  {Object.keys(localBlock.content).length} campos
                </Badge>
              </div>

              {Object.entries(localBlock.content).map(([key, value]) => (
                <div key={`content-${key}`} className="space-y-2">
                  <Label htmlFor={`content-${key}`} className="text-xs font-medium text-gray-700">
                    {key}
                  </Label>
                  <Textarea
                    id={`content-${key}`}
                    value={String(value)}
                    onChange={(e) => handleContentChange(key, e.target.value)}
                    className="text-sm min-h-[80px]"
                    rows={3}
                  />
                </div>
              ))}
            </div>
            <Separator className="my-6" />
          </>
        )}

        {/* Seção: Metadata */}
        {localBlock.metadata && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Metadata</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="meta-editable"
                  checked={localBlock.metadata.editable ?? true}
                  onCheckedChange={(checked) => handleMetadataChange('editable', checked)}
                />
                <Label htmlFor="meta-editable" className="text-xs">Editável</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="meta-reorderable"
                  checked={localBlock.metadata.reorderable ?? true}
                  onCheckedChange={(checked) => handleMetadataChange('reorderable', checked)}
                />
                <Label htmlFor="meta-reorderable" className="text-xs">Reordenável</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="meta-reusable"
                  checked={localBlock.metadata.reusable ?? true}
                  onCheckedChange={(checked) => handleMetadataChange('reusable', checked)}
                />
                <Label htmlFor="meta-reusable" className="text-xs">Reutilizável</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="meta-deletable"
                  checked={localBlock.metadata.deletable ?? true}
                  onCheckedChange={(checked) => handleMetadataChange('deletable', checked)}
                />
                <Label htmlFor="meta-deletable" className="text-xs">Deletável</Label>
              </div>
            </div>

            {localBlock.metadata.component && (
              <div className="space-y-2 mt-4">
                <Label className="text-xs font-medium text-gray-700">Componente</Label>
                <Input
                  value={localBlock.metadata.component}
                  onChange={(e) => handleMetadataChange('component', e.target.value)}
                  className="text-sm"
                  placeholder="Nome do componente"
                />
              </div>
            )}
          </div>
        )}

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <details className="text-xs">
              <summary className="font-medium cursor-pointer text-gray-700 mb-2">
                🔍 Debug Info (Dev Only)
              </summary>
              <pre className="mt-2 p-2 bg-white rounded border text-[10px] overflow-auto max-h-60">
                {JSON.stringify(localBlock, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </ScrollArea>

      {/* Footer com info adicional */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-600">
        <div className="flex justify-between items-center">
          <span>Bloco: <code className="text-xs bg-gray-200 px-1 rounded">{localBlock.id}</code></span>
          <span>Ordem: {localBlock.order}</span>
        </div>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
