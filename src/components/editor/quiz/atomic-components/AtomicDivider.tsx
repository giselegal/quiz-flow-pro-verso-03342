import React from 'react';
import { SimpleAtomicWrapper } from './SimpleAtomicWrapper';
import type { AtomicDivider as AtomicDividerType } from '../../atomic-components/types';

interface AtomicDividerProps {
    component: AtomicDividerType;
    onUpdate: (updates: Partial<AtomicDividerType>) => void;
    onDelete: () => void;
    onInsertBefore: (componentType: string) => void;
    onInsertAfter: (componentType: string) => void;
    isEditable?: boolean;
}

export const AtomicDivider: React.FC<AtomicDividerProps> = ({
    component,
    onUpdate,
    onDelete,
    onInsertBefore,
    onInsertAfter,
    isEditable = true
}) => {
    const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ style: e.target.value as 'solid' | 'dashed' | 'dotted' | 'double' });
    };

    const handleThicknessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ thickness: e.target.value as 'thin' | 'normal' | 'thick' });
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ color: e.target.value as 'gray' | 'blue' | 'purple' | 'green' | 'red' | 'yellow' });
    };

    const handleMarginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ margin: e.target.value as 'none' | 'sm' | 'md' | 'lg' });
    };

    const getStyleClass = () => {
        const baseClass = 'w-full';
        const style = component.style || 'solid';
        const thickness = component.thickness || 'normal';
        const color = component.color || 'gray';

        let thicknessClass = '';
        switch (thickness) {
            case 'thin': thicknessClass = 'border-t'; break;
            case 'normal': thicknessClass = 'border-t-2'; break;
            case 'thick': thicknessClass = 'border-t-4'; break;
        }

        let colorClass = '';
        switch (color) {
            case 'gray': colorClass = 'border-gray-300'; break;
            case 'blue': colorClass = 'border-blue-300'; break;
            case 'purple': colorClass = 'border-purple-300'; break;
            case 'green': colorClass = 'border-green-300'; break;
            case 'red': colorClass = 'border-red-300'; break;
            case 'yellow': colorClass = 'border-yellow-300'; break;
        }

        let styleClass = '';
        switch (style) {
            case 'solid': styleClass = 'border-solid'; break;
            case 'dashed': styleClass = 'border-dashed'; break;
            case 'dotted': styleClass = 'border-dotted'; break;
            case 'double': styleClass = 'border-double'; break;
        }

        return `${baseClass} ${thicknessClass} ${colorClass} ${styleClass}`;
    };

    const getMarginClass = () => {
        switch (component.margin) {
            case 'none': return 'my-0';
            case 'sm': return 'my-2';
            case 'md': return 'my-4';
            case 'lg': return 'my-8';
            default: return 'my-4';
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
                                    Estilo
                                </label>
                                <select
                                    value={component.style || 'solid'}
                                    onChange={handleStyleChange}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="solid">Sólida</option>
                                    <option value="dashed">Tracejada</option>
                                    <option value="dotted">Pontilhada</option>
                                    <option value="double">Dupla</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Espessura
                                </label>
                                <select
                                    value={component.thickness || 'normal'}
                                    onChange={handleThicknessChange}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="thin">Fina</option>
                                    <option value="normal">Normal</option>
                                    <option value="thick">Grossa</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Cor
                                </label>
                                <select
                                    value={component.color || 'gray'}
                                    onChange={handleColorChange}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="gray">Cinza</option>
                                    <option value="blue">Azul</option>
                                    <option value="purple">Roxo</option>
                                    <option value="green">Verde</option>
                                    <option value="red">Vermelho</option>
                                    <option value="yellow">Amarelo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Margem
                                </label>
                                <select
                                    value={component.margin || 'md'}
                                    onChange={handleMarginChange}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="none">Nenhuma</option>
                                    <option value="sm">Pequena</option>
                                    <option value="md">Média</option>
                                    <option value="lg">Grande</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview do divisor */}
                <div className={getMarginClass()}>
                    <div className={getStyleClass()}></div>
                </div>
            </div>
        </SimpleAtomicWrapper>
    );
};