import React, { useState, useCallback } from 'react';
import { usePureBuilder } from '@/components/editor/PureBuilderProvider';

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

    // 🔄 Pure Builder System Integration
    const { state, actions } = usePureBuilder();

    const {
        currentStep,
        selectedBlockId,
        isLoading
    } = state;

    const {
        setSelectedBlockId,
        updateBlock,
        canUndo,
        canRedo,
        undo,
        redo
    } = actions;

    // 🎨 Handlers para eventos do navbar
    const handleModeChange = useCallback((mode: string) => {
        setCurrentMode(mode as 'builder' | 'flow' | 'design' | 'leads' | 'settings');
    }, []);

    const handleSave = useCallback(async () => {
        try {
            console.log('Salvando projeto...');
            // TODO: Implementar lógica de save
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    }, []);

    const handlePublish = useCallback(async () => {
        try {
            console.log('Publicando projeto...');
            // TODO: Implementar lógica de publicação
        } catch (error) {
            console.error('Erro ao publicar:', error);
        }
    }, []);

    // 🎯 Handler para seleção de componente do toolbar
    const handleComponentDrag = useCallback((componentId: string) => {
        console.log('Componente arrastado:', componentId);
        // TODO: Implementar lógica de drag de componente
    }, []);

    // 🔄 Handler para seleção de bloco
    const handleBlockSelect = useCallback((blockId: string | null) => {
        setSelectedBlockId(blockId);
    }, [setSelectedBlockId]);

    // 📝 Handler para atualização de propriedades - Corrigido com assinatura correta
    const handlePropertyUpdate = useCallback((blockId: string, updates: Record<string, any>) => {
        const stepKey = `step_${currentStep}`;
        updateBlock(stepKey, blockId, updates);
    }, [updateBlock, currentStep]);

    // 🎯 Handler para bloco selecionado no painel de propriedades
    const selectedBlock = selectedBlockId
        ? { id: selectedBlockId, type: 'unknown', properties: {} }
        : null;

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
                {/* 🗂️ Sidebar Esquerda - Steps */}
                <div className="w-80 border-r border-gray-200 bg-white">
                    <ModernStepSidebar
                        steps={[]}
                        activeStepId={`step_${currentStep}`}
                        onStepClick={() => { }}
                    />
                </div>

                {/* 🎨 Área Central */}
                <div className="flex-1 flex flex-col">
                    {/* 🧰 Toolbar Horizontal */}
                    <div className="border-b border-gray-200 bg-white">
                        <HorizontalToolbar
                            onComponentDrag={handleComponentDrag}
                        />
                    </div>

                    {/* 🖼️ Canvas Expandido */}
                    <div className="flex-1 overflow-auto">
                        <ExpandedCanvas
                            onBack={() => console.log('Voltar')}
                        />
                    </div>
                </div>

                {/* 📊 Painel de Propriedades */}
                {selectedBlock && (
                    <div className="w-80 border-l border-gray-200 bg-white">
                        <RegistryPropertiesPanel
                            selectedBlock={selectedBlock}
                            onUpdate={handlePropertyUpdate}
                            onClose={() => setSelectedBlockId(null)}
                            onDelete={() => setSelectedBlockId(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernModularEditorPro;