// @ts-nocheck - Temporary suppression for QuizStep interface compatibility
import React, { useMemo } from 'react';
import { SelectableBlock } from '../SelectableBlock';

interface EditableResultStepProps {
    step: any;
    selectedBlockId?: string;
    onSelectBlock?: (blockId: string) => void;
    onUpdateStep?: (updates: any) => void;
    dragEnabled?: boolean;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    data?: any;
    userProfile?: any;
    onOpenProperties?: (blockId: string) => void;
}

const EditableResultStep: React.FC<EditableResultStepProps> = ({
    step,
    selectedBlockId,
    onSelectBlock,
    onUpdateStep,
    dragEnabled = false,
    onEdit,
    isEditable = false,
    data,
    userProfile,
    onOpenProperties
}) => {
    
    const safeData = useMemo(() => ({
        ...data,
        type: 'result' as const,
        title: data?.title || step?.title || 'Seu Estilo é: <span style="color: #B89B7A; font-weight: 700;">Elegante Sofisticado</span>',
        description: data?.description || step?.description || 'Você tem um gosto refinado e aprecia peças de qualidade que transmitem sobriedade e elegância.',
        resultKey: data?.resultKey || step?.resultKey || 'elegante'
    }), [data, step]);

    return (
        <div className="p-4 bg-white rounded-lg">
            <SelectableBlock
                blockId={step?.id || 'result-block'}
                isSelected={selectedBlockId === step?.id}
                isEditable={isEditable}
                onSelect={onSelectBlock}
                blockType="Result Step"
                onOpenProperties={onOpenProperties}
            >
                <div dangerouslySetInnerHTML={{ __html: safeData.title }} />
                <p>{safeData.description}</p>
            </SelectableBlock>
        </div>
    );
};

export default EditableResultStep;
