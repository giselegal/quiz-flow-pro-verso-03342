/**
 * 🎯 RENDERIZADOR UNIVERSAL DE COMPONENTES REAIS
 * 
 * Renderiza qualquer componente das 21 etapas em modo editável
 */

import React from 'react';
import { RealComponentProps, RealComponentType } from './types';
import { QuizIntroHeaderEditor } from './QuizIntroHeaderEditor';
import { OptionsGridEditor } from './OptionsGridEditor';
import { FormContainerEditor } from './FormContainerEditor';
import { TextEditor } from './TextEditor';
import { cn } from '@/lib/utils';

interface RealComponentRendererProps extends RealComponentProps {
    type: RealComponentType;
}

export const RealComponentRenderer: React.FC<RealComponentRendererProps> = (props) => {
    const { type, ...componentProps } = props;

    // 🎯 Renderizar componente específico baseado no tipo
    switch (type) {
        case 'quiz-intro-header':
            return <QuizIntroHeaderEditor {...componentProps} type={type} />;

        case 'options-grid':
            return <OptionsGridEditor {...componentProps} type={type} />;

        case 'form-container':
            return <FormContainerEditor {...componentProps} type={type} />;

        case 'text':
        case 'text-inline':
            return <TextEditor {...componentProps} type={type} />;

        // 🚧 Componentes básicos (implementação simples)
        case 'image':
            return <BasicImageEditor {...componentProps} type={type} />;

        case 'button-inline':
        case 'button':
            return <BasicButtonEditor {...componentProps} type={type} />;

        case 'decorative-bar':
            return <BasicDecorativeBarEditor {...componentProps} type={type} />;

        // 🔜 Componentes avançados (placeholder até implementação completa)
        case 'result-header-inline':
        case 'urgency-timer-inline':
        case 'mentor-section-inline':
        case 'style-card-inline':
        case 'testimonials':
        case 'benefits':
        case 'value-anchoring':
        case 'guarantee':
        case 'secure-purchase':
        case 'bonus':
        case 'before-after-inline':
        case 'secondary-styles':
        case 'quiz-offer-cta-inline':
        case 'fashion-ai-generator':
        case 'connected-template-wrapper':
        case 'conversion':
        case 'legal-notice':
        case 'form-input':
            return <PlaceholderEditor {...componentProps} type={type} />;

        default:
            return <UnknownComponentEditor {...componentProps} type={type} />;
    }
};

// 🖼️ Editor básico para imagens
const BasicImageEditor: React.FC<RealComponentProps> = ({ content, properties, isSelected, onSelect }) => {
    return (
        <div
            className={cn(
                'relative rounded-lg overflow-hidden cursor-pointer',
                'border-2 border-transparent transition-all duration-200',
                isSelected && 'border-blue-500 shadow-lg'
            )}
            onClick={onSelect}
        >
            {isSelected && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded z-10">
                    Image
                </div>
            )}
            <img
                src={content.src || content.imageUrl}
                alt={content.alt || 'Imagem'}
                className="w-full h-auto"
                style={{
                    maxWidth: properties.maxWidth || 'none',
                    borderRadius: properties.borderRadius || '8px'
                }}
            />
        </div>
    );
};

// 🔘 Editor básico para botões
const BasicButtonEditor: React.FC<RealComponentProps> = ({ content, properties, isSelected, onSelect }) => {
    return (
        <div
            className={cn(
                'relative cursor-pointer transition-all duration-200',
                isSelected && 'outline outline-2 outline-blue-500 outline-offset-2'
            )}
            onClick={onSelect}
        >
            {isSelected && (
                <div className="absolute -top-6 left-0 bg-indigo-500 text-white text-xs px-2 py-1 rounded">
                    Button
                </div>
            )}
            <button
                className={cn(
                    'px-6 py-3 rounded-lg font-medium transition-colors',
                    properties.variant === 'outline' ? 'border-2 bg-transparent' : 'text-white'
                )}
                style={{
                    backgroundColor: properties.backgroundColor || '#3B82F6',
                    color: properties.textColor || '#FFFFFF',
                    borderColor: properties.borderColor || properties.backgroundColor || '#3B82F6',
                    borderRadius: properties.borderRadius || '8px'
                }}
            >
                {content.text || content.label || 'Clique aqui'}
            </button>
        </div>
    );
};

// 📏 Editor para barra decorativa
const BasicDecorativeBarEditor: React.FC<RealComponentProps> = ({ properties, isSelected, onSelect }) => {
    return (
        <div
            className={cn(
                'relative cursor-pointer transition-all duration-200',
                isSelected && 'outline outline-2 outline-blue-500 outline-offset-2'
            )}
            onClick={onSelect}
        >
            {isSelected && (
                <div className="absolute -top-6 left-0 bg-gray-500 text-white text-xs px-2 py-1 rounded">
                    Decorative Bar
                </div>
            )}
            <div
                className="w-full"
                style={{
                    height: properties.height || '4px',
                    backgroundColor: properties.backgroundColor || '#E5E7EB',
                    borderRadius: properties.borderRadius || '2px',
                    margin: `${properties.marginTop || 16}px 0 ${properties.marginBottom || 16}px 0`
                }}
            />
        </div>
    );
};

// 📦 Editor placeholder para componentes ainda não implementados
const PlaceholderEditor: React.FC<RealComponentProps & { type: string }> = ({ type, isSelected, onSelect }) => {
    return (
        <div
            className={cn(
                'relative p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer',
                'bg-gray-50 text-center transition-all duration-200',
                isSelected && 'border-yellow-500 bg-yellow-50'
            )}
            onClick={onSelect}
        >
            {isSelected && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    {type} (Em desenvolvimento)
                </div>
            )}
            <div className="text-gray-600">
                <div className="text-lg font-medium mb-2">📦 {type}</div>
                <div className="text-sm">Componente em desenvolvimento</div>
            </div>
        </div>
    );
};

// ❓ Editor para componentes desconhecidos
const UnknownComponentEditor: React.FC<RealComponentProps & { type: string }> = ({ type, isSelected, onSelect }) => {
    return (
        <div
            className={cn(
                'relative p-4 border-2 border-dashed border-red-300 rounded-lg cursor-pointer',
                'bg-red-50 text-center transition-all duration-200',
                isSelected && 'border-red-500'
            )}
            onClick={onSelect}
        >
            {isSelected && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Unknown: {type}
                </div>
            )}
            <div className="text-red-600">
                <div className="text-lg font-medium mb-2">⚠️ Tipo desconhecido</div>
                <div className="text-sm">Tipo: {type}</div>
            </div>
        </div>
    );
};