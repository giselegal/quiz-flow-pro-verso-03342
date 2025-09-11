import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Play,
    Pause,
    RotateCcw,
    Zap,
    Settings,
    Eye,
    Code,
    Sparkles,
    Timer
} from 'lucide-react';
import ContextualTooltip, { tooltipLibrary } from './ContextualTooltip';
import type { PropertyEditorProps } from './types';

interface AnimationConfig {
    type: 'fadeIn' | 'slideIn' | 'scaleIn' | 'bounce' | 'pulse' | 'shake' | 'rotate' | 'custom';
    duration: number; // em segundos
    delay: number;
    timing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'cubic-bezier';
    direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    iteration: number | 'infinite';
    customKeyframes?: string;
    trigger: 'load' | 'hover' | 'click' | 'scroll' | 'manual';
}

/**
 * Editor visual para animações CSS com preview em tempo real
 * Features: Presets, controles avançados, preview interativo, CSS export
 */
const AnimationPreviewEditor: React.FC<PropertyEditorProps> = ({
    property,
    onChange
}) => {
    const [config, setConfig] = useState<AnimationConfig>({
        type: 'fadeIn',
        duration: 0.5,
        delay: 0,
        timing: 'ease',
        direction: 'normal',
        iteration: 1,
        trigger: 'load'
    });

    const [isPlaying, setIsPlaying] = useState(false);
    const [showCode, setShowCode] = useState(false);

    // Inicializar com valor atual
    useEffect(() => {
        const currentValue = property.value;
        if (typeof currentValue === 'object' && currentValue !== null) {
            setConfig(prev => ({ ...prev, ...currentValue }));
        }
    }, [property.value]);

    // Atualizar propriedade quando config muda
    useEffect(() => {
        onChange(property.key, config);
    }, [config, property.key, onChange]);

    const updateConfig = (updates: Partial<AnimationConfig>) => {
        setConfig(prev => ({ ...prev, ...updates }));
    };

    const animationPresets = {
        fadeIn: {
            keyframes: 'opacity: 0 → opacity: 1',
            css: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `
        },
        slideIn: {
            keyframes: 'transform: translateX(-100%) → transform: translateX(0)',
            css: `
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `
        },
        scaleIn: {
            keyframes: 'transform: scale(0) → transform: scale(1)',
            css: `
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `
        },
        bounce: {
            keyframes: 'Multi-step bounce effect',
            css: `
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-30px,0); }
          70% { transform: translate3d(0,-15px,0); }
          90% { transform: translate3d(0,-4px,0); }
        }
      `
        },
        pulse: {
            keyframes: 'transform: scale(1) → scale(1.05) → scale(1)',
            css: `
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `
        },
        shake: {
            keyframes: 'Horizontal shake motion',
            css: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
      `
        },
        rotate: {
            keyframes: 'transform: rotate(0deg) → rotate(360deg)',
            css: `
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `
        }
    };

    const generateCSS = (): string => {
        const { type, duration, delay, timing, direction, iteration } = config;

        const animationValue = `${type} ${duration}s ${timing} ${delay}s ${iteration === 'infinite' ? 'infinite' : iteration} ${direction}`;

        return `animation: ${animationValue};`;
    };

    const playAnimation = () => {
        setIsPlaying(true);
        setTimeout(() => {
            setIsPlaying(false);
        }, (config.duration + config.delay) * 1000);
    };

    const getAnimationStyle = () => {
        if (!isPlaying) return {};

        const animationName = config.type;
        const animationDuration = `${config.duration}s`;
        const animationDelay = `${config.delay}s`;
        const animationTimingFunction = config.timing;
        const animationDirection = config.direction;
        const animationIterationCount = config.iteration === 'infinite' ? 'infinite' : config.iteration;
        const animationFillMode = 'both';

        return {
            animationName,
            animationDuration,
            animationDelay,
            animationTimingFunction,
            animationDirection,
            animationIterationCount,
            animationFillMode,
        };
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <CardTitle className="text-sm">{property.label}</CardTitle>
                        <ContextualTooltip info={tooltipLibrary.animation} compact />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCode(!showCode)}
                            className={`h-6 px-2 text-xs ${showCode ? 'text-purple-600' : 'text-gray-600'}`}
                        >
                            <Code className="w-3 h-3 mr-1" />
                            CSS
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={playAnimation}
                            disabled={isPlaying}
                            className="h-6 px-2 text-xs"
                        >
                            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </Button>
                    </div>
                </div>
                {property.description && (
                    <p className="text-xs text-muted-foreground">{property.description}</p>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Preview Area */}
                <div className="relative">
                    <Label className="text-xs font-medium mb-2 block">Preview:</Label>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border rounded-lg p-8 flex items-center justify-center min-h-[120px]">
                        <div
                            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg flex items-center justify-center"
                            style={getAnimationStyle()}
                        >
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    {isPlaying && (
                        <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                <Timer className="w-3 h-3" />
                                Playing
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Animation Type */}
                <div className="space-y-2">
                    <Label className="text-xs font-medium">Animation Type:</Label>
                    <Select
                        value={config.type}
                        onValueChange={(value: any) => updateConfig({ type: value })}
                    >
                        <SelectTrigger className="h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(animationPresets).map(([key, preset]) => (
                                <SelectItem key={key} value={key}>
                                    <div className="flex flex-col">
                                        <span className="capitalize font-medium">{key}</span>
                                        <span className="text-xs text-gray-500">{preset.keyframes}</span>
                                    </div>
                                </SelectItem>
                            ))}
                            <SelectItem value="custom">Custom Keyframes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Controls Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Duration */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Duration</Label>
                            <span className="text-xs text-gray-500">{config.duration}s</span>
                        </div>
                        <Slider
                            value={[config.duration]}
                            onValueChange={([value]) => updateConfig({ duration: value })}
                            min={0.1}
                            max={3}
                            step={0.1}
                            className="h-2"
                        />
                    </div>

                    {/* Delay */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Delay</Label>
                            <span className="text-xs text-gray-500">{config.delay}s</span>
                        </div>
                        <Slider
                            value={[config.delay]}
                            onValueChange={([value]) => updateConfig({ delay: value })}
                            min={0}
                            max={2}
                            step={0.1}
                            className="h-2"
                        />
                    </div>

                    {/* Timing Function */}
                    <div className="space-y-2">
                        <Label className="text-xs">Timing Function</Label>
                        <Select
                            value={config.timing}
                            onValueChange={(value: any) => updateConfig({ timing: value })}
                        >
                            <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ease">Ease</SelectItem>
                                <SelectItem value="ease-in">Ease In</SelectItem>
                                <SelectItem value="ease-out">Ease Out</SelectItem>
                                <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                                <SelectItem value="linear">Linear</SelectItem>
                                <SelectItem value="cubic-bezier">Cubic Bezier</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Iteration Count */}
                    <div className="space-y-2">
                        <Label className="text-xs">Repeat</Label>
                        <div className="flex gap-1">
                            <Input
                                type="number"
                                value={config.iteration === 'infinite' ? '' : config.iteration}
                                onChange={(e) => updateConfig({ iteration: e.target.value ? Number(e.target.value) : 1 })}
                                placeholder="1"
                                className="h-7 text-xs flex-1"
                                min={1}
                                max={10}
                            />
                            <Button
                                variant={config.iteration === 'infinite' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateConfig({ iteration: config.iteration === 'infinite' ? 1 : 'infinite' })}
                                className="h-7 px-2 text-xs"
                            >
                                ∞
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Direction & Trigger */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs">Direction</Label>
                        <Select
                            value={config.direction}
                            onValueChange={(value: any) => updateConfig({ direction: value })}
                        >
                            <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="reverse">Reverse</SelectItem>
                                <SelectItem value="alternate">Alternate</SelectItem>
                                <SelectItem value="alternate-reverse">Alt-Reverse</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs">Trigger</Label>
                        <Select
                            value={config.trigger}
                            onValueChange={(value: any) => updateConfig({ trigger: value })}
                        >
                            <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="load">On Load</SelectItem>
                                <SelectItem value="hover">On Hover</SelectItem>
                                <SelectItem value="click">On Click</SelectItem>
                                <SelectItem value="scroll">On Scroll</SelectItem>
                                <SelectItem value="manual">Manual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Custom Keyframes */}
                {config.type === 'custom' && (
                    <div className="space-y-2">
                        <Label className="text-xs font-medium">Custom CSS Keyframes:</Label>
                        <textarea
                            className="w-full h-24 px-3 py-2 text-xs font-mono border rounded-md resize-none"
                            placeholder={`@keyframes customAnimation {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}`}
                            value={config.customKeyframes || ''}
                            onChange={(e) => updateConfig({ customKeyframes: e.target.value })}
                        />
                    </div>
                )}

                {/* Generated CSS */}
                {showCode && (
                    <div className="space-y-2">
                        <Label className="text-xs font-medium flex items-center gap-1">
                            <Code className="w-3 h-3" />
                            Generated CSS:
                        </Label>
                        <div className="bg-gray-900 text-green-400 p-3 rounded-md text-xs font-mono overflow-x-auto">
                            <div className="mb-2 text-gray-400">/* Keyframes */</div>
                            <pre className="whitespace-pre-wrap">
                                {animationPresets[config.type as keyof typeof animationPresets]?.css || config.customKeyframes}
                            </pre>
                            <div className="mt-2 mb-1 text-gray-400">/* Element style */</div>
                            <div className="text-blue-400">{generateCSS()}</div>
                        </div>
                    </div>
                )}

                {/* Quick Presets */}
                <div className="space-y-2">
                    <Label className="text-xs font-medium">Quick Presets:</Label>
                    <div className="flex flex-wrap gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateConfig({ type: 'fadeIn', duration: 0.3, delay: 0, timing: 'ease' })}
                            className="h-7 px-2 text-xs"
                        >
                            Quick Fade
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateConfig({ type: 'bounce', duration: 1, delay: 0, timing: 'ease', iteration: 1 })}
                            className="h-7 px-2 text-xs"
                        >
                            Attention Bounce
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateConfig({ type: 'pulse', duration: 2, delay: 0, timing: 'ease-in-out', iteration: 'infinite' })}
                            className="h-7 px-2 text-xs"
                        >
                            Slow Pulse
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateConfig({ type: 'slideIn', duration: 0.5, delay: 0.2, timing: 'ease-out' })}
                            className="h-7 px-2 text-xs"
                        >
                            Slide + Delay
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateConfig({
                                type: 'fadeIn', duration: 0.5, delay: 0, timing: 'ease',
                                direction: 'normal', iteration: 1, trigger: 'load'
                            })}
                            className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                        >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Tip */}
                <div className="bg-purple-50 border border-purple-200 text-xs p-2 rounded">
                    <strong>Tip:</strong> Use shorter durations (0.2-0.5s) for UI interactions, longer (1-2s) for attention-grabbing effects.
                    The '{config.trigger}' trigger determines when the animation starts.
                </div>
            </CardContent>

            {/* CSS Keyframes for preview */}
            <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-30px,0); }
          70% { transform: translate3d(0,-15px,0); }
          90% { transform: translate3d(0,-4px,0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </Card>
    );
};

export default AnimationPreviewEditor;
