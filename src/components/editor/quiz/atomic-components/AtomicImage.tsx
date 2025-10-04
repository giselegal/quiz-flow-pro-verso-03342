import React from 'react';
import { SimpleAtomicWrapper } from './SimpleAtomicWrapper';
import type { AtomicImage as AtomicImageType } from '../../atomic-components/types';

interface AtomicImageProps {
    component: AtomicImageType;
    onUpdate: (updates: Partial<AtomicImageType>) => void;
    onDelete: () => void;
    onInsertBefore: (componentType: string) => void;
    onInsertAfter: (componentType: string) => void;
    isEditable?: boolean;
}

export const AtomicImage: React.FC<AtomicImageProps> = ({
    component,
    onUpdate,
    onDelete,
    onInsertBefore,
    onInsertAfter,
    isEditable = true
}) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                onUpdate({ src: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ src: e.target.value });
    };

    const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ alt: e.target.value });
    };

    const handleWidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ width: e.target.value as 'auto' | 'full' | '1/2' | '1/3' | '2/3' });
    };

    const handleAlignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ alignment: e.target.value as 'left' | 'center' | 'right' });
    };

    const getWidthClass = () => {
        switch (component.width) {
            case 'full': return 'w-full';
            case '1/2': return 'w-1/2';
            case '1/3': return 'w-1/3';
            case '2/3': return 'w-2/3';
            default: return 'w-auto';
        }
    };

    const getAlignmentClass = () => {
        switch (component.alignment) {
            case 'left': return 'justify-start';
            case 'right': return 'justify-end';
            case 'center':
            default: return 'justify-center';
        }
    };

    return (
        <SimpleAtomicWrapper
            component={component}
            onDelete={onDelete}
            onInsertBefore={onInsertBefore}
            onInsertAfter={onInsertAfter}
            isEditable={isEditable}
        >
            <div className="space-y-3">
                {/* Controles de edição */}
                {isEditable && (
                    <div className="space-y-2 p-3 bg-gray-50 rounded border">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Upload de imagem
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    URL da imagem
                                </label>
                                <input
                                    type="url"
                                    value={component.src || ''}
                                    onChange={handleUrlChange}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Texto alternativo
                                </label>
                                <input
                                    type="text"
                                    value={component.alt || ''}
                                    onChange={handleAltChange}
                                    placeholder="Descrição da imagem"
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Largura
                                </label>
                                <select
                                    value={component.width || 'auto'}
                                    onChange={handleWidthChange}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="auto">Automática</option>
                                    <option value="1/3">1/3</option>
                                    <option value="1/2">1/2</option>
                                    <option value="2/3">2/3</option>
                                    <option value="full">Completa</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Alinhamento
                                </label>
                                <select
                                    value={component.alignment || 'center'}
                                    onChange={handleAlignmentChange}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="left">Esquerda</option>
                                    <option value="center">Centro</option>
                                    <option value="right">Direita</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview da imagem */}
                <div className={`flex ${getAlignmentClass()}`}>
                    {component.src ? (
                        <img
                            src={component.src}
                            alt={component.alt || 'Imagem do quiz'}
                            className={`${getWidthClass()} max-h-96 object-contain rounded-lg shadow-sm border border-gray-200`}
                        />
                    ) : (
                        <div className={`${getWidthClass()} h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center`}>
                            <div className="text-center text-gray-500">
                                <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-xs">Nenhuma imagem selecionada</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SimpleAtomicWrapper>
    );
};