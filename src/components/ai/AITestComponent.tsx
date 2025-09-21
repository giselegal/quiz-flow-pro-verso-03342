import { useState } from 'react';
import { Bot, Sparkles, Zap, AlertCircle, CheckCircle, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/hooks/useAI';

export function AITestComponent() {
    const [prompt, setPrompt] = useState('');
    const [selectedFunction, setSelectedFunction] = useState<'content' | 'quiz' | 'funnel' | 'text' | 'design'>('quiz');
    const [result, setResult] = useState<any>(null);

    const {
        isLoading,
        error,
        generateContent,
        generateQuiz,
        generateFunnel,
        improveText,
        generateDesign,
        isConfigured,
        reset
    } = useAI();

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        reset();
        let response = null;

        try {
            switch (selectedFunction) {
                case 'content':
                    response = await generateContent([
                        { role: 'user', content: prompt }
                    ]);
                    setResult(response?.content);
                    break;

                case 'quiz':
                    response = await generateQuiz(prompt);
                    setResult(response);
                    break;

                case 'funnel':
                    response = await generateFunnel(prompt);
                    setResult(response);
                    break;

                case 'text':
                    response = await improveText(prompt);
                    setResult(response);
                    break;

                case 'design':
                    response = await generateDesign(prompt);
                    setResult(response);
                    break;
            }
        } catch (err) {
            console.error('Erro ao gerar:', err);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const exportResult = () => {
        if (!result) return;

        const dataStr = JSON.stringify(result, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-result-${selectedFunction}-${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    };

    if (!isConfigured) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        IA não configurada
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Para usar a IA, você precisa configurar o token do GitHub Models:
                        </p>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">🔧 Como configurar:</h4>
                            <ol className="space-y-2 text-sm">
                                <li>1. Acesse <a href="https://github.com/settings/tokens" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHub Settings → Personal Access Tokens</a></li>
                                <li>2. Crie um novo token com permissão para <code className="bg-gray-200 px-1 rounded">models:read</code></li>
                                <li>3. Adicione no arquivo <code className="bg-gray-200 px-1 rounded">.env</code>:</li>
                            </ol>
                            <pre className="bg-gray-800 text-green-400 p-2 rounded mt-2 text-xs overflow-x-auto">
                                {`VITE_GITHUB_MODELS_TOKEN=seu_token_aqui`}
                            </pre>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-blue-800">✨ Modelos disponíveis GRÁTIS:</h4>
                            <ul className="text-sm space-y-1 text-blue-700">
                                <li>• GPT-4o, GPT-4o mini</li>
                                <li>• Claude 3.5 Sonnet</li>
                                <li>• Llama 3.1 405B</li>
                                <li>• Phi-3.5 MoE, Mistral Large 2</li>
                                <li>• Limite: 15 requests/minuto</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="w-6 h-6 text-blue-600" />
                        Teste GitHub Models IA
                        <Badge className="bg-green-100 text-green-800">
                            ✅ Configurado
                        </Badge>
                    </CardTitle>
                </CardHeader>
            </Card>

            {/* Input Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        Gerador de Conteúdo IA
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Function Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Tipo de Geração:</label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: 'quiz', label: '📋 Quiz', desc: 'Gerar quiz interativo' },
                                { key: 'funnel', label: '🚀 Funil', desc: 'Gerar steps de funil' },
                                { key: 'content', label: '📝 Conteúdo', desc: 'Gerar texto livre' },
                                { key: 'text', label: '✨ Melhorar Texto', desc: 'Otimizar copy' },
                                { key: 'design', label: '🎨 Design', desc: 'Gerar paleta de cores' }
                            ].map(({ key, label, desc }) => (
                                <Button
                                    key={key}
                                    variant={selectedFunction === key ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedFunction(key as any)}
                                    title={desc}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Prompt Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Prompt:</label>
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={
                                selectedFunction === 'quiz' ? 'Ex: Crie um quiz sobre sustentabilidade com 5 perguntas...' :
                                    selectedFunction === 'funnel' ? 'Ex: Crie um funil de conversão para curso de marketing digital...' :
                                        selectedFunction === 'text' ? 'Ex: Melhore este texto: "Nosso produto é muito bom..."' :
                                            selectedFunction === 'design' ? 'Ex: Tema moderno e elegante para marca de luxo...' :
                                                'Ex: Escreva sobre...'
                            }
                            rows={4}
                            className="w-full"
                        />
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isLoading}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Zap className="w-4 h-4 mr-2 animate-spin" />
                                Gerando...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Gerar com IA
                            </>
                        )}
                    </Button>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-red-800">
                                <AlertCircle className="w-4 h-4" />
                                <span className="font-medium">Erro:</span>
                            </div>
                            <p className="text-red-700 mt-1">{error}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Result Section */}
            {result && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Resultado Gerado
                            </CardTitle>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(typeof result === 'string' ? result : JSON.stringify(result, null, 2))}
                                >
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copiar
                                </Button>

                                {typeof result === 'object' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={exportResult}
                                    >
                                        <Download className="w-4 h-4 mr-1" />
                                        Baixar JSON
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {typeof result === 'string' ? (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                                <pre className="text-xs text-gray-800">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default AITestComponent;