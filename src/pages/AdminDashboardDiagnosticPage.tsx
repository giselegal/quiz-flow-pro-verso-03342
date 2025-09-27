/**
 * 🔍 PÁGINA DE DIAGNÓSTICO ADMIN/DASHBOARD
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface DiagnosticResult {
    test: string;
    status: 'success' | 'error' | 'warning';
    message: string;
    details?: any;
}

const AdminDashboardDiagnosticPage: React.FC = () => {
    const [results, setResults] = useState<DiagnosticResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const runDiagnostics = async () => {
        setIsRunning(true);
        const diagnosticResults: DiagnosticResult[] = [];

        // Teste 1: UnifiedDataService
        try {
            const { UnifiedDataService } = await import('@/services/core/UnifiedDataService');
            diagnosticResults.push({
                test: 'UnifiedDataService Import',
                status: 'success',
                message: 'Serviço importado com sucesso'
            });

            // Testar método
            try {
                const metrics = await UnifiedDataService.getDashboardMetrics();
                diagnosticResults.push({
                    test: 'UnifiedDataService.getDashboardMetrics()',
                    status: 'success',
                    message: 'Métricas carregadas',
                    details: metrics
                });
            } catch (error) {
                diagnosticResults.push({
                    test: 'UnifiedDataService.getDashboardMetrics()',
                    status: 'error',
                    message: (error as Error).message
                });
            }
        } catch (error) {
            diagnosticResults.push({
                test: 'UnifiedDataService Import',
                status: 'error',
                message: (error as Error).message
            });
        }

        // Teste 2: UnifiedRoutingService
        try {
            const { UnifiedRoutingService } = await import('@/services/core/UnifiedRoutingService');
            diagnosticResults.push({
                test: 'UnifiedRoutingService Import',
                status: 'success',
                message: 'Serviço importado com sucesso'
            });

            const routeInfo = UnifiedRoutingService.getCurrentRouteInfo();
            diagnosticResults.push({
                test: 'UnifiedRoutingService.getCurrentRouteInfo()',
                status: 'success',
                message: 'Route info obtida',
                details: routeInfo
            });
        } catch (error) {
            diagnosticResults.push({
                test: 'UnifiedRoutingService Import',
                status: 'error',
                message: (error as Error).message
            });
        }

        // Teste 3: EditorDashboardSyncService
        try {
            const { EditorDashboardSyncService } = await import('@/services/core/EditorDashboardSyncService');
            diagnosticResults.push({
                test: 'EditorDashboardSyncService Import',
                status: 'success',
                message: 'Serviço importado com sucesso'
            });

            const syncStats = EditorDashboardSyncService.getSyncStats();
            diagnosticResults.push({
                test: 'EditorDashboardSyncService.getSyncStats()',
                status: 'success',
                message: 'Sync stats obtidas',
                details: syncStats
            });
        } catch (error) {
            diagnosticResults.push({
                test: 'EditorDashboardSyncService Import',
                status: 'error',
                message: (error as Error).message
            });
        }

        // Teste 4: Componentes principais
        const componentsToTest = [
            { name: 'UnifiedAdminLayout', path: '@/components/admin/UnifiedAdminLayout' },
            { name: 'AdminDashboard', path: '@/pages/dashboard/AdminDashboard' },
            { name: 'RealTimeDashboard', path: '@/components/dashboard/RealTimeDashboard' }
        ];

        for (const component of componentsToTest) {
            try {
                await import(component.path);
                diagnosticResults.push({
                    test: `${component.name} Import`,
                    status: 'success',
                    message: 'Componente importado com sucesso'
                });
            } catch (error) {
                diagnosticResults.push({
                    test: `${component.name} Import`,
                    status: 'error',
                    message: (error as Error).message
                });
            }
        }

        // Teste 5: Supabase (se disponível)
        try {
            const { supabase } = await import('@/integrations/supabase/client');
            diagnosticResults.push({
                test: 'Supabase Client Import',
                status: 'success',
                message: 'Cliente importado com sucesso'
            });

            try {
                const { data, error } = await supabase.from('quiz_templates').select('count').limit(1);
                if (error) {
                    diagnosticResults.push({
                        test: 'Supabase Connectivity',
                        status: 'error',
                        message: error.message
                    });
                } else {
                    diagnosticResults.push({
                        test: 'Supabase Connectivity',
                        status: 'success',
                        message: 'Conexão funcionando',
                        details: data
                    });
                }
            } catch (error) {
                diagnosticResults.push({
                    test: 'Supabase Connectivity',
                    status: 'error',
                    message: (error as Error).message
                });
            }
        } catch (error) {
            diagnosticResults.push({
                test: 'Supabase Client Import',
                status: 'warning',
                message: 'Supabase não disponível: ' + (error as Error).message
            });
        }

        setResults(diagnosticResults);
        setIsRunning(false);
    };

    useEffect(() => {
        runDiagnostics();
    }, []);

    const getIcon = (status: DiagnosticResult['status']) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        }
    };

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const warningCount = results.filter(r => r.status === 'warning').length;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 Diagnóstico Admin/Dashboard</h1>
                <p className="text-gray-600">Análise de gargalos e problemas funcionais</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Resumo dos Testes</CardTitle>
                    <Button onClick={runDiagnostics} disabled={isRunning}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
                        {isRunning ? 'Executando...' : 'Executar Novamente'}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{successCount}</div>
                            <div className="text-sm text-gray-600">Sucessos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                            <div className="text-sm text-gray-600">Erros</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                            <div className="text-sm text-gray-600">Avisos</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-3">
                {results.map((result, index) => (
                    <Card key={index}>
                        <CardContent className="pt-6">
                            <div className="flex items-start space-x-3">
                                {getIcon(result.status)}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{result.test}</h3>
                                    <p className="text-gray-600 mt-1">{result.message}</p>
                                    {result.details && (
                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                                                Ver detalhes
                                            </summary>
                                            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                                                {JSON.stringify(result.details, null, 2)}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboardDiagnosticPage;