import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import {
    populateDatabase,
    verifyDataInsertion,
    testDashboardUpdates,
    insertSampleUsers,
    insertSampleFunnels,
    insertSampleResponses,
    insertSampleAnalytics
} from '@/utils/populateTestData';

interface TestResult {
    success: boolean;
    message: string;
    details?: any;
}

const DataTestPage: React.FC = () => {
    const [loading, setLoading] = useState<string | null>(null);
    const [results, setResults] = useState<Record<string, TestResult>>({});

    const runTest = async (testName: string, testFn: () => Promise<any>) => {
        setLoading(testName);
        try {
            const result = await testFn();
            setResults(prev => ({
                ...prev,
                [testName]: {
                    success: true,
                    message: 'Executado com sucesso',
                    details: result
                }
            }));
        } catch (error) {
            setResults(prev => ({
                ...prev,
                [testName]: {
                    success: false,
                    message: error instanceof Error ? error.message : 'Erro desconhecido'
                }
            }));
        } finally {
            setLoading(null);
        }
    };

    const clearResults = () => {
        setResults({});
    };

    const getStatusIcon = (testName: string) => {
        if (loading === testName) return <Loader2 className="h-4 w-4 animate-spin" />;
        if (!results[testName]) return null;
        return results[testName].success ?
            <CheckCircle className="h-4 w-4 text-green-500" /> :
            <XCircle className="h-4 w-4 text-red-500" />;
    };

    const getStatusBadge = (testName: string) => {
        if (loading === testName) return <Badge variant="secondary">Executando...</Badge>;
        if (!results[testName]) return <Badge variant="outline">Não executado</Badge>;
        return results[testName].success ?
            <Badge variant="default" className="bg-green-600">Sucesso</Badge> :
            <Badge variant="destructive">Erro</Badge>;
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <Database className="h-8 w-8" />
                    Teste de Dados Reais
                </h1>
                <p className="text-muted-foreground">
                    Execute testes para popular o banco de dados com dados realistas e verificar se o admin/dashboard funciona.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Seção 1: Inserção de Dados Individuais */}
                <Card>
                    <CardHeader>
                        <CardTitle>1. Inserção de Dados Individuais</CardTitle>
                        <CardDescription>
                            Insira diferentes tipos de dados separadamente para teste granular
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon('users')}
                                    <span className="font-medium">Usuários</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge('users')}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={loading === 'users'}
                                        onClick={() => runTest('users', insertSampleUsers)}
                                    >
                                        Inserir
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon('funnels')}
                                    <span className="font-medium">Funis</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge('funnels')}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={loading === 'funnels'}
                                        onClick={() => runTest('funnels', insertSampleFunnels)}
                                    >
                                        Inserir
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon('responses')}
                                    <span className="font-medium">Respostas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge('responses')}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={loading === 'responses'}
                                        onClick={() => runTest('responses', insertSampleResponses)}
                                    >
                                        Inserir
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon('analytics')}
                                    <span className="font-medium">Analytics</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge('analytics')}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={loading === 'analytics'}
                                        onClick={() => runTest('analytics', insertSampleAnalytics)}
                                    >
                                        Inserir
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Seção 2: Inserção Completa */}
                <Card>
                    <CardHeader>
                        <CardTitle>2. Inserção Completa</CardTitle>
                        <CardDescription>
                            Execute a inserção completa de todos os dados de uma vez
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                                {getStatusIcon('populate')}
                                <div>
                                    <span className="font-medium block">Popular Banco Completo</span>
                                    <span className="text-sm text-muted-foreground">
                                        Insere usuários, funis, respostas e analytics
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusBadge('populate')}
                                <Button
                                    disabled={loading === 'populate'}
                                    onClick={() => runTest('populate', populateDatabase)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {loading === 'populate' ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Populando...
                                        </>
                                    ) : (
                                        'Popular Banco'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Seção 3: Verificação */}
                <Card>
                    <CardHeader>
                        <CardTitle>3. Verificação e Testes</CardTitle>
                        <CardDescription>
                            Verifique se os dados foram inseridos e se o dashboard funciona
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                                {getStatusIcon('verify')}
                                <span className="font-medium">Verificar Dados</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusBadge('verify')}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={loading === 'verify'}
                                    onClick={() => runTest('verify', verifyDataInsertion)}
                                >
                                    Verificar
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                                {getStatusIcon('dashboard')}
                                <span className="font-medium">Testar Dashboard</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusBadge('dashboard')}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={loading === 'dashboard'}
                                    onClick={() => runTest('dashboard', testDashboardUpdates)}
                                >
                                    Testar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Seção 4: Resultados */}
                {Object.keys(results).length > 0 && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>4. Resultados dos Testes</CardTitle>
                                <CardDescription>
                                    Detalhes dos testes executados
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={clearResults}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Limpar
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {Object.entries(results).map(([testName, result]) => (
                                    <div key={testName} className="border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium capitalize">{testName}</span>
                                            <Badge variant={result.success ? "default" : "destructive"}>
                                                {result.success ? "Sucesso" : "Erro"}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{result.message}</p>
                                        {result.details && (
                                            <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                                                {JSON.stringify(result.details, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Seção 5: Links Rápidos */}
                <Card>
                    <CardHeader>
                        <CardTitle>5. Links de Teste</CardTitle>
                        <CardDescription>
                            Acesse as páginas para verificar se funcionam com os novos dados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button
                                variant="outline"
                                asChild
                                className="h-auto p-4 flex flex-col items-center gap-2"
                            >
                                <a href="/admin" target="_blank" rel="noopener noreferrer">
                                    <span className="font-medium">Admin</span>
                                    <span className="text-xs text-muted-foreground">/admin</span>
                                </a>
                            </Button>

                            <Button
                                variant="outline"
                                asChild
                                className="h-auto p-4 flex flex-col items-center gap-2"
                            >
                                <a href="/dashboard" target="_blank" rel="noopener noreferrer">
                                    <span className="font-medium">Dashboard</span>
                                    <span className="text-xs text-muted-foreground">/dashboard</span>
                                </a>
                            </Button>

                            <Button
                                variant="outline"
                                asChild
                                className="h-auto p-4 flex flex-col items-center gap-2"
                            >
                                <a href="/admin/dashboard" target="_blank" rel="noopener noreferrer">
                                    <span className="font-medium">Admin Dashboard</span>
                                    <span className="text-xs text-muted-foreground">/admin/dashboard</span>
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DataTestPage;