/**
 * 🤖 BLOCO DE GERAÇÃO DE IA - FASHION AI GENERATOR
 * 
 * Integra o sistema FashionImageAI com o quiz de 21 etapas.
 * Gera looks personalizados baseados no resultado calculado.
 */

import React, { useState, useEffect } from 'react';
import { Block } from '@/types/editor';
import { QuizResult } from '@/components/editor/v1-modular/QuizCalculationEngine';
import { Loader2, Sparkles, RefreshCw, Download, Heart } from 'lucide-react';

interface FashionAIGeneratorContent {
    title: string;
    subtitle: string;
    description: string;
    loadingMessage: string;
    errorMessage: string;
}

interface FashionAIGeneratorProperties {
    styleType: string;
    generateOnLoad: boolean;
    autoGenerate: boolean;
    providers: string[];
    fallbackProvider: string;
    backgroundColor: string;
    borderRadius: number;
    padding: number;
    marginBottom: number;
    imageCount: number;
    imageSize: string;
    showColorPalette: boolean;
    showStyleTips: boolean;
    layout: 'grid' | 'carousel';
    columns: number;
    spacing: number;
    showLoadingState: boolean;
    showErrorState: boolean;
    cacheResults: boolean;
    retryAttempts: number;
    timeout: number;
    stylePrompts: Record<string, string>;
    colorPalettes: Record<string, string[]>;
}

interface FashionAIGeneratorBlock extends Block {
    type: 'fashion-ai-generator';
    content: FashionAIGeneratorContent;
    properties: FashionAIGeneratorProperties;
}

interface FashionAIGeneratorBlockProps {
    block: FashionAIGeneratorBlock;
    quizResult?: QuizResult;
    isSelected?: boolean;
    onSelect?: () => void;
    onEdit?: () => void;
    isEditing?: boolean;
}

export const FashionAIGeneratorBlock: React.FC<FashionAIGeneratorBlockProps> = ({
    block,
    quizResult,
    isSelected,
    onSelect,
    isEditing = false
}) => {
    const { content, properties } = block;
    // const { aiData, interpolateText } = useAIInterpolation(quizResult || null);

    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [currentStyle, setCurrentStyle] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    // Interpola o estilo atual baseado no resultado do quiz
    useEffect(() => {
        if (quizResult?.primaryStyle?.category) {
            setCurrentStyle(quizResult.primaryStyle.category.toLowerCase());
        } else {
            // Fallback: extrai do styleType se não tiver resultado
            const interpolatedStyle = properties.styleType.replace('{resultStyle}', 'elegante');
            setCurrentStyle(interpolatedStyle.toLowerCase());
        }
    }, [quizResult, properties.styleType]);

    // Gera imagens automaticamente quando carrega
    useEffect(() => {
        if (properties.generateOnLoad && currentStyle && generatedImages.length === 0) {
            handleGenerateImages();
        }
    }, [currentStyle, properties.generateOnLoad]);

    const handleGenerateImages = async () => {
        if (!currentStyle || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            // Simula geração de imagens por enquanto
            console.log(`🎨 Gerando ${properties.imageCount} imagens para estilo: ${currentStyle}`);

            // URLs de placeholder baseadas no estilo
            const placeholderImages = [
                `https://via.placeholder.com/400x500/FF69B4/FFFFFF?text=Look+1+${currentStyle}`,
                `https://via.placeholder.com/400x500/8A2BE2/FFFFFF?text=Look+2+${currentStyle}`,
                `https://via.placeholder.com/400x500/FF1493/FFFFFF?text=Look+3+${currentStyle}`
            ];

            // Simula delay de geração
            await new Promise(resolve => setTimeout(resolve, 2000));

            setGeneratedImages(placeholderImages.slice(0, properties.imageCount));
            setRetryCount(0);
        } catch (error) {
            console.error('Erro na geração de imagens:', error);
            setError('Erro ao gerar imagens. Tente novamente.');

            if (retryCount < properties.retryAttempts) {
                setRetryCount(prev => prev + 1);
                setTimeout(handleGenerateImages, 2000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFavorite = (index: number) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(index)) {
            newFavorites.delete(index);
        } else {
            newFavorites.add(index);
        }
        setFavorites(newFavorites);
    };

    const downloadImage = (imageUrl: string, index: number) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `look-${currentStyle}-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderColorPalette = () => {
        if (!properties.showColorPalette || !currentStyle) return null;

        const colors = properties.colorPalettes[currentStyle] || [];

        return (
            <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">
                    Paleta de cores do seu estilo
                </h4>
                <div className="flex gap-3 justify-center">
                    {colors.map((color, index) => (
                        <div
                            key={index}
                            className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const renderStyleTips = () => {
        if (!properties.showStyleTips || !currentStyle) return null;

        const tips = {
            natural: ['Use tecidos naturais', 'Aposte em cores terrosas', 'Priorize o conforto'],
            classico: ['Invista em peças atemporais', 'Use cores neutras', 'Foque na qualidade'],
            contemporaneo: ['Combine básicos com tendências', 'Use acessórios modernos', 'Mantenha linhas limpas'],
            elegante: ['Escolha peças de qualidade', 'Use cortes impecáveis', 'Menos é mais'],
            romantico: ['Use tecidos fluidos', 'Aposte em detalhes delicados', 'Cores suaves são ideais'],
            sexy: ['Valorize suas curvas', 'Use cores intensas', 'Invista em peças marcantes'],
            dramatico: ['Ouse em contrastes', 'Use peças statement', 'Aposte em acessórios marcantes'],
            criativo: ['Misture texturas', 'Use cores vibrantes', 'Ouse em combinações']
        };

        const styleTips = tips[currentStyle as keyof typeof tips] || tips.elegante;

        return (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-blue-800 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Dicas do seu estilo {currentStyle}
                </h4>
                <ul className="space-y-2">
                    {styleTips.map((tip, index) => (
                        <li key={index} className="flex items-center text-blue-700">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    if (isEditing) {
        return (
            <div
                className={`relative border-2 ${isSelected ? 'border-blue-500' : 'border-gray-200'} rounded-lg p-6`}
                onClick={onSelect}
                style={{
                    backgroundColor: properties.backgroundColor,
                    borderRadius: properties.borderRadius,
                    padding: properties.padding,
                    marginBottom: properties.marginBottom
                }}
            >
                <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                    <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                    <p className="text-gray-600 mb-4">{content.subtitle}</p>
                    <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded">
                        <strong>Modo Edição:</strong> O componente de IA será renderizado automaticamente no preview.
                        <br />
                        <strong>Estilo atual:</strong> {currentStyle || 'Não definido'}
                        <br />
                        <strong>Provedor:</strong> {properties.providers[0] || 'Não configurado'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative"
            style={{
                backgroundColor: properties.backgroundColor,
                borderRadius: properties.borderRadius,
                padding: properties.padding,
                marginBottom: properties.marginBottom
            }}
        >
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{content.title}</h3>
                <p className="text-lg text-gray-600 mb-2">{content.subtitle}</p>
                <p className="text-gray-500">{content.description}</p>
            </div>

            {/* Loading State */}
            {isLoading && properties.showLoadingState && (
                <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-spin" />
                    <p className="text-lg text-gray-600">{content.loadingMessage}</p>
                    <div className="mt-4 max-w-md mx-auto bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && properties.showErrorState && !isLoading && (
                <div className="text-center py-8">
                    <div className="text-red-500 mb-4">❌</div>
                    <p className="text-red-600 mb-4">{content.errorMessage}</p>
                    <button
                        onClick={handleGenerateImages}
                        className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center mx-auto"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tentar novamente
                    </button>
                </div>
            )}

            {/* Generated Images */}
            {generatedImages.length > 0 && !isLoading && (
                <div className="space-y-6">
                    <div
                        className={`grid gap-${properties.spacing / 4}`}
                        style={{
                            gridTemplateColumns: `repeat(${properties.columns}, 1fr)`,
                            gap: properties.spacing
                        }}
                    >
                        {generatedImages.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                                <div className="relative overflow-hidden rounded-lg shadow-lg">
                                    <img
                                        src={imageUrl}
                                        alt={`Look ${index + 1} - Estilo ${currentStyle}`}
                                        className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                                    />

                                    {/* Overlay com ações */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                                            <button
                                                onClick={() => toggleFavorite(index)}
                                                className={`p-2 rounded-full ${favorites.has(index)
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-white text-gray-600'
                                                    } shadow-lg hover:scale-110 transition-transform`}
                                            >
                                                <Heart className={`w-4 h-4 ${favorites.has(index) ? 'fill-current' : ''}`} />
                                            </button>

                                            <button
                                                onClick={() => downloadImage(imageUrl, index)}
                                                className="p-2 rounded-full bg-white text-gray-600 shadow-lg hover:scale-110 transition-transform"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 text-center">
                                    <p className="text-sm font-medium text-gray-700">Look {index + 1}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Botão para gerar mais looks */}
                    <div className="text-center">
                        <button
                            onClick={handleGenerateImages}
                            disabled={isLoading}
                            className="bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Gerar novos looks
                        </button>
                    </div>
                </div>
            )}

            {/* Color Palette */}
            {renderColorPalette()}

            {/* Style Tips */}
            {renderStyleTips()}

            {/* Call to Action */}
            {generatedImages.length > 0 && (
                <div className="mt-8 text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <h4 className="text-xl font-bold mb-2 text-gray-800">
                        Gostou dos seus looks personalizados?
                    </h4>
                    <p className="text-gray-600 mb-4">
                        Descubra como aplicar essas dicas na prática e transformar completamente seu guarda-roupa!
                    </p>
                </div>
            )}
        </div>
    );
};

export default FashionAIGeneratorBlock;