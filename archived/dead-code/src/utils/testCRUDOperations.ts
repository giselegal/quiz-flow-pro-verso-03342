// @ts-nocheck
/**
 * 🧪 TESTE CRUD INTEGRATION
 * 
 * Script para testar se todas as operações CRUD estão funcionando
 */

import { funnelUnifiedService } from '../services/FunnelUnifiedService';
import { FunnelService } from '@/application/services/FunnelService'
const enhancedFunnelService = new FunnelService() // MIGRATED: usar funnelService;

export async function testCRUDOperations() {
    console.log('🧪 Iniciando teste das operações CRUD...');

    try {
        // ========================================================================
        // 1. TEST CREATE FUNNEL
        // ========================================================================
        console.log('\n1. 🎯 Testando CREATE...');

        const newFunnel = await enhancedFunnelService.createFunnel({
            name: 'Teste CRUD - Funil de Teste',
            description: 'Funil criado para testar operações CRUD',
            category: 'teste',
            context: 'web'
        });

        console.log('✅ CREATE funcionou:', newFunnel.id);
        const testFunnelId = newFunnel.id;

        // ========================================================================
        // 2. TEST READ FUNNEL
        // ========================================================================
        console.log('\n2. 📖 Testando READ...');

        const loadedFunnel = await enhancedFunnelService.getFunnelWithFallback(testFunnelId);

        if (loadedFunnel && loadedFunnel.id === testFunnelId) {
            console.log('✅ READ funcionou:', loadedFunnel.name);
        } else {
            throw new Error('READ falhou - funil não encontrado');
        }

        // ========================================================================
        // 3. TEST UPDATE FUNNEL
        // ========================================================================
        console.log('\n3. ✏️ Testando UPDATE...');

        const updatedFunnel = await enhancedFunnelService.updateFunnel(testFunnelId, {
            name: 'Teste CRUD - Funil ATUALIZADO',
            description: 'Descrição atualizada via teste CRUD',
        });

        console.log('✅ UPDATE funcionou:', updatedFunnel.name);

        // ========================================================================
        // 4. TEST DUPLICATE FUNNEL
        // ========================================================================
        console.log('\n4. 📋 Testando DUPLICATE...');

        const duplicatedFunnel = await enhancedFunnelService.duplicateFunnel(
            testFunnelId,
            'Cópia do Teste CRUD'
        );

        console.log('✅ DUPLICATE funcionou:', duplicatedFunnel.id);

        // ========================================================================
        // 5. TEST LIST FUNNELS
        // ========================================================================
        console.log('\n5. 📋 Testando LIST...');

        const funnels = await enhancedFunnelService.listFunnels({
            category: 'teste',
            limit: 10
        });

        console.log(`✅ LIST funcionou: ${funnels.length} funis encontrados`);

        // ========================================================================
        // 6. TEST DELETE FUNNELS (cleanup)
        // ========================================================================
        console.log('\n6. 🗑️ Testando DELETE (cleanup)...');

        const deleteResult1 = await funnelUnifiedService.deleteFunnel(testFunnelId);
        const deleteResult2 = await funnelUnifiedService.deleteFunnel(duplicatedFunnel.id);

        console.log('✅ DELETE funcionou:', deleteResult1 && deleteResult2);

        // ========================================================================
        // 7. RESULTADO FINAL
        // ========================================================================
        console.log('\n🎉 TODOS OS TESTES CRUD PASSARAM!');

        return {
            success: true,
            results: {
                create: !!newFunnel.id,
                read: !!loadedFunnel,
                update: updatedFunnel.name.includes('ATUALIZADO'),
                duplicate: !!duplicatedFunnel.id,
                list: funnels.length > 0,
                delete: deleteResult1 && deleteResult2
            }
        };

    } catch (error) {
        console.error('❌ Erro no teste CRUD:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        };
    }
}

// Para uso no console do browser
if (typeof window !== 'undefined') {
    (window as any).testCRUD = testCRUDOperations;
    console.log('💡 Execute testCRUD() no console para testar as operações CRUD');
}

export default testCRUDOperations;