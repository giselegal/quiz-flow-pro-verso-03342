import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ModularResultEditor, ModularResultHeaderBlock } from '@/components/editor/modules';
import { useQuizResult } from '@/hooks/useQuizResult';
import { getBestUserName } from '@/core/user/name';
import { mapToFriendlyStyle } from '@/core/style/naming';
import { cn } from '@/lib/utils';

interface Step20SystemSelectorProps {
    className?: string;
    onSystemChange?: (system: 'legacy' | 'modular' | 'editor') => void;
}

/**
 * 🎯 SELETOR DE SISTEMA PARA ETAPA 20
 * 
 * Permite ao usuário escolher entre:
 * - Sistema Legado (ResultDisplay)
 * - Sistema Modular (ModularResultHeaderBlock) 
 * - Editor Completo (ModularResultEditor)
 */
export const Step20SystemSelector: React.FC<Step20SystemSelectorProps> = ({
    className,
    onSystemChange
}) => {
    const [selectedSystem, setSelectedSystem] = useState<'legacy' | 'modular' | 'editor'>('modular');
    const [showPreview, setShowPreview] = useState(true);
    const { primaryStyle } = useQuizResult();

    const handleSystemChange = (system: 'legacy' | 'modular' | 'editor') => {
        setSelectedSystem(system);
        onSystemChange?.(system);
    };

    const systems = [
        {
            id: 'legacy' as const,
            name: 'Sistema Legado',
            icon: '📄',
            description: 'Resultado simples e funcional',
            pros: ['Estável', 'Rápido', 'Compatível'],
            cons: ['Limitado', 'Não editável']
        },
        {
            id: 'modular' as const,
            name: 'Sistema Modular',
            icon: '🧩',
            description: 'Componentes flexíveis e responsivos',
            pros: ['Responsivo', 'Reutilizável', 'Modular'],
            cons: ['Mais complexo']
        },
        {
            id: 'editor' as const,
            name: 'Editor Completo',
            icon: '🎨',
            description: 'Editor visual drag-and-drop',
            pros: ['Visual', 'Drag & Drop', 'Customizável'],
            cons: ['Mais pesado', 'Complexo']
        }
    ];

    // Dados do quiz para preview
    const userName = getBestUserName();
    const styleName = mapToFriendlyStyle((primaryStyle as any)?.category || 'Natural');
    const percentage = (primaryStyle as any)?.percentage || 75;

    return (
        <div className={cn('w-full space-y-6', className)}>
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-[#432818] mb-2">
                    🎯 Escolha o Sistema de Resultado
                </h2>
                <p className="text-[#6B4F43]">
                    Selecione como você quer exibir o resultado da etapa 20
                </p>
            </div>

            {/* Seletor de sistemas */}
            <div className="grid md:grid-cols-3 gap-4">
                {systems.map((system) => (
                    <Card
                        key={system.id}
                        className={cn(
                            'p-4 cursor-pointer transition-all duration-200 hover:shadow-lg',
                            selectedSystem === system.id
                                ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/5'
                                : 'border border-gray-200 hover:border-[#B89B7A]/50'
                        )}
                        onClick={() => handleSystemChange(system.id)}
                    >
                        <div className="text-center space-y-3">
                            <div className="text-3xl">{system.icon}</div>
                            <h3 className="font-semibold text-[#432818]">{system.name}</h3>
                            <p className="text-sm text-[#6B4F43]">{system.description}</p>

                            <div className="text-xs space-y-1">
                                <div>
                                    <span className="text-green-600">✓ </span>
                                    {system.pros.join(', ')}
                                </div>
                                {system.cons.length > 0 && (
                                    <div>
                                        <span className="text-orange-600">⚠ </span>
                                        {system.cons.join(', ')}
                                    </div>
                                )}
                            </div>

                            {selectedSystem === system.id && (
                                <div className="text-xs bg-[#B89B7A] text-white rounded-full px-3 py-1 inline-block">
                                    ✨ Selecionado
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Controles */}
            <div className="flex justify-center space-x-4">
                <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                >
                    {showPreview ? '👁️ Ocultar Preview' : '👀 Mostrar Preview'}
                </Button>

                {selectedSystem === 'editor' && (
                    <Button
                        onClick={() => {
                            // Abrir editor em nova janela/modal
                            window.open('/editor-modular-demo', '_blank');
                        }}
                        className="bg-[#B89B7A] hover:bg-[#A08966] text-white"
                    >
                        🎨 Abrir Editor Completo
                    </Button>
                )}
            </div>

            {/* Preview do sistema selecionado */}
            {showPreview && (
                <Card className="p-6">
                    <div className="mb-4 text-center">
                        <h3 className="text-lg font-semibold text-[#432818]">
                            📱 Preview: {systems.find(s => s.id === selectedSystem)?.name}
                        </h3>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        {selectedSystem === 'legacy' && (
                            <div className="p-8 bg-gray-50 text-center">
                                <div className="text-4xl mb-4">📊</div>
                                <h3 className="text-xl font-bold text-[#432818] mb-2">
                                    Estilo: {styleName}
                                </h3>
                                <p className="text-[#6B4F43] mb-4">
                                    Olá {userName}, sua compatibilidade é {percentage}%
                                </p>
                                <div className="bg-[#F3E8E6] rounded-full h-3 w-64 mx-auto">
                                    <div
                                        className="bg-[#B89B7A] h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {selectedSystem === 'modular' && primaryStyle && (
                            <ModularResultHeaderBlock
                                block={{
                                    id: 'preview-modular',
                                    type: 'modular-result-header',
                                    content: {},
                                    order: 0,
                                    properties: {
                                        containerLayout: 'two-column',
                                        backgroundColor: 'transparent',
                                        mobileLayout: 'stack',
                                        padding: 'lg',
                                        borderRadius: 'lg',
                                        userName,
                                        styleName,
                                        percentage
                                    }
                                }}
                                isSelected={false}
                                onPropertyChange={(key, value) => {
                                    console.log('Preview property changed:', key, value);
                                }}
                            />
                        )}

                        {selectedSystem === 'editor' && (
                            <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 text-center">
                                <div className="text-4xl mb-4">🎨</div>
                                <h3 className="text-xl font-bold text-[#432818] mb-2">
                                    Editor Visual Completo
                                </h3>
                                <p className="text-[#6B4F43] mb-4">
                                    Drag & drop, propriedades visuais, preview responsivo
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                    <div className="bg-white p-2 rounded">🏷️ Header</div>
                                    <div className="bg-white p-2 rounded">👤 User Info</div>
                                    <div className="bg-white p-2 rounded">📊 Progress</div>
                                    <div className="bg-white p-2 rounded">🖼️ Image</div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Step20SystemSelector;