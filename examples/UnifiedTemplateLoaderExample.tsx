/**
 * 🎯 EXEMPLO DE USO - UNIFIED TEMPLATE LOADER
 * 
 * Demonstra casos de uso práticos do UnifiedTemplateLoader
 * 
 * @version 4.0.0
 * @phase Fase 3 - Consolidação
 */

import React from 'react';
import { unifiedTemplateLoader } from '@/services/templates/UnifiedTemplateLoader';
import type { Block } from '@/types/editor';

// ============================================================================
// EXEMPLO 1: CARREGAR STEP SIMPLES
// ============================================================================

export function SimpleStepLoader() {
    const [blocks, setBlocks] = React.useState<Block[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [source, setSource] = React.useState<string>('');

    const loadStep = async (stepId: string) => {
        setLoading(true);
        try {
            const result = await unifiedTemplateLoader.loadStep(stepId);
            setBlocks(result.data);
            setSource(result.source);
            console.log(`✅ Loaded ${result.data.length} blocks from ${result.source} in ${result.loadTime.toFixed(0)}ms`);
        } catch (error) {
            console.error('❌ Failed to load step:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Simple Step Loader</h2>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => loadStep('step-01')}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Load Step 01
                </button>
                <button
                    onClick={() => loadStep('step-12')}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Load Step 12
                </button>
            </div>

            {loading && <p>Loading...</p>}

            {!loading && blocks.length > 0 && (
                <div>
                    <p className="text-sm text-gray-600 mb-2">
                        Source: <strong>{source}</strong> | Blocks: <strong>{blocks.length}</strong>
                    </p>
                    <div className="space-y-2">
                        {blocks.map((block) => (
                            <div key={block.id} className="border p-2 rounded">
                                <p className="text-sm font-mono">{block.type}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// EXEMPLO 2: CARREGAR COM OPÇÕES AVANÇADAS
// ============================================================================

export function AdvancedStepLoader() {
    const [result, setResult] = React.useState<any>(null);

    const loadWithOptions = async () => {
        try {
            const result = await unifiedTemplateLoader.loadStep('step-01', {
                useCache: true,
                timeout: 5000,
                forceSource: 'v4', // Forçar v4
            });

            setResult({
                blocksCount: result.data.length,
                source: result.source,
                loadTime: result.loadTime,
                fromCache: result.fromCache,
                warnings: result.warnings,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Advanced Options</h2>

            <button
                onClick={loadWithOptions}
                className="px-4 py-2 bg-green-500 text-white rounded mb-4"
            >
                Load with Options
            </button>

            {result && (
                <div className="bg-gray-100 p-4 rounded">
                    <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// EXEMPLO 3: CARREGAR TEMPLATE COMPLETO
// ============================================================================

export function FullTemplateLoader() {
    const [template, setTemplate] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);

    const loadFullTemplate = async () => {
        setLoading(true);
        try {
            const result = await unifiedTemplateLoader.loadFullTemplate('quiz21StepsComplete');
            setTemplate({
                version: result.data.version,
                stepsCount: result.data.steps.length,
                totalBlocks: result.data.steps.reduce((sum, s) => sum + s.blocks.length, 0),
                source: result.source,
                loadTime: result.loadTime,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Full Template Loader</h2>

            <button
                onClick={loadFullTemplate}
                className="px-4 py-2 bg-purple-500 text-white rounded mb-4"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Load Full Template'}
            </button>

            {template && (
                <div className="bg-gray-100 p-4 rounded space-y-2">
                    <p><strong>Version:</strong> {template.version}</p>
                    <p><strong>Steps:</strong> {template.stepsCount}</p>
                    <p><strong>Total Blocks:</strong> {template.totalBlocks}</p>
                    <p><strong>Source:</strong> {template.source}</p>
                    <p><strong>Load Time:</strong> {template.loadTime.toFixed(0)}ms</p>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// EXEMPLO 4: VALIDAÇÃO DE TEMPLATE
// ============================================================================

export function TemplateValidator() {
    const [validation, setValidation] = React.useState<any>(null);

    const validateData = async () => {
        // Simular dados para validação
        const mockData = {
            version: '4.0',
            metadata: {
                title: 'Quiz Test',
                description: 'Test quiz',
            },
            steps: [
                {
                    id: 'step-01',
                    order: 1,
                    blocks: [
                        {
                            id: 'block-1',
                            type: 'intro-title',
                            order: 0,
                            properties: { text: 'Hello' },
                        },
                    ],
                },
            ],
        };

        const result = await unifiedTemplateLoader.validateTemplate(mockData);
        setValidation(result);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Template Validator</h2>

            <button
                onClick={validateData}
                className="px-4 py-2 bg-yellow-500 text-white rounded mb-4"
            >
                Validate Mock Data
            </button>

            {validation && (
                <div className={`p-4 rounded ${validation.isValid ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="font-bold mb-2">
                        {validation.isValid ? '✅ Valid' : '❌ Invalid'}
                    </p>

                    {validation.errors.length > 0 && (
                        <div className="space-y-1">
                            <p className="font-semibold">Errors:</p>
                            {validation.errors.map((err: any, i: number) => (
                                <p key={i} className="text-sm">
                                    • {err.path}: {err.message}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// EXEMPLO 5: CANCELAMENTO COM ABORT SIGNAL
// ============================================================================

export function CancellableLoader() {
    const [status, setStatus] = React.useState('idle');
    const controllerRef = React.useRef<AbortController | null>(null);

    const startLoad = async () => {
        controllerRef.current = new AbortController();
        setStatus('loading');

        try {
            const result = await unifiedTemplateLoader.loadStep('step-20', {
                signal: controllerRef.current.signal,
                timeout: 10000,
            });

            setStatus(`loaded: ${result.data.length} blocks`);
        } catch (error: any) {
            if (error.message === 'Operation aborted') {
                setStatus('cancelled');
            } else {
                setStatus(`error: ${error.message}`);
            }
        }
    };

    const cancelLoad = () => {
        if (controllerRef.current) {
            controllerRef.current.abort();
            controllerRef.current = null;
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Cancellable Load</h2>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={startLoad}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    disabled={status === 'loading'}
                >
                    Start Load
                </button>

                <button
                    onClick={cancelLoad}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    disabled={status !== 'loading'}
                >
                    Cancel
                </button>
            </div>

            <p className="text-sm">Status: <strong>{status}</strong></p>
        </div>
    );
}

// ============================================================================
// EXEMPLO 6: CACHE MANAGEMENT
// ============================================================================

export function CacheManager() {
    const [cacheCleared, setCacheCleared] = React.useState(false);

    const clearCache = () => {
        unifiedTemplateLoader.clearCache();
        setCacheCleared(true);
        setTimeout(() => setCacheCleared(false), 2000);
    };

    const invalidateStep = (stepId: string) => {
        unifiedTemplateLoader.invalidateStep(stepId);
        alert(`Step ${stepId} invalidated`);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Cache Management</h2>

            <div className="space-y-2">
                <button
                    onClick={clearCache}
                    className="px-4 py-2 bg-red-500 text-white rounded block"
                >
                    Clear All Cache
                </button>

                <button
                    onClick={() => invalidateStep('step-01')}
                    className="px-4 py-2 bg-orange-500 text-white rounded block"
                >
                    Invalidate Step 01
                </button>
            </div>

            {cacheCleared && (
                <p className="mt-4 text-green-600 font-semibold">
                    ✅ Cache cleared successfully!
                </p>
            )}
        </div>
    );
}

// ============================================================================
// EXEMPLO 7: PÁGINA DEMO COMPLETA
// ============================================================================

export default function UnifiedTemplateLoaderDemo() {
    const [activeExample, setActiveExample] = React.useState(1);

    const examples = [
        { id: 1, name: 'Simple Loader', component: SimpleStepLoader },
        { id: 2, name: 'Advanced Options', component: AdvancedStepLoader },
        { id: 3, name: 'Full Template', component: FullTemplateLoader },
        { id: 4, name: 'Validator', component: TemplateValidator },
        { id: 5, name: 'Cancellable', component: CancellableLoader },
        { id: 6, name: 'Cache Manager', component: CacheManager },
    ];

    const ActiveComponent = examples.find(e => e.id === activeExample)?.component || SimpleStepLoader;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">UnifiedTemplateLoader Examples</h1>
                <p className="text-gray-600 mb-8">
                    Demonstração prática dos recursos do UnifiedTemplateLoader
                </p>

                {/* Navegação */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {examples.map(example => (
                        <button
                            key={example.id}
                            onClick={() => setActiveExample(example.id)}
                            className={`px-4 py-2 rounded ${activeExample === example.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {example.name}
                        </button>
                    ))}
                </div>

                {/* Conteúdo */}
                <div className="bg-white rounded-lg shadow-lg">
                    <ActiveComponent />
                </div>

                {/* Info */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Tip:</strong> Abra o console para ver logs detalhados das operações
                    </p>
                </div>
            </div>
        </div>
    );
}
