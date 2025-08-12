// @ts-nocheck
export const ROUTES = {
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

export function isValidRoute(path: string): boolean {
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
