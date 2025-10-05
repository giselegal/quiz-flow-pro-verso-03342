/**
 * 🎨 EDITOR MODULAR PRINCIPAL
 * 
 * Componente principal que integra todo o sistema modular
 */

import React, { useState, useEffect } from 'react';
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
    useToast,
    Portal,
} from '@chakra-ui/react';
import {
    AddIcon,
    ViewIcon,
    EditIcon,
    DeleteIcon,
    CopyIcon,
    UpDownIcon,
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
}export const ModularEditor: React.FC<ModularEditorProps> = ({
    stepId,
    onSave,
    onPreview,
    onBack,
}) => {
    const toast = useToast();
    const {
        funnel,
        getStep,
        updateStep,
        addComponentToStep,
        updateComponent,
        removeComponent,
        reorderComponents,
    } = useQuizEditor();

    // Estado local
    const [selectedComponentId, setSelectedComponentId] = useState<string>('');
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const { isOpen: isSidebarOpen, onToggle: toggleSidebar } = useDisclosure({ defaultIsOpen: true });

    // Obter etapa atual
    const currentStep = getStep(stepId);

    useEffect(() => {
        if (!currentStep) {
            toast({
                title: 'Etapa não encontrada',
                description: `A etapa com ID ${stepId} não foi encontrada.`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }, [currentStep, stepId, toast]);

    if (!currentStep) {
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
            addComponentToStep(stepId, newComponent);
            setSelectedComponentId(newComponent.id);

            toast({
                title: 'Componente adicionado',
                description: `${type} foi adicionado à etapa.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Erro ao adicionar componente',
                description: error instanceof Error ? error.message : 'Erro desconhecido',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleComponentSelect = (componentId: string) => {
        setSelectedComponentId(componentId);
    };

    const handleComponentUpdate = (componentId: string, newProps: any) => {
        updateComponent(stepId, componentId, { props: newProps });

        toast({
            title: 'Componente atualizado',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    const handleComponentDelete = (componentId: string) => {
        if (selectedComponentId === componentId) {
            setSelectedComponentId('');
        }

        removeComponent(stepId, componentId);

        toast({
            title: 'Componente removido',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleComponentDuplicate = (componentId: string) => {
        const component = currentStep.components.find(c => c.id === componentId);
        if (component) {
            const duplicatedComponent: ModularComponent = {
                ...component,
                id: `${component.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            };

            addComponentToStep(stepId, duplicatedComponent);
            setSelectedComponentId(duplicatedComponent.id);

            toast({
                title: 'Componente duplicado',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        reorderComponents(stepId, sourceIndex, destinationIndex);

        toast({
            title: 'Ordem alterada',
            description: 'A ordem dos componentes foi atualizada.',
            status: 'info',
            duration: 2000,
            isClosable: true,
        });
    };

    const handleSave = () => {
        if (onSave) {
            onSave(currentStep);
        }

        toast({
            title: 'Etapa salva',
            description: 'As alterações foram salvas com sucesso.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const handlePreview = () => {
        setIsPreviewMode(!isPreviewMode);
        if (onPreview && !isPreviewMode) {
            onPreview(currentStep);
        }
    };

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
                <HStack spacing={4}>
                    {onBack && (
                        <Button
                            leftIcon={<EditIcon />}
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                        >
                            Voltar
                        </Button>
                    )}

                    <VStack spacing={0} align="start">
                        <Text fontSize="lg" fontWeight="semibold">
                            {currentStep.title || `Etapa ${currentStep.order}`}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                            {currentStep.components.length} componente(s)
                        </Text>
                    </VStack>
                </HStack>

                <HStack spacing={2}>
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="brand"
                        size="sm"
                        onClick={toggleSidebar}
                    >
                        Componentes
                    </Button>

                    <Button
                        leftIcon={<ViewIcon />}
                        variant="outline"
                        size="sm"
                        onClick={handlePreview}
                        colorScheme={isPreviewMode ? 'green' : 'gray'}
                    >
                        {isPreviewMode ? 'Editor' : 'Preview'}
                    </Button>

                    <Button
                        colorScheme="brand"
                        size="sm"
                        onClick={handleSave}
                    >
                        Salvar
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
                                spacing={6}
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
                                    leftIcon={<AddIcon />}
                                    colorScheme="brand"
                                    onClick={toggleSidebar}
                                >
                                    Adicionar Primeiro Componente
                                </Button>
                            </VStack>
                        ) : (
                            // Lista de componentes
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="components">
                                    {(provided, snapshot) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            bg={snapshot.isDraggingOver ? 'brand.50' : 'transparent'}
                                            borderRadius="md"
                                            transition="background-color 0.2s"
                                            p={snapshot.isDraggingOver ? 4 : 0}
                                        >
                                            {currentStep.components.map((component, index) => (
                                                <Draggable
                                                    key={component.id}
                                                    draggableId={component.id}
                                                    index={index}
                                                    isDragDisabled={isPreviewMode}
                                                >
                                                    {(provided, snapshot) => (
                                                        <Box
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            mb={4}
                                                            position="relative"
                                                            transform={snapshot.isDragging ? 'rotate(3deg)' : 'none'}
                                                            boxShadow={snapshot.isDragging ? 'xl' : 'none'}
                                                            bg={snapshot.isDragging ? 'white' : 'transparent'}
                                                            borderRadius="md"
                                                            p={snapshot.isDragging ? 4 : 0}
                                                        >
                                                            {/* Controles de Drag & Drop */}
                                                            {!isPreviewMode && (
                                                                <HStack
                                                                    position="absolute"
                                                                    top={-8}
                                                                    right={0}
                                                                    spacing={1}
                                                                    zIndex={10}
                                                                    opacity={selectedComponentId === component.id ? 1 : 0}
                                                                    transition="opacity 0.2s"
                                                                    _hover={{ opacity: 1 }}
                                                                >
                                                                    <Tooltip label="Arrastar">
                                                                        <IconButton
                                                                            {...provided.dragHandleProps}
                                                                            aria-label="Arrastar componente"
                                                                            icon={<UpDownIcon />}
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
                                                                            onClick={() => handleComponentDuplicate(component.id)}
                                                                        />
                                                                    </Tooltip>

                                                                    <Tooltip label="Excluir">
                                                                        <IconButton
                                                                            aria-label="Excluir componente"
                                                                            icon={<DeleteIcon />}
                                                                            size="xs"
                                                                            variant="solid"
                                                                            colorScheme="red"
                                                                            onClick={() => handleComponentDelete(component.id)}
                                                                        />
                                                                    </Tooltip>
                                                                </HStack>
                                                            )}

                                                            {/* Renderização do Componente */}
                                                            <ComponentListRenderer
                                                                components={[component]}
                                                                selectedComponentId={selectedComponentId}
                                                                isEditable={!isPreviewMode}
                                                                onComponentSelect={handleComponentSelect}
                                                                onComponentUpdate={handleComponentUpdate}
                                                                onComponentDelete={handleComponentDelete}
                                                                renderContext={isPreviewMode ? 'preview' : 'editor'}
                                                                stepData={{
                                                                    stepId,
                                                                    stepOrder: currentStep.order,
                                                                    stepTitle: currentStep.title,
                                                                    totalSteps: funnel?.steps.length || 1,
                                                                }}
                                                            />
                                                        </Box>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                            </DragDropContext>
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