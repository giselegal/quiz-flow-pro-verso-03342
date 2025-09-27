/**
 * 🔍 DIAGNÓSTICO DE GARGALOS ADMIN/DASHBOARD
 * 
 * Script para identificar problemas funcionais específicos
 */

import { UnifiedDataService } from '@/services/core/UnifiedDataService';
import { UnifiedRoutingService } from '@/services/core/UnifiedRoutingService';
import { EditorDashboardSyncService } from '@/services/core/EditorDashboardSyncService';

console.log('🔍 INICIANDO DIAGNÓSTICO DE GARGALOS...');

// ============================================================================
// TESTE 1: UnifiedDataService
// ============================================================================

console.log('\n📊 TESTANDO UnifiedDataService...');

try {
    const dataService = UnifiedDataService;
    console.log('✅ UnifiedDataService instanciado');

    // Testar método básico
    if (typeof dataService.getDashboardMetrics === 'function') {
        console.log('✅ getDashboardMetrics existe');

        dataService.getDashboardMetrics()
            .then(metrics => {
                console.log('✅ getDashboardMetrics funcionou:', metrics);
            })
            .catch(error => {
                console.log('❌ getDashboardMetrics erro:', error.message);
            });
    } else {
        console.log('❌ getDashboardMetrics não existe');
    }
} catch (error) {
    console.log('❌ UnifiedDataService erro:', error.message);
}

// ============================================================================
// TESTE 2: UnifiedRoutingService
// ============================================================================

console.log('\n🧭 TESTANDO UnifiedRoutingService...');

try {
    const routingService = UnifiedRoutingService;
    console.log('✅ UnifiedRoutingService instanciado');

    const routeInfo = routingService.getCurrentRouteInfo();
    console.log('✅ getCurrentRouteInfo:', routeInfo);

    const isValidRoute = routingService.isValidAdminRoute('/admin/dashboard');
    console.log('✅ isValidAdminRoute:', isValidRoute);
} catch (error) {
    console.log('❌ UnifiedRoutingService erro:', error.message);
}

// ============================================================================
// TESTE 3: EditorDashboardSyncService
// ============================================================================

console.log('\n🔄 TESTANDO EditorDashboardSyncService...');

try {
    const syncService = EditorDashboardSyncService;
    console.log('✅ EditorDashboardSyncService instanciado');

    const syncStats = syncService.getSyncStats();
    console.log('✅ getSyncStats:', syncStats);
} catch (error) {
    console.log('❌ EditorDashboardSyncService erro:', error.message);
}

// ============================================================================
// TESTE 4: Verificar APIs externas
// ============================================================================

console.log('\n🌐 TESTANDO CONECTIVIDADE EXTERNA...');

// Teste Supabase (se disponível)
try {
    const { supabase } = await import('@/integrations/supabase/client');
    console.log('✅ Supabase client importado');

    const { data, error } = await supabase.from('quiz_templates').select('count').limit(1);
    if (error) {
        console.log('❌ Supabase conectividade erro:', error.message);
    } else {
        console.log('✅ Supabase funcionando:', data);
    }
} catch (error) {
    console.log('❌ Supabase import/teste erro:', error.message);
}

// ============================================================================
// TESTE 5: Verificar componentes principais
// ============================================================================

console.log('\n🧩 TESTANDO COMPONENTES PRINCIPAIS...');

const componentsToTest = [
    '@/components/admin/UnifiedAdminLayout',
    '@/pages/dashboard/AdminDashboard',
    '@/components/dashboard/RealTimeDashboard'
];

for (const component of componentsToTest) {
    try {
        await import(component);
        console.log(`✅ ${component} importado com sucesso`);
    } catch (error) {
        console.log(`❌ ${component} erro:`, error.message);
    }
}

console.log('\n🏁 DIAGNÓSTICO COMPLETO!');

export const runDiagnostic = async () => {
    console.log('Diagnóstico executado via export');
};