/**
 * TODO: TypeScript Migration - Deadline: Janeiro 2025
 * - [ ] Criar tipos específicos para rotas (AdminRoutes, PublicRoutes)
 * - [ ] Implementar enum ou const assertion para type safety
 * - [ ] Adicionar métodos para construção de URLs com params
 * - [ ] Implementar validação de rotas mais robusta com regex
 * - [ ] Adicionar metadata de rotas (permissions, títulos, etc)
 */

import { appLogger } from './logger';

// Tipos mínimos para migração
type RouteString = string;
type RouteValidator = (path: string) => boolean;

interface AdminRoutes {
  ROOT: RouteString;
  DASHBOARD: RouteString;
  QUIZ: RouteString;
  AB_TESTS: RouteString;
  SETTINGS: RouteString;
  CRIATIVOS: RouteString;
  ANALYTICS: RouteString;
  EDITOR: RouteString;
}

interface AppRoutes {
  HOME: RouteString;
  RESULTADO: RouteString;
  DESCUBRA_SEU_ESTILO: RouteString;
  ADMIN: AdminRoutes;
}

export const ROUTES: AppRoutes = {
  // Rotas públicas principais
  HOME: '/',
  RESULTADO: '/resultado',
  DESCUBRA_SEU_ESTILO: '/descubra-seu-estilo',

  // Rotas administrativas
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin',
    QUIZ: '/admin/quiz',
    AB_TESTS: '/admin/ab-tests',
    SETTINGS: '/admin/settings',
    CRIATIVOS: '/admin/criativos',
    ANALYTICS: '/admin/analytics',
    EDITOR: '/editor',
  },
};

export const isValidRoute: RouteValidator = (path: string): boolean => {
  appLogger.debug('Validating route', { path });

  const allRoutes = [
    ROUTES.HOME,
    ROUTES.RESULTADO,
    ROUTES.DESCUBRA_SEU_ESTILO,
    ROUTES.ADMIN.ROOT,
    ROUTES.ADMIN.DASHBOARD,
    ROUTES.ADMIN.QUIZ,
    ROUTES.ADMIN.AB_TESTS,
    ROUTES.ADMIN.SETTINGS,
    ROUTES.ADMIN.CRIATIVOS,
    ROUTES.ADMIN.ANALYTICS,
    ROUTES.ADMIN.EDITOR,
  ];

  // Verificar rotas exatas
  if (allRoutes.includes(path)) {
    return true;
  }

  // Verificar rotas admin com wildcards
  if (path.startsWith('/admin/') && path.length > '/admin/'.length) {
    return true;
  }

  return false;
}
