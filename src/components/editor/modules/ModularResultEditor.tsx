/**
 * ⚠️ ⚠️ ⚠️ DEPRECATED - NÃO USAR ⚠️ ⚠️ ⚠️
 * @deprecated Use QuizModularProductionEditor - Ver MIGRATION_EDITOR.md
 */

import React, { useState } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { Layers } from '@craftjs/layers';
import { cn } from '@/lib/utils';
import { HeaderSection } from './HeaderSection';
import { UserInfoSection } from './UserInfoSection';
import { ProgressSection } from './ProgressSection';
import { MainImageSection } from './MainImageSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Painel de propriedades
const SettingsPanel: React.FC = () => {
    const { enabled } = useEditor((state) => ({
        enabled: state.options.enabled
    }));

    return (
        <div className={cn(
            'w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto',
            'transition-all duration-200',
            !enabled && 'opacity-50 pointer-events-none'
        )}>
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                    🎨 Configurações
                </h3>

                {/* O Craft.js automaticamente renderiza as propriedades aqui */}
                <div id="settings-panel">
                    {/* As propriedades serão renderizadas automaticamente pelo Craft.js */}
                </div>
            </div>
        </div>
    );
};

// Toolbar superior
const Toolbar: React.FC = () => {
    const { enabled, actions, query } = useEditor((state) => ({
        enabled: state.options.enabled
    }));

    return (
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <h2 className="font-semibold text-gray-900">
                    🧩 Editor Modular de Resultado
                </h2>
                <div className="text-sm text-gray-500">
                    {enabled ? '✏️ Modo de Edição' : '👁️ Modo de Visualização'}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant={enabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => actions.setOptions((options) => ({ ...options, enabled: !enabled }))}
                >
                    {enabled ? '👁️ Visualizar' : '✏️ Editar'}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const json = query.serialize();
                        console.log('Estado serializado:', json);
                    }}
                >
                    💾 Salvar
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        actions.clearEvents();
                        window.location.reload();
                    }}
                >
                    🔄 Resetar
                </Button>
            </div>
        </div>
    );
};

// Painel lateral com componentes disponíveis
const ComponentPanel: React.FC = () => {
    const { connectors } = useEditor();

    return (
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                    🧩 Componentes
                </h3>

                <div className="space-y-2">
                    {/* Header Section */}
                    <div
                        className={cn(
                            'p-3 bg-white rounded-lg border border-gray-200 cursor-grab',
                            'hover:border-[#B89B7A] hover:bg-[#B89B7A]/5 transition-colors',
                            'active:cursor-grabbing'
                        )}
                        ref={(ref) =>
                            connectors.create(ref!, React.createElement(HeaderSection))
                        }
                    >
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">🏷️</span>
                            <span className="font-medium text-sm">Header</span>
                        </div>
                        <p className="text-xs text-gray-600">Cabeçalho com título e logo</p>
                    </div>

                    {/* User Info Section */}
                    <div
                        className={cn(
                            'p-3 bg-white rounded-lg border border-gray-200 cursor-grab',
                            'hover:border-[#B89B7A] hover:bg-[#B89B7A]/5 transition-colors',
                            'active:cursor-grabbing'
                        )}
                        ref={(ref) =>
                            connectors.create(ref!, React.createElement(UserInfoSection))
                        }
                    >
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">👤</span>
                            <span className="font-medium text-sm">User Info</span>
                        </div>
                        <p className="text-xs text-gray-600">Informações do usuário e badge</p>
                    </div>

                    {/* Progress Section */}
                    <div
                        className={cn(
                            'p-3 bg-white rounded-lg border border-gray-200 cursor-grab',
                            'hover:border-[#B89B7A] hover:bg-[#B89B7A]/5 transition-colors',
                            'active:cursor-grabbing'
                        )}
                        ref={(ref) =>
                            connectors.create(ref!, React.createElement(ProgressSection))
                        }
                    >
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">📊</span>
                            <span className="font-medium text-sm">Progress</span>
                        </div>
                        <p className="text-xs text-gray-600">Barra de progresso animada</p>
                    </div>

                    {/* Main Image Section */}
                    <div
                        className={cn(
                            'p-3 bg-white rounded-lg border border-gray-200 cursor-grab',
                            'hover:border-[#B89B7A] hover:bg-[#B89B7A]/5 transition-colors',
                            'active:cursor-grabbing'
                        )}
                        ref={(ref) =>
                            connectors.create(ref!, React.createElement(MainImageSection))
                        }
                    >
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">🖼️</span>
                            <span className="font-medium text-sm">Image</span>
                        </div>
                        <p className="text-xs text-gray-600">Imagem com efeitos visuais</p>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        📱 Layouts Responsivos
                    </h4>
                    <div className="space-y-2">
                        <div className="text-xs bg-blue-50 p-2 rounded">
                            <span className="font-medium">Mobile:</span> Stack vertical
                        </div>
                        <div className="text-xs bg-green-50 p-2 rounded">
                            <span className="font-medium">Tablet:</span> 2 colunas
                        </div>
                        <div className="text-xs bg-purple-50 p-2 rounded">
                            <span className="font-medium">Desktop:</span> Grid flexível
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Container principal editável
const EditableContainer: React.FC = () => {
    const { connectors } = useEditor();

    return (
        <div
            className="min-h-96 bg-gray-50 p-8"
            ref={(ref) => connectors.select(connectors.hover(ref!, ''), '')}
        >
            <Card className="p-8 max-w-4xl mx-auto">
                {/* Container inicial com alguns módulos padrão */}
                <Element is={HeaderSection} canvas>
                    {/* Este será o header editável */}
                </Element>

                <div className="mt-6">
                    <Element is={UserInfoSection} canvas>
                        {/* Seção de informações do usuário */}
                    </Element>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <Element is={MainImageSection} canvas>
                        {/* Imagem principal */}
                    </Element>

                    <div className="space-y-6">
                        <Element is={ProgressSection} canvas>
                            {/* Barra de progresso */}
                        </Element>

                        {/* Área de texto editável */}
                        <div className="bg-gradient-to-br from-[#B89B7A]/10 to-[#aa6b5d]/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-[#432818] mb-4">
                                Sua Personalidade Estilística
                            </h3>
                            <p className="text-[#432818] leading-relaxed">
                                Arraste componentes do painel lateral para personalizar este resultado.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA padrão */}
                <div className="mt-8 text-center">
                    <div className="bg-gradient-to-br from-[#B89B7A]/10 to-[#aa6b5d]/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-[#432818] mb-3">
                            Pronto para Transformar Sua Imagem?
                        </h3>
                        <p className="text-[#6B4F43] mb-4 text-sm">
                            Agora que você conhece seu estilo, descubra como aplicá-lo no seu dia a dia.
                        </p>
                        <button className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-6 py-3 text-sm font-semibold rounded-xl shadow-lg hover:from-[#A08966] hover:to-[#9A5A4D] transition-all duration-300 hover:scale-105">
                            👉 Quero Aprimorar Meu Estilo
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

// Componente principal do editor
export const ModularResultEditor: React.FC = () => {
    const [showLayers, setShowLayers] = useState(false);

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <Editor
                resolver={{
                    HeaderSection,
                    UserInfoSection,
                    ProgressSection,
                    MainImageSection,
                }}
            >
                {/* Toolbar superior */}
                <Toolbar />

                <div className="flex-1 flex overflow-hidden">
                    {/* Painel lateral de componentes */}
                    <ComponentPanel />

                    {/* Área principal editável */}
                    <div className="flex-1 overflow-auto">
                        <Frame>
                            <EditableContainer />
                        </Frame>
                    </div>

                    {/* Painel de propriedades */}
                    <SettingsPanel />

                    {/* Painel de camadas (opcional) */}
                    {showLayers && (
                        <div className="w-64 bg-white border-l border-gray-200">
                            <Layers expandRootOnLoad />
                        </div>
                    )}
                </div>

                {/* Toggle para mostrar/ocultar painel de camadas */}
                <Button
                    className="fixed bottom-4 right-4"
                    size="sm"
                    onClick={() => setShowLayers(!showLayers)}
                >
                    {showLayers ? '🗂️ Ocultar Camadas' : '🗂️ Mostrar Camadas'}
                </Button>
            </Editor>
        </div>
    );
};

// Preview responsivo
export const ResponsivePreview: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

    const viewportStyles = {
        mobile: { width: '375px', height: '667px' },
        tablet: { width: '768px', height: '1024px' },
        desktop: { width: '100%', height: '100%' }
    };

    return (
        <div className="h-screen bg-gray-100 p-4">
            <div className="mb-4 flex justify-center space-x-2">
                {(['mobile', 'tablet', 'desktop'] as const).map((size) => (
                    <Button
                        key={size}
                        variant={viewport === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewport(size)}
                    >
                        📱 {size === 'mobile' ? 'Mobile' : size === 'tablet' ? 'Tablet' : 'Desktop'}
                    </Button>
                ))}
            </div>

            <div className="flex justify-center">
                <div
                    className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg transition-all duration-300"
                    style={viewportStyles[viewport]}
                >
                    <div className="h-full overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModularResultEditor;