/**
 * 📊 PÁGINA PRINCIPAL DO DASHBOARD MODERNIZADA
 * 
 * Dashboard central com:
 * - Métricas principais
 * - Cards de resumo interativos
 * - Gráficos em tempo real
 * - Atalhos para funcionalidades principais
 * - Design moderno e responsivo
 */

import React from 'react';
import { Route, Switch, useLocation } from 'wouter';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Download, Filter } from 'lucide-react';

// Lazy loading das páginas do dashboard
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Páginas do Dashboard - ESPECÍFICAS
const AdminDashboard = lazy(() => import('./dashboard/AdminDashboard'));
const OverviewPage = lazy(() => import('./dashboard/OverviewPage'));
const AnalyticsPage = lazy(() => import('./dashboard/AnalyticsPage'));
const RealTimePage = lazy(() => import('./dashboard/RealTimePage'));
const ParticipantsPage = lazy(() => import('./dashboard/ParticipantsPage'));
const TemplatesFunisPage = lazy(() => import('./dashboard/TemplatesFunisPage'));
const MeusFunisPageReal = lazy(() => import('./dashboard/MeusFunisPageReal'));
const TemplatesPage = lazy(() => import('./dashboard/TemplatesPage'));
const ABTestsPage = lazy(() => import('./dashboard/ABTestsPage'));
const CreativesPage = lazy(() => import('./dashboard/CreativesPage'));
const IntegrationsPage = lazy(() => import('./dashboard/IntegrationsPage'));
const SettingsPage = lazy(() => import('./dashboard/SettingsPage'));

// Wrapper para AdminDashboard

// Componente de loading personalizado
const DashboardLoadingFallback = () => (
    <div className="flex items-center justify-center h-96">
        <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Carregando dashboard...</p>
        </div>
    </div>
);

// Mapeamento de títulos e subtítulos das páginas
const pageConfig: Record<string, { title: string; subtitle: string; actions?: React.ReactNode }> = {
    '/dashboard': {
        title: 'Admin Dashboard',
        subtitle: 'Dashboard consolidado com visão geral, participantes e analytics unificados',
        actions: (
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar
                </Button>
                <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Funil
                </Button>
            </div>
        )
    },
    '/dashboard/analytics': {
        title: 'Analytics',
        subtitle: 'Análise detalhada de performance e engajamento',
        actions: (
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                </Button>
                <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                </Button>
            </div>
        )
    },
    '/dashboard/real-time': {
        title: 'Tempo Real',
        subtitle: 'Métricas e atividades em tempo real',
        actions: (
            <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Auto-refresh
            </Button>
        )
    },
    '/dashboard/funnels': {
        title: 'Meus Funis',
        subtitle: 'Gerencie seus funis de conversão e campanhas',
        actions: (
            <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Funil
            </Button>
        )
    },
    '/dashboard/funnel-templates': {
        title: 'Templates de Funis',
        subtitle: 'Modelos profissionais prontos para uso',
        actions: (
            <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Criar Template
            </Button>
        )
    },
    '/dashboard/participants': {
        title: 'Participantes',
        subtitle: 'Acompanhe leads e conversões',
        actions: (
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                </Button>
                <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                </Button>
            </div>
        )
    },
    '/dashboard/ab-tests': {
        title: 'Testes A/B',
        subtitle: 'Configure e monitore experimentos',
        actions: (
            <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Teste
            </Button>
        )
    },
    '/dashboard/creatives': {
        title: 'Criativos',
        subtitle: 'Gerencie assets visuais e copy',
        actions: (
            <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Criativo
            </Button>
        )
    },
    '/dashboard/templates': {
        title: 'Templates',
        subtitle: 'Biblioteca de templates do sistema',
    },
    '/dashboard/integrations': {
        title: 'Integrações',
        subtitle: 'Conecte ferramentas externas',
    },
    '/dashboard/settings': {
        title: 'Configurações',
        subtitle: 'Personalize e configure o sistema',
    }
};

const ModernDashboardPage: React.FC = () => {
    const [location] = useLocation();

    // Normalizar a localização para encontrar a configuração correta
    const normalizedLocation = location === '/dashboard/' ? '/dashboard' : location;
    const config = pageConfig[normalizedLocation] || pageConfig['/dashboard'];

    return (
        <ModernDashboardLayout
            title={config.title}
            subtitle={config.subtitle}
            actions={config.actions}
        >
            <Suspense fallback={<DashboardLoadingFallback />}>
                <Switch>
                    {/* DASHBOARD CONSOLIDADO - Página principal */}
                    <Route path="/dashboard">
                        {() => <AdminDashboard />}
                    </Route>
                    <Route path="/dashboard/">
                        {() => <AdminDashboard />}
                    </Route>

                    {/* ANALYTICS - Páginas de análise específicas */}
                    <Route path="/dashboard/analytics" component={AnalyticsPage} />
                    <Route path="/dashboard/real-time" component={RealTimePage} />
                    <Route path="/dashboard/participants" component={ParticipantsPage} />

                    {/* CONTENT MANAGEMENT - Páginas de conteúdo */}
                    <Route path="/dashboard/funnel-templates" component={TemplatesFunisPage} />
                    <Route path="/dashboard/funnels" component={MeusFunisPageReal} />
                    <Route path="/dashboard/templates" component={TemplatesPage} />

                    {/* TOOLS - Ferramentas e funcionalidades */}
                    <Route path="/dashboard/ab-tests" component={ABTestsPage} />
                    <Route path="/dashboard/creatives" component={CreativesPage} />

                    {/* SYSTEM - Configurações do sistema */}
                    <Route path="/dashboard/integrations" component={IntegrationsPage} />
                    <Route path="/dashboard/settings" component={SettingsPage} />

                    {/* LEGACY REDIRECTS - Compatibilidade com rotas antigas */}
                    <Route path="/dashboard/templates-funis">
                        {() => {
                            window.history.replaceState(null, '', '/dashboard/funnel-templates');
                            return null;
                        }}
                    </Route>
                    <Route path="/dashboard/meus-funis">
                        {() => {
                            window.history.replaceState(null, '', '/dashboard/funnels');
                            return null;
                        }}
                    </Route>
                    <Route path="/dashboard/quizzes">
                        {() => {
                            window.history.replaceState(null, '', '/dashboard/funnels');
                            return null;
                        }}
                    </Route>

                    {/* Configurações */}
                    <Route path="/dashboard/settings" component={SettingsPage} />

                    {/* Fallback para rotas não encontradas dentro do dashboard */}
                    <Route>
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h2>
                            <p className="text-gray-600 mb-4">A página que você procura não existe.</p>
                            <Button onClick={() => window.location.href = '/dashboard'}>
                                Voltar ao Dashboard
                            </Button>
                        </div>
                    </Route>
                </Switch>
            </Suspense>
        </ModernDashboardLayout>
    );
};

export default ModernDashboardPage;