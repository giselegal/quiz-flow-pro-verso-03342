/**
 * 🎯 COMPONENTE RENDERIZADOR MODULAR
 * 
 * Renderiza diferentes tipos de componentes dentro dos steps
 */

import React from 'react';
import { StepComponent } from '@/types/ComponentTypes';
import { cn } from '@/lib/utils';
import { EditableField } from '@/components/quiz/editable/EditableField';

interface ModularComponentRendererProps {
    component: StepComponent;
    isEditable?: boolean;
    onUpdate?: (id: string, updates: Partial<StepComponent>) => void;
}

const ModularComponentRenderer: React.FC<ModularComponentRendererProps> = ({
    component,
    isEditable = false,
    onUpdate = () => { }
}) => {
    const handleUpdate = (field: string, value: any) => {
        onUpdate(component.id, { [field]: value });
    };

    switch (component.type) {
        case 'header':
            const headerComp = component as any;
            return (
                <div className={cn(
                    'mb-4',
                    headerComp.alignment === 'center' && 'text-center',
                    headerComp.alignment === 'right' && 'text-right'
                )}>
                    <EditableField
                        value={headerComp.title}
                        onChange={(value) => handleUpdate('title', value)}
                        isEditable={isEditable}
                        className={cn(
                            'font-bold',
                            headerComp.size === 'small' && 'text-lg',
                            headerComp.size === 'medium' && 'text-2xl',
                            headerComp.size === 'large' && 'text-4xl'
                        )}
                        placeholder="Título do cabeçalho..."
                    />
                    {headerComp.subtitle && (
                        <EditableField
                            value={headerComp.subtitle}
                            onChange={(value) => handleUpdate('subtitle', value)}
                            isEditable={isEditable}
                            className="text-gray-600 mt-2"
                            placeholder="Subtítulo..."
                        />
                    )}
                </div>
            );

        case 'text':
            const textComp = component as any;
            return (
                <div className={cn(
                    'mb-4',
                    textComp.alignment === 'center' && 'text-center',
                    textComp.alignment === 'right' && 'text-right'
                )}>
                    <EditableField
                        value={textComp.content}
                        onChange={(value) => handleUpdate('content', value)}
                        isEditable={isEditable}
                        multiline={true}
                        className={cn(
                            textComp.size === 'small' && 'text-sm',
                            textComp.size === 'medium' && 'text-base',
                            textComp.size === 'large' && 'text-lg'
                        )}
                        placeholder="Conteúdo do texto..."
                    />
                </div>
            );

        case 'image':
            const imageComp = component as any;
            return (
                <div className={cn(
                    'mb-4',
                    imageComp.alignment === 'center' && 'flex justify-center',
                    imageComp.alignment === 'right' && 'flex justify-end'
                )}>
                    <div className="relative group">
                        <img
                            src={imageComp.src}
                            alt={imageComp.alt}
                            className="rounded-lg shadow-md"
                            style={{
                                width: imageComp.width ? `${imageComp.width}px` : 'auto',
                                height: imageComp.height ? `${imageComp.height}px` : 'auto',
                                maxWidth: '100%'
                            }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
                            }}
                        />
                        {isEditable && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                <button
                                    onClick={() => {
                                        const newSrc = prompt('URL da nova imagem:', imageComp.src);
                                        if (newSrc) handleUpdate('src', newSrc);
                                    }}
                                    className="text-white text-sm px-3 py-1 bg-blue-500 rounded hover:bg-blue-600"
                                >
                                    Alterar Imagem
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'button':
            const buttonComp = component as any;
            return (
                <div className="mb-4 flex justify-center">
                    <EditableField
                        value={buttonComp.text}
                        onChange={(value) => handleUpdate('text', value)}
                        isEditable={isEditable}
                        className={cn(
                            'px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer',
                            buttonComp.style === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
                            buttonComp.style === 'secondary' && 'bg-gray-500 text-white hover:bg-gray-600',
                            buttonComp.style === 'outline' && 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50'
                        )}
                        placeholder="Texto do botão..."
                    />
                </div>
            );

        case 'spacer':
            const spacerComp = component as any;
            return (
                <div
                    className="mb-4"
                    style={{ height: `${spacerComp.height}px` }}
                >
                    {isEditable && (
                        <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded text-gray-500 text-sm">
                            Espaçador ({spacerComp.height}px)
                        </div>
                    )}
                </div>
            );

        case 'question':
            const questionComp = component as any;
            return (
                <div className="mb-6">
                    <EditableField
                        value={questionComp.questionText}
                        onChange={(value) => handleUpdate('questionText', value)}
                        isEditable={isEditable}
                        className="text-xl font-bold text-center mb-4"
                        placeholder="Texto da pergunta..."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {questionComp.options?.map((option: any, index: number) => (
                            <div
                                key={option.id}
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors"
                            >
                                <EditableField
                                    value={option.text}
                                    onChange={(value) => {
                                        const newOptions = [...questionComp.options];
                                        newOptions[index] = { ...option, text: value };
                                        handleUpdate('options', newOptions);
                                    }}
                                    isEditable={isEditable}
                                    className="font-medium"
                                    placeholder="Texto da opção..."
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'input':
            const inputComp = component as any;
            return (
                <div className="mb-4">
                    <EditableField
                        value={inputComp.label}
                        onChange={(value) => handleUpdate('label', value)}
                        isEditable={isEditable}
                        className="block text-sm font-medium text-gray-700 mb-2"
                        placeholder="Rótulo do campo..."
                    />
                    <input
                        type={inputComp.inputType}
                        placeholder={inputComp.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={inputComp.required}
                    />
                </div>
            );

        default:
            return (
                <div className="mb-4 p-4 border-2 border-dashed border-red-300 rounded-lg text-red-500 text-center">
                    Componente desconhecido: {component.type}
                </div>
            );
    }
};

export default ModularComponentRenderer;