/**
 * 🎯 MEUS FUNIS PAGE - DADOS REAIS
 * 
 * Página otimizada que carrega funis reais do Supabase
 * e exibe métricas reais de cada funil
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Edit,
    Copy,
    Trash2,
    Play,
    Pause,
    MoreVertical,
    Eye,
    BarChart3,
    Users,
    TrendingUp,
    Plus,
    RefreshCw,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/services/integrations/supabase/customClient';
import { useToast } from '@/hooks/use-toast';
import { templateService } from '@/services/canonical/TemplateService';
import { useFunnelController } from '@/hooks';
import { ServiceRegistry } from '@/services/ServiceRegistry';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES
// ============================================================================

interface RealFunnel {
    id: string;
    name: string;
    description: string | null;
    status: 'draft' | 'published' | 'archived' | null;
    created_at: string | null;
    updated_at: string | null;
    user_id: string | null;
    config: any;
    version?: number | null; // <- adicionada versão
    // Métricas calculadas
    sessions: number;
    completions: number;
    conversionRate: number;
    lastActivity: string | null;
    uiStatus: 'active' | 'draft' | 'paused';
}

interface FunnelStats {
    totalViews: number;
    totalConversions: number;
    avgConversionRate: number;
    totalRevenue: number;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const MeusFunisPageReal: React.FC = () => {
    const [funis, setFunis] = useState<RealFunnel[]>([]);
    const [stats, setStats] = useState<FunnelStats>({
        totalViews: 0,
        totalConversions: 0,
        avgConversionRate: 0,
        totalRevenue: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('todos');
    const [sortBy, setSortBy] = useState('updated');
    const [latestPublished, setLatestPublished] = useState<{ version: number; published_at: string } | null>(null);
    const [publishingDraftId, setPublishingDraftId] = useState<string | null>(null);
    const [confirmPublishId, setConfirmPublishId] = useState<string | null>(null);
    const { toast } = useToast();
    // Controlador unificado de funis (ServiceRegistry + React Query)
    const {
        listFunnels,
        createFunnel,
        updateFunnel,
        duplicateFunnel,
        deleteFunnel,
    } = useFunnelController();

    // persistir highlight via query param
    useEffect(() => {
        const url = new URL(window.location.href);
        const publishedId = url.searchParams.get('published');
        if (publishedId) {
            const el = document.getElementById(`funnel-card-${publishedId}`);
            if (el) {
                el.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-2');
                setTimeout(() => {
                    el.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-2');
                }, 4000);
            }
        }
    }, []);

    // ========================================================================
    // DATA LOADING
    // ========================================================================

    const isLoadingRef = useRef(false);
    const loadFunis = async () => {
        try {
            if (isLoadingRef.current) return;
            isLoadingRef.current = true;
            setIsLoading(true);

            // buscar versão publicada
            const { data: prodData } = await (supabase as any)
                .from('quiz_production')
                .select('version,published_at')
                .eq('slug', 'quiz-estilo')
                .order('published_at', { ascending: false })
                .limit(1)
                .maybeSingle?.() ?? await (supabase as any)
                    .from('quiz_production')
                    .select('version,published_at')
                    .eq('slug', 'quiz-estilo')
                    .order('published_at', { ascending: false })
                    .limit(1)
                    .single();
            if (prodData) setLatestPublished({ version: prodData.version, published_at: prodData.published_at });

            // Buscar todos os funis publicados/salvos
            // Tentar carregar funis existentes (tabela legada). Em ambientes sem Supabase/RLS, seguir sem abortar.
            const { data: funnelsDataRaw, error: funnelsError } = await supabase
                .from('funnels')
                .select('*')
                .order('updated_at', { ascending: false });
            const funnelsData = Array.isArray(funnelsDataRaw) ? funnelsDataRaw : [];

            // Buscar drafts do novo editor (quiz_drafts) + fallback cache do bridge
            let draftsData: any[] = [];
            try {
                const resp = await (supabase as any)
                    .from('quiz_drafts')
                    .select('*')
                    .order('updated_at', { ascending: false });
                draftsData = resp?.data || [];
            } catch {
                draftsData = [];
            }

            // Buscar funis do tipo 'draft' usando serviço canônico via controlador
            // Preferimos o controlador para manter cache/coerência
            const draftFunnels = await listFunnels({ status: 'draft' }).catch(async () => {
                // Fallback direto ao serviço, se necessário
                const service = ServiceRegistry.get('funnelService');
                return service.listFunnels({ status: 'draft' });
            });

            // Normalizar drafts do supabase e funnels em draft
            const supabaseDrafts = (draftsData || []).map((d: any) => ({
                id: d.id,
                name: d.name,
                slug: d.slug,
                updated_at: d.updated_at,
                created_at: d.created_at,
                is_published: d.is_published || false,
                version: d.version || 1,
                user_id: d.user_id,
            }));
            const funnelDrafts = (draftFunnels || []).map((d: any) => ({
                id: d.id,
                name: d.name,
                slug: d.slug,
                updated_at: d.updatedAt,
                created_at: d.createdAt,
                is_published: d.isPublished || false,
                version: d.version || 1,
                user_id: null,
            }));
            // Unificar por id, priorizando supabase
            const draftsById = new Map<string, any>();
            supabaseDrafts.forEach(d => draftsById.set(d.id, d));
            funnelDrafts.forEach((d: any) => { if (!draftsById.has(d.id)) draftsById.set(d.id, d); });
            const unifiedDrafts = Array.from(draftsById.values());

            if (funnelsError) {
                // Não abortar: seguimos apenas com drafts (Supabase pode estar sem schema ou com RLS exigindo login)
                appLogger.warn('⚠️ Erro ao carregar funis (seguindo com drafts):', { data: [funnelsError?.message || funnelsError] });
                toast({
                    title: 'Continuando com rascunhos',
                    description: 'Não foi possível carregar funis publicados. Exibindo apenas rascunhos.',
                    variant: 'default',
                });
            }

            // Buscar sessões para cada funil
            const funnelIds = funnelsData?.map(f => f.id) || [];
            let sessionsData: Array<{ id: string; funnel_id: string | null; status: string }> = [];
            if (funnelIds.length > 0) {
                try {
                    const { data: sessionsRaw } = await supabase
                        .from('quiz_sessions')
                        .select('id, funnel_id, status')
                        .in('funnel_id', funnelIds);
                    sessionsData = Array.isArray(sessionsRaw) ? sessionsRaw : [];
                } catch (e) {
                    appLogger.warn('⚠️ Erro ao carregar sessões (seguindo sem métricas):', { data: [e] });
                    sessionsData = [];
                }
            }

            // Buscar resultados das sessões (para usar futuramente)
            const sessionIds = sessionsData?.map(s => s.id) || [];
            if (sessionIds.length > 0) {
                await supabase
                    .from('quiz_results')
                    .select('session_id')
                    .in('session_id', sessionIds);
            }

            // Processar dados dos funis
            // Map funis (tabela antiga)
            const processedFunis: RealFunnel[] = (funnelsData || []).map((funnel: any) => {
                const funnelSessions = sessionsData?.filter(s => s.funnel_id === funnel.id) || [];
                const completedSessions = funnelSessions.filter(s => s.status === 'completed');

                const sessions = funnelSessions.length;
                const completions = completedSessions.length;
                const conversionRate = sessions > 0 ? (completions / sessions) * 100 : 0;

                // Determinar status
                let uiStatus: 'active' | 'draft' | 'paused' = 'draft';
                if (funnel.status === 'published') {
                    uiStatus = sessions > 0 ? 'active' : 'paused';
                }

                return {
                    ...funnel,
                    description: funnel.description || `Funil criado em ${funnel.created_at ? new Date(funnel.created_at).toLocaleDateString('pt-BR') : 'data desconhecida'}`,
                    sessions,
                    completions,
                    conversionRate: parseFloat(conversionRate.toFixed(1)),
                    lastActivity: funnel.updated_at,
                    uiStatus,
                };
            });

            // Map drafts (quiz_drafts) para mesma interface (sem sessões ainda)
            const draftFunis: RealFunnel[] = (unifiedDrafts || []).map((draft: any) => ({
                id: draft.id,
                name: draft.name || draft.slug || 'Rascunho sem nome',
                description: `Rascunho (${draft.slug}) versão ${draft.version || 1}`,
                status: 'draft',
                created_at: draft.created_at,
                updated_at: draft.updated_at,
                user_id: draft.user_id,
                config: {},
                version: draft.version || 1,
                sessions: 0,
                completions: 0,
                conversionRate: 0,
                lastActivity: draft.updated_at,
                uiStatus: 'draft',
            }));

            // Ordenar drafts primeiro por updated_at (ou created_at) desc, depois funis existentes
            const sortDate = (d: any) => new Date(d.updated_at || d.created_at || 0).getTime();
            const orderedDrafts = [...draftFunis].sort((a, b) => sortDate(b) - sortDate(a));
            const orderedExisting = [...processedFunis].sort((a, b) => sortDate(b) - sortDate(a));
            const nextFunis = [...orderedDrafts, ...orderedExisting];
            setFunis(nextFunis);

            // Calcular estatísticas gerais
            const merged = [...draftFunis, ...processedFunis];
            const totalViews = merged.reduce((sum, f) => sum + f.sessions, 0);
            const totalConversions = merged.reduce((sum, f) => sum + f.completions, 0);
            const avgConversionRate = merged.length > 0
                ? merged.reduce((sum, f) => sum + f.conversionRate, 0) / merged.length
                : 0;

            setStats({
                totalViews,
                totalConversions,
                avgConversionRate: parseFloat(avgConversionRate.toFixed(1)),
                totalRevenue: totalConversions * 45, // R$ 45 por conversão
            });

            appLogger.info('✅ Funis carregados:', { data: [processedFunis.length, 'funis reais'] });

        } catch (error) {
            appLogger.error('❌ Erro ao carregar funis:', { data: [error] });
            toast({
                title: 'Erro inesperado',
                description: 'Não foi possível carregar os funis. Tente novamente.',
                variant: 'destructive',
            });
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFunis();
    }, []);

    // Debounce de atualização manual para evitar múltiplos disparos
    const refreshTimerRef = useRef<number | null>(null);
    const triggerRefresh = () => {
        if (refreshTimerRef.current !== null) return;
        refreshTimerRef.current = window.setTimeout(() => {
            loadFunis();
            if (refreshTimerRef.current !== null) {
                window.clearTimeout(refreshTimerRef.current);
                refreshTimerRef.current = null;
            }
        }, 150);
    };

    // ========================================================================
    // ACTIONS
    // ========================================================================

    const handleEditFunil = (funilId: string) => {
        // Editor principal espera ?funnel=ID
        window.location.href = `/editor?funnel=${encodeURIComponent(funilId)}`;
    };

    const handleDuplicateFunil = async (funilId: string) => {
        try {
            const originalFunil = funis.find(f => f.id === funilId);
            if (!originalFunil) return;

            const newName = `${originalFunil.name} - Cópia`;
            await duplicateFunnel(funilId, newName);

            toast({
                title: 'Funil duplicado!',
                description: 'O funil foi duplicado com sucesso.',
            });

            loadFunis(); // Recarregar dados
        } catch (error) {
            appLogger.error('Erro ao duplicar funil:', { data: [error] });
            toast({
                title: 'Erro ao duplicar',
                description: 'Não foi possível duplicar o funil.',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteFunil = async (funilId: string) => {
        if (!confirm('Tem certeza que deseja excluir este funil? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            await deleteFunnel(funilId);

            toast({
                title: 'Funil excluído!',
                description: 'O funil foi removido com sucesso.',
            });

            loadFunis(); // Recarregar dados
        } catch (error) {
            appLogger.error('Erro ao excluir funil:', { data: [error] });
            toast({
                title: 'Erro ao excluir',
                description: 'Não foi possível excluir o funil.',
                variant: 'destructive',
            });
        }
    };

    const handleTogglePublish = async (funilId: string, currentStatus: boolean) => {
        try {
            const nextStatus = !currentStatus ? 'published' : 'draft';
            await updateFunnel(funilId, { status: nextStatus });

            toast({
                title: !currentStatus ? 'Funil publicado!' : 'Funil despublicado!',
                description: !currentStatus
                    ? 'O funil agora está ativo e pode receber participantes.'
                    : 'O funil foi pausado e não receberá novos participantes.',
            });

            loadFunis(); // Recarregar dados
        } catch (error) {
            appLogger.error('Erro ao alterar status:', { data: [error] });
            toast({
                title: 'Erro ao alterar status',
                description: 'Não foi possível alterar o status do funil.',
                variant: 'destructive',
            });
        }
    };

    // ========================================================================
    // FILTERING AND SORTING
    // ========================================================================

    const filteredFunis = useMemo(() => {
        if (selectedStatus === 'todos') return funis;
        return funis.filter(f => f.uiStatus === selectedStatus);
    }, [funis, selectedStatus]);

    const sortedFunis = useMemo(() => {
        const arr = [...filteredFunis];
        switch (sortBy) {
            case 'name':
                arr.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'created':
                arr.sort((a, b) => (b.created_at && a.created_at)
                    ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime() : 0);
                break;
            case 'sessions':
                arr.sort((a, b) => b.sessions - a.sessions);
                break;
            case 'conversion':
                arr.sort((a, b) => b.conversionRate - a.conversionRate);
                break;
            default: // updated
                arr.sort((a, b) => (b.updated_at && a.updated_at)
                    ? new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime() : 0);
        }
        return arr;
    }, [filteredFunis, sortBy]);

    // ========================================================================
    // RENDER
    // ========================================================================

    const statusConfig = useMemo(() => ({
        active: { label: 'Ativo', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
        draft: { label: 'Rascunho', color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50' },
        paused: { label: 'Pausado', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
    }), []);

    // Card memoizado para reduzir re-render por lista grande
    const FunnelCard = React.memo(({ funil }: { funil: RealFunnel }) => (
        <Card key={funil.id} className="hover:shadow-lg transition-shadow" id={`funnel-card-${funil.id}`}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1 flex items-center gap-2">
                            {funil.name}
                            {typeof funil.version === 'number' && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-medium tracking-wide">v{funil.version}</span>
                            )}
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-2 mt-1">
                            {funil.description}
                        </CardDescription>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="ml-2">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditFunil(funil.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateFunil(funil.id)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleTogglePublish(funil.id, funil.status === 'published')}
                            >
                                {funil.status === 'published' ? (
                                    <>
                                        <Pause className="w-4 h-4 mr-2" />
                                        Pausar
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 mr-2" />
                                        Publicar
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleDeleteFunil(funil.id)}
                                className="text-red-600"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Status Badge */}
                <div className="mt-3 flex items-center justify-between">
                    <Badge
                        variant="secondary"
                        className={`${statusConfig[funil.uiStatus].bgColor} ${statusConfig[funil.uiStatus].textColor}`}
                    >
                        {statusConfig[funil.uiStatus].label}
                    </Badge>
                    <span className="text-xs text-gray-500">
                        Atualizado {funil.updated_at ? new Date(funil.updated_at).toLocaleDateString('pt-BR') : 'N/A'}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Métricas */}
                <div className="grid grid-cols-3 gap-3 text-center mb-4">
                    <div>
                        <p className="text-lg font-semibold">{funil.sessions}</p>
                        <p className="text-xs text-gray-500">Sessões</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">{funil.completions}</p>
                        <p className="text-xs text-gray-500">Conversões</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">{funil.conversionRate}%</p>
                        <p className="text-xs text-gray-500">Taxa</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditFunil(funil.id)}
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                    </Button>
                    {funil.status === 'draft' ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => window.open(`/quiz-estilo?draft=${encodeURIComponent(funil.id)}`, '_blank')}
                                disabled={publishingDraftId === funil.id}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                className="flex-1"
                                onClick={() => setConfirmPublishId(funil.id)}
                                disabled={publishingDraftId === funil.id}
                            >
                                {publishingDraftId === funil.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                                {publishingDraftId === funil.id ? 'Publicando...' : 'Publicar'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => window.open(`/quiz/${funil.id}`, '_blank')}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview (produção)
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1"
                                onClick={() => window.open(`/quiz-estilo?draft=${encodeURIComponent(funil.id)}`, '_blank')}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview (rascunho)
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    ));

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Meus Funis</h1>
                        <p className="text-gray-600">Carregando funis...</p>
                    </div>
                    <div className="animate-spin">
                        <RefreshCw className="w-6 h-6" />
                    </div>
                </div>
            </div>
        );
    }

    // Criar rascunho padrão a partir da produção (21 etapas)
    const handleCreateDefaultDraft = async () => {
        try {
            // Buscar template de 21 etapas usando templateService
            const templateResult = await templateService.getTemplate('quiz21StepsComplete');

            if (!templateResult.success || !templateResult.data) {
                throw new Error('Template não encontrado');
            }

            // Criar novo funnel em draft via controlador/serviço canônico
            const newFunnel = await createFunnel({
                name: 'Quiz Estilo Pessoal - Rascunho',
                type: 'quiz',
                category: 'quiz',
                status: 'draft',
                config: templateResult.data,
                metadata: { source: 'quiz21StepsComplete' },
            });

            if (!newFunnel) {
                throw new Error('Falha ao criar rascunho');
            }
            toast({ title: 'Rascunho criado', description: `ID: ${newFunnel.id}` });

            // Abrir no editor para começar a editar (param padrão do EditorPage)
            window.location.href = `/editor?funnel=${encodeURIComponent(newFunnel.id)}`;
        } catch (e: any) {
            appLogger.error('Erro ao criar rascunho padrão:', { data: [e] });
            toast({ title: 'Erro ao criar rascunho', description: String(e?.message || e), variant: 'destructive' });
        }
    }; return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Meus Funis ({funis.length})
                        </h1>
                        <p className="text-gray-600">
                            Gerencie seus funis com dados reais do sistema
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={triggerRefresh}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Atualizar
                        </Button>
                        <Button onClick={() => window.location.href = '/editor'}>
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Funil
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total de Sessões</p>
                                    <p className="text-xl font-bold">{stats.totalViews.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <Users className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total de Conversões</p>
                                    <p className="text-xl font-bold">{stats.totalConversions.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Taxa Média de Conversão</p>
                                    <p className="text-xl font-bold">{stats.avgConversionRate.toFixed(1)}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Receita Estimada</p>
                                    <p className="text-xl font-bold text-green-600">
                                        R$ {stats.totalRevenue.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Última Versão Publicada */}
            {latestPublished && (
                <div className="mb-6 p-4 border border-indigo-200 rounded-lg bg-indigo-50 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-indigo-700 font-medium">Última versão publicada do Quiz Estilo</p>
                        <p className="text-xs text-indigo-600 mt-1">Versão v{latestPublished.version} • {new Date(latestPublished.published_at).toLocaleString('pt-BR')}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.open('/quiz-estilo', '_blank')}>Ver Produção</Button>
                </div>
            )}

            {/* Filtros e Ordenação */}
            <div className="mb-6 flex flex-wrap gap-4">
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="todos">Todos os Status</option>
                    <option value="active">Ativos</option>
                    <option value="draft">Rascunhos</option>
                    <option value="paused">Pausados</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="updated">Última Atualização</option>
                    <option value="created">Data de Criação</option>
                    <option value="name">Nome</option>
                    <option value="sessions">Número de Sessões</option>
                    <option value="conversion">Taxa de Conversão</option>
                </select>

                <div className="flex-1"></div>

                <p className="text-sm text-gray-600 self-center">
                    {sortedFunis.length} de {funis.length} funis
                </p>
            </div>

            {/* Funis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedFunis.map(funil => (
                    <FunnelCard key={funil.id} funil={funil} />
                ))}
            </div>

            {/* Confirm Publish Modal */}

            {/* Confirm Publish Modal */}
            {confirmPublishId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Confirmar Publicação</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">Publicar este rascunho substituirá a versão atual em produção do Quiz Estilo. Deseja continuar?</p>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => setConfirmPublishId(null)} disabled={publishingDraftId !== null}>Cancelar</Button>
                            <Button size="sm" onClick={async () => {
                                const draftId = confirmPublishId;
                                setPublishingDraftId(draftId);

                                try {
                                    // Buscar o draft
                                    const service = ServiceRegistry.get('funnelService');
                                    const draftFunnel = await service.getFunnel(draftId);

                                    if (!draftFunnel) {
                                        throw new Error('Draft não encontrado');
                                    }

                                    // Atualizar status para published
                                    await service.updateFunnel(draftId, {
                                        ...draftFunnel,
                                        status: 'published',
                                    });

                                    toast({ title: 'Publicado!', description: 'Versão enviada para produção.' });
                                    const url = new URL(window.location.href);
                                    url.searchParams.set('published', draftId);
                                    window.history.replaceState({}, '', url.toString());
                                    setConfirmPublishId(null);
                                    setPublishingDraftId(null);
                                    loadFunis();
                                } catch (err: any) {
                                    toast({ title: 'Erro na publicação', description: err.message, variant: 'destructive' });
                                    setPublishingDraftId(null);
                                }
                            }} disabled={publishingDraftId !== null}>
                                {publishingDraftId ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                                {publishingDraftId ? 'Publicando...' : 'Confirmar'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {/* Empty State */}
            {sortedFunis.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedStatus === 'todos' ? 'Nenhum funil encontrado' : `Nenhum funil ${selectedStatus} encontrado`}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {selectedStatus === 'todos'
                            ? 'Comece criando seu primeiro funil de conversão.'
                            : 'Altere os filtros para ver outros funis.'
                        }
                    </p>
                    {selectedStatus === 'todos' && (
                        <div className="flex items-center justify-center gap-3">
                            <Button variant="outline" onClick={() => window.location.href = '/editor?funnel=quiz21StepsComplete'}>
                                <Plus className="w-4 h-4 mr-2" />
                                Abrir Editor com Template
                            </Button>
                            <Button onClick={handleCreateDefaultDraft}>
                                <Plus className="w-4 h-4 mr-2" />
                                Criar Rascunho Padrão (21 etapas)
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MeusFunisPageReal;