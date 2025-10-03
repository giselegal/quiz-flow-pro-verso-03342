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
                    'mb-4 border border-dashed border-gray-200 p-3 rounded-lg',
                    isEditable && 'bg-blue-50',
                    headerComp.alignment === 'center' && 'text-center',
                    headerComp.alignment === 'right' && 'text-right'
                )}>
                    {/* Controles de Edição */}
                    {isEditable && (
                        <div className="mb-3 flex gap-2 items-center text-xs bg-white p-2 rounded border">
                            <select
                                value={headerComp.size || 'medium'}
                                onChange={(e) => handleUpdate('size', e.target.value)}
                                className="border rounded px-1 py-0.5"
                            >
                                <option value="small">Pequeno</option>
                                <option value="medium">Médio</option>
                                <option value="large">Grande</option>
                            </select>
                            <select
                                value={headerComp.alignment || 'left'}
                                onChange={(e) => handleUpdate('alignment', e.target.value)}
                                className="border rounded px-1 py-0.5"
                            >
                                <option value="left">Esquerda</option>
                                <option value="center">Centro</option>
                                <option value="right">Direita</option>
                            </select>
                            <button
                                onClick={() => handleUpdate('subtitle', headerComp.subtitle ? '' : 'Subtítulo')}
                                className="px-2 py-0.5 bg-blue-500 text-white rounded text-xs"
                            >
                                {headerComp.subtitle ? 'Remover' : 'Adicionar'} Subtítulo
                            </button>
                        </div>
                    )}

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
                    'mb-4 border border-dashed border-gray-200 p-3 rounded-lg',
                    isEditable && 'bg-green-50',
                    textComp.alignment === 'center' && 'text-center',
                    textComp.alignment === 'right' && 'text-right'
                )}>
                    {/* Controles de Edição */}
                    {isEditable && (
                        <div className="mb-3 flex gap-2 items-center text-xs bg-white p-2 rounded border">
                            <select
                                value={textComp.size || 'medium'}
                                onChange={(e) => handleUpdate('size', e.target.value)}
                                className="border rounded px-1 py-0.5"
                            >
                                <option value="small">Pequeno</option>
                                <option value="medium">Médio</option>
                                <option value="large">Grande</option>
                            </select>
                            <select
                                value={textComp.alignment || 'left'}
                                onChange={(e) => handleUpdate('alignment', e.target.value)}
                                className="border rounded px-1 py-0.5"
                            >
                                <option value="left">Esquerda</option>
                                <option value="center">Centro</option>
                                <option value="right">Direita</option>
                            </select>
                        </div>
                    )}

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
                    'mb-4 border border-dashed border-gray-200 p-3 rounded-lg',
                    isEditable && 'bg-purple-50',
                    imageComp.alignment === 'center' && 'flex justify-center',
                    imageComp.alignment === 'right' && 'flex justify-end'
                )}>
                    {/* Controles de Edição */}
                    {isEditable && (
                        <div className="mb-3 grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded border">
                            <input
                                placeholder="URL da imagem"
                                value={imageComp.src || ''}
                                onChange={(e) => handleUpdate('src', e.target.value)}
                                className="border rounded px-1 py-0.5 col-span-2"
                            />
                            <input
                                placeholder="Texto alternativo"
                                value={imageComp.alt || ''}
                                onChange={(e) => handleUpdate('alt', e.target.value)}
                                className="border rounded px-1 py-0.5 col-span-2"
                            />
                            <input
                                placeholder="Largura (px)"
                                type="number"
                                value={imageComp.width || ''}
                                onChange={(e) => handleUpdate('width', parseInt(e.target.value) || undefined)}
                                className="border rounded px-1 py-0.5"
                            />
                            <input
                                placeholder="Altura (px)"
                                type="number"
                                value={imageComp.height || ''}
                                onChange={(e) => handleUpdate('height', parseInt(e.target.value) || undefined)}
                                className="border rounded px-1 py-0.5"
                            />
                            <select
                                value={imageComp.alignment || 'left'}
                                onChange={(e) => handleUpdate('alignment', e.target.value)}
                                className="border rounded px-1 py-0.5 col-span-2"
                            >
                                <option value="left">Esquerda</option>
                                <option value="center">Centro</option>
                                <option value="right">Direita</option>
                            </select>
                        </div>
                    )}

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
                            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                🖼️ Imagem
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'button':
            const buttonComp = component as any;
            return (
                <div className={cn(
                    'mb-4 border border-dashed border-gray-200 p-3 rounded-lg',
                    isEditable && 'bg-orange-50'
                )}>
                    {/* Controles de Edição */}
                    {isEditable && (
                        <div className="mb-3 flex gap-2 items-center text-xs bg-white p-2 rounded border">
                            <select
                                value={buttonComp.style || 'primary'}
                                onChange={(e) => handleUpdate('style', e.target.value)}
                                className="border rounded px-1 py-0.5"
                            >
                                <option value="primary">Primário</option>
                                <option value="secondary">Secundário</option>
                                <option value="outline">Contorno</option>
                            </select>
                            <select
                                value={buttonComp.action || 'next'}
                                onChange={(e) => handleUpdate('action', e.target.value)}
                                className="border rounded px-1 py-0.5"
                            >
                                <option value="next">Próximo</option>
                                <option value="submit">Enviar</option>
                                <option value="custom">Personalizado</option>
                            </select>
                            {buttonComp.action === 'custom' && (
                                <input
                                    placeholder="Ação personalizada"
                                    value={buttonComp.customAction || ''}
                                    onChange={(e) => handleUpdate('customAction', e.target.value)}
                                    className="border rounded px-1 py-0.5"
                                />
                            )}
                        </div>
                    )}

                    <div className="flex justify-center">
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
                </div>
            );

        case 'spacer':
            const spacerComp = component as any;
            return (
                <div className={cn(
                    'mb-4 border border-dashed border-gray-200 p-3 rounded-lg',
                    isEditable && 'bg-gray-50'
                )}>
                    {/* Controles de Edição */}
                    {isEditable && (
                        <div className="mb-3 flex gap-2 items-center text-xs bg-white p-2 rounded border">
                            <label>Altura:</label>
                            <input
                                type="number"
                                min="8"
                                max="200"
                                value={spacerComp.height || 32}
                                onChange={(e) => handleUpdate('height', parseInt(e.target.value) || 32)}
                                className="border rounded px-1 py-0.5 w-16"
                            />
                            <span>px</span>
                        </div>
                    )}

                    <div
                        className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded text-gray-500 text-sm"
                        style={{ height: `${spacerComp.height || 32}px` }}
                    >
                        📏 Espaçador ({spacerComp.height || 32}px)
                    </div>
                </div>
            );

        case 'question':
            const questionComp = component as any;
            return (
                <div className={cn(
                    'mb-6 border border-dashed border-gray-200 p-3 rounded-lg',
                    isEditable && 'bg-red-50'
                )}>
                    {/* Controles de Edição */}
                    {isEditable && (
                        <div className="mb-3 flex gap-2 items-center text-xs bg-white p-2 rounded border">
                            <label>Seleções obrigatórias:</label>
                            <input
                                type="number"
                                min="1"
                                max={questionComp.options?.length || 1}
                                value={questionComp.requiredSelections || 1}
                                onChange={(e) => handleUpdate('requiredSelections', parseInt(e.target.value) || 1)}
                                className="border rounded px-1 py-0.5 w-16"
                            />
                            <label className="flex items-center gap-1 ml-2">
                                <input
                                    type="checkbox"
                                    checked={questionComp.multipleChoice || false}
                                    onChange={(e) => handleUpdate('multipleChoice', e.target.checked)}
                                />
                                Múltipla escolha
                            </label>
                            <button
                                onClick={() => {
                                    const newOptions = [...(questionComp.options || []), {
                                        id: `opt-${Date.now()}`,
                                        text: 'Nova opção'
                                    }];
                                    handleUpdate('options', newOptions);
                                }}
                                className="px-2 py-0.5 bg-green-500 text-white rounded text-xs ml-2"
                            >
                                + Opção
                            </button>
                        </div>
                    )}

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
                                className="relative p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors group"
                            >
                                {isEditable && questionComp.options.length > 2 && (
                                    <button
                                        onClick={() => {
                                            const newOptions = questionComp.options.filter((_: any, i: number) => i !== index);
                                            handleUpdate('options', newOptions);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                )}
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
                <div className={cn(
                    'mb-4 border border-dashed border-gray-200 p-3 rounded-lg',
                    isEditable && 'bg-yellow-50'
                )}>
                    {/* Controles de Edição */}
                    {isEditable && (
                        <div className="mb-3 grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded border">
                            <select
                                value={inputComp.inputType || 'text'}
                                onChange={(e) => handleUpdate('inputType', e.target.value)}
                                className="border rounded px-1 py-0.5"
                            >
                                <option value="text">Texto</option>
                                <option value="email">Email</option>
                                <option value="tel">Telefone</option>
                                <option value="number">Número</option>
                            </select>
                            <label className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={inputComp.required || false}
                                    onChange={(e) => handleUpdate('required', e.target.checked)}
                                />
                                Obrigatório
                            </label>
                            <input
                                placeholder="Placeholder do campo"
                                value={inputComp.placeholder || ''}
                                onChange={(e) => handleUpdate('placeholder', e.target.value)}
                                className="border rounded px-1 py-0.5 col-span-2"
                            />
                        </div>
                    )}

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
                    Componente desconhecido: {(component as any).type}
                </div>
            );
    }
};

export default ModularComponentRenderer;