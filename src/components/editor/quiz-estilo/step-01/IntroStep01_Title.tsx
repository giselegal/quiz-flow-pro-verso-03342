/**
 * 📝 INTRO STEP 01 - TITLE
 * 
 * Componente separado do título para a etapa 1
 * Suporta HTML rico e formatação personalizada
 */

import React from 'react';

export interface IntroStep01TitleProps {
    title?: string;
    textColor?: string;
    accentColor?: string;
    fontSize?: string;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

export const IntroStep01_Title: React.FC<IntroStep01TitleProps> = ({
    title = '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você</span>.',
    textColor = '#432818',
    accentColor = '#B89B7A',
    fontSize = 'text-2xl sm:text-3xl md:text-4xl',
    fontFamily = '"Playfair Display", serif',
    textAlign = 'center',
    isEditable = false,
    onEdit
}) => {
    return (
        <div className={`w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto`}>
            <h1
                className={`${fontSize} font-bold leading-tight px-2`}
                style={{
                    fontFamily,
                    color: textColor,
                    textAlign,
                    fontWeight: 400,
                    cursor: isEditable ? 'pointer' : 'default'
                }}
                data-editable={isEditable ? 'title' : undefined}
                onClick={() => isEditable && onEdit?.('title', title)}
                dangerouslySetInnerHTML={{ __html: title }}
            />
        </div>
    );
};

export default IntroStep01_Title;
