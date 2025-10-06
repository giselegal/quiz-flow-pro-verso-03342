/**
 * 🏆 EDITABLE RESULT STEP
 * 
 * Wrapper editável para o componente ResultStep de produção.
 * Este é o mais complexo (480 linhas originais) - combina resultado + oferta.
 * Mock de userProfile, scores e lógica de compra para preview.
 */

import React, { useMemo } from 'react';
import CompositeResultStep from '../modular/components/composite/CompositeResultStep';
import { EditableBlockWrapper } from './shared/EditableBlockWrapper';
import { EditableStepProps } from './shared/EditableStepProps';

export interface EditableResultStepProps extends EditableStepProps {
    // Propriedades específicas podem ser adicionadas
}

const EditableResultStep: React.FC<EditableResultStepProps> = ({
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

    // 🎭 Props editáveis específicas do ResultStep
    const editableProps = [
        'title',
        'subtitle',
        'description',
        'userName',
        'resultStyle',
        'image',
        'characteristics',
        'ctaText',
        'resultPlaceholder',
        'backgroundColor',
        'textColor',
        'accentColor',
        'accentColorSecondary'
    ];

    // 🎨 Handle property click usando callback da interface
    const handlePropertyClick = (propKey: string, element: HTMLElement) => {
        if (onPropertyClick) {
            onPropertyClick(propKey, element);
        }
    };        // 🔧 Garantir que os dados têm estrutura mínima necessária
    const safeData = useMemo(() => {
        interface ResultStepDataExtras {
            title?: string;
            subtitle?: string;
            description?: string;
            userName?: string;
            resultStyle?: string;
            image?: string;
            characteristics?: string[];
            ctaText?: string;
            resultPlaceholder?: string;
            backgroundColor?: string;
            textColor?: string;
            accentColor?: string;
            accentColorSecondary?: string;
            showEditableHint?: boolean;
        }

        const stepData = data as ResultStepDataExtras;

        return {
            ...stepData,
            type: 'result' as const,
            title: stepData.title || 'Seu estilo predominante é:',
            subtitle: stepData.subtitle || 'Seu resultado foi calculado com base nas suas respostas, {userName}.',
            description: stepData.description || 'Parabéns! Você descobriu seu estilo único e agora tem um guia completo para usar a moda a seu favor.',
            userName: stepData.userName || 'Preview User',
            resultStyle: stepData.resultStyle || 'Clássico Elegante',
            image: stepData.image,
            characteristics: Array.isArray(stepData.characteristics) && stepData.characteristics.length > 0
                ? stepData.characteristics
                : ['Elegante e refinado', 'Atemporal e sofisticado', 'Valoriza qualidade'],
            ctaText: stepData.ctaText || 'Descobrir Minha Consultoria Personalizada',
            resultPlaceholder: stepData.resultPlaceholder || 'Resultado aparecerá aqui...',
            backgroundColor: stepData.backgroundColor || '#fff8f0',
            textColor: stepData.textColor || '#432818',
            accentColor: stepData.accentColor || '#B89B7A',
            accentColorSecondary: stepData.accentColorSecondary || '#A1835D',
            showEditableHint: stepData.showEditableHint ?? isEditable
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
            className="editable-result-step"
        >
            <CompositeResultStep
                title={safeData.title}
                subtitle={safeData.subtitle}
                userName={safeData.userName}
                resultStyle={safeData.resultStyle}
                description={safeData.description}
                image={safeData.image}
                characteristics={safeData.characteristics}
                ctaText={safeData.ctaText}
                resultPlaceholder={safeData.resultPlaceholder}
                backgroundColor={safeData.backgroundColor}
                textColor={safeData.textColor}
                accentColor={safeData.accentColor}
                accentColorSecondary={safeData.accentColorSecondary}
                showEditableHint={safeData.showEditableHint}
            />

            {/* 🎮 Overlay informativo para editor */}
            {isEditable && (
                <div className="absolute top-4 left-4 z-20">
                    <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full opacity-80">
                        🏆 Preview com dados mock
                    </div>
                </div>
            )}
        </EditableBlockWrapper>
    );
};

export default EditableResultStep;