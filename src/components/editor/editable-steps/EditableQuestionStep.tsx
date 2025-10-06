/**
 * 🤔 EDITABLE QUESTION STEP
 * 
 * Wrapper editável para o componente QuestionStep de produção.
 * Permite edição de questionNumber, questionText, options e requiredSelections
 * com mock da lógica de seleção para preview.
 */

import React, { useMemo } from 'react';
import CompositeQuestionStep from '../modular/components/composite/CompositeQuestionStep';
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

    // � Handle property click usando callback da interface
    const handlePropertyClick = (propKey: string, element: HTMLElement) => {
        if (onPropertyClick) {
            onPropertyClick(propKey, element);
        }
    };

    // 🔧 Garantir estrutura mínima dos dados
    const safeData = useMemo(() => {
        type QuestionOption = { id?: string; text?: string; image?: string };

        interface QuestionStepDataExtras {
            questionNumber?: string;
            questionText?: string;
            subtitle?: string;
            options?: QuestionOption[];
            requiredSelections?: number;
            allowMultipleSelection?: boolean;
            backgroundColor?: string;
            textColor?: string;
            accentColor?: string;
            totalSteps?: number;
            editableHint?: boolean;
        }

        const stepData = data as QuestionStepDataExtras;

        const fallbackOptions: QuestionOption[] = [
            { id: 'opt1', text: 'Opção 1', image: '' },
            { id: 'opt2', text: 'Opção 2', image: '' },
            { id: 'opt3', text: 'Opção 3', image: '' }
        ];

        const rawOptions: QuestionOption[] = Array.isArray(stepData.options) && stepData.options.length > 0
            ? stepData.options
            : fallbackOptions;

        const normalizedOptions = rawOptions.map((option, index) => ({
            id: option?.id || `option-${index + 1}`,
            text: option?.text || `Opção ${index + 1}`,
            image: option?.image
        }));

        const requiredSelections = stepData.requiredSelections ?? 1;
        const allowMultipleSelection = stepData.allowMultipleSelection ?? requiredSelections > 1;

        return {
            ...stepData,
            type: 'question' as const,
            questionNumber: stepData.questionNumber || '1/10',
            questionText: stepData.questionText || 'Qual opção mais te representa?',
            subtitle: stepData.subtitle,
            options: normalizedOptions,
            requiredSelections,
            allowMultipleSelection,
            backgroundColor: stepData.backgroundColor || '#ffffff',
            textColor: stepData.textColor || '#432818',
            accentColor: stepData.accentColor || '#deac6d',
            totalSteps: stepData.totalSteps || 21,
            editableHint: stepData.editableHint ?? isEditable
        };
    }, [data, isEditable]);

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
            <CompositeQuestionStep
                questionNumber={safeData.questionNumber}
                questionText={safeData.questionText}
                subtitle={safeData.subtitle}
                options={safeData.options}
                requiredSelections={safeData.requiredSelections}
                allowMultipleSelection={safeData.allowMultipleSelection}
                backgroundColor={safeData.backgroundColor}
                textColor={safeData.textColor}
                accentColor={safeData.accentColor}
                totalSteps={safeData.totalSteps}
                editableHint={safeData.editableHint}
            />
        </EditableBlockWrapper>
    );
};

export default EditableQuestionStep;