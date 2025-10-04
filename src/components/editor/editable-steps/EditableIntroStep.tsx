/**
 * 📝 EDITABLE INTRO STEP
 * 
 * Wrapper editável para o componente IntroStep de produção.
 * Permite edição de title, formQuestion, placeholder, buttonText e image
 * sem modificar o componente original.
 */

import React, { useMemo } from 'react';
import IntroStep from '../../quiz/IntroStep';
import { EditableBlockWrapper } from './shared/EditableBlockWrapper';
import { EditableStepProps } from './shared/EditableStepProps';

export interface EditableIntroStepProps extends EditableStepProps {
    // Propriedades específicas do IntroStep podem ser adicionadas aqui
}

const EditableIntroStep: React.FC<EditableIntroStepProps> = ({
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

    // 🎭 Props editáveis específicas do IntroStep
    const editableProps = [
        'title',
        'formQuestion',
        'placeholder',
        'buttonText',
        'image'
    ];

    // 🎪 Mock callback para onNameSubmit (editor não precisa submeter de verdade)
    const mockNameSubmit = useMemo(() => (name: string) => {
        console.log('[Editor Mock] IntroStep - Nome submetido:', name);

        // Em modo editável, podemos simular o comportamento sem side effects
        if (isEditable) {
            // Talvez mostrar uma notificação ou log no painel do editor
            return;
        }
    }, [isEditable]);

    // 🎨 Handle property click usando callback da interface
    const handlePropertyClick = (propKey: string, element: HTMLElement) => {
        if (onPropertyClick) {
            onPropertyClick(propKey, element);
        }
    };

    // 🔧 Garantir que os dados têm estrutura mínima necessária
    const safeData = useMemo(() => ({
        ...data,
        type: 'intro' as const,
        title: data.title || '<span style="color: #B89B7A; font-weight: 700;">Descubra</span> seu estilo único e transforme seu guarda-roupa.',
        formQuestion: data.formQuestion || 'Como posso te chamar?',
        placeholder: data.placeholder || 'Digite seu primeiro nome aqui...',
        buttonText: data.buttonText || 'Quero Descobrir meu Estilo Agora!',
        image: data.image || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png'
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
            className="editable-intro-step"
        >
            {/* 🎯 Renderizar componente de produção original com dados editáveis */}
            <IntroStep
                data={safeData}
                onNameSubmit={mockNameSubmit}
            />
        </EditableBlockWrapper>
    );
};

export default EditableIntroStep;