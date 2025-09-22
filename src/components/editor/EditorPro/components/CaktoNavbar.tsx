import React from 'react';
import { Button } from '@/components/ui/button';
import {
    X,
    Undo,
    Redo,
    Copy,
    PencilRuler,
    Workflow,
    Palette,
    UserRoundSearch,
    Cog,
    MonitorSmartphone,
    Waypoints,
    Play,
    Save,
    Cloud
} from 'lucide-react';

interface CaktoNavbarProps {
    currentStep: number;
    totalSteps: number;
    isPreviewMode?: boolean;
    canUndo?: boolean;
    canRedo?: boolean;
    isSaving?: boolean;
    activeMode?: 'builder' | 'flow' | 'design' | 'leads' | 'config';
    onModeChange?: (mode: 'builder' | 'flow' | 'design' | 'leads' | 'config') => void;
    onTogglePreview?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onCopy?: () => void;
    onSave?: () => void;
    onPublish?: () => void;
    onSettings?: () => void;
    onClose?: () => void;
}

const CaktoNavbar: React.FC<CaktoNavbarProps> = ({
    currentStep,
    totalSteps,
    isPreviewMode = false,
    canUndo = false,
    canRedo = false,
    isSaving = false,
    activeMode = 'builder',
    onModeChange,
    onTogglePreview,
    onUndo,
    onRedo,
    onCopy,
    onSave,
    onPublish,
    onSettings,
    onClose
}) => {
    const modes = [
        { id: 'builder', label: 'Construtor', icon: PencilRuler },
        { id: 'flow', label: 'Fluxo', icon: Workflow },
        { id: 'design', label: 'Design', icon: Palette },
        { id: 'leads', label: 'Leads', icon: UserRoundSearch },
        { id: 'config', label: 'Configurações', icon: Cog },
    ] as const;

    return (
        <div className="h-fit border-b relative z-20 bg-zinc-950/50 backdrop-blur-lg">
            <div className="w-full flex flex-wrap md:flex-nowrap justify-between">

                {/* Left Section - Logo and Controls */}
                <div className="order-0 md:order-0 flex w-full max-w-[5.75rem] lg:max-w-[18rem]">
                    {/* Close Button */}
                    <div className="border-r">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="inline-block relative font-bold px-4 py-[1rem] text-zinc-100 border border-transparent hover:bg-primary rounded-none h-full md:px-5"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-row justify-between">
                        <div className="flex p-3 gap-1 md:gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onUndo}
                                disabled={!canUndo}
                                className="h-10 w-10"
                            >
                                <Undo className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onRedo}
                                disabled={!canRedo}
                                className="h-10 w-10"
                            >
                                <Redo className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onCopy}
                                className="h-10 w-10"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Mobile Action Controls */}
                        <div className="md:hidden order-1 md:order-3 w-full flex gap-1 md:gap-2 p-3">
                            <Button variant="outline" size="icon" className="h-10 w-10 md:flex hidden">
                                <MonitorSmartphone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-10 w-10">
                                <Waypoints className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-10 w-10">
                                <Play className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="h-10 px-4 py-2">
                                <span className="md:inline hidden">Salvar</span>
                                <Save className="w-4 h-4 md:hidden block" />
                            </Button>
                            <Button className="h-10 px-4 py-2">
                                <span className="md:inline hidden">Publicar</span>
                                <Cloud className="w-4 h-4 md:hidden block" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Center Section - Mode Navigation */}
                <div className="border-t md:border-t-0 md:order-1 w-full">
                    <div className="md:mx-auto md:max-w-[32rem] flex h-full items-center justify-center p-1 md:p-0 gap-1 md:gap-2">
                        {modes.map(({ id, label, icon: Icon }) => (
                            <Button
                                key={id}
                                variant={activeMode === id ? "default" : "ghost"}
                                onClick={() => onModeChange?.(id)}
                                className={`h-10 px-4 py-2 ${activeMode === id
                                        ? 'bg-primary text-foreground'
                                        : 'hover:bg-primary hover:text-foreground'
                                    }`}
                            >
                                <Icon className="md:mr-2 md:mx-0 mx-4 h-4 w-4" />
                                <span className="hidden md:inline">{label}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Right Section - Action Buttons */}
                <div className="md:flex hidden order-1 md:order-3 w-fit gap-1 md:gap-2 p-3">
                    <Button variant="outline" size="icon" className="items-center justify-center h-10 w-10 md:flex hidden">
                        <MonitorSmartphone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10">
                        <Waypoints className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={onTogglePreview}
                    >
                        <Play className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-10 px-4 py-2"
                        onClick={onSave}
                        disabled={isSaving}
                    >
                        <span className="md:inline hidden">
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </span>
                        <Save className="w-4 h-4 md:hidden block" />
                    </Button>
                    <Button
                        className="h-10 px-4 py-2"
                        onClick={onPublish}
                        disabled={isSaving}
                    >
                        <span className="md:inline hidden">Publicar</span>
                        <Cloud className="w-4 h-4 md:hidden block" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CaktoNavbar;