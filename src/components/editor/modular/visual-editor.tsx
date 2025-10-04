/**
 * 🎨 EDITOR VISUAL MODULAR
 * 
 * Componente principal para renderizar e editar etapas modulares.
 * Inclui seleção visual, overlay de edição e controles interativos.
 */

import React from 'react';
import { ModularStep, ModularComponent, ComponentType } from './types';
import { COMPONENT_MAP } from './components';
import { SortableComponentContainer, ComponentDropZone } from './drag-drop';
import { componentFactory } from './factory';

// 🎯 Props do renderizador de etapas
interface ModularStepRendererProps {
    step: ModularStep;
    isSelected: boolean;
    isEditing: boolean;
    selectedComponentId: string | null;
    onSelectStep: () => void;
    onSelectComponent: (componentId: string) => void;
    onUpdateComponent: (componentId: string, updates: Partial<ModularComponent>) => void;
    onDeleteComponent: (componentId: string) => void;
    onDuplicateComponent: (componentId: string) => void;
    onMoveComponentUp: (componentId: string) => void;
    onMoveComponentDown: (componentId: string) => void;
    onAddComponent: (type: ComponentType, order?: number) => void;
}

export const ModularStepRenderer: React.FC<ModularStepRendererProps> = ({
    step,
    isSelected,
    isEditing,
    selectedComponentId,
    onSelectStep,
    onSelectComponent,
    onUpdateComponent,
    onDeleteComponent,
    onDuplicateComponent,
    onMoveComponentUp,
    onMoveComponentDown,
    onAddComponent
}) => {
    const handleStepClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectStep();
    };

    const handleComponentUpdate = (componentId: string) => (updates: Partial<ModularComponent>) => {
        onUpdateComponent(componentId, updates);
    };

    const handleComponentDelete = (componentId: string) => () => {
        onDeleteComponent(componentId);
    };

    const handleComponentDuplicate = (componentId: string) => () => {
        onDuplicateComponent(componentId);
    };

    const handleComponentMoveUp = (componentId: string) => () => {
        onMoveComponentUp(componentId);
    };

    const handleComponentMoveDown = (componentId: string) => () => {
        onMoveComponentDown(componentId);
    };

    // 🎨 Estilos da etapa
    const stepStyles: React.CSSProperties = {
        backgroundColor: step.settings.backgroundColor || '#ffffff',
        backgroundImage: step.settings.backgroundImage ? `url(${step.settings.backgroundImage})` : undefined,
        padding: `${step.settings.padding || 24}px`,
        minHeight: `${step.settings.minHeight || 400}px`,
        maxWidth: step.settings.maxWidth ? `${step.settings.maxWidth}px` : undefined,
        margin: step.settings.centerContent ? '0 auto' : undefined
    };

    return (
        <div
            className={`relative border-2 rounded-lg transition-all duration-200 ${isSelected
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
            style={stepStyles}
            onClick={handleStepClick}
        >
            {/* Header da etapa */}
            {isEditing && (
                <div className="absolute -top-12 left-0 flex items-center space-x-2 z-20">
                    <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded-md font-medium">
                        {step.name} ({step.type})
                    </div>

                    {isSelected && (
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddComponent('title');
                                }}
                                className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                                title="Adicionar componente"
                            >
                                + Comp
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Componentes da etapa */}
            <div className="space-y-4">
                {step.components.length === 0 ? (
                    <EmptyStepPlaceholder onAddComponent={onAddComponent} />
                ) : (
                    <SortableComponentContainer
                        components={step.components}
                        stepId={step.id}
                    >
                        {(component, index) => (
                            <ComponentRenderer
                                key={component.id}
                                component={component}
                                isSelected={selectedComponentId === component.id}
                                isEditing={isEditing}
                                onSelect={() => onSelectComponent(component.id)}
                                onUpdate={handleComponentUpdate(component.id)}
                                onDelete={handleComponentDelete(component.id)}
                                onDuplicate={handleComponentDuplicate(component.id)}
                                onMoveUp={handleComponentMoveUp(component.id)}
                                onMoveDown={handleComponentMoveDown(component.id)}
                            />
                        )}
                    </SortableComponentContainer>
                )}
            </div>

            {/* Drop zone no final da etapa */}
            {isEditing && (
                <ComponentDropZone
                    stepId={step.id}
                    index={step.components.length}
                    onDrop={() => { }} // Implementado no provider
                />
            )}

            {/* Overlay de seleção */}
            {isSelected && isEditing && (
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
            )}
        </div>
    );
};

// 🧩 Renderizador individual de componentes
interface ComponentRendererProps {
    component: ModularComponent;
    isSelected: boolean;
    isEditing: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<ModularComponent>) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
    component,
    isSelected,
    isEditing,
    onSelect,
    onUpdate,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown
}) => {
    const ComponentElement = COMPONENT_MAP[component.type];

    if (!ComponentElement) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                    Componente não encontrado: {component.type}
                </p>
            </div>
        );
    }

    return (
        <div className="relative group">
            <ComponentElement
                component={component}
                isSelected={isSelected}
                isEditing={isEditing}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
            />

            {/* Controles de componente */}
            {isSelected && isEditing && (
                <ComponentControls
                    component={component}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                />
            )}
        </div>
    );
};

// 🎛️ Controles de componente
interface ComponentControlsProps {
    component: ModularComponent;
    onDelete: () => void;
    onDuplicate: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

const ComponentControls: React.FC<ComponentControlsProps> = ({
    component,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown
}) => {
    return (
        <div className="absolute -top-8 right-0 flex items-center space-x-1 bg-white border border-gray-200 rounded-md shadow-lg p-1 z-30">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onMoveUp();
                }}
                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Mover para cima"
            >
                ↑
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onMoveDown();
                }}
                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Mover para baixo"
            >
                ↓
            </button>

            <div className="w-px h-4 bg-gray-200" />

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate();
                }}
                className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Duplicar"
            >
                📋
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Excluir"
            >
                🗑️
            </button>
        </div>
    );
};

// 📝 Placeholder para etapas vazias
interface EmptyStepPlaceholderProps {
    onAddComponent: (type: ComponentType) => void;
}

const EmptyStepPlaceholder: React.FC<EmptyStepPlaceholderProps> = ({
    onAddComponent
}) => {
    const commonComponents: Array<{ type: ComponentType; icon: string; label: string }> = [
        { type: 'title', icon: '📝', label: 'Título' },
        { type: 'text', icon: '📄', label: 'Texto' },
        { type: 'input', icon: '📥', label: 'Campo' },
        { type: 'button', icon: '🔘', label: 'Botão' },
        { type: 'options', icon: '☑️', label: 'Opções' },
        { type: 'image', icon: '🖼️', label: 'Imagem' }
    ];

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4 text-gray-300">📋</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
                Etapa vazia
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
                Adicione componentes para começar a construir sua etapa.
                Escolha um dos componentes básicos abaixo:
            </p>

            <div className="grid grid-cols-3 gap-3">
                {commonComponents.map(({ type, icon, label }) => (
                    <button
                        key={type}
                        onClick={() => onAddComponent(type)}
                        className="flex flex-col items-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                    >
                        <span className="text-xl mb-1 group-hover:scale-110 transition-transform">
                            {icon}
                        </span>
                        <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">
                            {label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// 🎪 Componente de biblioteca de componentes
interface ComponentLibraryProps {
    onAddComponent: (type: ComponentType) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
    onAddComponent
}) => {
    const componentCategories = [
        {
            name: 'Conteúdo',
            components: [
                { type: 'title' as ComponentType, icon: '📝', label: 'Título' },
                { type: 'text' as ComponentType, icon: '📄', label: 'Texto' },
                { type: 'image' as ComponentType, icon: '🖼️', label: 'Imagem' },
                { type: 'help-text' as ComponentType, icon: '❓', label: 'Ajuda' }
            ]
        },
        {
            name: 'Interação',
            components: [
                { type: 'input' as ComponentType, icon: '📥', label: 'Campo' },
                { type: 'button' as ComponentType, icon: '🔘', label: 'Botão' },
                { type: 'options' as ComponentType, icon: '☑️', label: 'Opções' }
            ]
        },
        {
            name: 'Layout',
            components: [
                { type: 'spacer' as ComponentType, icon: '📏', label: 'Espaço' },
                { type: 'divider' as ComponentType, icon: '➖', label: 'Divisor' },
                { type: 'progress-bar' as ComponentType, icon: '📊', label: 'Progresso' }
            ]
        }
    ];

    return (
        <div className="w-64 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                    Biblioteca de Componentes
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Arraste ou clique para adicionar
                </p>
            </div>

            <div className="p-4 space-y-6">
                {componentCategories.map((category) => (
                    <div key={category.name}>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                            {category.name}
                        </h4>

                        <div className="grid grid-cols-2 gap-2">
                            {category.components.map(({ type, icon, label }) => (
                                <button
                                    key={type}
                                    onClick={() => onAddComponent(type)}
                                    className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group cursor-pointer"
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('application/json', JSON.stringify({
                                            type: 'component-template',
                                            componentType: type
                                        }));
                                    }}
                                >
                                    <span className="text-lg mb-1 group-hover:scale-110 transition-transform">
                                        {icon}
                                    </span>
                                    <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};