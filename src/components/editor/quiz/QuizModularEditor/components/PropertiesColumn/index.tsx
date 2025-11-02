import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Settings, X, Edit3, Save, RotateCcw } from 'lucide-react';
import type { Block } from '@/services/UnifiedTemplateRegistry';

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

    // Extrair propriedades editáveis do bloco selecionado
    const getEditableProperties = (): BlockProperty[] => {
        if (!selectedBlock) return [];

        const properties: BlockProperty[] = [];
        const props = selectedBlock.properties || {};

        // Propriedades comuns a todos os blocos
        if (props.content !== undefined) {
            properties.push({
                key: 'content',
                label: 'Conteúdo',
                type: 'textarea',
                value: editedProperties.content || ''
            });
        }

        if (props.title !== undefined) {
            properties.push({
                key: 'title',
                label: 'Título',
                type: 'text',
                value: editedProperties.title || ''
            });
        }

        if (props.subtitle !== undefined) {
            properties.push({
                key: 'subtitle',
                label: 'Subtítulo',
                type: 'text',
                value: editedProperties.subtitle || ''
            });
        }

        if (props.placeholder !== undefined) {
            properties.push({
                key: 'placeholder',
                label: 'Placeholder',
                type: 'text',
                value: editedProperties.placeholder || ''
            });
        }

        if (props.buttonText !== undefined) {
            properties.push({
                key: 'buttonText',
                label: 'Texto do Botão',
                type: 'text',
                value: editedProperties.buttonText || ''
            });
        }

        // Propriedades específicas por tipo
        switch (selectedBlock.type) {
            case 'intro-image':
                if (props.imageUrl !== undefined) {
                    properties.push({
                        key: 'imageUrl',
                        label: 'URL da Imagem',
                        type: 'text',
                        value: editedProperties.imageUrl || ''
                    });
                }
                if (props.altText !== undefined) {
                    properties.push({
                        key: 'altText',
                        label: 'Texto Alternativo',
                        type: 'text',
                        value: editedProperties.altText || ''
                    });
                }
                break;

            case 'question-options-grid':
                if (props.required !== undefined) {
                    properties.push({
                        key: 'required',
                        label: 'Obrigatório',
                        type: 'boolean',
                        value: editedProperties.required || false
                    });
                }
                break;

            case 'result-cta':
                if (props.variant !== undefined) {
                    properties.push({
                        key: 'variant',
                        label: 'Variante',
                        type: 'select',
                        value: editedProperties.variant || 'primary',
                        options: ['primary', 'secondary', 'outline', 'destructive']
                    });
                }
                break;
        }

        return properties;
    };

    const renderPropertyField = (property: BlockProperty) => {
        switch (property.type) {
            case 'text':
                return (
                    <Input
                        value={String(property.value || '')}
                        onChange={(e) => handlePropertyChange(property.key, e.target.value)}
                        placeholder={`Digite ${property.label.toLowerCase()}`}
                    />
                ); case 'textarea':
                return (
                    <Textarea
                        value={String(property.value || '')}
                        onChange={(e) => handlePropertyChange(property.key, e.target.value)}
                        placeholder={`Digite ${property.label.toLowerCase()}`}
                        rows={4}
                    />
                ); case 'number':
                return (
                    <Input
                        type="number"
                        value={String(property.value || 0)}
                        onChange={(e) => handlePropertyChange(property.key, Number(e.target.value))}
                    />
                ); case 'boolean':
                return (
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={Boolean(property.value)}
                            onChange={(e) => handlePropertyChange(property.key, e.target.checked)}
                            className="rounded"
                        />
                        <Label>{Boolean(property.value) ? 'Sim' : 'Não'}</Label>
                    </div>
                ); case 'select':
                return (
                    <select
                        value={String(property.value || '')}
                        onChange={(e) => handlePropertyChange(property.key, e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        {property.options?.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                ); default:
                return null;
        }
    };

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

    const properties = getEditableProperties();

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

                    {/* Propriedades Editáveis */}
                    {properties.length > 0 ? (
                        <Card className="p-4">
                            <div className="space-y-4">
                                <Label className="text-xs font-medium text-muted-foreground">
                                    PROPRIEDADES
                                </Label>

                                {properties.map((property) => (
                                    <div key={property.key} className="space-y-2">
                                        <Label className="text-sm font-medium">
                                            {property.label}
                                        </Label>
                                        {renderPropertyField(property)}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-4">
                            <p className="text-sm text-muted-foreground text-center">
                                Este bloco não possui propriedades editáveis
                            </p>
                        </Card>
                    )}

                    {/* Ações */}
                    {properties.length > 0 && (
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