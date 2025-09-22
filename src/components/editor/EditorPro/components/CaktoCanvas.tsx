import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { Block } from '@/types/editor';

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
    children
}) => {
    const handleBlockClick = (block: Block) => {
        if (!isPreviewMode && onSelectBlock) {
            onSelectBlock(block.id);
        }
    };

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

    return (
        <div className={`w-full h-full overflow-y-auto ${className}`}>
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

                {/* Main content area */}
                <div className="flex flex-col gap-4 md:gap-6 h-full justify-between p-3 group-[.screen-mobile]:p-3 md:p-5 pb-10">
                    {/* Blocks container */}
                    <div className="grid gap-4 opacity-100">
                        {/* Custom children or blocks */}
                        {children ? (
                            children
                        ) : (
                            <div className="main-content w-full relative mx-auto max-w-4xl h-full">
                                <div className="flex flex-row flex-wrap pb-10 gap-4">
                                    {blocks.length === 0 ? (
                                        // Empty state
                                        <div className="w-full flex items-center justify-center py-20">
                                            <div className="text-center max-w-md">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                                    <span className="text-3xl">📝</span>
                                                </div>
                                                <h3 className="text-lg font-semibold mb-2">
                                                    {isPreviewMode ? 'Etapa em branco' : 'Etapa vazia'}
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    {isPreviewMode
                                                        ? 'Esta etapa ainda não possui conteúdo.'
                                                        : 'Arraste componentes da barra de ferramentas para começar a construir esta etapa.'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        // Render blocks
                                        blocks.map((block) => (
                                            <div
                                                key={block.id}
                                                role="button"
                                                tabIndex={0}
                                                className={`
                          group/canvas-item max-w-full canvas-item min-h-[1.25rem] relative self-auto mr-auto w-full
                          ${!isPreviewMode ? 'cursor-pointer' : 'cursor-default'}
                          ${selectedBlock?.id === block.id && !isPreviewMode ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                        `}
                                                onClick={() => handleBlockClick(block)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleBlockClick(block);
                                                    }
                                                }}
                                            >
                                                <div className={`
                          min-h-[1.25rem] min-w-full relative self-auto box-border rounded-md p-4 bg-background border
                          ${!isPreviewMode ? 'group-hover/canvas-item:border-blue-500 hover:border-blue-500 border-dashed' : 'border-transparent'}
                          ${selectedBlock?.id === block.id && !isPreviewMode ? 'border-blue-500 border-solid' : ''}
                        `}>
                                                    {/* Block type indicator (only in edit mode) */}
                                                    {!isPreviewMode && (
                                                        <div className="absolute -top-2 left-2 px-2 py-1 text-xs bg-blue-500 text-white rounded opacity-0 group-hover/canvas-item:opacity-100 transition-opacity">
                                                            {block.type}
                                                        </div>
                                                    )}

                                                    {/* Block content placeholder */}
                                                    <div className="min-h-[2rem] flex items-center justify-center text-muted-foreground">
                                                        {block.content || `Componente ${block.type}`}
                                                    </div>

                                                    {/* Block actions (only in edit mode and when selected) */}
                                                    {!isPreviewMode && selectedBlock?.id === block.id && (
                                                        <div className="absolute -top-8 right-2 flex gap-1 opacity-0 group-hover/canvas-item:opacity-100 transition-opacity">
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleBlockDelete(block.id);
                                                                }}
                                                                className="h-6 px-2 text-xs"
                                                            >
                                                                Excluir
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom spacing */}
                    <div className="pt-10 md:pt-24" />
                </div>
            </div>
        </div>
    );
};

export { CaktoCanvasHeader };
export default CaktoCanvas;