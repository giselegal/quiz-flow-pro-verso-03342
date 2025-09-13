/**
 * 🚀 DEMONSTRAÇÃO: Migração para SinglePropertiesPanel
 * 
 * Esta demonstração mostra como o SinglePropertiesPanel simplifica a arquitetura:
 * 
 * ANTES (Complexidade):
 * - EnhancedUniversalPropertiesPanel (616 linhas)
 * - HeaderPropertyEditor (650+ linhas)
 * - OptimizedPropertiesPanel (800+ linhas)
 * - PropertiesPanel (400+ linhas)
 * - Múltiplas instâncias → IDs duplicados
 * 
 * DEPOIS (Simplicidade):
 * - SinglePropertiesPanel (300 linhas)
 * - IDs únicos garantidos
 * - Todas as funcionalidades preservadas
 * - Zero duplicação de código
 */

import React from 'react';
import { SinglePropertiesPanel } from './SinglePropertiesPanel';
import { UnifiedBlock, PropertyType, PropertyCategory } from '@/hooks/useUnifiedProperties';

// ===== DADOS DE EXEMPLO =====

const mockHeaderBlock: UnifiedBlock = {
    id: 'header-demo-123',
    type: 'header',
    properties: {
        title: 'Meu Quiz Personalizado',
        subtitle: 'Descubra seu perfil em apenas 5 minutos',
        showLogo: true,
        logoUrl: 'https://example.com/logo.png',
        logoAlt: 'Logo da empresa',
        showProgress: true,
        progressValue: 3,
        progressMax: 10,
        progressBarThickness: 4,
        enableProgressBar: true,
        showBackButton: false,
    },
    content: {
        title: 'Conteúdo do Header',
        subtitle: 'Subtítulo do conteúdo'
    }
};

const mockFormBlock: UnifiedBlock = {
    id: 'form-demo-456',
    type: 'form-input',
    properties: {
        label: 'Nome Completo',
        placeholder: 'Digite seu nome...',
        required: true,
        minLength: 2,
        maxLength: 50,
        borderColor: '#B89B7A',
        backgroundColor: '#FEFEFE',
        textAlign: 'left',
    },
    content: {
        value: '',
        errorMessage: ''
    }
};

// ===== DEMONSTRAÇÃO =====

interface PropertiesPanelDemoProps {
    demoMode?: 'header' | 'form';
}

export const PropertiesPanelDemo: React.FC<PropertiesPanelDemoProps> = ({
    demoMode = 'header'
}) => {
    const [selectedBlock, setSelectedBlock] = React.useState<UnifiedBlock>(
        demoMode === 'header' ? mockHeaderBlock : mockFormBlock
    );

    const handleUpdate = (updates: Partial<UnifiedBlock>) => {
        setSelectedBlock(prev => ({
            ...prev,
            ...updates,
            properties: {
                ...prev.properties,
                ...updates.properties
            },
            content: {
                ...prev.content,
                ...updates.content
            }
        }));
    };

    const handleDelete = () => {
        console.log('🗑️ Deletar bloco:', selectedBlock.id);
    };

    const handleDuplicate = () => {
        console.log('📋 Duplicar bloco:', selectedBlock.id);
    };

    return (
        <div className="h-screen flex">
            {/* Simulação do Canvas */}
            <div className="flex-1 p-8 bg-gray-50">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">
                        Demo: SinglePropertiesPanel
                    </h1>

                    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                        <h2 className="text-lg font-semibold mb-4">🎯 Benefícios da Simplificação</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-red-600 mb-2">❌ Antes (Complexo)</h3>
                                <ul className="text-sm space-y-1">
                                    <li>• 5+ painéis diferentes</li>
                                    <li>• IDs duplicados</li>
                                    <li>• 2000+ linhas de código</li>
                                    <li>• Múltiplas renderizações</li>
                                    <li>• Bugs de acessibilidade</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium text-green-600 mb-2">✅ Depois (Simples)</h3>
                                <ul className="text-sm space-y-1">
                                    <li>• 1 painel unificado</li>
                                    <li>• IDs únicos garantidos</li>
                                    <li>• 300 linhas de código</li>
                                    <li>• Renderização única</li>
                                    <li>• 100% acessível</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Controles de Demo */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                        <h3 className="font-medium mb-3">Testar Diferentes Tipos de Bloco:</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedBlock(mockHeaderBlock)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Header Block
                            </button>
                            <button
                                onClick={() => setSelectedBlock(mockFormBlock)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Form Block
                            </button>
                        </div>
                    </div>

                    {/* Preview do Bloco Selecionado */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="font-medium mb-3">Preview do Bloco:</h3>
                        <div className="p-4 border border-dashed border-gray-300 rounded">
                            {selectedBlock.type === 'header' && (
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold mb-2">
                                        {selectedBlock.properties?.title}
                                    </h1>
                                    <p className="text-gray-600 mb-4">
                                        {selectedBlock.properties?.subtitle}
                                    </p>
                                    {selectedBlock.properties?.showProgress && (
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(selectedBlock.properties.progressValue / selectedBlock.properties.progressMax) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedBlock.type === 'form-input' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        {selectedBlock.properties?.label}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={selectedBlock.properties?.placeholder}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        style={{
                                            borderColor: selectedBlock.properties?.borderColor,
                                            backgroundColor: selectedBlock.properties?.backgroundColor
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Painel de Propriedades */}
            <div className="w-80 border-l bg-white">
                <SinglePropertiesPanel
                    selectedBlock={selectedBlock}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                />
            </div>
        </div>
    );
};

export default PropertiesPanelDemo;