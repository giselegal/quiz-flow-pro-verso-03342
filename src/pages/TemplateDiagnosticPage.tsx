/**
 * 🔍 PÁGINA DE DIAGNÓSTICO DE TEMPLATES
 * 
 * Página temporária para diagnosticar problemas com templates
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Folder, FileText } from 'lucide-react';

// Importações de templates e serviços
import { AVAILABLE_TEMPLATES, TemplateConfig } from '@/config/templates';
import { templateLibraryService, type FunnelTemplate } from '@/services/templateLibraryService';
import { getUnifiedTemplates, type UnifiedTemplate } from '@/config/unifiedTemplatesRegistry';
import useMyTemplates from '@/hooks/useMyTemplates';

const TemplateDiagnosticPage: React.FC = () => {
    const [diagnostics, setDiagnostics] = useState<any>({});
    const [isRunning, setIsRunning] = useState(false);

    // Hook dos templates do usuário
    const { templates: userTemplates, loadTemplates: loadUserTemplates, isLoading } = useMyTemplates();

    const runDiagnostic = async () => {
        setIsRunning(true);
        const results: any = {};

        try {
            console.log('🔍 Iniciando diagnóstico de templates...');

            // 1. Testar configuração estática de templates
            results.staticConfig = {
                status: AVAILABLE_TEMPLATES.length > 0 ? 'success' : 'error',
                count: AVAILABLE_TEMPLATES.length,
                templates: AVAILABLE_TEMPLATES.map(t => ({ id: t.id, name: t.name })),
                error: null
            };

            // 2. Testar templateLibraryService
            try {
                const builtinTemplates = templateLibraryService.listBuiltins();
                const allTemplates = templateLibraryService.listAll();
                results.libraryService = {
                    status: 'success',
                    builtinCount: builtinTemplates.length,
                    totalCount: allTemplates.length,
                    templates: allTemplates.map(t => ({ id: t.id, name: t.name })),
                    error: null
                };
            } catch (error: any) {
                results.libraryService = {
                    status: 'error',
                    error: error?.message || String(error),
                    builtinCount: 0,
                    totalCount: 0,
                    templates: []
                };
            }

            // 3. Testar registry unificado
            try {
                const unifiedTemplates = getUnifiedTemplates();
                results.unifiedRegistry = {
                    status: unifiedTemplates.length > 0 ? 'success' : 'warning',
                    count: unifiedTemplates.length,
                    templates: unifiedTemplates.map(t => ({ id: t.id, name: t.name })),
                    error: null
                };
            } catch (error: any) {
                results.unifiedRegistry = {
                    status: 'error',
                    error: error?.message || String(error),
                    count: 0,
                    templates: []
                };
            }

            // 4. Testar hook useMyTemplates
            try {
                const myTemplates = await loadUserTemplates();
                results.userTemplates = {
                    status: 'success',
                    count: myTemplates.length,
                    templates: myTemplates.map(t => ({ id: t.id, name: t.name })),
                    error: null
                };
            } catch (error: any) {
                results.userTemplates = {
                    status: 'error',
                    error: error?.message || String(error),
                    count: 0,
                    templates: []
                };
            }

            // 5. Verificar acesso aos arquivos físicos
            try {
                const response = await fetch('/templates/step-01-template.json');
                if (response.ok) {
                    const templateData = await response.json();
                    results.physicalFiles = {
                        status: 'success',
                        accessible: true,
                        sampleTemplate: { id: templateData.metadata?.id, name: templateData.metadata?.name },
                        error: null
                    };
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error: any) {
                results.physicalFiles = {
                    status: 'error',
                    accessible: false,
                    error: error?.message || String(error),
                    sampleTemplate: null
                };
            }

            console.log('🔍 Diagnóstico completo:', results);
            setDiagnostics(results);

        } catch (error: any) {
            console.error('❌ Erro no diagnóstico:', error);
            results.general = {
                status: 'error',
                error: error?.message || String(error)
            };
            setDiagnostics(results);
        } finally {
            setIsRunning(false);
        }
    };

    useEffect(() => {
        runDiagnostic();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
            default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🔍 Diagnóstico de Templates
                    </h1>
                    <p className="text-gray-600">
                        Verificando o sistema de templates do QuizQuest
                    </p>
                    <Button
                        onClick={runDiagnostic}
                        disabled={isRunning}
                        className="mt-4"
                    >
                        {isRunning ? 'Executando...' : 'Executar Novamente'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Configuração Estática */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            {getStatusIcon(diagnostics.staticConfig?.status)}
                            <CardTitle>Configuração Estática</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-2">AVAILABLE_TEMPLATES</p>
                            <Badge variant="outline">{diagnostics.staticConfig?.count || 0} templates</Badge>
                            {diagnostics.staticConfig?.error && (
                                <p className="text-red-500 text-sm mt-2">{diagnostics.staticConfig.error}</p>
                            )}
                            <div className="mt-3 max-h-32 overflow-y-auto">
                                {diagnostics.staticConfig?.templates?.map((template: any) => (
                                    <div key={template.id} className="text-sm text-gray-700 py-1">
                                        <FileText className="h-3 w-3 inline mr-2" />
                                        {template.name}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Library Service */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            {getStatusIcon(diagnostics.libraryService?.status)}
                            <CardTitle>Template Library Service</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-2">templateLibraryService</p>
                            <div className="flex gap-2">
                                <Badge variant="outline">{diagnostics.libraryService?.builtinCount || 0} builtin</Badge>
                                <Badge variant="outline">{diagnostics.libraryService?.totalCount || 0} total</Badge>
                            </div>
                            {diagnostics.libraryService?.error && (
                                <p className="text-red-500 text-sm mt-2">{diagnostics.libraryService.error}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Registry Unificado */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            {getStatusIcon(diagnostics.unifiedRegistry?.status)}
                            <CardTitle>Registry Unificado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-2">getUnifiedTemplates()</p>
                            <Badge variant="outline">{diagnostics.unifiedRegistry?.count || 0} templates</Badge>
                            {diagnostics.unifiedRegistry?.error && (
                                <p className="text-red-500 text-sm mt-2">{diagnostics.unifiedRegistry.error}</p>
                            )}
                            <div className="mt-3 max-h-32 overflow-y-auto">
                                {diagnostics.unifiedRegistry?.templates?.map((template: any) => (
                                    <div key={template.id} className="text-sm text-gray-700 py-1">
                                        <FileText className="h-3 w-3 inline mr-2" />
                                        {template.name}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Templates do Usuário */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            {getStatusIcon(diagnostics.userTemplates?.status)}
                            <CardTitle>Templates do Usuário</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-2">useMyTemplates hook</p>
                            <Badge variant="outline">{diagnostics.userTemplates?.count || 0} templates</Badge>
                            {diagnostics.userTemplates?.error && (
                                <p className="text-red-500 text-sm mt-2">{diagnostics.userTemplates.error}</p>
                            )}
                            {isLoading && <p className="text-blue-500 text-sm mt-2">Carregando...</p>}
                        </CardContent>
                    </Card>

                    {/* Arquivos Físicos */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center gap-2">
                            {getStatusIcon(diagnostics.physicalFiles?.status)}
                            <CardTitle>Arquivos Físicos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-2">Acesso via HTTP a /templates/</p>
                            <div className="flex items-center gap-2">
                                <Folder className="h-4 w-4" />
                                <span className="text-sm">
                                    {diagnostics.physicalFiles?.accessible ? 'Acessível' : 'Não acessível'}
                                </span>
                            </div>
                            {diagnostics.physicalFiles?.error && (
                                <p className="text-red-500 text-sm mt-2">{diagnostics.physicalFiles.error}</p>
                            )}
                            {diagnostics.physicalFiles?.sampleTemplate && (
                                <div className="mt-2 text-sm text-gray-700">
                                    Sample: {diagnostics.physicalFiles.sampleTemplate.name}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Dados brutos para debug */}
                {Object.keys(diagnostics).length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Dados Brutos (Debug)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                                {JSON.stringify(diagnostics, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default TemplateDiagnosticPage;