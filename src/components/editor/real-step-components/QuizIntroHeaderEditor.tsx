/**
 * 🎯 COMPONENTE EDITÁVEL: QUIZ INTRO HEADER
 * 
 * Componente específico para editar cabeçalhos de quiz das etapas reais
 */

import React, { useState } from 'react';
import { RealComponentProps, QuizIntroHeaderContent } from './types';
import { cn } from '@/lib/utils';
import { Edit3, Image, Settings } from 'lucide-react';

interface QuizIntroHeaderEditorProps extends RealComponentProps {
    content: QuizIntroHeaderContent;
}

export const QuizIntroHeaderEditor: React.FC<QuizIntroHeaderEditorProps> = ({
    id,
    content,
    properties,
    isEditing = false,
    isSelected = false,
    onUpdate,
    onSelect
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleContentUpdate = (updates: Partial<QuizIntroHeaderContent>) => {
        onUpdate?.({
            content: { ...content, ...updates }
        });
    };

    const handlePropertyUpdate = (updates: Record<string, any>) => {
        onUpdate?.({
            properties: { ...properties, ...updates }
        });
    };

    return (
        <div
            className={cn(
                'relative transition-all duration-200 rounded-lg',
                'border-2 border-transparent',
                isSelected && 'border-blue-500 shadow-lg',
                isHovered && 'border-gray-300 shadow-md',
                'cursor-pointer'
            )}
            style={{
                backgroundColor: properties.backgroundColor || '#F8F9FA',
                padding: properties.padding || '24px',
                borderRadius: properties.borderRadius || '8px',
                marginBottom: properties.marginBottom || '16px',
                textAlign: properties.textAlign || 'center'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onSelect}
        >
            {/* 🎨 Overlay de edição */}
            {(isHovered || isSelected) && (
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                    <button
                        className="p-1 bg-white rounded shadow-md hover:bg-gray-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Ativar modo de edição inline
                        }}
                    >
                        <Edit3 size={14} className="text-gray-600" />
                    </button>
                    <button
                        className="p-1 bg-white rounded shadow-md hover:bg-gray-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Abrir painel de propriedades
                        }}
                    >
                        <Settings size={14} className="text-gray-600" />
                    </button>
                </div>
            )}

            {/* 🏷️ Label do tipo */}
            {isSelected && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Quiz Header
                </div>
            )}

            {/* 🖼️ Logo */}
            {content.showLogo && properties.logoUrl && (
                <div className="mb-4">
                    <img
                        src={properties.logoUrl}
                        alt={properties.logoAlt || 'Logo'}
                        className="mx-auto h-16 w-auto"
                    />
                </div>
            )}

            {/* 📝 Título */}
            {content.title && (
                <h1
                    className="text-2xl font-bold mb-2"
                    style={{ color: properties.titleColor || '#432818' }}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleContentUpdate({ title: e.currentTarget.textContent || '' })}
                >
                    {content.title}
                </h1>
            )}

            {/* 📝 Subtítulo */}
            {content.subtitle && (
                <h2
                    className="text-lg text-gray-600 mb-2"
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleContentUpdate({ subtitle: e.currentTarget.textContent || '' })}
                >
                    {content.subtitle}
                </h2>
            )}

            {/* 📝 Descrição */}
            {content.description && (
                <p
                    className="text-gray-700"
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleContentUpdate({ description: e.currentTarget.textContent || '' })}
                >
                    {content.description}
                </p>
            )}

            {/* 📊 Barra de progresso */}
            {content.showProgress && properties.enableProgressBar && (
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${(properties.progressValue || 0)}%`
                            }}
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Progresso: {properties.progressValue || 0}%
                    </p>
                </div>
            )}

            {/* 🔙 Botão voltar */}
            {content.showNavigation && properties.showBackButton && (
                <div className="mt-4">
                    <button className="text-blue-500 hover:text-blue-700 text-sm">
                        ← Voltar
                    </button>
                </div>
            )}
        </div>
    );
};