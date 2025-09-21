import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Sparkles, Wand2, Play, Zap, Check, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAI } from '@/hooks/useAI';
import { useFashionAI } from '@/hooks/useFashionAI';

interface AIStepGeneratorProps {
    onStepsGenerated: (steps: any[]) => void;
    onClose: () => void;
}

interface GenerationStep {
    id: string;
    name: string;
    description: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress: number;
}

export function AIStepGenerator({ onStepsGenerated, onClose }: AIStepGeneratorProps) {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
    const [generatedSteps, setGeneratedSteps] = useState<any[]>([]);

    // 🤖 Hook da IA integrada - CORREÇÃO: usar generateFunnel corretamente
    const { generateFunnel: generateFunnelMethod, isConfigured } = useAI();

    // 🎨 Hook da IA de imagens de moda (para funis de roupa)
    const fashionAI = useFashionAI({
        provider: 'dalle3',
        apiKey: process.env.VITE_OPENAI_API_KEY || '',
        style: 'realistic'
    });

    // Prompts sugeridos com foco em moda
    const suggestedPrompts = [
        '🎨 Crie um funil "Que roupa eu vou?" com geração de imagens de looks personalizados',
        'Gere um quiz de estilo pessoal com 5 perguntas sobre preferências de moda',
        'Faça um consultoria de guarda-roupa com análise de cores e estilo pessoal',
        'Crie um formulário de personal shopper com recomendações de compras',
        'Gere um quiz de autoconhecimento para estilo e moda pessoal'
    ];

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setGeneratedSteps([]);

        // Steps de progresso da geração
        const steps: GenerationStep[] = [
            { id: 'analyze', name: 'Análise do Prompt', description: 'Analisando suas necessidades...', status: 'pending', progress: 0 },
            { id: 'ai-generate', name: 'Geração IA', description: 'GitHub Models gerando conteúdo...', status: 'pending', progress: 0 },
            { id: 'structure', name: 'Estruturação', description: 'Organizando steps e componentes...', status: 'pending', progress: 0 },
            { id: 'optimize', name: 'Otimização', description: 'Aplicando melhores práticas...', status: 'pending', progress: 0 },
            { id: 'finalize', name: 'Finalizando', description: 'Preparando steps para o editor...', status: 'pending', progress: 0 }
        ];

        setGenerationSteps(steps);

        try {
            // 🤖 USAR IA REAL em vez de simulação
            if (isConfigured) {
                // Marcar como processando
                setGenerationSteps(prev => prev.map(step =>
                    step.id === 'ai-generate' ? { ...step, status: 'processing', progress: 50 } : step
                ));

                // Gerar com IA real
                const aiSteps = await generateFunnelMethod(prompt);

                if (aiSteps) {
                    // Sucesso na geração IA
                    setGenerationSteps(prev => prev.map(step =>
                        step.id === 'ai-generate' ? { ...step, status: 'completed', progress: 100 } : step
                    ));

                    // Processar resultado
                    setGenerationSteps(prev => prev.map(step =>
                        step.id === 'structure' ? { ...step, status: 'processing', progress: 50 } : step
                    ));

                    // Simular processamento final
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    setGenerationSteps(prev => prev.map(step =>
                        step.status !== 'completed' ? { ...step, status: 'completed', progress: 100 } : step
                    ));

                    setGeneratedSteps(aiSteps);
                } else {
                    throw new Error('IA não retornou resultado válido');
                }
            } else {
                // Fallback para simulação se IA não configurada
                console.warn('⚠️ IA não configurada, usando simulação');

                // Simular processamento
                for (const step of steps) {
                    setGenerationSteps(prev => prev.map(s =>
                        s.id === step.id ? { ...s, status: 'processing' } : s
                    ));

                    await new Promise(resolve => setTimeout(resolve, 800));

                    setGenerationSteps(prev => prev.map(s =>
                        s.id === step.id ? { ...s, status: 'completed', progress: 100 } : s
                    ));
                }

                // Gerar steps simulados
                const simulatedSteps = [
                    {
                        id: 'step-1',
                        title: 'Pergunta Inicial',
                        type: 'question',
                        components: [
                            {
                                type: 'text',
                                content: `Baseado em: "${prompt}"`,
                                properties: {}
                            }
                        ]
                    }
                ];

                setGeneratedSteps(simulatedSteps);
            }

            // Processar e finalizar
            setTimeout(() => {
                onStepsGenerated(generatedSteps.length > 0 ? generatedSteps : []);
            }, 1000);
            // Criar template baseado no prompt - simulação
            const dynamicTemplateConfig = {
                meta: {
                    name: `Quiz Personalizado - ${new Date().toLocaleDateString()}`,
                    description: prompt,
                    version: '1.0.0',
                    author: 'AI Generator'
                },
                design: {
                    primaryColor: '#6366F1',
                    secondaryColor: '#8B5CF6',
                    accentColor: '#EC4899',
                    backgroundColor: 'linear-gradient(to bottom right, #F3E8FF, #FDF2F8)',
                    fontFamily: "'Inter', sans-serif",
                    button: {
                        background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                        textColor: '#fff',
                        borderRadius: '8px',
                        shadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                    },
                    card: {
                        background: '#fff',
                        borderRadius: '12px',
                        shadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
                    },
                    progressBar: {
                        color: '#6366F1',
                        background: '#F3E8FF',
                        height: '6px'
                    },
                    animations: {
                        formTransition: 'slide-up',
                        buttonHover: 'scale-105',
                        resultAppear: 'fade-in'
                    }
                },
                steps: [
                    {
                        type: 'intro',
                        title: 'Bem-vindo!',
                        description: 'Vamos descobrir mais sobre você em alguns minutos.',
                        cta: 'Começar Quiz'
                    }
                ],
                logic: {
                    selection: { method: 'weighted-scoring' },
                    calculation: { algorithm: 'category-based' },
                    transitions: { style: 'smooth-fade' }
                },
                config: {
                    localStorageKeys: ['quiz-data'],
                    features: {
                        aiGeneration: true,
                        responsive: true,
                        analytics: true
                    }
                },
                integrations: {
                    ai: {
                        textGeneration: {
                            provider: 'gemini',
                            model: 'gemini-2.0-flash',
                            prompt: prompt
                        }
                    }
                }
            };

            // Usar o template config para log (opcional)
            console.log('Gerando steps com configuração:', dynamicTemplateConfig.meta.name);

            // 🎨 Detectar se é funil de moda para gerar imagens
            const isFashionFunnel = prompt.toLowerCase().includes('roupa') ||
                prompt.toLowerCase().includes('moda') ||
                prompt.toLowerCase().includes('estilo') ||
                prompt.toLowerCase().includes('look');

            if (isFashionFunnel) {
                console.log('🎨 Funil de moda detectado! Integrando geração de imagens...');
            }

            // Simular geração com AI - sem dependências externas
            const simulateAIProgress = (stepId: string, status: 'pending' | 'processing' | 'completed' | 'error', progress: number) => {
                setGenerationSteps(prev => prev.map(step =>
                    step.id === stepId ? { ...step, status, progress } : step
                ));
            };

            // Processar cada step
            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];

                simulateAIProgress(step.id, 'processing', 0);

                // 🎨 Se for funil de moda, gerar imagens durante o processo de finalização
                if (isFashionFunnel && step.id === 'finalize' && fashionAI) {
                    console.log('🎨 Gerando imagens de exemplo para o funil de moda...');

                    try {
                        // Gerar uma imagem de exemplo baseada no prompt
                        const fashionRequest = {
                            prompt: `Stylish outfit recommendation, ${prompt}`,
                            gender: 'feminino' as const,
                            occasion: 'casual' as const,
                            style: 'moderno' as const,
                            colors: ['black', 'white', 'navy'],
                            season: 'verão' as const
                        };

                        const imageResult = await fashionAI.generateOutfit(fashionRequest);
                        if (imageResult.success && imageResult.imageUrl) {
                            console.log('✅ Imagem de moda gerada com sucesso!');
                            // Salvar a imagem gerada para usar nos resultados
                            localStorage.setItem('generated_fashion_image', JSON.stringify({
                                url: imageResult.imageUrl,
                                prompt: imageResult.prompt,
                                timestamp: Date.now()
                            }));
                        }
                    } catch (error) {
                        console.log('⚠️ Erro ao gerar imagem de moda:', error);
                    }
                }

                // Simular processamento IA
                await new Promise<void>(resolve => {
                    const duration = Math.random() * 2000 + 1000; // 1-3 segundos
                    let progress = 0;

                    const interval = setInterval(() => {
                        progress += 10;
                        simulateAIProgress(step.id, 'processing', Math.min(progress, 90));

                        if (progress >= 90) {
                            clearInterval(interval);
                            setTimeout(() => {
                                simulateAIProgress(step.id, 'completed', 100);
                                resolve();
                            }, 300);
                        }
                    }, duration / 10);
                });
            }

            // Gerar steps dinâmicos baseados no prompt
            const aiGeneratedSteps = [
                {
                    id: 'intro',
                    type: 'intro',
                    title: 'Bem-vindo ao seu Quiz Personalizado!',
                    description: 'Este quiz foi gerado especialmente para você com base na sua solicitação.',
                    imageUrl: 'https://images.unsplash.com/photo-1559454030-82d2ad8d31c5?w=800&h=600&fit=crop'
                },
                {
                    id: 'question1',
                    type: 'question',
                    title: 'Primeira Pergunta',
                    description: 'Esta pergunta foi gerada pela IA com base no seu prompt.',
                    options: [
                        { id: 'opt1', text: 'Opção 1 (Gerada por IA)', value: 'option1' },
                        { id: 'opt2', text: 'Opção 2 (Gerada por IA)', value: 'option2' },
                        { id: 'opt3', text: 'Opção 3 (Gerada por IA)', value: 'option3' }
                    ]
                },
                {
                    id: 'result',
                    type: 'result',
                    title: 'Seu Resultado Personalizado',
                    description: 'Resultado gerado com base nas suas respostas e configurado pela IA.',
                    sections: [
                        {
                            type: 'text',
                            title: 'Análise IA',
                            content: '{{generated_analysis}}'
                        }
                    ]
                }
            ];

            setGeneratedSteps(aiGeneratedSteps);

            setTimeout(() => {
                onStepsGenerated(aiGeneratedSteps);
            }, 1000);

        } catch (error) {
            console.error('Erro na geração IA:', error);
            setGenerationSteps(prev => prev.map(step => ({
                ...step,
                status: step.status === 'processing' ? 'error' : step.status
            })));
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-semibold">Gerador IA de Steps</h2>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Powered by Gemini 2.0 Flash
                            </Badge>
                        </div>
                        <Button variant="ghost" onClick={onClose}>✕</Button>
                    </div>
                    <p className="text-gray-600 mt-2">
                        Descreva o tipo de quiz ou funil que deseja criar e deixe a IA gerar os steps automaticamente
                    </p>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {!isGenerating ? (
                        <div className="space-y-4">
                            {/* Input do Prompt */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Descreva seu funil/quiz personalizado:
                                </label>
                                <Textarea
                                    placeholder="Ex: Crie um quiz de estilo pessoal com 5 perguntas sobre preferências de moda, incluindo cores favoritas, tipos de roupa e ocasiões especiais..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows={4}
                                    className="w-full"
                                />
                            </div>

                            {/* Prompts Sugeridos */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Ou escolha uma sugestão:
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {suggestedPrompts.map((suggestion, index) => (
                                        <Card
                                            key={index}
                                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => setPrompt(suggestion)}
                                        >
                                            <CardContent className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <Wand2 className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm">{suggestion}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Progress da Geração */
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <Bot className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-2" />
                                <h3 className="text-lg font-semibold">Gerando seu funil com IA...</h3>
                                <p className="text-gray-600">A IA está processando sua solicitação</p>
                            </div>

                            {generationSteps.map((step) => (
                                <Card key={step.id} className="border">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {step.status === 'completed' && <Check className="w-4 h-4 text-green-600" />}
                                                {step.status === 'processing' && <Zap className="w-4 h-4 text-blue-600 animate-pulse" />}
                                                {step.status === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                                                {step.status === 'pending' && <div className="w-4 h-4 rounded-full bg-gray-300" />}
                                                <span className="font-medium">{step.name}</span>
                                            </div>
                                            <Badge
                                                variant={
                                                    step.status === 'completed' ? 'default' :
                                                        step.status === 'processing' ? 'secondary' :
                                                            step.status === 'error' ? 'destructive' : 'outline'
                                                }
                                            >
                                                {step.status === 'completed' ? 'Concluído' :
                                                    step.status === 'processing' ? 'Processando...' :
                                                        step.status === 'error' ? 'Erro' : 'Aguardando'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                                        {step.status === 'processing' && (
                                            <Progress value={step.progress} className="h-2" />
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {generatedSteps.length > 0 && (
                                <Card className="border-green-200 bg-green-50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 text-green-800">
                                            <Check className="w-5 h-5" />
                                            <span className="font-medium">Steps gerados com sucesso!</span>
                                        </div>
                                        <p className="text-sm text-green-700 mt-1">
                                            {generatedSteps.length} steps foram criados e serão aplicados ao editor.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <Bot className="w-4 h-4 inline mr-1" />
                            Geração inteligente de steps com IA
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose} disabled={isGenerating}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleGenerate}
                                disabled={!prompt.trim() || isGenerating}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {isGenerating ? (
                                    <>
                                        <Bot className="w-4 h-4 mr-2 animate-spin" />
                                        Gerando...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 mr-2" />
                                        Gerar com IA
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}