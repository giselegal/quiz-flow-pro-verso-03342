/**
 * 🔗 MAPEAMENTO DE IDS: Templates JSON <-> Supabase
 * 
 * PROBLEMA IDENTIFICADO:
 * - Templates JSON têm IDs string: "quiz21StepsComplete"
 * - Supabase gera UUIDs aleatórios
 * - Sem pareamento = impossível fazer queries diretas
 * 
 * SOLUÇÃO:
 * - UUIDs fixos conhecidos para cada template
 * - Mapeamento bidirecional JSON ID <-> UUID
 * - Seeds SQL com IDs fixos (ver 20251125_seed_templates_paired.sql)
 */

export const TEMPLATE_UUID_MAP = {
  // Template principal: Quiz 21 Steps Complete
  'quiz21StepsComplete': '00000000-0000-0000-0000-000000000001',
  
  // Aliases/variações
  'quiz21-complete': '00000000-0000-0000-0000-000000000001',
  'quiz21': '00000000-0000-0000-0000-000000000001',
} as const;

export const FUNNEL_UUID_MAP = {
  // Funnel pareado com quiz21StepsComplete
  'quiz21StepsComplete': '00000000-0000-0000-0000-000000000101',
  'quiz21-complete': '00000000-0000-0000-0000-000000000101',
  'quiz21': '00000000-0000-0000-0000-000000000101',
} as const;

// Reverse mapping: UUID -> JSON ID
export const UUID_TO_TEMPLATE_MAP = Object.entries(TEMPLATE_UUID_MAP).reduce(
  (acc, [key, value]) => {
    if (!acc[value]) acc[value] = key;
    return acc;
  },
  {} as Record<string, string>
);

export const UUID_TO_FUNNEL_MAP = Object.entries(FUNNEL_UUID_MAP).reduce(
  (acc, [key, value]) => {
    if (!acc[value]) acc[value] = key;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Converte ID de template JSON para UUID do Supabase
 * @example getTemplateUUID('quiz21StepsComplete') // '00000000-0000-0000-0000-000000000001'
 */
export function getTemplateUUID(jsonId: string): string | null {
  return TEMPLATE_UUID_MAP[jsonId as keyof typeof TEMPLATE_UUID_MAP] || null;
}

/**
 * Converte ID de template JSON para UUID do funnel pareado
 * @example getFunnelUUID('quiz21StepsComplete') // '00000000-0000-0000-0000-000000000101'
 */
export function getFunnelUUID(jsonId: string): string | null {
  return FUNNEL_UUID_MAP[jsonId as keyof typeof FUNNEL_UUID_MAP] || null;
}

/**
 * Converte UUID do Supabase para ID do template JSON
 * @example getTemplateJSONId('00000000-0000-0000-0000-000000000001') // 'quiz21StepsComplete'
 */
export function getTemplateJSONId(uuid: string): string | null {
  return UUID_TO_TEMPLATE_MAP[uuid] || null;
}

/**
 * Converte UUID do funnel para ID do template JSON
 * @example getFunnelJSONId('00000000-0000-0000-0000-000000000101') // 'quiz21StepsComplete'
 */
export function getFunnelJSONId(uuid: string): string | null {
  return UUID_TO_FUNNEL_MAP[uuid] || null;
}

/**
 * Valida se um ID é um template conhecido
 */
export function isKnownTemplate(id: string): boolean {
  return id in TEMPLATE_UUID_MAP || id in UUID_TO_TEMPLATE_MAP;
}

/**
 * Valida se um UUID é um funnel conhecido
 */
export function isKnownFunnel(uuid: string): boolean {
  return uuid in UUID_TO_FUNNEL_MAP;
}

/**
 * Retorna todos os templates conhecidos
 */
export function getKnownTemplates(): Array<{ jsonId: string; uuid: string; funnelUuid: string }> {
  return Object.entries(TEMPLATE_UUID_MAP)
    .filter(([key]) => !key.includes('-')) // Remove aliases
    .map(([jsonId, uuid]) => ({
      jsonId,
      uuid,
      funnelUuid: FUNNEL_UUID_MAP[jsonId as keyof typeof FUNNEL_UUID_MAP] || 'N/A',
    }));
}

// Type helpers
export type TemplateJSONId = keyof typeof TEMPLATE_UUID_MAP;
export type TemplateUUID = typeof TEMPLATE_UUID_MAP[TemplateJSONId];
export type FunnelUUID = typeof FUNNEL_UUID_MAP[TemplateJSONId];
