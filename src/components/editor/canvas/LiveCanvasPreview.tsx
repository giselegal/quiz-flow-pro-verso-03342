/**
 * 🎭 LIVE CANVAS PREVIEW - Preview ao Vivo do Canvas
 * 
 * Sistema completo de preview em tempo real que sincroniza automaticamente
 * com as mudanças no Canvas do editor.
 */

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Separator } from '../../ui/separator';
import {
    Eye,
    EyeOff,
    Monitor,
    Smartphone,
    Tablet,
    RefreshCw,
    Zap,
    Wifi,
    WifiOff,
    Clock,
    Settings
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import QuizAppConnected from '../../quiz/QuizAppConnected';
import { useQuizRuntimeRegistry } from '../../../runtime/quiz/QuizRuntimeRegistry';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface LiveCanvasPreviewProps {
    /** Steps atuais do editor */
    steps: any[];
    /** ID do funil */
    funnelId?: string;
    /** Step ID atualmente selecionada no canvas */
    selectedStepId?: string;
    /** Callback quando preview muda de step */
    onStepChange?: (stepId: string) => void;
    /** Configurações customizadas */
    config?: LivePreviewConfig;
    /** Classe CSS adicional */
    className?: string;
}

interface LivePreviewConfig {
    /** Auto-refresh habilitado */
    autoRefresh?: boolean;
    /** Delay de debounce em ms */
    debounceDelay?: number;
    /** Dispositivo padrão */
    defaultDevice?: DeviceType;
    /** Mostrar debug info */
    showDebugInfo?: boolean;
    /** Destacar mudanças */
    highlightChanges?: boolean;
    /** Isolamento de estado */
    isolatePreviewState?: boolean;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type PreviewStatus = 'idle' | 'syncing' | 'updating' | 'error' | 'disconnected';

interface PreviewState {
    isEnabled: boolean;
    device: DeviceType;
    zoom: number;
    status: PreviewStatus;
    lastUpdate: number;
    updateCount: number;
    errorMessage?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEVICE_CONFIGS = {
    desktop: {
        width: '100%',
        maxWidth: '1200px',
        icon: Monitor,
        label: 'Desktop',
        scale: 1
    },
    tablet: {
        width: '768px',
        maxWidth: '768px',
        icon: Tablet,
        label: 'Tablet',
        scale: 0.8
    },
    mobile: {
        width: '375px',
        maxWidth: '375px',
        icon: Smartphone,
        label: 'Mobile',
        scale: 0.6
    }
} as const;

const DEFAULT_CONFIG: Required<LivePreviewConfig> = {
    autoRefresh: true,
    debounceDelay: 300,
    defaultDevice: 'desktop',
    showDebugInfo: false,
    highlightChanges: true,
    isolatePreviewState: true
};

// ============================================================================
// DEBOUNCE HOOK
// ============================================================================

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const LiveCanvasPreview: React.FC<LiveCanvasPreviewProps> = ({
    steps = [],
    funnelId = 'quiz-estilo-21-steps',
    selectedStepId,
    onStepChange,
    config: userConfig,
    className
}) => {
    // ===== CONFIG MERGER =====
    const config = useMemo(() => ({
        ...DEFAULT_CONFIG,
        ...userConfig
    }), [userConfig]);

    // ===== STATE =====
    const [previewState, setPreviewState] = useState<PreviewState>({
        isEnabled: true,
        device: config.defaultDevice,
        zoom: 100,
        status: 'idle',
        lastUpdate: Date.now(),
        updateCount: 0
    });

    // ===== DEBOUNCED VALUES =====
    const debouncedSteps = useDebounce(steps, config.debounceDelay);
    const debouncedSelectedStepId = useDebounce(selectedStepId, config.debounceDelay);

    // ===== REFS =====
    const lastStepsHashRef = useRef<string>('');
    const updateTimeoutRef = useRef<NodeJS.Timeout>();
    const previewContainerRef = useRef<HTMLDivElement>(null);

    // ===== REGISTRY HOOK =====
    const { setSteps: setRegistrySteps, version } = useQuizRuntimeRegistry();

    // ===== HANDLERS =====
    const handleTogglePreview = useCallback(() => {
        setPreviewState(prev => ({
            ...prev,
            isEnabled: !prev.isEnabled,
            status: !prev.isEnabled ? 'syncing' : 'idle'
        }));
    }, []);

    const handleDeviceChange = useCallback((device: DeviceType) => {
        setPreviewState(prev => ({
            ...prev,
            device,
            lastUpdate: Date.now()
        }));
    }, []);

    const handleManualRefresh = useCallback(() => {
        setPreviewState(prev => ({
            ...prev,
            status: 'updating',
            lastUpdate: Date.now(),
            updateCount: prev.updateCount + 1
        }));

        // Simular delay de refresh
        setTimeout(() => {
            setPreviewState(prev => ({
                ...prev,
                status: 'idle'
            }));
        }, 500);
    }, []);

    const handleStepChangeInternal = useCallback((stepId: string) => {
        onStepChange?.(stepId);
    }, [onStepChange]);

    // ===== SYNC EFFECT =====
    useEffect(() => {
        if (!previewState.isEnabled || !config.autoRefresh) return;

        const stepsHash = JSON.stringify(debouncedSteps);

        // Skip se não houve mudanças reais
        if (stepsHash === lastStepsHashRef.current) return;

        setPreviewState(prev => ({ ...prev, status: 'syncing' }));

        // Clear timeout anterior se existir
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }

        // Atualizar registry com delay
        updateTimeoutRef.current = setTimeout(() => {
            try {
                // Converter steps para formato runtime
                const runtimeMap = convertStepsToRuntimeMap(debouncedSteps);
                setRegistrySteps(runtimeMap);

                lastStepsHashRef.current = stepsHash;

                setPreviewState(prev => ({
                    ...prev,
                    status: 'idle',
                    lastUpdate: Date.now(),
                    updateCount: prev.updateCount + 1,
                    errorMessage: undefined
                }));

                if (config.showDebugInfo) {
                    console.log('🎭 LiveCanvasPreview synced:', {
                        stepsCount: debouncedSteps.length,
                        runtimeSteps: Object.keys(runtimeMap).length,
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (error) {
                setPreviewState(prev => ({
                    ...prev,
                    status: 'error',
                    errorMessage: error instanceof Error ? error.message : 'Erro desconhecido'
                }));
                console.error('❌ LiveCanvasPreview sync error:', error);
            }
        }, 100);

        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, [debouncedSteps, previewState.isEnabled, config.autoRefresh, config.showDebugInfo, setRegistrySteps]);

    // ===== CLEANUP =====
    useEffect(() => {
        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, []);

    // ===== RENDER HELPERS =====
    const renderStatusIndicator = () => {
        const statusConfig = {
            idle: { icon: Wifi, color: 'text-green-500', label: 'Sincronizado' },
            syncing: { icon: RefreshCw, color: 'text-blue-500', label: 'Sincronizando...' },
            updating: { icon: Clock, color: 'text-yellow-500', label: 'Atualizando...' },
            error: { icon: WifiOff, color: 'text-red-500', label: 'Erro' },
            disconnected: { icon: WifiOff, color: 'text-gray-500', label: 'Desconectado' }
        };

        const { icon: Icon, color, label } = statusConfig[previewState.status];

        return (
            <div className="flex items-center gap-1 text-xs">
                <Icon className={cn("w-3 h-3", color, {
                    'animate-spin': previewState.status === 'syncing' || previewState.status === 'updating'
                })} />
                <span className={color}>{label}</span>
            </div>
        );
    };

    const renderDeviceControls = () => (
        <div className="flex items-center gap-1">
            {(Object.entries(DEVICE_CONFIGS) as [DeviceType, typeof DEVICE_CONFIGS[DeviceType]][]).map(([device, deviceConfig]) => {
                const Icon = deviceConfig.icon;
                const isActive = previewState.device === device;

                return (
                    <Button
                        key={device}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDeviceChange(device)}
                        className="p-2"
                        title={deviceConfig.label}
                    >
                        <Icon className="w-3 h-3" />
                    </Button>
                );
            })}
        </div>
    );

    const renderPreviewContent = () => {
        if (!previewState.isEnabled) {
            return (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center space-y-2">
                        <EyeOff className="w-8 h-8 mx-auto" />
                        <p>Preview desabilitado</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleTogglePreview}
                        >
                            Habilitar Preview
                        </Button>
                    </div>
                </div>
            );
        }

        if (previewState.status === 'error') {
            return (
                <div className="flex items-center justify-center h-64 text-red-500">
                    <div className="text-center space-y-2">
                        <WifiOff className="w-8 h-8 mx-auto" />
                        <p>Erro no preview</p>
                        {previewState.errorMessage && (
                            <p className="text-xs text-muted-foreground">{previewState.errorMessage}</p>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleManualRefresh}
                        >
                            Tentar novamente
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div
                ref={previewContainerRef}
                className={cn(
                    "preview-container transition-all duration-300",
                    config.highlightChanges && previewState.status === 'syncing' && "ring-2 ring-blue-300"
                )}
                style={{
                    width: DEVICE_CONFIGS[previewState.device].width,
                    maxWidth: DEVICE_CONFIGS[previewState.device].maxWidth,
                    margin: '0 auto',
                    transform: `scale(${DEVICE_CONFIGS[previewState.device].scale})`,
                    transformOrigin: 'top center'
                }}
            >
                <QuizAppConnected
                    funnelId={funnelId}
                    previewMode={true}
                    initialStepId={debouncedSelectedStepId}
                />
            </div>
        );
    };

    // ===== MAIN RENDER =====
    return (
        <Card className={cn("w-full h-full flex flex-col", className)}>
            <CardHeader className="pb-3 space-y-3">
                {/* Header Principal */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <CardTitle className="text-sm">Preview ao Vivo</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            v{version}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        {renderStatusIndicator()}
                        <Switch
                            checked={previewState.isEnabled}
                            onCheckedChange={handleTogglePreview}
                        />
                    </div>
                </div>

                {/* Controles de Device */}
                {previewState.isEnabled && (
                    <>
                        <Separator />
                        <div className="flex items-center justify-between">
                            {renderDeviceControls()}
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleManualRefresh}
                                    disabled={previewState.status === 'updating'}
                                    className="p-2"
                                    title="Atualizar manualmente"
                                >
                                    <RefreshCw className={cn(
                                        "w-3 h-3",
                                        previewState.status === 'updating' && "animate-spin"
                                    )} />
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {/* Debug Info */}
                {config.showDebugInfo && previewState.isEnabled && (
                    <>
                        <Separator />
                        <div className="text-xs text-muted-foreground space-y-1">
                            <div>Steps: {debouncedSteps.length}</div>
                            <div>Updates: {previewState.updateCount}</div>
                            <div>Último sync: {new Date(previewState.lastUpdate).toLocaleTimeString()}</div>
                            {debouncedSelectedStepId && (
                                <div>Step ativa: {debouncedSelectedStepId}</div>
                            )}
                        </div>
                    </>
                )}
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-auto">
                {renderPreviewContent()}
            </CardContent>
        </Card>
    );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Converte steps do editor para formato runtime
 */
function convertStepsToRuntimeMap(steps: any[]): Record<string, any> {
    const runtimeMap: Record<string, any> = {};

    steps.forEach((step, index) => {
        const stepId = step.id || `step-${String(index + 1).padStart(2, '0')}`;

        runtimeMap[stepId] = {
            id: stepId,
            type: step.type || 'question',
            order: step.order || (index + 1),
            questionText: step.questionText || step.title || '',
            options: step.options || [],
            blocks: step.blocks || [],
            ...step
        };
    });

    return runtimeMap;
}

export default LiveCanvasPreview;