/**
 * 🚀 EXEMPLO DE USO - SISTEMA DE STORAGE AVANÇADO
 * 
 * Este arquivo demonstra como usar o novo sistema de storage
 * baseado em IndexedDB em substituição ao localStorage.
 */

import { funnelLocalStore } from '@/services/funnelLocalStore'; // Usando o novo adapter
import { funnelSyncService } from '@/services/FunnelSyncService';
import { runMigrationTests } from '@/services/__tests__/FunnelStorageMigrationTests';

// ============================================================================
// EXEMPLO 1: USO BÁSICO (COMPATIBILIDADE TOTAL)
// ============================================================================

export async function exemploUsoBasico() {
    console.log('🔥 Exemplo 1: Uso Básico');

    // ✅ API SÍNCRONA (mantida para compatibilidade)
    const funnelsSincronos = funnelLocalStore.list();
    console.log('Funis síncronos:', funnelsSincronos.length);

    // Criar novo funil (síncrono)
    const novoFunil = {
        id: `funil-${Date.now()}`,
        name: 'Meu Novo Funil',
        status: 'draft' as const,
        url: 'https://meunovofu nil.com',
        updatedAt: new Date().toISOString()
    };

    funnelLocalStore.upsert(novoFunil);
    console.log('✅ Funil criado (sync)');

    // ✅ API ASSÍNCRONA (recomendada)
    const funnelsAssincronos = await funnelLocalStore.listAsync();
    console.log('Funis assíncronos:', funnelsAssincronos.length);

    // Atualizar funil (assíncrono)
    await funnelLocalStore.upsertAsync({
        ...novoFunil,
        name: 'Funil Atualizado',
        status: 'published'
    });
    console.log('✅ Funil atualizado (async)');
}

// ============================================================================
// EXEMPLO 2: GERENCIAMENTO DE CONFIGURAÇÕES
// ============================================================================

export async function exemploConfiguracoes() {
    console.log('🔥 Exemplo 2: Configurações');

    const funnelId = 'exemplo-config-123';

    // Configurações padrão
    const configPadrao = funnelLocalStore.defaultSettings();
    console.log('Config padrão:', configPadrao.name);

    // Personalizar configurações
    const configPersonalizada = {
        ...configPadrao,
        name: 'Quiz Personalizado',
        seo: {
            title: 'Descubra Seu Estilo Único',
            description: 'Um quiz personalizado para descobrir seu estilo pessoal'
        },
        pixel: 'FB_PIXEL_123456',
        utm: {
            source: 'facebook',
            medium: 'cpc',
            campaign: 'quiz-personalizado'
        },
        custom: {
            collectUserName: true,
            variables: [
                { key: 'moderno', label: 'Moderno', scoringWeight: 0.8 },
                { key: 'classico', label: 'Clássico', scoringWeight: 0.6 },
                { key: 'boho', label: 'Bohemian', scoringWeight: 0.9 }
            ]
        }
    };

    // Salvar (síncrono)
    funnelLocalStore.saveSettings(funnelId, configPersonalizada);

    // Ou salvar (assíncrono - recomendado)
    await funnelLocalStore.saveSettingsAsync(funnelId, configPersonalizada);

    // Recuperar
    const configSalva = await funnelLocalStore.getSettingsAsync(funnelId);
    console.log('✅ Config salva:', configSalva.name);
}

// ============================================================================
// EXEMPLO 3: INFORMAÇÕES DO SISTEMA
// ============================================================================

export async function exemploInformacoesStorage() {
    console.log('🔥 Exemplo 3: Informações do Storage');

    const info = await funnelLocalStore.getStorageInfo();

    console.log('📊 Storage Info:', {
        totalFunnels: info.totalFunnels,
        totalSettings: info.totalSettings,
        estimatedSize: `${(info.estimatedSize / 1024).toFixed(2)} KB`,
        storageType: info.storageType, // 'indexedDB' or 'localStorage'
        migrationStatus: info.migrationStatus
    });

    if (info.storageType === 'localStorage') {
        console.warn('⚠️  Usando localStorage - considere migrar para IndexedDB');
    }
}

// ============================================================================
// EXEMPLO 4: MIGRAÇÃO MANUAL
// ============================================================================

export async function exemploMigracaoManual() {
    console.log('🔥 Exemplo 4: Migração Manual');

    // Verificar se migração é necessária
    const info = await funnelLocalStore.getStorageInfo();

    if (info.migrationStatus === 'pending') {
        console.log('🔄 Iniciando migração...');

        const resultado = await funnelLocalStore.performMigration();

        if (resultado.success) {
            console.log('✅ Migração completa!', resultado.message);
        } else {
            console.error('❌ Migração falhou:', resultado.message);
        }
    } else {
        console.log('ℹ️  Migração não necessária');
    }
}

// ============================================================================
// EXEMPLO 5: BACKUP E RESTORE
// ============================================================================

export async function exemploBackupRestore() {
    console.log('🔥 Exemplo 5: Backup e Restore');

    // Criar backup
    const resultadoBackup = await funnelLocalStore.createBackup();

    if (resultadoBackup.success && resultadoBackup.backup) {
        console.log('✅ Backup criado com sucesso');

        // Salvar backup em arquivo ou servidor
        const backupData = resultadoBackup.backup;
        console.log(`📦 Backup size: ${(backupData.length / 1024).toFixed(2)} KB`);

        // Exemplo: salvar em arquivo
        const blob = new Blob([backupData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        console.log('💾 Download backup:', url);

        // Em um cenário real, você poderia fazer download:
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = `funnel-backup-${new Date().toISOString().split('T')[0]}.json`;
        // a.click();

        // Simular restore (CUIDADO: isso apaga todos os dados!)
        // const resultadoRestore = await funnelLocalStore.restoreFromBackup(backupData);
        // console.log('Restore:', resultadoRestore.message);

    } else {
        console.error('❌ Falha no backup:', resultadoBackup.message);
    }
}

// ============================================================================
// EXEMPLO 6: SINCRONIZAÇÃO SERVER-SIDE (OPCIONAL)
// ============================================================================

export async function exemploSincronizacao() {
    console.log('🔥 Exemplo 6: Sincronização Server-Side');

    // Configurar sincronização (exemplo - ajustar conforme sua API)
    funnelSyncService.initialize({
        endpoint: 'https://api.exemplo.com/funnel-sync',
        apiKey: 'sua-api-key-aqui',
        userId: 'user-123',
        autoSync: true,
        syncInterval: 5 * 60 * 1000, // 5 minutos
        retryAttempts: 3,
        conflictResolution: 'merge' // ou 'server', 'local', 'ask'
    });

    // Status da sincronização
    const status = funnelSyncService.getStatus();
    console.log('📡 Sync Status:', {
        isOnline: status.isOnline,
        queueSize: status.queueSize,
        lastSync: status.lastSync,
        nextSyncIn: `${Math.round(status.nextSyncIn / 1000)}s`
    });

    // Sincronização manual
    if (status.queueSize > 0) {
        console.log('🔄 Executando sync manual...');
        const resultado = await funnelSyncService.forcSync();
        console.log('✅ Sync completo:', {
            syncedFunnels: resultado.syncedFunnels,
            syncedSettings: resultado.syncedSettings,
            conflicts: resultado.conflicts.length
        });
    }

    // Backup no servidor
    const backupResult = await funnelSyncService.createServerBackup();
    if (backupResult.success) {
        console.log('☁️ Backup no servidor:', backupResult.backupId);
    }
}

// ============================================================================
// EXEMPLO 7: OPERAÇÕES AVANÇADAS EM LOTE
// ============================================================================

export async function exemploOperacoesLote() {
    console.log('🔥 Exemplo 7: Operações em Lote');

    // Criar vários funis de uma vez
    const funisParaCriar = Array.from({ length: 10 }, (_, i) => ({
        id: `lote-funil-${i}`,
        name: `Funil Lote ${i + 1}`,
        status: i % 2 === 0 ? 'draft' as const : 'published' as const,
        url: `https://funil-lote-${i}.com`,
        updatedAt: new Date().toISOString()
    }));

    // Método 1: Sequential (mais lento)
    console.time('Sequential');
    for (const funil of funisParaCriar) {
        await funnelLocalStore.upsertAsync(funil);
    }
    console.timeEnd('Sequential');

    // Método 2: Parallel (mais rápido)
    const funisParaCriar2 = funisParaCriar.map((f, i) => ({
        ...f,
        id: `lote-funil-paralelo-${i}`,
        name: `Funil Paralelo ${i + 1}`
    }));

    console.time('Parallel');
    await Promise.all(
        funisParaCriar2.map(funil => funnelLocalStore.upsertAsync(funil))
    );
    console.timeEnd('Parallel');

    // Listar todos
    const todosFunis = await funnelLocalStore.listAsync();
    console.log(`✅ Total de funis: ${todosFunis.length}`);

    // Filtrar por status
    const funisPublicados = todosFunis.filter(f => f.status === 'published');
    const funisRascunho = todosFunis.filter(f => f.status === 'draft');

    console.log(`📊 Publicados: ${funisPublicados.length}, Rascunhos: ${funisRascunho.length}`);
}

// ============================================================================
// EXEMPLO 8: TRATAMENTO DE ERROS
// ============================================================================

export async function exemploTratamentoErros() {
    console.log('🔥 Exemplo 8: Tratamento de Erros');

    try {
        // Operação que pode falhar
        await funnelLocalStore.upsertAsync({
            id: 'teste-erro',
            name: 'Funil de Teste',
            status: 'draft',
            updatedAt: new Date().toISOString()
        });

        console.log('✅ Operação bem-sucedida');

    } catch (error) {
        console.warn('⚠️  Falha na operação IndexedDB, tentando localStorage...');

        // Fallback automático para localStorage
        try {
            funnelLocalStore.upsert({
                id: 'teste-erro',
                name: 'Funil de Teste',
                status: 'draft',
                updatedAt: new Date().toISOString()
            });

            console.log('✅ Fallback para localStorage funcionou');

        } catch (fallbackError) {
            console.error('❌ Falha completa no storage:', fallbackError);

            // Aqui você poderia notificar o usuário ou tentar outras estratégias
            alert('Erro ao salvar dados. Por favor, tente novamente.');
        }
    }
}

// ============================================================================
// EXEMPLO 9: TESTES AUTOMATIZADOS
// ============================================================================

export async function exemploTestes() {
    console.log('🔥 Exemplo 9: Testes Automatizados');

    try {
        // Executar todos os testes
        await runMigrationTests();
        console.log('✅ Todos os testes passaram!');
    } catch (error) {
        console.error('❌ Alguns testes falharam:', error);
    }
}

// ============================================================================
// EXEMPLO 10: LIMPEZA E RESET
// ============================================================================

export async function exemploLimpezaReset() {
    console.log('🔥 Exemplo 10: Limpeza e Reset');

    // ATENÇÃO: Isso apaga TODOS os dados!
    const confirmacao = 'RESET_ALL_FUNNEL_DATA';

    // Verificar se usuário realmente quer fazer isso
    const confirmarReset = false; // Mude para true apenas se tiver certeza

    if (confirmarReset) {
        console.log('⚠️  RESETANDO TODOS OS DADOS...');

        const resultado = await funnelLocalStore.resetAllData(confirmacao);

        if (resultado.success) {
            console.log('✅ Reset completo:', resultado.message);
        } else {
            console.error('❌ Falha no reset:', resultado.message);
        }
    } else {
        console.log('ℹ️  Reset não executado (confirmarReset = false)');
    }
}

// ============================================================================
// FUNÇÃO PRINCIPAL - EXECUTAR TODOS OS EXEMPLOS
// ============================================================================

export async function executarTodosExemplos() {
    console.log('🚀 EXEMPLOS DO SISTEMA DE STORAGE AVANÇADO\n');

    try {
        await exemploUsoBasico();
        console.log(''); // Linha em branco

        await exemploConfiguracoes();
        console.log('');

        await exemploInformacoesStorage();
        console.log('');

        await exemploMigracaoManual();
        console.log('');

        await exemploBackupRestore();
        console.log('');

        // await exemploSincronizacao(); // Descomentag se tiver servidor configurado
        // console.log('');

        await exemploOperacoesLote();
        console.log('');

        await exemploTratamentoErros();
        console.log('');

        // await exemploTestes(); // Descomente para executar testes
        // console.log('');

        // await exemploLimpezaReset(); // CUIDADO: Apaga todos os dados!

        console.log('🎉 Todos os exemplos executados com sucesso!');

    } catch (error) {
        console.error('💥 Erro ao executar exemplos:', error);
    }
}

// ============================================================================
// EXECUTAR AUTOMATICAMENTE EM DESENVOLVIMENTO
// ============================================================================

if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('🔧 Executando exemplos em modo desenvolvimento...');

    // Aguardar um pouco para garantir que a página carregou
    setTimeout(() => {
        executarTodosExemplos();
    }, 2000);

    // Disponibilizar funções globalmente para teste manual
    (window as any).exemplosFunnelStorage = {
        exemploUsoBasico,
        exemploConfiguracoes,
        exemploInformacoesStorage,
        exemploMigracaoManual,
        exemploBackupRestore,
        exemploSincronizacao,
        exemploOperacoesLote,
        exemploTratamentoErros,
        exemploTestes,
        exemploLimpezaReset,
        executarTodosExemplos
    };

    console.log('🎮 Exemplos disponíveis em: window.exemplosFunnelStorage');
}
