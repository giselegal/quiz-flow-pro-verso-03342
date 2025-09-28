/**
 * 🎯 MODERN ADMIN DASHBOARD - CONSOLIDADO
 * 
 * Dashboard principal do admin com roteamento moderno e dados reais do Supabase
 * Substitui os dashboards fragmentados por uma interface unificada
 */

import React, { Suspense } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { UnifiedAdminLayout } from '@/components/admin/UnifiedAdminLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy loading das páginas do dashboard - PÁGINAS REAIS COM DADOS DO SUPABASE
const AdminOverview = React.lazy(() => import('./dashboard/AdminDashboard'));
const EnhancedAnalytics = React.lazy(() => import('@/components/dashboard/EnhancedRealTimeDashboard'));
const ParticipantsPage = React.lazy(() => import('./dashboard/ParticipantsPage'));
const FacebookMetrics = React.lazy(() => import('./dashboard/FacebookMetricsPage'));
const MeusFunisReal = React.lazy(() => import('./dashboard/MeusFunisPageReal'));
const TemplatesReal = React.lazy(() => import('./dashboard/TemplatesPage'));
const ABTestsPage = React.lazy(() => import('./dashboard/ABTestsPage'));
const CreativesPage = React.lazy(() => import('./dashboard/CreativesPage'));
const SettingsPage = React.lazy(() => import('./dashboard/SettingsPage'));
// EditorPage será carregado diretamente quando necessário

// ============================================================================
// LOADING FALLBACK
// ============================================================================

const DashboardLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <LoadingSpinner size="lg" color="#B89B7A" className="mx-auto mb-4" />
      <p className="text-gray-600">Carregando dados do Supabase...</p>
    </div>
  </div>
);

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

const routeConfig = {
  // Dashboard principal
  '/admin': {
    component: AdminOverview,
    title: 'Dashboard Principal',
    description: 'Visão geral das métricas e atividades'
  },
  
  // Analytics e métricas
  '/admin/analytics': {
    component: EnhancedAnalytics,
    title: 'Analytics em Tempo Real',
    description: 'Métricas detalhadas e dados em tempo real'
  },
  '/admin/participants': {
    component: ParticipantsPage,
    title: 'Participantes',
    description: 'Dados dos usuários e sessões'
  },
  '/admin/facebook-metrics': {
    component: FacebookMetrics,
    title: 'Métricas do Facebook',
    description: 'Integração com Facebook Ads'
  },
  
  // Gestão de conteúdo
  '/admin/funnels': {
    component: MeusFunisReal,
    title: 'Meus Funis',
    description: 'Gerenciar funis criados'
  },
  '/admin/templates': {
    component: TemplatesReal,
    title: 'Templates',
    description: 'Biblioteca de templates'
  },
  
  // Ferramentas
  '/admin/ab-tests': {
    component: ABTestsPage,
    title: 'Testes A/B',
    description: 'Configurar e analisar testes'
  },
  '/admin/creatives': {
    component: CreativesPage,
    title: 'Materiais Criativos',
    description: 'Banco de imagens e assets'
  },
  
  // Configurações
  '/admin/settings': {
    component: SettingsPage,
    title: 'Configurações',
    description: 'Configurações da conta e sistema'
  },
  
  // Editor integrado
  '/admin/editor': {
    component: AdminOverview, // Redirect to main dashboard for now
    title: 'Editor',
    description: 'Acesso ao editor visual de funis'
  }
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

const ModernAdminDashboard: React.FC = () => {
  const [location] = useLocation();
  
  // Extrair o funnelId da URL se presente
  const urlParams = new URLSearchParams(window.location.search);
  const funnelId = urlParams.get('funnelId') || undefined;

  // Determinar a configuração da rota atual
  const currentRoute = routeConfig[location as keyof typeof routeConfig] || routeConfig['/admin'];

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <UnifiedAdminLayout
        currentView="dashboard"
        funnelId={funnelId}
        className="min-h-screen"
      >
        <Suspense fallback={<DashboardLoadingFallback />}>
          <Switch>
            {/* Dashboard principal - Overview */}
            <Route path="/admin">
              <AdminOverview />
            </Route>
            <Route path="/admin/">
              <AdminOverview />
            </Route>

            {/* Analytics - Páginas de análise com dados reais */}
            <Route path="/admin/analytics">
              <EnhancedAnalytics />
            </Route>
            <Route path="/admin/participants">
              <ParticipantsPage />
            </Route>
            <Route path="/admin/facebook-metrics">
              <FacebookMetrics />
            </Route>

            {/* Gestão de Conteúdo - Funis e Templates */}
            <Route path="/admin/funnels">
              <MeusFunisReal />
            </Route>
            <Route path="/admin/templates">
              <TemplatesReal />
            </Route>

            {/* Ferramentas - A/B Tests e Criativos */}
            <Route path="/admin/ab-tests">
              <ABTestsPage />
            </Route>
            <Route path="/admin/creatives">
              <CreativesPage />
            </Route>

            {/* Sistema - Configurações */}
            <Route path="/admin/settings">
              <SettingsPage />
            </Route>

            {/* Editor integrado */}
            <Route path="/admin/editor">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Editor de Funis</h1>
                <p className="text-gray-600">Acesse o editor principal através da página de funis.</p>
                <div className="mt-4">
                  <a href="/editor" className="text-blue-600 hover:text-blue-800 underline">
                    Ir para Editor Principal
                  </a>
                </div>
              </div>
            </Route>

            {/* Rotas legacy - redirecionamentos */}
            <Route path="/admin/quiz">
              <AdminOverview />
            </Route>
            <Route path="/admin/quizzes">
              <AdminOverview />
            </Route>
            <Route path="/admin/funis">
              <MeusFunisReal />
            </Route>
            <Route path="/admin/meus-funis">
              <MeusFunisReal />
            </Route>
            <Route path="/admin/meus-templates">
              <TemplatesReal />
            </Route>
            <Route path="/admin/leads">
              <ParticipantsPage />
            </Route>
            <Route path="/admin/metricas">
              <EnhancedAnalytics />
            </Route>
            <Route path="/admin/configuracao">
              <SettingsPage />
            </Route>

            {/* Fallback - redireciona para dashboard principal */}
            <Route>
              <AdminOverview />
            </Route>
          </Switch>
        </Suspense>
      </UnifiedAdminLayout>
    </div>
  );
};

export default ModernAdminDashboard;
