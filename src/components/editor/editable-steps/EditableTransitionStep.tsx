/**
 * ⏳ EDITABLE TRANSITION STEP
 * 
 * Wrapper editável para o componente TransitionStep de produção.
 * Permite edição de title, text e duration
 * com mock do timer automático para preview.
 */

import React, { useMemo } from 'react';
import TransitionStep from '../../quiz/TransitionStep';
import { EditableBlockWrapper } from './shared/EditableBlockWrapper';
import { EditableStepProps } from './shared/EditableStepProps';

export interface EditableTransitionStepProps extends EditableStepProps {
    // Propriedades específicas podem ser adicionadas
}

const EditableTransitionStep: React.FC<EditableTransitionStepProps> = ({
    data,
    isEditable,
    isSelected,
    onUpdate,
    onSelect,
    onDuplicate,
    onDelete,
    onMoveUp,
    onMoveDown,
    canMoveUp,
    canMoveDown,
    canDelete,
    blockId,
    onPropertyClick
}) => {

    // 🎭 Props editáveis específicas do TransitionStep
    const editableProps = [
        'title',
        'text'
    ];

    // 🎪 Mock callback para onComplete (editor não deve avançar automaticamente)
    const mockOnComplete = useMemo(() => () => {
        console.log('[Editor Mock] TransitionStep - Transição completada');

        if (isEditable) {
            // No editor, não fazemos transição automática
            // Apenas simulamos o comportamento para preview
            console.log('[Editor Mock] Transição simulada (não avança automaticamente)');
            return;
        }
    }, [isEditable]);

    // 🎨 Handle property click usando callback da interface
    const handlePropertyClick = (propKey: string, element: HTMLElement) => {
        if (onPropertyClick) {
            onPropertyClick(propKey, element);
        }
    };
    
    // 🔧 Garantir estrutura mínima dos dados
    const safeData = useMemo(() => ({
        stepType: data.type === 'transition-result' ? 'transition-result' as const : 'transition' as const,
        title: data.title || 'Analisando suas respostas...',
        text: data.text || 'Aguarde enquanto preparamos seu resultado personalizado.',
        ...data
    }), [data]);

    return (
        <EditableBlockWrapper
            editableProps={editableProps}
            isEditable={isEditable}
            isSelected={isSelected}
            onSelect={onSelect}
            onUpdate={onUpdate}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onPropertyClick={handlePropertyClick}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            canDelete={canDelete}
            blockId={blockId}
            className="editable-transition-step"
        >
            {/* 🎯 Renderizar componente de produção com mock callback */}
            <TransitionStep
                data={safeData}
                onComplete={mockOnComplete}
            />

            {/* 🎮 Overlay de controle para editor (mostrar que é uma transição) */}
            {isEditable && (
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 pointer-events-none flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-600 opacity-0 hover:opacity-100 transition-opacity">
                        ⏳ Transição (3s em produção)
                    </div>
                </div>
            )}
        </EditableBlockWrapper>
    );
};

export default EditableTransitionStep;