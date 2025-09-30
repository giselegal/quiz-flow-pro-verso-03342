import { useCallback } from 'react';

/**
 * Centraliza operações CRUD usadas pelo ModernUnifiedEditor.
 * Recebe o contexto CRUD e parâmetros dinâmicos e retorna handlers estáveis.
 */
export interface UnifiedCRUDLike {
    saveFunnel: () => Promise<void>;
    createFunnel: (name: string, meta?: any) => Promise<any>;
    duplicateFunnel: (id: string, name?: string) => Promise<any>;
    currentFunnel?: { id: string } | null;
}

export function useEditorCrudOperations(crudContext: UnifiedCRUDLike, opts: { templateId?: string; funnelId?: string }) {
    const { templateId, funnelId } = opts;

    const handleSave = useCallback(async () => {
        const DEBUG = (import.meta as any)?.env?.VITE_EDITOR_DEBUG === 'true';
        if (DEBUG) console.log('💾 Salvando via UnifiedCRUD...');
        await crudContext.saveFunnel();
        if (DEBUG) console.log('✅ Salvo com sucesso via UnifiedCRUD');
    }, [crudContext]);

    const handleCreateNew = useCallback(async () => {
        const DEBUG = (import.meta as any)?.env?.VITE_EDITOR_DEBUG === 'true';
        if (DEBUG) console.log('🎯 Criando novo funil via UnifiedCRUD...');
        await crudContext.createFunnel('Novo Funil', { templateId });
        if (DEBUG) console.log('✅ Novo funil criado via UnifiedCRUD');
    }, [crudContext, templateId]);

    const handleDuplicate = useCallback(async () => {
        const targetId = funnelId || crudContext.currentFunnel?.id;
        if (!targetId) throw new Error('ID do funil necessário para duplicar');
        const DEBUG = (import.meta as any)?.env?.VITE_EDITOR_DEBUG === 'true';
        if (DEBUG) console.log('📋 Duplicando funil via UnifiedCRUD:', targetId);
        await crudContext.duplicateFunnel(targetId, 'Cópia de Funil');
        if (DEBUG) console.log('✅ Funil duplicado via UnifiedCRUD');
    }, [funnelId, crudContext]);

    const handleTestCRUD = useCallback(async () => {
        const DEBUG = (import.meta as any)?.env?.VITE_EDITOR_DEBUG === 'true';
        if (DEBUG) console.log('🧪 Executando testes CRUD...');
        try {
            const mod = await import('@/utils/testCRUDOperations');
            const results = await mod.default();
            if (results.success) {
                if (DEBUG) console.log('🎉 Todos os testes CRUD passaram!', results.results);
            } else {
                if (DEBUG) console.error('❌ Falha nos testes CRUD:', results.error);
            }
        } catch (error) {
            if (DEBUG) console.error('❌ Erro ao executar testes:', error);
        }
    }, [crudContext]);

    return { handleSave, handleCreateNew, handleDuplicate, handleTestCRUD };
}
