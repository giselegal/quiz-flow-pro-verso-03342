/**
 * 📝 DESCRIÇÃO DA INTRODUÇÃO
 * 
 * Componente para o texto descritivo da etapa de introdução.
 * 
 * @security FASE 2 - V4.1-SaaS
 * - Usa <RichText> component para renderização segura
 * - Substitui dangerouslySetInnerHTML + sanitizeHtml
 */

import React from 'react';
import { RichText } from '@/components/shared/RichText';

interface IntroDescriptionProps {
    text?: string;
    highlightColor?: string;
    secondaryColor?: string;
    isEditable?: boolean;
    onEdit?: (value: string) => void;
}

const IntroDescription: React.FC<IntroDescriptionProps> = ({
    text,
    highlightColor = '#B89B7A',
    secondaryColor = '#432818',
    isEditable = false,
    onEdit = () => { },
}) => {
    // Texto padrão caso não seja fornecido
    const defaultText = (
        <>
            Em poucos minutos, descubra seu{' '}
            <span className="font-semibold" style={{ color: highlightColor }}>
                Estilo Predominante
            </span>{' '}
            — e aprenda a montar looks que realmente refletem sua{' '}
            <span className="font-semibold" style={{ color: secondaryColor }}>
                essência
            </span>, com
            praticidade e{' '}
            <span className="font-semibold" style={{ color: secondaryColor }}>
                confiança
            </span>.
        </>
    );

    return (
        <p className="text-sm text-center leading-relaxed px-2 sm:text-base text-gray-600">
            {text ? (
                <RichText
                    content={text}
                    as="span"
                    allowLegacyHTML={true}
                />
            ) : (
                defaultText
            )}
        </p>
    );
};

export default IntroDescription;
