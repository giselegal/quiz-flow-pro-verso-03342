/**
 * 🎯 COMPONENTE EDITÁVEL: TEXT
 * 
 * Componente específico para editar textos das etapas reais
 */

import React, { useState } from 'react';
import { RealComponentProps } from './types';
import { cn } from '@/lib/utils';
import { Edit3, Settings, Type, Bold, Italic } from 'lucide-react';

interface TextEditorProps extends RealComponentProps {
    content: { text: string };
}

export const TextEditor: React.FC<TextEditorProps> = ({
    id,
    content,
    properties,
    isEditing = false,
    isSelected = false,
    onUpdate,
    onSelect
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleContentUpdate = (newText: string) => {
        onUpdate?.({
            content: { ...content, text: newText }
        });
    };

    const getTextSize = () => {
        const fontSize = properties.fontSize || 'text-base';
        if (fontSize.includes('text-3xl') || fontSize.includes('text-4xl')) return 'text-3xl md:text-4xl';
        if (fontSize.includes('text-2xl')) return 'text-2xl';
        if (fontSize.includes('text-xl')) return 'text-xl';
        if (fontSize.includes('text-lg')) return 'text-lg';
        return 'text-base';
    };

    const getTextWeight = () => {
        return properties.fontWeight || 'font-normal';
    };

    const getTextAlign = () => {
        return properties.textAlign || 'left';
    };

    return (
        <div
            className={cn(
                'relative transition-all duration-200 rounded-lg p-4',
                'border-2 border-transparent',
                isSelected && 'border-blue-500 shadow-lg',
                isHovered && 'border-gray-300 shadow-md',
                'cursor-pointer'
            )}
            style={{
                marginTop: properties.marginTop || 0,
                marginBottom: properties.marginBottom || 0,
                maxWidth: properties.maxWidth || 'none'
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
                    Text Block
                </div>
            )}

            {/* 📝 Texto editável */}
            <div
                className={cn(
                    getTextSize(),
                    getTextWeight(),
                    properties.lineHeight || 'leading-normal'
                )}
                style={{
                    color: properties.color || '#000000',
                    textAlign: getTextAlign(),
                    fontFamily: properties.fontFamily || 'inherit'
                }}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleContentUpdate(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: content.text }}
            />

            {/* 🎨 Barra de ferramentas de formatação (quando selecionado) */}
            {isSelected && (
                <div className="mt-4 p-2 bg-gray-50 rounded border flex gap-2 items-center">
                    <div className="flex gap-1">
                        <button
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Negrito"
                        >
                            <Bold size={16} />
                        </button>
                        <button
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Itálico"
                        >
                            <Italic size={16} />
                        </button>
                    </div>

                    <div className="border-l pl-2 ml-2">
                        <select
                            value={getTextSize()}
                            onChange={(e) => onUpdate?.({ properties: { ...properties, fontSize: e.target.value } })}
                            className="px-2 py-1 border rounded text-sm"
                        >
                            <option value="text-sm">Pequeno</option>
                            <option value="text-base">Normal</option>
                            <option value="text-lg">Grande</option>
                            <option value="text-xl">Extra Grande</option>
                            <option value="text-2xl">Título H2</option>
                            <option value="text-3xl md:text-4xl">Título H1</option>
                        </select>
                    </div>

                    <div className="border-l pl-2 ml-2">
                        <select
                            value={getTextAlign()}
                            onChange={(e) => onUpdate?.({ properties: { ...properties, textAlign: e.target.value } })}
                            className="px-2 py-1 border rounded text-sm"
                        >
                            <option value="left">Esquerda</option>
                            <option value="center">Centro</option>
                            <option value="right">Direita</option>
                            <option value="justify">Justificado</option>
                        </select>
                    </div>

                    <div className="border-l pl-2 ml-2">
                        <input
                            type="color"
                            value={properties.color || '#000000'}
                            onChange={(e) => onUpdate?.({ properties: { ...properties, color: e.target.value } })}
                            className="w-8 h-6 border rounded cursor-pointer"
                            title="Cor do texto"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};