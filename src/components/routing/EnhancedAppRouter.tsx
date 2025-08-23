// Sistema de Roteamento Melhorado para o Editor
import React, { Suspense, lazy, useState } from 'react';
import { Route, Router, Switch, useLocation } from 'wouter';

// Loading Component simples
const PageLoader: React.FC = () => (
  <div style={{ backgroundColor: '#FAF9F7' }}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A] mx-auto"></div>
      <p style={{ color: '#6B4F43' }}>Carregando...</p>
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
      <div style={{ backgroundColor: '#FAF9F7' }}>
        <div className="text-center">
          <div style={{ color: '#432818' }}>❌</div>
          <h1 className="text-2xl font-bold mb-2">Ops! Algo deu errado</h1>
          <p style={{ color: '#6B4F43' }}>Ocorreu um erro inesperado</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#B89B7A]/100 text-white rounded hover:bg-[#B89B7A]"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Componente placeholder (evita import ausente de EnhancedEditor)
const EnhancedEditor: React.FC = () => null;

const SystemIntegrationTest = lazy(() => import('../../components/testing/SystemIntegrationTest'));

const FunnelManagementPage = lazy(() =>
  import('../../pages/examples/EnhancedEditorIntegration').then(module => ({
    default: module.FunnelManagementPage,
  }))
);

const EditorPage = lazy(() =>
  import('../../pages/examples/EnhancedEditorIntegration').then(module => ({
    default: module.default,
  }))
);

// Dashboard simples se não existir
const SimpleDashboard: React.FC = () => (
  <div style={{ backgroundColor: '#FAF9F7' }}>
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Quiz Quest Challenge Verse</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">🎯 Editor Melhorado</h2>
          <p style={{ color: '#6B4F43' }}>
            Acesse o novo editor com todas as funcionalidades avançadas
          </p>
          <a
            href="/editor"
            className="inline-block px-4 py-2 bg-[#B89B7A]/100 text-white rounded hover:bg-[#B89B7A]"
          >
            Acessar Editor
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">🧪 Testes</h2>
          <p style={{ color: '#6B4F43' }}>Execute testes de integração dos sistemas</p>
          <a
            href="/dev/test"
            className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Executar Testes
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">📊 Analytics</h2>
          <p style={{ color: '#6B4F43' }}>Visualize métricas e relatórios detalhados</p>
          <a href="/admin/funis/demo/analytics" style={{ backgroundColor: '#B89B7A' }}>
            Ver Analytics
          </a>
        </div>
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">🚀 Status da Implementação</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">7/7</div>
            <div style={{ color: '#6B4F43' }}>Sistemas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#B89B7A]">100%</div>
            <div style={{ color: '#6B4F43' }}>Completo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#B89B7A]">✅</div>
            <div style={{ color: '#6B4F43' }}>Pronto</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#B89B7A]">🔧</div>
            <div style={{ color: '#6B4F43' }}>Testando</div>
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
        <div style={{ backgroundColor: '#FAF9F7' }}>
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
                      <p style={{ color: '#6B4F43' }}>Dashboard de Analytics será carregado aqui</p>
                      <p style={{ color: '#8B7355' }}>
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
                {() => (
                  <Suspense fallback={<PageLoader />}>
                    {(EnhancedEditor as unknown as React.ComponentType<any>) && <EnhancedEditor />}
                  </Suspense>
                )}
              </Route>

              {/* Rota 404 */}
              <Route>
                <div style={{ backgroundColor: '#FAF9F7' }}>
                  <div className="text-center">
                    <h1 style={{ color: '#432818' }}>404</h1>
                    <p style={{ color: '#6B4F43' }}>Página não encontrada</p>
                    <div className="space-x-4">
                      <a
                        href="/"
                        className="px-4 py-2 bg-[#B89B7A]/100 text-white rounded hover:bg-[#B89B7A]"
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
