/**
 * 🎪 MODULAR STEP CONTAINER
 * 
 * Container que gerencia uma coleção de componentes atômicos.
 * Permite reordenação, inserção e remoção de componentes individuais.
 */

import React, { useMemo } from 'react';
import { ModularStep, AtomicComponent, AtomicComponentType, ModularStepProps } from './types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';

// Importar componentes atômicos
import AtomicTitleComponent from './AtomicTitle';
import AtomicTextComponent from './AtomicText';
import AtomicButtonComponent from './AtomicButton';
import AtomicInputComponent from './AtomicInput';

// Importar novos componentes do diretório quiz/atomic-components
import { AtomicImage } from '../quiz/atomic-components/AtomicImage';
import { AtomicSpacer } from '../quiz/atomic-components/AtomicSpacer';
import { AtomicDivider } from '../quiz/atomic-components/AtomicDivider';
import { AtomicQuestion } from '../quiz/atomic-components/AtomicQuestion';
import { AtomicOptions } from '../quiz/atomic-components/AtomicOptions';

const ModularStepContainer: React.FC<ModularStepProps> = ({
    step,
    isEditable,
    selectedComponentId,
    onUpdateStep,
    onUpdateComponent,
    onSelectComponent,
    onDeleteComponent,
    onDuplicateComponent,
    onReorderComponents,
    onInsertComponent
}) => {
    // Ordenar componentes por order
    const sortedComponents = useMemo(() => {
        return [...step.components].sort((a, b) => a.order - b.order);
    }, [step.components]);

    // Renderizar componente atômico baseado no tipo
    const renderAtomicComponent = (component: AtomicComponent, index: number) => {
        const isSelected = selectedComponentId === component.id;
        const canMoveUp = index > 0;
        const canMoveDown = index < sortedComponents.length - 1;

        const commonProps = {
            component,
            isSelected,
            isEditable,
            onUpdate: (updates: Partial<AtomicComponent>) => onUpdateComponent(component.id, updates),
            onSelect: () => onSelectComponent(component.id),
            onDelete: () => onDeleteComponent(component.id),
            onDuplicate: () => onDuplicateComponent(component.id),
            onMoveUp: canMoveUp ? () => onReorderComponents(index, index - 1) : undefined,
            onMoveDown: canMoveDown ? () => onReorderComponents(index, index + 1) : undefined,
            onInsertAfter: (componentType: AtomicComponentType) => onInsertComponent(component.id, componentType),
            canMoveUp,
            canMoveDown,
            stepId: step.id
        };

        // Adaptar props para cada tipo específico
        const componentProps = {
            component: component as any,
            onUpdate: commonProps.onUpdate,
            onDelete: commonProps.onDelete,
            onInsertBefore: (type: string) => onInsertComponent(null, type as AtomicComponentType),
            onInsertAfter: (type: string) => onInsertComponent(component.id, type as AtomicComponentType),
            isEditable
        };

        switch (component.type) {
            case 'title':
            case 'subtitle':
                return <AtomicTitleComponent key={component.id} {...commonProps} component={component as any} />;
            case 'text':
                return <AtomicTextComponent key={component.id} {...commonProps} component={component as any} />;
            case 'button':
                return <AtomicButtonComponent key={component.id} {...commonProps} component={component as any} />;
            case 'input':
                return <AtomicInputComponent key={component.id} {...commonProps} component={component as any} />;
            case 'image':
                return <AtomicImage key={component.id} {...componentProps} />;
            case 'spacer':
                return <AtomicSpacer key={component.id} {...componentProps} />;
            case 'divider':
                return <AtomicDivider key={component.id} {...componentProps} />;
            case 'question':
                return <AtomicQuestion key={component.id} {...componentProps} />;
            case 'options':
                return <AtomicOptions key={component.id} {...componentProps} />;
            default:
                return (
                    <div key={component.id} className="p-4 border border-red-300 bg-red-50 rounded-lg">
                        <div className="text-red-600 text-sm">
                            ⚠️ Componente não implementado: {component.type}
                        </div>
                    </div>
                );
        }
    };

    // Inserir componente no início
    const handleInsertAtStart = (componentType: AtomicComponentType) => {
        onInsertComponent(null, componentType);
    };

    return (
        <div
            className={cn(
                "modular-step-container relative",
                "min-h-32 rounded-lg transition-all duration-200",
                isEditable && "border-2 border-dashed border-gray-200 hover:border-blue-300",
                "p-4 space-y-4"
            )}
            style={{
                backgroundColor: step.settings.backgroundColor || 'transparent',
                padding: step.settings.padding || 16,
                minHeight: step.settings.minHeight || 128
            }}
        >
            {/* Header da etapa */}
            {isEditable && (
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm text-gray-700">{step.name}</h3>
                        <span className="text-xs text-gray-500">
                            {sortedComponents.length} componente{sortedComponents.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        title="Configurações da etapa"
                    >
                        <Settings className="w-3 h-3" />
                    </Button>
                </div>
            )}

            {/* Botão para inserir no início */}
            {isEditable && sortedComponents.length > 0 && (
                <div className="flex justify-center mb-4">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs border-dashed border-green-300 text-green-600 hover:bg-green-50"
                        onClick={() => {
                            // Implementar menu de seleção similar ao AtomicWrapper
                            handleInsertAtStart('text'); // Por enquanto, inserir texto por padrão
                        }}
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Inserir no início
                    </Button>
                </div>
            )}

            {/* Renderizar componentes */}
            {sortedComponents.length > 0 ? (
                <div className="space-y-6">
                    {sortedComponents.map((component, index) =>
                        renderAtomicComponent(component, index)
                    )}
                </div>
            ) : (
                // Estado vazio
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">🎪</div>
                    <div className="text-sm font-medium mb-2">Etapa vazia</div>
                    <div className="text-xs text-center mb-4">
                        Adicione componentes para construir sua etapa
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                        onClick={() => handleInsertAtStart('title')}
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Adicionar primeiro componente
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ModularStepContainer;