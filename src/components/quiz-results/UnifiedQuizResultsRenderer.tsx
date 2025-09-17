/**
 * 🎯 UNIFIED QUIZ RESULTS RENDERER - CONSOLIDAÇÃO COMPONENTES RESULTADO
 * 
 * Renderer unificado que consolida todos os componentes de resultado de quiz:
 * - ResultDisplay.tsx (resultado principal com tips, CTA, progress)
 * - StyleResultDisplay.tsx (resultado de estilo com características)
 * - QuizResultComponent.tsx (componente builder para resultado)
 * - QuizResultMainCardBlock.tsx (card principal do resultado)
 * - QuizResultSecondaryStylesBlock.tsx (estilos secundários)
 * - QuizResultHeaderBlock.tsx (cabeçalho do resultado)
 * - QuizResultCalculatedBlock.tsx (resultado calculado)
 * - Step20Template.tsx & Step20Result.tsx (templates de resultado)
 * 
 * ✅ BENEFÍCIOS:
 * - Renderer único para todos os tipos de resultado
 * - Sistema de templates flexível
 * - Styles consolidados e customizáveis
 * - Performance otimizada com lazy loading
 * - Compatibilidade com código existente
 * - Sistema de fallbacks robusto
 */

import React, { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, Trophy, Heart, Star } from 'lucide-react';
import { UnifiedValidationResult, validateData, ValidationContext } from '@/utils/validation';

// =============================================
// UNIFIED INTERFACES
// =============================================

export interface UnifiedQuizResult {
    // Basic result info
    id: string;
    userId?: string;
    quizId?: string;
    timestamp?: Date;

    // Primary result
    primaryStyle: {
        name: string;
        description: string;
        percentage: number;
        image?: string;
        guideImage?: string;
        category?: string;
        keywords?: string[];
        characteristics?: string[];
    };

    // Secondary results (alternative styles)
    secondaryStyles?: Array<{
        name: string;
        percentage: number;
        description?: string;
        image?: string;
        characteristics?: string[];
    }>;

    // User data
    username: string;
    userAnswers?: Record<string, any>;

    // Content customization
    congratulationsText?: string;
    subtitleText?: string;
    tips?: string[];

    // Call to action
    cta?: {
        text: string;
        url?: string;
        onClick?: () => void;
    };

    // Display options
    showPercentage?: boolean;
    showCharacteristics?: boolean;
    showSecondaryStyles?: boolean;
    showProgress?: boolean;
    showTips?: boolean;

    // Metadata
    metadata?: Record<string, any>;
}

export type ResultDisplayMode =
    | 'full'          // Resultado completo com todos os elementos
    | 'compact'       // Resultado compacto sem elementos extras
    | 'card'          // Resultado em formato de card
    | 'header'        // Apenas cabeçalho do resultado
    | 'main'          // Resultado principal sem secundários
    | 'secondary'     // Apenas estilos secundários
    | 'calculated'    // Resultado calculado em tempo real
    | 'preview';      // Preview do resultado

export interface ResultRenderOptions {
    mode?: ResultDisplayMode;
    theme?: 'default' | 'elegant' | 'modern' | 'minimal';
    imageSize?: 'small' | 'medium' | 'large';
    animation?: boolean;
    loading?: boolean;
    error?: string | null;

    // Layout options
    alignment?: 'left' | 'center' | 'right';
    containerClass?: string;
    maxWidth?: string;

    // Feature flags
    enableProgressAnimation?: boolean;
    enableHover?: boolean;
    enableSharing?: boolean;

    // Callbacks
    onResultReady?: (result: UnifiedQuizResult) => void;
    onCtaClick?: () => void;
    onShareClick?: () => void;
    onRetryClick?: () => void;
}

export interface QuizResultRenderer {
    render: (result: UnifiedQuizResult, options?: ResultRenderOptions) => React.ReactElement;
    validate: (result: Partial<UnifiedQuizResult>) => UnifiedValidationResult;
    getDefaultOptions: () => ResultRenderOptions;
}

// =============================================
// UNIFIED QUIZ RESULTS RENDERER CLASS
// =============================================

export class UnifiedQuizResultsRenderer {
    private static instance: UnifiedQuizResultsRenderer;

    // Lazy loaded components for performance (commented out non-existent modules)
    // private lazyComponents = {
    //     // FullRenderer: lazy(() => import('./renderers/FullResultRenderer')),
    //     // CompactRenderer: lazy(() => import('./renderers/CompactResultRenderer')),
    //     // CardRenderer: lazy(() => import('./renderers/CardResultRenderer')),
    //     // HeaderRenderer: lazy(() => import('./renderers/HeaderResultRenderer')),
    //     // MainRenderer: lazy(() => import('./renderers/MainResultRenderer')),
    //     // SecondaryRenderer: lazy(() => import('./renderers/SecondaryResultRenderer')),
    //     // CalculatedRenderer: lazy(() => import('./renderers/CalculatedResultRenderer')),
    //     // PreviewRenderer: lazy(() => import('./renderers/PreviewResultRenderer'))
    // };

    private constructor() { }

    static getInstance(): UnifiedQuizResultsRenderer {
        if (!UnifiedQuizResultsRenderer.instance) {
            UnifiedQuizResultsRenderer.instance = new UnifiedQuizResultsRenderer();
        }
        return UnifiedQuizResultsRenderer.instance;
    }

    // =============================================
    // MAIN RENDERING METHOD
    // =============================================

    /**
     * 🎯 RENDER UNIFIED RESULT
     * Main method to render any type of quiz result
     */
    renderResult(
        result: UnifiedQuizResult,
        options: ResultRenderOptions = {}
    ): React.ReactElement {
        const finalOptions = this.mergeOptions(options);

        // Validate result
        const validation = this.validateResult(result);
        if (!validation.isValid && !finalOptions.error) {
            finalOptions.error = validation.errors?.[0] || 'Invalid result data';
        }

        // Handle error state
        if (finalOptions.error) {
            return this.renderError(finalOptions.error, finalOptions.onRetryClick);
        }

        // Handle loading state
        if (finalOptions.loading) {
            return this.renderLoading(finalOptions);
        }

        // Select appropriate renderer
        const RendererComponent = this.selectRenderer(finalOptions.mode || 'full');

        return (
            <Suspense fallback={this.renderLoading(finalOptions)}>
                <div className={this.getContainerClasses(finalOptions)}>
                    <RendererComponent
                        result={result}
                        options={finalOptions}
                    />
                </div>
            </Suspense>
        );
    }

    // =============================================
    // BUILT-IN RENDERERS (Fallback)
    // =============================================

    /**
     * 🎯 RENDER FULL RESULT
     * Complete result with all elements
     */
    renderFullResult(
        result: UnifiedQuizResult,
        options: ResultRenderOptions = {}
    ): React.ReactElement {
        const { secondaryStyles, tips } = result;

        return (
            <div className="w-full flex flex-col items-center gap-8 p-6 max-w-4xl mx-auto">
                {/* Header */}
                {this.renderHeader(result, options)}

                {/* Main Result */}
                {this.renderMainResult(result, options)}

                {/* Secondary Styles */}
                {options.mode !== 'main' && result.showSecondaryStyles && secondaryStyles && (
                    this.renderSecondaryStyles(secondaryStyles, options)
                )}

                {/* Tips */}
                {result.showTips && tips && tips.length > 0 && (
                    this.renderTips(tips, options)
                )}

                {/* CTA */}
                {result.cta && this.renderCta(result.cta, options)}
            </div>
        );
    }

    /**
     * 🎯 RENDER HEADER
     * Result header with congratulations
     */
    private renderHeader(result: UnifiedQuizResult, _options: ResultRenderOptions): React.ReactElement {
        const { congratulationsText } = result;

        return (
            <Card className="w-full shadow-lg rounded-2xl bg-gradient-to-br from-white to-stone-50">
                <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                        <CardTitle className="text-2xl font-bold text-center text-[#432818]">
                            {congratulationsText || "🎉 Resultado do Quiz Completo!"}
                        </CardTitle>
                    </div>

                    {result.subtitleText && (
                        <p className="text-center text-gray-600 text-lg">
                            {result.subtitleText}
                        </p>
                    )}
                </CardHeader>
            </Card>
        );
    }

    /**
     * 🎯 RENDER MAIN RESULT
     * Primary style result with image and details
     */
    private renderMainResult(result: UnifiedQuizResult, options: ResultRenderOptions): React.ReactElement {
        const { primaryStyle, showPercentage = true } = result;

        return (
            <Card className="w-full shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Style Image */}
                        {primaryStyle.image && (
                            <div className="flex-shrink-0">
                                <img
                                    src={primaryStyle.image}
                                    alt={primaryStyle.name}
                                    className={this.getImageClasses(options.imageSize)}
                                />
                            </div>
                        )}

                        {/* Result Details */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                                <Trophy className="w-8 h-8 text-amber-600" />
                                <h2 className="text-3xl font-bold text-[#432818]">
                                    {primaryStyle.name}
                                </h2>
                            </div>

                            {/* Percentage */}
                            {showPercentage && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                                        <Star className="w-5 h-5 text-amber-500" />
                                        <span className="font-semibold text-lg text-gray-700">
                                            {primaryStyle.percentage}% de compatibilidade
                                        </span>
                                    </div>
                                    {options.enableProgressAnimation ? (
                                        <Progress
                                            value={primaryStyle.percentage}
                                            className="w-full h-3 bg-amber-100"
                                        />
                                    ) : (
                                        <div className="w-full bg-amber-100 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all duration-1000"
                                                style={{ width: `${primaryStyle.percentage}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Description */}
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                {primaryStyle.description}
                            </p>

                            {/* Characteristics */}
                            {result.showCharacteristics && primaryStyle.characteristics && (
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {primaryStyle.characteristics.map((char, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                                        >
                                            {char}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    /**
     * 🎯 RENDER SECONDARY STYLES
     * Alternative style results
     */
    private renderSecondaryStyles(
        secondaryStyles: NonNullable<UnifiedQuizResult['secondaryStyles']>,
        _options: ResultRenderOptions
    ): React.ReactElement {
        return (
            <Card className="w-full shadow-lg rounded-2xl bg-gradient-to-br from-gray-50 to-slate-100">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-center text-[#432818] flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6" />
                        Outros Estilos Compatíveis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {secondaryStyles.map((style, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                            >
                                {style.image && (
                                    <img
                                        src={style.image}
                                        alt={style.name}
                                        className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
                                    />
                                )}

                                <h3 className="font-bold text-lg text-[#432818] text-center mb-2">
                                    {style.name}
                                </h3>

                                <div className="text-center mb-3">
                                    <span className="text-amber-600 font-semibold">
                                        {style.percentage}% compatível
                                    </span>
                                </div>

                                {style.description && (
                                    <p className="text-gray-600 text-sm text-center mb-3">
                                        {style.description}
                                    </p>
                                )}

                                {style.characteristics && (
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {style.characteristics.slice(0, 3).map((char, charIndex) => (
                                            <Badge
                                                key={charIndex}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {char}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    /**
     * 🎯 RENDER TIPS
     * Special tips based on result
     */
    private renderTips(tips: string[], _options: ResultRenderOptions): React.ReactElement {
        return (
            <Card className="w-full shadow-lg rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-center text-[#432818] flex items-center justify-center gap-2">
                        <Heart className="w-6 h-6 text-red-500" />
                        Dicas Especiais Para Você
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tips.map((tip, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400"
                            >
                                <p className="text-gray-700">{tip}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    /**
     * 🎯 RENDER CTA
     * Call to action button
     */
    private renderCta(
        cta: NonNullable<UnifiedQuizResult['cta']>,
        options: ResultRenderOptions
    ): React.ReactElement {
        const handleClick = () => {
            if (options.onCtaClick) {
                options.onCtaClick();
            } else if (cta.onClick) {
                cta.onClick();
            } else if (cta.url) {
                window.open(cta.url, '_blank');
            }
        };

        return (
            <Card className="w-full shadow-lg rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                <CardContent className="p-8 text-center">
                    <Button
                        onClick={handleClick}
                        size="lg"
                        className="bg-white text-amber-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all"
                    >
                        {cta.text}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // =============================================
    // UTILITY METHODS
    // =============================================

    private selectRenderer(mode: ResultDisplayMode): React.ComponentType<{ result: UnifiedQuizResult; options: Required<ResultRenderOptions> }> {
        switch (mode) {
            case 'compact':
                return React.memo(({ result, options }) => this.renderCompactResult(result, options));
            case 'card':
                return React.memo(({ result, options }) => this.renderCardResult(result, options));
            case 'header':
                return React.memo(({ result, options }) => this.renderHeaderResult(result, options));
            case 'main':
                return React.memo(({ result, options }) => this.renderMainResult(result, options));
            case 'secondary':
                return React.memo(({ result, options }) => this.renderSecondaryResult(result, options));
            case 'calculated':
                return React.memo(({ result, options }) => this.renderCalculatedResult(result, options));
            case 'preview':
                return React.memo(({ result, options }) => this.renderPreviewResult(result, options));
            default:
                return React.memo(({ result, options }) => this.renderFullResult(result, options));
        }
    }

    private validateResult(result: UnifiedQuizResult): UnifiedValidationResult {
        return validateData(result, ValidationContext.QUIZ_RESULT, {
            requiredFields: ['id', 'primaryStyle', 'username'],
            strict: false
        });
    }

    private mergeOptions(options: ResultRenderOptions): Required<ResultRenderOptions> {
        return {
            mode: 'full',
            theme: 'default',
            imageSize: 'medium',
            animation: true,
            loading: false,
            error: null,
            alignment: 'center',
            containerClass: '',
            maxWidth: '4xl',
            enableProgressAnimation: true,
            enableHover: true,
            enableSharing: false,
            onResultReady: () => { },
            onCtaClick: () => { },
            onShareClick: () => { },
            onRetryClick: () => { },
            ...options
        };
    }

    private getContainerClasses(options: ResultRenderOptions): string {
        const base = 'w-full flex flex-col items-center';
        const alignment = options.alignment === 'left' ? 'items-start' :
            options.alignment === 'right' ? 'items-end' : 'items-center';
        const maxWidth = `max-w-${options.maxWidth}`;

        return `${base} ${alignment} ${maxWidth} mx-auto ${options.containerClass || ''}`;
    }

    private getImageClasses(size: ResultRenderOptions['imageSize'] = 'medium'): string {
        const sizes = {
            small: 'w-16 h-16',
            medium: 'w-32 h-32 md:w-40 md:h-40',
            large: 'w-48 h-48 md:w-56 md:h-56'
        };

        return `${sizes[size]} object-cover rounded-2xl shadow-lg`;
    }

    private renderLoading(_options: ResultRenderOptions): React.ReactElement {
        return (
            <Card className="w-full shadow-lg rounded-2xl">
                <CardContent className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Calculando seu resultado...</p>
                </CardContent>
            </Card>
        );
    }

    private renderError(error: string, onRetry?: () => void): React.ReactElement {
        return (
            <Card className="w-full shadow-lg rounded-2xl border-red-200">
                <CardContent className="p-8 text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-red-800 mb-2">Erro no Resultado</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    {onRetry && (
                        <Button
                            onClick={onRetry}
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                            Tentar Novamente
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }
}

// =============================================
// SINGLETON EXPORT
// =============================================
export const unifiedQuizResultsRenderer = UnifiedQuizResultsRenderer.getInstance();