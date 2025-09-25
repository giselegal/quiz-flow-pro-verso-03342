/**
 * 🎯 INICIALIZADOR DA FASE 5
 * 
 * Este script inicializa os dados simulados da Fase 5 no navegador
 * quando executado, garantindo que o dashboard tenha dados para exibir.
 * 
 * Execute este script no console do navegador ou importe onde necessário.
 */

import { initializePhase5Data, getPhase5Data } from './phase5DataSimulator';

export function initPhase5() {
    try {
        console.log('🚀 Inicializando Fase 5...');

        // Verificar se já existem dados
        const existingData = localStorage.getItem('phase5_simulated_data');
        if (existingData) {
            console.log('✅ Dados da Fase 5 já existem. Carregando...');
            const data = getPhase5Data();
            console.log('📊 Dados carregados:', {
                funnels: data.funnels?.length || 0,
                users: data.users?.length || 0,
                sessions: data.sessions?.length || 0,
                responses: data.responses?.length || 0,
                results: data.results?.length || 0
            });
            return data;
        }

        // Inicializar dados novos
        console.log('📦 Criando novos dados da Fase 5...');
        const data = initializePhase5Data();

        console.log('🎉 Fase 5 inicializada com sucesso!');
        console.log('📈 Métricas disponíveis:');
        console.log(`   • ${data.sessions?.filter(s => s.status === 'completed').length || 0} sessões completas`);
        console.log(`   • ${data.sessions?.filter(s => s.status === 'active').length || 0} sessões ativas`);
        console.log(`   • ${Math.round(((data.sessions?.filter(s => s.status === 'completed').length || 0) / (data.sessions?.length || 1)) * 100)}% taxa de conclusão`);
        console.log(`   • ${data.results?.length || 0} resultados de quiz`);

        console.log('✨ Dashboard agora tem dados reais para exibir!');
        return data;

    } catch (error) {
        console.error('💥 Erro ao inicializar Fase 5:', error);
        throw error;
    }
}

// Auto-inicializar se este módulo for importado
// (comentado para controle manual)
// initPhase5();

export default initPhase5;