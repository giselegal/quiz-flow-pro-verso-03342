/**
 * 🔌 QUIZ OPTIONS GRID BLOCK CONNECTED - Conectado à API
 * 
 * Versão do QuizOptionsGridBlock que busca todas as configurações via API,
 * permitindo edição em tempo real através do /editor
 */

import React, { useMemo, useEffect } from 'react';
import type { QuizConfig, ProcessedOptionsConfig } from '@/types/quiz-config';
import { useComponentConfiguration } from '@/hooks/useComponentConfiguration';
import QuizQuestion from '@/components/funnel-blocks/QuizQuestion';
import { QuizBlockProps } from './types';

interface QuizOptionsGridBlockConnectedProps extends Omit<QuizBlockProps, 'properties'> {
    // Props mínimas - tudo vem da API
    componentId: string;
    funnelId?: string;
    editorMode?: boolean;

    // Props de integração com quiz
    currentAnswers?: string[];
    onAnswersChange?: (answers: string[]) => void;
    onConfigUpdate?: (key: string, value: any) => void;
}

export default function QuizOptionsGridBlockConnected({
    componentId = 'quiz-options-grid',
    funnelId,
    editorMode = false,
    currentAnswers = [],
    onAnswersChange,
    onConfigUpdate,
    ...props
}: QuizOptionsGridBlockConnectedProps) {

    // ============================================================================
    // API CONNECTION - Busca configurações da API
    // ============================================================================

    const {
        properties,
        isLoading,
        error,
        connectionStatus,
        updateProperty,
        componentDefinition,
        hasUnsavedChanges,
        lastSaved
    } = useComponentConfiguration({
        componentId,
        funnelId,
        realTimeSync: true,
        autoSave: editorMode,
        autoSaveDelay: 1500
    });

    // ============================================================================
    // LOADING STATE
    // ============================================================================

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89B7A] mx-auto"></div>
                    <p className="text-sm text-gray-600">Carregando configurações...</p>
                    {editorMode && <p className="text-xs text-gray-400">API Status: {connectionStatus}</p>}
                </div>
            </div>
        );
    }

    // ============================================================================
    // ERROR STATE
    // ============================================================================

    if (error) {
        return (
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="text-red-800">
                    <h3 className="font-semibold">Erro na Configuração</h3>
                    <p className="text-sm mt-1">{error}</p>
                    {editorMode && (
                        <p className="text-xs mt-2 text-red-600">
                            Verifique se o componente está registrado corretamente no sistema
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // ============================================================================
    // CONFIGURATION PROCESSING - Processa configurações da API
    // ============================================================================

    const processedProperties: ProcessedOptionsConfig = useMemo(() => {
        // Valores padrão como fallback
        const defaults: ProcessedOptionsConfig = {
            columns: 'auto',
            imageSize: 256,
            gridGap: 8,
            options: [],
            primaryColor: '#B89B7A' as any,
            selectedColor: '#432818' as any,
            multipleSelection: false,
            autoAdvance: { enabled: true, delay: 1500 },
            showImages: true,
            imagePosition: 'top',
            borderRadius: 8,
            showShadows: true
        };

        // Mesclar com configurações da API
        const merged: ProcessedOptionsConfig = { ...(defaults as any), ...(properties as any) } as ProcessedOptionsConfig;

        // Processar opções se elas vierem como string (JSON)
        if (typeof (merged as any).options === 'string') {
            try {
                (merged as any).options = JSON.parse((merged as any).options);
            } catch (e) {
                console.warn('Invalid options JSON:', merged.options);
                (merged as any).options = [];
            }
        }

        // Garantir que options seja um array
        if (!Array.isArray(merged.options as any)) {
            (merged as any).options = [];
        }

        return merged;
    }, [properties]);

    // ============================================================================
    // DYNAMIC LAYOUT DETECTION - Baseado nas configurações API
    // ============================================================================

    const layoutConfig = useMemo(() => {
        const { columns, imageSize, gridGap, options } = processedProperties as any;

        // Detectar se há imagens nas opções
        const hasImages = options.some((option: any) => option.imageUrl);

        // Configurar colunas baseado na API ou detecção automática
        let finalColumns: number;

        if (columns === 'auto') {
            finalColumns = hasImages ? 2 : 1;
        } else if (typeof columns === 'string') {
            finalColumns = parseInt(columns, 10) || 2;
        } else {
            finalColumns = columns;
        }

        return {
            columns: finalColumns,
            hasImages,
            imageSize: imageSize || 256,
            gridGap: gridGap || 8,
            responsive: true
        };
    }, [processedProperties]);

    // ============================================================================
    // EDITOR INTEGRATION - Handles para edição no /editor
    // ============================================================================

    const handlePropertyUpdate = async (key: string, value: any) => {
        if (editorMode && updateProperty) {
            try {
                await updateProperty(key, value);
                onConfigUpdate?.(key, value);
                console.log(`✅ Property updated via API: ${key} =`, value);
            } catch (error) {
                console.error(`❌ Failed to update property ${key}:`, error);
            }
        }
    };

    // ============================================================================
    // DYNAMIC STYLES - Baseado na configuração da API
    // ============================================================================

    const dynamicStyles = useMemo<React.CSSProperties>(() => ({
        ['--grid-columns' as any]: layoutConfig.columns as any,
        ['--grid-gap' as any]: `${layoutConfig.gridGap}px`,
        ['--image-size' as any]: `${layoutConfig.imageSize}px`,
        ['--primary-color' as any]: (processedProperties as any).primaryColor,
        ['--selected-color' as any]: (processedProperties as any).selectedColor,
        ['--border-radius' as any]: `${(processedProperties as any).borderRadius}px`,
        ['--hover-shadow' as any]: (processedProperties as any).showShadows ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
    }), [layoutConfig, processedProperties]);

    // ============================================================================
    // EDITOR OVERLAY - Informações debug no modo editor
    // ============================================================================

    const EditorOverlay = editorMode ? () => (
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md p-2 text-xs font-mono z-10 shadow-sm">
            <div className="space-y-1">
                <div className="font-semibold text-blue-600">QuizOptionsGrid</div>
                <div>API: <span className={connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}>{connectionStatus}</span></div>
                <div>Cols: {layoutConfig.columns}</div>
                <div>Size: {layoutConfig.imageSize}px</div>
                <div>Gap: {layoutConfig.gridGap}px</div>
                <div>Images: {layoutConfig.hasImages ? '✓' : '✗'}</div>
                {hasUnsavedChanges && <div className="text-orange-600">Unsaved</div>}
                {lastSaved && <div className="text-green-600">Saved {new Date(lastSaved).toLocaleTimeString()}</div>}

                {/* Mini controles para edição rápida */}
                <div className="pt-2 border-t border-gray-200 space-y-1">
                    <button
                        className="text-blue-500 hover:text-blue-700 block"
                        onClick={() => handlePropertyUpdate('imageSize', layoutConfig.imageSize === 256 ? 200 : 256)}
                    >
                        Toggle Size
                    </button>
                    <button
                        className="text-blue-500 hover:text-blue-700 block"
                        onClick={() => handlePropertyUpdate('columns', layoutConfig.columns === 2 ? 1 : 2)}
                    >
                        Toggle Columns
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    // ============================================================================
    // RENDER WITH API-DRIVEN PROPERTIES
    // ============================================================================

    return (
        <div
            className="quiz-options-grid-connected relative"
            style={dynamicStyles}
        >
            {/* Editor Overlay */}
            {EditorOverlay && <EditorOverlay />}

            {/* Grid CSS customizado baseado na API */}
            <style>{`
        .quiz-grid {
          display: grid;
          grid-template-columns: repeat(var(--grid-columns), 1fr);
          gap: var(--grid-gap);
        }
        
        .quiz-option {
          border-radius: var(--border-radius);
          transition: all 0.3s ease;
        }
        
        .quiz-option:hover {
          box-shadow: var(--hover-shadow);
          transform: translateY(-1px);
        }
        
        .quiz-option.selected {
          border-color: var(--selected-color);
          background-color: color-mix(in srgb, var(--selected-color) 10%, transparent);
        }
        
        .quiz-option-image {
          width: var(--image-size);
          height: var(--image-size);
          object-fit: cover;
          border-radius: calc(var(--border-radius) - 2px);
        }
        
        @media (max-width: 768px) {
          .quiz-grid {
            grid-template-columns: repeat(${layoutConfig.hasImages ? 2 : 1}, 1fr);
            gap: calc(var(--grid-gap) * 0.75);
          }
          
          .quiz-option-image {
            width: calc(var(--image-size) * 0.8);
            height: calc(var(--image-size) * 0.8);
          }
        }
      `}</style>

            {/* Componente principal renderizado com configurações API */}
            <QuizQuestion
                // Passar todas as configurações vindas da API
                {...{...processedProperties, autoAdvance: typeof (processedProperties as any).autoAdvance === 'object' ? !!(processedProperties as any).autoAdvance?.enabled : (processedProperties as any).autoAdvance}}
                question={(properties as any)?.question || 'Qual opção você prefere?'}
                options={(processedProperties.options as any) || []}

                // Props de integração
                initialSelections={currentAnswers}
                onSelectionChange={(opts) => onAnswersChange?.(opts.map(o => o.id).filter(Boolean) as string[])}

                // Configurações de layout processadas
                // layoutConfig não é suportado pelo QuizQuestion; já usamos dynamicStyles

                // Handlers para edição (apenas no modo editor)
                // onPropertyUpdate não existe em QuizQuestion; manipulação via editor overlay

                // Metadata para debug
                // debug props removidas para compatibilidade de tipos

                // Resto das props
                {...props}
            />

            {/* Informações de debug no rodapé (apenas editor) */}
            {editorMode && componentDefinition && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-600 space-y-1">
                        <div><strong>Component:</strong> {componentDefinition.name}</div>
                        <div><strong>Properties:</strong> {componentDefinition.properties.length} definidas</div>
                        <div><strong>API Endpoint:</strong> {componentDefinition.apiEndpoint}</div>
                        <div><strong>Categories:</strong> {componentDefinition.editorConfig.categories.join(', ')}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// SPECIALIZED VARIANTS
// ============================================================================

/**
 * Versão para preview no editor
 */
export function QuizOptionsGridPreview(props: Omit<QuizOptionsGridBlockConnectedProps, 'editorMode'>) {
    return <QuizOptionsGridBlockConnected {...props} editorMode={true} />;
}

/**
 * Versão para produção (sem editor overlay)
 */
export function QuizOptionsGridProduction(props: Omit<QuizOptionsGridBlockConnectedProps, 'editorMode'>) {
    return <QuizOptionsGridBlockConnected {...props} editorMode={false} />;
}