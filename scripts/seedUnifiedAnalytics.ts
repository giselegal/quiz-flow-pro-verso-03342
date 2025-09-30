import { getSupabase } from '@/supabase/config';
import { UnifiedEventType } from '@/analytics/types';

/**
 * Script de seed para gerar dados sintéticos na tabela unified_events.
 * Objetivos de distribuição:
 * - ~1000 sessões
 * - Conversão ~68%
 * - Abandono concentrado nos steps 3,7,12,18
 * - Estilos (5 categorias) distribuídos
 * - Devices: desktop 55%, mobile 35%, tablet 10%
 */

interface SyntheticSessionConfig {
    totalSessions: number;
    funnelId: string;
    steps: string[]; // step ids
    styleCategories: string[];
}

const config: SyntheticSessionConfig = {
    totalSessions: 1000,
    funnelId: 'quiz-main',
    steps: Array.from({ length: 21 }, (_, i) => `step_${i + 1}`),
    styleCategories: ['Classico', 'Moderno', 'Boho', 'Urbano', 'Romantico']
};

function random<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function chance(p: number): boolean { return Math.random() < p; }

function pickDevice(): { type: 'desktop' | 'mobile' | 'tablet'; os: string; browser: string } {
    const r = Math.random();
    if (r < 0.55) return { type: 'desktop', os: 'macOS', browser: 'Chrome' };
    if (r < 0.90) return { type: 'mobile', os: 'Android', browser: 'Chrome' };
    return { type: 'tablet', os: 'iOS', browser: 'Safari' };
}

function generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function generateUserId(): string | null {
    // 15% anônimo
    return chance(0.15) ? null : `user_${Math.floor(Math.random() * 500)}`;
}

interface RawEvent {
    occurred_at: string;
    session_id: string;
    user_id: string | null;
    funnel_id: string;
    step_id: string | null;
    event_type: UnifiedEventType;
    payload: any;
    device: any;
    ctx: any;
    source: string;
    version: number;
}

export async function runSeed() {
    const supabase = getSupabase();
    if (!supabase) {
        console.error('Supabase não configurado. Abortando seed.');
        return;
    }

    const sessions = config.totalSessions;
    const allEvents: RawEvent[] = [];
    const now = Date.now();

    for (let i = 0; i < sessions; i++) {
        const sessionId = generateSessionId();
        const userId = generateUserId();
        const device = pickDevice();
        const ctx = { locale: 'pt-BR', utm: undefined };
        const style = random(config.styleCategories);

        const startOffset = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // dentro de 7d
        let cursor = new Date(now - startOffset);

        const pushEvent = (type: UnifiedEventType, stepIndex: number | null, payload: any) => {
            allEvents.push({
                occurred_at: cursor.toISOString(),
                session_id: sessionId,
                user_id: userId,
                funnel_id: config.funnelId,
                step_id: stepIndex != null ? config.steps[stepIndex] : null,
                event_type: type,
                payload,
                device,
                ctx,
                source: 'seed',
                version: 1
            });
        };

        // session_start
        pushEvent('session_start', null, {});
        pushEvent('quiz_started', 0, {});

        let abandoned = false;
        let completed = false;

        for (let s = 0; s < config.steps.length; s++) {
            cursor = new Date(cursor.getTime() + Math.floor(Math.random() * 8000) + 2000); // 2-10s
            pushEvent('step_viewed', s, {});
            // Abandono em steps específicos com maior peso
            if ([2, 6, 11, 17].includes(s)) { // (0-based index correspondendo a 3,7,12,18)
                if (chance([2, 6, 11, 17].indexOf(s) === 0 ? 0.12 : [2, 6, 11, 17].indexOf(s) === 1 ? 0.10 : [2, 6, 11, 17].indexOf(s) === 2 ? 0.08 : 0.06)) {
                    abandoned = true; break;
                }
            }
            // answer event (simular question_answered)
            pushEvent('question_answered', s, { answer: `option_${(s % 4) + 1}` });
        }

        if (!abandoned) {
            // completion
            cursor = new Date(cursor.getTime() + 3000);
            pushEvent('quiz_completed', config.steps.length - 1, { style, totalScore: Math.floor(Math.random() * 100) });
            pushEvent('conversion', config.steps.length - 1, { style });
            completed = true;
        }
        cursor = new Date(cursor.getTime() + 1000);
        pushEvent('session_end', null, { completed, style: completed ? style : undefined });
    }

    console.log(`[Seed] Gerados ${allEvents.length} eventos. Inserindo em lotes...`);

    const chunkSize = 500;
    for (let i = 0; i < allEvents.length; i += chunkSize) {
        const slice = allEvents.slice(i, i + chunkSize);
        const { error } = await supabase.from('unified_events').insert(slice);
        if (error) {
            console.error('Erro ao inserir chunk', error);
            break;
        }
    }

    console.log('[Seed] Concluído.');
}

// Execução direta (node + ts via ts-node ou transpile) - aqui apenas se ambiente suportar.
if (import.meta?.env?.MODE !== 'test') {
    // Evitar execução automática em runtime de build; usuário chama manualmente se desejar.
}
