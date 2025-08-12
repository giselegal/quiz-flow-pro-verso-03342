/**
 * Utilitário para verificar e documentar as rotas do projeto Quiz Sell Genius
 */

interface RouteDefinition {
  path: string;
  description: string;
  accessibleIn: Array<'production' | 'lovable' | 'development' | 'all'>;
  hasParams?: boolean;
  paramDescription?: string;
}

/**
 * Lista completa de todas as rotas do projeto
 */
export const projectRoutes: RouteDefinition[] = [
  // Rotas principais
  { path: '/', description: 'Página inicial', accessibleIn: ['all'] },
  { path: '/quiz', description: 'Interface do quiz', accessibleIn: ['all'] },
  {
    path: '/resultado',
    description: 'Visualizar página de resultado',
    accessibleIn: ['all'],
  },
  {
    path: '/prototipo',
    description: 'Página de protótipo',
    accessibleIn: ['all'],
  },

  // Rotas de administração
  {
    path: '/admin',
    description: 'Painel administrativo principal',
    accessibleIn: ['all'],
  },
  {
    path: '/admin/editor',
    description: 'Editor unificado',
    accessibleIn: ['all'],
  },
  {
    path: '/admin/quiz-editor',
    description: 'Editor de quizes',
    accessibleIn: ['all'],
  },
  {
    path: '/admin/sales-page',
    description: 'Gerenciador de páginas de venda',
    accessibleIn: ['all'],
  },
  {
    path: '/admin/settings',
    description: 'Configurações',
    accessibleIn: ['all'],
  },
  {
    path: '/admin/analytics',
    description: 'Análise de dados',
    accessibleIn: ['all'],
  },
  {
    path: '/admin/ab-test',
    description: 'Gerenciador de Testes A/B',
    accessibleIn: ['all'],
  },
  {
    path: '/admin/ab-test-manager',
    description: 'Interface completa de Testes A/B',
    accessibleIn: ['all'],
  },
  {
    path: '/admin/prototipo',
    description: 'Visualizar protótipo no painel admin',
    accessibleIn: ['all'],
  },

  // Rotas de edição
  {
    path: '/resultado/editor',
    description: 'Editor visual aprimorado',
    accessibleIn: ['all'],
  },
];

/**
 * Verifica se uma rota específica existe no sistema
 * @param path Caminho da rota para verificar
 * @returns Informações sobre a rota ou undefined se não existir
 */
export const checkRoute = (path: string): RouteDefinition | undefined => {
  return projectRoutes.find(route => route.path === path);
};

/**
 * Verifica se estamos no ambiente Lovable.dev
 */
export const isRunningInLovable = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('lovableproject.com') ||
      window.location.hostname.includes('lovable.dev') ||
      window.location.search.includes('lovable=true'))
  );
};

/**
 * Obtém todas as rotas disponíveis para o ambiente atual
 */
export const getAvailableRoutes = (): RouteDefinition[] => {
  const environment = isRunningInLovable()
    ? 'lovable'
    : process.env.NODE_ENV === 'production'
      ? 'production'
      : 'development';

  return projectRoutes.filter(
    route => route.accessibleIn.includes('all') || route.accessibleIn.includes(environment as any)
  );
};

/**
 * Registra informações sobre a rota atual
 */
export const logCurrentRoute = (): void => {
  if (typeof window === 'undefined') return;

  const currentPath = window.location.pathname;
  const routeInfo = checkRoute(currentPath);

  console.group('Informações da Rota Atual');
  console.log('Caminho:', currentPath);
  console.log('Ambiente:', isRunningInLovable() ? 'Lovable.dev' : process.env.NODE_ENV);

  if (routeInfo) {
    console.log('Descrição:', routeInfo.description);
    console.log('Disponível nos ambientes:', routeInfo.accessibleIn);
  } else {
    console.warn('Rota não encontrada na configuração!');
  }

  console.groupEnd();
};
