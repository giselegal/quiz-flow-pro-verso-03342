import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Settings, FileText, Palette, Globe, Rocket, AlertCircle, CheckCircle2 } from 'lucide-react';
// Removendo dependência problemática do useHeadlessEditor
// import { useHeadlessEditor } from './HeadlessEditorProvider';
import { usePureBuilder } from '../../components/editor/PureBuilderProvider';
import type { Block } from '@/types/editor';

type PanelTab = 'step' | 'global' | 'style' | 'publish';

export const DynamicPropertiesPanelImproved: React.FC = () => {
    // 🚨 CORREÇÃO: Removendo useHeadlessEditor que estava causando erro
    // const {
    //     schema,
    //     isLoading: schemaLoading
    // } = useHeadlessEditor();

    // ✅ USANDO APENAS PureBuilder que funciona
    const {
        state: builderState,
        actions: builderActions
    } = usePureBuilder();

    const [activeTab, setActiveTab] = useState<PanelTab>('step');
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    // 🔧 INTEGRAÇÃO: Usar dados reais do PureBuilder
    const currentStepKey = `step-${builderState.currentStep}`;
    const currentStepBlocks = builderState.stepBlocks[currentStepKey] || [];
    const selectedBlock: Block | null = selectedBlockId ? currentStepBlocks.find(block => block.id === selectedBlockId) || null : null;

    // 🔄 SINCRONIZAÇÃO: Atualizar seleção baseada no estado do builder
    useEffect(() => {
        if (builderState.selectedBlockId && builderState.selectedBlockId !== selectedBlockId) {
            setSelectedBlockId(builderState.selectedBlockId);
        }
    }, [builderState.selectedBlockId, selectedBlockId]);

    // 🎯 FUNÇÕES REAIS DE ATUALIZAÇÃO
    const updateStep = (stepId: string, updates: any) => {
        console.log('🔄 Atualizando step:', stepId, updates);
        // Implementar lógica de atualização de step via builder actions
    };

    const updateGlobalSettings = (updates: any) => {
        console.log('🌍 Atualizando configurações globais:', updates);
        // Implementar lógica de atualização global
    };

    const selectStep = (stepId: string) => {
        // Converter stepId para número se necessário
        const stepNumber = parseInt(stepId.replace('step-', '')) || builderState.currentStep;
        builderActions.setCurrentStep(stepNumber);
    };

    const goToStep = (index: number) => {
        builderActions.setCurrentStep(index + 1);
    };

    // ✅ USANDO APENAS PureBuilder que funciona
    const isLoading = builderState.isLoading;

    if (isLoading) {
        return (
            <div className="w-80 border-l border-gray-200 bg-white flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Carregando painel...</p>
                </div>
            </div>
        );
    }

    if (!builderState.stepBlocks) {
        return (
            <div className="w-80 border-l border-gray-200 bg-white flex items-center justify-center h-full">
                <div className="text-center p-6">
                    <div className="text-4xl mb-3">📋</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Painel de Propriedades</h3>
                    <p className="text-sm text-gray-500">Carregue um template para começar a editar</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full">
            {/* 🎨 HEADER MELHORADO */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-bold text-gray-900 flex items-center">
                            <span className="mr-2">⚙️</span>
                            Propriedades
                        </h2>
                        <div className="text-xs bg-white/80 px-2 py-1 rounded-full text-gray-600">
                            Etapa {builderState.currentStep}
                        </div>
                    </div>

                    {/* 🎯 TABS MELHORADOS */}
                    <nav className="grid grid-cols-4 gap-1">
                        {[
                            { id: 'step', name: 'Bloco', icon: '🧩', color: 'blue' },
                            { id: 'global', name: 'Global', icon: '🌍', color: 'green' },
                            { id: 'style', name: 'Estilo', icon: '🎨', color: 'purple' },
                            { id: 'publish', name: 'Deploy', icon: '🚀', color: 'orange' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as PanelTab)}
                                className={`
                  px-2 py-2 text-xs font-medium rounded-lg transition-all duration-200 transform
                  ${activeTab === tab.id
                                        ? `bg-white shadow-lg text-${tab.color}-700 scale-105`
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/60 hover:scale-102'
                                    }
                `}
                            >
                                <div className="text-base mb-0.5">{tab.icon}</div>
                                <div className="text-[10px] leading-tight">{tab.name}</div>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* 🔄 CONTEÚDO DINÂMICO */}
            <div className="flex-1 overflow-y-auto">
                {renderTabContent(
                    activeTab,
                    // schema removido - usando apenas builderState
                    builderState,
                    currentStepBlocks,
                    selectedBlock,
                    updateStep,
                    updateGlobalSettings,
                    selectStep,
                    goToStep,
                    selectedBlockId,
                    setSelectedBlockId,
                    builderActions
                )}
            </div>
        </div>
    );
};

// 🎯 FUNÇÃO DE RENDERIZAÇÃO MELHORADA - SEM DEPENDÊNCIA DE SCHEMA
function renderTabContent(
    tab: PanelTab,
    // schema: any, // removido
    builderState: any,
    currentStepBlocks: Block[],
    selectedBlock: Block | null,
    updateStep: (stepId: string, updates: Partial<FunnelStep>) => void,
    updateGlobalSettings: (updates: any) => void,
    selectStep: (stepId: string) => void,
    goToStep: (index: number) => void,
    selectedBlockId: string | null,
    setSelectedBlockId: (id: string | null) => void,
    builderActions: any
) {
    switch (tab) {
        case 'step':
            return <ImprovedStepPanel
                builderState={builderState}
                currentStepBlocks={currentStepBlocks}
                selectedBlock={selectedBlock}
                selectStep={selectStep}
                goToStep={goToStep}
                selectedBlockId={selectedBlockId}
                setSelectedBlockId={setSelectedBlockId}
                builderActions={builderActions}
            />;

        case 'global':
            return <ImprovedGlobalPanel
                // schema={schema} // removido
                builderState={builderState}
                updateGlobalSettings={updateGlobalSettings}
            />;

        case 'style':
            return <ImprovedStylePanel
                // schema={schema} // removido
                builderState={builderState}
                updateGlobalSettings={updateGlobalSettings}
            />;

        case 'publish':
            return <ImprovedPublishPanel
                // schema={schema} // removido
                builderState={builderState}
                updateGlobalSettings={updateGlobalSettings}
            />;

        default:
            return <div className="p-4 text-center text-gray-500">Tab não encontrada</div>;
    }
}

// 🧩 PAINEL DE STEP/BLOCO MELHORADO
interface ImprovedStepPanelProps {
    builderState: any;
    currentStepBlocks: Block[];
    selectedBlock: Block | null;
    selectStep: (stepId: string) => void;
    goToStep: (index: number) => void;
    selectedBlockId: string | null;
    setSelectedBlockId: (id: string | null) => void;
    builderActions: any;
}

const ImprovedStepPanel: React.FC<ImprovedStepPanelProps> = ({
    builderState,
    currentStepBlocks,
    selectedBlock,
    selectStep,
    goToStep,
    selectedBlockId,
    setSelectedBlockId,
    builderActions
}) => {
    const totalSteps = Object.keys(builderState.stepBlocks || {}).length;
    const currentStepNumber = builderState.currentStep;

    if (!selectedBlock) {
        return (
            <div className="p-4 space-y-4">
                {/* 🎯 OVERVIEW DA ETAPA */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-blue-900">Etapa {currentStepNumber}</h3>
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                            {currentStepBlocks.length} blocos
                        </span>
                    </div>
                    <p className="text-sm text-blue-700">
                        Selecione um bloco para editar suas propriedades
                    </p>
                </div>

                {/* 🚀 NAVEGAÇÃO ENTRE ETAPAS */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">📚</span>
                        Todas as Etapas ({totalSteps})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(builderState.stepBlocks || {}).map((stepKey) => {
                            const stepNumber = parseInt(stepKey.replace('step-', ''));
                            const blocks = builderState.stepBlocks[stepKey] || [];
                            const isCurrentStep = stepNumber === currentStepNumber;

                            return (
                                <button
                                    key={stepKey}
                                    onClick={() => {
                                        selectStep(stepKey);
                                        goToStep(stepNumber - 1);
                                    }}
                                    className={`p-3 text-left rounded-lg transition-all duration-200 ${isCurrentStep
                                        ? 'bg-blue-100 border-2 border-blue-300 shadow-sm'
                                        : 'bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm">#{stepNumber}</span>
                                        <span className="text-xs text-gray-500">{blocks.length}</span>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {blocks.length === 0 ? 'Vazia' : `${blocks[0]?.type || 'bloco'}`}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 🧩 BLOCOS DA ETAPA ATUAL */}
                {currentStepBlocks.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="mr-2">🧩</span>
                            Blocos desta Etapa
                        </h4>
                        <div className="space-y-2">
                            {currentStepBlocks.map((block, index) => (
                                <button
                                    key={block.id}
                                    onClick={() => {
                                        setSelectedBlockId(block.id);
                                        builderActions.setSelectedBlockId(block.id);
                                    }}
                                    className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${selectedBlockId === block.id
                                        ? 'bg-purple-100 border-2 border-purple-300 shadow-sm'
                                        : 'bg-gray-50 border border-gray-200 hover:bg-purple-50 hover:border-purple-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm capitalize flex items-center">
                                            <span className="mr-2">{getBlockIcon(block.type)}</span>
                                            {block.type.replace('-', ' ')}
                                        </span>
                                        <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                                            #{index + 1}
                                        </span>
                                    </div>
                                    {block.content?.text && (
                                        <div className="text-xs text-gray-600 truncate">
                                            {block.content.text.substring(0, 40)}...
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 🎯 ESTADO VAZIO */}
                {currentStepBlocks.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        <div className="text-4xl mb-3">🏗️</div>
                        <p className="text-sm">Esta etapa está vazia</p>
                        <p className="text-xs mt-1">Adicione blocos no canvas</p>
                    </div>
                )}
            </div>
        );
    }

    // 🎨 EDITOR DE BLOCO SELECIONADO
    return <BlockEditor
        block={selectedBlock}
        builderState={builderState}
        builderActions={builderActions}
        onClose={() => {
            setSelectedBlockId(null);
            builderActions.setSelectedBlockId(null);
        }}
    />;
};

// 🎨 EDITOR DE BLOCO INDIVIDUAL
interface BlockEditorProps {
    block: Block;
    builderState: any;
    builderActions: any;
    onClose: () => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({
    block,
    builderState,
    builderActions,
    onClose
}) => {
    const currentStepNumber = builderState.currentStep;
    const [hasChanges, setHasChanges] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 🔄 VALIDAÇÃO EM TEMPO REAL
    const validateField = (field: string, value: any): string | null => {
        switch (field) {
            case 'text':
                if (!value || value.trim().length === 0) {
                    return 'O texto não pode estar vazio';
                }
                if (value.length > 500) {
                    return 'O texto não pode ter mais de 500 caracteres';
                }
                break;
            case 'color':
                if (!value.match(/^#[0-9A-Fa-f]{6}$/)) {
                    return 'Cor deve estar no formato #RRGGBB';
                }
                break;
            default:
                return null;
        }
        return null;
    }; const handleBlockUpdate = (field: string, value: any) => {
        const stepKey = `step-${currentStepNumber}`;

        // � VALIDAÇÃO
        const error = validateField(field === 'content' ? 'text' : field,
            field === 'content' ? value.text : value);

        if (error) {
            setErrors(prev => ({ ...prev, [field]: error }));
            return;
        } else {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        // �🔄 PREVIEW EM TEMPO REAL: Atualiza imediatamente
        builderActions.updateBlock(stepKey, block.id, { [field]: value });
        setHasChanges(true);

        // 🎯 FEEDBACK VISUAL: Mostrar confirmação
        console.log(`🔄 Atualizando ${field}:`, value);
    };

    const handlePropertyUpdate = (field: string, value: any) => {
        const stepKey = `step-${currentStepNumber}`;

        // � VALIDAÇÃO
        const error = validateField(field, value);

        if (error) {
            setErrors(prev => ({ ...prev, [field]: error }));
            return;
        } else {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        // �🔄 PREVIEW EM TEMPO REAL: Atualiza propriedades imediatamente  
        builderActions.updateBlock(stepKey, block.id, {
            properties: { ...block.properties, [field]: value }
        });
        setHasChanges(true);

        // 🎯 FEEDBACK VISUAL: Mostrar confirmação
        console.log(`🎨 Atualizando propriedade ${field}:`, value);
    }; return (
        <div className="p-4 space-y-4">
            {/* 🎯 HEADER DO EDITOR */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <span className="text-lg mr-2">{getBlockIcon(block.type)}</span>
                        <h3 className="font-bold text-purple-900 capitalize">
                            {block.type.replace('-', ' ')}
                        </h3>
                        {hasChanges && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full animate-pulse">
                                ✨ Alterado
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-xs text-purple-600 hover:text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-all"
                    >
                        ✕ Fechar
                    </button>
                </div>
                <p className="text-xs text-purple-700">
                    Editando bloco da Etapa {currentStepNumber}
                    {Object.keys(errors).some(key => errors[key]) && (
                        <span className="ml-2 text-red-600">⚠️ Há erros nos campos</span>
                    )}
                </p>
            </div>            {/* 📝 PROPRIEDADES ESPECÍFICAS */}
            <div className="space-y-4">
                {block.type === 'text-inline' && (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <span className="mr-2">✏️</span>
                                Conteúdo do Texto
                            </label>
                            <textarea
                                value={block.content?.text || ''}
                                onChange={(e) => handleBlockUpdate('content', { ...block.content, text: e.target.value })}
                                rows={4}
                                className={`w-full px-3 py-2 border-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all ${errors.content
                                    ? 'border-red-300 focus:border-red-500 bg-red-50'
                                    : 'border-gray-200 focus:border-blue-500'
                                    }`}
                                placeholder="Digite o texto aqui..."
                            />
                            {errors.content && (
                                <p className="text-xs text-red-600 mt-1 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errors.content}
                                </p>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                                {(block.content?.text || '').length}/500 caracteres
                            </div>
                        </div>                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tamanho
                                </label>
                                <select
                                    value={block.properties?.fontSize || 'text-base'}
                                    onChange={(e) => handlePropertyUpdate('fontSize', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="text-xs">XS</option>
                                    <option value="text-sm">SM</option>
                                    <option value="text-base">MD</option>
                                    <option value="text-lg">LG</option>
                                    <option value="text-xl">XL</option>
                                    <option value="text-2xl">XXL</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Alinhamento
                                </label>
                                <select
                                    value={block.properties?.textAlign || 'text-left'}
                                    onChange={(e) => handlePropertyUpdate('textAlign', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="text-left">⬅️ Esquerda</option>
                                    <option value="text-center">⚬ Centro</option>
                                    <option value="text-right">➡️ Direita</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}

                {block.type === 'button' && (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <span className="mr-2">🔘</span>
                                Texto do Botão
                            </label>
                            <input
                                type="text"
                                value={block.content?.text || ''}
                                onChange={(e) => handleBlockUpdate('content', { ...block.content, text: e.target.value })}
                                className={`w-full px-3 py-2 border-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all ${errors.content
                                    ? 'border-red-300 focus:border-red-500 bg-red-50'
                                    : 'border-gray-200 focus:border-blue-500'
                                    }`}
                                placeholder="Texto do botão"
                            />
                            {errors.content && (
                                <p className="text-xs text-red-600 mt-1 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errors.content}
                                </p>
                            )}
                        </div>                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ação do Botão
                            </label>
                            <select
                                value={block.properties?.action || 'next'}
                                onChange={(e) => handlePropertyUpdate('action', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="next">➡️ Próxima etapa</option>
                                <option value="previous">⬅️ Etapa anterior</option>
                                <option value="submit">✅ Enviar</option>
                                <option value="link">🔗 Link externo</option>
                            </select>
                        </div>
                    </>
                )}

                {/* 🎨 ESTILO GERAL */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">🎨</span>
                        Aparência
                    </h4>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cor do Texto
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={block.properties?.color || '#000000'}
                                    onChange={(e) => handlePropertyUpdate('color', e.target.value)}
                                    className="h-8 w-16 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    value={block.properties?.color || '#000000'}
                                    onChange={(e) => handlePropertyUpdate('color', e.target.value)}
                                    className={`flex-1 px-2 py-1 border rounded text-xs ${errors.color
                                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                                        : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                    placeholder="#000000"
                                />
                            </div>
                            {errors.color && (
                                <p className="text-xs text-red-600 mt-1 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errors.color}
                                </p>
                            )}
                        </div>                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Classes CSS
                            </label>
                            <input
                                type="text"
                                value={block.properties?.className || ''}
                                onChange={(e) => handlePropertyUpdate('className', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="class1 class2"
                            />
                        </div>
                    </div>
                </div>

                {/* 🔍 DEBUG INFO */}
                <details className="bg-yellow-50 border border-yellow-200 rounded-lg">
                    <summary className="p-3 text-sm font-medium text-yellow-800 cursor-pointer hover:text-yellow-900 flex items-center">
                        <span className="mr-2">🐛</span>
                        Informações Técnicas
                    </summary>
                    <div className="p-3 pt-0">
                        <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                            {JSON.stringify(block, null, 2)}
                        </pre>
                    </div>
                </details>
            </div>
        </div>
    );
};

// 🌍 PAINEL GLOBAL MELHORADO
interface ImprovedGlobalPanelProps {
    builderState: any;
    updateGlobalSettings: (updates: any) => void;
}

const ImprovedGlobalPanel: React.FC<ImprovedGlobalPanelProps> = ({
    builderState,
    updateGlobalSettings
}) => {
    return (
        <div className="p-4 space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <h3 className="font-bold text-green-900 mb-2 flex items-center">
                    <span className="mr-2">🌍</span>
                    Configurações Globais
                </h3>
                <p className="text-sm text-green-700">
                    Configurações que afetam todo o quiz
                </p>
            </div>

            {/* Conteúdo será implementado */}
            <div className="text-center py-8 text-gray-400">
                <div className="text-3xl mb-2">🚧</div>
                <p className="text-sm">Em desenvolvimento</p>
            </div>
        </div>
    );
};

// 🎨 PAINEL DE ESTILO MELHORADO
interface ImprovedStylePanelProps {
    builderState: any;
    updateGlobalSettings: (updates: any) => void;
}

const ImprovedStylePanel: React.FC<ImprovedStylePanelProps> = ({
    builderState,
    updateGlobalSettings
}) => {
    return (
        <div className="p-4 space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <h3 className="font-bold text-purple-900 mb-2 flex items-center">
                    <span className="mr-2">🎨</span>
                    Estilos e Temas
                </h3>
                <p className="text-sm text-purple-700">
                    Customize a aparência do seu quiz
                </p>
            </div>

            {/* Conteúdo será implementado */}
            <div className="text-center py-8 text-gray-400">
                <div className="text-3xl mb-2">🚧</div>
                <p className="text-sm">Em desenvolvimento</p>
            </div>
        </div>
    );
};

// 🚀 PAINEL DE PUBLICAÇÃO MELHORADO
interface ImprovedPublishPanelProps {
    builderState: any;
    updateGlobalSettings: (updates: any) => void;
}

const ImprovedPublishPanel: React.FC<ImprovedPublishPanelProps> = ({
    builderState,
    updateGlobalSettings
}) => {
    return (
        <div className="p-4 space-y-4">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                <h3 className="font-bold text-orange-900 mb-2 flex items-center">
                    <span className="mr-2">🚀</span>
                    Deploy e Publicação
                </h3>
                <p className="text-sm text-orange-700">
                    Configure como publicar seu quiz
                </p>
            </div>

            {/* Conteúdo será implementado */}
            <div className="text-center py-8 text-gray-400">
                <div className="text-3xl mb-2">🚧</div>
                <p className="text-sm">Em desenvolvimento</p>
            </div>
        </div>
    );
};

// 🎯 UTILITÁRIOS
function getBlockIcon(blockType: string): string {
    const icons: Record<string, string> = {
        'text-inline': '📝',
        'button': '🔘',
        'image': '🖼️',
        'video': '📹',
        'input': '📝',
        'select': '📋',
        'checkbox': '☑️',
        'radio': '🔘',
        'textarea': '📄',
        'header': '📌',
        'divider': '➖',
        'spacer': '⬜',
        'container': '📦',
        'form': '📝',
        'quiz-question': '❓',
        'quiz-answer': '✅'
    };

    return icons[blockType] || '🧩';
}

export default DynamicPropertiesPanelImproved;