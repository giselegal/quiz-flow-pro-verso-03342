import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedStorageService } from '@/services/aliases';
import { funnelLocalStore } from '@/services/funnelLocalStore';
import { Edit, Eye, Globe2, Plus, Upload, Link as LinkIcon } from 'lucide-react';
import React from 'react';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
// TemplateManager import removed - commented out to prevent unused import error
import consolidatedTemplateService from '@/services/core/ConsolidatedTemplateService';
import { publishFunnel } from '@/services/funnelPublishing';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { useMyFunnelsPersistence } from '@/hooks/editor/useContextualEditorPersistence';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { appLogger } from '@/lib/utils/appLogger';

type Funnel = ReturnType<typeof funnelLocalStore.list>[number];

const MyFunnelsPage: React.FC = () => {
    const [, setLocation] = useLocation();
    const [funnels, setFunnels] = React.useState<Funnel[]>([]);
    const [publishingId, setPublishingId] = React.useState<string | null>(null);
    const [openId, setOpenId] = React.useState<string>('');

    // 🎯 Usar hook contextual para isolamento de dados
    const { listFunnels, loadFunnel, saveFunnel, isLoading } = useMyFunnelsPersistence();

    React.useEffect(() => {
        appLogger.info('🔍 MyFunnelsPage: Carregando funis do contexto MY_FUNNELS...');

        const loadContextualFunnels = async () => {
            try {
                const contextualFunnels = await listFunnels();
                appLogger.info('📋 Funis contextuais carregados:', { data: [contextualFunnels] });
                setFunnels(contextualFunnels);

                // 🚀 CORREÇÃO: Se não há funis no contexto, criar alguns de exemplo
                if (contextualFunnels.length === 0) {
                    appLogger.info('⚠️ Nenhum funil encontrado no contexto MY_FUNNELS, criando exemplos...');
                    await createInitialFunnels();
                }
            } catch (error) {
                appLogger.error('❌ Erro ao carregar funis contextuais:', { data: [error] });
                // Fallback para o sistema antigo se houver erro
                const loadedFunnels = funnelLocalStore.list();
                appLogger.info('📋 Fallback - Funis carregados do localStorage:', { data: [loadedFunnels] });
                setFunnels(loadedFunnels);
            }
        };

        loadContextualFunnels();
    }, [listFunnels]);

    // 🆕 Função para criar funis iniciais usando o contexto MY_FUNNELS
    const createInitialFunnels = async () => {
        const initialFunnels = [
            {
                id: 'welcome-quiz-style',
                name: 'Quiz de Estilo Pessoal',
                description: 'Funil de exemplo para descobrir estilos pessoais',
                isPublished: false,
                version: 1,
                settings: {},
                pages: [],
            },
            {
                id: 'lead-magnet-example',
                name: 'Lead Magnet - E-book Grátis',
                description: 'Funil de exemplo para captura de leads',
                isPublished: false,
                version: 1,
                settings: {},
                pages: [],
            },
        ];

        try {
            // Salvar usando o hook contextual para isolamento
            for (const funnel of initialFunnels) {
                await saveFunnel(funnel);
            }

            // Recarregar a lista
            const updatedFunnels = await listFunnels();
            setFunnels(updatedFunnels);
            appLogger.info('✅ Funis iniciais criados no contexto MY_FUNNELS:', { data: [initialFunnels] });
        } catch (error) {
            appLogger.error('❌ Erro ao criar funis iniciais:', { data: [error] });
            // Fallback para o sistema antigo
            const legacyFunnels = initialFunnels.map(f => ({
                id: f.id,
                name: f.name,
                status: 'draft' as const,
                updatedAt: new Date().toISOString(),
            }));
            funnelLocalStore.saveList(legacyFunnels);
            setFunnels(legacyFunnels as any);
        }
    };

    const goToEditor = async (id?: string) => {
        appLogger.info('🎯 Navegando para editor:', { data: [id ? `com ID ${id}` : 'novo funil'] });

        if (id) {
            // Editar funil existente - carregar do contexto MY_FUNNELS
            try {
                const funnelData = await loadFunnel(id);
                if (funnelData) {
                    setLocation(`/editor?funnel=${encodeURIComponent(id)}&context=my-funnels`);
                } else {
                    appLogger.warn('⚠️ Funil não encontrado no contexto MY_FUNNELS:', { data: [id] });
                    setLocation(`/editor?funnel=${encodeURIComponent(id)}`);
                }
            } catch (error) {
                appLogger.error('❌ Erro ao carregar funil:', { data: [error] });
                setLocation(`/editor?funnel=${encodeURIComponent(id)}`);
            }
        } else {
            // Criar novo funil no contexto MY_FUNNELS
            const now = new Date().toISOString();
            const newId = `custom-funnel-${Date.now()}`;
            const name = `Novo Funil ${new Date().toLocaleTimeString()}`;

            const newFunnel = {
                id: newId,
                name,
                description: 'Novo funil criado em Meus Funis',
                isPublished: false,
                version: 1,
                settings: {},
                pages: [],
            };

            try {
                // Salvar no contexto MY_FUNNELS
                await saveFunnel(newFunnel);

                // Atualizar a lista local
                const updatedFunnels = await listFunnels();
                setFunnels(updatedFunnels);

                // Navegar para o editor com contexto específico
                setLocation(`/editor?funnel=${encodeURIComponent(newId)}&context=my-funnels`);
            } catch (error) {
                appLogger.error('❌ Erro ao criar novo funil:', { data: [error] });
                // Fallback para o sistema antigo
                const legacyFunnel = {
                    id: newId,
                    name,
                    status: 'draft' as const,
                    updatedAt: now,
                };

                const list = funnelLocalStore.list();
                list.push(legacyFunnel);
                funnelLocalStore.saveList(list);
                setFunnels([...funnels, legacyFunnel as any]);
                setLocation(`/editor?funnel=${encodeURIComponent(newId)}`);
            }
        }
    };

    const createAndOpen21 = async () => {
        try {
            // Date available for use if needed
            const templateId = 'template-optimized-21-steps-funnel';
            const newId = `${templateId}-${Date.now()}`;
            const name = 'Funil Quiz 21 Etapas';

            // Obter steps do consolidated service (prioriza per-step JSON)
            let steps: Record<string, any[]> = {};
            try {
                const full = await consolidatedTemplateService.getTemplate('quiz21StepsComplete');
                if (full?.steps?.length) {
                    steps = full.steps.reduce((acc, s) => {
                        acc[`step-${s.stepNumber}`] = s.blocks || [];
                        return acc;
                    }, {} as Record<string, any[]>);
                } else {
                    for (let i = 1; i <= 21; i++) {
                        const blocks = await consolidatedTemplateService.getStepBlocks(`step-${i}`);
                        steps[`step-${i}`] = blocks || [];
                    }
                }
            } catch (e) {
                appLogger.warn('⚠️ Falha ao obter steps via consolidatedTemplateService. Continuando com steps vazios.', { data: [e] });
            }

            const newFunnel = {
                id: newId,
                name,
                description: 'Funil otimizado de 21 etapas para quiz',
                isPublished: false,
                version: 1,
                settings: {
                    steps,
                    metadata: {
                        collectUserName: true,
                    },
                },
                pages: [],
            };

            // Salvar no contexto MY_FUNNELS
            await saveFunnel(newFunnel);

            // Atualizar a lista local
            const updatedFunnels = await listFunnels();
            setFunnels(updatedFunnels);

            appLogger.info('✅ Novo funil 21 etapas criado no contexto MY_FUNNELS:', { data: [newFunnel] });
            setLocation(`/editor?funnel=${encodeURIComponent(newId)}&template=${templateId}&context=my-funnels`);

        } catch (error) {
            appLogger.error('❌ Erro ao criar funil 21 etapas:', { data: [error] });
            // Fallback para navegação direta
            setLocation('/editor?template=template-optimized-21-steps-funnel');
        }
    };

    const handlePublish = async (funnel: Funnel) => {
        appLogger.info('🚀 Publicando funil:', { data: [funnel.id] });
        setPublishingId(funnel.id);

        try {
            // Carregar dados completos do funil
            const fullFunnelData = await loadFunnel(funnel.id);

            if (!fullFunnelData) {
                appLogger.error('❌ Dados do funil não encontrados:', { data: [funnel.id] });
                return;
            }

            // Preparar dados para publicação
            const publishData = {
                id: fullFunnelData.id,
                name: fullFunnelData.name,
                description: fullFunnelData.description || '',
                stages: [], // Added missing required property // Processar os blocos das páginas se necessário
                metadata: {
                    version: fullFunnelData.version,
                    lastModified: new Date().toISOString(),
                    context: FunnelContext.MY_FUNNELS,
                },
            };

            const result = await publishFunnel(publishData);

            if (result.success) {
                // Atualizar o funil como publicado
                const updatedFunnel = { ...fullFunnelData, isPublished: true };
                await saveFunnel(updatedFunnel);

                // Recarregar a lista
                const updatedFunnels = await listFunnels();
                setFunnels(updatedFunnels);

                appLogger.info('✅ Funil publicado com sucesso:', { data: [result.success] });
                setOpenId(funnel.id);
            } else {
                appLogger.error('❌ Erro na publicação:', { data: [result.error] });
            }
        } catch (error) {
            appLogger.error('❌ Erro ao publicar funil:', { data: [error] });
        } finally {
            setPublishingId(null);
        }
    };

    // Template blocks loader function available if needed (commented out to prevent unused warnings)
    // const loadTemplateBlocks = async (stepId: string) => {
    //     try {
    //         const blocks = await TemplateManager.loadStepBlocks(stepId);
    //         console.log(`📋 Blocos carregados para ${stepId}:`, blocks);
    //         return blocks;
    //     } catch (error) {
    //         console.error(`❌ Erro ao carregar blocos para ${stepId}:`, error);
    //         return [];
    //     }
    // };
    return (
        <div className="container mx-auto py-8">
            <AdminBreadcrumbs
                items={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Meus Funis', href: '/admin/meus-funis' },
                ]}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">🎯 Meus Funis</h1>
                    <p className="text-muted-foreground mt-2">
                        Gerencie seus funis de conversão personalizados
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button onClick={() => goToEditor()} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Novo Funil
                    </Button>

                    <Button
                        variant="outline"
                        onClick={createAndOpen21}
                        className="flex items-center gap-2"
                    >
                        <Upload className="h-4 w-4" />
                        Funil 21 Etapas
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <p>Carregando funis...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {funnels.map((funnel) => (
                        <Card key={funnel.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="truncate">{funnel.name}</span>
                                    <div className="flex items-center gap-1">
                                        {funnel.status === 'published' && (
                                            <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                Publicado
                                            </div>
                                        )}
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-sm text-muted-foreground">
                                        <p>Contexto: MY_FUNNELS</p>
                                        <p>Última atualização: {funnel.updatedAt ? new Date(funnel.updatedAt).toLocaleDateString() : 'N/A'}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => goToEditor(funnel.id)}
                                            className="flex items-center gap-1"
                                        >
                                            <Edit className="h-3 w-3" />
                                            Editar
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePublish(funnel)}
                                            disabled={publishingId === funnel.id}
                                            className="flex items-center gap-1"
                                        >
                                            {publishingId === funnel.id ? (
                                                <>
                                                    <Upload className="h-3 w-3 animate-spin" />
                                                    Publicando...
                                                </>
                                            ) : (
                                                <>
                                                    <Globe2 className="h-3 w-3" />
                                                    Publicar
                                                </>
                                            )}
                                        </Button>

                                        {openId === funnel.id && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(`/funnel/${funnel.id}`, '_blank')}
                                                className="flex items-center gap-1"
                                            >
                                                <Eye className="h-3 w-3" />
                                                Ver
                                            </Button>
                                        )}
                                    </div>

                                    {openId === funnel.id && (
                                        <div className="mt-4 p-3 bg-green-50 rounded border">
                                            <div className="flex items-center gap-2 text-sm">
                                                <LinkIcon className="h-4 w-4" />
                                                <Input
                                                    value={`${window.location.origin}/funnel/${funnel.id}`}
                                                    readOnly
                                                    className="text-xs"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {funnels.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-muted-foreground mb-4">
                        Nenhum funil encontrado
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Comece criando seu primeiro funil personalizado
                    </p>
                    <Button onClick={() => goToEditor()} className="flex items-center gap-2 mx-auto">
                        <Plus className="h-4 w-4" />
                        Criar Primeiro Funil
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MyFunnelsPage;
