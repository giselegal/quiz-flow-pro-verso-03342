/**
 * 🎭 LIVE PREVIEW SYSTEM - SISTEMA DE PREVIEW EM TEMPO REAL
 * 
 * Sistema que permite visualizar mudanças de propriedades em tempo real
 * no canvas enquanto edita no painel de propriedades.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Eye,
    Play,
    Pause,
    RotateCcw,
    Zap,
    Clock,
    Monitor,
    Smartphone,
    Tablet
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ===== INTERFACES =====

interface LivePreviewSystemProps {
    isEnabled: boolean;
    onToggle: (enabled: boolean) => void;
    onPropertyChange: (key: string, value: any, isPreview: boolean) => void;
    className?: string;
}

interface PreviewSettings {
    autoPlay: boolean;
    animationSpeed: number;
    showGrid: boolean;
    showRulers: boolean;
    device: 'desktop' | 'tablet' | 'mobile';
    zoom: number;
    highlightChanges: boolean;
    showTooltips: boolean;
}

interface AnimationFrame {
    timestamp: number;
    property: string;
    value: any;
    duration: number;
    easing: string;
}

// ===== CONSTANTS =====

const DEVICE_SIZES = {
    desktop: { width: 1200, height: 800, label: 'Desktop' },
    tablet: { width: 768, height: 1024, label: 'Tablet' },
    mobile: { width: 375, height: 667, label: 'Mobile' }
};

const EASING_FUNCTIONS = {
    'ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    'ease-in': 'cubic-bezier(0.42, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.58, 1)',
    'ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)',
    'linear': 'linear',
    'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

// ===== MAIN COMPONENT =====

export const LivePreviewSystem: React.FC<LivePreviewSystemProps> = ({
    isEnabled,
    onToggle,
    onPropertyChange,
    className
}) => {
    // ===== STATE =====
    const [settings, setSettings] = useState<PreviewSettings>({
        autoPlay: true,
        animationSpeed: 200,
        showGrid: true,
        showRulers: false,
        device: 'desktop',
        zoom: 100,
        highlightChanges: true,
        showTooltips: true
    });

    const [animationQueue, setAnimationQueue] = useState<AnimationFrame[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [previewHistory, setPreviewHistory] = useState<Record<string, any[]>>({});

    const animationRef = useRef<number>();
    const lastUpdateRef = useRef<number>(0);

    // ===== ANIMATION SYSTEM =====
    const addAnimationFrame = useCallback((property: string, value: any) => {
        const frame: AnimationFrame = {
            timestamp: Date.now(),
            property,
            value,
            duration: settings.animationSpeed,
            easing: 'ease-out'
        };

        setAnimationQueue(prev => [...prev.slice(-10), frame]); // Keep last 10 frames

        // Add to history
        setPreviewHistory(prev => ({
            ...prev,
            [property]: [...(prev[property] || []).slice(-5), value] // Keep last 5 values
        }));
    }, [settings.animationSpeed]);

    const playAnimation = useCallback(() => {
        if (animationQueue.length === 0) return;

        setIsPlaying(true);
        setCurrentFrame(0);

        const animate = (timestamp: number) => {
            if (timestamp - lastUpdateRef.current >= settings.animationSpeed) {
                if (currentFrame < animationQueue.length) {
                    const frame = animationQueue[currentFrame];
                    onPropertyChange(frame.property, frame.value, true);
                    setCurrentFrame(prev => prev + 1);
                    lastUpdateRef.current = timestamp;
                } else {
                    setIsPlaying(false);
                    return;
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [animationQueue, currentFrame, settings.animationSpeed, onPropertyChange]);

    const stopAnimation = useCallback(() => {
        setIsPlaying(false);
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
    }, []);

    const resetAnimation = useCallback(() => {
        stopAnimation();
        setAnimationQueue([]);
        setCurrentFrame(0);
        setPreviewHistory({});
    }, [stopAnimation]);

    // ===== DEVICE SIMULATION =====
    const handleDeviceChange = useCallback((device: keyof typeof DEVICE_SIZES) => {
        setSettings(prev => ({ ...prev, device }));

        // Simulate device change in preview
        const deviceSize = DEVICE_SIZES[device];
        onPropertyChange('__preview_device__', device, true);
        onPropertyChange('__preview_width__', deviceSize.width, true);
        onPropertyChange('__preview_height__', deviceSize.height, true);
    }, [onPropertyChange]);

    // ===== PREVIEW EFFECTS =====
    useEffect(() => {
        if (!isEnabled) return;

        // Apply preview styles
        const previewStyles = `
      .quiz-canvas-preview {
        transition: all ${settings.animationSpeed}ms ${EASING_FUNCTIONS['ease-out']};
        ${settings.showGrid ? `
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        ` : ''}
        ${settings.highlightChanges ? `
          box-shadow: 0 0 0 2px rgba(184, 155, 122, 0.3);
        ` : ''}
        transform: scale(${settings.zoom / 100});
        transform-origin: top left;
      }
      
      .quiz-canvas-preview .property-changed {
        animation: propertyHighlight 0.3s ease-out;
      }
      
      @keyframes propertyHighlight {
        0% { background-color: rgba(184, 155, 122, 0.2); }
        100% { background-color: transparent; }
      }
      
      .quiz-canvas-preview .device-frame {
        width: ${DEVICE_SIZES[settings.device].width}px;
        height: ${DEVICE_SIZES[settings.device].height}px;
        border: 2px solid #ddd;
        border-radius: ${settings.device === 'mobile' ? '20px' : settings.device === 'tablet' ? '12px' : '8px'};
        overflow: hidden;
      }
    `;

        // Inject styles
        const styleElement = document.createElement('style');
        styleElement.id = 'live-preview-styles';
        styleElement.textContent = previewStyles;
        document.head.appendChild(styleElement);

        return () => {
            const existingStyle = document.getElementById('live-preview-styles');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, [isEnabled, settings]);

    // ===== AUTO-PLAY EFFECT =====
    useEffect(() => {
        if (settings.autoPlay && animationQueue.length > 0 && !isPlaying) {
            const timeout = setTimeout(playAnimation, 100);
            return () => clearTimeout(timeout);
        }
    }, [settings.autoPlay, animationQueue.length, isPlaying, playAnimation]);

    // ===== CLEANUP =====
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // ===== RENDER =====
    return (
        <Card className={cn("w-full", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <CardTitle className="text-sm">Preview em Tempo Real</CardTitle>
                        <Badge variant={isEnabled ? "default" : "secondary"} className="text-xs">
                            {isEnabled ? 'Ativo' : 'Inativo'}
                        </Badge>
                    </div>
                    <Switch
                        checked={isEnabled}
                        onCheckedChange={onToggle}
                    />
                </div>
            </CardHeader>

            {isEnabled && (
                <CardContent className="space-y-4">
                    {/* Animation Controls */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Controles de Animação</Label>
                            <div className="flex items-center gap-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={isPlaying ? stopAnimation : playAnimation}
                                                disabled={animationQueue.length === 0}
                                                className="h-8 w-8 p-0"
                                            >
                                                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {isPlaying ? 'Pausar animação' : 'Reproduzir animação'}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={resetAnimation}
                                                className="h-8 w-8 p-0"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Resetar animação</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        {/* Animation Speed */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Velocidade da Animação</Label>
                                <Badge variant="outline" className="text-xs">
                                    {settings.animationSpeed}ms
                                </Badge>
                            </div>
                            <Slider
                                value={[settings.animationSpeed]}
                                onValueChange={([value]) => setSettings(prev => ({ ...prev, animationSpeed: value }))}
                                min={50}
                                max={1000}
                                step={50}
                                className="w-full"
                            />
                        </div>

                        {/* Auto-play */}
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Reprodução Automática</Label>
                            <Switch
                                checked={settings.autoPlay}
                                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoPlay: checked }))}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Device Simulation */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Simulação de Dispositivo</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(DEVICE_SIZES).map(([device, config]) => (
                                <Button
                                    key={device}
                                    size="sm"
                                    variant={settings.device === device ? "default" : "outline"}
                                    onClick={() => handleDeviceChange(device as keyof typeof DEVICE_SIZES)}
                                    className="flex flex-col items-center gap-1 h-auto py-2"
                                >
                                    {device === 'desktop' && <Monitor className="w-4 h-4" />}
                                    {device === 'tablet' && <Tablet className="w-4 h-4" />}
                                    {device === 'mobile' && <Smartphone className="w-4 h-4" />}
                                    <span className="text-xs">{config.label}</span>
                                </Button>
                            ))}
                        </div>

                        {/* Zoom Control */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Zoom</Label>
                                <Badge variant="outline" className="text-xs">
                                    {settings.zoom}%
                                </Badge>
                            </div>
                            <Slider
                                value={[settings.zoom]}
                                onValueChange={([value]) => {
                                    setSettings(prev => ({ ...prev, zoom: value }));
                                    onPropertyChange('__preview_zoom__', value, true);
                                }}
                                min={25}
                                max={200}
                                step={25}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Visual Aids */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Auxílios Visuais</Label>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Grade</Label>
                                <Switch
                                    checked={settings.showGrid}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showGrid: checked }))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Réguas</Label>
                                <Switch
                                    checked={settings.showRulers}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showRulers: checked }))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Destacar Mudanças</Label>
                                <Switch
                                    checked={settings.highlightChanges}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, highlightChanges: checked }))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Tooltips</Label>
                                <Switch
                                    checked={settings.showTooltips}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showTooltips: checked }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Animation Queue */}
                    {animationQueue.length > 0 && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Fila de Animação</Label>
                                    <Badge variant="outline" className="text-xs">
                                        {animationQueue.length} frames
                                    </Badge>
                                </div>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {animationQueue.slice(-5).map((frame, index) => (
                                        <div
                                            key={`${frame.timestamp}-${index}`}
                                            className={cn(
                                                "flex items-center justify-between p-2 text-xs rounded",
                                                index === currentFrame ? "bg-primary/10" : "bg-muted/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Zap className="w-3 h-3" />
                                                <span className="font-medium">{frame.property}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                {frame.duration}ms
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Performance Stats */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Frames na fila:</span>
                                <Badge variant="secondary" className="text-xs">
                                    {animationQueue.length}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Frame atual:</span>
                                <Badge variant="secondary" className="text-xs">
                                    {currentFrame + 1}/{animationQueue.length || 1}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};

export default LivePreviewSystem;
