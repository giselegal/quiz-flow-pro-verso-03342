import React from 'react';
import { SimpleAtomicWrapper } from './SimpleAtomicWrapper';
import type { AtomicSpacer as AtomicSpacerType } from '../../atomic-components/types';

interface AtomicSpacerProps {
    component: AtomicSpacerType;
    onUpdate: (updates: Partial<AtomicSpacerType>) => void;
    onDelete: () => void;
    onInsertBefore: (componentType: string) => void;
    onInsertAfter: (componentType: string) => void;
    isEditable?: boolean;
}

export const AtomicSpacer: React.FC<AtomicSpacerProps> = ({
    component,
    onUpdate,
    onDelete,
    onInsertBefore,
    onInsertAfter,
    isEditable = true
}) => {
    const handleHeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ height: e.target.value as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' });
    };

    const getHeightClass = () => {
        switch (component.height) {
            case 'xs': return 'h-2';
            case 'sm': return 'h-4';
            case 'md': return 'h-8';
            case 'lg': return 'h-16';
            case 'xl': return 'h-24';
            case '2xl': return 'h-32';
            default: return 'h-8';
        }
    };

    const getHeightLabel = () => {
        switch (component.height) {
            case 'xs': return '8px';
            case 'sm': return '16px';
            case 'md': return '32px';
            case 'lg': return '64px';
            case 'xl': return '96px';
            case '2xl': return '128px';
            default: return '32px';
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
                    <div className="p-3 bg-gray-50 rounded border">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Altura do espaçamento
                            </label>
                            <select
                                value={component.height || 'md'}
                                onChange={handleHeightChange}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="xs">Extra Pequeno (8px)</option>
                                <option value="sm">Pequeno (16px)</option>
                                <option value="md">Médio (32px)</option>
                                <option value="lg">Grande (64px)</option>
                                <option value="xl">Extra Grande (96px)</option>
                                <option value="2xl">Muito Grande (128px)</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Preview do espaçamento */}
                <div className="relative">
                    <div className={`${getHeightClass()} bg-transparent`}>
                        {/* Indicador visual do espaçamento quando editável */}
                        {isEditable && (
                            <div className="absolute inset-0 border border-dashed border-gray-300 bg-gray-50 bg-opacity-50 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-500 font-medium">
                                    Espaçamento {getHeightLabel()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SimpleAtomicWrapper>
    );
};