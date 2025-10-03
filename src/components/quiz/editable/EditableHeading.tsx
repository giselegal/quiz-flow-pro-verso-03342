import React from 'react';
import { ChevronDown } from 'lucide-react';
import { EditableField } from './EditableField';

interface EditableHeadingProps {
    content?: string;
    alignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    componentId?: string;
    maxWidth?: number; // 10-100
    generalAlignment?: 'start' | 'center' | 'end';
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

/**
 * 🎯 HEADING EDITÁVEL AVANÇADO
 * 
 * Componente que replica o EditableHeading do modelo:
 * - Conteúdo editável
 * - Alinhamento configurável
 * - Cores personalizáveis
 * - Tamanho responsivo
 * - ID personalizado
 */
export default function EditableHeading({
    content = 'Digite seu título aqui...',
    alignment = 'center',
    backgroundColor = '#ffffff',
    textColor = '#000000',
    borderColor = '#000000',
    componentId = '',
    maxWidth = 100,
    generalAlignment = 'start',
    headingLevel = 1,
    isEditable = false,
    onEdit = () => { }
}: EditableHeadingProps) {

    // Mapear alinhamento para classes Tailwind
    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    const generalAlignmentClasses = {
        start: 'self-start',
        center: 'self-center',
        end: 'self-end'
    };

    // Mapear nível do heading para classes de tamanho
    const headingSizeClasses = {
        1: 'text-3xl font-bold',
        2: 'text-2xl font-semibold',
        3: 'text-xl font-semibold',
        4: 'text-lg font-medium',
        5: 'text-base font-medium',
        6: 'text-sm font-medium'
    };

    const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;

    const headingStyle = {
        backgroundColor: backgroundColor !== '#ffffff' ? backgroundColor : undefined,
        color: textColor !== '#000000' ? textColor : undefined,
        borderColor: borderColor !== '#000000' ? borderColor : undefined,
        maxWidth: maxWidth < 100 ? `${maxWidth}%` : undefined,
    };

    return (
        <div className={`min-h-[1.25rem] min-w-full relative ${generalAlignmentClasses[generalAlignment]} box-border`}>
            {/* Heading Principal */}
            <HeadingTag
                className={`min-w-full ${headingSizeClasses[headingLevel]} ${alignmentClasses[alignment]}`}
                style={headingStyle}
                id={componentId || undefined}
            >
                {content}
            </HeadingTag>

            {/* Indicador de Modo Edição */}
            {isEditable && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 bg-blue-50 py-1 px-3 rounded border border-blue-200">
                    💡 Título H{headingLevel} editável
                </div>
            )}
        </div>
    );
}