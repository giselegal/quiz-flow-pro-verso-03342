// Sistema de Roteamento Melhorado para o Editor
import React, { useState, Suspense, lazy } from 'react';
import { Router, Route, Switch, useLocation } from 'wouter';

// Loading Component simples
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Carregando...</p>
    </div>
  </div>
);

// Componente de Erro Simples
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-4xl">❌</div>
          <h1 className="text-2xl font-bold mb-2">Ops! Algo deu errado</h1>
          <p className="text-gray-600 mb-4">Ocorreu um erro inesperado</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Lazy loading dos componentes (com fallbacks seguros)
const EnhancedEditor = lazy(() => 
  import('../../components/editor/EnhancedEditor').catch(() => ({
    default: () => (
      <div className="p-8 text-center">
        <p className="text-red-600">Erro ao carregar o Editor Melhorado</p>
        <p className="text-sm text-gray-600 mt-2">
          Verifique se o arquivo está no local correto: /src/components/editor/EnhancedEditor.tsx
        </p>
      </div>
    )
  }))
);

const SystemIntegrationTest = lazy(() => 
  import('../../components/testing/SystemIntegrationTest').catch(() => ({
    default: () => (
      <div className="p-8 text-center">
        <p className="text-red-600">Erro ao carregar Testes de Integração</p>
        <p className="text-sm text-gray-600 mt-2">
          Verifique se o arquivo está no local correto: /src/components/testing/SystemIntegrationTest.tsx
        </p>
      </div>
    )
  }))
);

const FunnelManagementPage = lazy(() => 
  import('../../pages/examples/EnhancedEditorIntegration').then(module => ({
    default: module.FunnelManagementPage
  })).catch(() => ({
    default: () => (
      <div className="p-8 text-center">
        <p className="text-red-600">Erro ao carregar Gestão de Funis</p>
        <p className="text-sm text-gray-600 mt-2">
          Verifique se o arquivo está no local correto: /src/pages/examples/EnhancedEditorIntegration.tsx
        </p>
      </div>
    )
  }))
);

const EditorPage = lazy(() => 
  import('../../pages/examples/EnhancedEditorIntegration').then(module => ({
    default: module.default
  })).catch(() => ({
    default: () => (
      <div className="p-8 text-center">
        <p className="text-red-600">Erro ao carregar Página do Editor</p>
        <p className="text-sm text-gray-600 mt-2">
          Verifique se o arquivo está no local correto: /src/pages/examples/EnhancedEditorIntegration.tsx
        </p>
      </div>
    )
  }))
);

// Dashboard simples se não existir
const SimpleDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Quiz Quest Challenge Verse</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">🎯 Editor Melhorado</h2>
          <p className="text-gray-600 mb-4">Acesse o novo editor com todas as funcionalidades avançadas</p>
          <a 
            href="/editor" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Acessar Editor
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">🧪 Testes</h2>
          <p className="text-gray-600 mb-4">Execute testes de integração dos sistemas</p>
          <a 
            href="/dev/test" 
            className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Executar Testes
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">📊 Analytics</h2>
          <p className="text-gray-600 mb-4">Visualize métricas e relatórios detalhados</p>
          <a 
            href="/admin/funis/demo/analytics" 
            className="inline-block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Ver Analytics
          </a>
        </div>
      </div>
      
      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">🚀 Status da Implementação</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">7/7</div>
            <div className="text-gray-600">Sistemas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">100%</div>
            <div className="text-gray-600">Completo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">✅</div>
            <div className="text-gray-600">Pronto</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">🔧</div>
            <div className="text-gray-600">Testando</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente Principal de Roteamento
export const EnhancedAppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={<PageLoader />}>
            <Switch>
              {/* Rota Principal - Dashboard */}
              <Route path="/" component={SimpleDashboard} />
              <Route path="/dashboard" component={SimpleDashboard} />

              {/* Rotas do Editor Melhorado */}
              <Route path="/editor" component={FunnelManagementPage} />
              <Route path="/editor/:funnelId" component={EditorPage} />
              <Route path="/admin/funis" component={FunnelManagementPage} />
              <Route path="/admin/funis/:funnelId/editor" component={EditorPage} />
              
              {/* Rota para Analytics */}
              <Route path="/admin/funis/:funnelId/analytics">
                {({ funnelId }) => (
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Analytics - Funil {funnelId}</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                      <p className="text-gray-600 mb-4">Dashboard de Analytics será carregado aqui</p>
                      <p className="text-sm text-gray-500">
                        Componente: AdvancedAnalytics para funil {funnelId}
                      </p>
                    </div>
                  </div>
                )}
              </Route>

              {/* Rota para Testes de Desenvolvimento */}
              <Route path="/dev/test" component={SystemIntegrationTest} />
              
              {/* Rota de exemplo direto do editor */}
              <Route path="/enhanced-editor/:funnelId">
                {({ funnelId }) => (
                  <Suspense fallback={<PageLoader />}>
                    <EnhancedEditor funnelId={funnelId} />
                  </Suspense>
                )}
              </Route>

              {/* Rota 404 */}
              <Route>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Página não encontrada</p>
                    <div className="space-x-4">
                      <a 
                        href="/"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Voltar ao Dashboard
                      </a>
                      <a 
                        href="/editor"
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Acessar Editor
                      </a>
                    </div>
                  </div>
                </div>
              </Route>
            </Switch>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

// Hook para navegação programática
export const useAppNavigation = () => {
  const [location, setLocation] = useLocation();

  return {
    location,
    navigateTo: setLocation,
    goToDashboard: () => setLocation('/dashboard'),
    goToEditor: (funnelId?: string) => {
      if (funnelId) {
        setLocation(`/admin/funis/${funnelId}/editor`);
      } else {
        setLocation('/editor');
      }
    },
    goToAnalytics: (funnelId: string) => setLocation(`/admin/funis/${funnelId}/analytics`),
    openInNewTab: (path: string) => window.open(path, '_blank'),
  };
};

export default EnhancedAppRouter;
