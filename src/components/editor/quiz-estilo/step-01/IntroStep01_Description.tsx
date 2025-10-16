/**
 * 📄 INTRO STEP 01 - DESCRIPTION
 * 
 * Componente separado da descrição para a etapa 1
 * Texto explicativo abaixo da imagem
 */

import React from 'react';

export interface IntroStep01DescriptionProps {
    description?: string;
    descriptionHtml?: string;
    textColor?: string;
    accentColor?: string;
    fontSize?: string;
    textAlign?: 'left' | 'center' | 'right';
    maxWidth?: string;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

export const IntroStep01_Description: React.FC<IntroStep01DescriptionProps> = ({
    description,
    descriptionHtml,
    textColor = '#6B7280',
    accentColor = '#B89B7A',
    fontSize = 'text-sm sm:text-base',
    textAlign = 'center',
    maxWidth = 'max-w-lg',
    isEditable = false,
    onEdit
}) => {
    const defaultDescription = `Em poucos minutos, descubra seu <strong style="color: ${accentColor};">Estilo Predominante</strong> — e aprenda a montar looks que realmente refletem sua <strong style="color: #432818;">essência</strong> e valorizam sua <strong style="color: #432818;">beleza natural</strong>.`;

    const content = descriptionHtml || description || defaultDescription;

    return (
        <div className={`w-full ${maxWidth} px-4 mx-auto`}>
            <p
                className={`${fontSize} leading-relaxed px-2`}
                style={{
                    color: textColor,
                    textAlign,
                    cursor: isEditable ? 'pointer' : 'default'
                }}
                data-editable={isEditable ? 'description' : undefined}
                onClick={() => isEditable && onEdit?.('description', content)}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};

export default IntroStep01_Description;
