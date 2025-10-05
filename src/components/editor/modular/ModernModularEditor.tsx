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

// Editor de Propriedades Avançado - Fase 5 (Safe Wrapper)
import AdvancedPropertiesPanel from '@/components/editor/advanced-properties/SafeAdvancedPropertiesPanel';
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
    currentStep: any;
}

interface StepsPanelProps {
    steps: any[];
    currentStepIndex: number;
    onStepSelect: (index: number) => void;
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

    const getComponentIcon = (type: ComponentType) => {
        switch (type) {
            case 'header': return <HeaderIcon size={16} />;
            case 'title': return <TextIcon size={16} />;
            case 'text': return <TextIcon size={16} />;
            case 'image': return <ImageIcon size={16} />;
            case 'button': return <ButtonIcon size={16} />;
            case 'options-grid': return <GridIcon size={16} />;
            default: return <Box style={{ width: 16, height: 16 }} />;
        }
    };

    const getComponentName = (type: ComponentType) => {
        switch (type) {
            case 'header': return 'Cabeçalho';
            case 'title': return 'Título';
            case 'text': return 'Texto';
            case 'image': return 'Imagem';
            case 'button': return 'Botão';
            case 'options-grid': return 'Grade de Opções';
            default: return type;
        }
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card
                variant={isSelected ? "elevated" : "outlined"}
                padding="sm"
                className="sortable-component"
                onClick={() => onSelect(component.id)}
            >
                <Flex justify="between" align="center">
                    <HStack gap={8} align="center">
                        <Box {...attributes} {...listeners} style={{ cursor: 'grab' }}>
                            <DragHandleIcon size={14} />
                        </Box>
                        {getComponentIcon(component.type)}
                        <VStack gap={2} align="start">
                            <Text size="sm" weight="medium">
                                {getComponentName(component.type)}
                            </Text>
                            <Text size="xs" color="var(--modern-gray-500)">
                                ID: {component.id}
                            </Text>
                        </VStack>
                    </HStack>

                    <HStack gap={4}>
                        <Tooltip label="Editar">
                            <IconButton
                                icon={<EditIcon size={14} />}
                                size="sm"
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
                                size="sm"
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
                                size="sm"
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

const ComponentPalette: React.FC<ComponentPaletteProps> = ({ isOpen, onToggle, currentStep }) => {
    const { addComponent } = useQuizEditor();

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
        <Box>
            <Heading size="sm" weight="semibold" style={{ marginBottom: '16px' }}>
                🧩 Componentes
            </Heading>
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
        </Box>
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
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const currentStep = funnel.steps[currentStepIndex] || funnel.steps[0] || { id: 'default', components: [] };
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

    // Navegação entre etapas
    const handlePreviousStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    const handleNextStep = () => {
        if (currentStepIndex < funnel.steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
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
                            <VStack gap={4} align="start">
                                <Text size="sm" color="var(--modern-gray-500)">
                                    {components.length} componentes
                                </Text>
                                <HStack gap={8} align="center">
                                    <Text size="xs" color="var(--modern-gray-600)">
                                        Etapa {currentStepIndex + 1} de {funnel.steps.length}: {currentStep?.name}
                                    </Text>
                                    <HStack gap={4}>
                                        <IconButton
                                            icon={<ChevronLeftIcon size={14} />}
                                            size="sm"
                                            variant="ghost"
                                            disabled={currentStepIndex === 0}
                                            onClick={handlePreviousStep}
                                            aria-label="Etapa Anterior"
                                        />
                                        <IconButton
                                            icon={<ChevronRightIcon size={14} />}
                                            size="sm"
                                            variant="ghost"
                                            disabled={currentStepIndex === funnel.steps.length - 1}
                                            onClick={handleNextStep}
                                            aria-label="Próxima Etapa"
                                        />
                                    </HStack>
                                </HStack>
                            </VStack>
                        </HStack>

                        <HStack gap={12}>
                            <Button
                                variant="secondary"
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

                {/* Layout de 4 Colunas */}
                <HStack gap={0} align="stretch" style={{ flex: 1, minHeight: '600px' }}>

                    {/* COLUNA 1: ETAPAS */}
                    <Card
                        variant="outlined"
                        padding="md"
                        style={{
                            width: '250px',
                            minWidth: '250px',
                            borderRadius: 0,
                            borderRight: '1px solid var(--modern-gray-200)'
                        }}
                    >
                        <Heading size="sm" weight="semibold" style={{ marginBottom: '16px' }}>
                            📋 Etapas ({funnel.steps.length})
                        </Heading>
                        <VStack gap={8} align="stretch" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {funnel.steps.map((step: any, index: number) => (
                                <Card
                                    key={step.id}
                                    variant={index === currentStepIndex ? "elevated" : "ghost"}
                                    padding="sm"
                                    onClick={() => setCurrentStepIndex(index)}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        backgroundColor: index === currentStepIndex ? 'var(--modern-primary-50)' : 'transparent'
                                    }}
                                >
                                    <VStack gap={4} align="start">
                                        <Text size="sm" weight="medium">
                                            {index + 1}. {step.name}
                                        </Text>
                                        <Text size="xs" color="var(--modern-gray-500)">
                                            {step.components?.length || 0} componentes
                                        </Text>
                                    </VStack>
                                </Card>
                            ))}
                        </VStack>
                    </Card>

                    {/* COLUNA 2: COMPONENTES */}
                    <Card
                        variant="outlined"
                        padding="md"
                        style={{
                            width: '280px',
                            minWidth: '280px',
                            borderRadius: 0,
                            borderRight: '1px solid var(--modern-gray-200)'
                        }}
                    >
                        <ComponentPalette
                            isOpen={true}
                            onToggle={() => setPaletteOpen(!paletteOpen)}
                            currentStep={currentStep}
                        />
                    </Card>

                    {/* COLUNA 3: CANVAS */}
                    <Box style={{ flex: 1, padding: '24px', backgroundColor: previewMode ? 'white' : 'var(--modern-gray-50)' }}>
                        {components.length === 0 ? (
                            <Flex justify="center" align="center" style={{ minHeight: '400px' }}>
                                <VStack gap={16} align="center">
                                    <Text color="var(--modern-gray-400)" size="lg" weight="medium">
                                        Nenhum componente adicionado
                                    </Text>
                                    <Text color="var(--modern-gray-500)" size="sm" style={{ textAlign: 'center' }}>
                                        Selecione componentes da coluna 2 para adicionar à etapa
                                    </Text>
                                </VStack>
                            </Flex>
                        ) : (
                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={components.map(c => c.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <VStack gap={16} align="stretch">
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
                    </Box>

                    {/* COLUNA 4: PAINEL DE PROPRIEDADES */}
                    <Card
                        variant="outlined"
                        padding="md"
                        style={{
                            width: '320px',
                            minWidth: '320px',
                            borderRadius: 0,
                            borderLeft: '1px solid var(--modern-gray-200)'
                        }}
                    >
                        <Heading size="sm" weight="semibold" style={{ marginBottom: '16px' }}>
                            ⚙️ Propriedades
                        </Heading>
                        <AdvancedPropertiesPanel
                            selectedComponent={selectedComponent || undefined}
                            onPropertyChange={(componentId: string, propertyKey: string, value: any) => {
                                if (selectedComponent) {
                                    updateComponent(currentStep.id, componentId, {
                                        props: {
                                            ...selectedComponent.props,
                                            [propertyKey]: value
                                        }
                                    });
                                }
                            }}
                            onPreviewToggle={(enabled: boolean) => {
                                setPreviewMode(enabled);
                            }}
                        />
                    </Card>
                </HStack>
            </VStack>
        </Container>
    );
};

export default ModernModularEditor;