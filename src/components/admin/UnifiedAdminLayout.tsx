/**
 * 🎯 UNIFIED ADMIN LAYOUT
 * 
 * Layout unificado que conecta dashboard admin com editor integrado
 * Elimina a fragmentação entre /admin, /dashboard e /editor
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart3,
    Target,
    Activity,
    Settings,
    Edit,
    ArrowLeft,
    Home,
    Plus
} from 'lucide-react';
import { UnifiedRoutingService } from '@/services/core/UnifiedRoutingService';
import { EditorDashboardSyncService } from '@/services/core/EditorDashboardSyncService';

// Componentes lazy-loaded
const AdminDashboard = React.lazy(() => import('@/pages/dashboard/AdminDashboard'));
const MeusFunisPageReal = React.lazy(() => import('@/pages/dashboard/MeusFunisPageReal'));
const AnalyticsPage = React.lazy(() => import('@/pages/admin/AnalyticsPage'));
const ModernUnifiedEditor = React.lazy(() => import('@/pages/editor/ModernUnifiedEditor'));

// ============================================================================
// INTERFACES
// ============================================================================

interface UnifiedAdminLayoutProps {
    children?: React.ReactNode;
    currentView?: 'dashboard' | 'funnels' | 'analytics' | 'editor';
    funnelId?: string;
    className?: string;
}

interface AdminBreadcrumb {
    label: string;
    path: string;
    active?: boolean;
}

// ============================================================================
// UNIFIED ADMIN LAYOUT COMPONENT
// ============================================================================

export const UnifiedAdminLayout: React.FC<UnifiedAdminLayoutProps> = ({
    children,
    currentView = 'dashboard',
    funnelId,
    className = ''
}) => {
    const [activeView, setActiveView] = useState(currentView);
    const [syncStats, setSyncStats] = useState(EditorDashboardSyncService.getSyncStats());

    // ========================================================================
    // NAVIGATION HANDLERS
    // ========================================================================

    const handleNavigateToView = (view: 'dashboard' | 'funnels' | 'analytics') => {
        const paths = {
            dashboard: '/admin/dashboard',
            funnels: '/admin/funnels',
            analytics: '/admin/analytics'
        };

        UnifiedRoutingService.navigate(paths[view]);
        setActiveView(view);
    };

    const handleEditFunnel = (funnelId: string) => {
        UnifiedRoutingService.navigateAdminToEditor(funnelId, true);
        setActiveView('editor');
    };

    const handleBackToDashboard = () => {
        UnifiedRoutingService.navigate('/admin/dashboard');
        setActiveView('dashboard');
    };

    // ========================================================================
    // SYNC SERVICE INTEGRATION
    // ========================================================================

    useEffect(() => {
        // Escutar eventos de sincronização para atualizar stats
        const unsubscribe = EditorDashboardSyncService.onSync(() => {
            setSyncStats(EditorDashboardSyncService.getSyncStats());
        });

        return unsubscribe;
    }, []);

    // ========================================================================
    // BREADCRUMBS GENERATION
    // ========================================================================

    const getBreadcrumbs = (): AdminBreadcrumb[] => {
        const routeInfo = UnifiedRoutingService.getCurrentRouteInfo();
        if (routeInfo?.breadcrumbs) {
            return routeInfo.breadcrumbs.map((crumb, index, array) => ({
                ...crumb,
                active: index === array.length - 1
            }));
        }

        // Fallback breadcrumbs
        const breadcrumbs: AdminBreadcrumb[] = [
            { label: 'Admin', path: '/admin/dashboard' }
        ];

        switch (activeView) {
            case 'funnels':
                breadcrumbs.push({ label: 'Funis', path: '/admin/funnels', active: true });
                break;
            case 'analytics':
                breadcrumbs.push({ label: 'Analytics', path: '/admin/analytics', active: true });
                break;
            case 'editor':
                breadcrumbs.push(
                    { label: 'Funis', path: '/admin/funnels' },
                    { label: 'Editor', path: '#', active: true }
                );
                break;
            default:
                breadcrumbs[0].active = true;
        }

        return breadcrumbs;
    };

    // ========================================================================
    // RENDER CONTENT BY VIEW
    // ========================================================================

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'funnels':
                return <MeusFunisPageReal />;
            case 'analytics':
                return <AnalyticsPage />;
            case 'editor':
                return funnelId ? (
                    <ModernUnifiedEditor
                        funnelId={funnelId}
                        mode="admin-integrated"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <Edit className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">Selecione um funil para editar</p>
                            <Button
                                onClick={() => handleNavigateToView('funnels')}
                                className="mt-4"
                            >
                                Ver Funis
                            </Button>
                        </div>
                    </div>
                );
            default:
                return children;
        }
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 ${className}`}>
            {/* Header Unificado - Design Profissional */}
            <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm">
                <div className="flex h-18 items-center px-8">
                    {/* Logo e Titulo - Design Premium */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Admin Dashboard
                                </span>
                                <span className="text-xs text-gray-500 font-medium">
                                    Sistema Unificado v2.0
                                </span>
                            </div>
                        </div>

                        {/* Sync Status - Design Moderno */}
                        {syncStats.total > 0 && (
                            <div className="flex items-center gap-3">
                                <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200/60">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-medium text-green-700">
                                        {syncStats.last24h} sync hoje
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Tabs - Design Premium */}
                    <div className="flex-1 flex justify-center">
                        <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-2xl p-1 shadow-sm border border-white/40">
                            <Tabs value={activeView} onValueChange={(value) => handleNavigateToView(value as any)} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto gap-1">
                                    <TabsTrigger
                                        value="dashboard"
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200"
                                    >
                                        <Home className="w-4 h-4" />
                                        <span className="font-medium">Dashboard</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="funnels"
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200"
                                    >
                                        <Target className="w-4 h-4" />
                                        <span className="font-medium">Funis</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="analytics"
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200"
                                    >
                                        <Activity className="w-4 h-4" />
                                        <span className="font-medium">Analytics</span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    {/* Actions - Design Premium */}
                    <div className="flex items-center gap-3">
                        {activeView === 'editor' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBackToDashboard}
                                className="border-blue-200/60 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors backdrop-blur-sm bg-white/50 shadow-sm"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Voltar
                            </Button>
                        )}

                        <Button
                            size="sm"
                            onClick={() => handleNavigateToView('funnels')}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2.5 rounded-xl font-medium"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Funil
                        </Button>
                    </div>
                </div>

                {/* Breadcrumbs - Design Moderno */}
                <div className="px-8 py-3 bg-gradient-to-r from-white/40 to-blue-50/40 backdrop-blur-sm border-t border-white/30">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        {getBreadcrumbs().map((crumb, index) => (
                            <React.Fragment key={crumb.path}>
                                {index > 0 && <span>/</span>}
                                <button
                                    onClick={() => crumb.path !== '#' && UnifiedRoutingService.navigate(crumb.path)}
                                    className={`hover:text-foreground transition-colors ${crumb.active ? 'text-foreground font-medium' : ''
                                        } ${crumb.path === '#' ? 'cursor-default' : 'cursor-pointer'}`}
                                    disabled={crumb.path === '#'}
                                >
                                    {crumb.label}
                                </button>
                            </React.Fragment>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main Content - Design Premium */}
            <main className="flex-1 min-h-0">
                <div className="h-full bg-gradient-to-br from-white/60 to-slate-50/60 backdrop-blur-sm">
                    <React.Suspense
                        fallback={
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-muted-foreground">Carregando...</p>
                                </div>
                            </div>
                        }
                    >
                        {renderContent()}
                    </React.Suspense>
                </div>
            </main>
        </div>
    );
};

export default UnifiedAdminLayout;