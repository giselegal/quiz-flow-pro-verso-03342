// ⚙️ PROPERTIES COLUMN - FASE 8 UI Avançado
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Settings, X, Edit3, Save, RotateCcw, ChevronDown, Info, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Block } from '@/types/editor';
import { DynamicPropertyControls } from '@/components/editor/DynamicPropertyControls';
import { schemaInterpreter } from '@/core/schema/SchemaInterpreter';

interface PropertiesColumnProps {
    selectedBlock: Block | null;
    onBlockUpdate: (blockId: string, updates: Partial<Block>) => void;
    onClearSelection: () => void;
}

interface BlockProperty {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'boolean' | 'select';
    value: any;
    options?: string[];
}

const PropertiesColumn: React.FC<PropertiesColumnProps> = ({
    selectedBlock,
    onBlockUpdate,
    onClearSelection,
}) => {
    const [editedProperties, setEditedProperties] = React.useState<Record<string, any>>({});
    const [isDirty, setIsDirty] = React.useState(false);
    const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['basic']));
    const prevSelectedIdRef = React.useRef<string | null>(null);

    // Auto-save suave ao trocar de seleção se houver alterações pendentes no bloco anterior
    React.useEffect(() => {
        const prevId = prevSelectedIdRef.current;
        const nextId = selectedBlock?.id || null;

        if (prevId && prevId !== nextId && isDirty) {
            onBlockUpdate(prevId, { properties: editedProperties });
        }

        if (selectedBlock) {
            // ✅ CORREÇÃO 3: MERGE AGRESSIVO - properties tem prioridade, fallback para content
            const merged: Record<string, any> = {};
            
            // 1. Carregar tudo de content
            if (selectedBlock.content && typeof selectedBlock.content === 'object') {
                Object.assign(merged, selectedBlock.content);
            }
            
            // 2. Sobrescrever com properties (se houver)
            if (selectedBlock.properties && typeof selectedBlock.properties === 'object') {
                Object.assign(merged, selectedBlock.properties);
            }
            
            // 3. Garantir pelo menos valores default do schema
            const schema = schemaInterpreter.getBlockSchema(selectedBlock.type);
            if (schema) {
                Object.entries(schema.properties).forEach(([key, propSchema]) => {
                    if (merged[key] === undefined && propSchema.default !== undefined) {
                        merged[key] = propSchema.default;
                    }
                });
            }
            
            console.log('✅ [PropertiesColumn] Merged properties:', {
                type: selectedBlock.type,
                mergedKeys: Object.keys(merged),
                mergedValues: merged
            });
            
            setEditedProperties(merged);
            setIsDirty(false);
            
            // ✅ CORREÇÃO 2: Debug logging detalhado
            console.log('🔍 [PropertiesColumn] selectedBlock changed:', {
                id: selectedBlock?.id,
                type: selectedBlock?.type,
                hasProperties: !!selectedBlock?.properties && Object.keys(selectedBlock.properties).length,
                hasContent: !!selectedBlock?.content && Object.keys(selectedBlock.content).length,
                editedProperties: Object.keys(merged),
                hasSchema: schema !== null
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
        
        const { onBlockUpdate } = require('@/utils/editorEventBus');
        const unsubscribe = onBlockUpdate((data: any) => {
            if (data.blockId === selectedBlock.id) {
                setEditedProperties(prev => ({ ...prev, ...(data.patch.properties || {}) }));
                setIsDirty(false);
            }
        });
        
        return unsubscribe;
    }, [selectedBlock?.id]);

    const handlePropertyChange = (key: string, value: unknown) => {
        // Type validation based on key or expected type
        let validatedValue: string | number | boolean = value as string;
        if (typeof editedProperties[key] === 'number') {
            validatedValue = typeof value === 'number' ? value : Number(value);
        } else if (typeof editedProperties[key] === 'boolean') {
            validatedValue = typeof value === 'boolean' ? value : value === 'true' || value === true;
        } else if (typeof editedProperties[key] === 'string') {
            validatedValue = typeof value === 'string' ? value : String(value);
        }
        setEditedProperties(prev => ({
            ...prev,
            [key]: validatedValue
        }));
        setIsDirty(true);
    };

    const handleSave = () => {
        if (selectedBlock && isDirty) {
            // ✅ CORREÇÃO 4: Salvar em AMBOS: properties E content
            onBlockUpdate(selectedBlock.id, {
                properties: editedProperties,
                content: editedProperties, // ← Duplicar para manter sincronizado
            });
            setIsDirty(false);
            
            console.log('💾 [PropertiesColumn] Saved:', {
                blockId: selectedBlock.id,
                properties: editedProperties
            });
        }
    };

    const handleReset = () => {
        if (selectedBlock) {
            setEditedProperties(selectedBlock.properties || {});
            setIsDirty(false);
        }
    };

    // Verificar se o bloco tem schema disponível
    const hasSchema = selectedBlock ? schemaInterpreter.getBlockSchema(selectedBlock.type) !== null : false;

    const toggleSection = (section: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) {
                next.delete(section);
            } else {
                next.add(section);
            }
            return next;
        });
    };

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
                        Nenhum bloco selecionado
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                        Clique em um bloco no canvas para<br />editar suas propriedades
                    </p>
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

                <ScrollArea className="flex-1 h-[calc(100vh-12rem)]">
                    <div className="p-4 space-y-4">
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
                                <div className="flex gap-2 sticky bottom-0 bg-background/95 backdrop-blur-sm py-2 -mx-4 px-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={!isDirty}
                                        className={cn(
                                            "flex-1 gap-2",
                                            isDirty && "animate-pulse"
                                        )}
                                        size="sm"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isDirty ? 'Salvar Alterações' : 'Salvo'}
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
                            </>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </TooltipProvider>
    );
};

export default PropertiesColumn;