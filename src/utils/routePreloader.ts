/**
 * 🚀 ROUTE PRELOADER (P2 Performance Optimization)
 * 
 * Sistema inteligente de preload de rotas para melhorar perceived performance
 * - Preload on hover
 * - Preload on idle
 * - Priority-based loading
 */

type PreloadPriority = 'high' | 'medium' | 'low';

interface PreloadConfig {
  component: () => Promise<any>;
  priority: PreloadPriority;
  preloadOnIdle?: boolean;
}

class RoutePreloader {
  private preloadedRoutes = new Set<string>();
  private preloadQueue: Map<string, PreloadConfig> = new Map();
  private idleCallbackId: number | null = null;

  /**
   * Registra uma rota para preload
   */
  register(route: string, config: PreloadConfig) {
    this.preloadQueue.set(route, config);
    
    if (config.preloadOnIdle && config.priority === 'high') {
      this.scheduleIdlePreload(route);
    }
  }

  /**
   * Faz preload de uma rota específica
   */
  async preload(route: string): Promise<void> {
    if (this.preloadedRoutes.has(route)) {
      return; // Já carregado
    }

    const config = this.preloadQueue.get(route);
    if (!config) {
      return;
    }

    try {
      await config.component();
      this.preloadedRoutes.add(route);
      console.log(`✅ Preloaded route: ${route}`);
    } catch (error) {
      console.warn(`⚠️ Failed to preload route ${route}:`, error);
    }
  }

  /**
   * Preload on hover (para links)
   */
  preloadOnHover(route: string) {
    return {
      onMouseEnter: () => this.preload(route),
      onTouchStart: () => this.preload(route),
    };
  }

  /**
   * Agenda preload durante idle time
   */
  private scheduleIdlePreload(route: string) {
    if (typeof requestIdleCallback === 'undefined') {
      // Fallback para navegadores sem suporte
      setTimeout(() => this.preload(route), 2000);
      return;
    }

    this.idleCallbackId = requestIdleCallback(
      () => {
        this.preload(route);
      },
      { timeout: 5000 }
    );
  }

  /**
   * Preload de rotas por prioridade
   */
  preloadByPriority(priority: PreloadPriority) {
    const routes = Array.from(this.preloadQueue.entries())
      .filter(([_, config]) => config.priority === priority)
      .map(([route]) => route);

    routes.forEach(route => this.preload(route));
  }

  /**
   * Limpa recursos
   */
  cleanup() {
    if (this.idleCallbackId !== null) {
      cancelIdleCallback(this.idleCallbackId);
    }
  }
}

export const routePreloader = new RoutePreloader();

/**
 * Hook React para preload
 */
export const useRoutePreloader = () => {
  return {
    preload: (route: string) => routePreloader.preload(route),
    preloadOnHover: (route: string) => routePreloader.preloadOnHover(route),
  };
};

export default routePreloader;
