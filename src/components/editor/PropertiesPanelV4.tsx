/**
 * 🎯 PROPERTIES PANEL V4
 * 
 * Painel de propriedades com validação Zod em tempo real
 * Integrado com estrutura v4 e QuizV4Provider
 * 
 * FASE 4: Integração Editor
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useStepBlocksV4 } from '@/hooks/useStepBlocksV4';
import { QuizBlockSchemaZ, type QuizBlock } from '@/schemas/quiz-schema.zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash2, Copy, ArrowUp, ArrowDown, X, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertiesPanelV4Props {
    blockId: string | null;
    stepId: string;
    onClose?: () => void;
}

export function PropertiesPanelV4({
    blockId,
    stepId,
    onClose,
}: PropertiesPanelV4Props) {
    const {
        getBlock,
        updateBlock,
        deleteBlock,
        duplicateBlock,
        moveBlockUp,
        moveBlockDown,
        getBlockIndex,
        blocks,
    } = useStepBlocksV4(stepId);

    const [localValues, setLocalValues] = useState<Record<string, any>>({});
    const [validationErrors, setValidationErrors] = useState<Array<{ path: string; message: string }>>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    // Get current block
    const block = useMemo(() => blockId ? getBlock(blockId) : null, [blockId, getBlock]);
    const blockIndex = useMemo(() => blockId ? getBlockIndex(blockId) : -1, [blockId, getBlockIndex]);

    // Initialize local values when block changes
    useEffect(() => {
        if (block) {
            setLocalValues({
                ...block.properties,
                ...block.content,
            });
            setHasChanges(false);
            setValidationErrors([]);
        }
    }, [block?.id]);

    /**
     * Validate block data with Zod
     */
    const validateBlockData = useCallback((data: Partial<QuizBlock>) => {
        setIsValidating(true);

        try {
            const blockData = {
                ...block,
                ...data,
            };

            const result = QuizBlockSchemaZ.safeParse(blockData);

            if (!result.success) {
                const errors = result.error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));
                setValidationErrors(errors);
                setIsValidating(false);
                return false;
            }

            setValidationErrors([]);
            setIsValidating(false);
            return true;
        } catch (err) {
            setValidationErrors([{ path: 'general', message: 'Erro ao validar' }]);
            setIsValidating(false);
            return false;
        }
    }, [block]);

    /**
     * Debounced update with validation
     */
    useEffect(() => {
        if (!hasChanges || !blockId || !block) return;

        const timer = setTimeout(() => {
            // Separate properties and content
            const updates: Partial<QuizBlock> = {
                properties: {},
                content: {},
            };

            Object.entries(localValues).forEach(([key, value]) => {
                // Determine if property or content based on block structure
                if (block.content && key in block.content) {
                    updates.content![key] = value;
                } else {
                    updates.properties![key] = value;
                }
            });

            // Validate before updating
            if (validateBlockData(updates)) {
                const result = updateBlock(blockId, updates);

                if (result?.success) {
                    setHasChanges(false);
                } else if (result?.errors) {
                    setValidationErrors(result.errors);
                }
            }
        }, 500); // Increased debounce for validation

        return () => clearTimeout(timer);
    }, [localValues, hasChanges, blockId, block, updateBlock, validateBlockData]);

    /**
     * Handle value change
     */
    const handleChange = useCallback((key: string, value: any) => {
        setLocalValues(prev => ({
            ...prev,
            [key]: value,
        }));
        setHasChanges(true);
    }, []);

    /**
     * Handle delete
     */
    const handleDelete = useCallback(() => {
        if (!blockId) return;

        if (window.confirm('Tem certeza que deseja deletar este bloco?')) {
            deleteBlock(blockId);
            onClose?.();
        }
    }, [blockId, deleteBlock, onClose]);

    /**
     * Handle duplicate
     */
    const handleDuplicate = useCallback(() => {
        if (!blockId) return;
        duplicateBlock(blockId);
    }, [blockId, duplicateBlock]);

    // Empty state
    if (!blockId || !block) {
        return (
            <div className="h-full flex items-center justify-center p-6 text-center">
                <div className="space-y-2">
                    <AlertCircle className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600">
                        Selecione um bloco para editar
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Propriedades</h3>
                    <Badge variant="outline" className="text-xs">
                        {block.type}
                    </Badge>
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Validation Status */}
            {validationErrors.length > 0 && (
                <Alert variant="destructive" className="m-4 mb-0">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erros de Validação</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            {validationErrors.map((err, i) => (
                                <li key={i} className="text-xs">
                                    <strong>{err.path}:</strong> {err.message}
                                </li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {validationErrors.length === 0 && hasChanges && (
                <Alert className="m-4 mb-0 bg-blue-50 border-blue-200">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs text-blue-800">
                        {isValidating ? 'Validando...' : 'Todas as validações passaram ✓'}
                    </AlertDescription>
                </Alert>
            )}

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {/* Block Info */}
                    <div className="space-y-2">
                        <Label className="text-xs text-gray-500">ID do Bloco</Label>
                        <Input
                            value={block.id}
                            disabled
                            className="text-xs font-mono"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Tipo</Label>
                            <Input
                                value={block.type}
                                disabled
                                className="text-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Ordem</Label>
                            <Input
                                value={block.order}
                                disabled
                                className="text-xs"
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Dynamic Properties */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium">Propriedades</h4>

                        {Object.entries(localValues).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <Label className="text-xs capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </Label>

                                {typeof value === 'boolean' ? (
                                    <Select
                                        value={value.toString()}
                                        onValueChange={(v) => handleChange(key, v === 'true')}
                                    >
                                        <SelectTrigger className="text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Sim</SelectItem>
                                            <SelectItem value="false">Não</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : typeof value === 'number' ? (
                                    <Input
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleChange(key, Number(e.target.value))}
                                        className="text-xs"
                                    />
                                ) : typeof value === 'string' && value.length > 50 ? (
                                    <Textarea
                                        value={value}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className="text-xs min-h-[80px]"
                                    />
                                ) : (
                                    <Input
                                        value={value?.toString() || ''}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className="text-xs"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollArea>

            {/* Actions */}
            <div className="border-t p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveBlockUp(blockId)}
                        disabled={blockIndex === 0}
                        className="text-xs"
                    >
                        <ArrowUp className="h-3 w-3 mr-1" />
                        Mover Acima
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveBlockDown(blockId)}
                        disabled={blockIndex === blocks.length - 1}
                        className="text-xs"
                    >
                        <ArrowDown className="h-3 w-3 mr-1" />
                        Mover Abaixo
                    </Button>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDuplicate}
                    className="w-full text-xs"
                >
                    <Copy className="h-3 w-3 mr-1" />
                    Duplicar Bloco
                </Button>

                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="w-full text-xs"
                >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Deletar Bloco
                </Button>
            </div>
        </div>
    );
}
