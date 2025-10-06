/**
 * 🎯 EDITABLE STRATEGIC QUESTION STEP
 * 
 * Wrapper editável para o componente StrategicQuestionStep de produção.
 * Permite edição de questionText, options e icon
 * com mock da seleção única para preview.
 */

import React, { useMemo } from 'react';
import CompositeStrategicQuestionStep from '../modular/components/composite/CompositeStrategicQuestionStep';
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

    // � Handle property click usando callback da interface
    const handlePropertyClick = (propKey: string, element: HTMLElement) => {
        if (onPropertyClick) {
            onPropertyClick(propKey, element);
        }
    };        // 🔧 Garantir que os dados têm estrutura mínima necessária
    const safeData = useMemo(() => {
        type StrategicOption = { id?: string; text?: string };

        interface StrategicStepDataExtras {
            questionNumber?: string;
            questionText?: string;
            options?: StrategicOption[];
            backgroundColor?: string;
            textColor?: string;
            accentColor?: string;
            progressCurrentStep?: number;
            totalSteps?: number;
            editableHint?: boolean;
        }

        const stepData = data as StrategicStepDataExtras;

        const fallbackOptions: StrategicOption[] = [
            { id: 'op1', text: 'Conforto acima de tudo' },
            { id: 'op2', text: 'Aparência impecável' },
            { id: 'op3', text: 'Versatilidade para diferentes ocasiões' },
            { id: 'op4', text: 'Originalidade e exclusividade' }
        ];

        const rawOptions: StrategicOption[] = Array.isArray(stepData.options) && stepData.options.length > 0
            ? stepData.options
            : fallbackOptions;

        const normalizedOptions = rawOptions.map((option, index) => ({
            id: option?.id || `strategic-option-${index + 1}`,
            text: option?.text || `Opção ${index + 1}`
        }));

        return {
            ...stepData,
            type: 'strategic-question' as const,
            questionNumber: stepData.questionNumber || 'Pergunta Estratégica',
            questionText: stepData.questionText || 'Qual é a sua principal prioridade ao escolher roupas?',
            options: normalizedOptions,
            backgroundColor: stepData.backgroundColor || '#0f172a',
            textColor: stepData.textColor || '#ffffff',
            accentColor: stepData.accentColor || '#38bdf8',
            progressCurrentStep: stepData.progressCurrentStep || 15,
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
            className="editable-strategic-question-step"
        >
            <CompositeStrategicQuestionStep
                questionNumber={safeData.questionNumber}
                questionText={safeData.questionText}
                options={safeData.options}
                backgroundColor={safeData.backgroundColor}
                textColor={safeData.textColor}
                accentColor={safeData.accentColor}
                progressCurrentStep={safeData.progressCurrentStep}
                totalSteps={safeData.totalSteps}
                editableHint={safeData.editableHint}
            />
        </EditableBlockWrapper>
    );
};

export default EditableStrategicQuestionStep;