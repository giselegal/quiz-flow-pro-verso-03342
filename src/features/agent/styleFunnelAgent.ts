import { unifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';
import { calculateAndSaveQuizResult } from '@/lib/utils/quizResultCalculator';
import { CloudAgentService } from '@/services/cloud/CloudAgentService';
import { appLogger } from '@/lib/utils/appLogger';

export type AgentTargetStyle =
    | 'natural'
    | 'classico'
    | 'contemporaneo'
    | 'elegante'
    | 'romantico'
    | 'sexy'
    | 'dramatico'
    | 'criativo';

export interface RunAgentOptions {
    userName?: string;
    targetStyle?: AgentTargetStyle;
    multiPerQuestion?: number; // 1 a 3
    forceLocal?: boolean; // Força execução local mesmo se cloud estiver disponível
}

/**
 * Executa um funil de teste totalmente automatizado (sem UI).
 * 
 * Por padrão, delega a execução ao agente de nuvem (Supabase Edge Function)
 * quando disponível, com fallback automático para execução local.
 *
 * Estratégia: gerar seleções com prefixos de estilo (ex.: "natural_q1_a"),
 * o que ativa o caminho prefix-based do ResultOrchestrator.
 */
export async function runStyleFunnelAgent(opts: RunAgentOptions = {}) {
    // 🌐 DELEGAÇÃO AO AGENTE DE NUVEM
    // Tenta executar na nuvem primeiro, se disponível e não forçado local
    if (!opts.forceLocal && CloudAgentService.isAvailable()) {
        try {
            appLogger.info('☁️ Delegando ao agente de nuvem...');
            const cloudResult = await CloudAgentService.runStyleFunnelAgent({
                userName: opts.userName,
                targetStyle: opts.targetStyle,
                multiPerQuestion: opts.multiPerQuestion,
            });
            
            // Sincronizar resultado com o storage local para compatibilidade
            if (cloudResult.result) {
                unifiedQuizStorage.saveResult(cloudResult.result);
            }
            
            appLogger.info('✅ Execução delegada ao agente de nuvem completada');
            return {
                userName: cloudResult.userName,
                targetStyle: cloudResult.targetStyle,
                stats: cloudResult.stats,
                result: cloudResult.result,
                executedOn: 'cloud' as const,
            };
        } catch (error) {
            appLogger.warn('⚠️ Falha ao executar agente de nuvem, usando fallback local', { data: [error] });
            // Continua para execução local
        }
    }
    
    // 💻 EXECUÇÃO LOCAL (fallback ou forçado)
    appLogger.info('💻 Executando agente localmente...');
    const userName = (opts.userName || 'Agente de Teste').trim();
    const target: AgentTargetStyle = opts.targetStyle || 'natural';
    const picksPerQuestion = Math.min(Math.max(opts.multiPerQuestion ?? 1, 1), 3);

    // 1) Reset e hidratação inicial
    try { unifiedQuizStorage.clearAll(); } catch { /* noop */ }
    unifiedQuizStorage.updateFormData('userName', userName);

    // 2) Gerar seleções para as 10 questões que pontuam (q1..q10 => etapas 2..11)
    const selectionsByQuestion: Record<string, string[]> = {};
    for (let i = 1; i <= 10; i++) {
        const q = `q${i}`;
        const sel: string[] = [];
        for (let k = 0; k < picksPerQuestion; k++) {
            // IDs fictícios, mas com prefixo de estilo reconhecido pelo orquestrador
            sel.push(`${target}_q${i}_${String.fromCharCode(97 + k)}`);
        }
        selectionsByQuestion[q] = sel;
        // Persistir também no unified para compatibilidade visual com DevResultDebug
        try { unifiedQuizStorage.updateSelections(q, sel); } catch { /* noop */ }
    }

    // 3) Marcar progresso (19/20) para simular avanço
    unifiedQuizStorage.updateProgress(19);

    // 4) Calcular resultado pelo pipeline existente
    const payload = await calculateAndSaveQuizResult();

    // 5) Retornar snapshot do estado/resultados
    const snapshot = unifiedQuizStorage.loadData();
    return {
        userName,
        targetStyle: target,
        stats: unifiedQuizStorage.getDataStats(),
        result: payload || snapshot.result || null,
        executedOn: 'local' as const,
    } as const;
}

export default runStyleFunnelAgent;
