/**
 * 🤔 EDITABLE QUESTION STEP
 * 
 * Wrapper editável para o componente QuestionStep de produção.
 * Permite edição de questionNumber, questionText, options e requiredSelections
 * com mock da lógica de seleção para preview.
 */

import React, { useMemo, useState } from 'react';
import QuestionStep from '../../quiz/QuestionStep';
import { EditableBlockWrapper } from './shared/EditableBlockWrapper';
import { EditableStepProps } from './shared/EditableStepProps';

export interface EditableQuestionStepProps extends EditableStepProps {
    // Propriedades específicas podem ser adicionadas
}

const EditableQuestionStep: React.FC<EditableQuestionStepProps> = ({
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

    // 🎭 Props editáveis específicas do QuestionStep
    const editableProps = [
        'questionNumber',
        'questionText',
        'options',
        'requiredSelections'
    ];

    // 🎪 Mock state para currentAnswers (simular seleções no preview)
    const [mockCurrentAnswers, setMockCurrentAnswers] = useState<string[]>(() => {
        // Inicializar com uma seleção para mostrar preview
        if (data.options && data.options.length > 0) {
            return [data.options[0].id];
        }
        return [];
    });

    // 🎪 Mock callback para onAnswersChange
    const mockAnswersChange = useMemo(() => (answers: string[]) => {
        console.log('[Editor Mock] QuestionStep - Respostas alteradas:', answers);

        if (isEditable) {
            // Atualizar state mock para preview
            setMockCurrentAnswers(answers);

            // Em produção, isso seria passado para o quiz state
            // No editor, apenas atualizamos o preview
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
        ...data,
        type: 'question' as const,
        questionNumber: data.questionNumber || '1/10',
        questionText: data.questionText || 'Qual opção mais te representa?',
        options: data.options || [
            { id: 'opt1', text: 'Opção 1', image: '' },
            { id: 'opt2', text: 'Opção 2', image: '' },
            { id: 'opt3', text: 'Opção 3', image: '' }
        ],
        requiredSelections: data.requiredSelections || 1
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
            className="editable-question-step"
        >
            {/* 🎯 Renderizar componente de produção com mock state */}
            <QuestionStep
                data={safeData}
                currentAnswers={mockCurrentAnswers}
                onAnswersChange={mockAnswersChange}
            />
        </EditableBlockWrapper>
    );
};

export default EditableQuestionStep;