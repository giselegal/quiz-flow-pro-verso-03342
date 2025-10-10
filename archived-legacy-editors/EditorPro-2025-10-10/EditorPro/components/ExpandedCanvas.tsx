import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';

interface ExpandedCanvasProps {
    logoUrl?: string;
    showLogo?: boolean;
    showProgress?: boolean;
    allowReturn?: boolean;
    progress?: number;
    children?: React.ReactNode;
    onBack?: () => void;
    className?: string;
}

export const ExpandedCanvas: React.FC<ExpandedCanvasProps> = ({
    logoUrl = "https://via.placeholder.com/96x96?text=Logo",
    showLogo = true,
    showProgress = true,
    allowReturn = true,
    progress = 30,
    children,
    onBack,
    className = '',
}) => {
    return (
        <ScrollArea className={`relative w-full overflow-auto z-10 ${className}`}>
            <div className="h-full w-full rounded-[inherit]">
                <div className="group relative main-content w-full min-h-full mx-auto">
                    <div className="flex flex-col gap-4 md:gap-6 h-full justify-between p-3 group-[.screen-mobile]:p-3 md:p-5 pb-10">

                        {/* Header Section */}
                        <div className="grid gap-4 opacity-100">
                            <div className="flex flex-row w-full h-auto justify-center relative">
                                {/* Back Button */}
                                {allowReturn && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={onBack}
                                        className="absolute left-0 h-10 w-10 hover:bg-primary hover:text-foreground"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                )}

                                {/* Header Content */}
                                <div className="flex flex-col w-full max-w-md justify-start items-center gap-4">
                                    {/* Logo */}
                                    {showLogo && (
                                        <img
                                            width="96"
                                            height="96"
                                            className="max-w-24 object-cover rounded-lg"
                                            alt="Logo"
                                            src={logoUrl}
                                        />
                                    )}

                                    {/* Progress Bar */}
                                    {showProgress && (
                                        <Progress
                                            value={progress}
                                            className="w-full h-2 bg-zinc-300"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="main-content w-full relative mx-auto max-w-2xl h-full">
                            <div className="flex flex-row flex-wrap pb-10">
                                {children || <DefaultCanvasContent />}
                            </div>
                        </div>

                        {/* Bottom Spacing */}
                        <div className="pt-10 md:pt-24"></div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

// Default content when no children provided
const DefaultCanvasContent: React.FC = () => {
    const [inputValue, setInputValue] = useState('');

    return (
        <>
            {/* Title */}
            <div className="group/canvas-item max-w-full canvas-item min-h-[1.25rem] relative self-auto mr-auto w-full mb-6">
                <div className="min-h-[1.25rem] min-w-full relative self-auto box-border rounded-md border-2 border-dashed border-transparent hover:border-blue-500 transition-colors">
                    <h1 className="min-w-full text-3xl font-bold text-center text-foreground">
                        Título da Etapa
                    </h1>
                </div>
            </div>

            {/* Image Placeholder */}
            <div className="group/canvas-item max-w-full canvas-item min-h-[1.25rem] relative self-auto mr-auto w-full mb-6">
                <div className="min-h-[1.25rem] min-w-full relative self-auto box-border rounded-md border-2 border-dashed border-transparent hover:border-blue-500 transition-colors">
                    <div className="grid">
                        <div className="text-lg flex items-center justify-center">
                            <div className="w-full max-w-96 h-64 bg-muted rounded-lg flex items-center justify-center">
                                <span className="text-muted-foreground">Arraste uma imagem aqui</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Field */}
            <div className="group/canvas-item max-w-full canvas-item min-h-[1.25rem] relative self-auto mr-auto w-full mb-6">
                <div className="min-h-[1.25rem] min-w-full relative self-auto box-border rounded-md border-2 border-dashed border-transparent hover:border-blue-500 transition-colors">
                    <div className="grid w-full items-center gap-1.5">
                        <label className="text-sm font-medium leading-none">
                            NOME <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Digite seu nome aqui..."
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Button */}
            <div className="group/canvas-item max-w-full canvas-item min-h-[1.25rem] relative self-auto mr-auto w-full">
                <div className="min-h-[1.25rem] min-w-full relative self-auto box-border rounded-md border-2 border-dashed border-transparent hover:border-blue-500 transition-colors">
                    <Button
                        className="w-full h-14 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Continuar
                    </Button>
                </div>
            </div>
        </>
    );
};

export default ExpandedCanvas;