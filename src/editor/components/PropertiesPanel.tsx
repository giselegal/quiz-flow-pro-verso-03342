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

    // Ações
    const handleDelete = useCallback(() => {
        if (!blockId) return;
        if (confirm('Tem certeza que deseja deletar este bloco?')) {
            deleteBlock(blockId);
            onClose?.();
        }
    }, [blockId, deleteBlock, onClose]);

    const handleDuplicate = useCallback(() => {
        if (!blockId) return;
        duplicateBlock(blockId);
    }, [blockId, duplicateBlock]);

    const handleMoveUp = useCallback(() => {
        if (!blockId) return;
        moveBlockUp(blockId);
    }, [blockId, moveBlockUp]);

    const handleMoveDown = useCallback(() => {
        if (!blockId) return;
        moveBlockDown(blockId);
    }, [blockId, moveBlockDown]);

    // ========================================================================
    // RENDER FIELD - Gera campo baseado no tipo
    // ========================================================================

    const renderField = (key: string, value: any, type?: string) => {
        const currentValue = localValues[key] ?? value;

        // Detectar tipo automaticamente se não especificado
        if (!type) {
            if (typeof value === 'boolean') type = 'boolean';
            else if (typeof value === 'number') type = 'number';
            else if (key.includes('color') || key.includes('Color')) type = 'color';
            else if (key.includes('html') || key.includes('Html')) type = 'html';
            else if (typeof value === 'string' && value.length > 50) type = 'textarea';
            else type = 'text';
        }

        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

        switch (type) {
            case 'boolean':
                return (
                    <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key} className="text-sm">{label}</Label>
                        <input
                            id={key}
                            type="checkbox"
                            checked={currentValue}
                            onChange={(e) => handleChange(key, e.target.checked)}
                            className="h-4 w-4"
                        />
                    </div>
                );

            case 'number':
                return (
                    <div key={key} className="space-y-1">
                        <Label htmlFor={key} className="text-sm">{label}</Label>
                        <Input
                            id={key}
                            type="number"
                            value={currentValue}
                            onChange={(e) => handleChange(key, Number(e.target.value))}
                            className="h-8"
                        />
                    </div>
                );

            case 'color':
                return (
                    <div key={key} className="space-y-1">
                        <Label htmlFor={key} className="text-sm">{label}</Label>
                        <div className="flex gap-2">
                            <Input
                                id={key}
                                type="color"
                                value={currentValue}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className="h-8 w-16"
                            />
                            <Input
                                type="text"
                                value={currentValue}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className="h-8 flex-1 font-mono text-xs"
                                placeholder="#000000"
                            />
                        </div>
                    </div>
                );

            case 'textarea':
            case 'html':
                return (
                    <div key={key} className="space-y-1">
                        <Label htmlFor={key} className="text-sm">{label}</Label>
                        <Textarea
                            id={key}
                            value={currentValue}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="min-h-[100px] text-xs font-mono"
                            placeholder={type === 'html' ? '<p>HTML aqui...</p>' : 'Texto...'}
                        />
                    </div>
                );

            case 'select':
                // TODO: Adicionar opções customizadas
                return null;

            default: // text
                return (
                    <div key={key} className="space-y-1">
                        <Label htmlFor={key} className="text-sm">{label}</Label>
                        <Input
                            id={key}
                            type="text"
                            value={currentValue}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="h-8"
                        />
                    </div>
                );
        }
    };

    // ========================================================================
    // EMPTY STATE
    // ========================================================================

    if (!blockId || !block) {
        return (
            <div className="w-80 border-l bg-gray-50 flex items-center justify-center">
                <div className="text-center p-6 text-gray-400">
                    <div className="text-3xl mb-2">🎯</div>
                    <p className="text-sm font-medium">Nenhum bloco selecionado</p>
                    <p className="text-xs mt-1">Clique em um bloco no canvas</p>
                </div>
            </div>
        );
    }

    if (!definition) {
        return (
            <div className="w-80 border-l bg-gray-50 flex items-center justify-center">
                <div className="text-center p-6 text-red-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Definição não encontrada</p>
                    <p className="text-xs mt-1">Tipo: {block.type}</p>
                </div>
            </div>
        );
    }

    // ========================================================================
    // RENDER PANEL
    // ========================================================================

    return (
        <div className="w-80 border-l bg-white flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            {definition.icon} {definition.label}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {definition.description}
                        </p>
                    </div>
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-6 w-6 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                        {block.type}
                    </Badge>
                    {hasChanges && (
                        <Badge variant="default" className="text-xs">
                            <Save className="w-3 h-3 mr-1" />
                            Salvando...
                        </Badge>
                    )}
                </div>
            </div>

            {/* Content - Scrollable */}
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {/* Content Properties */}
                    {definition.defaultProps.content && Object.keys(definition.defaultProps.content).length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-xs font-medium text-gray-500 uppercase">Conteúdo</span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            {Object.entries(definition.defaultProps.content).map(([key, value]) =>
                                renderField(key, value)
                            )}
                        </div>
                    )}

                    {/* Style Properties */}
                    {definition.defaultProps.properties && Object.keys(definition.defaultProps.properties).length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-xs font-medium text-gray-500 uppercase">Estilo</span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            {Object.entries(definition.defaultProps.properties).map(([key, value]) =>
                                renderField(key, value)
                            )}
                        </div>
                    )}

                    {/* Debug Info (dev only) */}
                    {import.meta.env.DEV && (
                        <div className="pt-4 border-t">
                            <details className="text-xs">
                                <summary className="cursor-pointer text-gray-500 font-medium mb-2">
                                    🔍 Debug Info
                                </summary>
                                <pre className="bg-gray-100 p-2 rounded text-[10px] overflow-auto">
                                    {JSON.stringify({ id: block.id, type: block.type, order: block.order }, null, 2)}
                                </pre>
                            </details>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Actions - Footer */}
            <div className="p-4 border-t bg-gray-50 space-y-2">
                {/* Move Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMoveUp}
                        disabled={blockIndex === 0}
                        className="flex-1 h-8"
                    >
                        <ArrowUp className="w-3 h-3 mr-1" />
                        Subir
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMoveDown}
                        disabled={blockIndex === blocks.length - 1}
                        className="flex-1 h-8"
                    >
                        <ArrowDown className="w-3 h-3 mr-1" />
                        Descer
                    </Button>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDuplicate}
                        className="flex-1 h-8"
                    >
                        <Copy className="w-3 h-3 mr-1" />
                        Duplicar
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        className="flex-1 h-8"
                    >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Deletar
                    </Button>
                </div>

                {/* Info */}
                <p className="text-[10px] text-gray-400 text-center mt-2">
                    Posição: {blockIndex + 1} de {blocks.length}
                </p>
            </div>
        </div>
    );
};

export default PropertiesPanel;
