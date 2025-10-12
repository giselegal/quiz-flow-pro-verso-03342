/**
 * 🎯 CONFIGURAÇÃO CENTRALIZADA DE ROTAS ADMIN
 * 
 * FASE 1: Quick Wins - Centralização de rotas
 * 
 * Antes: Rotas definidas em 3 arquivos diferentes
 * Depois: Rotas centralizadas aqui
 * 
 * Usado por:
 * - src/App.tsx
 * - src/pages/admin/DashboardPage.tsx
 * - src/components/admin/AdminSidebar.tsx
 */

export interface AdminRoute {
  path: string;
  label: string;
  icon?: string;
  component?: string;
  requiresAuth?: boolean;
  children?: AdminRoute[];
}

/**
 * Rotas principais do painel administrativo
 */
export const adminRoutes: AdminRoute[] = [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    component: 'ModernAdminDashboard',
    requiresAuth: true,
  },
  {
    path: '/admin/dashboard',
    label: 'Overview',
    icon: 'BarChart3',
    component: 'DashboardOverview',
    requiresAuth: true,
  },
  {
    path: '/admin/quiz',
    label: 'Quiz',
    icon: 'FileQuestion',
    component: 'QuizPage',
    requiresAuth: true,
  },
  {
    path: '/admin/meus-funis',
    label: 'Meus Funis',
    icon: 'Workflow',
    component: 'MyFunnelsPage',
    requiresAuth: true,
  },
  {
    path: '/admin/meus-templates',
    label: 'Meus Templates',
    icon: 'Layout',
    component: 'MyTemplatesPage',
    requiresAuth: true,
  },
  {
    path: '/admin/analytics',
    label: 'Analytics',
    icon: 'TrendingUp',
    component: 'AnalyticsPage',
    requiresAuth: true,
  },
  {
    path: '/admin/participants',
    label: 'Participantes',
    icon: 'Users',
    component: 'ParticipantsPage',
    requiresAuth: true,
  },
  {
    path: '/admin/ab-tests',
    label: 'Testes A/B',
    icon: 'TestTube',
    component: 'ABTestPage',
    requiresAuth: true,
  },
  {
    path: '/admin/creatives',
    label: 'Criativos',
    icon: 'Palette',
    component: 'CreativesPage',
    requiresAuth: true,
  },
  {
    path: '/admin/settings',
    label: 'Configurações',
    icon: 'Settings',
    component: 'SettingsPage',
    requiresAuth: true,
  },
  {
    path: '/admin/integrations',
    label: 'Integrações',
    icon: 'Plug',
    component: 'IntegrationsPage',
    requiresAuth: true,
  },
];

/**
 * Aliases de rotas (redirects)
 */
export const adminRouteAliases: Record<string, string> = {
  '/admin/quizzes': '/admin/quiz',
  '/admin/funis': '/admin/meus-funis',
  '/admin/funnels': '/admin/meus-funis',
  '/admin/funil': '/admin/meus-funis',
  '/admin/leads': '/admin/participants',
  '/admin/participantes': '/admin/participants',
  '/dashboard': '/admin/dashboard',
  '/dashboard-admin': '/admin',
};

/**
 * Retorna a rota canônica para um caminho (resolve aliases)
 */
export function getCanonicalRoute(path: string): string {
  return adminRouteAliases[path] || path;
}

/**
 * Verifica se uma rota requer autenticação
 */
export function requiresAuth(path: string): boolean {
  const canonicalPath = getCanonicalRoute(path);
  const route = adminRoutes.find(r => r.path === canonicalPath);
  return route?.requiresAuth ?? false;
}

/**
 * Retorna todas as rotas como paths simples (para Switch)
 */
export function getAllAdminPaths(): string[] {
  return [
    ...adminRoutes.map(r => r.path),
    ...Object.keys(adminRouteAliases)
  ];
}
