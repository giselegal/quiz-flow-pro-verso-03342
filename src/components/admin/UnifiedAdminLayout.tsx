/**
 * 🎯 UNIFIED ADMIN LAYOUT
 * 
 * Layout unificado que conecta dashboard admin com editor integrado
 * Elimina a fragmentação entre /admin, /dashboard e /editor
 */

import React, { useState, useEffect } from 'react';
import UnifiedCRUDProvider from '@/context/UnifiedCRUDProvider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart3,
    Target,
    Activity,
    Edit,
    ArrowLeft,
    Home,
    Plus
} from 'lucide-react';
import { UnifiedRoutingService } from '@/services/core/UnifiedRoutingService';
import { EditorDashboardSyncService } from '@/services/core/EditorDashboardSyncService';
import { useTheme } from '@/styles/themes';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useUserName } from '@/hooks/useUserName';

// Componentes lazy-loaded
const AdminDashboard = React.lazy(() => import('@/pages/dashboard/AdminDashboard'));
const MeusFunisPageReal = React.lazy(() => import('@/pages/dashboard/MeusFunisPageReal'));
const AnalyticsPage = React.lazy(() => import('@/pages/dashboard/AnalyticsPage'));
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
    const theme = useTheme();
    const displayName = useUserName();

    // Computa iniciais para avatar simples
    const initials = React.useMemo(() => {
        if (!displayName) return '?';
        const parts = displayName.split(/\s+/).filter(Boolean);
        if (!parts.length) return '?';
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }, [displayName]);

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
                breadcrumbs.push({ label: 'Meus Funis', path: '/admin/funnels', active: true });
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
                    <UnifiedCRUDProvider funnelId={funnelId} autoLoad={true}>
                        <ModernUnifiedEditor funnelId={funnelId} />
                    </UnifiedCRUDProvider>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <Edit className="w-12 h-12 mx-auto mb-4" style={{ color: `${theme.colors.detailsMinor}60` }} />
                            <p style={{ color: `${theme.colors.text}70` }}>Selecione um funil para editar</p>
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
        <div
            className={`min-h-screen ${className}`}
            style={{
                background: theme.colors.background,
                color: theme.colors.text
            }}
        >
            {/* Header Unificado - Design com Nova Identidade Visual */}
            <header
                className="sticky top-0 z-50 border-b shadow-sm"
                style={{
                    borderColor: `${theme.colors.detailsMinor}30`,
                    backgroundColor: `${theme.colors.background}95`,
                    backdropFilter: 'blur(20px)',
                    boxShadow: `0 0 30px ${theme.colors.glowEffect}20`
                }}
            >
                <div className="flex h-18 items-center px-8">
                    {/* Logo e Titulo - Design Premium com Nova Identidade */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center justify-center w-10 h-10 rounded-xl shadow-lg glow-button"
                                style={{
                                    background: `linear-gradient(135deg, ${theme.colors.buttons} 0%, ${theme.colors.detailsMinor} 100%)`,
                                    boxShadow: `0 0 20px ${theme.colors.buttons}50`
                                }}
                            >
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span
                                    className="font-bold text-xl glow-text"
                                    style={{
                                        background: `linear-gradient(135deg, ${theme.colors.detailsMinor} 0%, ${theme.colors.buttons} 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        filter: `drop-shadow(0 0 10px ${theme.colors.detailsMinor}50)`
                                    }}
                                >
                                    Admin Dashboard
                                </span>
                                <span
                                    className="text-xs font-medium"
                                    style={{ color: `${theme.colors.text}70` }}
                                >
                                    Sistema Unificado v2.0
                                </span>
                            </div>
                        </div>

                        {/* Sync Status - Design Moderno com Nova Identidade */}
                        {syncStats.total > 0 && (
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-px h-6"
                                    style={{
                                        background: `linear-gradient(to bottom, transparent, ${theme.colors.detailsMinor}50, transparent)`
                                    }}
                                />
                                <div
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border glow-card"
                                    style={{
                                        backgroundColor: `${theme.colors.glowEffect}20`,
                                        borderColor: `${theme.colors.detailsMinor}40`,
                                        boxShadow: `0 0 10px ${theme.colors.glowEffect}30`
                                    }}
                                >
                                    <div
                                        className="w-2 h-2 rounded-full animate-pulse"
                                        style={{ backgroundColor: theme.colors.detailsMinor }}
                                    />
                                    <span
                                        className="text-xs font-medium"
                                        style={{ color: theme.colors.text }}
                                    >
                                        {syncStats.last24h} sync hoje
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Tabs - Design Premium com Nova Identidade */}
                    <div className="flex-1 flex justify-center">
                        <div
                            className="flex items-center backdrop-blur-sm rounded-2xl p-1 shadow-sm border glow-card"
                            style={{
                                backgroundColor: `${theme.colors.background}60`,
                                borderColor: `${theme.colors.detailsMinor}30`,
                                boxShadow: `0 0 20px ${theme.colors.glowEffect}20`
                            }}
                        >
                            <Tabs value={activeView} onValueChange={(value) => handleNavigateToView(value as any)} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 p-0 h-auto gap-1" style={{ backgroundColor: 'transparent' }}>
                                    <TabsTrigger
                                        value="dashboard"
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 glow-button [&[data-state=active]]:bg-transparent [&[data-state=active]]:text-current"
                                        style={{
                                            background: activeView === 'dashboard'
                                                ? `linear-gradient(135deg, ${theme.colors.buttons} 0%, ${theme.colors.detailsMinor} 100%) !important`
                                                : 'transparent !important',
                                            color: activeView === 'dashboard' ? '#ffffff !important' : `${theme.colors.text} !important`,
                                            boxShadow: activeView === 'dashboard'
                                                ? `0 0 15px ${theme.colors.buttons}40`
                                                : 'none'
                                        }}
                                    >
                                        <Home className="w-4 h-4" />
                                        <span className="font-medium">Dashboard</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="funnels"
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 glow-button [&[data-state=active]]:bg-transparent [&[data-state=active]]:text-current"
                                        style={{
                                            background: activeView === 'funnels'
                                                ? `linear-gradient(135deg, ${theme.colors.buttons} 0%, ${theme.colors.detailsMinor} 100%) !important`
                                                : 'transparent !important',
                                            color: activeView === 'funnels' ? '#ffffff !important' : `${theme.colors.text} !important`,
                                            boxShadow: activeView === 'funnels'
                                                ? `0 0 15px ${theme.colors.buttons}40`
                                                : 'none'
                                        }}
                                    >
                                        <Target className="w-4 h-4" />
                                        <span className="font-medium">Meus Funis</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="analytics"
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 glow-button [&[data-state=active]]:bg-transparent [&[data-state=active]]:text-current"
                                        style={{
                                            background: activeView === 'analytics'
                                                ? `linear-gradient(135deg, ${theme.colors.buttons} 0%, ${theme.colors.detailsMinor} 100%) !important`
                                                : 'transparent !important',
                                            color: activeView === 'analytics' ? '#ffffff !important' : `${theme.colors.text} !important`,
                                            boxShadow: activeView === 'analytics'
                                                ? `0 0 15px ${theme.colors.buttons}40`
                                                : 'none'
                                        }}
                                    >
                                        <Activity className="w-4 h-4" />
                                        <span className="font-medium">Analytics</span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    {/* Actions - Design Premium com Nova Identidade */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle size="sm" />

                        {/* User Identity */}
                        <div
                            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-2xl border text-sm font-medium select-none"
                            style={{
                                borderColor: `${theme.colors.detailsMinor}40`,
                                background: `${theme.colors.background}70`,
                                boxShadow: `0 0 12px ${theme.colors.glowEffect}25`
                            }}
                            title={displayName}
                        >
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold tracking-wide"
                                style={{
                                    background: `linear-gradient(135deg, ${theme.colors.detailsMinor} 0%, ${theme.colors.buttons} 100%)`,
                                    color: '#fff',
                                    boxShadow: `0 0 10px ${theme.colors.detailsMinor}50`
                                }}
                            >
                                {initials}
                            </div>
                            <span
                                className="truncate max-w-[140px]"
                                style={{ color: theme.colors.text }}
                            >
                                {displayName}
                            </span>
                        </div>

                        {/* Preview Draft: aparece apenas quando estiver no editor e for um draft */}
                        {activeView === 'editor' && funnelId && funnelId.startsWith('draft-') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/quiz-estilo?draft=${funnelId}`, '_blank')}
                                className="transition-colors backdrop-blur-sm shadow-sm border glow-button"
                                style={{
                                    borderColor: `${theme.colors.detailsMinor}60`,
                                    color: theme.colors.text,
                                    backgroundColor: `${theme.colors.background}50`,
                                    boxShadow: `0 0 10px ${theme.colors.glowEffect}20`
                                }}
                            >
                                Preview
                            </Button>
                        )}

                        {activeView === 'editor' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBackToDashboard}
                                className="transition-colors backdrop-blur-sm shadow-sm border glow-button"
                                style={{
                                    borderColor: `${theme.colors.detailsMinor}60`,
                                    color: theme.colors.text,
                                    backgroundColor: `${theme.colors.background}50`,
                                    boxShadow: `0 0 10px ${theme.colors.glowEffect}20`
                                }}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Voltar
                            </Button>
                        )}

                        {/* Acesso rápido ao Editor a partir do Dashboard */}
                        <Button
                            size="sm"
                            onClick={() => UnifiedRoutingService.navigate('/editor')}
                            className="shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2.5 rounded-xl font-medium text-white glow-button"
                            style={{
                                background: `linear-gradient(135deg, ${theme.colors.detailsMinor} 0%, ${theme.colors.buttons} 100%)`,
                                boxShadow: `0 0 20px ${theme.colors.detailsMinor}40, 0 4px 20px rgba(0, 0, 0, 0.2)`
                            }}
                            title="Abrir Editor"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Abrir Editor
                        </Button>

                        <Button
                            size="sm"
                            onClick={() => handleNavigateToView('funnels')}
                            className="shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2.5 rounded-xl font-medium text-white glow-button"
                            style={{
                                background: `linear-gradient(135deg, ${theme.colors.buttons} 0%, ${theme.colors.detailsMinor} 100%)`,
                                boxShadow: `0 0 20px ${theme.colors.buttons}40, 0 4px 20px rgba(0, 0, 0, 0.2)`
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Funil
                        </Button>
                    </div>
                </div>

                {/* Breadcrumbs - Design Moderno com Nova Identidade */}
                <div
                    className="px-8 py-3 backdrop-blur-sm border-t"
                    style={{
                        background: `linear-gradient(90deg, ${theme.colors.glowEffect}20, ${theme.colors.detailsMinor}10)`,
                        borderColor: `${theme.colors.detailsMinor}30`
                    }}
                >
                    <nav className="flex items-center space-x-2 text-sm">
                        {getBreadcrumbs().map((crumb, index) => (
                            <React.Fragment key={crumb.path}>
                                {index > 0 && (
                                    <span style={{ color: `${theme.colors.text}50` }}>/</span>
                                )}
                                <button
                                    onClick={() => crumb.path !== '#' && UnifiedRoutingService.navigate(crumb.path)}
                                    className="transition-colors cursor-pointer hover:glow-text"
                                    style={{
                                        color: crumb.active ? theme.colors.detailsMinor : `${theme.colors.text}70`,
                                        fontWeight: crumb.active ? '600' : '400',
                                        cursor: crumb.path === '#' ? 'default' : 'pointer'
                                    }}
                                    disabled={crumb.path === '#'}
                                >
                                    {crumb.label}
                                </button>
                            </React.Fragment>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main Content - Design Premium com Nova Identidade */}
            <main className="flex-1 min-h-0">
                <div
                    className="h-full backdrop-blur-sm"
                    style={{
                        background: `linear-gradient(135deg, ${theme.colors.background}60, ${theme.colors.glowEffect}10)`
                    }}
                >
                    <React.Suspense
                        fallback={
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div
                                        className="w-8 h-8 mx-auto mb-4 border-2 border-t-transparent rounded-full animate-spin"
                                        style={{
                                            borderColor: `${theme.colors.detailsMinor}30`,
                                            borderTopColor: 'transparent'
                                        }}
                                    ></div>
                                    <p style={{ color: `${theme.colors.text}70` }}>Carregando...</p>
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