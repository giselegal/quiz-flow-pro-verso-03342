/**
 * 🎯 CRITICAL ROUTES CONFIGURATION (P2 Optimization)
 * 
 * Define quais rotas devem ser preloaded e com qual prioridade
 */

import { routePreloader } from '@/utils/routePreloader';

// 🎯 HIGH PRIORITY (preload on app init)
export const CRITICAL_ROUTES = {
  editor: '/editor',
  auth: '/auth',
  admin: '/admin',
} as const;

// 🟡 MEDIUM PRIORITY (preload on idle)
export const SECONDARY_ROUTES = {
  quiz: '/quiz',
  templates: '/templates',
  dashboard: '/dashboard',
} as const;

// 🟢 LOW PRIORITY (preload on demand)
export const TERTIARY_ROUTES = {
  analytics: '/admin/analytics',
  settings: '/admin/settings',
  participants: '/admin/participants',
} as const;

/**
 * Configura preload de rotas críticas
 */
export const setupCriticalRoutes = () => {
  // HIGH PRIORITY - Preload imediato em idle
  routePreloader.register(CRITICAL_ROUTES.editor, {
    component: () => import('@/components/editor/quiz/QuizModularProductionEditor'),
    priority: 'high',
    preloadOnIdle: true,
  });

  routePreloader.register(CRITICAL_ROUTES.auth, {
    component: () => import('@/pages/AuthPage'),
    priority: 'high',
    preloadOnIdle: true,
  });

  routePreloader.register(CRITICAL_ROUTES.admin, {
    component: () => import('@/pages/ModernAdminDashboard'),
    priority: 'high',
    preloadOnIdle: false, // Auth-protected, não preload
  });

  // MEDIUM PRIORITY
  routePreloader.register(SECONDARY_ROUTES.quiz, {
    component: () => import('@/pages/QuizEstiloPessoalPage'),
    priority: 'medium',
    preloadOnIdle: true,
  });

  routePreloader.register(SECONDARY_ROUTES.templates, {
    component: () => import('@/pages/TemplatesPage'),
    priority: 'medium',
    preloadOnIdle: false,
  });

  // Preload rotas de alta prioridade automaticamente
  setTimeout(() => {
    routePreloader.preloadByPriority('high');
  }, 1000);
};

export default setupCriticalRoutes;
