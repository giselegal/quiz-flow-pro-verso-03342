/**
 * 🎯 QUIZ PRODUCTION PREVIEW
 * 
 * Renderiza preview idêntico ao funil de produção dentro do editor
 * Usa o mesmo QuizApp do /quiz-estilo para garantir fidelidade 100%
 */

import React, { useEffect, useState, useCallback } from 'react';
import QuizApp from '@/components/quiz/QuizApp';
import ModularPreviewContainer from '@/components/editor/quiz/ModularPreviewContainer';
import { useFunnelLivePreview } from '@/hooks/useFunnelLivePreview';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Play,
    Pause,
    RotateCcw,
    Eye,
    EyeOff,
    ExternalLink,
    RefreshCw,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizProductionPreviewProps {
    funnelId?: string;
    className?: string;
    onStateChange?: (state: any) => void;
    /**
     * Quando alterado, força a atualização do preview (ex: após autosave do draft)
     */
    refreshToken?: number;
}

export const QuizProductionPreview: React.FC<QuizProductionPreviewProps> = ({
    funnelId,
    className,
    onStateChange,
    refreshToken
}) => {
    // Live steps via WebSocket (se houver outro cliente broadcastando)
    const { liveSteps } = useFunnelLivePreview(funnelId);
    const [useModularPreview, setUseModularPreview] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Estado do quiz para debug
    const [quizState, setQuizState] = useState<any>(null);

    // Refresh quando funnelId muda
    useEffect(() => {
        setRefreshKey(prev => prev + 1);
    }, [funnelId]);

    // Refresh quando refreshToken externo mudar (ex.: autosave do draft)
    useEffect(() => {
        if (refreshToken != null) {
            setRefreshKey(prev => prev + 1);
        }
    }, [refreshToken]);

    // Notificar mudanças de estado
    useEffect(() => {
        if (quizState && onStateChange) {
            onStateChange(quizState);
        }
    }, [quizState, onStateChange]);

    const handleRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
        console.log('🔄 Preview atualizado');
    }, []);

    const handleReset = useCallback(() => {
        setRefreshKey(prev => prev + 1);
        console.log('🔄 Preview reiniciado');
    }, []);

    const handleOpenProduction = useCallback(() => {
        const url = funnelId
            ? `/quiz-estilo?preview=${funnelId}`
            : '/quiz-estilo';
        window.open(url, '_blank');
    }, [funnelId]);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => !prev);
        setShowControls(false);
    }, []);

    return (
        <div
            className={cn(
                'relative flex flex-col bg-white border rounded-lg overflow-hidden',
                isFullscreen && 'fixed inset-0 z-50 rounded-none',
                className
            )}
        >
            {/* Header de controles */}
            <div
                className={cn(
                    'flex items-center justify-between px-4 py-3 bg-gray-50 border-b transition-all',
                    !showControls && !isFullscreen && 'opacity-0 h-0 py-0'
                )}
            >
                <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <div>
                        <h3 className="text-sm font-semibold">Preview de Produção</h3>
                        <p className="text-xs text-muted-foreground">
                            {funnelId ? `Draft: ${funnelId}` : 'Versão atual'}
                        </p>
                    </div>
                    {funnelId && (
                        <Badge variant="outline" className="ml-2">
                            Modo Edição
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={useModularPreview ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setUseModularPreview(prev => !prev)}
                        title={useModularPreview ? 'Usando preview modular' : 'Usar preview modular'}
                    >
                        {useModularPreview ? 'Modular' : 'Produção'}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefresh}
                        title="Atualizar preview"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        title="Reiniciar quiz"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleOpenProduction}
                        title="Abrir em nova aba"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-border" />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleFullscreen}
                        title={isFullscreen ? 'Sair de tela cheia' : 'Tela cheia'}
                    >
                        {isFullscreen ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Área de preview com scroll */}
            <div
                className="flex-1 overflow-auto bg-[#fefefe]"
                onMouseEnter={() => !isFullscreen && setShowControls(true)}
                onMouseLeave={() => !isFullscreen && setShowControls(false)}
            >
                {isPlaying ? (
                    <div key={refreshKey}>
                        {useModularPreview ? (
                            <ModularPreviewContainer funnelId={funnelId} externalSteps={liveSteps || undefined as any} />
                        ) : (
                            <QuizApp funnelId={funnelId} externalSteps={liveSteps || undefined as any} />
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <Pause className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600 mb-4">Preview pausado</p>
                            <Button onClick={() => setIsPlaying(true)}>
                                <Play className="w-4 h-4 mr-2" />
                                Retomar
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Badge flutuante de modo preview */}
            {!showControls && !isFullscreen && (
                <div
                    className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => setShowControls(true)}
                >
                    <Badge variant="secondary" className="shadow-lg">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                    </Badge>
                </div>
            )}

            {/* Indicador de fullscreen */}
            {isFullscreen && (
                <div className="absolute top-4 left-4">
                    <Badge className="shadow-lg">
                        Modo Preview - Pressione ESC para sair
                    </Badge>
                </div>
            )}
        </div>
    );
};

export default QuizProductionPreview;
