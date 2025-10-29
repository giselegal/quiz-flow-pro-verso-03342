/**
 * 🎯 APP.TSX REFATORADO - SPRINT 3
 * 
 * Versão simplificada usando apenas:
 * - HelmetProvider (necessário para <Helmet>)
 * - StoreProvider (mínimo - apenas viewport)
 * - ErrorBoundaries (segurança)
 * 
 * ANTES (Provider Hell):
 * - 8+ providers aninhados
 * - UnifiedAppProvider complexo
 * - EditorProviderUnified
 * - Múltiplos contexts
 * 
 * DEPOIS (Zustand):
 * - 2 providers essenciais
 * - Stores gerenciam estado
 * - Adapter para compatibilidade
 */

import React, { Suspense, lazy } from 'react';
import { Route, Router, Switch } from 'wouter';
import { HelmetProvider } from 'react-helmet-async';
import { GlobalErrorBoundary } from './components/error/GlobalErrorBoundary';
import { Toaster } from './components/ui/toaster';
import { RedirectRoute } from './components/RedirectRoute';
import { QuizErrorBoundary } from './components/RouteErrorBoundary';
import { EditorErrorBoundary } from './components/error/EditorErrorBoundary';
import { EnhancedLoadingFallback } from './components/ui/enhanced-loading-fallback';
import { StoreProvider } from './providers/StoreProvider';
import { EditorProviderAdapter } from './components/editor/EditorProviderAdapter';

// 🏠 PÁGINAS ESSENCIAIS
const Home = lazy(() => import('./pages/Home'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 🚀 EDITOR
import QuizModularProductionEditor from './config/editorRoutes.config';

// 🧪 PÁGINAS DE QUIZ
const QuizEstiloPessoalPage = lazy(() => import('./pages/QuizEstiloPessoalPage'));
const QuizAIPage = lazy(() => import('./pages/QuizAIPage'));
const QuizIntegratedPage = lazy(() => import('./pages/QuizIntegratedPage'));

// 🏢 DASHBOARDS
const ModernAdminDashboard = lazy(() => import('./pages/ModernAdminDashboard'));
const Phase2Dashboard = lazy(() => import('./pages/Phase2Dashboard'));

// 🎨 PÁGINAS DE TEMPLATES
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const SystemDiagnosticPage = lazy(() => import('./pages/SystemDiagnosticPage'));
const EditorTemplatesPage = lazy(() => import('./pages/editor-templates/index'));
const FunnelTypesPage = lazy(() => import('./pages/SimpleFunnelTypesPage'));

// 🛠️ PÁGINAS ADMIN
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const AdminParticipantsPage = lazy(() => import('./pages/admin/ParticipantsPage'));
const AdminTemplatesPage = lazy(() => import('./pages/admin/MyTemplatesPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const AdminIntegrationsPage = lazy(() => import('./pages/admin/IntegrationsPage'));
const AdminABTestsPage = lazy(() => import('./pages/admin/ABTestPage'));
const AdminCreativesPage = lazy(() => import('./pages/admin/CreativesPage'));

function App() {
  return (
    <HelmetProvider>
      <GlobalErrorBoundary showResetButton={true}>
        <StoreProvider>
          <Router>
            <Suspense
              fallback={
                <EnhancedLoadingFallback
                  message="Carregando aplicação..."
                  variant="detailed"
                />
              }
            >
              <Switch>
                {/* 🏠 HOME */}
                <Route path="/">
                  <Home />
                </Route>

                {/* 🚀 EDITOR */}
                <Route path="/editor/templates">
                  <EditorTemplatesPage />
                </Route>

                <Route path="/editor/:funnelId">
                  {(params) => (
                    <EditorErrorBoundary>
                      <EditorProviderAdapter
                        funnelId={params.funnelId}
                        enableSupabase={true}
                      >
                        <QuizModularProductionEditor />
                      </EditorProviderAdapter>
                    </EditorErrorBoundary>
                  )}
                </Route>

                <Route path="/editor">
                  <EditorErrorBoundary>
                    <EditorProviderAdapter enableSupabase={true}>
                      <QuizModularProductionEditor />
                    </EditorProviderAdapter>
                  </EditorErrorBoundary>
                </Route>

                {/* 🎯 QUIZ */}
                <Route path="/quiz-ai-21-steps">
                  <QuizAIPage />
                </Route>
                
                <Route path="/quiz-estilo">
                  <QuizErrorBoundary>
                    <QuizEstiloPessoalPage />
                  </QuizErrorBoundary>
                </Route>

                <Route path="/quiz/:funnelId">
                  {(params) => (
                    <QuizErrorBoundary>
                      <QuizEstiloPessoalPage funnelId={params.funnelId} />
                    </QuizErrorBoundary>
                  )}
                </Route>

                <Route path="/quiz">
                  <QuizErrorBoundary>
                    <QuizIntegratedPage />
                  </QuizErrorBoundary>
                </Route>

                {/* 🎨 TEMPLATES */}
                <Route path="/templates">
                  <TemplatesPage />
                </Route>
                
                <Route path="/funnel-types">
                  <FunnelTypesPage />
                </Route>
                
                <Route path="/resultado">
                  <QuizErrorBoundary>
                    <QuizEstiloPessoalPage />
                  </QuizErrorBoundary>
                </Route>

                {/* 🔐 AUTH */}
                <Route path="/auth">
                  <AuthPage />
                </Route>

                {/* 🏢 ADMIN */}
                <Route path="/admin/dashboard">
                  <RedirectRoute to="/admin" />
                </Route>
                
                <Route path="/admin">
                  <ModernAdminDashboard />
                </Route>
                
                <Route path="/dashboard">
                  <Phase2Dashboard />
                </Route>

                {/* 🔧 SYSTEM */}
                <Route path="/system/diagnostic">
                  <SystemDiagnosticPage />
                </Route>

                {/* 📊 ADMIN PAGES */}
                <Route path="/admin/analytics">
                  <AdminAnalyticsPage />
                </Route>
                
                <Route path="/admin/participants">
                  <AdminParticipantsPage />
                </Route>
                
                <Route path="/admin/templates">
                  <AdminTemplatesPage />
                </Route>
                
                <Route path="/admin/settings">
                  <AdminSettingsPage />
                </Route>
                
                <Route path="/admin/integrations">
                  <AdminIntegrationsPage />
                </Route>
                
                <Route path="/admin/ab-tests">
                  <AdminABTestsPage />
                </Route>
                
                <Route path="/admin/creatives">
                  <AdminCreativesPage />
                </Route>

                {/* 404 */}
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </Suspense>

            {/* Toast notifications */}
            <Toaster />
          </Router>
        </StoreProvider>
      </GlobalErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
