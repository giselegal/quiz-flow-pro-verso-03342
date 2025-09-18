import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { funnelLocalStore } from '@/services/funnelLocalStore';
import { useLocation } from 'wouter';
import { RefreshCw, Download, Trash2, Play, Bug, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface DebugLog {
    timestamp: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

export const FunnelSystemDebugger: React.FC = () => {
    const [, setLocation] = useLocation();
    const [logs, setLogs] = useState<DebugLog[]>([]);
    const [systemStatus, setSystemStatus] = useState<{
        localStorage: boolean;
        funnelsCount: number;
        lastError?: string;
    }>({ localStorage: false, funnelsCount: 0 });

    const addLog = (message: string, type: DebugLog['type'] = 'info') => {
        const log: DebugLog = {
            timestamp: new Date().toLocaleTimeString(),
            message,
            type
        };
        setLogs(prev => [...prev, log]);
        console.log(`[${log.timestamp}] ${message}`);
    };

    const checkSystemStatus = () => {
        addLog('🔍 Verificando status do sistema...', 'info');

        try {
            // Verificar localStorage
            const hasLocalStorage = typeof (Storage) !== "undefined";

            // Verificar lista de funis
            const funnels = funnelLocalStore.list();

            setSystemStatus({
                localStorage: hasLocalStorage,
                funnelsCount: funnels.length
            });

            if (hasLocalStorage) {
                addLog('✅ LocalStorage suportado', 'success');
            } else {
                addLog('❌ LocalStorage não suportado', 'error');
            }

            addLog(`📊 Funis encontrados: ${funnels.length}`, funnels.length > 0 ? 'success' : 'warning');

            if (funnels.length > 0) {
                funnels.forEach((funnel, index) => {
                    addLog(`  ${index + 1}. ${funnel.name} (${funnel.status})`, 'info');
                });
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            addLog(`❌ Erro ao verificar sistema: ${errorMessage}`, 'error');
            setSystemStatus(prev => ({ ...prev, lastError: errorMessage }));
        }
    };

    const createTestFunnel = () => {
        addLog('🎨 Criando funil de teste...', 'info');

        try {
            const testFunnel = {
                id: `debug-test-${Date.now()}`,
                name: `Funil Debug ${new Date().toLocaleTimeString()}`,
                status: 'draft' as const,
                updatedAt: new Date().toISOString()
            };

            funnelLocalStore.upsert(testFunnel);
            addLog(`✅ Funil criado: ${testFunnel.name}`, 'success');
            addLog(`🆔 ID: ${testFunnel.id}`, 'info');

            // Verificar se foi salvo
            const verification = funnelLocalStore.get(testFunnel.id);
            if (verification) {
                addLog('✅ Verificação: funil salvo corretamente', 'success');
            } else {
                addLog('❌ Verificação: funil não encontrado após salvamento', 'error');
            }

            // Atualizar status
            checkSystemStatus();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            addLog(`❌ Erro ao criar funil: ${errorMessage}`, 'error');
        }
    };

    const testFunnelOperations = () => {
        addLog('🧪 Testando operações do funnelLocalStore...', 'info');

        try {
            // Teste 1: list()
            const funnels = funnelLocalStore.list();
            addLog(`📋 list(): ${funnels.length} funis`, 'success');

            // Teste 2: defaultSettings()
            const defaultSettings = funnelLocalStore.defaultSettings();
            addLog(`⚙️ defaultSettings(): ${Object.keys(defaultSettings).length} propriedades`, 'success');

            // Teste 3: Criar e buscar settings
            const testId = `test-settings-${Date.now()}`;
            funnelLocalStore.saveSettings(testId, defaultSettings);
            const retrievedSettings = funnelLocalStore.getSettings(testId);
            addLog(`💾 Settings save/get: ${retrievedSettings.name === defaultSettings.name ? 'OK' : 'FALHOU'}`,
                retrievedSettings.name === defaultSettings.name ? 'success' : 'error');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            addLog(`❌ Erro nos testes: ${errorMessage}`, 'error');
        }
    };

    const navigateToEditor = (funnelId?: string) => {
        if (funnelId) {
            addLog(`🎯 Navegando para editor com funil: ${funnelId}`, 'info');
            setLocation(`/editor?funnel=${encodeURIComponent(funnelId)}`);
        } else {
            addLog('🎯 Navegando para editor (novo funil)', 'info');
            setLocation('/editor');
        }
    };

    const exportDebugData = () => {
        addLog('📤 Exportando dados de debug...', 'info');

        const debugData = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            systemStatus,
            logs,
            localStorage: {} as Record<string, string | null>,
            funnels: funnelLocalStore.list()
        };

        // Coletar dados do localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('funnel') || key.includes('qqcv'))) {
                debugData.localStorage[key] = localStorage.getItem(key);
            }
        }

        const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `funnel-debug-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        addLog('✅ Dados exportados com sucesso', 'success');
    };

    const clearAllData = () => {
        if (window.confirm('⚠️ Isso vai limpar TODOS os dados de funis. Continuar?')) {
            addLog('🗑️ Limpando dados de funis...', 'warning');

            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('funnel') || key.includes('qqcv'))) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => localStorage.removeItem(key));
            addLog(`🗑️ ${keysToRemove.length} chaves removidas`, 'warning');

            checkSystemStatus();
        }
    };

    const getStatusIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            default: return <Bug className="w-4 h-4 text-blue-500" />;
        }
    };

    // Inicialização
    useEffect(() => {
        addLog('🚀 Painel de debug inicializado', 'info');
        checkSystemStatus();
    }, []);

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Bug className="w-8 h-8" />
                    Debug Panel - Sistema de Funis
                </h1>
                <div className="flex gap-2">
                    <Button onClick={checkSystemStatus} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Atualizar Status
                    </Button>
                    <Button onClick={() => setLocation('/admin')} variant="outline">
                        Voltar ao Admin
                    </Button>
                </div>
            </div>

            {/* Status do Sistema */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">LocalStorage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            {systemStatus.localStorage ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span>{systemStatus.localStorage ? 'Funcionando' : 'Erro'}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Funis Cadastrados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            {systemStatus.funnelsCount > 0 ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            )}
                            <span>{systemStatus.funnelsCount} funis</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Último Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            {systemStatus.lastError ? (
                                <>
                                    <XCircle className="w-5 h-5 text-red-500" />
                                    <span className="text-red-600 text-sm">{systemStatus.lastError}</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Sistema OK</span>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Ações de Teste */}
            <Card>
                <CardHeader>
                    <CardTitle>Testes e Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Button onClick={createTestFunnel} className="flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Criar Funil Teste
                        </Button>

                        <Button onClick={testFunnelOperations} variant="outline" className="flex items-center gap-2">
                            <Bug className="w-4 h-4" />
                            Testar Operações
                        </Button>

                        <Button onClick={exportDebugData} variant="outline" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Exportar Debug
                        </Button>

                        <Button onClick={clearAllData} variant="destructive" className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Limpar Dados
                        </Button>
                    </div>

                    {/* Lista de Funis */}
                    {systemStatus.funnelsCount > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Funis Disponíveis:</h3>
                            <div className="grid gap-2">
                                {funnelLocalStore.list().map((funnel) => (
                                    <div key={funnel.id} className="flex items-center justify-between p-3 bg-white rounded border">
                                        <div>
                                            <span className="font-medium">{funnel.name}</span>
                                            <Badge variant="secondary" className="ml-2">{funnel.status}</Badge>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => navigateToEditor(funnel.id)}
                                            className="flex items-center gap-1"
                                        >
                                            <Play className="w-3 h-3" />
                                            Editar
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Console de Logs */}
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Console de Debug</CardTitle>
                    <Button onClick={() => setLogs([])} variant="outline" size="sm">
                        Limpar Console
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
                        {logs.length === 0 ? (
                            <div className="text-gray-500">Nenhum log ainda...</div>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="flex items-start gap-2 mb-1">
                                    {getStatusIcon(log.type)}
                                    <span className="text-gray-400">[{log.timestamp}]</span>
                                    <span className={
                                        log.type === 'error' ? 'text-red-400' :
                                            log.type === 'warning' ? 'text-yellow-400' :
                                                log.type === 'success' ? 'text-green-400' :
                                                    'text-gray-300'
                                    }>
                                        {log.message}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FunnelSystemDebugger;
