/**
 * 🎯 EXEMPLO PRÁTICO DE INTEGRAÇÃO
 * 
 * Demonstração completa de como integrar o sistema de preview otimizado
 * no QuizModularProductionEditor existente.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Settings,
    Play,
    Pause,
    RotateCcw,
    Activity,
    Zap,
    Monitor
} from 'lucide-react';

// ===== NOVOS IMPORTS - Sistema Otimizado =====
import { PreviewMigrationWrapper } from '@/components/editor/migration/PreviewMigrationWrapper';
import { LivePreviewProvider } from '@/components/editor/providers/LivePreviewProvider';
import { FeatureFlagProvider, useFeatureFlags } from '@/components/editor/testing/FeatureFlagSystem';

// ===== IMPORTS EXISTENTES (mantidos para compatibilidade) =====
// import { CanvasArea } from '@/components/editor/canvas/CanvasArea'; // ❌ Removido
// import { OtherExistingComponents } from '...'; // ✅ Mantidos

// ============================================================================
// COMPONENT: Enhanced Quiz Editor with Live Preview
// ============================================================================

const QuizEditorWithLivePreview: React.FC = () => {
    // ===== ESTADO EXISTENTE (mantido) =====
    const [steps, setSteps] = useState([
        { id: 'step-1', order: 1, type: 'question', title: 'Pergunta 1' },
        { id: 'step-2', order: 2, type: 'question', title: 'Pergunta 2' },
        { id: 'step-20', order: 20, type: 'result', title: 'Resultado' }
    ]);

    const [selectedStep, setSelectedStep] = useState(steps[0]);
    const [funnelId] = useState('quiz-estilo-21-steps');
    const [isEditorReady, setIsEditorReady] = useState(false);

    // ===== NOVOS ESTADOS - Sistema de Preview =====
    const [previewConfig, setPreviewConfig] = useState({
        autoRefresh: true,
        showMetrics: true,
        enableComparison: process.env.NODE_ENV === 'development',
        debugMode: false
    });

    // ===== FEATURE FLAGS =====
    const {
        isEnabled: useOptimizedPreview,
        recordMetric,
        getTestVariant
    } = useFeatureFlags();

    const optimizedEnabled = useOptimizedPreview('optimized_preview');
    const monitoringEnabled = useOptimizedPreview('preview_monitoring');
    const realtimeEnabled = useOptimizedPreview('realtime_sync');

    // ===== HANDLERS EXISTENTES (mantidos) =====
    const handleStepChange = useCallback((stepId: string) => {
        const step = steps.find(s => s.id === stepId);
        if (step) {
            setSelectedStep(step);

            // Record métrica para A/B testing
            recordMetric('preview_system_comparison', 'step_change', Date.now());
        }
    }, [steps, recordMetric]);

    const handleStepUpdate = useCallback((stepId: string, updates: any) => {
        setSteps(prev => prev.map(step =>
            step.id === stepId ? { ...step, ...updates } : step
        ));

        recordMetric('preview_system_comparison', 'step_update', Date.now());
    }, [recordMetric]);

    // ===== NOVOS HANDLERS - Preview System =====
    const handlePreviewConfigChange = useCallback((config: any) => {
        setPreviewConfig(prev => ({ ...prev, ...config }));
    }, []);

    const handleEmergencyRollback = useCallback(() => {
        // Força rollback para sistema legacy
        localStorage.setItem('emergency_rollback', 'true');
        window.location.reload();
    }, []);

    // ===== EFFECTS =====
    useEffect(() => {
        // Simula carregamento do editor
        const timer = setTimeout(() => setIsEditorReady(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Log feature flags status
        console.log('🎛️ Feature Flags Status:', {
            optimizedEnabled,
            monitoringEnabled,
            realtimeEnabled
        });
    }, [optimizedEnabled, monitoringEnabled, realtimeEnabled]);

    // ===== RENDER HELPERS =====
    const renderPreviewControls = () => (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Preview Configuration
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={previewConfig.autoRefresh ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreviewConfigChange({
                            autoRefresh: !previewConfig.autoRefresh
                        })}
                    >
                        {previewConfig.autoRefresh ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                        Auto Refresh
                    </Button>

                    <Button
                        variant={previewConfig.showMetrics ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreviewConfigChange({
                            showMetrics: !previewConfig.showMetrics
                        })}
                    >
                        <Activity className="w-3 h-3" />
                        Metrics
                    </Button>

                    {process.env.NODE_ENV === 'development' && (
                        <>
                            <Button
                                variant={previewConfig.enableComparison ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePreviewConfigChange({
                                    enableComparison: !previewConfig.enableComparison
                                })}
                            >
                                <Monitor className="w-3 h-3" />
                                Compare
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEmergencyRollback}
                                className="text-red-600 hover:text-red-700"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Rollback
                            </Button>
                        </>
                    )}
                </div>

                {/* Feature Flags Status */}
                <div className="flex gap-1 text-xs">
                    <Badge variant={optimizedEnabled ? "default" : "outline"}>
                        {optimizedEnabled ? <Zap className="w-3 h-3 mr-1" /> : null}
                        Optimized: {optimizedEnabled ? 'ON' : 'OFF'}
                    </Badge>
                    <Badge variant={realtimeEnabled ? "default" : "outline"}>
                        Realtime: {realtimeEnabled ? 'ON' : 'OFF'}
                    </Badge>
                    <Badge variant={monitoringEnabled ? "default" : "outline"}>
                        Monitoring: {monitoringEnabled ? 'ON' : 'OFF'}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );

    const renderLoadingState = () => (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <div className="text-sm text-muted-foreground">Carregando Editor...</div>
            </div>
        </div>
    );

    // ===== MAIN RENDER =====
    return (
        <div className="quiz-editor-container">
            {/* Header do Editor */}
            <div className="editor-header border-b bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Quiz Editor Pro</h1>
                        <p className="text-sm text-muted-foreground">
                            {steps.length} steps • Step {selectedStep?.order} selected
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {optimizedEnabled && (
                            <Badge className="bg-green-600">
                                <Zap className="w-3 h-3 mr-1" />
                                Preview Otimizado
                            </Badge>
                        )}
                        <Button size="sm">Save</Button>
                        <Button size="sm" variant="outline">Preview</Button>
                    </div>
                </div>
            </div>

            {/* Alertas do Sistema */}
            {localStorage.getItem('emergency_rollback') === 'true' && (
                <Alert className="mx-6 mt-4">
                    <AlertDescription>
                        ⚠️ Sistema em modo de rollback de emergência.
                        <Button variant="link" className="p-0 ml-2" onClick={() => {
                            localStorage.removeItem('emergency_rollback');
                            window.location.reload();
                        }}>
                            Restaurar sistema otimizado
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Layout Principal */}
            <div className="editor-layout flex h-[calc(100vh-120px)]">
                {/* Painel Lateral - Propriedades */}
                <div className="sidebar w-80 border-r bg-gray-50 p-4">
                    <h3 className="font-medium mb-3">Properties Panel</h3>

                    {/* Step Selector */}
                    <div className="space-y-2">
                        {steps.map(step => (
                            <Button
                                key={step.id}
                                variant={selectedStep?.id === step.id ? "default" : "outline"}
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => handleStepChange(step.id)}
                            >
                                {step.order}. {step.title}
                            </Button>
                        ))}
                    </div>

                    {/* Selected Step Properties */}
                    {selectedStep && (
                        <div className="mt-4 p-3 border rounded">
                            <h4 className="text-sm font-medium mb-2">Step Properties</h4>
                            <div className="space-y-2 text-xs">
                                <div>ID: <code>{selectedStep.id}</code></div>
                                <div>Type: <code>{selectedStep.type}</code></div>
                                <div>Order: <code>{selectedStep.order}</code></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Área Principal - Canvas */}
                <div className="main-content flex-1 flex flex-col">
                    {/* Preview Controls */}
                    <div className="p-4 border-b">
                        {renderPreviewControls()}
                    </div>

                    {/* Canvas Area */}
                    <div className="canvas-container flex-1 p-4">
                        {!isEditorReady ? renderLoadingState() : (

                            // ✅ NOVA IMPLEMENTAÇÃO - Preview Migration Wrapper
                            <PreviewMigrationWrapper
                                // Props principais
                                steps={steps}
                                selectedStep={selectedStep}
                                funnelId={funnelId}
                                onStepChange={handleStepChange}

                                // Configurações do preview
                                enableComparison={previewConfig.enableComparison}
                                showMetrics={previewConfig.showMetrics}
                                className="h-full"

                            // Props do sistema legacy (para compatibilidade)
                            // headerConfig={headerConfig} // ← Seus props existentes
                            // liveScores={liveScores}
                            // topStyle={topStyle}
                            // BlockRow={BlockRow}
                            // byBlock={byBlock}
                            // selectedBlockId={selectedBlockId}
                            // isMultiSelected={isMultiSelected}
                            // handleBlockClick={handleBlockClick}
                            // renderBlockPreview={renderBlockPreview}
                            // removeBlock={removeBlock}
                            // setBlockPendingDuplicate={setBlockPendingDuplicate}
                            // setTargetStepId={setTargetStepId}
                            // setDuplicateModalOpen={setDuplicateModalOpen}
                            // activeId={activeId}
                            // previewNode={previewNode}
                            // FixedProgressHeader={FixedProgressHeader}
                            // StyleResultCard={StyleResultCard}
                            // OfferMap={OfferMap}
                            />

                            // ❌ IMPLEMENTAÇÃO ANTIGA (removida)
                            // <CanvasArea {...legacyProps} />

                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// WRAPPER WITH PROVIDERS
// ============================================================================

const QuizEditorApp: React.FC = () => {
    return (
        <FeatureFlagProvider>
            <LivePreviewProvider>
                <QuizEditorWithLivePreview />
            </LivePreviewProvider>
        </FeatureFlagProvider>
    );
};

// ============================================================================
// MIGRATION NOTES
// ============================================================================

/*
📝 **NOTAS DE MIGRAÇÃO**

1. **Props Mantidas**: Todas as props do sistema legacy são mantidas para compatibilidade
2. **Estado Preservado**: Estado existente do editor é totalmente preservado  
3. **Handlers Existentes**: Todos os handlers existentes continuam funcionando
4. **Rollback Simples**: Em caso de problemas, é só trocar o PreviewMigrationWrapper pelo CanvasArea antigo

🔄 **PROCESSO DE MIGRAÇÃO**

PASSO 1: Substitua apenas o import
```
// ❌ import { CanvasArea } from '@/components/editor/canvas/CanvasArea';
// ✅ import { PreviewMigrationWrapper } from '@/components/editor/migration/PreviewMigrationWrapper';
```

PASSO 2: Envolva com providers
```
<FeatureFlagProvider>
    <LivePreviewProvider>
        <SeuComponenteExistente />
    </LivePreviewProvider>
</FeatureFlagProvider>
```

PASSO 3: Substitua o componente
```
// ❌ <CanvasArea {...props} />
// ✅ <PreviewMigrationWrapper {...props} />
```

PASSO 4: Configure feature flags (opcional)
```
localStorage.setItem('quiz_feature_flags', JSON.stringify({
    optimized_preview: { enabled: true, trafficPercentage: 10 }
}));
```

✅ **VANTAGENS DESTA ABORDAGEM**

- ✅ Zero breaking changes
- ✅ Rollback instantâneo se necessário  
- ✅ A/B testing automático
- ✅ Métricas comparativas
- ✅ Rollout gradual controlado
- ✅ Monitoramento em tempo real
*/

export default QuizEditorApp;