import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Undo,
    Redo,
    Copy,
    PencilRuler,
    Workflow,
    Palette,
    Users,
    Settings,
    MonitorSmartphone,
    MapPin,
    Play,
    Save,
    Cloud,
    X
} from 'lucide-react';

interface FunnelNavbarProps {
    currentMode?: 'builder' | 'flow' | 'design' | 'leads' | 'settings';
    onModeChange?: (mode: string) => void;
    onSave?: () => void;
    onPublish?: () => void;
    onPreview?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onClose?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
}

export const FunnelNavbar: React.FC<FunnelNavbarProps> = ({
    currentMode = 'builder',
    onModeChange,
    onSave,
    onPublish,
    onPreview,
    onUndo,
    onRedo,
    onClose,
    canUndo = false,
    canRedo = false,
}) => {
    const modes = [
        { id: 'builder', label: 'Construtor', icon: PencilRuler },
        { id: 'flow', label: 'Fluxo', icon: Workflow },
        { id: 'design', label: 'Design', icon: Palette },
        { id: 'leads', label: 'Leads', icon: Users },
        { id: 'settings', label: 'Configurações', icon: Settings },
    ];

    return (
        <div className="h-fit border-b relative z-[20] bg-zinc-950/50 backdrop-blur-lg">
            <div className="w-full flex flex-wrap md:flex-nowrap justify-between">

                {/* Left Section - Close & Controls */}
                <div className="order-0 md:order-0 flex w-full max-w-[5.75rem] lg:max-w-[18rem]">
                    <div className="border-r">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="font-bold px-4 py-[1rem] text-zinc-100 border border-transparent hover:bg-zinc-800 rounded-none h-full md:px-5"
                        >
                            <span className="h-full flex items-center w-full justify-center gap-2">
                                <X className="h-4 w-4" />
                            </span>
                        </Button>
                    </div>

                    <div className="flex flex-row justify-between">
                        <div className="flex p-3 gap-1 md:gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onUndo}
                                disabled={!canUndo}
                                className="border-input bg-background hover:bg-primary hover:text-foreground h-10 w-10"
                            >
                                <Undo className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onRedo}
                                disabled={!canRedo}
                                className="border-input bg-background hover:bg-primary hover:text-foreground h-10 w-10"
                            >
                                <Redo className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="border-input bg-background hover:bg-primary hover:text-foreground h-10 w-10"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Mobile Actions */}
                        <div className="md:hidden order-1 md:order-3 w-full flex gap-1 md:gap-2 p-3">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onPreview}
                                className="border-input bg-background hover:bg-primary hover:text-foreground h-10 w-10"
                            >
                                <MonitorSmartphone className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="border-input bg-background hover:bg-primary hover:text-foreground h-10 w-10"
                            >
                                <MapPin className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onPreview}
                                className="border-input bg-background hover:bg-primary hover:text-foreground h-10 w-10"
                            >
                                <Play className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                onClick={onSave}
                                className="border-input bg-background hover:bg-primary hover:text-foreground h-10 px-4 py-2"
                            >
                                <span className="md:inline hidden">Salvar</span>
                                <Save className="w-4 h-4 md:hidden block" />
                            </Button>

                            <Button
                                onClick={onPublish}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                                <span className="md:inline hidden">Publicar</span>
                                <Cloud className="w-4 h-4 md:hidden block" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Center Section - Mode Tabs */}
                <div className="border-t md:border-t-0 md:order-1 w-full">
                    <div className="md:mx-auto md:max-w-[32rem] flex h-full items-center justify-center p-1 md:p-0 gap-1 md:gap-2">
                        {modes.map(({ id, label, icon: Icon }) => (
                            <Button
                                key={id}
                                variant={currentMode === id ? 'default' : 'ghost'}
                                onClick={() => onModeChange?.(id)}
                                className={`h-10 px-4 py-2 ${currentMode === id
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

                {/* Right Section - Actions */}
                <div className="md:flex hidden order-1 md:order-3 w-fit gap-1 md:gap-2 p-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onPreview}
                        className="border-input bg-background hover:bg-primary hover:text-foreground h-10 w-10"
                    >
                        <MonitorSmartphone className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="border-input bg-background hover:bg-primary hover:text-foreground h-10 w-10"
                    >
                        <MapPin className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onPreview}
                        className="border-input bg-background hover:bg-primary hover:text-foreground h-10 w-10"
                    >
                        <Play className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onSave}
                        className="border-input bg-background hover:bg-primary hover:text-foreground h-10 px-4 py-2"
                    >
                        <span className="md:inline hidden">Salvar</span>
                        <Save className="w-4 h-4 md:hidden block" />
                    </Button>

                    <Button
                        onClick={onPublish}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        <span className="md:inline hidden">Publicar</span>
                        <Cloud className="w-4 h-4 md:hidden block" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FunnelNavbar;