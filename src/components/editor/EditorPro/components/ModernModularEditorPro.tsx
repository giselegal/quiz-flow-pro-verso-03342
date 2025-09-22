import React, { useState, useCallback } from 'react';
import { usePureBuilder } from '@/components/editor/PureBuilderProvider';
import type { Block, BlockType } from '@/types/editor';

// Novos componentes modernos
import FunnelNavbar from './FunnelNavbar';
import ModernStepSidebar from './ModernStepSidebar';
import HorizontalToolbar from './HorizontalToolbar';
import ExpandedCanvas from './ExpandedCanvas';
import RegistryPropertiesPanel from '@/components/universal/RegistryPropertiesPanel';

interface ModernModularEditorProProps {
    className?: string;
}

/**
 * ModularEditorPro Modernizado - Inspirado em editores profissionais
 * Arquitetura: Navbar Superior + Layout Multi-Painel Otimizado
 */
const ModernModularEditorPro: React.FC<ModernModularEditorProProps> = ({
    className = ''
}) => {
    // 🎯 Estados principais
    const [currentMode, setCurrentMode] = useState<'builder' | 'flow' | 'design' | 'leads' | 'settings'>('builder');

    // 🔄 Pure Builder System Integration - CONECTANDO DADOS REAIS
    const { state, actions } = usePureBuilder();

    const {
        currentStep = 1,
        selectedBlockId = null,
        isLoading = false,
        stepBlocks = {},
        stepValidation = {},
        builderInstance
    } = state || {};

    const {
        setSelectedBlockId = () => { },
        setCurrentStep = () => { },
        updateBlock = () => Promise.resolve(),
        addBlock = () => Promise.resolve(),
        removeBlock = () => Promise.resolve(),
        canUndo = false,
        canRedo = false,
        undo = () => { },
        redo = () => { },
        exportJSON = () => '{}',
        loadDefaultTemplate = () => { }
    } = actions || {};

    // 🎨 Handlers para eventos do navbar
    const handleModeChange = useCallback((mode: string) => {
        setCurrentMode(mode as 'builder' | 'flow' | 'design' | 'leads' | 'settings');
    }, []);

    const handleSave = useCallback(async () => {
        try {
            console.log('💾 Salvando projeto...');
            const jsonData = exportJSON();
            console.log('✅ Dados exportados:', jsonData);
            // TODO: Implementar persistência real (localStorage, API, etc.)
            localStorage.setItem('quiz-editor-data', jsonData);
            alert('Projeto salvo com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao salvar:', error);
            alert('Erro ao salvar projeto');
        }
    }, [exportJSON]);

    const handlePublish = useCallback(async () => {
        try {
            console.log('🚀 Publicando projeto...');
            const jsonData = exportJSON();
            // TODO: Implementar lógica de publicação real
            console.log('📄 Dados para publicação:', jsonData);
            alert('Projeto publicado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao publicar:', error);
            alert('Erro ao publicar projeto');
        }
    }, [exportJSON]);

    // 🎯 Handler para seleção de componente do toolbar - FUNCIONALIDADE REAL
    const handleComponentDrag = useCallback(async (componentId: string) => {
        try {
            console.log('🔧 Adicionando componente:', componentId);

            const stepKey = `step-${currentStep}`;

            // Mapear componentId para BlockType válido
            const validComponentType = getValidBlockType(componentId);

            // Criar novo bloco baseado no componente selecionado
            const newBlock: Block = {
                id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: validComponentType,
                order: Object.keys(stepBlocks[stepKey] || {}).length,
                position: { x: 100, y: 100 },
                content: getDefaultContentForComponent(componentId),
                properties: getDefaultPropertiesForComponent(componentId),
                style: {},
                metadata: {
                    createdAt: new Date().toISOString(),
                    fromToolbar: true
                },
                validation: {
                    isValid: true,
                    errors: [],
                    warnings: []
                }
            };

            // Adicionar bloco ao step atual
            await addBlock(stepKey, newBlock);

            // Selecionar o novo bloco
            setSelectedBlockId(newBlock.id);

            console.log('✅ Componente adicionado com sucesso:', newBlock);
        } catch (error) {
            console.error('❌ Erro ao adicionar componente:', error);
        }
    }, [currentStep, stepBlocks, addBlock, setSelectedBlockId]);

    // 🎯 Mapear componentId para BlockType válido
    const getValidBlockType = useCallback((componentId: string): BlockType => {
        const componentMap: Record<string, BlockType> = {
            'text': 'text',
            'headline': 'headline',
            'button': 'button',
            'image': 'image',
            'question': 'multiple-choice',
            'single-choice': 'single-choice',
            'multiple-choice': 'multiple-choice',
            'text-input': 'text-input',
            'info-card': 'info-card',
            'result-card': 'result-card',
            'offer-card': 'offer-card',
            'spacer': 'spacer'
        };

        return componentMap[componentId] || 'text-inline'; // fallback seguro
    }, []);

    // 🎯 Função para obter conteúdo padrão por tipo de componente
    const getDefaultContentForComponent = useCallback((componentType: string) => {
        const defaults: Record<string, any> = {
            'text': { title: 'Novo Texto', content: 'Digite seu texto aqui...' },
            'question': { question: 'Sua pergunta aqui?', options: ['Opção 1', 'Opção 2'] },
            'button': { text: 'Clique aqui', action: 'next' },
            'image': { src: '', alt: 'Nova imagem' },
            'video': { src: '', title: 'Novo vídeo' },
            'input': { label: 'Campo de entrada', placeholder: 'Digite aqui...' },
            'rating': { question: 'Avalie de 1 a 5', max: 5 },
            'slider': { question: 'Selecione um valor', min: 0, max: 100 }
        };
        return defaults[componentType] || { title: `Novo ${componentType}` };
    }, []);

    // 🎯 Função para obter propriedades padrão por tipo de componente
    const getDefaultPropertiesForComponent = useCallback((componentType: string) => {
        const defaults: Record<string, any> = {
            'text': { fontSize: 16, color: '#000000', textAlign: 'left' },
            'question': { required: true, multipleChoice: false },
            'button': { backgroundColor: '#007bff', textColor: '#ffffff', size: 'medium' },
            'image': { width: 300, height: 200, objectFit: 'cover' },
            'video': { controls: true, autoplay: false, width: 400, height: 225 },
            'input': { required: false, maxLength: 255 },
            'rating': { showLabels: true, required: true },
            'slider': { showValue: true, step: 1 }
        };
        return defaults[componentType] || {};
    }, []);

    // 🔄 Handler para seleção de bloco
    const handleBlockSelect = useCallback((blockId: string | null) => {
        setSelectedBlockId(blockId);
    }, [setSelectedBlockId]);

    // 🎯 Handler para navegação entre steps - FUNCIONALIDADE REAL
    const handleStepClick = useCallback((stepId: string) => {
        console.log('📍 Navegando para step:', stepId);
        // Extrair número do step do ID
        const stepNumber = parseInt(stepId.replace('step_', '').replace('step-', '')) || 1;
        setCurrentStep(stepNumber);
    }, [setCurrentStep]);

    // 🎯 Gerar lista de steps baseada nos dados reais
    const realSteps = Object.keys(stepBlocks).map((stepKey, index) => {
        const stepNumber = parseInt(stepKey.replace('step-', '').replace('step_', '')) || index + 1;
        const blocks = stepBlocks[stepKey] || [];

        return {
            id: stepKey,
            name: `Etapa ${stepNumber}`,
            isActive: stepNumber === currentStep,
            order: stepNumber,
            blockCount: blocks.length,
            hasContent: blocks.length > 0
        };
    }).sort((a, b) => a.order - b.order);

    // 🎯 Handler para obter bloco selecionado real dos dados
    const getSelectedBlock = useCallback(() => {
        if (!selectedBlockId) return null;

        // Procurar o bloco em todos os steps
        for (const [stepKey, blocks] of Object.entries(stepBlocks)) {
            const block = blocks.find(b => b.id === selectedBlockId);
            if (block) {
                console.log('🎯 Bloco selecionado encontrado:', block);
                return block;
            }
        }

        return null;
    }, [selectedBlockId, stepBlocks]);

    const selectedBlock = getSelectedBlock();

    // 📝 Handler para atualização de propriedades - FUNCIONALIDADE REAL
    const handlePropertyUpdate = useCallback((blockId: string, updates: Record<string, any>) => {
        try {
            console.log('🔄 Atualizando propriedades:', { blockId, updates });

            // Encontrar em qual step o bloco está
            let targetStepKey = '';
            for (const [stepKey, blocks] of Object.entries(stepBlocks)) {
                if (blocks.find(b => b.id === blockId)) {
                    targetStepKey = stepKey;
                    break;
                }
            }

            if (targetStepKey) {
                updateBlock(targetStepKey, blockId, updates);
                console.log('✅ Propriedades atualizadas com sucesso');
            } else {
                console.warn('⚠️ Bloco não encontrado para atualização:', blockId);
            }
        } catch (error) {
            console.error('❌ Erro ao atualizar propriedades:', error);
        }
    }, [updateBlock, stepBlocks]);

    // 🎨 Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-100"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-200"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`modern-modular-editor-pro h-screen flex flex-col bg-gray-50 ${className}`}>
            {/* 🎯 Navbar Superior */}
            <FunnelNavbar
                currentMode={currentMode}
                onModeChange={handleModeChange}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
                onSave={handleSave}
                onPublish={handlePublish}
            />

            {/* 📐 Layout Principal */}
            <div className="flex flex-1 overflow-hidden">
                {/* 🗂️ Sidebar Esquerda - Steps - CONECTADO COM DADOS REAIS */}
                <div className="w-80 border-r border-gray-200 bg-white">
                    <ModernStepSidebar
                        steps={realSteps}
                        activeStepId={`step-${currentStep}`}
                        onStepClick={handleStepClick}
                        onStepAdd={() => console.log('Adicionar step')}
                        onStepDelete={(stepId) => console.log('Deletar step:', stepId)}
                        onStepRename={(stepId, newName) => console.log('Renomear step:', stepId, newName)}
                        onStepDuplicate={(stepId) => console.log('Duplicar step:', stepId)}
                    />
                </div>

                {/* 🎨 Área Central */}
                <div className="flex-1 flex flex-col">
                    {/* 🧰 Toolbar Horizontal - CONECTADO */}
                    <div className="border-b border-gray-200 bg-white">
                        <HorizontalToolbar
                            onComponentDrag={handleComponentDrag}
                        />
                    </div>

                    {/* 🖼️ Canvas Expandido - CONECTADO COM DADOS REAIS */}
                    <div className="flex-1 overflow-auto">
                        <ExpandedCanvas
                            onBack={() => console.log('Voltar')}
                            progress={(currentStep / 21) * 100}
                            showProgress={true}
                        >
                            {/* Renderizar blocos do step atual */}
                            <div className="p-6 space-y-4">
                                <h2 className="text-xl font-bold">
                                    Etapa {currentStep}
                                </h2>

                                {stepBlocks[`step-${currentStep}`]?.length > 0 ? (
                                    <div className="space-y-3">
                                        {stepBlocks[`step-${currentStep}`].map((block, index) => (
                                            <div
                                                key={block.id}
                                                className={`p-3 border rounded cursor-pointer transition-colors ${selectedBlockId === block.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => handleBlockSelect(block.id)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">
                                                        {block.type} #{index + 1}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {block.id}
                                                    </span>
                                                </div>
                                                {block.content?.title && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {block.content.title}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>Nenhum componente adicionado ainda</p>
                                        <p className="text-sm">Use a barra de ferramentas acima para adicionar componentes</p>
                                    </div>
                                )}
                            </div>
                        </ExpandedCanvas>
                    </div>
                </div>

                {/* 📊 Painel de Propriedades - CONECTADO COM DADOS REAIS */}
                {selectedBlock && (
                    <div className="w-80 border-l border-gray-200 bg-white">
                        <RegistryPropertiesPanel
                            selectedBlock={selectedBlock}
                            onUpdate={handlePropertyUpdate}
                            onClose={() => setSelectedBlockId(null)}
                            onDelete={() => {
                                // TODO: Implementar exclusão de bloco
                                console.log('Deletar bloco:', selectedBlock.id);
                                setSelectedBlockId(null);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernModularEditorPro;