import { supabase } from '@/integrations/supabase/client';
import { validateCanonicalDefinition } from '@/domain/quiz/validation/schemas';

export interface PublishedTemplateData {
    version: number;
    questions: any[];
    styles: any[];
    scoringMatrix?: any;
    variants?: any;
}

interface CacheEntry { data: PublishedTemplateData; cachedAt: number; }

const CACHE: Record<string, CacheEntry> = {};
const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutos

export async function fetchPublishedTemplate(templateId: string): Promise<PublishedTemplateData | null> {
    const { data, error } = await supabase
        .from('funnels')
        .select('id, version, settings')
        .eq('id', templateId)
        .maybeSingle();
    if (error || !data) return null;
    const settings: any = (data as any).settings || {};
    const payload = settings.payload_json || {};
    const validation = validateCanonicalDefinition(payload);
    if (!validation.success) {
        console.warn('[PublishedTemplateRuntimeService] payload inválido recebido; descartando', validation.error.flatten());
        return null;
    }
    return {
        version: (data as any).version || 1,
        questions: payload.questions || [],
        styles: payload.styles || [],
        scoringMatrix: settings.scoring_matrix || payload.scoringMatrix,
        variants: settings.variants_json || []
    };
}

export async function getPublishedTemplate(templateId: string, opts?: { force?: boolean }): Promise<PublishedTemplateData | null> {
    const force = opts?.force;
    const now = Date.now();
    const entry = CACHE[templateId];
    if (!force && entry && (now - entry.cachedAt) < MAX_AGE_MS) return entry.data;
    const fresh = await fetchPublishedTemplate(templateId);
    if (fresh) CACHE[templateId] = { data: fresh, cachedAt: now };
    return fresh;
}

export function clearPublishedTemplateCache(templateId?: string) {
    if (templateId) delete CACHE[templateId];
    else Object.keys(CACHE).forEach(k => delete CACHE[k]);
}
