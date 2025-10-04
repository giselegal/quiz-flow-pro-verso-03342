/**
 * 🏆 EDITABLE RESULT STEP
 * 
 * Wrapper editável para o componente ResultStep de produção.
 * Este é o mais complexo (480 linhas originais) - combina resultado + oferta.
 * Mock de userProfile, scores e lógica de compra para preview.
 */

import React, { useMemo } from 'react';
import ResultStep from '../../quiz/ResultStep';
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
        'text'
        // Outras props como styleConfig, ofertas, etc. podem ser adicionadas
    ];

    // 🎪 Mock userProfile para preview
    const mockUserProfile = useMemo(() => ({
        userName: 'Preview User',
        resultStyle: 'clássico', // Usar um estilo que existe no styleConfigGisele
        secondaryStyles: ['elegante', 'contemporâneo']
    }), []);

    // 🎪 Mock scores para mostrar as barras de progresso
    const mockScores = useMemo(() => ({
        natural: 15,
        classico: 85,      // Score alto para o estilo principal
        contemporaneo: 60,
        elegante: 75,
        romantico: 25,
        sexy: 10,
        dramatico: 30,
        criativo: 20
    }), []);

    // 🎨 Handle property click usando callback da interface
    const handlePropertyClick = (propKey: string, element: HTMLElement) => {
        if (onPropertyClick) {
            onPropertyClick(propKey, element);
        }
    };        // 🔧 Garantir que os dados têm estrutura mínima necessária
    const safeData = useMemo(() => ({
        ...data,
        type: 'result' as const,
        title: data.title || 'Seu Estilo é: <span style="color: #B89B7A; font-weight: 700;">Elegante Sofisticado</span>',
        description: data.description || 'Você tem um gosto refinado e aprecia peças de qualidade que transmitem sobriedade e elegância.',
        resultKey: data.resultKey || 'elegante'
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
            className="editable-result-step"
        >
            {/* 🎯 Renderizar componente de produção com dados mock */}
            <ResultStep
                data={safeData}
                userProfile={mockUserProfile}
                scores={mockScores}
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