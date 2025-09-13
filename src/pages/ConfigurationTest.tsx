/**
 * 🎯 TESTE SIMPLES DO SISTEMA DE CONFIGURAÇÃO
 * 
 * Página de teste para verificar se o sistema está funcionando
 */

import { useEffect, useState } from 'react';
import { configurationService } from '@/services/ConfigurationService';
import { useConfiguration } from '@/hooks/useConfiguration';

interface ConfigTest {
    serviceFunctional: boolean;
    hookFunctional: boolean;
    configLoaded: boolean;
    errors: string[];
}

export default function ConfigurationTest() {
    const [testResults, setTestResults] = useState<ConfigTest>({
        serviceFunctional: false,
        hookFunctional: false,
        configLoaded: false,
        errors: []
    });

    // Teste do hook
    const { config, isLoading, error } = useConfiguration({
        funnelId: 'quiz21StepsComplete'
    });

    useEffect(() => {
        const runTests = async () => {
            const results: ConfigTest = {
                serviceFunctional: false,
                hookFunctional: false,
                configLoaded: false,
                errors: []
            };

            try {
                // Teste 1: Verificar se o serviço existe
                if (configurationService) {
                    results.serviceFunctional = true;
                    console.log('✅ ConfigurationService carregado');
                }

                // Teste 2: Verificar se consegue carregar configuração
                try {
                    const testConfig = await configurationService.getConfiguration({
                        funnelId: 'quiz21StepsComplete',
                        environment: 'development'
                    });

                    if (testConfig) {
                        results.configLoaded = true;
                        console.log('✅ Configuração carregada:', testConfig);
                    }
                } catch (err) {
                    results.errors.push(`Erro ao carregar config: ${err}`);
                }

                // Teste 3: Verificar hook
                if (!isLoading && !error && config) {
                    results.hookFunctional = true;
                    console.log('✅ Hook funcionando:', config);
                } else if (error) {
                    results.errors.push(`Erro no hook: ${error}`);
                }

            } catch (err) {
                results.errors.push(`Erro geral: ${err}`);
            }

            setTestResults(results);
        };

        runTests();
    }, [config, isLoading, error]);

    return (
        <div style={{
            padding: '20px',
            fontFamily: 'monospace',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <h1>🔧 Teste do Sistema de Configuração</h1>

            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #ddd'
            }}>
                <h2>Status dos Testes</h2>

                <div style={{ marginBottom: '10px' }}>
                    <span style={{
                        color: testResults.serviceFunctional ? 'green' : 'red',
                        fontWeight: 'bold'
                    }}>
                        {testResults.serviceFunctional ? '✅' : '❌'} ConfigurationService
                    </span>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <span style={{
                        color: testResults.configLoaded ? 'green' : 'red',
                        fontWeight: 'bold'
                    }}>
                        {testResults.configLoaded ? '✅' : '❌'} Carregamento de Config
                    </span>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <span style={{
                        color: testResults.hookFunctional ? 'green' : 'red',
                        fontWeight: 'bold'
                    }}>
                        {testResults.hookFunctional ? '✅' : '❌'} Hook useConfiguration
                    </span>
                </div>
            </div>

            {testResults.errors.length > 0 && (
                <div style={{
                    backgroundColor: '#ffebee',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #f44336'
                }}>
                    <h2>❌ Erros Encontrados</h2>
                    {testResults.errors.map((error, index) => (
                        <div key={index} style={{ color: 'red', marginBottom: '5px' }}>
                            • {error}
                        </div>
                    ))}
                </div>
            )}

            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #ddd'
            }}>
                <h2>Status do Hook</h2>
                <p><strong>Loading:</strong> {isLoading ? 'Sim' : 'Não'}</p>
                <p><strong>Error:</strong> {error || 'Nenhum'}</p>
                <p><strong>Config loaded:</strong> {config ? 'Sim' : 'Não'}</p>
            </div>

            {config && (
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                }}>
                    <h2>Configuração Carregada</h2>
                    <pre style={{
                        background: '#f8f8f8',
                        padding: '10px',
                        borderRadius: '4px',
                        overflow: 'auto',
                        maxHeight: '400px'
                    }}>
                        {JSON.stringify(config, null, 2)}
                    </pre>
                </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <a
                    href="/"
                    style={{
                        background: '#007acc',
                        color: 'white',
                        padding: '10px 20px',
                        textDecoration: 'none',
                        borderRadius: '4px'
                    }}
                >
                    ← Voltar ao Quiz
                </a>
            </div>
        </div>
    );
}
