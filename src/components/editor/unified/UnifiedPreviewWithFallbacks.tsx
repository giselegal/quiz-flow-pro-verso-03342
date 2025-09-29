// @ts-nocheck
/**
 * 🛡️ UNIFIED PREVIEW WITH FALLBACKS - PREVIEW ROBUSTO
 * 
 * Wrapper do UnifiedPreviewEngine com fallbacks robustos para dados ausentes,
 * garantindo que o preview nunca quebre independente do estado dos dados.
 * 
 * FUNCIONALIDADES:
 * ✅ Fallbacks automáticos para blocos vazios
 * ✅ Estados de loading elegantes
 * ✅ Recuperação automática de erros
 * ✅ Preview skeleton enquanto carrega
 * ✅ Integração com RealStagesProvider
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';
import { UnifiedPreviewEngine, UnifiedPreviewEngineProps } from './UnifiedPreviewEngine';
import { useRealStages } from './RealStagesProvider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';

// Props estendidas com fallbacks
interface UnifiedPreviewWithFallbacksProps extends Omit<UnifiedPreviewEngineProps, 'blocks'> {
  blocks?: Block[];
  fallbackMode?: 'skeleton' | 'empty' | 'error' | 'minimal';
  enableErrorRecovery?: boolean;
  showDebugInfo?: boolean;
  retryCount?: number;
}

/**
 * 🎨 SKELETON DE PREVIEW
 */
const PreviewSkeleton: React.FC<{ mode?: string }> = ({ mode = 'loading' }) => (
  <div className="unified-preview-skeleton space-y-4 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
      <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
    </div>
    
    {/* Simulação de blocos */}
    {Array.from({ length: 3 }).map((_, i) => (
      <Card key={i} className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    ))}
    
    <div className="text-center text-gray-500 text-sm mt-4">
      {mode === 'loading' && 'Carregando preview...'}
      {mode === 'error' && 'Recuperando preview...'}
      {mode === 'empty' && 'Preparando conteúdo...'}
    </div>
  </div>
);

/**
 * 🚨 TELA DE ERRO COM RECUPERAÇÃO
 */
const ErrorFallback: React.FC<{
  error: string;
  onRetry: () => void;
  showDebug?: boolean;
}> = ({ error, onRetry, showDebug = false }) => (
  <Card className="border-red-200 bg-red-50">
    <CardHeader>
      <CardTitle className="flex items-center text-red-700">
        <AlertCircle className="w-5 h-5 mr-2" />
        Erro no Preview
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-red-600 mb-4">
        Não foi possível carregar o preview. Tente novamente.
      </p>
      
      {showDebug && (
        <div className="bg-red-100 p-3 rounded text-sm text-red-800 mb-4 font-mono">
          {error}
        </div>
      )}
      
      <Button 
        onClick={onRetry}
        variant="outline"
        className="text-red-700 border-red-300 hover:bg-red-100"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Tentar Novamente
      </Button>
    </CardContent>
  </Card>
);

/**
 * 🎯 PREVIEW VAZIO
 */
const EmptyPreview: React.FC<{
  onAddBlock?: () => void;
  currentStep: number;
}> = ({ onAddBlock, currentStep }) => (
  <Card className="border-dashed border-gray-300 bg-gray-50">
    <CardContent className="flex flex-col items-center justify-center py-12">
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Etapa {currentStep} está vazia
      </h3>
      <p className="text-gray-500 text-center mb-6">
        Adicione blocos para ver o preview desta etapa.
      </p>
      
      {onAddBlock && (
        <Button onClick={onAddBlock} variant="outline">
          Adicionar Primeiro Bloco
        </Button>
      )}
    </CardContent>
  </Card>
);

/**
 * 🎯 COMPONENTE PRINCIPAL
 */
export const UnifiedPreviewWithFallbacks: React.FC<UnifiedPreviewWithFallbacksProps> = ({
  blocks = [],
  fallbackMode = 'skeleton',
  enableErrorRecovery = true,
  showDebugInfo = false,
  retryCount = 3,
  ...previewProps
}) => {
  // Estados locais
  const [error, setError] = useState<string | null>(null);
  const [retries, setRetries] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);

  // Contexto de etapas (opcional)
  let realStages, stageActions, isLoading;
  try {
    const stagesContext = useRealStages();
    realStages = stagesContext.realStages;
    stageActions = stagesContext.stageActions;
    isLoading = stagesContext.isLoading;
  } catch {
    // Provider não disponível - usar valores padrão
    realStages = null;
    stageActions = null;
    isLoading = false;
  }

  // Determinar bloco atual se integrado com stages
  const effectiveBlocks = useMemo(() => {
    if (blocks.length > 0) {
      return blocks;
    }

    // Tentar carregar da etapa ativa se disponível
    if (realStages && stageActions) {
      const activeStage = realStages.find(stage => stage.isActive);
      if (activeStage && activeStage.hasData) {
        // Os blocos serão carregados pelo stageActions
        return [];
      }
    }

    return [];
  }, [blocks, realStages, stageActions]);

  // Função de retry
  const handleRetry = useCallback(async () => {
    if (retries >= retryCount) return;

    setIsRecovering(true);
    setError(null);
    setRetries(prev => prev + 1);

    try {
      // Tentar recarregar a etapa ativa se disponível
      if (stageActions && realStages) {
        const activeStage = realStages.find(stage => stage.isActive);
        if (activeStage) {
          await stageActions.refreshStage(activeStage.id);
        }
      }

      // Dar tempo para o sistema se estabilizar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (retryError) {
      console.error('❌ Erro durante retry:', retryError);
      setError(retryError instanceof Error ? retryError.message : 'Erro desconhecido');
    } finally {
      setIsRecovering(false);
    }
  }, [retries, retryCount, stageActions, realStages]);

  // Handler de erro do preview
  const handlePreviewError = useCallback((previewError: Error) => {
    console.error('❌ Erro no preview:', previewError);
    setError(previewError.message);
    
    if (enableErrorRecovery && retries < retryCount) {
      // Auto-retry após 2 segundos
      setTimeout(handleRetry, 2000);
    }
  }, [enableErrorRecovery, handleRetry, retries, retryCount]);

  // Reset de retry quando blocks mudam
  useEffect(() => {
    if (effectiveBlocks.length > 0) {
      setRetries(0);
      setError(null);
    }
  }, [effectiveBlocks]);

  // 🔄 LOADING STATE
  if (isLoading || isRecovering) {
    return <PreviewSkeleton mode={isRecovering ? 'error' : 'loading'} />;
  }

  // 🚨 ERROR STATE com recuperação
  if (error && enableErrorRecovery) {
    return (
      <ErrorFallback 
        error={error}
        onRetry={handleRetry}
        showDebug={showDebugInfo}
      />
    );
  }

  // 📭 EMPTY STATE
  if (effectiveBlocks.length === 0) {
    const currentStep = previewProps.currentStep || 1;
    
    if (fallbackMode === 'empty') {
      return (
        <EmptyPreview 
          currentStep={currentStep}
          onAddBlock={() => {
            // Callback para adicionar bloco se disponível
            if (previewProps.onBlockUpdate) {
              console.log('📝 Solicitação para adicionar primeiro bloco');
            }
          }}
        />
      );
    }
    
    if (fallbackMode === 'skeleton') {
      return <PreviewSkeleton mode="empty" />;
    }

    if (fallbackMode === 'minimal') {
      return (
        <Card>
          <CardContent className="text-center py-8">
            <EyeOff className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">Nenhum conteúdo para visualizar</p>
          </CardContent>
        </Card>
      );
    }
  }

  // 🎨 PREVIEW NORMAL
  try {
    return (
      <div className="unified-preview-with-fallbacks">
        {/* Indicador de debug se habilitado */}
        {showDebugInfo && (
          <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-100 rounded">
            🔍 Debug: {effectiveBlocks.length} blocos | Retries: {retries} | Etapas carregadas: {realStages?.filter(s => s.hasData).length || 0}
          </div>
        )}
        
        <UnifiedPreviewEngine
          {...previewProps}
          blocks={effectiveBlocks}
          onError={handlePreviewError}
        />
      </div>
    );
  } catch (renderError) {
    console.error('❌ Erro ao renderizar preview:', renderError);
    
    // Fallback final
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="text-center py-8">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
          <h3 className="font-semibold text-yellow-800 mb-2">
            Preview Temporariamente Indisponível
          </h3>
          <p className="text-yellow-700 text-sm mb-4">
            Ocorreu um erro inesperado. O preview será restaurado automaticamente.
          </p>
          
          {enableErrorRecovery && (
            <Button 
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="text-yellow-700 border-yellow-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Restaurar Preview
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
};

// Hook auxiliar para usar o preview com fallbacks
export const usePreviewWithFallbacks = (
  blocks: Block[],
  options?: {
    enableAutoRecovery?: boolean;
    maxRetries?: number;
    fallbackMode?: 'skeleton' | 'empty' | 'error' | 'minimal';
  }
) => {
  const [previewState, setPreviewState] = useState<{
    isReady: boolean;
    hasError: boolean;
    errorMessage?: string;
    blocksCount: number;
  }>({
    isReady: blocks.length > 0,
    hasError: false,
    blocksCount: blocks.length,
  });

  useEffect(() => {
    setPreviewState(prev => ({
      ...prev,
      isReady: blocks.length > 0,
      blocksCount: blocks.length,
      hasError: false, // Reset error when blocks change
    }));
  }, [blocks]);

  const setPreviewError = useCallback((error: string) => {
    setPreviewState(prev => ({
      ...prev,
      hasError: true,
      errorMessage: error,
      isReady: false,
    }));
  }, []);

  const clearPreviewError = useCallback(() => {
    setPreviewState(prev => ({
      ...prev,
      hasError: false,
      errorMessage: undefined,
      isReady: blocks.length > 0,
    }));
  }, [blocks.length]);

  return {
    previewState,
    setPreviewError,
    clearPreviewError,
  };
};

export default UnifiedPreviewWithFallbacks;
