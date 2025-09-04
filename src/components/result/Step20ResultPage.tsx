import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStep20Configuration } from '@/hooks/useStep20Configuration';
import { Share2, ArrowRight, ChevronDown } from 'lucide-react';

interface Step20ResultPageProps {
    className?: string;
    isPreview?: boolean;
}

export const Step20ResultPage: React.FC<Step20ResultPageProps> = ({
    className = "",
    isPreview = false
}) => {
    const { configuration, getBackgroundStyle, getResultIcon } = useStep20Configuration();

    const handleCTAClick = () => {
        if (isPreview) return;

        // Navegação para próxima etapa ou página de consultoria
        window.location.href = '/step21';
    };

    const handleSocialShare = () => {
        if (isPreview) return;

        const shareUrl = window.location.href;
        const shareText = `${configuration.socialShareText} ${shareUrl}`;

        if (navigator.share) {
            navigator.share({
                title: configuration.pageTitle,
                text: shareText,
                url: shareUrl,
            });
        } else {
            // Fallback para copiar para clipboard
            navigator.clipboard.writeText(shareText);
        }
    };

    return (
        <div
            className={`min-h-screen flex items-center justify-center p-4 ${className}`}
            style={getBackgroundStyle()}
        >
            <div className="w-full max-w-4xl mx-auto">
                <Card className="border-0 shadow-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    <CardContent className="p-8 md:p-12 text-center space-y-8">

                        {/* Ícone de Resultado */}
                        {configuration.showResultIcon && (
                            <div className="text-6xl md:text-8xl animate-bounce">
                                {getResultIcon()}
                            </div>
                        )}

                        {/* Título Principal */}
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-5xl font-bold text-[#432818] leading-tight">
                                {configuration.pageTitle}
                            </h1>

                            <p className="text-lg md:text-xl text-[#6B4F43] max-w-3xl mx-auto leading-relaxed">
                                {configuration.resultMessage}
                            </p>
                        </div>

                        {/* Preview de URL específica */}
                        {isPreview && (
                            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#F8F6F3', borderColor: '#E6DDD4' }}>
                                <p className="text-sm text-[#6B4F43]">
                                    <strong>🎯 URL Configurada:</strong> <code className="bg-[#E6DDD4] px-2 py-1 rounded">/step20</code>
                                </p>
                                <p className="text-xs text-[#8F7A6A] mt-2">
                                    Página especial de resultado diferenciada das etapas regulares
                                </p>
                            </div>
                        )}

                        {/* Próximos Passos */}
                        {configuration.showNextSteps && (
                            <div className="bg-gradient-to-r from-[#F3E8E6] to-[#F8F6F3] p-6 rounded-xl">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <ChevronDown className="w-5 h-5 text-[#B89B7A]" />
                                    <h3 className="text-lg font-semibold text-[#432818]">Próximos Passos</h3>
                                </div>
                                <p className="text-[#6B4F43] text-base leading-relaxed">
                                    {configuration.nextStepsText}
                                </p>
                            </div>
                        )}

                        {/* Botões de Ação */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                onClick={handleCTAClick}
                                disabled={isPreview}
                                className="bg-[#B89B7A] hover:bg-[#A0895B] text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center gap-2"
                            >
                                {configuration.ctaButtonText}
                                <ArrowRight className="w-5 h-5" />
                            </Button>

                            {configuration.enableSocialSharing && (
                                <Button
                                    onClick={handleSocialShare}
                                    disabled={isPreview}
                                    variant="outline"
                                    className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white px-6 py-3 rounded-full flex items-center gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Compartilhar Resultado
                                </Button>
                            )}
                        </div>

                        {/* Indicador de Página Especial */}
                        <div className="mt-8 pt-6 border-t border-[#E6DDD4]">
                            <p className="text-xs text-[#8F7A6A] flex items-center justify-center gap-2">
                                <span className="w-2 h-2 bg-[#B89B7A] rounded-full"></span>
                                Página de Resultado Personalizada
                                <span className="w-2 h-2 bg-[#B89B7A] rounded-full"></span>
                            </p>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Step20ResultPage;
