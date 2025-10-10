/**
 * 🌐 EDITOR URL HELPERS
 * Funções para construir e gerenciar URLs do editor
 */

export interface EditorUrlParams {
  funnelId?: string;
  template?: string;
  stage?: string;
  preview?: boolean;
  viewport?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Constrói URL completa para o editor
 */
export const buildEditorUrl = (baseUrl: string, params: EditorUrlParams = {}): string => {
  const url = new URL(`${baseUrl}/editor`);

  if (params.funnelId) url.searchParams.set('funnel', params.funnelId);
  if (params.template) url.searchParams.set('template', params.template);
  if (params.stage) url.searchParams.set('stage', params.stage);
  if (params.preview) url.searchParams.set('preview', 'true');
  if (params.viewport) url.searchParams.set('viewport', params.viewport);

  return url.toString();
};

/**
 * Parse parâmetros da URL atual
 */
export const parseEditorUrl = (): EditorUrlParams => {
  const urlParams = new URLSearchParams(window.location.search);

  return {
    funnelId: urlParams.get('funnel') || undefined,
    template: urlParams.get('template') || undefined,
    stage: urlParams.get('stage') || undefined,
    preview: urlParams.get('preview') === 'true',
    viewport: (urlParams.get('viewport') as 'sm' | 'md' | 'lg' | 'xl') || undefined,
  };
};

/**
 * Atualiza URL atual sem reload da página
 */
export const updateEditorUrl = (params: EditorUrlParams): void => {
  const currentUrl = new URL(window.location.href);

  if (params.funnelId) currentUrl.searchParams.set('funnel', params.funnelId);
  if (params.template) currentUrl.searchParams.set('template', params.template);
  if (params.stage) currentUrl.searchParams.set('stage', params.stage);
  if (params.preview !== undefined) {
    if (params.preview) {
      currentUrl.searchParams.set('preview', 'true');
    } else {
      currentUrl.searchParams.delete('preview');
    }
  }
  if (params.viewport) currentUrl.searchParams.set('viewport', params.viewport);

  window.history.pushState({}, '', currentUrl.toString());
};

/**
 * 📋 EXEMPLOS DE USO
 */
export const EDITOR_URL_EXAMPLES = {
  // Desenvolvimento local
  local: {
    // Usa a origem atual quando no browser; fallback para 5173 em ambientes de build/teste
    get base() {
      return typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'http://localhost:5173';
    },
    get basic() {
      return buildEditorUrl(this.base);
    },
    get withFunnel() {
      return buildEditorUrl(this.base, { funnelId: 'quiz-estilo-2024' });
    },
    get withTemplate() {
      return buildEditorUrl(this.base, { template: 'quiz-personalidade' });
    },
    get fullConfig() {
      // viewport válido: 'sm' (mobile), 'md', 'lg', 'xl'
      return buildEditorUrl(this.base, {
        funnelId: 'test',
        template: 'quiz-estilo',
        stage: 'step-5',
        preview: true,
        viewport: 'sm',
      });
    },
  },

  // Produção
  production: {
    basic: 'https://quiz-quest-challenge-verse.vercel.app/editor',
    withFunnel: 'https://quiz-quest-challenge-verse.vercel.app/editor?funnel=cliente-123',
    withTemplate: 'https://quiz-quest-challenge-verse.vercel.app/editor?template=funil-21-etapas',
  },

  // Casos específicos
  useCases: {
    newQuizStyleFunnel: (userId: string) =>
      buildEditorUrl(
        (typeof window !== 'undefined' && window.location?.origin) || 'http://localhost:5173',
        { funnelId: `user-${userId}-quiz-estilo`, template: 'quiz-estilo' },
      ),

    editSpecificStage: (funnelId: string, stage: number) =>
      buildEditorUrl(
        (typeof window !== 'undefined' && window.location?.origin) || 'http://localhost:5173',
        { funnelId, stage: `step-${stage}` },
      ),

    mobilePreview: (funnelId: string) =>
      buildEditorUrl(
        (typeof window !== 'undefined' && window.location?.origin) || 'http://localhost:5173',
        { funnelId, preview: true, viewport: 'sm' },
      ),
  },
};

/**
 * 🚀 FUNCTIONS FOR PROGRAMMATIC NAVIGATION
 */
export const editorNavigation = {
  // Navegar para funil específico
  goToFunnel: (funnelId: string) => {
    updateEditorUrl({ funnelId });
  },

  // Navegar para etapa específica
  goToStage: (stage: string) => {
    updateEditorUrl({ stage });
  },

  // Toggle preview mode
  togglePreview: () => {
    const current = parseEditorUrl();
    updateEditorUrl({ preview: !current.preview });
  },

  // Mudar viewport
  setViewport: (viewport: 'sm' | 'md' | 'lg' | 'xl') => {
    updateEditorUrl({ viewport });
  },
};
