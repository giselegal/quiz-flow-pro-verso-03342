/**
 * 🚀 ADVANCED PROPERTIES PANEL - FASE 5
 * 
 * Editor de Propriedades Avançado com sistema dinâmico, visual e responsivo
 * Integra com a interface moderna da Fase 4
 */

import React, { useState, useCallback, useMemo } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

// UI Components modernos da Fase 4
import {
    Box,
    VStack,
    HStack,
    Button,
    Card,
    Text,
    Heading,
    IconButton,
    Tooltip,
    Container,
    Flex
} from '@/components/ui/modern-ui';

// Ícones modernos
import {
    SettingsIcon,
    PaletteIcon,
    DeviceIcon,
    EyeIcon,
    SaveIcon,
    RefreshIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    GridIcon,
    TextIcon,
    ImageIcon,
    ButtonIcon
} from '@/components/ui/modern-icons';

// Types
import { ComponentType, ModularComponent } from '@/types/modular-editor';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PropertyConfig {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'color' | 'range' | 'image' | 'font' | 'spacing';
    category: 'content' | 'style' | 'layout' | 'behavior' | 'responsive';
    description?: string;
    options?: Array<{ value: string; label: string }>;
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: any;
    validation?: {
        required?: boolean;
        pattern?: string;
        custom?: (value: any) => boolean | string;
    };
    responsive?: boolean;
    preview?: boolean;
}

export interface ComponentPropertySchema {
    type: ComponentType;
    name: string;
    icon: React.ComponentType;
    properties: PropertyConfig[];
}

export interface AdvancedPropertiesPanelProps {
    selectedComponent?: ModularComponent;
    onPropertyChange: (componentId: string, propertyKey: string, value: any) => void;
    onPreviewToggle?: (enabled: boolean) => void;
    className?: string;
}

// ============================================================================
// PROPERTY SCHEMAS - DEFINIÇÕES DINÂMICAS
// ============================================================================

const COMPONENT_PROPERTY_SCHEMAS: ComponentPropertySchema[] = [
    {
        type: 'title',
        name: 'Título',
        icon: TextIcon,
        properties: [
            {
                key: 'text',
                label: 'Texto do Título',
                type: 'text',
                category: 'content',
                description: 'Conteúdo principal do título',
                validation: { required: true },
                preview: true
            },
            {
                key: 'level',
                label: 'Nível do Título',
                type: 'select',
                category: 'content',
                options: [
                    { value: 'h1', label: 'Título Principal (H1)' },
                    { value: 'h2', label: 'Subtítulo (H2)' },
                    { value: 'h3', label: 'Seção (H3)' },
                    { value: 'h4', label: 'Subseção (H4)' }
                ],
                defaultValue: 'h2',
                preview: true
            },
            {
                key: 'fontSize',
                label: 'Tamanho da Fonte',
                type: 'range',
                category: 'style',
                min: 12,
                max: 72,
                step: 2,
                defaultValue: 32,
                responsive: true,
                preview: true
            },
            {
                key: 'fontWeight',
                label: 'Peso da Fonte',
                type: 'select',
                category: 'style',
                options: [
                    { value: 'normal', label: 'Normal' },
                    { value: 'bold', label: 'Negrito' },
                    { value: 'lighter', label: 'Mais Leve' },
                    { value: 'bolder', label: 'Mais Pesado' }
                ],
                defaultValue: 'bold',
                preview: true
            },
            {
                key: 'color',
                label: 'Cor do Texto',
                type: 'color',
                category: 'style',
                defaultValue: '#2D3748',
                preview: true
            },
            {
                key: 'textAlign',
                label: 'Alinhamento',
                type: 'select',
                category: 'style',
                options: [
                    { value: 'left', label: 'Esquerda' },
                    { value: 'center', label: 'Centro' },
                    { value: 'right', label: 'Direita' }
                ],
                defaultValue: 'center',
                responsive: true,
                preview: true
            },
            {
                key: 'marginBottom',
                label: 'Espaçamento Inferior',
                type: 'spacing',
                category: 'layout',
                min: 0,
                max: 80,
                step: 4,
                defaultValue: 16,
                responsive: true,
                preview: true
            }
        ]
    },
    {
        type: 'text',
        name: 'Texto',
        icon: TextIcon,
        properties: [
            {
                key: 'content',
                label: 'Conteúdo',
                type: 'textarea',
                category: 'content',
                description: 'Texto principal do componente',
                validation: { required: true },
                preview: true
            },
            {
                key: 'fontSize',
                label: 'Tamanho da Fonte',
                type: 'range',
                category: 'style',
                min: 10,
                max: 48,
                step: 1,
                defaultValue: 16,
                responsive: true,
                preview: true
            },
            {
                key: 'lineHeight',
                label: 'Altura da Linha',
                type: 'range',
                category: 'style',
                min: 1,
                max: 3,
                step: 0.1,
                defaultValue: 1.5,
                preview: true
            },
            {
                key: 'color',
                label: 'Cor do Texto',
                type: 'color',
                category: 'style',
                defaultValue: '#4A5568',
                preview: true
            },
            {
                key: 'backgroundColor',
                label: 'Cor de Fundo',
                type: 'color',
                category: 'style',
                defaultValue: 'transparent',
                preview: true
            },
            {
                key: 'padding',
                label: 'Espaçamento Interno',
                type: 'spacing',
                category: 'layout',
                min: 0,
                max: 48,
                step: 4,
                defaultValue: 8,
                responsive: true,
                preview: true
            }
        ]
    },
    {
        type: 'button',
        name: 'Botão',
        icon: ButtonIcon,
        properties: [
            {
                key: 'text',
                label: 'Texto do Botão',
                type: 'text',
                category: 'content',
                validation: { required: true },
                preview: true
            },
            {
                key: 'variant',
                label: 'Estilo',
                type: 'select',
                category: 'style',
                options: [
                    { value: 'solid', label: 'Sólido' },
                    { value: 'outline', label: 'Contorno' },
                    { value: 'ghost', label: 'Fantasma' },
                    { value: 'link', label: 'Link' }
                ],
                defaultValue: 'solid',
                preview: true
            },
            {
                key: 'size',
                label: 'Tamanho',
                type: 'select',
                category: 'style',
                options: [
                    { value: 'sm', label: 'Pequeno' },
                    { value: 'md', label: 'Médio' },
                    { value: 'lg', label: 'Grande' },
                    { value: 'xl', label: 'Extra Grande' }
                ],
                defaultValue: 'md',
                responsive: true,
                preview: true
            },
            {
                key: 'backgroundColor',
                label: 'Cor de Fundo',
                type: 'color',
                category: 'style',
                defaultValue: '#3182CE',
                preview: true
            },
            {
                key: 'textColor',
                label: 'Cor do Texto',
                type: 'color',
                category: 'style',
                defaultValue: '#FFFFFF',
                preview: true
            },
            {
                key: 'borderRadius',
                label: 'Borda Arredondada',
                type: 'range',
                category: 'style',
                min: 0,
                max: 24,
                step: 2,
                defaultValue: 6,
                preview: true
            },
            {
                key: 'width',
                label: 'Largura',
                type: 'select',
                category: 'layout',
                options: [
                    { value: 'auto', label: 'Automática' },
                    { value: 'full', label: 'Largura Total' },
                    { value: 'fit', label: 'Ajustar ao Conteúdo' }
                ],
                defaultValue: 'auto',
                responsive: true,
                preview: true
            }
        ]
    },
    {
        type: 'image',
        name: 'Imagem',
        icon: ImageIcon,
        properties: [
            {
                key: 'src',
                label: 'URL da Imagem',
                type: 'image',
                category: 'content',
                validation: { required: true },
                preview: true
            },
            {
                key: 'alt',
                label: 'Texto Alternativo',
                type: 'text',
                category: 'content',
                description: 'Descrição da imagem para acessibilidade'
            },
            {
                key: 'width',
                label: 'Largura',
                type: 'range',
                category: 'layout',
                min: 50,
                max: 800,
                step: 10,
                defaultValue: 300,
                responsive: true,
                preview: true
            },
            {
                key: 'height',
                label: 'Altura',
                type: 'range',
                category: 'layout',
                min: 50,
                max: 600,
                step: 10,
                defaultValue: 200,
                responsive: true,
                preview: true
            },
            {
                key: 'objectFit',
                label: 'Ajuste da Imagem',
                type: 'select',
                category: 'style',
                options: [
                    { value: 'cover', label: 'Cobrir' },
                    { value: 'contain', label: 'Conter' },
                    { value: 'fill', label: 'Preencher' },
                    { value: 'scale-down', label: 'Reduzir' }
                ],
                defaultValue: 'cover',
                preview: true
            },
            {
                key: 'borderRadius',
                label: 'Bordas Arredondadas',
                type: 'range',
                category: 'style',
                min: 0,
                max: 50,
                step: 2,
                defaultValue: 8,
                preview: true
            }
        ]
    }
];

// ============================================================================
// PROPERTY EDITORS - COMPONENTES DE EDIÇÃO
// ============================================================================

interface PropertyEditorProps {
    property: PropertyConfig;
    value: any;
    onChange: (value: any) => void;
    responsive?: boolean;
    breakpoint?: 'mobile' | 'tablet' | 'desktop';
}

const TextPropertyEditor: React.FC<PropertyEditorProps> = ({ property, value, onChange }) => (
    <VStack spacing={2} align="stretch">
        <Text fontSize="sm" fontWeight="medium">{property.label}</Text>
        {property.description && (
            <Text fontSize="xs" color="gray.600">{property.description}</Text>
        )}
        <input
            type="text"
            value={value || property.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            className="advanced-input"
            placeholder={`Digite ${property.label.toLowerCase()}`}
        />
    </VStack>
);

const TextareaPropertyEditor: React.FC<PropertyEditorProps> = ({ property, value, onChange }) => (
    <VStack spacing={2} align="stretch">
        <Text fontSize="sm" fontWeight="medium">{property.label}</Text>
        <textarea
            value={value || property.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            className="advanced-textarea"
            rows={4}
            placeholder={`Digite ${property.label.toLowerCase()}`}
        />
    </VStack>
);

const SelectPropertyEditor: React.FC<PropertyEditorProps> = ({ property, value, onChange }) => (
    <VStack spacing={2} align="stretch">
        <Text fontSize="sm" fontWeight="medium">{property.label}</Text>
        <select
            value={value || property.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            className="advanced-select"
        >
            {property.options?.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </VStack>
);

const RangePropertyEditor: React.FC<PropertyEditorProps> = ({ property, value, onChange }) => {
    const currentValue = value !== undefined ? value : property.defaultValue;
    return (
        <VStack spacing={2} align="stretch">
            <HStack justify="space-between">
                <Text fontSize="sm" fontWeight="medium">{property.label}</Text>
                <Text fontSize="xs" color="gray.600">{currentValue}{property.type === 'spacing' ? 'px' : ''}</Text>
            </HStack>
            <input
                type="range"
                min={property.min}
                max={property.max}
                step={property.step}
                value={currentValue}
                onChange={(e) => onChange(Number(e.target.value))}
                className="advanced-range"
            />
            <HStack justify="space-between" fontSize="xs" color="gray.500">
                <Text>{property.min}</Text>
                <Text>{property.max}</Text>
            </HStack>
        </VStack>
    );
};

const ColorPropertyEditor: React.FC<PropertyEditorProps> = ({ property, value, onChange }) => (
    <VStack spacing={2} align="stretch">
        <Text fontSize="sm" fontWeight="medium">{property.label}</Text>
        <HStack spacing={3}>
            <input
                type="color"
                value={value || property.defaultValue || '#000000'}
                onChange={(e) => onChange(e.target.value)}
                className="advanced-color-picker"
            />
            <input
                type="text"
                value={value || property.defaultValue || '#000000'}
                onChange={(e) => onChange(e.target.value)}
                className="advanced-color-input"
                placeholder="#000000"
            />
        </HStack>
    </VStack>
);

const BooleanPropertyEditor: React.FC<PropertyEditorProps> = ({ property, value, onChange }) => (
    <HStack justify="space-between" align="center">
        <VStack spacing={1} align="start">
            <Text fontSize="sm" fontWeight="medium">{property.label}</Text>
            {property.description && (
                <Text fontSize="xs" color="gray.600">{property.description}</Text>
            )}
        </VStack>
        <input
            type="checkbox"
            checked={value !== undefined ? value : property.defaultValue || false}
            onChange={(e) => onChange(e.target.checked)}
            className="advanced-checkbox"
        />
    </HStack>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AdvancedPropertiesPanel: React.FC<AdvancedPropertiesPanelProps> = ({
    selectedComponent,
    onPropertyChange,
    onPreviewToggle,
    className = ''
}) => {
    const [activeCategory, setActiveCategory] = useState<string>('content');
    const [previewEnabled, setPreviewEnabled] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['content']));
    const [responsiveMode, setResponsiveMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

    // Encontrar o schema do componente selecionado
    const componentSchema = useMemo(() => {
        if (!selectedComponent) return null;
        return COMPONENT_PROPERTY_SCHEMAS.find(schema => schema.type === selectedComponent.type);
    }, [selectedComponent]);

    // Agrupar propriedades por categoria
    const propertiesByCategory = useMemo(() => {
        if (!componentSchema) return {};

        const grouped: Record<string, PropertyConfig[]> = {};
        componentSchema.properties.forEach(prop => {
            if (!grouped[prop.category]) {
                grouped[prop.category] = [];
            }
            grouped[prop.category].push(prop);
        });

        return grouped;
    }, [componentSchema]);

    const categories = Object.keys(propertiesByCategory);

    // Lidar com mudanças de propriedade
    const handlePropertyChange = useCallback((propertyKey: string, value: any) => {
        if (!selectedComponent) return;
        onPropertyChange(selectedComponent.id, propertyKey, value);
    }, [selectedComponent, onPropertyChange]);

    // Alternar seção expandida
    const toggleSection = useCallback((category: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedSections(newExpanded);
    }, [expandedSections]);

    // Renderizar editor de propriedade
    const renderPropertyEditor = useCallback((property: PropertyConfig) => {
        const currentValue = selectedComponent?.properties?.[property.key];

        const props = {
            property,
            value: currentValue,
            onChange: (value: any) => handlePropertyChange(property.key, value),
            responsive: property.responsive,
            breakpoint: responsiveMode
        };

        switch (property.type) {
            case 'text':
                return <TextPropertyEditor {...props} />;
            case 'textarea':
                return <TextareaPropertyEditor {...props} />;
            case 'select':
                return <SelectPropertyEditor {...props} />;
            case 'range':
            case 'spacing':
                return <RangePropertyEditor {...props} />;
            case 'color':
                return <ColorPropertyEditor {...props} />;
            case 'boolean':
                return <BooleanPropertyEditor {...props} />;
            default:
                return <TextPropertyEditor {...props} />;
        }
    }, [selectedComponent, handlePropertyChange, responsiveMode]);

    // Toggle preview
    const handlePreviewToggle = useCallback(() => {
        const newPreviewState = !previewEnabled;
        setPreviewEnabled(newPreviewState);
        onPreviewToggle?.(newPreviewState);
    }, [previewEnabled, onPreviewToggle]);

    if (!selectedComponent || !componentSchema) {
        return (
            <Card className={`advanced-properties-panel ${className}`}>
                <div className="no-selection">
                    <SettingsIcon size={48} />
                    <Heading size="md">Editor de Propriedades</Heading>
                    <Text color="gray.600" textAlign="center">
                        Selecione um componente para editar suas propriedades avançadas
                    </Text>
                </div>
            </Card>
        );
    }

    return (
        <Card className={`advanced-properties-panel ${className}`}>
            {/* Header */}
            <div className="properties-header">
                <HStack justify="space-between" align="center">
                    <HStack spacing={3}>
                        <componentSchema.icon size={20} />
                        <VStack spacing={0} align="start">
                            <Heading size="sm">{componentSchema.name}</Heading>
                            <Text fontSize="xs" color="gray.600">ID: {selectedComponent.id}</Text>
                        </VStack>
                    </HStack>

                    <HStack spacing={2}>
                        <Tooltip label={previewEnabled ? 'Desabilitar Preview' : 'Habilitar Preview'}>
                            <IconButton
                                size="sm"
                                variant={previewEnabled ? 'solid' : 'outline'}
                                onClick={handlePreviewToggle}
                            >
                                <EyeIcon size={16} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip label="Salvar Configurações">
                            <IconButton size="sm" variant="outline">
                                <SaveIcon size={16} />
                            </IconButton>
                        </Tooltip>
                    </HStack>
                </HStack>
            </div>

            {/* Responsive Mode Selector */}
            <div className="responsive-selector">
                <Text fontSize="sm" fontWeight="medium" mb={2}>Visualização:</Text>
                <HStack spacing={1}>
                    {(['desktop', 'tablet', 'mobile'] as const).map(mode => (
                        <Button
                            key={mode}
                            size="xs"
                            variant={responsiveMode === mode ? 'solid' : 'outline'}
                            onClick={() => setResponsiveMode(mode)}
                        >
                            <DeviceIcon size={14} />
                            {mode === 'desktop' ? 'Desktop' : mode === 'tablet' ? 'Tablet' : 'Mobile'}
                        </Button>
                    ))}
                </HStack>
            </div>

            {/* Category Tabs */}
            <div className="category-tabs">
                <HStack spacing={1} wrap="wrap">
                    {categories.map(category => (
                        <Button
                            key={category}
                            size="sm"
                            variant={activeCategory === category ? 'solid' : 'ghost'}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category === 'content' ? '📝 Conteúdo' :
                                category === 'style' ? '🎨 Estilo' :
                                    category === 'layout' ? '📐 Layout' :
                                        category === 'behavior' ? '⚡ Comportamento' :
                                            '📱 Responsivo'}
                        </Button>
                    ))}
                </HStack>
            </div>

            {/* Properties */}
            <div className="properties-content">
                <VStack spacing={4} align="stretch">
                    {categories.map(category => (
                        expandedSections.has(category) && (activeCategory === 'all' || activeCategory === category) && (
                            <div key={category} className="property-section">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleSection(category)}
                                    leftIcon={expandedSections.has(category) ? <ChevronDownIcon /> : <ChevronRightIcon />}
                                    justifyContent="flex-start"
                                    w="full"
                                >
                                    {category === 'content' ? '📝 Conteúdo' :
                                        category === 'style' ? '🎨 Estilo' :
                                            category === 'layout' ? '📐 Layout' :
                                                category === 'behavior' ? '⚡ Comportamento' :
                                                    '📱 Responsivo'}
                                </Button>

                                {expandedSections.has(category) && (
                                    <VStack spacing={4} align="stretch" pl={4}>
                                        {propertiesByCategory[category]?.map(property => (
                                            <div key={property.key} className="property-item">
                                                {renderPropertyEditor(property)}
                                            </div>
                                        ))}
                                    </VStack>
                                )}
                            </div>
                        )
                    ))}
                </VStack>
            </div>
        </Card>
    );
};

export default AdvancedPropertiesPanel;