// @ts-nocheck - Temporary suppression for QuizStep interface compatibility
import React, { useMemo } from 'react';
import { SelectableBlock } from '../SelectableBlock';

interface EditableStrategicQuestionStepProps {
    step: any;
    selectedBlockId?: string;
    onSelectBlock?: (blockId: string) => void;
    onUpdateStep?: (updates: any) => void;
    dragEnabled?: boolean;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    data?: any;
    currentAnswer?: string;
    onAnswerChange?: (answer: string) => void;
    onOpenProperties?: (blockId: string) => void;
}

const EditableStrategicQuestionStep: React.FC<EditableStrategicQuestionStepProps> = ({
    step,
    selectedBlockId,
    onSelectBlock,
    onUpdateStep,
    dragEnabled = false,
    onEdit,
    isEditable = false,
    data,
    currentAnswer,
    onAnswerChange,
    onOpenProperties
}) => {
    const safeData = useMemo(() => ({
        ...data,
        type: 'strategic-question' as const,
        questionNumber: data?.questionNumber || step?.questionNumber || '2',
        questionText: data?.questionText || step?.questionText || 'Qual é a sua principal prioridade ao escolher roupas?',
        answers: data?.answers || step?.answers || [
            { value: 'conforto', label: 'Conforto acima de tudo' },
            { value: 'aparencia', label: 'Aparência impecável' },
            { value: 'versatilidade', label: 'Versatilidade para diferentes ocasiões' },
            { value: 'originalidade', label: 'Originalidade e exclusividade' }
        ]
    }), [data, step]);

    return (
        <div className="p-4 bg-white rounded-lg">
            <SelectableBlock
                blockId={step?.id || 'question-block'}
                isSelected={selectedBlockId === step?.id}
                isEditable={isEditable}
                onSelect={onSelectBlock}
                blockType="Strategic Question"
                onOpenProperties={onOpenProperties}
            >
                <h3>{safeData.questionText}</h3>
                <div className="grid gap-2">
                    {safeData.answers.map((answer: any) => (
                        <button
                            key={answer.value}
                            onClick={() => onAnswerChange?.(answer.value)}
                            className={`p-3 rounded border ${currentAnswer === answer.value ? 'bg-primary text-white' : 'bg-white'}`}
                        >
                            {answer.label}
                        </button>
                    ))}
                </div>
            </SelectableBlock>
        </div>
    );
};

export default EditableStrategicQuestionStep;
