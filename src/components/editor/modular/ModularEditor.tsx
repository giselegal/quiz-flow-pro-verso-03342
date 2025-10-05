/**
 * 🎨 EDITOR MODULAR PRINCIPAL
 * 
 * Componente principal que integra todo o sistema modular
 */

import React, { useState, use                    <div title="Duplicar">
    <IconButton
        aria-label="Duplicar componente"
        size="xs"
        variant="solid"
        colorScheme="blue"
        onClick={() => onDuplicate?.(component.id)}
    >
        <CopyIcon />
    </IconButton>
</div>r < div title = "Excluir" >
    <IconButton
        aria-label="Excluir componente"
        size="xs"
        variant="solid"
        colorScheme="red"
        onClick={() => onDelete?.(component.id)}
    >
        <DeleteIcon />
    </IconButton>
                    </div >;
import {
    Box,
    VStack,
    HStack,
    Button,
    Text,
    useDisclosure,
    Container,
    Flex,
    IconButton,
    Tooltip,
    Portal,
} from '@chakra-ui/react';
import {
    AddIcon,
    ViewIcon,
    EditIcon,
    DeleteIcon,
    CopyIcon,
    DragHandleIcon,
} from '@chakra-ui/icons';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useQuizEditor } from '@/context/QuizEditorContext';
import { ComponentType, ModularComponent, ModularQuizStep } from '@/types/modular-editor';
import { createDefaultComponent } from './ComponentRegistry';
import { ComponentListRenderer } from './ComponentRenderer';
import ComponentSidebar from './ComponentSidebar';

interface ModularEditorProps {
    stepId: string;
    onSave?: (step: ModularQuizStep) => void;
    onPreview?: (step: ModularQuizStep) => void;
    onBack?: () => void;
}

// Componente Sortable para cada item
interface SortableItemProps {
    component: ModularComponent;
    index: number;
    isSelected: boolean;
    isPreviewMode: boolean;
    onSelect: (id: string) => void;
    onUpdate: (id: string, props: any) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    stepData: any;
}

const SortableItem: React.FC<SortableItemProps> = ({
    component,
    isSelected,
    isPreviewMode,
    onSelect,
    onUpdate,
    onDelete,
    onDuplicate,
    stepData,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: component.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Box
            ref={setNodeRef}
            style={style}
            position="relative"
            mb={4}
        >
            {/* Controles de Drag & Drop */}
            {!isPreviewMode && (
                <HStack
                    position="absolute"
                    top={-8}
                    right={0}
                    gap={1}
                    zIndex={10}
                    opacity={isSelected ? 1 : 0}
                    transition="opacity 0.2s"
                    _hover={{ opacity: 1 }}
                >
                    <div title="Arrastar">
                        <IconButton
                            {...attributes}
                            {...listeners}
                            aria-label="Arrastar componente"
                            size="xs"
                            variant="solid"
                            colorScheme="gray"
                            cursor="grab"
                            _active={{ cursor: 'grabbing' }}
                        />
                    </Tooltip>

                    <Tooltip label="Duplicar">
                        <IconButton
                            aria-label="Duplicar componente"
                            icon={<CopyIcon />}
                            size="xs"
                            variant="solid"
                            colorScheme="blue"
                            onClick={() => onDuplicate(component.id)}
                        />
                    </Tooltip>

                    <Tooltip label="Excluir">
                        <IconButton
                            aria-label="Excluir componente"
                            icon={<DeleteIcon />}
                            size="xs"
                            variant="solid"
                            colorScheme="red"
                            onClick={() => onDelete(component.id)}
                        />
                    </Tooltip>
                </HStack>
            )}

            {/* Renderização do Componente */}
            <ComponentListRenderer
                components={[component]}
                selectedComponentId={isSelected ? component.id : undefined}
                isEditable={!isPreviewMode}
                onComponentSelect={onSelect}
                onComponentUpdate={onUpdate}
                onComponentDelete={onDelete}
                renderContext={isPreviewMode ? 'preview' : 'editor'}
                stepData={stepData}
            />
        </Box>
    );
};

export const ModularEditor: React.FC<ModularEditorProps> = ({
    stepId,
    onSave,
    onPreview,
    onBack,
}) => {
    const {
        funnel,
        addComponent,
        updateComponent,
        deleteComponent,
        reorderComponents,
    } = useQuizEditor();    // Estado local
    const [selectedComponentId, setSelectedComponentId] = useState<string>('');
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const { open: isSidebarOpen, onToggle: toggleSidebar } = useDisclosure({ defaultOpen: true });

    // Sensors para drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Obter etapa atual
    const currentStep = funnel.steps.find((step: any) => step.id === stepId);

    useEffect(() => {
        if (!currentStep) {
            console.error(`Etapa com ID ${stepId} não foi encontrada.`);
        }
    }, [currentStep, stepId]); if (!currentStep) {
        return (
            <Box p={8} textAlign="center">
                <Text color="gray.500">Etapa não encontrada</Text>
                {onBack && (
                    <Button mt={4} onClick={onBack}>
                        Voltar
                    </Button>
                )}
            </Box>
        );
    }

    // Handlers para componentes
    const handleAddComponent = (type: ComponentType) => {
        try {
            const newComponent = createDefaultComponent(type);
            addComponent(stepId, newComponent);
            setSelectedComponentId(newComponent.id);
            console.log(`Componente ${type} adicionado à etapa.`);
        } catch (error) {
            console.error('Erro ao adicionar componente:', error);
        }
    }; const handleComponentSelect = (componentId: string) => {
        setSelectedComponentId(componentId);
    };

    const handleComponentUpdate = (componentId: string, newProps: any) => {
        updateComponent(stepId, componentId, newProps);
        console.log('Componente atualizado');
    };

    const handleComponentDelete = (componentId: string) => {
        if (selectedComponentId === componentId) {
            setSelectedComponentId('');
        }

        deleteComponent(stepId, componentId);
        console.log('Componente removido');
    };

    const handleComponentDuplicate = (componentId: string) => {
        const component = currentStep.components.find((c: ModularComponent) => c.id === componentId);
        if (component) {
            const duplicatedComponent: ModularComponent = {
                ...component,
                id: `${component.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            };

            addComponent(stepId, duplicatedComponent);
            setSelectedComponentId(duplicatedComponent.id);
            console.log('Componente duplicado');
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = currentStep.components.findIndex((c: ModularComponent) => c.id === active.id);
            const newIndex = currentStep.components.findIndex((c: ModularComponent) => c.id === over.id);

            reorderComponents(stepId, oldIndex, newIndex);
            console.log('Ordem dos componentes alterada');
        }
    };

    const handleSave = () => {
        if (onSave) {
            onSave(currentStep);
        }
        console.log('Etapa salva');
    }; const handlePreview = () => {
        setIsPreviewMode(!isPreviewMode);
        if (onPreview && !isPreviewMode) {
            onPreview(currentStep);
        }
    };

    const componentIds = currentStep.components.map((c: ModularComponent) => c.id);

    return (
        <Box w="full" h="full" bg="gray.50" position="relative">

            {/* Header do Editor */}
            <Box
                w="full"
                h="60px"
                bg="white"
                borderBottom="1px solid"
                borderColor="gray.200"
                px={6}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                position="sticky"
                top={0}
                zIndex={100}
            >
                <HStack gap={4}>
                    {onBack && (
                        <Button variant="ghost" size="sm" onClick={onBack}>
                            ← Voltar
                        </Button>
                    )}

                    <VStack gap={0} align="start">
                        <Text fontSize="lg" fontWeight="semibold">
                            <Text fontSize="lg" fontWeight="semibold">
                                {currentStep.name || `Etapa ${currentStep.order}`}
                            </Text>
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                            {currentStep.components.length} componente(s)
                        </Text>
                    </VStack>
                </HStack>

                <HStack gap={2}>
                    <Button
                        colorScheme="brand"
                        size="sm"
                        onClick={toggleSidebar}
                    >
                        + Componentes
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreview}
                        colorScheme={isPreviewMode ? 'green' : 'gray'}
                    >
                        {isPreviewMode ? '✏️ Editor' : '👁️ Preview'}
                    </Button>

                    <Button
                        colorScheme="brand"
                        size="sm"
                        onClick={handleSave}
                    >
                        💾 Salvar
                    </Button>
                </HStack>
            </Box>

            {/* Área Principal */}
            <Flex
                w="full"
                h="calc(100vh - 60px)"
                position="relative"
            >

                {/* Canvas do Editor */}
                <Box
                    flex={1}
                    h="full"
                    overflowY="auto"
                    pr={isSidebarOpen ? "320px" : "60px"}
                    transition="padding-right 0.3s ease"
                >
                    <Container maxW="container.md" py={8}>

                        {currentStep.components.length === 0 ? (
                            // Estado vazio
                            <VStack
                                gap={6}
                                p={12}
                                border="2px dashed"
                                borderColor="gray.300"
                                borderRadius="lg"
                                bg="white"
                                textAlign="center"
                            >
                                <Text fontSize="lg" color="gray.500">
                                    Esta etapa está vazia
                                </Text>
                                <Text fontSize="sm" color="gray.400">
                                    Adicione componentes usando o painel lateral para começar a construir sua etapa.
                                </Text>
                                <Button
                                    colorScheme="brand"
                                    onClick={toggleSidebar}
                                >
                                    + Adicionar Primeiro Componente
                                </Button>
                            </VStack>
                        ) : (
                            // Lista de componentes com Drag & Drop
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={componentIds}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {currentStep.components.map((component: ModularComponent, index: number) => (
                                        <SortableItem
                                            key={component.id}
                                            component={component}
                                            index={index}
                                            isSelected={selectedComponentId === component.id}
                                            isPreviewMode={isPreviewMode}
                                            onSelect={handleComponentSelect}
                                            onUpdate={handleComponentUpdate}
                                            onDelete={handleComponentDelete}
                                            onDuplicate={handleComponentDuplicate}
                                            stepData={{
                                                stepId,
                                                stepOrder: currentStep.order,
                                                stepTitle: currentStep.name,
                                                totalSteps: funnel.steps.length,
                                            }}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </Container>
                </Box>

                {/* Sidebar de Componentes */}
                <Portal>
                    <ComponentSidebar
                        isOpen={isSidebarOpen}
                        onToggle={toggleSidebar}
                        onAddComponent={handleAddComponent}
                        selectedComponentId={selectedComponentId}
                        onComponentSelect={handleComponentSelect}
                    />
                </Portal>
            </Flex>
        </Box>
    );
};

export default ModularEditor;