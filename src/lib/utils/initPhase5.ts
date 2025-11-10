/**
 * 🎯 INICIALIZADOR DA FASE 5
 * 
 * Este script inicializa os dados simulados da Fase 5 no navegador
 * quando executado, garantindo que o dashboard tenha dados para exibir.
 * 
 * Execute este script no console do navegador ou importe onde necessário.
 */

import { initializePhase5Data, getPhase5Data } from '../services/phase5DataSimulator';
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
            appLogger.info('📊 Dados carregados:', { data: [{
                            funnels: data.funnels?.length || 0,
                            users: data.users?.length || 0,
                            sessions: data.sessions?.length || 0,
                            responses: data.responses?.length || 0,
                            results: data.results?.length || 0,
                        }] });
            return data;
        }

        // Inicializar dados novos
        appLogger.info('📦 Criando novos dados da Fase 5...');
        const data = initializePhase5Data();

        appLogger.info('🎉 Fase 5 inicializada com sucesso!');
        appLogger.info('📈 Métricas disponíveis:');
        appLogger.info(`   • ${(data as any).sessions?.filter((s: any) => s.status === 'completed').length || 0} sessões completas`);
        appLogger.info(`   • ${(data as any).sessions?.filter((s: any) => s.status === 'active').length || 0} sessões ativas`);
        appLogger.info(`   • ${Math.round((((data as any).sessions?.filter((s: any) => s.status === 'completed').length || 0) / ((data as any).sessions?.length || 1)) * 100)}% taxa de conclusão`);
        appLogger.info(`   • ${(data as any).results?.length || 0} resultados de quiz`);

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