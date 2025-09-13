// @ts-nocheck
/**
 * 🎨 EDITOR DE FUNIL DESACOPLADO
 * 
 * Editor principal que funciona com qualquer implementação
 * das interfaces EditorDataProvider, permitindo:
 * - Testes isolados com dados mockados
 * - Reaproveitamento em diferentes contextos
 * - Desenvolvimento sem dependências externas
 */

import * as React from 'react';
import { useReducer, useEffect, useCallback, useRef } from 'react';
import {
    EditorFunnelData,
    EditorDataProvider,
    EditorTemplateProvider,
    EditorValidator,
    EditorEventHandler,
    EditorConfig,
    EditorProps,
    EditorMode,
    EditorState,
    EditorMetricsProvider
} from '../interfaces/EditorInterfaces';

// Importar provider de métricas
import { EditorMetricsFactory } from '../providers/EditorMetricsProvider';

// Importar componentes auxiliares do mesmo arquivo
import {
    EditorPagePanel,
    EditorPropertiesPanel,
    EditorCanvas,
    EditorToolbar
} from './EditorComponents';

// ============================================================================
// REDUCER DO EDITOR
// ============================================================================

const initialState: EditorState = {
    funnel: null,
    selectedPageId: null,
    selectedBlockId: null,
    mode: 'edit',
    saveStatus: {
        saved: true,
        saving: false,
        lastSaved: null,
        hasChanges: false,
        autoSaveEnabled: true
    },
    history: {
        past: [],
        present: null as any,
        future: [],
        canUndo: false,
        canRedo: false
    },
    validation: {
        valid: true,
        errors: [],
        warnings: []
    },
    loading: false,
    error: null
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
        case 'LOAD_FUNNEL':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'LOAD_FUNNEL_SUCCESS':
            return {
                ...state,
                funnel: action.payload.funnel,
                loading: false,
                error: null,
                selectedPageId: action.payload.funnel.pages[0]?.id || null,
                saveStatus: {
                    ...state.saveStatus,
                    saved: true,
                    hasChanges: false
                },
                history: {
                    past: [],
                    present: action.payload.funnel,
                    future: [],
                    canUndo: false,
                    canRedo: false
                }
            };

        case 'LOAD_FUNNEL_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        case 'SAVE_FUNNEL':
            return {
                ...state,
                saveStatus: {
                    ...state.saveStatus,
                    saving: true
                }
            };

        case 'SAVE_FUNNEL_SUCCESS':
            return {
                ...state,
                saveStatus: {
                    ...state.saveStatus,
                    saved: true,
                    saving: false,
                    lastSaved: action.payload.result.timestamp,
                    hasChanges: false
                }
            };

        case 'SAVE_FUNNEL_ERROR':
            return {
                ...state,
                error: action.payload.error,
                saveStatus: {
                    ...state.saveStatus,
                    saving: false
                }
            };

        case 'UPDATE_FUNNEL':
            if (!state.funnel) return state;

            const updatedFunnel = { ...state.funnel, ...action.payload.funnel };

            return {
                ...state,
                funnel: updatedFunnel,
                saveStatus: {
                    ...state.saveStatus,
                    hasChanges: true,
                    saved: false
                },
                history: {
                    past: [...state.history.past.slice(-49), state.history.present],
                    present: updatedFunnel,
                    future: [],
                    canUndo: true,
                    canRedo: false
                }
            };

        case 'SELECT_PAGE':
            return {
                ...state,
                selectedPageId: action.payload.pageId,
                selectedBlockId: null
            };

        case 'SELECT_BLOCK':
            return {
                ...state,
                selectedBlockId: action.payload.blockId
            };

        case 'SET_MODE':
            return {
                ...state,
                mode: action.payload.mode
            };

        case 'UNDO':
            if (!state.history.canUndo || state.history.past.length === 0) return state;

            const previous = state.history.past[state.history.past.length - 1];
            const newPast = state.history.past.slice(0, -1);

            return {
                ...state,
                funnel: previous,
                history: {
                    past: newPast,
                    present: previous,
                    future: [state.history.present, ...state.history.future],
                    canUndo: newPast.length > 0,
                    canRedo: true
                },
                saveStatus: {
                    ...state.saveStatus,
                    hasChanges: true,
                    saved: false
                }
            };

        case 'REDO':
            if (!state.history.canRedo || state.history.future.length === 0) return state;

            const next = state.history.future[0];
            const newFuture = state.history.future.slice(1);

            return {
                ...state,
                funnel: next,
                history: {
                    past: [...state.history.past, state.history.present],
                    present: next,
                    future: newFuture,
                    canUndo: true,
                    canRedo: newFuture.length > 0
                },
                saveStatus: {
                    ...state.saveStatus,
                    hasChanges: true,
                    saved: false
                }
            };

        case 'VALIDATE':
            return {
                ...state,
                validation: action.payload.result
            };

        default:
            return state;
    }
}

// ============================================================================
// COMPONENTE PRINCIPAL DO EDITOR
// ============================================================================

export const FunnelEditor: React.FC<EditorProps> = ({
    funnelId,
    initialData,
    dataProvider,
    templateProvider,
    validator,
    eventHandler,
    metricsProvider,
    config,
    onSave,
    onChange,
    onError,
    onModeChange
}) => {
    const [state, dispatch] = useReducer(editorReducer, initialState);

    // Configurar provider de métricas
    const metrics = metricsProvider || EditorMetricsFactory.createMockProvider();

    // Performance tracking
    const performanceRef = useRef<{ [key: string]: number }>({});

    // ============================================================================
    // HELPERS DE MÉTRICAS
    // ============================================================================

    const startPerformanceTimer = useCallback((operation: string) => {
        performanceRef.current[operation] = performance.now();
    }, []);

    const endPerformanceTimer = useCallback((operation: string, metadata?: any) => {
        const startTime = performanceRef.current[operation];
        if (startTime) {
            const duration = performance.now() - startTime;

            metrics.recordMetric({
                type: operation.includes('load') ? 'load_time' :
                    operation.includes('save') ? 'save_time' :
                        operation.includes('validate') ? 'validation_time' :
                            'operation_time',
                operation: operation as any,
                value: duration,
                unit: 'ms',
                timestamp: new Date(),
                funnelId: state.funnel?.id,
                sessionId: metrics.sessionId,
                metadata
            });

            delete performanceRef.current[operation];
        }
    }, [metrics, state.funnel?.id]);

    const recordError = useCallback((operation: string, error: string, metadata?: any) => {
        metrics.recordMetric({
            type: 'error_count',
            operation: operation as any,
            value: 1,
            unit: 'count',
            timestamp: new Date(),
            funnelId: state.funnel?.id,
            sessionId: metrics.sessionId,
            metadata: { error, ...metadata }
        });
    }, [metrics, state.funnel?.id]);

    const recordSuccess = useCallback((operation: string, metadata?: any) => {
        metrics.recordMetric({
            type: 'success_count',
            operation: operation as any,
            value: 1,
            unit: 'count',
            timestamp: new Date(),
            funnelId: state.funnel?.id,
            sessionId: metrics.sessionId,
            metadata
        });
    }, [metrics, state.funnel?.id]);

    // ============================================================================
    // EFEITOS E CALLBACKS
    // ============================================================================

    // Performance snapshot periódico
    useEffect(() => {
        const interval = setInterval(() => {
            if (state.funnel) {
                const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

                metrics.recordPerformanceSnapshot({
                    timestamp: new Date(),
                    funnelId: state.funnel.id,
                    pageCount: state.funnel.pages.length,
                    blockCount: state.funnel.pages.reduce((total, page) => total + page.blocks.length, 0),
                    memoryUsage,
                    renderTime: performanceRef.current.render || 0,
                    bundleSize: 0, // Seria calculado em produção
                    hasErrors: state.validation.errors.length > 0,
                    errorCount: state.validation.errors.length
                });
            }
        }, 30000); // A cada 30 segundos

        return () => clearInterval(interval);
    }, [state.funnel, state.validation, metrics]);

    // Carregar funil
    useEffect(() => {
        if (initialData) {
            dispatch({ type: 'LOAD_FUNNEL_SUCCESS', payload: { funnel: initialData } });
            recordSuccess('load_funnel', { source: 'initialData' });
        } else if (funnelId) {
            loadFunnel(funnelId);
        }
    }, [funnelId, initialData]);

    // Auto-save com métricas
    useEffect(() => {
        if (!state.funnel || !state.saveStatus.hasChanges || !config?.autoSave?.enabled) {
            return;
        }

        const timer = setTimeout(() => {
            if (state.saveStatus.hasChanges && !state.saveStatus.saving) {
                startPerformanceTimer('auto_save_funnel');
                saveFunnel().then(() => {
                    endPerformanceTimer('auto_save_funnel', { trigger: 'auto_save' });
                });
            }
        }, config.autoSave.interval || 30000);

        return () => clearTimeout(timer);
    }, [state.saveStatus.hasChanges, config?.autoSave]);

    // Validação em tempo real com métricas
    useEffect(() => {
        if (state.funnel && validator && config?.validation?.realTime) {
            startPerformanceTimer('validate_funnel');

            validator.validateFunnel(state.funnel).then(result => {
                endPerformanceTimer('validate_funnel');

                metrics.recordValidationMetrics({
                    operation: 'validate_funnel',
                    funnelId: state.funnel!.id,
                    validationTime: performanceRef.current.validate_funnel || 0,
                    errorCount: result.errors.length,
                    warningCount: result.warnings?.length || 0,
                    errors: result.errors,
                    warnings: result.warnings,
                    success: result.isValid,
                    timestamp: new Date()
                });

                const validationStatus = {
                    valid: result.isValid,
                    errors: result.errors,
                    warnings: result.warnings
                };

                dispatch({ type: 'VALIDATE', payload: { result: validationStatus } });
            });
        }
    }, [state.funnel, validator, config?.validation?.realTime, metrics]);

    // Notificar mudanças
    useEffect(() => {
        if (state.funnel && onChange) {
            onChange(state.funnel);
        }
    }, [state.funnel, onChange]);

    // Notificar mudança de modo
    useEffect(() => {
        if (onModeChange) {
            onModeChange(state.mode);
        }
    }, [state.mode, onModeChange]);

    // Notificar erros
    useEffect(() => {
        if (state.error && onError) {
            onError(state.error);
        }
    }, [state.error, onError]);

    // ============================================================================
    // HANDLERS COM INSTRUMENTAÇÃO
    // ============================================================================

    const loadFunnel = useCallback(async (id: string) => {
        startPerformanceTimer('load_funnel');
        dispatch({ type: 'LOAD_FUNNEL', payload: { id } });

        try {
            const startTime = new Date();
            const funnel = await dataProvider.loadFunnel(id);
            const endTime = new Date();
            const duration = endTime.getTime() - startTime.getTime();

            if (funnel) {
                dispatch({ type: 'LOAD_FUNNEL_SUCCESS', payload: { funnel } });
                endPerformanceTimer('load_funnel', { success: true });

                // Métricas de carregamento
                metrics.recordLoadingMetrics({
                    operation: 'load_funnel',
                    funnelId: id,
                    startTime,
                    endTime,
                    duration,
                    success: true,
                    cacheHit: false, // Seria determinado pelo provider
                    fallbackUsed: false,
                    retryCount: 0,
                    dataSize: JSON.stringify(funnel).length
                });

                recordSuccess('load_funnel', { funnelId: id, duration });

                if (eventHandler?.onFunnelLoad) {
                    eventHandler.onFunnelLoad(funnel);
                }
            } else {
                throw new Error(`Funnel ${id} not found`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            dispatch({ type: 'LOAD_FUNNEL_ERROR', payload: { error: errorMessage } });
            endPerformanceTimer('load_funnel', { success: false, error: errorMessage });
            recordError('load_funnel', errorMessage, { funnelId: id });

            // Métricas de fallback se necessário
            metrics.recordFallbackMetrics({
                operation: 'load_funnel',
                fallbackType: 'network_error',
                originalError: errorMessage,
                fallbackAction: 'graceful_degradation',
                success: false,
                timestamp: new Date(),
                funnelId: id
            });
        }
    }, [dataProvider, eventHandler, metrics, startPerformanceTimer, endPerformanceTimer, recordError, recordSuccess]);

    const saveFunnel = useCallback(async () => {
        if (!state.funnel) return;

        startPerformanceTimer('save_funnel');
        dispatch({ type: 'SAVE_FUNNEL', payload: { funnel: state.funnel } });

        try {
            // Validar antes de salvar se configurado
            if (validator && config?.validation?.onSave) {
                startPerformanceTimer('validate_before_save');
                const validationResult = await validator.validateFunnel(state.funnel);
                endPerformanceTimer('validate_before_save');

                if (!validationResult.isValid) {
                    const errorMessage = 'Validation failed: ' + validationResult.errors.join(', ');
                    throw new Error(errorMessage);
                }
            }

            const result = await dataProvider.saveFunnel(state.funnel);
            dispatch({ type: 'SAVE_FUNNEL_SUCCESS', payload: { result } });

            endPerformanceTimer('save_funnel', { success: true });
            recordSuccess('save_funnel', {
                funnelId: state.funnel.id,
                version: result.version,
                timestamp: result.timestamp
            });

            if (onSave) {
                onSave(state.funnel);
            }

            if (eventHandler?.onFunnelSave) {
                eventHandler.onFunnelSave(state.funnel);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            dispatch({ type: 'SAVE_FUNNEL_ERROR', payload: { error: errorMessage } });

            endPerformanceTimer('save_funnel', { success: false, error: errorMessage });
            recordError('save_funnel', errorMessage, { funnelId: state.funnel.id });

            // Registrar fallback se aplicável
            metrics.recordFallbackMetrics({
                operation: 'save_funnel',
                fallbackType: error instanceof Error && error.message.includes('validation')
                    ? 'validation_error'
                    : 'network_error',
                originalError: errorMessage,
                fallbackAction: 'retry',
                success: false,
                timestamp: new Date(),
                funnelId: state.funnel.id
            });
        }
    }, [state.funnel, dataProvider, validator, config, onSave, eventHandler, metrics, startPerformanceTimer, endPerformanceTimer, recordError, recordSuccess]);

    const updateFunnel = useCallback((updates: Partial<EditorFunnelData>) => {
        startPerformanceTimer('update_funnel');
        dispatch({ type: 'UPDATE_FUNNEL', payload: { funnel: updates } });
        endPerformanceTimer('update_funnel');

        recordSuccess('update_funnel', { updates: Object.keys(updates) });

        if (eventHandler?.onFunnelChange && state.funnel) {
            eventHandler.onFunnelChange({ ...state.funnel, ...updates });
        }
    }, [eventHandler, state.funnel, startPerformanceTimer, endPerformanceTimer, recordSuccess]);

    const selectPage = useCallback((pageId: string) => {
        startPerformanceTimer('select_page');
        dispatch({ type: 'SELECT_PAGE', payload: { pageId } });
        endPerformanceTimer('select_page');

        metrics.recordMetric({
            type: 'interaction_count',
            operation: 'select_page',
            value: 1,
            unit: 'count',
            timestamp: new Date(),
            pageId,
            funnelId: state.funnel?.id,
            sessionId: metrics.sessionId
        });
    }, [metrics, state.funnel?.id, startPerformanceTimer, endPerformanceTimer]);

    const selectBlock = useCallback((blockId: string) => {
        startPerformanceTimer('select_block');
        dispatch({ type: 'SELECT_BLOCK', payload: { blockId } });
        endPerformanceTimer('select_block');

        metrics.recordMetric({
            type: 'interaction_count',
            operation: 'select_block',
            value: 1,
            unit: 'count',
            timestamp: new Date(),
            blockId,
            funnelId: state.funnel?.id,
            sessionId: metrics.sessionId
        });
    }, [metrics, state.funnel?.id, startPerformanceTimer, endPerformanceTimer]);

    const setMode = useCallback((mode: EditorMode) => {
        startPerformanceTimer('mode_change');
        dispatch({ type: 'SET_MODE', payload: { mode } });
        endPerformanceTimer('mode_change');

        recordSuccess('mode_change', { mode, previousMode: state.mode });

        if (eventHandler?.onModeChange) {
            eventHandler.onModeChange(mode);
        }
    }, [eventHandler, state.mode, startPerformanceTimer, endPerformanceTimer, recordSuccess]);

    const undo = useCallback(() => {
        startPerformanceTimer('undo');
        dispatch({ type: 'UNDO' });
        endPerformanceTimer('undo');

        recordSuccess('undo', { canUndo: state.history.canUndo });
    }, [state.history.canUndo, startPerformanceTimer, endPerformanceTimer, recordSuccess]);

    const redo = useCallback(() => {
        startPerformanceTimer('redo');
        dispatch({ type: 'REDO' });
        endPerformanceTimer('redo');

        recordSuccess('redo', { canRedo: state.history.canRedo });
    }, [state.history.canRedo, startPerformanceTimer, endPerformanceTimer, recordSuccess]);

    // ============================================================================
    // HANDLERS DE PÁGINAS COM INSTRUMENTAÇÃO
    // ============================================================================

    const addPage = useCallback((type: any) => {
        if (!state.funnel) return;

        startPerformanceTimer('add_page');

        const newPage: any = {
            id: `page_${Date.now()}`,
            title: `New ${type} Page`,
            type,
            order: state.funnel.pages.length,
            blocks: []
        };

        const updatedPages = [...state.funnel.pages, newPage];
        updateFunnel({ pages: updatedPages });

        endPerformanceTimer('add_page', { type, pageId: newPage.id });
        recordSuccess('add_page', { type, pageCount: updatedPages.length });

        if (eventHandler?.onPageAdd) {
            eventHandler.onPageAdd(newPage);
        }
    }, [state.funnel, updateFunnel, eventHandler, startPerformanceTimer, endPerformanceTimer, recordSuccess]);

    const removePage = useCallback((pageId: string) => {
        if (!state.funnel) return;

        startPerformanceTimer('remove_page');

        const updatedPages = state.funnel.pages.filter(p => p.id !== pageId);
        updateFunnel({ pages: updatedPages });

        // Ajustar seleção se a página removida estava selecionada
        if (state.selectedPageId === pageId) {
            const newSelectedId = updatedPages[0]?.id || null;
            dispatch({ type: 'SELECT_PAGE', payload: { pageId: newSelectedId || '' } });
        }

        endPerformanceTimer('remove_page', { pageId });
        recordSuccess('remove_page', { pageId, remainingPages: updatedPages.length });

        if (eventHandler?.onPageRemove) {
            eventHandler.onPageRemove(pageId);
        }
    }, [state.funnel, state.selectedPageId, updateFunnel, eventHandler, startPerformanceTimer, endPerformanceTimer, recordSuccess]);

    const reorderPages = useCallback((fromIndex: number, toIndex: number) => {
        if (!state.funnel) return;

        startPerformanceTimer('reorder_pages');

        const pages = [...state.funnel.pages];
        const [movedPage] = pages.splice(fromIndex, 1);
        pages.splice(toIndex, 0, movedPage);

        // Atualizar ordem
        pages.forEach((page, index) => {
            page.order = index;
        });

        updateFunnel({ pages });

        endPerformanceTimer('reorder_pages', { fromIndex, toIndex });
        recordSuccess('reorder_pages', { fromIndex, toIndex, pageCount: pages.length });

        if (eventHandler?.onPageReorder) {
            eventHandler.onPageReorder(fromIndex, toIndex);
        }
    }, [state.funnel, updateFunnel, eventHandler, startPerformanceTimer, endPerformanceTimer, recordSuccess]);

    // Cleanup - dispose metrics provider ao desmontar
    useEffect(() => {
        return () => {
            if (metrics && typeof metrics.dispose === 'function') {
                (metrics as any).dispose();
            }
        };
    }, [metrics]);    // ============================================================================
    // RENDER
    // ============================================================================

    if (state.loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading funnel...</span>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>{state.error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!state.funnel) {
        return (
            <div className="text-center text-gray-500 py-8">
                No funnel loaded
            </div>
        );
    }

    const selectedPage = state.funnel.pages.find(p => p.id === state.selectedPageId);
    const selectedBlock = selectedPage?.blocks.find(b => b.id === state.selectedBlockId);

    return (
        <div className="flex h-full bg-gray-50">
            {/* Barra lateral esquerda - Páginas */}
            <div className="w-64 bg-white border-r border-gray-200">
                <EditorPagePanel
                    pages={state.funnel.pages}
                    selectedPageId={state.selectedPageId}
                    onPageSelect={selectPage}
                    onPageAdd={addPage}
                    onPageRemove={removePage}
                    onPageReorder={reorderPages}
                    onPageDuplicate={(pageId) => {
                        // Implementar duplicação
                        console.log('Duplicate page:', pageId);
                    }}
                    canEdit={state.mode === 'edit'}
                />
            </div>

            {/* Área principal */}
            <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <EditorToolbar
                    mode={state.mode}
                    onModeChange={setMode}
                    saveStatus={state.saveStatus}
                    onSave={saveFunnel}
                    canUndo={state.history.canUndo}
                    canRedo={state.history.canRedo}
                    onUndo={undo}
                    onRedo={redo}
                    validation={state.validation}
                />

                {/* Canvas */}
                <div className="flex-1">
                    {selectedPage && (
                        <EditorCanvas
                            page={selectedPage}
                            theme={state.funnel.settings.theme}
                            mode={state.mode}
                            selectedBlockId={state.selectedBlockId}
                            onBlockSelect={selectBlock}
                            onBlockUpdate={(blockId, properties) => {
                                // Implementar update de bloco
                                console.log('Update block:', blockId, properties);
                            }}
                            onBlockAdd={(type, position) => {
                                // Implementar adição de bloco
                                console.log('Add block:', type, position);
                            }}
                            onBlockRemove={(blockId) => {
                                // Implementar remoção de bloco
                                console.log('Remove block:', blockId);
                            }}
                            onBlockReorder={(fromIndex, toIndex) => {
                                // Implementar reordenação de blocos
                                console.log('Reorder blocks:', fromIndex, toIndex);
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Barra lateral direita - Propriedades */}
            <div className="w-80 bg-white border-l border-gray-200">
                <EditorPropertiesPanel
                    selectedBlock={selectedBlock}
                    selectedPage={selectedPage}
                    onBlockUpdate={(blockId, properties) => {
                        // Implementar update de propriedades
                        console.log('Update block properties:', blockId, properties);
                    }}
                    onPageUpdate={(pageId, settings) => {
                        // Implementar update de página
                        console.log('Update page settings:', pageId, settings);
                    }}
                    onStyleUpdate={(targetId, styles) => {
                        // Implementar update de estilos
                        console.log('Update styles:', targetId, styles);
                    }}
                />
            </div>
        </div>
    );
};
