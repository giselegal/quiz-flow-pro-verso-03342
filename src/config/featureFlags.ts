// Flags de recurso para restringir rotas e definir o funil ativo do editor

export const ACTIVE_FUNNEL_ID: string =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ACTIVE_FUNNEL_ID) || 'production';

// Quando true, rotas /admin e /dashboard são desativadas e /editor redireciona para o funil ativo
export const RESTRICT_TO_ACTIVE_FUNNEL: boolean =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_RESTRICT_TO_ACTIVE_FUNNEL === 'true') || true;
