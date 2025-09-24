/**
 * 📊 PÁGINA PRINCIPAL DO DASHBOARD MODERNIZADA
 * 
 * Dashboard central com:
 * - Ove    '/dashboard/funnels': {
        title: 'Funis',
        subtitle: 'Gestão completa dos seus funis de conversão',
        actions: (
            <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Funil
            </Button>
        )
    },
    '/dashboard/templates-funis': {
        title: 'Templates de Funis',
        subtitle: 'Modelos prontos para começar rapidamente',
        actions: (
            <Button size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
            </Button>
        )
    },
    '/dashboard/meus-funis': {
        title: 'Meus Funis',
        subtitle: 'Gerencie seus funis personalizados',
        actions: (
            <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Criar Funil
            </Button>
        )
    },métricas principais
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

// Páginas do Dashboard - CONSOLIDADO
const AdminDashboard = lazy(() => import('./dashboard/AdminDashboard'));
const TemplatesFunisPage = lazy(() => import('./dashboard/TemplatesFunisPage'));
const MeusFunisPage = lazy(() => import('./dashboard/MeusFunisPage'));

// Legacy pages (mantidas para compatibilidade temporária)
const SettingsPage = lazy(() => import('./dashboard/SettingsPage'));

// Wrapper para AdminDashboard
const AdminDashboardWrapper: React.FC = () => <AdminDashboard />;

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
        title: 'Funis',
        subtitle: 'Gerencie seus funis de conversão',
        actions: (
            <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Funil
            </Button>
        )
    },
    '/dashboard/templates-funis': {
        title: 'Modelos de Funis',
        subtitle: 'Templates prontos e profissionais para começar rapidamente',
        actions: (
            <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar Catálogo
            </Button>
        )
    },
    '/dashboard/meus-funis': {
        title: 'Meus Funis Ativos',
        subtitle: 'Funis em uso, editados e publicados com métricas reais',
        actions: (
            <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Funil
            </Button>
        )
    },
    '/dashboard/quizzes': {
        title: 'Quizzes',
        subtitle: 'Seus quizzes e formulários interativos',
        actions: (
            <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Quiz
            </Button>
        )
    },
    '/dashboard/participants': {
        title: 'Participantes',
        subtitle: 'Leads e participantes dos seus funis',
        actions: (
            <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar Lista
            </Button>
        )
    },
    '/dashboard/templates': {
        title: 'Templates',
        subtitle: 'Biblioteca de templates e componentes',
        actions: (
            <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Template
            </Button>
        )
    },
    '/dashboard/ab-tests': {
        title: 'Testes A/B',
        subtitle: 'Experimentos e otimizações',
        actions: (
            <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Teste
            </Button>
        )
    },
    '/dashboard/creatives': {
        title: 'Criativos',
        subtitle: 'Imagens, vídeos e recursos visuais',
        actions: (
            <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Upload
            </Button>
        )
    },
    '/dashboard/settings': {
        title: 'Configurações',
        subtitle: 'Configurações da conta e preferências'
    },
    '/dashboard/integrations': {
        title: 'Integrações',
        subtitle: 'Conecte com ferramentas externas'
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
                    {/* DASHBOARD CONSOLIDADO - Substitui múltiplas páginas */}
                    <Route path="/dashboard">
                        {() => <AdminDashboard />}
                    </Route>
                    <Route path="/dashboard/">
                        {() => <AdminDashboard />}
                    </Route>

                    {/* Páginas específicas mantidas */}
                    <Route path="/dashboard/templates-funis" component={TemplatesFunisPage} />
                    <Route path="/dashboard/meus-funis" component={MeusFunisPage} />

                    {/* Configurações (temporário) */}
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