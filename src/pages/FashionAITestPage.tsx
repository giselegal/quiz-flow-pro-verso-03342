import { useState, useEffect } from 'react';
import { Palette, Sparkles, Image as ImageIcon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FashionImageGenerator from '../components/ai/FashionImageGenerator';

export function FashionAITestPage() {
    const [isConfigured, setIsConfigured] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [provider, setProvider] = useState<'dalle3' | 'stable-diffusion'>('dalle3');
    const [generatedCount, setGeneratedCount] = useState(0);

    useEffect(() => {
        // Verificar se há API key configurada
        const openaiKey = process.env.VITE_OPENAI_API_KEY;
        const hfKey = process.env.VITE_HUGGINGFACE_API_KEY;

        if (openaiKey || hfKey) {
            setIsConfigured(true);
            setApiKey(openaiKey || hfKey || '');
        }
    }, []);

    const handleImageGenerated = (imageUrl: string, prompt: string) => {
        setGeneratedCount(prev => prev + 1);
        console.log('Nova imagem gerada:', { imageUrl, prompt });
    };

    if (!isConfigured) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
                                <ImageIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Gerador de Imagens de Moda
                        </h1>
                        <p className="text-gray-600">
                            Configure sua API para começar a gerar looks com IA
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Configuração Inicial
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="provider">Escolha o Provider de IA</Label>
                                <select
                                    id="provider"
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value as any)}
                                    className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                                >
                                    <option value="dalle3">DALL-E 3 (OpenAI) - Melhor qualidade</option>
                                    <option value="stable-diffusion">Stable Diffusion (Hugging Face) - Gratuito</option>
                                </select>

                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <h4 className="font-medium text-blue-900 mb-2">
                                        {provider === 'dalle3' ? 'DALL-E 3 (Recomendado)' : 'Stable Diffusion'}
                                    </h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        {provider === 'dalle3' ? (
                                            <>
                                                <li>• Melhor qualidade para imagens de moda</li>
                                                <li>• Alta resolução (1024x1024)</li>
                                                <li>• Custo: $0.040 por imagem</li>
                                                <li>• Velocidade: 10-20 segundos</li>
                                            </>
                                        ) : (
                                            <>
                                                <li>• Gratuito via Hugging Face</li>
                                                <li>• Open source e customizável</li>
                                                <li>• Resolução: 512x512</li>
                                                <li>• Velocidade: 15-30 segundos</li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="apiKey">
                                    {provider === 'dalle3' ? 'OpenAI API Key' : 'Hugging Face API Key'}
                                </Label>
                                <Input
                                    id="apiKey"
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder={provider === 'dalle3' ? 'sk-...' : 'hf_...'}
                                    className="mt-2"
                                />

                                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                                    <h4 className="font-medium text-yellow-900 mb-2">Como obter sua API Key:</h4>
                                    {provider === 'dalle3' ? (
                                        <div className="text-sm text-yellow-700 space-y-1">
                                            <p>1. Acesse: <a href="https://platform.openai.com/api-keys" target="_blank" className="underline">platform.openai.com/api-keys</a></p>
                                            <p>2. Clique em "Create new secret key"</p>
                                            <p>3. Cole a chave acima</p>
                                            <p>4. Adicione créditos em Billing se necessário</p>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-yellow-700 space-y-1">
                                            <p>1. Acesse: <a href="https://huggingface.co/settings/tokens" target="_blank" className="underline">huggingface.co/settings/tokens</a></p>
                                            <p>2. Clique em "New token"</p>
                                            <p>3. Escolha "Read" permission</p>
                                            <p>4. Cole a chave acima</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                onClick={() => {
                                    if (apiKey) {
                                        setIsConfigured(true);
                                        // Salvar no localStorage para persistir
                                        localStorage.setItem('fashion_ai_provider', provider);
                                        localStorage.setItem('fashion_ai_key', apiKey);
                                    }
                                }}
                                disabled={!apiKey}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Começar a Gerar Imagens
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
                            <Palette className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        IA Fashion Studio
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">
                        Crie looks personalizados com inteligência artificial
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <Badge className="bg-green-100 text-green-800 px-3 py-1">
                            {provider === 'dalle3' ? 'DALL-E 3' : 'Stable Diffusion'}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                            {generatedCount} imagens geradas
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setIsConfigured(false);
                                localStorage.removeItem('fashion_ai_provider');
                                localStorage.removeItem('fashion_ai_key');
                            }}
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Reconfigurar
                        </Button>
                    </div>
                </div>

                {/* Main Generator */}
                <FashionImageGenerator
                    onImageGenerated={handleImageGenerated}
                    defaultPrompt="Elegant summer dress for a casual day out, floral pattern, flowing fabric, comfortable and stylish"
                />

                {/* Footer Info */}
                <div className="mt-12 text-center">
                    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">🎨 Dicas para Melhores Resultados:</h3>
                        <div className="text-sm text-gray-700 space-y-1">
                            <p>• Seja específico: "Vestido azul marinho para trabalho" vs "Vestido"</p>
                            <p>• Inclua detalhes: materiais, cores, ocasião, estilo</p>
                            <p>• Use os templates rápidos como ponto de partida</p>
                            <p>• Experimente diferentes paletas de cores</p>
                            <p>• Gere variações para mais opções</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FashionAITestPage;