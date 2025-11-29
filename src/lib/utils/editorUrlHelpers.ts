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
  const url = new URL(`${baseUrl.replace(/\/$/, '')}/editor`);

  const sanitize = (value: any): string | undefined => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      if (value === '[object Object]') return undefined;
      return value.trim();
    }
    if (typeof value === 'object') {
      // Tentar extrair id comum
      const idCandidate = (value as any).id || (value as any).slug || (value as any).name;
      if (typeof idCandidate === 'string' && idCandidate.length > 0) return idCandidate.trim();
      const coerced = String(value);
      if (coerced === '[object Object]') return undefined;
      return coerced;
    }
    const coerced = String(value);
    if (coerced === '[object Object]') return undefined;
    return coerced;
  };

  const funnelId = sanitize(params.funnelId);
  const templateId = sanitize(params.template);
  const stage = sanitize(params.stage);

  if (funnelId) url.searchParams.set('funnel', funnelId);
  if (templateId) url.searchParams.set('template', templateId);
  if (stage) url.searchParams.set('stage', stage);
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
  let changed = false;

  const sanitize = (value: any): string | undefined => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      if (value === '[object Object]') return undefined;
      return value.trim();
    }
    if (typeof value === 'object') {
      const idCandidate = (value as any).id || (value as any).slug || (value as any).name;
      if (typeof idCandidate === 'string' && idCandidate.length > 0) return idCandidate.trim();
      const coerced = String(value);
      if (coerced === '[object Object]') return undefined;
      return coerced;
    }
    const coerced = String(value);
    if (coerced === '[object Object]') return undefined;
    return coerced;
  };

  const funnelId = sanitize(params.funnelId);
  const templateId = sanitize(params.template);
  const stage = sanitize(params.stage);

  if (funnelId) {
    const prev = currentUrl.searchParams.get('funnel');
    if (prev !== funnelId) {
      currentUrl.searchParams.set('funnel', funnelId);
      changed = true;
    }
  }

  if (templateId) {
    const prev = currentUrl.searchParams.get('template');
    if (prev !== templateId) {
      currentUrl.searchParams.set('template', templateId);
      changed = true;
    }
  }

  if (stage) {
    const prev = currentUrl.searchParams.get('stage');
    if (prev !== stage) {
      currentUrl.searchParams.set('stage', stage);
      changed = true;
    }
  }

  if (params.preview !== undefined) {
    const prev = currentUrl.searchParams.get('preview') === 'true';
    if (prev !== params.preview) {
      if (params.preview) {
        currentUrl.searchParams.set('preview', 'true');
      } else {
        currentUrl.searchParams.delete('preview');
      }
      changed = true;
    }
  }

  if (params.viewport) {
    const prev = currentUrl.searchParams.get('viewport');
    if (prev !== params.viewport) {
      currentUrl.searchParams.set('viewport', params.viewport);
      changed = true;
    }
  }

  if (changed) {
    window.history.pushState({}, '', currentUrl.toString());
  }
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
    withTemplate: 'https://quiz-quest-challenge-verse.vercel.app/editor?funnel=funil-21-etapas',
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
