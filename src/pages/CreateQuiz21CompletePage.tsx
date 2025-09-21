import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { createQuiz21CompleteViaService, testQuiz21Complete, QUIZ_21_COMPLETE_DATA } from '@/services/Quiz21CompleteService';
import { Loader2, CheckCircle, XCircle, PlayCircle, Eye, Edit } from 'lucide-react';

const CreateQuiz21CompletePage: React.FC = () => {
    const [, setLocation] = useLocation();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'creating' | 'testing' | 'success' | 'error'>('idle');
    const [createdFunnelId, setCreatedFunnelId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleCreateQuiz = async () => {
        try {
            setLoading(true);
            setStatus('creating');
            setErrorMessage('');

            // Criar funil
            const funnelId = await createQuiz21CompleteViaService();

            if (!funnelId) {
                throw new Error('Falha ao criar o funil');
            }

            setCreatedFunnelId(funnelId);
            setStatus('testing');

            // Testar criação
            const testResult = await testQuiz21Complete(funnelId);

            if (testResult) {
                setStatus('success');
            } else {
                throw new Error('Funil criado mas falha na validação');
            }

        } catch (error) {
            console.error('Erro ao criar quiz:', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'creating':
            case 'testing':
                return <Loader2 className="w-4 h-4 animate-spin" />;
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'error':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <PlayCircle className="w-4 h-4" />;
        }
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'creating':
                return 'Criando funil no Supabase...';
            case 'testing':
                return 'Validando criação...';
            case 'success':
                return 'Quiz 21 Steps Complete criado com sucesso!';
            case 'error':
                return `Erro: ${errorMessage}`;
            default:
                return 'Pronto para criar o Quiz 21 Steps Complete';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🎯 Criar Quiz 21 Steps Complete
                        </CardTitle>
                        <CardDescription>
                            Migração urgente do template quiz21StepsComplete.ts para o novo sistema de funis
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Quiz Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>📋 Visão Geral do Quiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-3">{QUIZ_21_COMPLETE_DATA.name}</h3>
                                <p className="text-gray-600 mb-4">{QUIZ_21_COMPLETE_DATA.description}</p>

                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Badge variant="secondary">
                                            {QUIZ_21_COMPLETE_DATA.settings.category}
                                        </Badge>
                                        <Badge variant="outline">
                                            {QUIZ_21_COMPLETE_DATA.pages.length} etapas
                                        </Badge>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        <p>• Template ID: {QUIZ_21_COMPLETE_DATA.settings.templateId}</p>
                                        <p>• Questões do quiz: {QUIZ_21_COMPLETE_DATA.settings.quiz_config.totalQuestions}</p>
                                        <p>• Questões estratégicas: {QUIZ_21_COMPLETE_DATA.settings.quiz_config.strategicQuestions}</p>
                                        <p>• Sistema de pontuação: {QUIZ_21_COMPLETE_DATA.settings.quiz_config.scoringSystem}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Etapas do Funil:</h4>
                                <div className="space-y-1 max-h-64 overflow-y-auto">
                                    {QUIZ_21_COMPLETE_DATA.pages.map((page) => (
                                        <div key={page.id} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                                            <Badge variant="outline">
                                                {page.page_order}
                                            </Badge>
                                            <span className="flex-1">{page.title}</span>
                                            <Badge variant="secondary">
                                                {page.page_type}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>🚀 Ações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">

                            {/* Status */}
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                {getStatusIcon()}
                                <span className="text-sm">{getStatusMessage()}</span>
                            </div>

                            {/* Create Button */}
                            <Button
                                onClick={handleCreateQuiz}
                                disabled={loading || status === 'success'}
                                size="lg"
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {status === 'creating' ? 'Criando...' : 'Testando...'}
                                    </>
                                ) : status === 'success' ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Quiz Criado com Sucesso!
                                    </>
                                ) : (
                                    <>
                                        <PlayCircle className="w-4 h-4 mr-2" />
                                        Criar Quiz 21 Steps Complete
                                    </>
                                )}
                            </Button>

                            {/* Success Actions */}
                            {status === 'success' && createdFunnelId && (
                                <div className="grid md:grid-cols-3 gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setLocation(`/editor-pro/${createdFunnelId}`)}
                                        className="flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setLocation(`/preview/${createdFunnelId}`)}
                                        className="flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setLocation(`/meus-funis`)}
                                        className="flex items-center gap-2"
                                    >
                                        📋 Meus Funis
                                    </Button>
                                </div>
                            )}

                            {/* Error Actions */}
                            {status === 'error' && (
                                <div className="space-y-2">
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">{errorMessage}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setStatus('idle');
                                            setErrorMessage('');
                                            setCreatedFunnelId(null);
                                        }}
                                    >
                                        Tentar Novamente
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Technical Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>🔧 Detalhes Técnicos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h4 className="font-medium mb-2">Configurações do Template:</h4>
                                <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
                                    {JSON.stringify(QUIZ_21_COMPLETE_DATA.settings, null, 2)}
                                </pre>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Estrutura das Páginas:</h4>
                                <div className="space-y-1">
                                    {QUIZ_21_COMPLETE_DATA.pages.map((page) => (
                                        <div key={page.id} className="text-xs">
                                            <span className="font-mono">{page.page_order}.</span> {page.page_type} - {page.blocks.length} blocos
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default CreateQuiz21CompletePage;