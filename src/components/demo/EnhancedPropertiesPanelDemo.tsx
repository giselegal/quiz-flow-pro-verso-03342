/**
 * 🎯 ENHANCED PROPERTIES PANEL DEMO - DEMONSTRAÇÃO DO PAINEL APRIMORADO
 * 
 * Página de demonstração para testar todas as funcionalidades do novo
 * painel de propriedades aprimorado.
 */

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedNocodePropertiesPanel } from '@/components/editor/properties/EnhancedNocodePropertiesPanel';
import { MultipleChoiceOptionsPanel } from '@/components/editor/properties/MultipleChoiceOptionsPanel';
import { Settings, Play, Monitor, Smartphone, Tablet, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Block } from '@/types/editor';

// ===== MOCK DATA =====

const MOCK_BLOCKS: Block[] = [
  {
    id: 'demo-header',
    type: 'header',
    order: 0,
    properties: {
      showLogo: true,
      enableProgressBar: true,
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      backgroundColor: '#FEFDFB',
      textColor: '#432818'
    },
    content: {
      title: 'Quiz de Estilo Pessoal',
      subtitle: 'Descubra seu estilo único'
    }
  },
  {
    id: 'demo-question',
    type: 'text',
    order: 1,
    properties: {
      fontSize: 'large',
      fontWeight: 'bold',
      textColor: '#432818',
      alignment: 'center'
    },
    content: {
      text: 'Qual é o seu tipo de roupa favorita?'
    }
  },
  {
    id: 'demo-options',
    type: 'options-grid',
    order: 2,
    properties: {
      backgroundColor: '#B89B7A',
      textColor: '#FFFFFF',
      borderRadius: '8px',
      padding: '16px',
      hoverEffect: true
    },
    content: {
      label: 'Opções de Escolha',
      action: 'next-step'
    }
  }
];const QUIZ_STEPS = [
    { id: 'step-1', name: 'Questão 1: Estilo Favorito', type: 'question' },
    { id: 'step-2', name: 'Questão 2: Cores Preferidas', type: 'question' },
    { id: 'step-3', name: 'Questão 3: Ocasião', type: 'question' },
    { id: 'step-4', name: 'Resultado', type: 'result' }
];

// ===== MAIN COMPONENT =====

export default function EnhancedPropertiesPanelDemo() {
    // ===== STATE =====
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(MOCK_BLOCKS[0]);
    const [currentStep, setCurrentStep] = useState(1);
    const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [isDemoRunning, setIsDemoRunning] = useState(false);

    // ===== HANDLERS =====
    const handleBlockSelect = useCallback((block: Block) => {
        setSelectedBlock(block);
    }, []);

    const handlePropertyUpdate = useCallback((updates: Record<string, any>) => {
        if (!selectedBlock) return;

        setSelectedBlock(prev => prev ? {
            ...prev,
            properties: { ...prev.properties, ...updates },
            content: { ...prev.content, ...updates }
        } : null);

        console.log('🔄 Propriedades atualizadas:', updates);
    }, [selectedBlock]);

    const handleDeleteBlock = useCallback(() => {
        if (selectedBlock) {
            console.log('🗑️ Bloco excluído:', selectedBlock.id);
            setSelectedBlock(null);
        }
    }, [selectedBlock]);

    const handleDuplicateBlock = useCallback(() => {
        if (selectedBlock) {
            const duplicate = {
                ...selectedBlock,
                id: `${selectedBlock.id}-copy-${Date.now()}`
            };
            console.log('📋 Bloco duplicado:', duplicate);
        }
    }, [selectedBlock]);

    const handleRunDemo = useCallback(() => {
        setIsDemoRunning(true);

        // Simulate step progression
        let step = 1;
        const interval = setInterval(() => {
            step++;
            setCurrentStep(step);

            if (step > 4) {
                setCurrentStep(1);
                step = 0;
            }
        }, 2000);

        // Stop after 10 seconds
        setTimeout(() => {
            clearInterval(interval);
            setIsDemoRunning(false);
            setCurrentStep(1);
        }, 10000);
    }, []);

    // ===== RENDER =====
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        🚀 Enhanced Properties Panel Demo
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                        Sistema avançado de edição de propriedades para Quiz Builder
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Badge variant="secondary" className="px-3 py-1">
                            ✨ Novo Design
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1">
                            🎯 Performance Otimizada
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1">
                            🔧 Funcionalidades Avançadas
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Canvas/Preview Area */}
                    <div className="xl:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Monitor className="w-5 h-5" />
                                        Canvas de Visualização
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant={device === 'desktop' ? 'default' : 'outline'}
                                            onClick={() => setDevice('desktop')}
                                        >
                                            <Monitor className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={device === 'tablet' ? 'default' : 'outline'}
                                            onClick={() => setDevice('tablet')}
                                        >
                                            <Tablet className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={device === 'mobile' ? 'default' : 'outline'}
                                            onClick={() => setDevice('mobile')}
                                        >
                                            <Smartphone className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Etapa {currentStep} de 4</span>
                                    <Button
                                        size="sm"
                                        onClick={handleRunDemo}
                                        disabled={isDemoRunning}
                                        className="flex items-center gap-1"
                                    >
                                        <Play className="w-3 h-3" />
                                        {isDemoRunning ? 'Demo Rodando...' : 'Executar Demo'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Step Progress */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        {QUIZ_STEPS.map((step, index) => (
                                            <div
                                                key={step.id}
                                                className={`flex items-center gap-2 ${index + 1 === currentStep ? 'text-primary font-medium' : 'text-muted-foreground'
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${index + 1 === currentStep
                                                        ? 'bg-primary text-white'
                                                        : index + 1 < currentStep
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <span className="text-xs hidden sm:block">{step.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${(currentStep / 4) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Mock Canvas */}
                                <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all duration-300 ${device === 'desktop' ? 'min-h-[500px]' :
                                        device === 'tablet' ? 'min-h-[400px] max-w-md mx-auto' :
                                            'min-h-[300px] max-w-sm mx-auto'
                                    }`}>
                                    <div className="space-y-4">
                                        {MOCK_BLOCKS.map((block) => (
                                            <div
                                                key={block.id}
                                                onClick={() => handleBlockSelect(block)}
                                                className={cn(
                                                    "p-4 border rounded-lg cursor-pointer transition-all duration-200",
                                                    selectedBlock?.id === block.id
                                                        ? 'border-primary bg-primary/5 shadow-md'
                                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                )}
                                                style={{
                                                    backgroundColor: block.properties?.backgroundColor || 'transparent',
                                                    color: block.properties?.textColor || 'inherit'
                                                }}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {block.type}
                                                    </Badge>
                                                    {selectedBlock?.id === block.id && (
                                                        <Badge className="text-xs">Selecionado</Badge>
                                                    )}
                                                </div>
                                                <div className="font-medium">
                                                    {block.content.title || block.content.text || block.content.label || 'Sem conteúdo'}
                                                </div>
                                                {block.content.subtitle && (
                                                    <div className="text-sm opacity-75 mt-1">
                                                        {block.content.subtitle}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Selection Hint */}
                                    {!selectedBlock && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>Clique em um bloco para editar suas propriedades</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Properties Panel */}
                    <div className="xl:col-span-1">
                        {selectedBlock?.type === 'options-grid' ? (
                            <MultipleChoiceOptionsPanel
                                selectedBlock={selectedBlock}
                                onUpdate={handlePropertyUpdate}
                                onDelete={handleDeleteBlock}
                                onDuplicate={handleDuplicateBlock}
                                onClose={() => setSelectedBlock(null)}
                                className="sticky top-6"
                            />
                        ) : (
                            <EnhancedNocodePropertiesPanel
                                selectedBlock={selectedBlock}
                                currentStep={currentStep}
                                totalSteps={4}
                                onUpdate={handlePropertyUpdate}
                                onDelete={handleDeleteBlock}
                                onDuplicate={handleDuplicateBlock}
                                onClose={() => setSelectedBlock(null)}
                            />
                        )}
                    </div>
                </div>

                {/* Features Showcase */}
                <div className="mt-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">🌟 Principais Funcionalidades</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Settings className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="font-medium mb-2">Interface Modernizada</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Design renovado com tabs, tooltips e animações suaves
                                    </p>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Play className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="font-medium mb-2">Preview em Tempo Real</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Visualize mudanças instantaneamente no canvas
                                    </p>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Grid className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h3 className="font-medium mb-2">Painel Especializado</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Painel específico para blocos de opções múltiplas
                                    </p>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Monitor className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <h3 className="font-medium mb-2">Multi-Device</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Teste em diferentes tamanhos de tela
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
