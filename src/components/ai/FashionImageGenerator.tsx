import { useState } from 'react';
import { Camera, Palette, Sparkles, Download, RefreshCw, Settings, Zap, User, Calendar, Heart, Briefcase } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { useFashionAI, FASHION_PROMPTS, FASHION_COLORS } from '../../hooks/useFashionAI';
import { FashionImageRequest } from '../../services/FashionImageAI';

interface FashionImageGeneratorProps {
    onImageGenerated?: (imageUrl: string, prompt: string) => void;
    defaultPrompt?: string;
}

export function FashionImageGenerator({ onImageGenerated, defaultPrompt }: FashionImageGeneratorProps) {
    const [currentRequest, setCurrentRequest] = useState<FashionImageRequest>({
        prompt: defaultPrompt || 'Stylish casual outfit',
        gender: 'feminino',
        occasion: 'casual',
        style: 'moderno',
        colors: ['black', 'white'],
        bodyType: 'slim',
        age: 'young-adult',
        season: 'verão',
        budget: 'medium'
    });

    const [provider, setProvider] = useState<'dalle3' | 'stable-diffusion'>('dalle3');
    const [apiKey, setApiKey] = useState(process.env.VITE_OPENAI_API_KEY || process.env.VITE_HUGGINGFACE_API_KEY || '');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<Array<{ url: string; prompt: string; provider: string }>>([]);

    const fashionAI = useFashionAI({
        provider,
        apiKey,
        style: 'realistic'
    });

    const handleGenerate = async () => {
        if (!apiKey) {
            alert(`Por favor, configure sua API key para ${provider.toUpperCase()}`);
            return;
        }

        const result = await fashionAI.generateOutfit(currentRequest);

        if (result.success && result.imageUrl) {
            const newImage = {
                url: result.imageUrl,
                prompt: result.prompt,
                provider: result.provider
            };
            setGeneratedImages(prev => [newImage, ...prev]);
            onImageGenerated?.(result.imageUrl, result.prompt);
        }
    };

    const handleGenerateVariations = async () => {
        if (!apiKey) {
            alert(`Por favor, configure sua API key para ${provider.toUpperCase()}`);
            return;
        }

        const results = await fashionAI.generateVariations(currentRequest, 3);
        const successful = results.filter(r => r.success && r.imageUrl);

        const newImages = successful.map(result => ({
            url: result.imageUrl!,
            prompt: result.prompt,
            provider: result.provider
        }));

        setGeneratedImages(prev => [...newImages, ...prev]);
    };

    const handleQuickPrompt = (promptKey: keyof typeof FASHION_PROMPTS) => {
        const template = FASHION_PROMPTS[promptKey];
        setCurrentRequest(prev => ({
            ...prev,
            ...template
        }));
    };

    const handleColorPalette = (paletteKey: keyof typeof FASHION_COLORS) => {
        const colors = FASHION_COLORS[paletteKey];
        setCurrentRequest(prev => ({
            ...prev,
            colors: colors.slice(0, 3) // Máximo 3 cores
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Gerador de Imagens de Moda</h2>
                        <p className="text-gray-600">Crie looks personalizados com IA</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge className={`${fashionAI.isGenerating ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {fashionAI.isGenerating ? 'Gerando...' : 'Pronto'}
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        {showAdvanced ? 'Simples' : 'Avançado'}
                    </Button>
                </div>
            </div>

            {/* Configuration Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Controls */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Descrição do Look
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="prompt">Descreva o look desejado</Label>
                                <Textarea
                                    id="prompt"
                                    value={currentRequest.prompt}
                                    onChange={(e) => setCurrentRequest(prev => ({ ...prev, prompt: e.target.value }))}
                                    placeholder="Ex: Vestido casual para trabalho, elegante e confortável..."
                                    className="min-h-[80px]"
                                />
                            </div>

                            {/* Quick Prompts */}
                            <div>
                                <Label>Templates Rápidos</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Object.entries(FASHION_PROMPTS).map(([key, template]) => (
                                        <Button
                                            key={key}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleQuickPrompt(key as keyof typeof FASHION_PROMPTS)}
                                            className="text-xs"
                                        >
                                            {key === 'work' && <Briefcase className="w-3 h-3 mr-1" />}
                                            {key === 'party' && <Heart className="w-3 h-3 mr-1" />}
                                            {key === 'casual' && <User className="w-3 h-3 mr-1" />}
                                            {key === 'date' && <Calendar className="w-3 h-3 mr-1" />}
                                            {template.prompt.split(' ').slice(0, 2).join(' ')}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Palettes */}
                            <div>
                                <Label>Paletas de Cores</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Object.entries(FASHION_COLORS).map(([paletteKey, colors]) => (
                                        <Button
                                            key={paletteKey}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleColorPalette(paletteKey as keyof typeof FASHION_COLORS)}
                                            className="text-xs flex items-center gap-2"
                                        >
                                            <div className="flex gap-1">
                                                {colors.slice(0, 3).map((color, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="w-3 h-3 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                            {paletteKey}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Advanced Settings */}
                    {showAdvanced && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Configurações Avançadas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="gender">Gênero</Label>
                                        <select
                                            id="gender"
                                            value={currentRequest.gender}
                                            onChange={(e) => setCurrentRequest(prev => ({ ...prev, gender: e.target.value as any }))}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="feminino">Feminino</option>
                                            <option value="masculino">Masculino</option>
                                            <option value="unisex">Unissex</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="occasion">Ocasião</Label>
                                        <select
                                            id="occasion"
                                            value={currentRequest.occasion}
                                            onChange={(e) => setCurrentRequest(prev => ({ ...prev, occasion: e.target.value as any }))}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="casual">Casual</option>
                                            <option value="formal">Formal</option>
                                            <option value="trabalho">Trabalho</option>
                                            <option value="festa">Festa</option>
                                            <option value="esporte">Esporte</option>
                                            <option value="viagem">Viagem</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="style">Estilo</Label>
                                        <select
                                            id="style"
                                            value={currentRequest.style}
                                            onChange={(e) => setCurrentRequest(prev => ({ ...prev, style: e.target.value as any }))}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="clássico">Clássico</option>
                                            <option value="moderno">Moderno</option>
                                            <option value="romântico">Romântico</option>
                                            <option value="edgy">Edgy</option>
                                            <option value="minimalista">Minimalista</option>
                                            <option value="boho">Boho</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="season">Estação</Label>
                                        <select
                                            id="season"
                                            value={currentRequest.season}
                                            onChange={(e) => setCurrentRequest(prev => ({ ...prev, season: e.target.value as any }))}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="primavera">Primavera</option>
                                            <option value="verão">Verão</option>
                                            <option value="outono">Outono</option>
                                            <option value="inverno">Inverno</option>
                                        </select>
                                    </div>
                                </div>

                                {/* API Configuration */}
                                <div className="space-y-3">
                                    <div>
                                        <Label htmlFor="provider">Provider de IA</Label>
                                        <select
                                            id="provider"
                                            value={provider}
                                            onChange={(e) => setProvider(e.target.value as any)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="dalle3">DALL-E 3 (Melhor qualidade - $0.04/imagem)</option>
                                            <option value="stable-diffusion">Stable Diffusion (Gratuito)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="apiKey">
                                            API Key {provider === 'dalle3' ? '(OpenAI)' : '(Hugging Face)'}
                                        </Label>
                                        <Input
                                            id="apiKey"
                                            type="password"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder={provider === 'dalle3' ? 'sk-...' : 'hf_...'}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Action Panel */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={handleGenerate}
                                disabled={fashionAI.isGenerating || !apiKey}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                            >
                                {fashionAI.isGenerating ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Zap className="w-4 h-4 mr-2" />
                                )}
                                Gerar Imagem
                            </Button>

                            <Button
                                onClick={handleGenerateVariations}
                                disabled={fashionAI.isGenerating || !apiKey}
                                variant="outline"
                                className="w-full"
                            >
                                <Palette className="w-4 h-4 mr-2" />
                                Gerar 3 Variações
                            </Button>

                            {fashionAI.isGenerating && (
                                <div className="space-y-2">
                                    <Progress value={60} className="w-full" />
                                    <p className="text-sm text-gray-600 text-center">
                                        Gerando sua imagem...
                                    </p>
                                </div>
                            )}

                            {fashionAI.error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">{fashionAI.error}</p>
                                </div>
                            )}

                            {fashionAI.providerStatus && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs text-blue-700">
                                        <strong>{fashionAI.providerStatus.provider}:</strong><br />
                                        {fashionAI.providerStatus.cost}<br />
                                        {fashionAI.providerStatus.speed}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Generated Images Gallery */}
            {generatedImages.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Camera className="w-5 h-5" />
                            Imagens Geradas ({generatedImages.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {generatedImages.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={image.url}
                                        alt={image.prompt}
                                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                        <div className="space-y-2">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = image.url;
                                                    link.download = `fashion-${index + 1}.png`;
                                                    link.click();
                                                }}
                                                className="bg-white text-black hover:bg-gray-100"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Baixar
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 left-2">
                                        <Badge className="bg-black/70 text-white text-xs">
                                            {image.provider}
                                        </Badge>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {image.prompt}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default FashionImageGenerator;