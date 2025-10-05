/**
 * 🎨 EDITOR MODULAR MODERNO - FASE 4
 * 
 * Interface visual moderna e independente usando componentes customizados
 */

import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// UI Components modernos
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
    AddIcon,
    DeleteIcon,
    CopyIcon,
    EditIcon,
    ViewIcon,
    DragHandleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SettingsIcon,
    HeaderIcon,
    TextIcon,
    ImageIcon,
    ButtonIcon,
    GridIcon
} from '@/components/ui/modern-icons';

// Context e tipos
import { useQuizEditor } from '@/context/QuizEditorContext';
import { ComponentType, ModularComponent } from '@/types/modular-editor';

// Editor de Propriedades Avançado - Fase 5
import AdvancedPropertiesPanel from '@/components/editor/advanced-properties/AdvancedPropertiesPanel';
import '@/components/editor/advanced-properties/advanced-properties.css';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface ModernModularEditorProps {
    className?: string;
}

interface SortableComponentProps {
    component: ModularComponent;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onEdit: (id: string) => void;
    onDuplicate: (id: string) => void;
    onDelete: (id: string) => void;
}

interface ComponentPaletteProps {
    isOpen: boolean;
    onToggle: () => void;
}

// ============================================================================
// COMPONENTE SORTABLE
// ============================================================================

const SortableComponent: React.FC<SortableComponentProps> = ({
    component,
    isSelected,
    onSelect,
    onEdit,
    onDuplicate,
    onDelete
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: component.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="sortable-component">
            <Card
                variant={isSelected ? "outlined" : "ghost"}
                padding="sm"
                className={`component-card ${isSelected ? 'component-card--selected' : ''}`}
                onClick={() => onSelect(component.id)}
                style={{
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--modern-primary)' : undefined,
                    borderWidth: isSelected ? '2px' : undefined
                }}
            >
                <Flex justify="between" align="center">
                    <HStack gap={12} align="center">
                        <Tooltip label="Arrastar para reordenar">
                            <div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
                                <DragHandleIcon size={16} color="var(--modern-gray-400)" />
                            </div>
                        </Tooltip>

                        <Flex align="center" gap={8}>
                            {getComponentIcon(component.type)}
                            <VStack gap={2} align="start">
                                <Text size="sm" weight="medium">
                                    {getComponentName(component.type)}
                                </Text>
                                <Text size="xs" color="var(--modern-gray-500)">
                                    ID: {component.id}
                                </Text>
                            </VStack>
                        </Flex>
                    </HStack>

                    <HStack gap={4}>
                        <Tooltip label="Editar">
                            <IconButton
                                icon={<EditIcon size={14} />}
                                size="xs"
                                variant="ghost"
                                aria-label="Editar componente"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(component.id);
                                }}
                            />
                        </Tooltip>

                        <Tooltip label="Duplicar">
                            <IconButton
                                icon={<CopyIcon size={14} />}
                                size="xs"
                                variant="ghost"
                                aria-label="Duplicar componente"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDuplicate(component.id);
                                }}
                            />
                        </Tooltip>

                        <Tooltip label="Excluir">
                            <IconButton
                                icon={<DeleteIcon size={14} />}
                                size="xs"
                                variant="ghost"
                                aria-label="Excluir componente"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(component.id);
                                }}
                            />
                        </Tooltip>
                    </HStack>
                </Flex>
            </Card>
        </div>
    );
};

// ============================================================================
// PALETA DE COMPONENTES
// ============================================================================

const ComponentPalette: React.FC<ComponentPaletteProps> = ({ isOpen, onToggle }) => {
    const { addComponent, funnel } = useQuizEditor();
    const currentStep = funnel.steps[0]; // Para simplificar, usar primeira etapa

    const componentTypes: Array<{
        type: ComponentType;
        name: string;
        icon: React.ReactNode;
        description: string;
    }> = [
            {
                type: 'header',
                name: 'Cabeçalho',
                icon: <HeaderIcon size={20} />,
                description: 'Cabeçalho com logo e navegação'
            },
            {
                type: 'title',
                name: 'Título',
                icon: <TextIcon size={20} />,
                description: 'Título editável'
            },
            {
                type: 'text',
                name: 'Texto',
                icon: <TextIcon size={20} />,
                description: 'Parágrafo de texto'
            },
            {
                type: 'image',
                name: 'Imagem',
                icon: <ImageIcon size={20} />,
                description: 'Upload e exibição de imagem'
            },
            {
                type: 'button',
                name: 'Botão',
                icon: <ButtonIcon size={20} />,
                description: 'Botão interativo'
            },
            {
                type: 'options-grid',
                name: 'Grade de Opções',
                icon: <GridIcon size={20} />,
                description: 'Grid de opções para quiz'
            }
        ];

    const handleAddComponent = (type: ComponentType) => {
        if (!currentStep) return;

        addComponent(currentStep.id, {
            type,
            props: {},
            style: {},
        });
    };

    return (
        <Card
            variant="elevated"
            padding="md"
            className="component-palette"
            style={{
                width: isOpen ? '280px' : '60px',
                transition: 'width 0.3s ease',
                minHeight: '400px'
            }}
        >
            <Flex justify="between" align="center" style={{ marginBottom: '16px' }}>
                {isOpen && (
                    <Heading as="h3" size="sm" weight="semibold">
                        Componentes
                    </Heading>
                )}
                <IconButton
                    icon={isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    size="sm"
                    variant="ghost"
                    aria-label={isOpen ? "Recolher painel" : "Expandir painel"}
                    onClick={onToggle}
                />
            </Flex>

            {isOpen && (
                <VStack gap={8} align="stretch">
                    {componentTypes.map((component) => (
                        <Tooltip
                            key={component.type}
                            label={component.description}
                            placement="right"
                        >
                            <Card
                                variant="ghost"
                                padding="sm"
                                className="component-palette-item"
                                onClick={() => handleAddComponent(component.type)}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <HStack gap={12} align="center">
                                    <Box style={{ color: 'var(--modern-primary)' }}>
                                        {component.icon}
                                    </Box>
                                    <VStack gap={2} align="start">
                                        <Text size="sm" weight="medium">
                                            {component.name}
                                        </Text>
                                        <Text size="xs" color="var(--modern-gray-500)">
                                            {component.description}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Card>
                        </Tooltip>
                    ))}
                </VStack>
            )}
        </Card>
    );
};

// ============================================================================
// EDITOR PRINCIPAL
// ============================================================================

const ModernModularEditor: React.FC<ModernModularEditorProps> = ({ className = '' }) => {
    const {
        funnel,
        selectedComponent,
        selectComponent,
        updateComponent,
        deleteComponent,
        duplicateComponent,
        reorderComponents
    } = useQuizEditor();

    const [paletteOpen, setPaletteOpen] = useState(true);
    const [previewMode, setPreviewMode] = useState(false);

    const currentStep = funnel.steps[0] || { id: 'default', components: [] };
    const components = currentStep.components || [];

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = components.findIndex(comp => comp.id === active.id);
            const newIndex = components.findIndex(comp => comp.id === over?.id);

            reorderComponents(currentStep.id, oldIndex, newIndex);
        }
    };

    const handleSelectComponent = (componentId: string) => {
        selectComponent(componentId);
    };

    const handleEditComponent = (componentId: string) => {
        selectComponent(componentId);
        // Aqui abriria um modal ou painel de edição
        console.log('Editar componente:', componentId);
    };

    const handleDuplicateComponent = (componentId: string) => {
        duplicateComponent(currentStep.id, componentId);
    };

    const handleDeleteComponent = (componentId: string) => {
        deleteComponent(currentStep.id, componentId);
    };

    return (
        <Container className={`modern-modular-editor ${className}`}>
            <VStack gap={0} align="stretch" style={{ minHeight: '100vh' }}>
                {/* Header do Editor */}
                <Card variant="outlined" padding="md" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, borderTop: 0 }}>
                    <Flex justify="between" align="center">
                        <HStack gap={16} align="center">
                            <Heading size="lg" weight="bold" color="var(--modern-primary)">
                                🎯 Editor Modular
                            </Heading>
                            <Text size="sm" color="var(--modern-gray-500)">
                                {components.length} componente{components.length !== 1 ? 's' : ''}
                            </Text>
                        </HStack>

                        <HStack gap={8}>
                            <Button
                                variant={previewMode ? 'primary' : 'secondary'}
                                size="sm"
                                leftIcon={<ViewIcon size={16} />}
                                onClick={() => setPreviewMode(!previewMode)}
                            >
                                {previewMode ? 'Sair do Preview' : 'Preview'}
                            </Button>

                            <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<SettingsIcon size={16} />}
                            >
                                Configurações
                            </Button>
                        </HStack>
                    </Flex>
                </Card>

                {/* Área Principal */}
                <Flex style={{ flex: 1 }}>
                    {/* Painel Lateral */}
                    <ComponentPalette
                        isOpen={paletteOpen}
                        onToggle={() => setPaletteOpen(!paletteOpen)}
                    />

                    {/* Canvas do Editor */}
                    <Box style={{ flex: 1, padding: '24px' }}>
                        <Card
                            variant="outlined"
                            padding="lg"
                            style={{
                                minHeight: '600px',
                                background: previewMode ? 'white' : 'var(--modern-gray-50)'
                            }}
                        >
                            {components.length === 0 ? (
                                <Flex
                                    justify="center"
                                    align="center"
                                    style={{
                                        minHeight: '400px',
                                        border: '2px dashed var(--modern-gray-300)',
                                        borderRadius: 'var(--modern-radius-lg)'
                                    }}
                                >
                                    <VStack gap={16} align="center">
                                        <Box style={{ fontSize: '48px' }}>🎨</Box>
                                        <VStack gap={8} align="center">
                                            <Heading size="md" color="var(--modern-gray-600)">
                                                Nenhum componente ainda
                                            </Heading>
                                            <Text size="sm" color="var(--modern-gray-500)" style={{ textAlign: 'center' }}>
                                                Adicione componentes da paleta lateral para começar a construir sua etapa
                                            </Text>
                                        </VStack>
                                    </VStack>
                                </Flex>
                            ) : (
                                <DndContext
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={components.map(comp => comp.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <VStack gap={12} align="stretch">
                                            {components.map((component) => (
                                                <SortableComponent
                                                    key={component.id}
                                                    component={component}
                                                    isSelected={selectedComponent?.id === component.id}
                                                    onSelect={handleSelectComponent}
                                                    onEdit={handleEditComponent}
                                                    onDuplicate={handleDuplicateComponent}
                                                    onDelete={handleDeleteComponent}
                                                />
                                            ))}
                                        </VStack>
                                    </SortableContext>
                                </DndContext>
                            )}
                        </Card>
                    </Box>

                    {/* Painel de Propriedades Avançado - Fase 5 */}
                    <Box style={{ width: '320px', maxWidth: '320px', borderLeft: '1px solid var(--modern-gray-200)' }}>
                        <AdvancedPropertiesPanel
                            selectedComponent={selectedComponent || undefined}
                            onPropertyChange={(componentId, propertyKey, value) => {
                                if (selectedComponent) {
                                    updateComponent(currentStep.id, componentId, {
                                        props: {
                                            ...selectedComponent.props,
                                            [propertyKey]: value
                                        }
                                    });
                                }
                            }}
                            onPreviewToggle={(enabled) => {
                                setPreviewMode(enabled);
                            }}
                        />
                    </Box>
                </Flex>
            </VStack>
        </Container>
    );
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function getComponentIcon(type: ComponentType): React.ReactNode {
    const iconProps = { size: 18, color: 'var(--modern-primary)' };

    switch (type) {
        case 'header': return <HeaderIcon {...iconProps} />;
        case 'title': return <TextIcon {...iconProps} />;
        case 'text': return <TextIcon {...iconProps} />;
        case 'image': return <ImageIcon {...iconProps} />;
        case 'button': return <ButtonIcon {...iconProps} />;
        case 'options-grid': return <GridIcon {...iconProps} />;
        default: return <Box {...iconProps} />;
    }
}

function getComponentName(type: ComponentType): string {
    const names: Record<ComponentType, string> = {
        'header': 'Cabeçalho',
        'title': 'Título',
        'text': 'Texto',
        'image': 'Imagem',
        'form-field': 'Campo de Formulário',
        'options-grid': 'Grade de Opções',
        'button': 'Botão',
        'spacer': 'Espaçador',
        'divider': 'Divisor',
        'video': 'Vídeo',
        'custom-html': 'HTML Customizado',
        'result-display': 'Exibição de Resultado',
        'progress-bar': 'Barra de Progresso',
        'countdown-timer': 'Timer',
        'social-share': 'Compartilhamento Social'
    };

    return names[type] || type;
}

export default ModernModularEditor;