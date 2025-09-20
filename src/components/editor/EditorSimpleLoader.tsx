import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * Carregador simples de editor com fallbacks
 */
const EditorSimpleLoader: React.FC = () => {
  const [EditorComponent, setEditorComponent] = React.useState<React.ComponentType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadEditor = async () => {
      try {
        // Tentar carregar o ModularEditorPro
        const mod = await import('./EditorPro/components/ModularEditorPro');
        const Component = mod.default;
        
        if (Component) {
          setEditorComponent(() => Component);
          console.log('✅ Editor carregado: ModularEditorPro');
        } else {
          throw new Error('Componente não encontrado');
        }
      } catch (err) {
        console.error('❌ Erro ao carregar editor:', err);
        setError('Falha ao carregar o editor');
      } finally {
        setLoading(false);
      }
    };

    loadEditor();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (error || !EditorComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold mb-2">Erro ao Carregar Editor</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <EditorComponent />
    </ErrorBoundary>
  );
};

export default EditorSimpleLoader;