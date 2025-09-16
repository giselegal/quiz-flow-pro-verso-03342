import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Palette, Image as ImageIcon, Layout, Settings, Zap, Wand2, Eye, Edit3, Play, ArrowRight, CheckCircle } from 'lucide-react';
import type { PropertyEditorProps } from '../interfaces/PropertyEditor';

/**
 * ProductionPreviewMode - Componente de preview funcional com simulação de produção
 */
const ProductionPreviewMode: React.FC<{
    block: any;
    onBack: () => void;
    onUpdate: (patch: Record<string, any>) => void;
}> = ({ block, onBack, onUpdate }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [quizStarted, setQuizStarted] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const props = block?.properties || {};

    // Simulação de perguntas do quiz
    const mockQuestions = [
        {
            id: 1,
            question: "Qual estilo mais combina com você?",
            options: [
                { id: 'natural', text: 'Natural e despojado', style: 'Natural' },
                { id: 'elegante', text: 'Elegante e sofisticado', style: 'Elegante' },
                { id: 'boho', text: 'Boho e descontraído', style: 'Boho' },
                { id: 'moderno', text: 'Moderno e minimalista', style: 'Moderno' }
            ]
        },
        {
            id: 2,
            question: "Em qual ambiente você se sente mais à vontade?",
            options: [
                { id: 'casa', text: 'Em casa, relaxando', style: 'Natural' },
                { id: 'evento', text: 'Em eventos sociais', style: 'Elegante' },
                { id: 'natureza', text: 'Na natureza', style: 'Boho' },
                { id: 'cidade', text: 'Na cidade urbana', style: 'Moderno' }
            ]
        },
        {
            id: 3,
            question: "Qual cor predomina no seu guarda-roupa?",
            options: [
                { id: 'neutras', text: 'Cores neutras e terrosas', style: 'Natural' },
                { id: 'escuras', text: 'Preto, cinza e navy', style: 'Elegante' },
                { id: 'quentes', text: 'Cores quentes e vibrantes', style: 'Boho' },
                { id: 'clean', text: 'Branco e cores clean', style: 'Moderno' }
            ]
        }
    ];

    // Calcular resultado baseado nas respostas
    const calculateResult = useCallback(() => {
        const styleCount: Record<string, number> = {};
        
        Object.values(selectedAnswers).forEach(answerId => {
            const question = mockQuestions.find(q => 
                q.options.some(opt => opt.id === answerId)
            );
            const option = question?.options.find(opt => opt.id === answerId);
            if (option) {
                styleCount[option.style] = (styleCount[option.style] || 0) + 1;
            }
        });

        const dominantStyle = Object.entries(styleCount)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Natural';
        
        const percentage = Math.max(60, Math.min(95, 
            (styleCount[dominantStyle] / mockQuestions.length) * 100 + Math.random() * 15
        ));

        return {
            style: dominantStyle,
            percentage: Math.round(percentage),
            description: getStyleDescription(dominantStyle)
        };
    }, [selectedAnswers]);

    const getStyleDescription = (style: string) => {
        const descriptions = {
            Natural: "Você tem um estilo natural e autêntico, priorizando o conforto sem abrir mão da elegância.",
            Elegante: "Seu estilo é sofisticado e clássico, com peças atemporais e bem estruturadas.",
            Boho: "Você expressa criatividade através do estilo boêmio, com peças únicas e descontraídas.",
            Moderno: "Seu estilo é clean e contemporâneo, com linhas simples e cores neutras."
        };
        return descriptions[style] || descriptions.Natural;
    };

    // Auto avanço
    const handleAutoAdvance = useCallback(() => {
        if (currentStep < mockQuestions.length) {
            setIsAutoAdvancing(true);
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setIsAutoAdvancing(false);
            }, 1500);
        } else {
            setShowResults(true);
        }
    }, [currentStep]);

    // Seleção de resposta
    const handleAnswerSelect = (answerId: string) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentStep]: answerId
        }));
        
        // Auto avanço após seleção
        setTimeout(() => {
            handleAutoAdvance();
        }, 800);
    };

    const result = showResults ? calculateResult() : null;

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Play className="h-4 w-4 text-green-600" /> 
                        Preview de Produção
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                            Funcional
                        </Badge>
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <Edit3 className="h-3 w-3 mr-1" />
                        Voltar ao Editor
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-auto p-0">
                {!quizStarted && (
                    <div className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full mx-auto flex items-center justify-center">
                            <Zap className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#432818]">
                            Descubra Seu Estilo Pessoal
                        </h3>
                        <p className="text-[#6B4F43] max-w-sm mx-auto">
                            Responda 3 perguntas rápidas e descubra qual estilo combina perfeitamente com você.
                        </p>
                        <Button 
                            onClick={() => setQuizStarted(true)}
                            className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-8 py-3"
                        >
                            Começar Quiz
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                )}

                {quizStarted && !showResults && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between text-sm text-[#6B4F43]">
                            <span>Pergunta {currentStep} de {mockQuestions.length}</span>
                            <div className="flex gap-1">
                                {mockQuestions.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-2 h-2 rounded-full ${
                                            i < currentStep - 1 ? 'bg-green-500' :
                                            i === currentStep - 1 ? 'bg-[#B89B7A]' : 
                                            'bg-gray-200'
                                        }`} 
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#F3E8E6] rounded-xl p-4 mb-6">
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                <div 
                                    className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(currentStep / mockQuestions.length) * 100}%` }}
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-[#432818] mb-4">
                                {mockQuestions[currentStep - 1]?.question}
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {mockQuestions[currentStep - 1]?.options.map((option) => {
                                const isSelected = selectedAnswers[currentStep] === option.id;
                                const isAdvancing = isSelected && isAutoAdvancing;
                                
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleAnswerSelect(option.id)}
                                        disabled={selectedAnswers[currentStep] || isAutoAdvancing}
                                        className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-300 ${
                                            isSelected 
                                                ? 'border-[#B89B7A] bg-[#B89B7A]/10' 
                                                : 'border-gray-200 hover:border-[#B89B7A]/50 hover:bg-[#B89B7A]/5'
                                        } ${isAdvancing ? 'animate-pulse' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#432818]">{option.text}</span>
                                            {isSelected && (
                                                <CheckCircle className="h-5 w-5 text-[#B89B7A]" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {isAutoAdvancing && (
                            <div className="text-center py-4">
                                <div className="inline-flex items-center gap-2 text-[#6B4F43]">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#B89B7A] border-t-transparent" />
                                    <span className="text-sm">Próxima pergunta...</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {showResults && result && (
                    <div className="p-6 space-y-6">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full mx-auto flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#432818] mb-2">
                                    Parabéns! 🎉
                                </h2>
                                <p className="text-[#6B4F43]">Descobrimos seu estilo pessoal</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#B89B7A]/10 to-[#aa6b5d]/10 rounded-2xl p-6 text-center">
                            <h3 className="text-xl font-bold text-[#432818] mb-2">
                                Seu estilo é: <span className="text-[#B89B7A]">{result.style}</span>
                            </h3>
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <span className="text-sm text-[#6B4F43]">Compatibilidade:</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] h-2 rounded-full"
                                            style={{ width: `${result.percentage}%` }}
                                        />
                                    </div>
                                    <span className="font-semibold text-[#B89B7A]">{result.percentage}%</span>
                                </div>
                            </div>
                            <p className="text-[#6B4F43] text-sm">{result.description}</p>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h4 className="font-semibold text-[#432818]">🎯 Configurações do Componente</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <Label className="text-xs text-[#6B4F43]">Título Atual</Label>
                                    <p className="text-[#432818] truncate">{props.title || "Seu Estilo Predominante"}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-[#6B4F43]">Resultado Simulado</Label>
                                    <p className="text-[#B89B7A] font-medium">{result.style} ({result.percentage}%)</p>
                                </div>
                            </div>

                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => {
                                    // Aplicar resultado ao componente
                                    onUpdate({
                                        title: `Seu estilo é ${result.style}!`,
                                        subtitle: `${result.percentage}% de compatibilidade`,
                                        percentage: result.percentage,
                                        description: result.description
                                    });
                                }}
                            >
                                <Wand2 className="h-3 w-3 mr-2" />
                                Aplicar Resultado ao Componente
                            </Button>
                        </div>

                        <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => {
                                setQuizStarted(false);
                                setShowResults(false);
                                setCurrentStep(1);
                                setSelectedAnswers({});
                            }}
                        >
                            🔄 Refazer Quiz
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

/**
 * ResultCommonPropertyEditor
 * Editor unificado para componentes de resultado:
 * - result-header-inline
 * - modular-result-header
 * - quiz-result-header / quiz-result-style / quiz-result-secondary
 * - result-card
 */
export const ResultCommonPropertyEditor: React.FC<PropertyEditorProps> = ({
    block,
    onUpdate,
    onValidate,
    isPreviewMode = false,
}) => {
    const [tab, setTab] = useState('content');
    const [showProductionPreview, setShowProductionPreview] = useState(false);

    const props = block?.properties || {};

    const update = useCallback((patch: Record<string, any>) => {
        onUpdate?.(patch);
        // Validação básica: título obrigatório para header principal
        const titleValid = typeof (patch.title ?? props.title) === 'string' && (patch.title ?? props.title)?.trim().length > 0;
        onValidate?.(titleValid);
    }, [onUpdate, onValidate, props.title]);

    const componentType = block?.type || '';
    const isHeader = /result-header|quiz-result-header|modular-result-header/.test(componentType);
    const supportsImages = isHeader || componentType.includes('style') || componentType.includes('card');
    const supportsSecondary = componentType.includes('modular') || componentType.includes('style') || componentType.includes('secondary');

    // Presets simples (MVP)
    const presets = useMemo(() => ([
        {
            key: 'minimal',
            label: 'Minimal',
            patch: { showBothImages: false, showSpecialTips: false, backgroundColor: 'transparent', spacing: 'compact' }
        },
        {
            key: 'visual',
            label: 'Destaque Visual',
            patch: { showBothImages: true, showSpecialTips: true, backgroundColor: '#FFF8F3', spacing: 'relaxed', showBorder: true, borderColor: '#B89B7A' }
        },
        {
            key: 'guide',
            label: 'Guia + Imagem',
            patch: { showBothImages: true, showSpecialTips: true, guideImageUrl: props.guideImageUrl || '', styleGuideImageUrl: props.styleGuideImageUrl || '' }
        }
    ]), [props.guideImageUrl, props.styleGuideImageUrl]);

    // Se está no modo preview de produção, mostrar o componente funcional
    if (showProductionPreview) {
        return (
            <ProductionPreviewMode 
                block={block}
                onBack={() => setShowProductionPreview(false)}
                onUpdate={update}
            />
        );
    }

    if (isPreviewMode) {
        return <div className="p-4 text-sm text-muted-foreground">Modo preview - edição desativada</div>;
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" /> Editor de Resultado
                    </CardTitle>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowProductionPreview(true)}
                        className="gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                        <Eye className="h-3 w-3" />
                        Preview Funcional
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {presets.map(p => (
                        <Button key={p.key} size="xs" variant="outline" onClick={() => update(p.patch)} className="h-6 text-[11px] px-2">
                            <Wand2 className="h-3 w-3 mr-1" />{p.label}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="pt-0 overflow-auto">
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="grid grid-cols-5 mb-4">
                        <TabsTrigger value="content">Conteúdo</TabsTrigger>
                        <TabsTrigger value="images" disabled={!supportsImages}>Imagens</TabsTrigger>
                        <TabsTrigger value="layout">Layout</TabsTrigger>
                        <TabsTrigger value="style">Estilo</TabsTrigger>
                        <TabsTrigger value="dynamic">Dinâmica</TabsTrigger>
                    </TabsList>

                    {/* Conteúdo */}
                    <TabsContent value="content" className="space-y-4">
                        <div>
                            <Label>Título</Label>
                            <Input defaultValue={props.title} placeholder="Título do resultado" onChange={e => update({ title: e.target.value })} />
                        </div>
                        <div>
                            <Label>Subtítulo</Label>
                            <Input defaultValue={props.subtitle} placeholder="Subtítulo" onChange={e => update({ subtitle: e.target.value })} />
                        </div>
                        <div>
                            <Label>Descrição</Label>
                            <Textarea defaultValue={props.description} rows={4} placeholder="Descrição explicativa" onChange={e => update({ description: e.target.value })} />
                        </div>
                        {isHeader && (
                            <div className="flex items-center justify-between">
                                <Label>Mostrar nome do usuário</Label>
                                <Switch checked={!!props.showUserName} onCheckedChange={v => update({ showUserName: v })} />
                            </div>
                        )}
                    </TabsContent>

                    {/* Imagens */}
                    <TabsContent value="images" className="space-y-4">
                        <div>
                            <Label>Imagem Principal (imageUrl)</Label>
                            <Input defaultValue={props.imageUrl} placeholder="https://..." onChange={e => update({ imageUrl: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Mostrar duas imagens</Label>
                            <Switch checked={!!props.showBothImages} onCheckedChange={v => update({ showBothImages: v })} />
                        </div>
                        {props.showBothImages && (
                            <>
                                <div>
                                    <Label>Imagem Guia (guideImageUrl)</Label>
                                    <Input defaultValue={props.guideImageUrl} placeholder="https://..." onChange={e => update({ guideImageUrl: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Imagem Estilo (styleGuideImageUrl)</Label>
                                    <Input defaultValue={props.styleGuideImageUrl} placeholder="https://..." onChange={e => update({ styleGuideImageUrl: e.target.value })} />
                                </div>
                            </>
                        )}
                    </TabsContent>

                    {/* Layout */}
                    <TabsContent value="layout" className="space-y-4">
                        <div>
                            <Label>Largura do Container</Label>
                            <Select defaultValue={props.containerWidth || 'full'} onValueChange={v => update({ containerWidth: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                    <SelectItem value="full">Full</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Espaçamento</Label>
                            <Select defaultValue={props.spacing || 'normal'} onValueChange={v => update({ spacing: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="compact">Compacto</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="relaxed">Relaxado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Alinhamento do Texto</Label>
                            <Select defaultValue={props.textAlign || 'center'} onValueChange={v => update({ textAlign: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="left">Esquerda</SelectItem>
                                    <SelectItem value="center">Centro</SelectItem>
                                    <SelectItem value="right">Direita</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Margin Top</Label>
                                <Input type="number" defaultValue={props.marginTop ?? 0} onChange={e => update({ marginTop: Number(e.target.value) })} />
                            </div>
                            <div>
                                <Label>Margin Bottom</Label>
                                <Input type="number" defaultValue={props.marginBottom ?? 0} onChange={e => update({ marginBottom: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div>
                            <Label>Variante Mobile</Label>
                            <Select defaultValue={props.mobileVariant || 'stack'} onValueChange={v => update({ mobileVariant: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="stack">Stack</SelectItem>
                                    <SelectItem value="compact">Compact</SelectItem>
                                    <SelectItem value="minimal">Minimal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>

                    {/* Estilo */}
                    <TabsContent value="style" className="space-y-4">
                        <div>
                            <Label>Cor de Fundo</Label>
                            <Input type="color" defaultValue={props.backgroundColor || '#FFFFFF'} onChange={e => update({ backgroundColor: e.target.value })} />
                        </div>
                        <div>
                            <Label>Cor da Borda</Label>
                            <Input type="color" defaultValue={props.borderColor || '#E5E7EB'} onChange={e => update({ borderColor: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Mostrar Borda</Label>
                            <Switch checked={!!props.showBorder} onCheckedChange={v => update({ showBorder: v })} />
                        </div>
                        <div>
                            <Label>Cor do Progresso</Label>
                            <Input type="color" defaultValue={props.progressColor || '#B89B7A'} onChange={e => update({ progressColor: e.target.value })} />
                        </div>
                        <div>
                            <Label>Badge Text</Label>
                            <Input defaultValue={props.badgeText || 'Exclusivo'} onChange={e => update({ badgeText: e.target.value })} />
                        </div>
                    </TabsContent>

                    {/* Dinâmica */}
                    <TabsContent value="dynamic" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Mostrar Dicas Especiais</Label>
                            <Switch checked={!!props.showSpecialTips} onCheckedChange={v => update({ showSpecialTips: v })} />
                        </div>
                        <div>
                            <Label>Override de Percentual (opcional)</Label>
                            <Input type="number" defaultValue={props.percentage ?? ''} placeholder="Ex: 78" onChange={e => update({ percentage: e.target.value ? Number(e.target.value) : undefined })} />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default ResultCommonPropertyEditor;
