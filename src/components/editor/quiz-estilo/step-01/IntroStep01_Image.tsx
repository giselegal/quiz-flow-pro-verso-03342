/**
 * 🖼️ INTRO STEP 01 - IMAGE
 * 
 * Componente separado da imagem principal para a etapa 1
 * Suporta diferentes aspect ratios e tamanhos
 */

import React from 'react';

export interface IntroStep01ImageProps {
    imageUrl?: string;
    imageAlt?: string;
    maxWidth?: number;
    maxHeight?: number;
    aspectRatio?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    showShadow?: boolean;
    borderRadius?: string;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

export const IntroStep01_Image: React.FC<IntroStep01ImageProps> = ({
    imageUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.png',
    imageAlt = 'Descubra seu estilo predominante',
    maxWidth = 300,
    maxHeight = 204,
    aspectRatio = '1.47',
    objectFit = 'contain',
    showShadow = true,
    borderRadius = 'rounded-lg',
    isEditable = false,
    onEdit
}) => {
    return (
        <div className="mt-2 w-full mx-auto flex justify-center">
            <div
                className={`overflow-hidden ${borderRadius} ${showShadow ? 'shadow-sm' : ''}`}
                style={{
                    aspectRatio,
                    maxHeight: `${maxHeight}px`,
                    width: '100%',
                    maxWidth: `${maxWidth}px`,
                    cursor: isEditable ? 'pointer' : 'default'
                }}
                data-editable={isEditable ? 'imageUrl' : undefined}
                onClick={() => isEditable && onEdit?.('imageUrl', imageUrl)}
            >
                <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-full"
                    width={maxWidth}
                    height={maxHeight}
                    style={{
                        maxWidth: `${maxWidth}px`,
                        maxHeight: `${maxHeight}px`,
                        width: '100%',
                        height: 'auto',
                        objectFit
                    }}
                    loading="lazy"
                />
            </div>
        </div>
    );
};

export default IntroStep01_Image;
