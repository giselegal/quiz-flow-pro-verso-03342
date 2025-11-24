// ⚙️ PROPERTIES COLUMN - Refatorado com Draft Pattern
// 
// O painel nocode agora edita um draft validado e só aplica ao estado global
// quando o usuário clica "Aplicar" ou quando todas as validações passam.
//
import React, { useCallback, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Settings, X, Edit3, Save, RotateCcw, ChevronDown, Info, Sparkles, Code2, AlertTriangle, Loader2, Check, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { Block } from '@/types/editor';
import { DynamicPropertyControls } from '@/components/editor/DynamicPropertyControls';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';
import { onBlockUpdate as subscribeToBlockUpdates } from '@/lib/utils/editorEventBus';
import { normalizeBlockData, createSynchronizedBlockUpdate, normalizerLogger } from '@/core/adapters/BlockDataNormalizer';
import { appLogger } from '@/lib/utils/appLogger';
import { toast } from '@/components/ui/use-toast';
import { useDraftProperties } from '../../hooks/useDraftProperties';

interface PropertiesColumnProps {
    selectedBlock?: Block | undefined;
    onBlockUpdate: (blockId: string, updates: Partial<Block>) => void;
    onClearSelection: () => void;
    blocks?: Block[] | null;
    onBlockSelect?: (blockId: string) => void;
}

const PropertiesColumn: React.FC<PropertiesColumnProps> = ({
    selectedBlock: selectedBlockProp,
    onBlockUpdate,
    onClearSelection,
    blocks,
    onBlockSelect,
}) => {
    const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['basic']));
    const [showJsonEditor, setShowJsonEditor] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const prevSelectedIdRef = React.useRef<string | null>(null);

    // ✅ WAVE 1 FIX: Auto-select primeiro bloco se nenhum selecionado
    const selectedBlock = useMemo(() => {
        if (selectedBlockProp) {
            return selectedBlockProp;
        }

        // Fallback: auto-selecionar primeiro bloco
        const firstBlock = blocks && blocks.length > 0 ? blocks[0] : null;
        if (firstBlock && onBlockSelect && !prevSelectedIdRef.current) {
            appLogger.info('[PropertiesColumn] Auto-selecionando primeiro bloco:', { data: [firstBlock.id] });
            setTimeout(() => onBlockSelect(firstBlock.id), 0);
        }

        return firstBlock;
    }, [selectedBlockProp, blocks, onBlockSelect]);

    // Atualizar ref quando bloco muda
    useEffect(() => {
        prevSelectedIdRef.current = selectedBlock?.id || null;
    }, [selectedBlock?.id]);

    // Get schema and initial properties for the draft
    const schema = useMemo(() => 
        selectedBlock ? schemaInterpreter.getBlockSchema(selectedBlock.type) : null,
        [selectedBlock?.type]
    );

    const initialProperties = useMemo(() => {
        if (!selectedBlock) return {};
        
        // Normalizar dados do bloco
        const normalizedBlock = normalizeBlockData(selectedBlock);
        const merged = { ...normalizedBlock.properties };

        // Aplicar defaults do schema
        if (schema) {
            Object.entries(schema.properties).forEach(([key, propSchema]) => {
                if (merged[key] === undefined && propSchema.default !== undefined) {
                    merged[key] = propSchema.default;
                }
            });
        }

        normalizerLogger.debug('Properties normalized for draft', {
            type: selectedBlock.type,
            originalProperties: selectedBlock.properties,
            normalizedProperties: merged
        });

        return merged;
    }, [selectedBlock, schema]);

    // 🎯 DRAFT PATTERN: Use o hook useDraftProperties para gerenciar o draft
    const handleCommit = useCallback((properties: Record<string, any>) => {
        if (!selectedBlock) return;

        const synchronizedUpdate = createSynchronizedBlockUpdate(selectedBlock, properties);
        onBlockUpdate(selectedBlock.id, synchronizedUpdate);

        toast({
            title: "✅ Propriedades aplicadas",
            description: `Bloco ${selectedBlock.type} atualizado com sucesso`,
            duration: 2000,
        });

        appLogger.info('[PropertiesColumn] Draft committed:', {
            data: [{ blockId: selectedBlock.id, properties }]
        });
    }, [selectedBlock, onBlockUpdate]);

    const {
        draft,
        errors,
        isDirty,
        isValid,
        updateField,
        updateJsonField,
        commitDraft,
        cancelDraft,
        getJsonBuffer,
    } = useDraftProperties({
        schema,
        initialProperties,
        onCommit: handleCommit,
    });

    // Subscribe to external block updates (event bus)
    useEffect(() => {
        if (!selectedBlock) return;

        const unsubscribe = subscribeToBlockUpdates((data: any) => {
            if (data.blockId === selectedBlock.id) {
                // External update - sync to draft if not dirty
                appLogger.info('[PropertiesColumn] External update received, resetting draft');
            }
        });

        return unsubscribe;
    }, [selectedBlock?.id]);

    // Handler para mudanças de propriedade (integra com DynamicPropertyControls)
    const handlePropertyChange = useCallback((key: string, value: any) => {
        const result = updateField(key, value);
        appLogger.info('[PropertiesColumn] Property changed:', {
            data: [{ key, value, isValid: result.isValid, error: result.error }]
        });
    }, [updateField]);

    // Handler para aplicar o draft
    const handleApply = useCallback(async () => {
        setIsSaving(true);
        try {
            const success = commitDraft();
            if (!success) {
                toast({
                    title: "⚠️ Erros de validação",
                    description: "Corrija os erros antes de aplicar as alterações",
                    variant: "destructive",
                    duration: 3000,
                });
            }
        } finally {
            setIsSaving(false);
        }
    }, [commitDraft]);

    // Handler para cancelar alterações
    const handleCancel = useCallback(() => {
        cancelDraft();
        toast({
            title: "↩️ Alterações revertidas",
            description: "As alterações foram descartadas",
            duration: 2000,
        });
    }, [cancelDraft]);

    const hasSchema = schema !== null;

    const toggleSection = useCallback((section: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) next.delete(section); else next.add(section);
            return next;
        });
    }, []);

    const hasErrors = Object.keys(errors).length > 0;

    if (!selectedBlock) {
        return (
            <div className="w-80 border-l bg-gradient-to-b from-muted/20 to-background">
                <div className="p-4 border-b bg-background/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-sm">Propriedades</h3>
                    </div>
                </div>
                <div className="p-8 text-center text-muted-foreground animate-fade-in">
                    <div className="bg-muted/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Settings className="w-10 h-10 opacity-30" />
                    </div>
                    <p className="text-sm font-medium mb-2">
                        Nenhum bloco disponível
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                        Adicione blocos ao canvas para<br />editar suas propriedades
                    </p>
                    {blocks && blocks.length === 0 && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Arraste componentes da biblioteca<br />para começar a criar seu quiz
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="w-80 border-l bg-gradient-to-b from-background to-muted/20">
                {/* Header */}
                <div className="p-4 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1.5 rounded">
                                <Edit3 className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-sm">Propriedades</h3>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClearSelection}
                            className="h-7 w-7"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Status indicator: draft mode */}
                    <div className="flex items-center gap-2 text-xs">
                        {isDirty && !hasErrors && (
                            <div className="flex items-center gap-1 text-amber-600 animate-fade-in">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                <span>Alterações não aplicadas</span>
                            </div>
                        )}
                        {isDirty && hasErrors && (
                            <div className="flex items-center gap-1 text-red-600 animate-fade-in">
                                <XCircle className="w-3 h-3" />
                                <span>Erros de validação</span>
                            </div>
                        )}
                        {!isDirty && (
                            <div className="flex items-center gap-1 text-green-600 animate-fade-in">
                                <Check className="w-3 h-3" />
                                <span>Sincronizado</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin p-4 space-y-4">
                    {/* Block info card */}
                    <Card className={cn(
                        "p-3 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent",
                        "animate-fade-in"
                    )}>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium text-muted-foreground uppercase">
                                    Bloco Selecionado
                                </Label>
                                <Badge variant="secondary" className="text-[10px]">
                                    {selectedBlock.type}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-primary/70" />
                                <p className="text-xs font-mono truncate">
                                    {selectedBlock.id}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Property controls */}
                    {hasSchema ? (
                        <div className="space-y-3">
                            <Collapsible
                                open={expandedSections.has('basic')}
                                onOpenChange={() => toggleSection('basic')}
                            >
                                <Card className="overflow-hidden">
                                    <CollapsibleTrigger className="w-full p-3 hover:bg-accent/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <ChevronDown className={cn(
                                                    "h-4 w-4 transition-transform",
                                                    !expandedSections.has('basic') && "-rotate-90"
                                                )} />
                                                <span className="text-xs font-semibold uppercase text-muted-foreground">
                                                    Propriedades
                                                </span>
                                            </div>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="h-3 w-3 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-xs">Edita um draft local - clique Aplicar para salvar</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="animate-accordion-down">
                                        <div className="p-4 pt-0 space-y-4">
                                            <DynamicPropertyControls
                                                elementType={selectedBlock.type}
                                                properties={draft}
                                                onChange={handlePropertyChange}
                                                errors={errors}
                                                onJsonTextChange={updateJsonField}
                                                getJsonBuffer={getJsonBuffer}
                                            />
                                        </div>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>

                            {/* Info card about draft mode */}
                            <Card className="p-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                                <div className="flex gap-2">
                                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        <strong>Modo Draft:</strong> As alterações são validadas em tempo real.
                                        Clique "Aplicar" para salvar ou "Cancelar" para reverter.
                                    </p>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <Card className="p-6 text-center">
                            <div className="bg-muted/30 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                <Settings className="w-6 h-6 opacity-30" />
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                                Schema não encontrado
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                                Este bloco não possui schema definido.
                            </p>
                        </Card>
                    )}

                    {/* Actions - Apply / Cancel */}
                    {hasSchema && (
                        <>
                            <Separator className="my-4" />

                            {/* Validation errors summary */}
                            {hasErrors && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        Corrija os erros de validação antes de aplicar.
                                        {Object.keys(errors).length > 0 && (
                                            <ul className="mt-1 text-xs list-disc list-inside">
                                                {Object.entries(errors).slice(0, 3).map(([key, err]) => (
                                                    <li key={key}><strong>{key}:</strong> {err}</li>
                                                ))}
                                                {Object.keys(errors).length > 3 && (
                                                    <li>...e mais {Object.keys(errors).length - 3} erros</li>
                                                )}
                                            </ul>
                                        )}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex gap-2 sticky bottom-0 bg-background/95 backdrop-blur-sm py-2 -mx-4 px-4">
                                <Button
                                    onClick={handleApply}
                                    disabled={!isDirty || hasErrors || isSaving}
                                    className="flex-1 gap-2"
                                    size="sm"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Aplicando...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Aplicar
                                        </>
                                    )}
                                </Button>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={!isDirty}
                                            size="sm"
                                            className="px-3"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Cancelar alterações</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>

                            {/* JSON Editor button */}
                            <div className="mt-2 pt-2 border-t">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowJsonEditor(true)}
                                    className="w-full gap-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Code2 className="w-3.5 h-3.5" />
                                    <span className="text-xs">Ver JSON (somente leitura)</span>
                                </Button>
                            </div>

                            {/* JSON Viewer Dialog */}
                            <Dialog open={showJsonEditor} onOpenChange={setShowJsonEditor}>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Code2 className="w-5 h-5" />
                                            JSON do Bloco
                                        </DialogTitle>
                                        <DialogDescription>
                                            Visualização do JSON atual do bloco. Para editar, use o painel de propriedades.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                <strong>Draft atual:</strong> O JSON abaixo mostra o estado do draft.
                                                Use o painel nocode para editar as propriedades com segurança.
                                            </AlertDescription>
                                        </Alert>

                                        <div className="font-mono text-xs">
                                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                                {JSON.stringify({ ...selectedBlock, properties: draft }, null, 2)}
                                            </pre>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setShowJsonEditor(false)}>
                                                Fechar
                                            </Button>
                                            <Button onClick={() => {
                                                navigator.clipboard.writeText(JSON.stringify({ ...selectedBlock, properties: draft }, null, 2));
                                                toast({
                                                    title: "📋 JSON copiado",
                                                    description: "O JSON foi copiado para a área de transferência",
                                                    duration: 2000,
                                                });
                                            }}>
                                                Copiar JSON
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
};

// React.memo with custom comparison for performance
export default React.memo(PropertiesColumn, (prevProps, nextProps) => {
    const sameId = prevProps.selectedBlock?.id === nextProps.selectedBlock?.id;
    const sameContent = sameId &&
        JSON.stringify(prevProps.selectedBlock?.properties) === JSON.stringify(nextProps.selectedBlock?.properties) &&
        JSON.stringify(prevProps.selectedBlock?.content) === JSON.stringify(nextProps.selectedBlock?.content);

    return (
        sameContent &&
        prevProps.blocks?.length === nextProps.blocks?.length &&
        prevProps.onBlockUpdate === nextProps.onBlockUpdate &&
        prevProps.onClearSelection === nextProps.onClearSelection &&
        prevProps.onBlockSelect === nextProps.onBlockSelect
    );
});