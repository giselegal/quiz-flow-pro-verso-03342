/**
 * 🎯 MODULAR STEP RENDERER
 * 
 * Renderiza um step completo com múltiplos componentes modulares
 * e funcionalidade de drag & drop para reordenar componentes
 * 
 * @deprecated Este componente será removido no Sprint 4.
 * Use UnifiedStepRenderer de @/components/editor/unified/UnifiedStepRenderer
 * 
 * Motivo: Funcionalidade consolidada no UnifiedStepRenderer oficial que:
 * - Suporta 3 modos (preview | production | editable)
 * - Lazy loading otimizado de steps
 * - Chunk optimization
 * - Performance superior
 * 
 * Migração:
 * ```tsx
 * // ANTES:
 * import { ModularStepRenderer } from '@/components/editor/ModularStepRenderer';
 * <ModularStepRenderer 
 *   step={step} 
 *   isEditable={true}
 *   onUpdateStep={handleUpdate}
 * />
 * 
 * // DEPOIS:
 * import { UnifiedStepRenderer } from '@/components/editor/unified/UnifiedStepRenderer';
 * <UnifiedStepRenderer 
 *   stepNumber={step.id} 
 *   mode="editable"
 *   blocks={step.components}
 *   onUpdate={handleUpdate}
 * />
 * ```
 * 
 * Data de remoção prevista: Sprint 4 - Dia 2 (22/out/2024)
 */

import React, { useState } from 'react';
import { ModularStep, StepComponent, COMPONENT_TEMPLATES } from '@/types/ComponentTypes';
import ModularComponentRenderer from './ModularComponentRenderer';
import DragDropManager from './DragDropManager';
import SelectableBlock from './SelectableBlock';
import { cn } from '@/lib/utils';
import { Plus, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModularStepRendererProps {
    step: ModularStep;
    isEditable?: boolean;
    selectedComponentId?: string;
    onUpdateStep?: (stepId: string, updates: Partial<ModularStep>) => void;
    onSelectComponent?: (componentId: string) => void;
    onOpenComponentProperties?: (componentId: string) => void;
}

const ModularStepRenderer: React.FC<ModularStepRendererProps> = ({
    step,
    isEditable = false,
    selectedComponentId,
    onUpdateStep = () => { },
    onSelectComponent = () => { },
    onOpenComponentProperties = () => { }
}) => {
    // ⚠️ AVISO DE DEPRECIAÇÃO
    if (process.env.NODE_ENV === 'development') {
        console.warn(
            '⚠️ [DEPRECATED] ModularStepRenderer será removido no Sprint 4.\n' +
            'Use UnifiedStepRenderer de @/components/editor/unified/UnifiedStepRenderer\n' +
            'Veja documentação no topo do arquivo para guia de migração.'
        );
    }

    const [showComponentMenu, setShowComponentMenu] = useState(false);

    // Componentes ordenados por order
    const sortedComponents = [...step.components].sort((a, b) => a.order - b.order);

    const handleComponentUpdate = (componentId: string, updates: Partial<StepComponent>) => {
        const updatedComponents = step.components.map(comp =>
            comp.id === componentId ? { ...comp, ...updates } : comp
        );
        onUpdateStep(step.id, { components: updatedComponents });
    };

    const handleComponentReorder = (fromIndex: number, toIndex: number) => {
        const reorderedComponents = [...sortedComponents];
        const [movedComponent] = reorderedComponents.splice(fromIndex, 1);
        reorderedComponents.splice(toIndex, 0, movedComponent);

        // Atualizar os números de ordem
        const updatedComponents = reorderedComponents.map((comp, index) => ({
            ...comp,
            order: index
        }));

        onUpdateStep(step.id, { components: updatedComponents });
    };

    const handleAddComponent = (templateType: string) => {
        const template = COMPONENT_TEMPLATES.find(t => t.type === templateType);
        if (!template) return;

        const newComponent: StepComponent = {
            id: `comp-${Date.now()}`,
            order: step.components.length,
            ...template.defaultProps
        } as StepComponent;

        const updatedComponents = [...step.components, newComponent];
        onUpdateStep(step.id, { components: updatedComponents });
        setShowComponentMenu(false);
    };

    const handleRemoveComponent = (componentId: string) => {
        const updatedComponents = step.components.filter(comp => comp.id !== componentId);
        onUpdateStep(step.id, { components: updatedComponents });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[400px]">
            {/* Header do Step */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div>
                    <h3 className="text-lg font-semibold">{step.name}</h3>
                    <p className="text-sm text-gray-500">
                        {step.components.length} componente(s)
                    </p>
                </div>

                {isEditable && (
                    <div className="relative">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowComponentMenu(!showComponentMenu)}
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar Componente
                        </Button>

                        {/* Menu de Componentes */}
                        {showComponentMenu && (
                            <div className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 w-64">
                                <div className="p-2">
                                    <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                                        COMPONENTES DISPONÍVEIS
                                    </div>
                                    {COMPONENT_TEMPLATES.map((template) => (
                                        <button
                                            key={template.type}
                                            onClick={() => handleAddComponent(template.type)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded text-sm"
                                        >
                                            <span className="text-lg">{template.icon}</span>
                                            <span>{template.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Área de Componentes */}
            {sortedComponents.length === 0 ? (
                <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">📦</div>
                        <div className="text-sm">Nenhum componente adicionado</div>
                        {isEditable && (
                            <div className="text-xs">Clique em "Adicionar Componente" para começar</div>
                        )}
                    </div>
                </div>
            ) : isEditable ? (
                <DragDropManager
                    items={sortedComponents}
                    onReorder={handleComponentReorder}
                    enabled={true}
                    renderItem={(component: StepComponent, index: number, isDragging: boolean) => {
                        const isSelected = selectedComponentId === component.id;

                        return (
                            <SelectableBlock
                                blockId={component.id}
                                isSelected={isSelected}
                                isEditable={true}
                                onSelect={onSelectComponent}
                                blockType={`${component.type} Component`}
                                blockIndex={index}
                                onOpenProperties={() => onOpenComponentProperties(component.id)}
                                isDraggable={true}
                                className={cn(
                                    "mb-4 transition-all duration-200",
                                    isDragging && "opacity-50 scale-95"
                                )}
                            >
                                <div className="relative">
                                    <ModularComponentRenderer
                                        component={component}
                                        isEditable={isEditable}
                                        onUpdate={handleComponentUpdate}
                                    />

                                    {/* Botão de Remover */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveComponent(component.id);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                        title="Remover componente"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </SelectableBlock>
                        );
                    }}
                    className="space-y-2"
                />
            ) : (
                <div className="space-y-4">
                    {sortedComponents.map((component) => (
                        <ModularComponentRenderer
                            key={component.id}
                            component={component}
                            isEditable={false}
                            onUpdate={handleComponentUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModularStepRenderer;