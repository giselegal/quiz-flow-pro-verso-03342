/**
 * 🎯 INICIALIZADOR DA FASE 5
 * 
 * Este script inicializa os dados simulados da Fase 5 no navegador
 * quando executado, garantindo que o dashboard tenha dados para exibir.
 * 
 * Execute este script no console do navegador ou importe onde necessário.
 */

import { initializePhase5Data, getPhase5Data } from '@/lib/services/phase5DataSimulator';
import { StorageService } from '@/services/core/StorageService';
import { appLogger } from '@/lib/utils/appLogger';

export function initPhase5() {
    try {
        appLogger.info('🚀 Inicializando Fase 5...');

        // Verificar se já existem dados
        const existingData = StorageService.safeGetString('phase5_simulated_data');
        if (existingData) {
            appLogger.info('✅ Dados da Fase 5 já existem. Carregando...');
            const data = getPhase5Data();
            // Estrutura simulada minimal - campos podem não existir no stub
            appLogger.info('📊 Dados carregados (simulado):', { data: [data] });
            return data;
        }

        // Inicializar dados novos
        appLogger.info('📦 Criando novos dados da Fase 5...');
        const data = initializePhase5Data();

        appLogger.info('🎉 Fase 5 inicializada com sucesso!');
        appLogger.info('📈 Métricas disponíveis:');
    const sessions = (data as any).sessions || [];
    const results = (data as any).results || [];
    const completed = sessions.filter((s: any) => s?.status === 'completed').length;
    const active = sessions.filter((s: any) => s?.status === 'active').length;
    const completionRate = Math.round((completed / Math.max(sessions.length, 1)) * 100);
    appLogger.info(`   • ${completed} sessões completas`);
    appLogger.info(`   • ${active} sessões ativas`);
    appLogger.info(`   • ${completionRate}% taxa de conclusão`);
    appLogger.info(`   • ${results.length} resultados de quiz`);

        appLogger.info('✨ Dashboard agora tem dados reais para exibir!');
        return data;

    } catch (error) {
        appLogger.error('💥 Erro ao inicializar Fase 5:', { data: [error] });
        throw error;
    }
}

// Auto-inicializar se este módulo for importado
// (comentado para controle manual)
// initPhase5();

export default initPhase5;