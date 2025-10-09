/**
 * 🎯 UNIFIED ROUTING SERVICE
 * 
 * Serviço para navegação unificada entre admin/dashboard/editor
 * Elimina redirecionamentos desnecessários e cria fluxo fluido
 */

export interface UnifiedRoute {
    path: string;
    component: string;
    title: string;
    description: string;
    icon?: string;
    protected?: boolean;
    breadcrumbs?: Array<{ label: string; path: string }>;
}

export interface NavigationContext {
    currentRoute: string;
    previousRoute?: string;
    returnTo?: string;
    params?: Record<string, string>;
}

class UnifiedRoutingServiceImpl {
    private navigationHistory: string[] = [];
    private currentContext: NavigationContext | null = null;

    // ========================================================================
    // UNIFIED ROUTE DEFINITIONS
    // ========================================================================

    private readonly routes: Record<string, UnifiedRoute> = {
        // ADMIN DASHBOARD ROUTES
        '/admin/dashboard': {
            path: '/admin/dashboard',
            component: 'AdminDashboard',
            title: 'Dashboard Administrativo',
            description: 'Visão geral das métricas e KPIs',
            icon: 'BarChart3',
            protected: true,
            breadcrumbs: [{ label: 'Admin', path: '/admin/dashboard' }]
        },

        '/admin/funnels': {
            path: '/admin/funnels',
            component: 'MeusFunisPageReal',
            title: 'Gerenciar Funis',
            description: 'Lista e gerenciamento de todos os funis',
            icon: 'Target',
            protected: true,
            breadcrumbs: [
                { label: 'Admin', path: '/admin/dashboard' },
                { label: 'Funis', path: '/admin/funnels' }
            ]
        },

        '/admin/funnels/:id/edit': {
            path: '/admin/funnels/:id/edit',
            component: 'ModernUnifiedEditor',
            title: 'Editar Funil',
            description: 'Editor integrado para modificar funil',
            icon: 'Edit',
            protected: true,
            breadcrumbs: [
                { label: 'Admin', path: '/admin/dashboard' },
                { label: 'Funis', path: '/admin/funnels' },
                { label: 'Editar', path: '#' }
            ]
        },

        '/admin/analytics': {
            path: '/admin/analytics',
            component: 'AnalyticsPage',
            title: 'Analytics Avançados',
            description: 'Métricas detalhadas e insights',
            icon: 'Activity',
            protected: true,
            breadcrumbs: [
                { label: 'Admin', path: '/admin/dashboard' },
                { label: 'Analytics', path: '/admin/analytics' }
            ]
        },

        // STANDALONE EDITOR ROUTES
        '/editor': {
            path: '/editor',
            component: 'ModernUnifiedEditor',
            title: 'Editor Visual',
            description: 'Editor visual independente',
            icon: 'Layout',
            breadcrumbs: [{ label: 'Editor', path: '/editor' }]
        },

        '/editor/:id': {
            path: '/editor/:id',
            component: 'ModernUnifiedEditor',
            title: 'Editar Funil',
            description: 'Editor visual para funil específico',
            icon: 'Edit',
            breadcrumbs: [
                { label: 'Editor', path: '/editor' },
                { label: 'Funil', path: '#' }
            ]
        }
    };

    // ========================================================================
    // NAVIGATION METHODS
    // ========================================================================

    /**
     * Navega para uma rota unificada com contexto
     */
    navigate(path: string, options?: {
        replace?: boolean;
        returnTo?: string;
        params?: Record<string, string>;
    }): void {
        const { replace = false, returnTo, params } = options || {};

        // Atualizar histórico
        if (!replace) {
            this.navigationHistory.push(path);
            if (this.navigationHistory.length > 20) {
                this.navigationHistory.shift();
            }
        }

        // Atualizar contexto
        this.currentContext = {
            currentRoute: path,
            previousRoute: this.getCurrentRoute(),
            returnTo,
            params
        };

        // Executar navegação (SPA) e notificar o router (wouter escuta 'popstate')
        if (replace) {
            window.history.replaceState(null, '', path);
        } else {
            window.history.pushState(null, '', path);
        }
        // Forçar atualização dos listeners de rota em SPAs que dependem de popstate
        try {
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (err) {
            // Fallback para ambientes que não suportam PopStateEvent diretamente
            const evt = document.createEvent('Event');
            evt.initEvent('popstate', false, false);
            window.dispatchEvent(evt);
        }

        console.log(`🧭 UnifiedRouting: Navegando para ${path}`, this.currentContext);
    }

    /**
     * Navega do admin para o editor mantendo contexto
     */
    navigateAdminToEditor(funnelId: string, returnToAdmin = true): void {
        const editorPath = `/admin/funnels/${funnelId}/edit`;

        this.navigate(editorPath, {
            returnTo: returnToAdmin ? '/admin/funnels' : undefined,
            params: { funnelId, mode: 'admin-integrated' }
        });
    }

    /**
     * Navega do editor de volta ao admin
     */
    navigateEditorToAdmin(funnelId?: string): void {
        const returnTo = this.currentContext?.returnTo;
        const adminPath = returnTo || (funnelId ? '/admin/funnels' : '/admin/dashboard');

        this.navigate(adminPath);
    }

    /**
     * Navega para editor standalone
     */
    navigateToStandaloneEditor(funnelId?: string): void {
        const editorPath = funnelId ? `/editor/${funnelId}` : '/editor';
        this.navigate(editorPath);
    }

    /**
     * Volta para a rota anterior
     */
    goBack(): void {
        if (this.navigationHistory.length > 1) {
            this.navigationHistory.pop(); // Remove current
            const previousPath = this.navigationHistory[this.navigationHistory.length - 1];
            this.navigate(previousPath, { replace: true });
        } else {
            this.navigate('/admin/dashboard');
        }
    }

    // ========================================================================
    // CONTEXT & STATE
    // ========================================================================

    /**
     * Retorna contexto de navegação atual
     */
    getNavigationContext(): NavigationContext | null {
        return this.currentContext;
    }

    /**
     * Retorna rota atual
     */
    getCurrentRoute(): string {
        return window.location.pathname;
    }

    /**
     * Retorna informações da rota atual
     */
    getCurrentRouteInfo(): UnifiedRoute | null {
        const currentPath = this.getCurrentRoute();
        return this.getRouteInfo(currentPath);
    }

    /**
     * Retorna informações de uma rota específica
     */
    getRouteInfo(path: string): UnifiedRoute | null {
        // Busca exata primeiro
        if (this.routes[path]) {
            return this.routes[path];
        }

        // Busca com parâmetros
        for (const [routePath, routeInfo] of Object.entries(this.routes)) {
            if (this.matchRoutePath(path, routePath)) {
                return routeInfo;
            }
        }

        return null;
    }

    /**
     * Retorna breadcrumbs para a rota atual
     */
    getCurrentBreadcrumbs(): Array<{ label: string; path: string }> {
        const routeInfo = this.getCurrentRouteInfo();
        return routeInfo?.breadcrumbs || [];
    }

    // ========================================================================
    // ROUTE UTILITIES
    // ========================================================================

    /**
     * Verifica se o caminho atual corresponde a um padrão de rota
     */
    private matchRoutePath(actualPath: string, routePattern: string): boolean {
        const actualParts = actualPath.split('/').filter(Boolean);
        const patternParts = routePattern.split('/').filter(Boolean);

        if (actualParts.length !== patternParts.length) {
            return false;
        }

        return patternParts.every((part, index) => {
            return part.startsWith(':') || part === actualParts[index];
        });
    }

    /**
     * Extrai parâmetros de uma rota
     */
    extractRouteParams(actualPath: string, routePattern: string): Record<string, string> {
        const actualParts = actualPath.split('/').filter(Boolean);
        const patternParts = routePattern.split('/').filter(Boolean);
        const params: Record<string, string> = {};

        patternParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                const paramName = part.slice(1);
                params[paramName] = actualParts[index] || '';
            }
        });

        return params;
    }

    // ========================================================================
    // INTEGRATION HELPERS
    // ========================================================================

    /**
     * Verifica se está em contexto admin
     */
    isInAdminContext(): boolean {
        return this.getCurrentRoute().startsWith('/admin/');
    }

    /**
     * Verifica se está no editor integrado ao admin
     */
    isInAdminIntegratedEditor(): boolean {
        const context = this.getNavigationContext();
        return context?.params?.mode === 'admin-integrated';
    }

    /**
     * Retorna URL para voltar ao admin se aplicável
     */
    getAdminReturnUrl(): string | null {
        if (this.isInAdminContext() || this.isInAdminIntegratedEditor()) {
            return this.currentContext?.returnTo || '/admin/dashboard';
        }
        return null;
    }

    /**
     * Gera URL de edição para um funil no contexto admin
     */
    getAdminEditUrl(funnelId: string): string {
        return `/admin/funnels/${funnelId}/edit`;
    }

    /**
     * Gera URL de edição standalone para um funil
     */
    getStandaloneEditUrl(funnelId: string): string {
        return `/editor/${funnelId}`;
    }

    // ========================================================================
    // PUBLIC UTILITIES
    // ========================================================================

    /**
     * Lista todas as rotas disponíveis
     */
    getAllRoutes(): UnifiedRoute[] {
        return Object.values(this.routes);
    }

    /**
     * Lista rotas por categoria
     */
    getRoutesByCategory(category: 'admin' | 'editor' | 'public'): UnifiedRoute[] {
        return Object.values(this.routes).filter(route => {
            switch (category) {
                case 'admin':
                    return route.path.startsWith('/admin/');
                case 'editor':
                    return route.path.startsWith('/editor');
                case 'public':
                    return !route.protected;
                default:
                    return false;
            }
        });
    }

    /**
     * Limpa histórico de navegação
     */
    clearNavigationHistory(): void {
        this.navigationHistory = [];
        this.currentContext = null;
        console.log('🧹 UnifiedRouting: Histórico de navegação limpo');
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const UnifiedRoutingService = new UnifiedRoutingServiceImpl();
export default UnifiedRoutingService;