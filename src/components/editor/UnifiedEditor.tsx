import React, { Suspense, useMemo } from 'react';
import { useEditor } from '@/components/editor/EditorProvider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { logger } from '@/utils/debugLogger';

interface UnifiedEditorProps {
  className?: string;
  stepId?: string;
  stepNumber?: number;
  funnelId?: string;
  onStepChange?: (stepId: string) => void;
  onSave?: (stepId: string, data: any) => void;
}

const ErrorFallback = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Erro de Contexto do Editor</h2>
      <p className="text-gray-600 mb-4">
        O UnifiedEditor deve ser usado dentro de um EditorProvider.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg"
      >
        Recarregar
      </button>
    </div>
  </div>
));

const LoadingFallback = React.memo(() => (
  <div className="flex items-center justify-center h-64 bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="md" className="mb-4" />
      <p className="text-gray-600 font-medium">Carregando editor unificado...</p>
      <p className="text-gray-400 text-sm mt-2">Prioridade: UniversalStepEditorPro → UniversalStepEditor → EditorPro</p>
    </div>
  </div>
));

export const UnifiedEditor: React.FC<UnifiedEditorProps> = React.memo(({
  className = '',
  stepId = 'step-1',
  stepNumber = 1,
  funnelId,
  onStepChange,
  onSave
}) => {
  let editorContext;
  try {
    editorContext = useEditor();
  } catch (e) {
    editorContext = undefined;
  }

  if (!editorContext) {
    return <ErrorFallback />;
  }

  logger.debug('UnifiedEditor: Contexto válido, carregando UniversalStepEditor...');

  const UniversalEditorWrapper = useMemo(() => {
    return React.lazy(() => {
      return new Promise<{ default: React.ComponentType<any> }>(async (resolve) => {
        try {
          logger.info('UnifiedEditor: Carregando UniversalStepEditorPro...');
          // 🎯 PRIORIDADE: Tenta carregar UniversalStepEditorPro primeiro
          const universalProMod = await import('@/components/editor/universal/UniversalStepEditorPro');
          const UniversalStepEditorPro = universalProMod.default;

          if (UniversalStepEditorPro) {
            const WrappedUniversalEditorPro: React.FC = (props: any) => (
              <UniversalStepEditorPro
                stepNumber={stepNumber}
                onStepChange={onStepChange}
                onSave={onSave}
                {...props}
              />
            );

            logger.info('UnifiedEditor: UniversalStepEditorPro carregado (PRIORIDADE MÁXIMA)');
            try { (window as any).__ACTIVE_EDITOR__ = 'UniversalStepEditorPro-Primary'; } catch { }

            resolve({ default: WrappedUniversalEditorPro });
            return;
          }
        } catch (proError) {
          logger.warn('UniversalStepEditorPro não disponível, fallback para UniversalStepEditor:', proError);
        }

        try {
          logger.info('UnifiedEditor: Carregando UniversalStepEditor...');

          const universalMod = await import('@/components/editor/universal/UniversalStepEditor');
          const UniversalStepEditor = universalMod.default;

          if (UniversalStepEditor) {
            const WrappedUniversalEditor: React.FC = (props: any) => (
              <UniversalStepEditor
                stepId={stepId}
                stepNumber={stepNumber}
                funnelId={funnelId}
                onStepChange={onStepChange}
                onSave={onSave}
                {...props}
              />
            );

            logger.info('UnifiedEditor: UniversalStepEditor carregado (PRIORIDADE)');
            try { (window as any).__ACTIVE_EDITOR__ = 'UniversalStepEditor-Primary'; } catch { }

            resolve({ default: WrappedUniversalEditor });
            return;
          }
        } catch (universalError) {
          logger.warn('UniversalStepEditor não disponível:', universalError);
        }

        try {
          logger.info('UnifiedEditor: Fallback para SchemaDrivenEditor...');

          const modernMod = await import('@/components/editor/SchemaDrivenEditorResponsive');
          const ModernEditor = modernMod.default;

          logger.info('UnifiedEditor: SchemaDrivenEditor carregado (fallback)');
          try { (window as any).__ACTIVE_EDITOR__ = 'SchemaDriven-Fallback'; } catch { }

          resolve({ default: ModernEditor });
        } catch (modernError) {
          logger.error('Todos os editores falharam:', modernError);

          const EmergencyFallback: React.FC = () => <ErrorFallback />;
          resolve({ default: EmergencyFallback });
        }
      });
    });
  }, [stepId, stepNumber, funnelId, onStepChange, onSave]);

  return (
    <div className={`unified-editor-container ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <UniversalEditorWrapper />
      </Suspense>
    </div>
  );
});

UnifiedEditor.displayName = 'UnifiedEditor';

export default UnifiedEditor;
