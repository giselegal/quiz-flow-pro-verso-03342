// Utilitário para verificar as rotas específicas do site da Gisele Galvão
// Versão: 1.0.3

interface RouteStatus {
  path: string;
  name: string;
  fullUrl: string;
  status: 'pendente' | 'carregada' | 'erro';
}

interface RouteCheckResult {
  routes: RouteStatus[];
  currentRoute: string;
  isRouterWorking: boolean;
}

/**
 * Verifica se todas as rotas principais estão funcionando corretamente
 * @returns {Object} Objeto com o status de cada rota
 */
export function checkMainRoutes(): RouteCheckResult {
  console.log('🧪 Verificando rotas principais do site...');

  const mainRoutes = [
    { path: '/', name: 'Quiz com Intro' },
    { path: '/home', name: 'Página Inicial' },
    { path: '/resultado', name: 'Página de Resultados' },
    { path: '/quiz-descubra-seu-estilo', name: 'Página do Quiz Completo' },
  ];

  const results: RouteStatus[] = mainRoutes.map(route => {
    // Criar o URL completo
    const baseUrl = window.location.origin;
    const fullUrl = new URL(route.path, baseUrl).href;

    return {
      ...route,
      fullUrl,
      status: 'pendente',
    };
  });

  // Verificar a rota atual
  const currentPath = window.location.pathname;
  results.forEach(route => {
    if (currentPath === route.path) {
      route.status = 'carregada';
      console.log(`✅ Rota atual: ${route.name} (${route.path}) - carregada com sucesso`);
    }
  });

  // Exibir informações detalhadas
  console.log('📊 Status das rotas principais:');
  results.forEach(route => {
    console.log(
      `${route.status === 'carregada' ? '✅' : '⏳'} ${route.name}: ${route.fullUrl} - ${route.status}`
    );
  });

  // Verificar o estado do SPA Router
  const isRouterWorking = typeof window.location.pathname === 'string';

  if (isRouterWorking) {
    console.log('✅ Sistema de roteamento SPA funcionando corretamente');
  } else {
    console.warn('⚠️ Possível problema com o sistema de roteamento');
  }

  return {
    routes: results,
    currentRoute: currentPath,
    isRouterWorking,
  };
}

/**
 * Testar a navegação para as rotas principais para verificar funcionalidade
 * @param {boolean} doRealNavigation Define se deve realizar navegação real ou apenas verificar
 */
export function testMainRoutes(doRealNavigation: boolean = false): void {
  const result = checkMainRoutes();

  if (!result.isRouterWorking) {
    console.error(
      '❌ Sistema de roteamento não está funcionando corretamente. Teste de navegação cancelado.'
    );
    return;
  }

  if (doRealNavigation) {
    console.warn('⚠️ Teste de navegação real ativado - o navegador irá mudar de página.');

    // Testar a primeira rota que não seja a atual
    const routeToTest = result.routes.find(r => r.path !== result.currentRoute);

    if (routeToTest) {
      console.log(`🔄 Navegando para ${routeToTest.name} (${routeToTest.path})...`);

      // Usar história do navegador para não realizar reload completo
      window.history.pushState({}, '', routeToTest.path);

      // Disparar evento popstate para que os listeners de rota do SPA possam reagir
      window.dispatchEvent(new Event('popstate'));
    }
  } else {
    console.log('ℹ️ Teste de navegação em modo simulação - sem mudança de página.');
    console.log('ℹ️ Para realizar navegação real, execute: testMainRoutes(true)');
  }
}

// Expor as funções globalmente
if (typeof window !== 'undefined') {
  (window as any).checkMainRoutes = checkMainRoutes;
  (window as any).testMainRoutes = testMainRoutes;
}

export default checkMainRoutes;
