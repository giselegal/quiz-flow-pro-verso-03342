/**
 * 🎯 CONSTANTES DO EDITOR - Fonte Única de Verdade
 * 
 * REGRA: funnelId deve SEMPRE ser passado via props, nunca hardcoded.
 * Use NO_FUNNEL_ID para indicar canvas em branco/novo funil.
 */

/** Indica que não há funil carregado (canvas em branco) */
export const NO_FUNNEL_ID = '';

/** Validar se um funnelId é válido (não vazio) */
export const isValidFunnelId = (funnelId: string | undefined): funnelId is string => {
  return typeof funnelId === 'string' && funnelId.trim().length > 0 && funnelId !== NO_FUNNEL_ID;
};

/** Obter funnelId ou fallback seguro */
export const getFunnelIdOrEmpty = (funnelId: string | undefined): string => {
  return isValidFunnelId(funnelId) ? funnelId : NO_FUNNEL_ID;
};
