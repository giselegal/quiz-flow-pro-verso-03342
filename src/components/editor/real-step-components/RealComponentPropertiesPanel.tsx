/**
 * 🎯 PAINEL DE PROPRIEDADES PARA COMPONENTES REAIS
 * 
 * Painel específico para editar propriedades dos componentes modulares das 21 etapas reais
 */

import React from 'react';
import { RealComponentProps, RealComponentType } from './types';
import { cn } from '@/lib/utils';
import { Settings, X, Edit3, Palette, Layout, Zap } from 'lucide-react';

interface RealComponentPropertiesPanelProps {
    component: RealComponentProps | null;
    onUpdate: (updates: Partial<RealComponentProps>) => void;
    onClose: () => void;
}

export const RealComponentPropertiesPanel: React.FC<RealComponentPropertiesPanelProps> = ({
    component,
    onUpdate,
    onClose
}) => {
    if (!component) {
        return (
            <div className="w-80 bg-white border-l border-gray-200 p-6">
                <div className="text-center text-gray-500">
                    <Settings size={48} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Nenhum componente selecionado</h3>
                    <p className="text-sm">
                        Clique em um componente no canvas para editar suas propriedades
                    </p>
                </div>
            </div>
        );
    }

    const handleContentUpdate = (updates: Record<string, any>) => {
        onUpdate({
            content: { ...component.content, ...updates }
        });
    };

    const handlePropertiesUpdate = (updates: Record<string, any>) => {
        onUpdate({
            properties: { ...component.properties, ...updates }
        });
    };

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Propriedades</h3>
                        <p className="text-sm text-gray-500">{component.type}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X size={16} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Informações básicas */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Edit3 size={16} />
                        <span>Informações Básicas</span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ID do Componente
                        </label>
                        <input
                            type="text"
                            value={component.id}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo
                        </label>
                        <input
                            type="text"
                            value={component.type}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ordem
                        </label>
                        <input
                            type="number"
                            value={component.order || 0}
                            onChange={(e) => onUpdate({ order: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                </div>

                {/* Conteúdo Específico */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Edit3 size={16} />
                        <span>Conteúdo</span>
                    </div>

                    {renderContentEditor(component.type, component.content, handleContentUpdate)}
                </div>

                {/* Propriedades de Estilo */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Palette size={16} />
                        <span>Estilo</span>
                    </div>

                    {renderStyleEditor(component.properties, handlePropertiesUpdate)}
                </div>

                {/* Layout */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Layout size={16} />
                        <span>Layout</span>
                    </div>

                    {renderLayoutEditor(component.properties, handlePropertiesUpdate)}
                </div>
            </div>
        </div>
    );
};

// 📝 Renderizar editor de conteúdo específico por tipo
function renderContentEditor(
    type: RealComponentType,
    content: Record<string, any>,
    onUpdate: (updates: Record<string, any>) => void
) {
    switch (type) {
        case 'quiz-intro-header':
            return (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                            type="text"
                            value={content.title || ''}
                            onChange={(e) => onUpdate({ title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Título do cabeçalho"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                        <input
                            type="text"
                            value={content.subtitle || ''}
                            onChange={(e) => onUpdate({ subtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Subtítulo"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                            value={content.description || ''}
                            onChange={(e) => onUpdate({ description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            rows={3}
                            placeholder="Descrição do cabeçalho"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={content.showLogo || false}
                                onChange={(e) => onUpdate({ showLogo: e.target.checked })}
                            />
                            <span className="text-sm">Mostrar Logo</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={content.showProgress || false}
                                onChange={(e) => onUpdate({ showProgress: e.target.checked })}
                            />
                            <span className="text-sm">Mostrar Progresso</span>
                        </label>
                    </div>
                </div>
            );

        case 'text':
        case 'text-inline':
            return (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
                    <textarea
                        value={content.text || ''}
                        onChange={(e) => onUpdate({ text: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows={4}
                        placeholder="Digite o texto..."
                    />
                </div>
            );

        case 'options-grid':
            return (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pergunta</label>
                        <input
                            type="text"
                            value={content.question || ''}
                            onChange={(e) => onUpdate({ question: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Digite a pergunta..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Opções ({(content.options || []).length})
                        </label>
                        <div className="text-xs text-gray-500 mb-2">
                            Use o editor avançado para gerenciar opções individualmente
                        </div>
                        <div className="max-h-32 overflow-y-auto border rounded p-2 bg-gray-50">
                            {(content.options || []).map((option: any, index: number) => (
                                <div key={index} className="text-sm py-1">
                                    {index + 1}. {option.text || 'Opção sem texto'}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case 'form-container':
            return (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Campo</label>
                        <select
                            value={content.fieldType || 'text'}
                            onChange={(e) => onUpdate({ fieldType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="text">Texto</option>
                            <option value="email">E-mail</option>
                            <option value="tel">Telefone</option>
                            <option value="password">Senha</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                        <input
                            type="text"
                            value={content.label || ''}
                            onChange={(e) => onUpdate({ label: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Label do campo"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                        <input
                            type="text"
                            value={content.placeholder || ''}
                            onChange={(e) => onUpdate({ placeholder: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Placeholder do campo"
                        />
                    </div>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={content.required || false}
                            onChange={(e) => onUpdate({ required: e.target.checked })}
                        />
                        <span className="text-sm">Campo obrigatório</span>
                    </label>
                </div>
            );

        default:
            return (
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
                    Editor específico para {type} será implementado em breve.
                </div>
            );
    }
}

// 🎨 Renderizar editor de propriedades de estilo
function renderStyleEditor(
    properties: Record<string, any>,
    onUpdate: (updates: Record<string, any>) => void
) {
    return (
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor de Fundo</label>
                <input
                    type="color"
                    value={properties.backgroundColor || '#FFFFFF'}
                    onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                    className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor do Texto</label>
                <input
                    type="color"
                    value={properties.color || '#000000'}
                    onChange={(e) => onUpdate({ color: e.target.value })}
                    className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alinhamento</label>
                <select
                    value={properties.textAlign || 'left'}
                    onChange={(e) => onUpdate({ textAlign: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                    <option value="left">Esquerda</option>
                    <option value="center">Centro</option>
                    <option value="right">Direita</option>
                    <option value="justify">Justificado</option>
                </select>
            </div>
        </div>
    );
}

// 📐 Renderizar editor de propriedades de layout
function renderLayoutEditor(
    properties: Record<string, any>,
    onUpdate: (updates: Record<string, any>) => void
) {
    return (
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
                <input
                    type="text"
                    value={properties.padding || ''}
                    onChange={(e) => onUpdate({ padding: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="ex: 16px, 1rem"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Margem Superior</label>
                <input
                    type="number"
                    value={properties.marginTop || 0}
                    onChange={(e) => onUpdate({ marginTop: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Margem Inferior</label>
                <input
                    type="number"
                    value={properties.marginBottom || 0}
                    onChange={(e) => onUpdate({ marginBottom: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                <input
                    type="text"
                    value={properties.borderRadius || ''}
                    onChange={(e) => onUpdate({ borderRadius: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="ex: 8px, 0.5rem"
                />
            </div>
        </div>
    );
}