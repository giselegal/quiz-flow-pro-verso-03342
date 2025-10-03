/**
 * 🖼️ IMAGEM PRINCIPAL DA INTRODUÇÃO
 * 
 * Componente independente para renderizar a imagem principal
 * da etapa de introdução de forma responsiva.
 */

import React from 'react';

interface IntroImageProps {
    src?: string;
    alt?: string;
    maxWidth?: number;
    maxHeight?: number;
    aspectRatio?: number;
    isEditable?: boolean;
    onEdit?: (field: string, value: string) => void;
}

const IntroImage: React.FC<IntroImageProps> = ({
    src = 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
    alt = 'Descubra seu estilo predominante',
    maxWidth = 300,
    maxHeight = 204,
    aspectRatio = 1.47,
    isEditable = false,
    onEdit = () => { }
}) => {
    return (
        <div className="mt-2 w-full mx-auto flex justify-center">
            <div
                className="overflow-hidden rounded-lg shadow-sm"
                style={{
                    aspectRatio: aspectRatio.toString(),
                    maxHeight: `${maxHeight}px`,
                    width: '100%',
                    maxWidth: `${maxWidth}px`
                }}
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-contain"
                    width={maxWidth}
                    height={maxHeight}
                    style={{
                        maxWidth: `${maxWidth}px`,
                        maxHeight: `${maxHeight}px`,
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain'
                    }}
                />
            </div>
        </div>
    );
};

export default IntroImage;
