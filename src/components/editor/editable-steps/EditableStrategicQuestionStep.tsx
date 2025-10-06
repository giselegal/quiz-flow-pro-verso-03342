/**
 * 🎯 EDITABLE STRATEGIC QUESTION STEP
 * 
 * Wrapper editável para o componente StrategicQuestionStep de produção.
 * Permite edição de questionText, options e icon
 * com mock da seleção única para preview.
 */

import React, { useMemo, useState } from 'react';
import StrategicQuestionStep from '../../quiz/StrategicQuestionStep';
import { EditableBlockWrapper } from './shared/EditableBlockWrapper';
import { EditableStepProps } from './shared/EditableStepProps';

export interface EditableStrategicQuestionStepProps extends EditableStepProps {
    // Propriedades específicas podem ser adicionadas
}

const EditableStrategicQuestionStep: React.FC<EditableStrategicQuestionStepProps> = ({
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

    // 🎭 Props editáveis específicas do StrategicQuestionStep
    const editableProps = [
        'questionText',
        'options'
    ];

    // 🎪 Mock state para currentAnswer (simular seleção no preview)
    const [mockCurrentAnswer, setMockCurrentAnswer] = useState<string>(() => {
        // Inicializar com primeira opção selecionada para preview
        if (data.options && data.options.length > 0) {
            return data.options[0].id;
        }
        return '';
    });

    // 🎪 Mock callback para onAnswerChange
    const mockAnswerChange = useMemo(() => (answer: string) => {
        console.log('[Editor Mock] StrategicQuestionStep - Resposta alterada:', answer);

        if (isEditable) {
            // Atualizar state mock para preview
            setMockCurrentAnswer(answer);

            // No editor, apenas atualizamos o preview
            // Em produção, isso seria usado para personalizar ofertas
            return;
        }
    }, [isEditable]);

    // 🎨 Handle property click usando callback da interface
    const handlePropertyClick = (propKey: string, element: HTMLElement) => {
        if (onPropertyClick) {
            onPropertyClick(propKey, element);
        }
    };        // 🔧 Garantir que os dados têm estrutura mínima necessária
    const safeData = useMemo(() => ({
        ...data,
        type: 'strategic-question' as const,
        questionNumber: data.questionNumber || '2',
        questionText: data.questionText || 'Qual é a sua principal prioridade ao escolher roupas?',
        answers: data.answers || [
            { value: 'conforto', label: 'Conforto acima de tudo' },
            { value: 'aparencia', label: 'Aparência impecável' },
            { value: 'versatilidade', label: 'Versatilidade para diferentes ocasiões' },
            { value: 'originalidade', label: 'Originalidade e exclusividade' }
        ]
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
            className="editable-strategic-question-step"
        >
            {/* 🎯 Renderizar componente de produção com mock state */}
            <StrategicQuestionStep
                data={safeData}
                currentAnswer={mockCurrentAnswer}
                onAnswerChange={mockAnswerChange}
            />
        </EditableBlockWrapper>
    );
};

export default EditableStrategicQuestionStep;