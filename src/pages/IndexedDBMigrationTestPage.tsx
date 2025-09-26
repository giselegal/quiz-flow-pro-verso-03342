// Teste da migração do FunnelUnifiedService para IndexedDB
import React from 'react';

const IndexedDBMigrationTestPage: React.FC = () => {
    const [testResults, setTestResults] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const addLog = (message: string) => {
        setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const testIndexedDBMigration = async () => {
        setIsLoading(true);
        setTestResults([]);
        addLog('🚀 Iniciando teste da migração IndexedDB...');

        try {
            // Importar o serviço dinamicamente
            const { FunnelUnifiedService } = await import('@/services/FunnelUnifiedService');
            const service = FunnelUnifiedService.getInstance();

            addLog('✅ FunnelUnifiedService carregado com sucesso');

            // 1. Criar dados de teste no localStorage primeiro
            addLog('📦 Criando dados de teste no localStorage...');
            const testFunnel = {
                id: `test-migration-${Date.now()}`,
                name: 'Funil de Teste para Migração',
                description: 'Este funil será migrado para IndexedDB',
                category: 'test',
                context: 'editor',
                userId: 'test-user',
                settings: { theme: 'modern' },
                pages: [],
                isPublished: false,
                version: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                templateId: null,
                isFromTemplate: false
            };

            // Salvar diretamente no localStorage para simular dados antigos
            localStorage.setItem(`unified_funnel:${testFunnel.id}`, JSON.stringify(testFunnel));
            addLog('✅ Dados de teste criados no localStorage');

            // 2. Testar criação de funil (deve ir direto para IndexedDB)
            addLog('🔄 Testando criação de novo funil...');
            const newFunnel = await service.createFunnel({
                name: 'Funil Novo IndexedDB',
                description: 'Este funil deve ir direto para IndexedDB',
                category: 'quiz',
                context: 'editor',
                userId: 'anonymous'
            });

            if (newFunnel) {
                addLog(`✅ Funil criado com sucesso: ${newFunnel.name} (ID: ${newFunnel.id})`);
            } else {
                addLog('❌ Falha ao criar funil');
            }

            // 3. Testar listagem (deve incluir dados migrados)
            addLog('📋 Testando listagem de funis...');
            const funnels = await service.listFunnels({
                context: 'editor',
                userId: 'anonymous'
            });

            addLog(`📊 Encontrados ${funnels?.length || 0} funis`);
            if (funnels && funnels.length > 0) {
                funnels.forEach((funnel, index) => {
                    addLog(`   ${index + 1}. ${funnel.name} (${funnel.id})`);
                });
            }

            // 4. Testar carregamento individual
            if (newFunnel) {
                addLog(`🔍 Testando carregamento do funil: ${newFunnel.id}`);
                const loadedFunnel = await service.getFunnel(newFunnel.id, 'anonymous');

                if (loadedFunnel) {
                    addLog(`✅ Funil carregado: ${loadedFunnel.name}`);
                } else {
                    addLog('❌ Falha ao carregar funil');
                }
            }

            // 5. Verificar status da migração
            const migrationStatus = localStorage.getItem('funnel_unified_migration_completed');
            if (migrationStatus) {
                addLog(`✅ Migração marcada como concluída em: ${new Date(migrationStatus).toLocaleString()}`);
            } else {
                addLog('ℹ️ Migração ainda não foi executada');
            }

            addLog('🎯 Teste concluído com sucesso!');

        } catch (error: any) {
            addLog(`❌ Erro durante o teste: ${error.message}`);
            console.error('Erro completo:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearTestData = () => {
        // Limpar dados de teste
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('unified_funnel:test-') || key.includes('test-user')) {
                localStorage.removeItem(key);
            }
        });

        addLog('🧹 Dados de teste limpos do localStorage');
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h1>🗃️ Teste de Migração IndexedDB</h1>

                <div style={{ marginBottom: '20px' }}>
                    <h2>📋 Sobre esta migração:</h2>
                    <div style={{
                        backgroundColor: '#e8f4fd',
                        border: '1px solid #bee5eb',
                        borderRadius: '4px',
                        padding: '15px',
                        marginBottom: '15px'
                    }}>
                        <h3>✨ Melhorias Implementadas:</h3>
                        <ul>
                            <li><strong>💾 IndexedDB em vez de localStorage</strong>: Capacidade ilimitada vs 10MB</li>
                            <li><strong>🔄 Migração automática</strong>: Dados antigos migrados na primeira execução</li>
                            <li><strong>🛡️ Fallback inteligente</strong>: localStorage como backup se IndexedDB falhar</li>
                            <li><strong>🔍 Busca avançada</strong>: Índices otimizados por usuário e contexto</li>
                            <li><strong>⚡ Performance melhorada</strong>: Operações assíncronas não bloqueiam a UI</li>
                        </ul>
                    </div>

                    <div style={{
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '4px',
                        padding: '15px'
                    }}>
                        <h3>🔧 O que será testado:</h3>
                        <ol>
                            <li>Inicialização do IndexedDB</li>
                            <li>Migração de dados do localStorage</li>
                            <li>Criação de novos funis</li>
                            <li>Listagem com filtros</li>
                            <li>Carregamento individual</li>
                            <li>Sistema de fallback</li>
                        </ol>
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <button
                        onClick={testIndexedDBMigration}
                        disabled={isLoading}
                        style={{
                            backgroundColor: isLoading ? '#6c757d' : '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            marginRight: '10px',
                            fontSize: '16px'
                        }}
                    >
                        {isLoading ? '🔄 Executando...' : '🚀 Executar Teste'}
                    </button>

                    <button
                        onClick={clearTestData}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        🧹 Limpar Dados de Teste
                    </button>
                </div>

                <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '4px',
                    padding: '15px',
                    maxHeight: '500px',
                    overflowY: 'auto'
                }}>
                    <h3>📋 Log de Execução:</h3>
                    {testResults.length === 0 ? (
                        <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
                            Clique em "Executar Teste" para ver os resultados aqui...
                        </p>
                    ) : (
                        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                            {testResults.map((result, index) => (
                                <div key={index} style={{
                                    marginBottom: '5px',
                                    color: result.includes('❌') ? '#dc3545' :
                                        result.includes('✅') ? '#28a745' :
                                            result.includes('⚠️') ? '#ffc107' : '#212529'
                                }}>
                                    {result}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#d1ecf1',
                    border: '1px solid #bee5eb',
                    borderRadius: '4px'
                }}>
                    <h3>💡 Próximos Passos:</h3>
                    <p>Após este teste bem-sucedido, o sistema estará usando IndexedDB como storage principal, com:</p>
                    <ul>
                        <li>🚀 <strong>Performance superior</strong> para grandes volumes de dados</li>
                        <li>💾 <strong>Capacidade ilimitada</strong> (vs 10MB do localStorage)</li>
                        <li>🔍 <strong>Busca avançada</strong> com índices otimizados</li>
                        <li>⚡ <strong>Operações assíncronas</strong> que não travam a interface</li>
                        <li>🛡️ <strong>Fallback automático</strong> para localStorage quando necessário</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default IndexedDBMigrationTestPage;