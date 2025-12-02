/**
 * 🗺️ ROUTES CONFIGURATION - Sistema de Rotas com Lazy Loading
 * 
 * Configuração centralizada de rotas com lazy loading para otimização de bundle.
 * 
 * BENEFÍCIOS:
 * - Code splitting automático
 * - Bundle size reduzido
 * - Faster initial load
 * - Rotas organizadas em um só lugar
 * 
 * @example
 * ```typescript
 * import { routes } from '@/pages/routes';
 * 
 * <Router>
 *   {routes.map(route => (
 *     <Route key={route.path} path={route.path}>
 *       <route.component />
 *     </Route>
 *   ))}
 * </Router>
 * ```
 */

import { lazy, ComponentType } from 'react';
import { featureFlags } from '@/core/utils/featureFlags';

export interface RouteConfig {
    /** Caminho da rota */
    path: string;
    
    /** Componente lazy loaded */
    component: ComponentType<any>;
    
    /** Nome da rota (para logging/debug) */
    name: string;
    
    /** Se requer autenticação */
    requiresAuth?: boolean;
    
    /** Grupo da rota (para organização) */
    group?: 'public' | 'editor' | 'admin' | 'quiz' | 'diagnostic';
    
    /** Feature flag necessária */
    featureFlag?: keyof typeof featureFlags;
    
    /** Prioridade de preload (1-10, maior = mais importante) */
    preloadPriority?: number;
}

/**
 * 🏠 ROTAS PÚBLICAS
 */
const publicRoutes: RouteConfig[] = [
    {
        path: '/',
        component: lazy(() => import('./Home')),
        name: 'Home',
        group: 'public',
        preloadPriority: 10,
    },
    {
        path: '/publish-success',
        component: lazy(() => import('./PublishSuccessPage')),
        name: 'Publish Success',
        group: 'public',
    },
    {
        path: '/error',
        component: lazy(() => import('./ErrorPage')),
        name: 'Error Page',
        group: 'public',
    },
];

/**
 * 🎯 ROTAS DO EDITOR
 */
const editorRoutes: RouteConfig[] = [
    {
        path: '/editor',
        component: lazy(() => import('./editor/EditorPage')),
        name: 'Editor Principal',
        group: 'editor',
        preloadPriority: 9,
    },
    {
        path: '/editor/:funnelId',
        component: lazy(() => import('./editor/EditorPage')),
        name: 'Editor com Funnel',
        group: 'editor',
        preloadPriority: 8,
    },
];

/**
 * 🎮 ROTAS DE QUIZ/PLAYER
 */
const quizRoutes: RouteConfig[] = [
    {
        path: '/quiz/estilo-pessoal',
        component: lazy(() => import('./QuizEstiloPessoalPage')),
        name: 'Quiz Estilo Pessoal',
        group: 'quiz',
    },
    {
        path: '/quiz/ai',
        component: lazy(() => import('./QuizAIPage')),
        name: 'Quiz AI',
        group: 'quiz',
    },
    {
        path: '/quiz/integrated',
        component: lazy(() => import('./QuizIntegratedPage')),
        name: 'Quiz Integrado',
        group: 'quiz',
    },
    {
        path: '/preview/:funnelId',
        component: lazy(() => import('./PreviewSandbox')),
        name: 'Preview Sandbox',
        group: 'quiz',
        preloadPriority: 7,
    },
    {
        path: '/live-preview/:funnelId',
        component: lazy(() => import('./LivePreviewPage')),
        name: 'Live Preview',
        group: 'quiz',
    },
];

/**
 * 🏢 ROTAS ADMIN
 */
const adminRoutes: RouteConfig[] = [
    {
        path: '/admin',
        component: lazy(() => import('./ModernAdminDashboard')),
        name: 'Admin Dashboard',
        group: 'admin',
        requiresAuth: true,
        preloadPriority: 6,
    },
    {
        path: '/admin/analytics',
        component: lazy(() => import('./admin/AnalyticsPage')),
        name: 'Analytics',
        group: 'admin',
        requiresAuth: true,
    },
    {
        path: '/admin/participants',
        component: lazy(() => import('./admin/ParticipantsPage')),
        name: 'Participantes',
        group: 'admin',
        requiresAuth: true,
    },
    {
        path: '/admin/settings',
        component: lazy(() => import('./admin/SettingsPage')),
        name: 'Configurações',
        group: 'admin',
        requiresAuth: true,
    },
    {
        path: '/admin/integrations',
        component: lazy(() => import('./admin/IntegrationsPage')),
        name: 'Integrações',
        group: 'admin',
        requiresAuth: true,
    },
    {
        path: '/admin/ab-tests',
        component: lazy(() => import('./admin/ABTestPage')),
        name: 'Testes A/B',
        group: 'admin',
        requiresAuth: true,
    },
    {
        path: '/admin/creatives',
        component: lazy(() => import('./admin/CreativesPage')),
        name: 'Criativos',
        group: 'admin',
        requiresAuth: true,
    },
    {
        path: '/admin/adoption',
        component: lazy(() => import('./admin/CanonicalAdoptionDashboard')),
        name: 'Canonical Adoption',
        group: 'admin',
        requiresAuth: true,
    },
];

/**
 * 🔍 ROTAS DE DIAGNÓSTICO
 */
const diagnosticRoutes: RouteConfig[] = [
    {
        path: '/diagnostic/template',
        component: lazy(() => import('./TemplateDiagnosticPage')),
        name: 'Template Diagnostic',
        group: 'diagnostic',
    },
    {
        path: '/diagnostic/system',
        component: lazy(() => import('./SystemDiagnosticPage')),
        name: 'System Diagnostic',
        group: 'diagnostic',
    },
    {
        path: '/diagnostic/performance',
        component: lazy(() => import('./PerformanceTestPage')),
        name: 'Performance Test',
        group: 'diagnostic',
    },
    {
        path: '/diagnostic/accessibility',
        component: lazy(() => import('../components/a11y/AccessibilityAuditor')),
        name: 'Accessibility Auditor',
        group: 'diagnostic',
    },
];

/**
 * 🎨 ROTAS DE TEMPLATES E DASHBOARDS
 */
const templateRoutes: RouteConfig[] = [
    {
        path: '/templates',
        component: lazy(() => import('./ModelosFunisPage')),
        name: 'Templates',
        group: 'public',
    },
    {
        path: '/editor-templates',
        component: lazy(() => import('./editor-templates/index')),
        name: 'Editor Templates',
        group: 'public',
    },
    {
        path: '/funnel-types',
        component: lazy(() => import('./SimpleFunnelTypesPage')),
        name: 'Tipos de Funil',
        group: 'public',
    },
    {
        path: '/dashboard',
        component: lazy(() => import('./ModernDashboardPage')),
        name: 'Dashboard Moderno',
        group: 'public',
        preloadPriority: 7,
    },
    {
        path: '/phase2-dashboard',
        component: lazy(() => import('./Phase2Dashboard')),
        name: 'Phase 2 Dashboard',
        group: 'public',
    },
];

/**
 * 🧪 ROTAS DE TESTE
 */
const testRoutes: RouteConfig[] = [
    {
        path: '/tests',
        component: lazy(() => import('./TestsPage')),
        name: 'Tests',
        group: 'diagnostic',
    },
    {
        path: '/tests/supabase-fix',
        component: lazy(() => import('./SupabaseFixTestPage')),
        name: 'Supabase Fix Test',
        group: 'diagnostic',
    },
    {
        path: '/tests/indexeddb-migration',
        component: lazy(() => import('./IndexedDBMigrationTestPage')),
        name: 'IndexedDB Migration Test',
        group: 'diagnostic',
    },
];

/**
 * 🔀 REDIRECTS (para compatibilidade)
 */
export const redirects = [
    { from: '/home', to: '/' },
    { from: '/dashboard-admin', to: '/admin' },
    { from: '/editor-new', to: '/editor' },
    { from: '/editor-new/:funnelId', to: '/editor/:funnelId' },
    { from: '/editor-v4', to: '/editor' },
    { from: '/editor-pro', to: '/editor' },
    { from: '/quiz-builder', to: '/editor' },
];

/**
 * 📋 TODAS AS ROTAS CONSOLIDADAS
 */
export const routes: RouteConfig[] = [
    ...publicRoutes,
    ...editorRoutes,
    ...quizRoutes,
    ...adminRoutes,
    ...diagnosticRoutes,
    ...templateRoutes,
    ...testRoutes,
];

/**
 * 🎯 ROTAS POR GRUPO
 */
export const routesByGroup = {
    public: publicRoutes,
    editor: editorRoutes,
    quiz: quizRoutes,
    admin: adminRoutes,
    diagnostic: diagnosticRoutes,
    templates: templateRoutes,
    tests: testRoutes,
};

/**
 * 🚀 ROTAS PRIORITÁRIAS PARA PRELOAD
 */
export const criticalRoutes = routes
    .filter(r => r.preloadPriority && r.preloadPriority >= 7)
    .sort((a, b) => (b.preloadPriority || 0) - (a.preloadPriority || 0));

/**
 * 🔍 HELPER: Encontrar rota por path
 */
export function findRoute(path: string): RouteConfig | undefined {
    return routes.find(r => r.path === path);
}

/**
 * 🔍 HELPER: Encontrar rotas por grupo
 */
export function getRoutesByGroup(group: RouteConfig['group']): RouteConfig[] {
    return routes.filter(r => r.group === group);
}

/**
 * ✅ HELPER: Verificar se rota requer feature flag
 */
export function isRouteEnabled(route: RouteConfig): boolean {
    if (!route.featureFlag) return true;
    return featureFlags[route.featureFlag];
}
