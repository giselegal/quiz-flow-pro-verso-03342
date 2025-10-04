import React from 'react';
import { SimpleAtomicWrapper } from './SimpleAtomicWrapper';
import type { AtomicQuestion as AtomicQuestionType } from '../../atomic-components/types';

interface AtomicQuestionProps {
    component: AtomicQuestionType;
    onUpdate: (updates: Partial<AtomicQuestionType>) => void;
    onDelete: () => void;
    onInsertBefore: (componentType: string) => void;
    onInsertAfter: (componentType: string) => void;
    isEditable?: boolean;
}

export const AtomicQuestion: React.FC<AtomicQuestionProps> = ({
    component,
    onUpdate,
    onDelete,
    onInsertBefore,
    onInsertAfter,
    isEditable = true
}) => {
    const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ question: e.target.value });
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ description: e.target.value });
    };

    const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ required: e.target.checked });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ questionType: e.target.value as 'multiple-choice' | 'single-choice' | 'text' | 'scale' });
    };

    const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ style: e.target.value as 'default' | 'card' | 'minimal' });
    };

    const getQuestionTypeLabel = () => {
        switch (component.questionType) {
            case 'multiple-choice': return 'Múltipla Escolha';
            case 'single-choice': return 'Escolha Única';
            case 'text': return 'Texto Livre';
            case 'scale': return 'Escala/Avaliação';
            default: return 'Múltipla Escolha';
        }
    };

    const getStyleClasses = () => {
        switch (component.style) {
            case 'card':
                return 'bg-white p-6 rounded-lg shadow-sm border border-gray-200';
            case 'minimal':
                return 'p-2';
            case 'default':
            default:
                return 'bg-gray-50 p-4 rounded-lg border border-gray-200';
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
                    <div className="space-y-3 p-3 bg-gray-50 rounded border">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Pergunta
                            </label>
                            <textarea
                                value={component.question || ''}
                                onChange={handleQuestionChange}
                                placeholder="Digite sua pergunta aqui..."
                                rows={3}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Descrição opcional
                            </label>
                            <textarea
                                value={component.description || ''}
                                onChange={handleDescriptionChange}
                                placeholder="Adicione uma descrição ou contexto adicional..."
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Tipo de pergunta
                                </label>
                                <select
                                    value={component.questionType || 'multiple-choice'}
                                    onChange={handleTypeChange}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="multiple-choice">Múltipla Escolha</option>
                                    <option value="single-choice">Escolha Única</option>
                                    <option value="text">Texto Livre</option>
                                    <option value="scale">Escala</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Estilo visual
                                </label>
                                <select
                                    value={component.style || 'default'}
                                    onChange={handleStyleChange}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="default">Padrão</option>
                                    <option value="card">Cartão</option>
                                    <option value="minimal">Minimal</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={component.required || false}
                                        onChange={handleRequiredChange}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                                    />
                                    <span className="text-xs font-medium text-gray-700">Obrigatória</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview da pergunta */}
                <div className={getStyleClasses()}>
                    <div className="space-y-3">
                        {/* Título da pergunta */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                                {component.question || 'Sua pergunta aparecerá aqui'}
                                {component.required && <span className="text-red-500 ml-1">*</span>}
                            </h3>
                        </div>

                        {/* Descrição */}
                        {component.description && (
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {component.description}
                            </p>
                        )}

                        {/* Indicador do tipo de pergunta */}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {getQuestionTypeLabel()}
                            </span>
                            {component.required && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Obrigatória
                                </span>
                            )}
                        </div>

                        {/* Placeholder para opções */}
                        <div className="mt-4 text-xs text-gray-400 italic">
                            As opções de resposta serão definidas em um componente separado
                        </div>
                    </div>
                </div>
            </div>
        </SimpleAtomicWrapper>
    );
};