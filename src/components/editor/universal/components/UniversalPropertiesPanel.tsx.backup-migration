/**
 * 🎯 UNIVERSAL PROPERTIES PANEL - Painéis Detalhados Extraídos
 * 
 * Painel de propriedades universal que contém todos os painéis detalhados
 * do UniversalStepEditor original, mas em uma arquitetura modular
 */

import React, { useMemo, useCallback } from 'react';
import { useEditor } from '@/components/editor/EditorProvider';
import { logger } from '@/utils/debugLogger';

export interface UniversalPropertiesPanelProps {
    selectedBlockId: string | null;
    stepData: any[];
    stepNumber: number;
    onSave: () => void;
    className?: string;
}

const UniversalPropertiesPanel: React.FC<UniversalPropertiesPanelProps> = ({
    selectedBlockId,
    stepData,
    stepNumber,
    onSave,
    className = ''
}) => {
    const { actions } = useEditor();

    // Encontrar o bloco selecionado
    const selectedBlockData = useMemo(() => {
        if (!selectedBlockId || !stepData) return null;
        return stepData.find(block => block.id === selectedBlockId);
    }, [selectedBlockId, stepData]);

    // Função para atualizar propriedades do bloco
    const updateBlockProperty = useCallback((blockId: string, property: string, value: any) => {
        try {
            const currentStepKey = `step-${stepNumber}`;

            // Usar o contexto do editor para atualizar
            if (actions?.updateBlock) {
                // Criar o objeto de update baseado no path da propriedade
                const updatePath = property.split('.');
                const updates: any = {};

                // Construir o objeto de update aninhado
                let current = updates;
                for (let i = 0; i < updatePath.length - 1; i++) {
                    current[updatePath[i]] = {};
                    current = current[updatePath[i]];
                }
                current[updatePath[updatePath.length - 1]] = value;

                actions.updateBlock(currentStepKey, blockId, updates);

                logger.debug('🔄 Propriedade atualizada:', {
                    blockId,
                    property,
                    value,
                    updates
                });
            }
        } catch (error) {
            logger.error('❌ Erro ao atualizar propriedade:', error);
        }
    }, [actions, stepNumber]);

    // Renderizar campos específicos por tipo de componente
    const renderPropertiesFields = (blockData: any) => {
        const { type, content, properties } = blockData;

        switch (type) {
            case 'quiz-intro-header':
                return (
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-100 pb-2 border-b border-gray-700">Configurações do Header</h4>

                        {/* Content Settings */}
                        <div className="space-y-3">
                            <h5 className="text-sm font-medium text-gray-300 border-l-2 border-blue-500 pl-2">Conteúdo</h5>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={content?.showLogo || properties?.showLogo || false}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'content.showLogo', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <label className="text-sm text-gray-300">Mostrar Logo</label>
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={properties?.enableProgressBar || false}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.enableProgressBar', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <label className="text-sm text-gray-300">Habilitar Barra de Progresso</label>
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={properties?.showBackButton || false}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.showBackButton', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <label className="text-sm text-gray-300">Mostrar Botão Voltar</label>
                            </div>
                        </div>

                        {/* Logo Settings */}
                        {(content?.showLogo || properties?.showLogo) && (
                            <div className="space-y-3">
                                <h5 className="text-sm font-medium text-gray-300 border-l-2 border-green-500 pl-2">Logo</h5>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">URL do Logo</label>
                                    <input
                                        type="url"
                                        value={properties?.logoUrl || ''}
                                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.logoUrl', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://exemplo.com/logo.png"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Alt do Logo</label>
                                    <input
                                        type="text"
                                        value={properties?.logoAlt || 'Logo'}
                                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.logoAlt', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Descrição do logo"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Progress Bar Settings */}
                        {properties?.enableProgressBar && (
                            <div className="space-y-3">
                                <h5 className="text-sm font-medium text-gray-300 border-l-2 border-yellow-500 pl-2">Barra de Progresso</h5>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Valor Atual</label>
                                        <input
                                            type="number"
                                            value={properties?.progressValue || 0}
                                            onChange={(e) => updateBlockProperty(blockData.id, 'properties.progressValue', parseInt(e.target.value))}
                                            className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Valor Máximo</label>
                                        <input
                                            type="number"
                                            value={properties?.progressMax || 100}
                                            onChange={(e) => updateBlockProperty(blockData.id, 'properties.progressMax', parseInt(e.target.value))}
                                            className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Altura (px)</label>
                                    <input
                                        type="number"
                                        value={properties?.progressHeight || 4}
                                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.progressHeight', parseInt(e.target.value))}
                                        className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="1"
                                        max="20"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Style Settings */}
                        <div className="space-y-3">
                            <h5 className="text-sm font-medium text-gray-300 border-l-2 border-purple-500 pl-2">Estilo</h5>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Cor de Fundo</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="color"
                                        value={properties?.backgroundColor || '#ffffff'}
                                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.backgroundColor', e.target.value)}
                                        className="w-12 h-10 border border-gray-600 rounded bg-gray-800"
                                    />
                                    <input
                                        type="text"
                                        value={properties?.backgroundColor || '#ffffff'}
                                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.backgroundColor', e.target.value)}
                                        className="flex-1 bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Alinhamento do Texto</label>
                                <select
                                    value={properties?.textAlign || 'center'}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.textAlign', e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="left">Esquerda</option>
                                    <option value="center">Centro</option>
                                    <option value="right">Direita</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 'decorative-bar':
                return (
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-100 pb-2 border-b border-gray-700">Configurações da Barra Decorativa</h4>

                        {/* Dimensions */}
                        <div className="space-y-3">
                            <h5 className="text-sm font-medium text-gray-300 border-l-2 border-blue-500 pl-2">Dimensões</h5>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Largura</label>
                                <input
                                    type="text"
                                    value={properties?.width || 'min(640px, 100%)'}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.width', e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="min(640px, 100%), 300px, 50%"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Altura (px)</label>
                                <input
                                    type="number"
                                    value={properties?.height || 4}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.height', parseInt(e.target.value))}
                                    className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="space-y-3">
                            <h5 className="text-sm font-medium text-gray-300 border-l-2 border-green-500 pl-2">Cores</h5>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Cor Principal</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="color"
                                        value={properties?.color || properties?.backgroundColor || '#B89B7A'}
                                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.color', e.target.value)}
                                        className="w-12 h-10 border border-gray-600 rounded bg-gray-800"
                                    />
                                    <input
                                        type="text"
                                        value={properties?.color || properties?.backgroundColor || '#B89B7A'}
                                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.color', e.target.value)}
                                        className="flex-1 bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Effects */}
                        <div className="space-y-3">
                            <h5 className="text-sm font-medium text-gray-300 border-l-2 border-orange-500 pl-2">Efeitos</h5>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Border Radius (px)</label>
                                <input
                                    type="number"
                                    value={properties?.borderRadius || 3}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.borderRadius', parseInt(e.target.value))}
                                    className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={properties?.showShadow || false}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.showShadow', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <label className="text-sm text-gray-300">Mostrar Sombra</label>
                            </div>
                        </div>
                    </div>
                );

            case 'text':
                return (
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-100 pb-2 border-b border-gray-700">Configurações do Texto</h4>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Texto</label>
                            <textarea
                                value={content?.text || ''}
                                onChange={(e) => updateBlockProperty(blockData.id, 'content.text', e.target.value)}
                                rows={4}
                                className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Digite o texto aqui..."
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Suporte HTML: &lt;span&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="space-y-3">
                            <h5 className="text-sm font-medium text-gray-300 border-l-2 border-blue-500 pl-2">Tipografia</h5>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tamanho da Fonte</label>
                                <select
                                    value={properties?.fontSize || 'text-base'}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.fontSize', e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="text-xs">Extra Pequeno</option>
                                    <option value="text-sm">Pequeno</option>
                                    <option value="text-base">Normal</option>
                                    <option value="text-lg">Grande</option>
                                    <option value="text-xl">Extra Grande</option>
                                    <option value="text-2xl">2XL</option>
                                    <option value="text-3xl">3XL</option>
                                    <option value="text-4xl">4XL</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Peso da Fonte</label>
                                <select
                                    value={properties?.fontWeight || 'font-normal'}
                                    onChange={(e) => updateBlockProperty(blockData.id, 'properties.fontWeight', e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="font-light">Leve</option>
                                    <option value="font-normal">Normal</option>
                                    <option value="font-medium">Médio</option>
                                    <option value="font-semibold">Semi-negrito</option>
                                    <option value="font-bold">Negrito</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Cor do Texto</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="color"
                                        value={properties?.color || '#000000'}
                                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.color', e.target.value)}
                                        className="w-12 h-10 border border-gray-600 rounded bg-gray-800"
                                    />
                                    <input
                                        type="text"
                                        value={properties?.color || '#000000'}
                                        onChange={(e) => updateBlockProperty(blockData.id, 'properties.color', e.target.value)}
                                        className="flex-1 bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-100 pb-2 border-b border-gray-700">Configurações Genéricas</h4>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                                <input
                                    type="text"
                                    value={type}
                                    readOnly
                                    className="w-full bg-gray-700 border border-gray-600 text-gray-400 rounded-md px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">ID</label>
                                <input
                                    type="text"
                                    value={blockData.id}
                                    readOnly
                                    className="w-full bg-gray-700 border border-gray-600 text-gray-400 rounded-md px-3 py-2 text-sm font-mono"
                                />
                            </div>

                            <div className="text-sm text-gray-500 bg-gray-800 p-3 rounded">
                                <p>⚠️ Painel de propriedades para tipo "{type}" ainda não implementado.</p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`universal-properties-panel bg-gray-900 text-gray-100 p-4 ${className}`}>
            {selectedBlockData ? (
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-100">🎛️ Propriedades</h3>
                            <p className="text-sm text-gray-400">{selectedBlockData.type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={onSave}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                                💾 Salvar
                            </button>
                        </div>
                    </div>

                    {/* Properties Fields */}
                    <div className="border-t border-gray-700 pt-4">
                        {renderPropertiesFields(selectedBlockData)}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-700">
                        <button
                            className="w-full bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition-colors text-sm"
                            onClick={() => {
                                if (actions?.setSelectedBlockId) {
                                    actions.setSelectedBlockId(null);
                                }
                            }}
                        >
                            Desselecionar Bloco
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">👆</div>
                        <p className="text-sm">Clique em um componente para editá-lo</p>
                    </div>

                    {/* Step Properties */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-100">📄 Step {stepNumber}</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nome do Step
                            </label>
                            <input
                                type="text"
                                defaultValue={`Step ${stepNumber}`}
                                className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tipo do Step
                            </label>
                            <select
                                defaultValue="quiz-question"
                                className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="quiz-intro">Introdução</option>
                                <option value="quiz-question">Pergunta</option>
                                <option value="quiz-result">Resultado</option>
                                <option value="quiz-offer">Oferta</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Blocos no Step
                            </label>
                            <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded">
                                {stepData?.length || 0} blocos encontrados
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversalPropertiesPanel;