import React from 'react';
import { SimpleAtomicWrapper } from './SimpleAtomicWrapper';
import type { AtomicOptions as AtomicOptionsType } from '../../atomic-components/types';
import { Plus, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AtomicOptionsProps {
    component: AtomicOptionsType;
    onUpdate: (updates: Partial<AtomicOptionsType>) => void;
    onDelete: () => void;
    onInsertBefore: (componentType: string) => void;
    onInsertAfter: (componentType: string) => void;
    isEditable?: boolean;
}

export const AtomicOptions: React.FC<AtomicOptionsProps> = ({
    component,
    onUpdate,
    onDelete,
    onInsertBefore,
    onInsertAfter,
    isEditable = true
}) => {
    const handleOptionChange = (index: number, text: string) => {
        const newOptions = [...(component.options || [])];
        newOptions[index] = { ...newOptions[index], text };
        onUpdate({ options: newOptions });
    };

    const handleOptionValueChange = (index: number, value: string) => {
        const newOptions = [...(component.options || [])];
        newOptions[index] = { ...newOptions[index], value };
        onUpdate({ options: newOptions });
    };

    const addOption = () => {
        const newOptions = [...(component.options || [])];
        newOptions.push({
            id: `option-${Date.now()}`,
            text: `Opção ${newOptions.length + 1}`,
            value: `option-${newOptions.length + 1}`
        });
        onUpdate({ options: newOptions });
    };

    const removeOption = (index: number) => {
        const newOptions = [...(component.options || [])];
        newOptions.splice(index, 1);
        onUpdate({ options: newOptions });
    };

    const moveOption = (fromIndex: number, toIndex: number) => {
        const newOptions = [...(component.options || [])];
        const [movedOption] = newOptions.splice(fromIndex, 1);
        newOptions.splice(toIndex, 0, movedOption);
        onUpdate({ options: newOptions });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ optionType: e.target.value as 'radio' | 'checkbox' | 'buttons' | 'cards' });
    };

    const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ layout: e.target.value as 'vertical' | 'horizontal' | 'grid' });
    };

    const handleColumnsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ columns: parseInt(e.target.value) as 1 | 2 | 3 | 4 });
    };

    const getLayoutClasses = () => {
        const layout = component.layout || 'vertical';
        const columns = component.columns || 1;

        switch (layout) {
            case 'horizontal':
                return 'flex flex-wrap gap-3';
            case 'grid':
                return `grid gap-3 ${columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : columns === 4 ? 'grid-cols-4' : 'grid-cols-1'}`;
            case 'vertical':
            default:
                return 'space-y-2';
        }
    };

    const getOptionClasses = () => {
        const type = component.optionType || 'radio';

        switch (type) {
            case 'buttons':
                return 'px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-center';
            case 'cards':
                return 'p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all bg-white';
            case 'radio':
            case 'checkbox':
            default:
                return 'flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer';
        }
    };

    const renderOption = (option: any, index: number) => {
        const type = component.optionType || 'radio';
        const optionClasses = getOptionClasses();

        return (
            <div key={option.id} className="relative group">
                {isEditable && (
                    <div className="absolute -left-8 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center"
                            title="Arrastar"
                        >
                            <GripVertical className="w-3 h-3 text-gray-500" />
                        </button>
                    </div>
                )}

                <div className={optionClasses}>
                    {(type === 'radio' || type === 'checkbox') && (
                        <input
                            type={type}
                            name={`atomic-option-${component.id}`}
                            className="text-blue-600 focus:ring-blue-500"
                            disabled
                        />
                    )}

                    {isEditable ? (
                        <input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-300 rounded px-2 py-1"
                            placeholder={`Opção ${index + 1}`}
                        />
                    ) : (
                        <span className="flex-1">{option.text}</span>
                    )}
                </div>

                {isEditable && (
                    <button
                        onClick={() => removeOption(index)}
                        className="absolute -right-2 -top-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover opção"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
        );
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
                    <div className="space-y-3 p-3 bg-gray-50 rounded border">
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Tipo de opção
                                </label>
                                <select
                                    value={component.optionType || 'radio'}
                                    onChange={handleTypeChange}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="radio">Radio (única)</option>
                                    <option value="checkbox">Checkbox (múltipla)</option>
                                    <option value="buttons">Botões</option>
                                    <option value="cards">Cartões</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Layout
                                </label>
                                <select
                                    value={component.layout || 'vertical'}
                                    onChange={handleLayoutChange}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="vertical">Vertical</option>
                                    <option value="horizontal">Horizontal</option>
                                    <option value="grid">Grade</option>
                                </select>
                            </div>
                            {component.layout === 'grid' && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Colunas
                                    </label>
                                    <select
                                        value={component.columns || 2}
                                        onChange={handleColumnsChange}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-700">
                                Opções ({(component.options || []).length})
                            </span>
                            <Button
                                onClick={addOption}
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                Adicionar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Preview das opções */}
                <div className="space-y-3">
                    {(component.options || []).length > 0 ? (
                        <div className={getLayoutClasses()}>
                            {(component.options || []).map((option, index) =>
                                renderOption(option, index)
                            )}
                        </div>
                    ) : (
                        <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                            <p className="text-sm">Nenhuma opção adicionada</p>
                            {isEditable && (
                                <Button
                                    onClick={addOption}
                                    size="sm"
                                    variant="outline"
                                    className="mt-2"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Adicionar primeira opção
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </SimpleAtomicWrapper>
    );
};