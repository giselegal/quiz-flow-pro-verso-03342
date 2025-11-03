import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, X, Edit3, Save, RotateCcw } from 'lucide-react';
import type { Block } from '@/services/UnifiedTemplateRegistry';
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
    const prevSelectedIdRef = React.useRef<string | null>(null);

    // Auto-save suave ao trocar de seleção se houver alterações pendentes no bloco anterior
    React.useEffect(() => {
        const prevId = prevSelectedIdRef.current;
        const nextId = selectedBlock?.id || null;

        if (prevId && prevId !== nextId && isDirty) {
            onBlockUpdate(prevId, { properties: editedProperties });
        }

        if (selectedBlock) {
            setEditedProperties(selectedBlock.properties || {});
            setIsDirty(false);
        } else {
            setEditedProperties({});
            setIsDirty(false);
        }

        prevSelectedIdRef.current = nextId;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBlock]);

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
            onBlockUpdate(selectedBlock.id, {
                properties: editedProperties
            });
            setIsDirty(false);
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

    if (!selectedBlock) {
        return (
            <div className="w-80 border-l bg-muted/30">
                <div className="p-4 border-b">
                    <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Propriedades
                    </h3>
                </div>
                <div className="p-8 text-center text-muted-foreground">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-sm">
                        Selecione um bloco no canvas para editar suas propriedades
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 border-l bg-background">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        <h3 className="font-medium text-sm">Propriedades</h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearSelection}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {/* Informações do Bloco */}
                    <Card className="p-3">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium text-muted-foreground">
                                    BLOCO SELECIONADO
                                </Label>
                                <Badge variant="outline" className="text-xs">
                                    {selectedBlock.type}
                                </Badge>
                            </div>
                            <p className="text-sm font-medium">
                                {selectedBlock.id}
                            </p>
                        </div>
                    </Card>

                    {/* Propriedades Editáveis - Dinâmicas via Schema */}
                    {hasSchema ? (
                        <Card className="p-4">
                            <div className="space-y-4">
                                <Label className="text-xs font-medium text-muted-foreground">
                                    PROPRIEDADES (SCHEMA-DRIVEN)
                                </Label>
                                <DynamicPropertyControls
                                    elementType={selectedBlock.type}
                                    properties={editedProperties}
                                    onChange={(key, value) => handlePropertyChange(key, value)}
                                />
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-4">
                            <p className="text-sm text-muted-foreground text-center">
                                Este bloco não possui schema definido. Use o painel legado ou defina um schema JSON.
                            </p>
                        </Card>
                    )}

                    {/* Ações */}
                    {hasSchema && (
                        <>
                            <Separator />
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSave}
                                    disabled={!isDirty}
                                    className="flex-1"
                                    size="sm"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Salvar
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleReset}
                                    disabled={!isDirty}
                                    size="sm"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default PropertiesColumn;