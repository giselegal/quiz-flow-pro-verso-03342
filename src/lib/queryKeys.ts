export const queryKeys = {
  funnels: {
    all: ['funnels'] as const,
    details: () => ['funnels', 'detail'] as const,
    detail: (id: string) => ['funnels', 'detail', id] as const,
  },
  templates: {
    all: ['templates'] as const,
    details: () => ['templates', 'detail'] as const,
    detail: (id: string) => ['templates', 'detail', id] as const,
  },
  steps: {
    all: ['steps'] as const,
    byFunnel: (funnelId: string) => ['steps', 'funnel', funnelId] as const,
    detail: (id: string) => ['steps', 'detail', id] as const,
  },
} as const;

export const funnelKeys = queryKeys.funnels;
export const templateKeys = queryKeys.templates;
export const stepKeys = queryKeys.steps;
