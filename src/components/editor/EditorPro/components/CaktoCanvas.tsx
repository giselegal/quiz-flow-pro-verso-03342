import React, { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { Block } from '@/types/editor';
import ScalableQuizRenderer from '@/components/core/ScalableQuizRenderer';
import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { useStepSelection } from '@/hooks/useStepSelection';

interface CaktoCanvasHeaderProps {
    currentStep: number;
    totalSteps: number;
    showLogo?: boolean;
    showProgress?: boolean;
    allowReturn?: boolean;
    logoUrl?: string;
    logoAlt?: string;
    progressPercentage?: number;
    onReturn?: () => void;
}

interface CaktoCanvasProps {
    blocks: Block[];
    selectedBlock?: Block | null;
    currentStep: number;
    totalSteps?: number;
    showHeader?: boolean;
    headerConfig?: {
        showLogo?: boolean;
        showProgress?: boolean;
        allowReturn?: boolean;
        logoUrl?: string;
        logoAlt?: string;
    };
    isPreviewMode?: boolean;
    className?: string;
    onSelectBlock?: (blockId: string) => void;
    onUpdateBlock?: (blockId: string, updates: Partial<Block>) => void;
    onDeleteBlock?: (blockId: string) => void;
    onReturn?: () => void;
    onStepChange?: (step: number) => void;
    children?: React.ReactNode;
}

const CaktoCanvasHeader: React.FC<CaktoCanvasHeaderProps> = ({
    currentStep,
    totalSteps,
    showLogo = true,
    showProgress = true,
    allowReturn = true,
    logoUrl = "https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png",
    logoAlt = "Logo",
    progressPercentage,
    onReturn
}) => {
    // Calculate progress percentage if not provided
    const calculatedProgress = progressPercentage ?? Math.round((currentStep / totalSteps) * 100);

    return (
        <div className="flex flex-row w-full h-auto justify-center relative p-6 bg-background/50 border-b">
            {/* Return button */}
            {allowReturn && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onReturn}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 h-10 w-10"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            )}

            {/* Center content */}
            <div className="flex flex-col w-full max-w-96 justify-start items-center gap-4">
                {/* Logo */}
                {showLogo && logoUrl && (
                    <img
                        width="96"
                        height="96"
                        className="max-w-24 object-cover rounded-lg"
                        alt={logoAlt}
                        src={logoUrl}
                    />
                )}

                {/* Progress bar */}
                {showProgress && (
                    <div className="relative w-full">
                        <Progress
                            value={calculatedProgress}
                            className="w-full h-2 bg-zinc-300"
                        />
                        <div className="text-xs text-center mt-2 text-muted-foreground">
                            Etapa {currentStep} de {totalSteps} ({calculatedProgress}%)
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CaktoCanvas: React.FC<CaktoCanvasProps> = ({
    blocks,
    selectedBlock,
    currentStep,
    totalSteps = 21,
    showHeader = true,
    headerConfig = {
        showLogo: true,
        showProgress: true,
        allowReturn: true
    },
    isPreviewMode = false,
    className = "",
    onSelectBlock,
    onUpdateBlock,
    onDeleteBlock,
    onReturn,
    onStepChange,
    children
}) => {
    // Sistema de seleção otimizado
    const { handleBlockSelection } = useStepSelection({
        stepNumber: currentStep,
        onSelectBlock: onSelectBlock || (() => { }),
        debounceMs: 50
    });

    // Key estável que NÃO força remount desnecessário
    const canvasKey = useMemo(() => {
        return `cakto-canvas-step-${currentStep}`;
    }, [currentStep]);

    const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
        if (onUpdateBlock) {
            onUpdateBlock(blockId, updates);
        }
    };

    const handleBlockDelete = (blockId: string) => {
        if (onDeleteBlock) {
            onDeleteBlock(blockId);
        }
    };

    // Preview mode usa ScalableQuizRenderer otimizado
    if (isPreviewMode) {
        return (
            <div className={`w-full h-full ${className}`}>
                <div className="group relative main-content w-full min-h-full mx-auto bg-background">
                    {showHeader && (
                        <CaktoCanvasHeader
                            currentStep={currentStep}
                            totalSteps={totalSteps}
                            showLogo={headerConfig.showLogo}
                            showProgress={headerConfig.showProgress}
                            allowReturn={headerConfig.allowReturn}
                            logoUrl={headerConfig.logoUrl}
                            logoAlt={headerConfig.logoAlt}
                            onReturn={onReturn}
                        />
                    )}

                    <div className="h-full w-full overflow-y-auto relative z-0">
                        <ScalableQuizRenderer
                            funnelId="quiz21StepsComplete"
                            mode="preview"
                            debugMode={true}
                            className="preview-mode-canvas w-full h-full"
                            onStepChange={(step, data) => {
                                if (onStepChange) onStepChange(step);
                                console.log('📍 Cakto Preview step change:', step, data);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Modo de edição usa CanvasDropZone otimizado
    return (
        <div
            key={canvasKey}
            className={`w-full h-full overflow-y-auto ${className}`}
        >
            <div className="group relative main-content w-full min-h-full mx-auto bg-background">
                {/* Canvas header */}
                {showHeader && (
                    <CaktoCanvasHeader
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        showLogo={headerConfig.showLogo}
                        showProgress={headerConfig.showProgress}
                        allowReturn={headerConfig.allowReturn}
                        logoUrl={headerConfig.logoUrl}
                        logoAlt={headerConfig.logoAlt}
                        onReturn={onReturn}
                    />
                )}

                {/* Main content area otimizada */}
                <div className="flex flex-col gap-4 md:gap-6 h-full justify-between p-3 group-[.screen-mobile]:p-3 md:p-5 pb-10">
                    <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {children ? (
                            children
                        ) : (
                            <CanvasDropZone
                                blocks={blocks}
                                selectedBlockId={selectedBlock?.id || null}
                                onSelectBlock={handleBlockSelection}
                                onUpdateBlock={handleBlockUpdate}
                                onDeleteBlock={handleBlockDelete}
                                scopeId={currentStep}
                            />
                        )}
                    </div>

                    {/* Bottom spacing */}
                    <div className="pt-10 md:pt-24" />
                </div>
            </div>
        </div>
    );
};

// 🚀 OTIMIZAÇÃO: Comparação inteligente para evitar re-renders desnecessários
const arePropsEqual = (prevProps: CaktoCanvasProps, nextProps: CaktoCanvasProps): boolean => {
    // Se mudou o step ou mode, re-render
    if (prevProps.currentStep !== nextProps.currentStep || prevProps.isPreviewMode !== nextProps.isPreviewMode) {
        return false;
    }

    // Se mudou o selectedBlock ID, re-render
    if (prevProps.selectedBlock?.id !== nextProps.selectedBlock?.id) {
        return false;
    }

    // Se mudou o número ou ordem de blocos, re-render
    if (prevProps.blocks.length !== nextProps.blocks.length) {
        return false;
    }

    // Comparação rápida de IDs dos blocos (sem comparar todo o content)
    for (let i = 0; i < prevProps.blocks.length; i++) {
        if (prevProps.blocks[i].id !== nextProps.blocks[i].id) {
            return false;
        }
    }

    return true; // Props são equivalentes, não re-render
};

CaktoCanvas.displayName = 'CaktoCanvas';

export { CaktoCanvasHeader };
export default memo(CaktoCanvas, arePropsEqual);