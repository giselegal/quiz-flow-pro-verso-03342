// ⚙️ PROPERTIES COLUMN - FASE 8 UI Avançado
import React, { useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Settings, X, Edit3, Save, RotateCcw, ChevronDown, Info, Sparkles, Code2, AlertTriangle, Loader2 } from 'lucide-react';
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

interface PropertiesColumnProps {
    selectedBlock?: Block | undefined; // ✅ WAVE 1: Agora opcional para suportar fallback
    onBlockUpdate: (blockId: string, updates: Partial<Block>) => void;
    onClearSelection: () => void;
    blocks?: Block[] | null; // ✅ WAVE 1: Lista de blocos para auto-select
    onBlockSelect?: (blockId: string) => void; // ✅ WAVE 1: Callback para auto-select
}

interface BlockProperty {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'boolean' | 'select';
    value: any;
    options?: string[];
}

const PropertiesColumn: React.FC<PropertiesColumnProps> = ({
    selectedBlock: selectedBlockProp,
    onBlockUpdate,
    onClearSelection,
    blocks,
    onBlockSelect,
}) => {
    const [editedProperties, setEditedProperties] = React.useState<Record<string, any>>({});
    const [isDirty, setIsDirty] = React.useState(false);
    const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['basic']));
    const [showJsonEditor, setShowJsonEditor] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false); // 🎯 FASE 1: Estado de salvamento
    const prevSelectedIdRef = React.useRef<string | null>(null);

    // 🔍 DEBUG CRÍTICO: Log TUDO que o painel recebe
    React.useEffect(() => {
        console.group('🔍 [PropertiesColumn] Estado Completo');
        console.log('selectedBlockProp:', selectedBlockProp);
        console.log('blocks:', blocks);
        console.log('Análise:', {
            hasSelectedBlockProp: !!selectedBlockProp,
            selectedBlockId: selectedBlockProp?.id,
            selectedBlockType: selectedBlockProp?.type,
            blocksCount: blocks?.length || 0,
            blockIds: blocks?.map(b => b.id) || [],
            hasOnBlockSelect: !!onBlockSelect,
            willAutoSelect: !selectedBlockProp && blocks && blocks.length > 0,
            firstBlockId: blocks?.[0]?.id
        });
        console.groupEnd();
    }, [selectedBlockProp, blocks, onBlockSelect]);

    // ✅ WAVE 1 FIX: Auto-select primeiro bloco se nenhum selecionado
    const selectedBlock = useMemo(() => {
        if (selectedBlockProp) {
            console.log('✅ [PropertiesColumn] Usando selectedBlockProp:', selectedBlockProp.id);
            return selectedBlockProp;
        }

        // Fallback: auto-selecionar primeiro bloco
        const firstBlock = blocks && blocks.length > 0 ? blocks[0] : null;
        if (firstBlock && onBlockSelect && !prevSelectedIdRef.current) {
            console.log('⚠️ [PropertiesColumn] Auto-selecionando primeiro bloco:', firstBlock.id);
            appLogger.info(`[WAVE1] Auto-selecionando primeiro bloco: ${firstBlock.id}`);
            setTimeout(() => onBlockSelect(firstBlock.id), 0);
        } else if (!firstBlock) {
            console.log('❌ [PropertiesColumn] Nenhum bloco disponível');
        }

        return firstBlock;
    }, [selectedBlockProp, blocks, onBlockSelect]);

    // Auto-save suave ao trocar de seleção se houver alterações pendentes no bloco anterior
    React.useEffect(() => {
        const prevId = prevSelectedIdRef.current;
        const nextId = selectedBlock?.id || null;

        if (prevId && prevId !== nextId && isDirty) {
            // Encontrar o bloco anterior para fazer auto-save sincronizado
            const prevBlock = selectedBlock; // Assumindo que selectedBlock ainda é o anterior aqui
            if (prevBlock) {
                const synchronizedUpdate = createSynchronizedBlockUpdate(prevBlock, editedProperties);
                onBlockUpdate(prevId, synchronizedUpdate);
            }
        }

        if (selectedBlock) {
            // ✅ NORMALIZAÇÃO DE DADOS - Garante sincronização properties ↔ content
            const normalizedBlock = normalizeBlockData(selectedBlock);

            // Aplicar valores default do schema se necessário
            const schema = schemaInterpreter.getBlockSchema(selectedBlock.type);
            const merged = { ...normalizedBlock.properties };

            if (schema) {
                Object.entries(schema.properties).forEach(([key, propSchema]) => {
                    if (merged[key] === undefined && propSchema.default !== undefined) {
                        merged[key] = propSchema.default;
                    }
                });
            }

            normalizerLogger.debug('Properties normalized for editing', {
                type: selectedBlock.type,
                originalProperties: selectedBlock.properties,
                originalContent: selectedBlock.content,
                normalizedProperties: merged
            });

            setEditedProperties(merged);
            setIsDirty(false);

            // ✅ CORREÇÃO 2: Debug logging detalhado
            appLogger.info('🔍 [PropertiesColumn] selectedBlock changed:', {
                data: [{
                    id: selectedBlock?.id,
                    type: selectedBlock?.type,
                    hasProperties: !!selectedBlock?.properties && Object.keys(selectedBlock.properties).length,
                    hasContent: !!selectedBlock?.content && Object.keys(selectedBlock.content).length,
                    editedProperties: Object.keys(merged),
                    hasSchema: schema !== null
                }]
            });
        } else {
            setEditedProperties({});
            setIsDirty(false);
        }

        prevSelectedIdRef.current = nextId;
    }, [selectedBlock]);

    // Sprint 1 Dia 2: Event bus para forçar re-render
    React.useEffect(() => {
        if (!selectedBlock) return;

        const unsubscribe = subscribeToBlockUpdates((data: any) => {
            if (data.blockId === selectedBlock.id) {
                setEditedProperties(prev => ({ ...prev, ...(data.patch.properties || {}) }));
                setIsDirty(false);
            }
        });

        return unsubscribe;
    }, [selectedBlock?.id]);

    const handlePropertyChange = useCallback((key: string, value: unknown) => {
        console.group('🎛️ [PropertiesColumn] handlePropertyChange');
        console.log('key:', key);
        console.log('value (raw):', value);
        console.log('value type:', typeof value);
        console.log('editedProperties[key]:', editedProperties[key]);
        console.log('expected type:', typeof editedProperties[key]);

        // Type validation based on key or expected type
        let validatedValue: string | number | boolean = value as string;
        if (typeof editedProperties[key] === 'number') {
            validatedValue = typeof value === 'number' ? value : Number(value);
        } else if (typeof editedProperties[key] === 'boolean') {
            validatedValue = typeof value === 'boolean' ? value : value === 'true' || value === true;
        } else if (typeof editedProperties[key] === 'string') {
            validatedValue = typeof value === 'string' ? value : String(value);
        }

        console.log('validatedValue:', validatedValue);
        console.log('isDirty antes:', isDirty);

        setEditedProperties(prev => {
            const next = {
                ...prev,
                [key]: validatedValue
            };
            console.log('editedProperties ANTES:', prev);
            console.log('editedProperties DEPOIS:', next);
            return next;
        });
        setIsDirty(true);

        console.log('✅ Propriedade atualizada, isDirty = true');
        console.groupEnd();
    }, [editedProperties, isDirty]);

    const handleSave = useCallback(async () => {
        console.group('💾 [PropertiesColumn] handleSave');
        console.log('selectedBlock:', selectedBlock);
        console.log('isDirty:', isDirty);
        console.log('editedProperties:', editedProperties);

        if (selectedBlock && isDirty) {
            // 🎯 FASE 1: Feedback visual - INÍCIO
            setIsSaving(true);

            try {
                // ✅ SINCRONIZAÇÃO BIDIRECIONAL - Garante properties ↔ content sempre alinhados
                const synchronizedUpdate = createSynchronizedBlockUpdate(selectedBlock, editedProperties);

                console.log('synchronizedUpdate criado:', synchronizedUpdate);
                console.log('Chamando onBlockUpdate com:', {
                    blockId: selectedBlock.id,
                    updates: synchronizedUpdate
                });

                onBlockUpdate(selectedBlock.id, synchronizedUpdate);

                // Simular delay mínimo para feedback visual (50ms)
                await new Promise(resolve => setTimeout(resolve, 50));

                setIsDirty(false);
                setHasError(false);

                // 🎯 FASE 1: Toast de sucesso
                toast({
                    title: "✅ Propriedades salvas",
                    description: `Bloco ${selectedBlock.type} atualizado com sucesso`,
                    duration: 2000,
                });

                normalizerLogger.debug('Block saved with synchronized data', {
                    blockId: selectedBlock.id,
                    editedProperties,
                    synchronizedUpdate
                });

                console.log('✅ onBlockUpdate chamado, isDirty = false');
                appLogger.info('🎯 [FASE1] Propriedades salvas com sucesso:', {
                    data: [{ blockId: selectedBlock.id, type: selectedBlock.type }]
                });
            } catch (error) {
                console.error('❌ Erro ao salvar propriedades:', error);
                setHasError(true);

                // 🎯 FASE 1: Toast de erro
                toast({
                    title: "❌ Erro ao salvar",
                    description: error instanceof Error ? error.message : "Erro desconhecido ao salvar propriedades",
                    variant: "destructive",
                    duration: 4000,
                });

                appLogger.error('❌ [FASE1] Erro ao salvar propriedades:', error instanceof Error ? error : new Error(String(error)));
            } finally {
                // 🎯 FASE 1: Feedback visual - FIM
                setIsSaving(false);
            }
        } else {
            console.warn('❌ Não salvou:', {
                hasBlock: !!selectedBlock,
                isDirty,
                reason: !selectedBlock ? 'Sem bloco selecionado' : 'Não há mudanças (isDirty=false)'
            });
        }
        console.groupEnd();
    }, [selectedBlock, isDirty, editedProperties, onBlockUpdate]);

    const handleReset = useCallback(() => {
        if (selectedBlock) {
            setEditedProperties(selectedBlock.properties || {});
            setIsDirty(false);
        }
    }, [selectedBlock]);

    // Verificar se o bloco tem schema disponível
    const hasSchema = useMemo(() => selectedBlock ? schemaInterpreter.getBlockSchema(selectedBlock.type) !== null : false, [selectedBlock]);

    const toggleSection = useCallback((section: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) next.delete(section); else next.add(section);
            return next;
        });
    }, []);

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
                    {/* ✅ WAVE 1: Dica visual aprimorada */}
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
                {/* Header melhorado */}
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

                    {/* Indicador de mudanças */}
                    {isDirty && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 animate-fade-in">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                            <span>Alterações não salvas</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin p-4 space-y-4">
                    {/* Card de Informações do Bloco */}
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

                    {/* Propriedades Editáveis com Seções Colapsáveis */}
                    {hasSchema ? (
                        <div className="space-y-3">
                            {/* Seção: Propriedades Básicas */}
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
                                                    <p className="text-xs">Propriedades do bloco via schema</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="animate-accordion-down">
                                        <div className="p-4 pt-0 space-y-4">
                                            <DynamicPropertyControls
                                                elementType={selectedBlock.type}
                                                properties={editedProperties}
                                                onChange={(key, value) => handlePropertyChange(key, value)}
                                            />
                                        </div>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>

                            {/* Dica de uso */}
                            <Card className="p-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                                <div className="flex gap-2">
                                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        As propriedades são carregadas dinamicamente do schema JSON.
                                        Alterações aparecem em tempo real no canvas.
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

                    {/* Ações (sempre visíveis quando há schema) */}
                    {hasSchema && (
                        <>
                            <Separator className="my-4" />

                            {/* ⚠️ Error Alert */}
                            {hasError && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        Erro ao salvar propriedades. Verifique os valores e tente novamente.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex gap-2 sticky bottom-0 bg-background/95 backdrop-blur-sm py-2 -mx-4 px-4">
                                <Button
                                    onClick={handleSave}
                                    disabled={!isDirty || isSaving}
                                    className={cn(
                                        "flex-1 gap-2",
                                        isDirty && !isSaving && "animate-pulse"
                                    )}
                                    size="sm"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            {isDirty ? 'Salvar Alterações' : 'Salvo'}
                                        </>
                                    )}
                                </Button>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            onClick={handleReset}
                                            disabled={!isDirty}
                                            size="sm"
                                            className="px-3"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Desfazer alterações</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>

                            {/* 🎨 EDITOR JSON AVANÇADO - Power Users */}
                            <div className="mt-2 pt-2 border-t">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowJsonEditor(true)}
                                    className="w-full gap-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Code2 className="w-3.5 h-3.5" />
                                    <span className="text-xs">Editar JSON (Avançado)</span>
                                </Button>
                            </div>

                            {/* Modal JSON Editor */}
                            <Dialog open={showJsonEditor} onOpenChange={setShowJsonEditor}>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Code2 className="w-5 h-5" />
                                            Editor JSON Avançado
                                        </DialogTitle>
                                        <DialogDescription>
                                            Edite o JSON completo do bloco. Use com cuidado - erros de sintaxe podem quebrar o bloco.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                <strong>Para a maioria dos casos, use o editor visual acima.</strong><br />
                                                Este editor JSON é para operações avançadas como importar/exportar blocos completos.
                                            </AlertDescription>
                                        </Alert>

                                        <div className="font-mono text-xs">
                                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                                {JSON.stringify(selectedBlock, null, 2)}
                                            </pre>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setShowJsonEditor(false)}>
                                                Fechar
                                            </Button>
                                            <Button onClick={() => {
                                                // TODO: Implementar editor JSON funcional
                                                navigator.clipboard.writeText(JSON.stringify(selectedBlock, null, 2));
                                                setShowJsonEditor(false);
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

// ✅ WAVE 2.9: React.memo para evitar re-renders desnecessários
// Componente só re-renderiza quando selectedBlock ou callbacks mudarem
export default React.memo(PropertiesColumn, (prevProps, nextProps) => {
    // Custom comparison: só re-renderizar se dados relevantes mudarem
    return (
        prevProps.selectedBlock?.id === nextProps.selectedBlock?.id &&
        prevProps.blocks?.length === nextProps.blocks?.length &&
        prevProps.onBlockUpdate === nextProps.onBlockUpdate &&
        prevProps.onClearSelection === nextProps.onClearSelection &&
        prevProps.onBlockSelect === nextProps.onBlockSelect
    );
});