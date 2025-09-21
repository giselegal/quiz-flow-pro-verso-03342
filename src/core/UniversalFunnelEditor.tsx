/**
 * 🚀 UNIVERSAL FUNNEL EDITOR
 * 
 * Editor capaz de editar QUALQUER tipo de funil:
 * ✅ quiz21StepsComplete (21 steps)
 * ✅ lead-magnet (5-7 steps)  
 * ✅ personal-branding (10+ steps)
 * ✅ e-commerce-funnel (checkout flow)
 * ✅ webinar-registration (landing + follow-up)
 * ✅ Custom funnels (user-defined)
 */

import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Eye, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 🚀 INTEGRAÇÕES COM SISTEMA EXISTENTE
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAutosave } from '@/hooks/useAutosave';
import { useHistory } from '@/hooks/useHistory';

// ===============================
// 🎯 TYPES UNIVERSAIS - EXPORTADOS
// ===============================

export interface UniversalBlock {
    id: string;
    type: string;
    content: any;
    metadata?: {
        position?: number;
        visible?: boolean;
        locked?: boolean;
        [key: string]: any;
    };
}

export interface UniversalStep {
    id: string | number;
    name: string;
    blocks: UniversalBlock[];
    metadata?: {
        type?: string;
        validation?: any;
        navigation?: any;
        [key: string]: any;
    };
}

export interface UniversalFunnel {
    id: string;
    name: string;
    type: string; // 'quiz', 'lead-magnet', 'ecommerce', 'webinar', 'custom'
    steps: UniversalStep[];
    config: {
        theme?: any;
        analytics?: any;
        seo?: any;
        [key: string]: any;
    };
    metadata?: {
        created?: string;
        modified?: string;
        version?: string;
        [key: string]: any;
    };
}

interface UniversalFunnelEditorProps {
    funnel: UniversalFunnel;
    onFunnelChange: (funnel: UniversalFunnel) => void;
    onSave?: (funnel: UniversalFunnel) => Promise<void>;
    onPreview?: (funnel: UniversalFunnel) => void;
    onExport?: (funnel: UniversalFunnel) => void;
    readOnly?: boolean;
    // 🚀 NOVAS INTEGRAÇÕES COM SISTEMA EXISTENTE
    enableAnalytics?: boolean;
    enableAutosave?: boolean;
    enableHistory?: boolean;
    showMetrics?: boolean;
}

// ===============================
// 🎯 UNIVERSAL BLOCK RENDERER
// ===============================

const UniversalBlockRenderer: React.FC<{
    block: UniversalBlock;
    isEditing: boolean;
    onUpdate: (updates: Partial<UniversalBlock>) => void;
    onDelete: () => void;
    onSelect: () => void;
    isSelected: boolean;
}> = ({ block, isEditing, onUpdate, onDelete, onSelect, isSelected }) => {

    const renderBlockContent = () => {
        switch (block.type) {
            case 'heading':
                return (
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                        {isEditing ? (
                            <input
                                type="text"
                                value={block.content?.text || ''}
                                onChange={(e) => onUpdate({ content: { ...block.content, text: e.target.value } })}
                                className="w-full text-2xl font-bold bg-transparent border-none outline-none"
                                placeholder="Digite o título..."
                            />
                        ) : (
                            <h2 className="text-2xl font-bold">{block.content?.text || 'Título'}</h2>
                        )}
                    </div>
                );

            case 'text':
                return (
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                        {isEditing ? (
                            <textarea
                                value={block.content?.text || ''}
                                onChange={(e) => onUpdate({ content: { ...block.content, text: e.target.value } })}
                                className="w-full bg-transparent border-none outline-none resize-none"
                                rows={3}
                                placeholder="Digite o texto..."
                            />
                        ) : (
                            <p className="text-gray-700">{block.content?.text || 'Texto'}</p>
                        )}
                    </div>
                );

            case 'question':
                return (
                    <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                        {isEditing ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={block.content?.question || ''}
                                    onChange={(e) => onUpdate({ content: { ...block.content, question: e.target.value } })}
                                    className="w-full text-lg font-medium bg-transparent border-b-2 border-blue-300 outline-none"
                                    placeholder="Digite a pergunta..."
                                />
                                <div className="space-y-2">
                                    {(block.content?.options || []).map((option: any, index: number) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={option.text || ''}
                                            onChange={(e) => {
                                                const newOptions = [...(block.content?.options || [])];
                                                newOptions[index] = { ...newOptions[index], text: e.target.value };
                                                onUpdate({ content: { ...block.content, options: newOptions } });
                                            }}
                                            className="w-full p-2 bg-white border border-blue-300 rounded"
                                            placeholder={`Opção ${index + 1}...`}
                                        />
                                    ))}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            const newOptions = [...(block.content?.options || []), { text: '', value: '' }];
                                            onUpdate({ content: { ...block.content, options: newOptions } });
                                        }}
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Adicionar Opção
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-lg font-medium mb-3">{block.content?.question || 'Pergunta'}</h3>
                                <div className="space-y-2">
                                    {(block.content?.options || []).map((option: any, index: number) => (
                                        <div key={index} className="p-2 bg-white border border-blue-300 rounded cursor-pointer hover:bg-blue-50">
                                            {option.text || `Opção ${index + 1}`}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'image':
                return (
                    <div className="p-4 border-2 border-dashed border-green-300 rounded-lg bg-green-50">
                        {isEditing ? (
                            <div className="text-center">
                                <input
                                    type="url"
                                    value={block.content?.src || ''}
                                    onChange={(e) => onUpdate({ content: { ...block.content, src: e.target.value } })}
                                    className="w-full p-2 mb-2 border border-green-300 rounded"
                                    placeholder="URL da imagem..."
                                />
                                {block.content?.src && (
                                    <img
                                        src={block.content.src}
                                        alt={block.content?.alt || ''}
                                        className="max-w-full h-auto rounded"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="text-center">
                                {block.content?.src ? (
                                    <img
                                        src={block.content.src}
                                        alt={block.content?.alt || ''}
                                        className="max-w-full h-auto rounded"
                                    />
                                ) : (
                                    <div className="p-8 text-green-600">
                                        📸 Imagem
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case 'button':
                return (
                    <div className="p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50 text-center">
                        {isEditing ? (
                            <input
                                type="text"
                                value={block.content?.text || ''}
                                onChange={(e) => onUpdate({ content: { ...block.content, text: e.target.value } })}
                                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg border-none outline-none"
                                placeholder="Texto do botão..."
                            />
                        ) : (
                            <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700">
                                {block.content?.text || 'Botão'}
                            </button>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="p-4 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50">
                        <div className="text-gray-600">
                            Bloco: {block.type} (ID: {block.id})
                        </div>
                        {isEditing && (
                            <textarea
                                value={JSON.stringify(block.content, null, 2)}
                                onChange={(e) => {
                                    try {
                                        const newContent = JSON.parse(e.target.value);
                                        onUpdate({ content: newContent });
                                    } catch { }
                                }}
                                className="w-full mt-2 p-2 text-xs font-mono bg-white border rounded"
                                rows={4}
                                placeholder="JSON content..."
                            />
                        )}
                    </div>
                );
        }
    };

    return (
        <div
            className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onClick={onSelect}
        >
            {renderBlockContent()}

            {isEditing && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="h-6 w-6 p-0 bg-red-500 text-white border-red-500 hover:bg-red-600"
                        >
                            ×
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ===============================
// 🎯 UNIVERSAL FUNNEL EDITOR
// ===============================

export const UniversalFunnelEditor: React.FC<UniversalFunnelEditorProps> = ({
    funnel: initialFunnel,
    onFunnelChange,
    onSave,
    onPreview,
    onExport,
    readOnly = false,
    // 🚀 NOVAS INTEGRAÇÕES
    enableAnalytics = true,
    enableAutosave = true,
    enableHistory = true,
    showMetrics = false
}) => {
    const [funnel, setFunnel] = useState<UniversalFunnel>(initialFunnel);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(!readOnly);
    const [isSaving, setIsSaving] = useState(false);

    // 🚀 INTEGRAÇÃO COM HOOKS EXISTENTES DO SISTEMA
    const analytics = enableAnalytics ? useAnalytics() : null;
    const autosave = enableAutosave && onSave ? useAutosave({
        data: funnel,
        onSave: async (data: any) => {
            if (onSave) {
                await onSave(data);
                return true;
            }
            return false;
        },
        interval: 2000,
        enabled: !readOnly
    }) : null;
    const history = enableHistory ? useHistory({
        maxHistorySize: 50,
        initialState: funnel
    }) : null;

    // 🎯 TRACK ANALYTICS EVENTS
    useEffect(() => {
        if (analytics) {
            analytics.trackEvent('universal-editor-open', {
                page: `/universal-editor/${funnel.type}/${funnel.id}`,
                funnelType: funnel.type,
                funnelId: funnel.id
            });
        }
    }, [analytics, funnel.id, funnel.type]);

    const currentStep = funnel.steps[currentStepIndex];

    // Sincronizar mudanças
    useEffect(() => {
        onFunnelChange(funnel);
    }, [funnel, onFunnelChange]);

    // Navegação entre steps
    const goToStep = useCallback((index: number) => {
        if (index >= 0 && index < funnel.steps.length) {
            setCurrentStepIndex(index);
            setSelectedBlockId(null);
        }
    }, [funnel.steps.length]);

    // Adicionar novo step
    const addStep = useCallback(() => {
        const newStep: UniversalStep = {
            id: `step-${Date.now()}`,
            name: `Nova Etapa ${funnel.steps.length + 1}`,
            blocks: []
        };

        setFunnel(prev => ({
            ...prev,
            steps: [...prev.steps, newStep]
        }));
    }, [funnel.steps.length]);

    // Adicionar novo bloco
    const addBlock = useCallback((type: string) => {
        const newBlock: UniversalBlock = {
            id: `block-${Date.now()}`,
            type,
            content: getDefaultContentForType(type)
        };

        setFunnel(prev => ({
            ...prev,
            steps: prev.steps.map((step, index) =>
                index === currentStepIndex
                    ? { ...step, blocks: [...step.blocks, newBlock] }
                    : step
            )
        }));

        setSelectedBlockId(newBlock.id);
    }, [currentStepIndex]);

    // Atualizar bloco
    const updateBlock = useCallback((blockId: string, updates: Partial<UniversalBlock>) => {
        setFunnel(prev => ({
            ...prev,
            steps: prev.steps.map((step, index) =>
                index === currentStepIndex
                    ? {
                        ...step,
                        blocks: step.blocks.map(block =>
                            block.id === blockId ? { ...block, ...updates } : block
                        )
                    }
                    : step
            )
        }));
    }, [currentStepIndex]);

    // Deletar bloco
    const deleteBlock = useCallback((blockId: string) => {
        setFunnel(prev => ({
            ...prev,
            steps: prev.steps.map((step, index) =>
                index === currentStepIndex
                    ? {
                        ...step,
                        blocks: step.blocks.filter(block => block.id !== blockId)
                    }
                    : step
            )
        }));

        if (selectedBlockId === blockId) {
            setSelectedBlockId(null);
        }
    }, [currentStepIndex, selectedBlockId]);

    // Salvar funil
    const handleSave = useCallback(async () => {
        if (!onSave) return;

        setIsSaving(true);
        try {
            await onSave(funnel);
        } finally {
            setIsSaving(false);
        }
    }, [funnel, onSave]);

    const blockTypes = [
        { type: 'heading', label: '📝 Título', icon: '📝' },
        { type: 'text', label: '💬 Texto', icon: '💬' },
        { type: 'question', label: '❓ Pergunta', icon: '❓' },
        { type: 'image', label: '🖼️ Imagem', icon: '🖼️' },
        { type: 'button', label: '🔘 Botão', icon: '🔘' }
    ];

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-900">
                        {funnel.name}
                    </h1>
                    <Badge variant="outline">
                        {funnel.type}
                    </Badge>
                    <div className="text-sm text-gray-500">
                        Etapa {currentStepIndex + 1} de {funnel.steps.length}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditMode(!isEditMode)}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        {isEditMode ? 'Preview' : 'Editar'}
                    </Button>

                    {onSave && (
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </Button>
                    )}

                    {onExport && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onExport(funnel)}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar de Steps */}
                <div className="w-64 bg-white border-r flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="font-medium text-gray-900">Etapas do Funil</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {funnel.steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${index === currentStepIndex ? 'bg-blue-50 border-blue-200' : ''
                                    }`}
                                onClick={() => goToStep(index)}
                            >
                                <div className="font-medium text-sm">
                                    {step.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {step.blocks.length} bloco(s)
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addStep}
                            className="w-full"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Etapa
                        </Button>
                    </div>
                </div>

                {/* Canvas Principal */}
                <div className="flex-1 flex flex-col">
                    {/* Step Navigation */}
                    <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToStep(currentStepIndex - 1)}
                                disabled={currentStepIndex === 0}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            <span className="font-medium">
                                {currentStep?.name}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToStep(currentStepIndex + 1)}
                                disabled={currentStepIndex === funnel.steps.length - 1}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        {isEditMode && (
                            <div className="text-sm text-gray-500">
                                {selectedBlockId ? 'Editando bloco' : 'Selecione um bloco para editar'}
                            </div>
                        )}
                    </div>

                    {/* Canvas Content */}
                    <div className="flex-1 overflow-auto p-6">
                        <div className="max-w-2xl mx-auto space-y-4">
                            {currentStep?.blocks.map((block) => (
                                <UniversalBlockRenderer
                                    key={block.id}
                                    block={block}
                                    isEditing={isEditMode}
                                    onUpdate={(updates) => updateBlock(block.id, updates)}
                                    onDelete={() => deleteBlock(block.id)}
                                    onSelect={() => setSelectedBlockId(block.id)}
                                    isSelected={selectedBlockId === block.id}
                                />
                            ))}

                            {isEditMode && (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 mb-4">
                                        Adicionar novo bloco:
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {blockTypes.map(({ type, label, icon }) => (
                                            <Button
                                                key={type}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addBlock(type)}
                                                className="flex items-center gap-2"
                                            >
                                                <span>{icon}</span>
                                                {label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ===============================
// 🎯 HELPER FUNCTIONS
// ===============================

function getDefaultContentForType(type: string): any {
    switch (type) {
        case 'heading':
            return { text: 'Novo Título' };
        case 'text':
            return { text: 'Novo texto aqui...' };
        case 'question':
            return {
                question: 'Nova pergunta?',
                options: [
                    { text: 'Opção A', value: 'a' },
                    { text: 'Opção B', value: 'b' }
                ]
            };
        case 'image':
            return { src: '', alt: 'Nova imagem' };
        case 'button':
            return { text: 'Clique aqui', action: 'next' };
        default:
            return {};
    }
}

export default UniversalFunnelEditor;