import React from 'react';
import {
    Edit,
    Copy,
    Trash2,
    Share2,
    Play,
    Pause,
    MoreVertical,
    Eye,
    BarChart3,
    Calendar,
    Users,
    TrendingUp
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

// Funis do usuário - em uso ativo, editados e publicados
const meusFunis = [
    {
        id: 'funil-marketing-digital-live',
        name: 'Quiz: Qual Seu Nível em Marketing Digital?',
        description: 'Funil ativo gerando leads qualificados para consultoria em marketing digital',
        status: 'active',
        createdAt: '2024-09-01',
        updatedAt: '2024-09-20',
        publishedAt: '2024-09-05',
        template: 'Quiz de Personalidade',
        url: 'quiz-marketing-digital.com',
        views: 4250,
        completions: 2890,
        conversionRate: 68.0,
        category: 'Marketing',
        questions: 7,
        avgTime: '4 min',
        thumbnail: 'https://placehold.co/200x120/3b82f6/ffffff?text=Marketing+Quiz',
        lastEdited: '2 dias atrás',
        revenue: 'R$ 15.400'
    },
    {
        id: 'funil-nps-clientes-ativo',
        name: 'Pesquisa de Satisfação - Clientes Premium',
        description: 'Coletando feedback contínuo dos clientes premium para melhorias no serviço',
        status: 'active',
        createdAt: '2024-08-15',
        updatedAt: '2024-09-22',
        publishedAt: '2024-08-20',
        template: 'Pesquisa NPS',
        url: 'feedback-premium.com',
        views: 890,
        completions: 756,
        conversionRate: 84.9,
        category: 'Feedback',
        questions: 5,
        avgTime: '3 min',
        thumbnail: 'https://placehold.co/200x120/10b981/ffffff?text=NPS+Survey',
        lastEdited: '1 hora atrás',
        revenue: 'N/A'
    },
    {
        id: 'funil-roi-consultoria',
        name: 'Calculadora ROI - Consultoria Empresarial',
        description: 'Demonstra valor da consultoria para prospects B2B - alta conversão',
        status: 'active',
        createdAt: '2024-09-10',
        updatedAt: '2024-09-23',
        publishedAt: '2024-09-15',
        template: 'Calculadora de ROI',
        url: 'roi-consultoria.com',
        views: 1680,
        completions: 920,
        conversionRate: 54.8,
        category: 'B2B',
        questions: 8,
        avgTime: '7 min',
        thumbnail: 'https://placehold.co/200x120/ef4444/ffffff?text=ROI+Calc',
        lastEdited: '3 horas atrás',
        revenue: 'R$ 28.900'
    },
    {
        id: 'funil-leads-webinar',
        name: 'Inscrição Webinar: "IA no Marketing"',
        description: 'Formulário de inscrição para webinar mensal - evento recorrente',
        status: 'active',
        createdAt: '2024-09-18',
        updatedAt: '2024-09-24',
        publishedAt: '2024-09-20',
        template: 'Inscrição para Eventos',
        url: 'webinar-ia-marketing.com',
        views: 2340,
        completions: 1560,
        conversionRate: 66.7,
        category: 'Eventos',
        questions: 4,
        avgTime: '2 min',
        thumbnail: 'https://placehold.co/200x120/8b5cf6/ffffff?text=Webinar+IA',
        lastEdited: '30 min atrás',
        revenue: 'R$ 8.200'
    },
    {
        id: 'funil-onboarding-clientes',
        name: 'Onboarding Novos Clientes',
        description: 'Processo personalizado de integração - melhora retenção em 40%',
        status: 'active',
        createdAt: '2024-08-25',
        updatedAt: '2024-09-21',
        publishedAt: '2024-09-01',
        template: 'Onboarding de Clientes',
        url: 'onboarding-interno.com',
        views: 156,
        completions: 142,
        conversionRate: 91.0,
        category: 'Onboarding',
        questions: 6,
        avgTime: '5 min',
        thumbnail: 'https://placehold.co/200x120/06b6d4/ffffff?text=Onboarding',
        lastEdited: '1 dia atrás',
        revenue: 'N/A'
    },
    {
        id: 'funil-teste-ab-landing',
        name: 'Landing Page Curso Online - Versão A',
        description: 'Teste A/B da landing principal do curso - versão otimizada',
        status: 'active',
        createdAt: '2024-09-05',
        updatedAt: '2024-09-24',
        publishedAt: '2024-09-10',
        template: 'Lead Magnet com E-book',
        url: 'curso-online-v2.com',
        views: 5620,
        completions: 3240,
        conversionRate: 57.6,
        category: 'Educação',
        questions: 3,
        avgTime: '2 min',
        thumbnail: 'https://placehold.co/200x120/f97316/ffffff?text=Curso+Online',
        lastEdited: '15 min atrás',
        revenue: 'R$ 42.300'
    },
    {
        id: 'funil-qualificacao-b2b-draft',
        name: 'Qualificação Leads B2B Enterprise',
        description: 'Em desenvolvimento - para prospects de grande porte (rascunho)',
        status: 'draft',
        createdAt: '2024-09-20',
        updatedAt: '2024-09-24',
        publishedAt: null,
        template: 'Qualificação de Leads B2B',
        url: null,
        views: 0,
        completions: 0,
        conversionRate: 0,
        category: 'B2B',
        questions: 12,
        avgTime: '10 min',
        thumbnail: 'https://placehold.co/200x120/cccccc/ffffff?text=Em+Desenvolvimento',
        lastEdited: '2 horas atrás',
        revenue: 'R$ 0'
    },
    {
        id: 'funil-feedback-produto-pausado',
        name: 'Feedback Novo Produto - SaaS',
        description: 'Pausado temporariamente - aguardando nova versão do produto',
        status: 'paused',
        createdAt: '2024-08-30',
        updatedAt: '2024-09-15',
        publishedAt: '2024-09-05',
        template: 'Pesquisa de Mercado',
        url: 'feedback-saas-produto.com',
        views: 340,
        completions: 180,
        conversionRate: 52.9,
        category: 'Pesquisa',
        questions: 8,
        avgTime: '6 min',
        thumbnail: 'https://placehold.co/200x120/cccccc/ffffff?text=Pausado',
        lastEdited: '1 semana atrás',
        revenue: 'N/A'
    }
];

const statusConfig = {
    active: { label: 'Ativo', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
    draft: { label: 'Rascunho', color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50' },
    paused: { label: 'Pausado', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' }
};

const MeusFunisPage: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = React.useState('todos');
    const [selectedCategory, setSelectedCategory] = React.useState('todos');
    const [sortBy, setSortBy] = React.useState('updated');
    const [funisData, setFunisData] = React.useState(meusFunis);

    const categories = ['todos', ...Array.from(new Set(funisData.map(funil => funil.category)))];
    const statusOptions = ['todos', 'active', 'draft', 'paused'];

    const filteredFunis = funisData.filter(funil => {
        const matchesStatus = selectedStatus === 'todos' || funil.status === selectedStatus;
        const matchesCategory = selectedCategory === 'todos' || funil.category === selectedCategory;
        return matchesStatus && matchesCategory;
    });

    const sortedFunis = [...filteredFunis].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'created':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'views':
                return b.views - a.views;
            case 'conversion':
                return b.conversionRate - a.conversionRate;
            default: // updated
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
    });

    const handleEditFunil = (funilId: string) => {
        console.log(`Editando funil: ${funilId}`);
        // Redirecionar para o editor com o funil carregado
        window.location.href = `/editor/${funilId}`;
    };

    const handleDuplicateFunil = (funilId: string) => {
        console.log(`Duplicando funil: ${funilId}`);
        // Criar uma cópia do funil
        const funilOriginal = funisData.find(f => f.id === funilId);
        if (funilOriginal) {
            const novoFunil = {
                ...funilOriginal,
                id: `${funilId}-copy-${Date.now()}`,
                name: `${funilOriginal.name} - Cópia`,
                status: 'draft'
            };
            setFunisData(prev => [novoFunil, ...prev]);
            alert('Funil duplicado com sucesso!');
        }
    };

    const handleDeleteFunil = (funilId: string) => {
        console.log(`Excluindo funil: ${funilId}`);
        if (confirm('Tem certeza que deseja excluir este funil?')) {
            setFunisData(prev => prev.filter(f => f.id !== funilId));
            alert('Funil excluído com sucesso!');
        }
    };

    const handleToggleStatus = (funilId: string, currentStatus: string) => {
        console.log(`Alterando status do funil ${funilId} de ${currentStatus}`);
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        setFunisData(prev =>
            prev.map(f =>
                f.id === funilId
                    ? { ...f, status: newStatus }
                    : f
            )
        );
        alert(`Status alterado para ${newStatus === 'active' ? 'Ativo' : 'Pausado'}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Meus Funis
                        </h1>
                        <p className="text-gray-600">
                            Gerencie seus funis personalizados e acompanhe o desempenho
                        </p>
                    </div>
                    <Button>
                        <Edit className="w-4 h-4 mr-2" />
                        Novo Funil
                    </Button>
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
                                    <p className="text-sm text-gray-600">Total de Visualizações</p>
                                    <p className="text-xl font-bold">{meusFunis.reduce((acc, funil) => acc + funil.views, 0).toLocaleString()}</p>
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
                                    <p className="text-xl font-bold">{meusFunis.reduce((acc, funil) => acc + funil.completions, 0).toLocaleString()}</p>
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
                                    <p className="text-xl font-bold">
                                        {(meusFunis.filter(f => f.views > 0).reduce((acc, funil) => acc + funil.conversionRate, 0) /
                                            meusFunis.filter(f => f.views > 0).length).toFixed(1)}%
                                    </p>
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
                                    <p className="text-sm text-gray-600">Receita Total</p>
                                    <p className="text-xl font-bold text-green-600">R$ 94.800</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Filtros e Ordenação */}
            <div className="mb-6 flex flex-wrap gap-4">
                {/* Status Filter */}
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

                {/* Category Filter */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category === 'todos' ? 'Todas as Categorias' : category}
                        </option>
                    ))}
                </select>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="updated">Última Atualização</option>
                    <option value="created">Data de Criação</option>
                    <option value="name">Nome</option>
                    <option value="views">Visualizações</option>
                    <option value="conversion">Taxa de Conversão</option>
                </select>

                <div className="flex-1"></div>

                <p className="text-sm text-gray-600 self-center">
                    {sortedFunis.length} de {meusFunis.length} funis
                </p>
            </div>

            {/* Funis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedFunis.map(funil => (
                    <Card key={funil.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            {/* Thumbnail */}
                            <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                                <img
                                    src={funil.thumbnail}
                                    alt={funil.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-lg line-clamp-1">{funil.name}</CardTitle>
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
                                        <DropdownMenuItem>
                                            <Share2 className="w-4 h-4 mr-2" />
                                            Compartilhar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleToggleStatus(funil.id, funil.status)}
                                            className="text-blue-600"
                                        >
                                            {funil.status === 'active' ? (
                                                <>
                                                    <Pause className="w-4 h-4 mr-2" />
                                                    Pausar
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Ativar
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
                        </CardHeader>

                        <CardContent>
                            {/* Status e Category */}
                            <div className="flex gap-2 mb-3">
                                <Badge
                                    className={`${statusConfig[funil.status as keyof typeof statusConfig].bgColor} ${statusConfig[funil.status as keyof typeof statusConfig].textColor}`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${statusConfig[funil.status as keyof typeof statusConfig].color} mr-1`}></div>
                                    {statusConfig[funil.status as keyof typeof statusConfig].label}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {funil.category}
                                </Badge>
                            </div>

                            {/* Template */}
                            <p className="text-xs text-gray-500 mb-3">
                                Baseado em: {funil.template}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Visualizações</p>
                                    <p className="font-semibold">{funil.views.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Conversões</p>
                                    <p className="font-semibold">{funil.completions.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Taxa de Conversão</p>
                                    <p className="font-semibold">{funil.conversionRate.toFixed(1)}%</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Receita</p>
                                    <p className="font-semibold text-green-600">{funil.revenue}</p>
                                </div>
                            </div>

                            {/* URL e Status de Publicação */}
                            {funil.url && (
                                <div className="mb-3">
                                    <p className="text-xs text-gray-500">URL:</p>
                                    <p className="text-xs text-blue-600 truncate">{funil.url}</p>
                                </div>
                            )}

                            {/* Última Edição */}
                            <div className="mb-3">
                                <p className="text-xs text-gray-500">
                                    Última edição: <span className="text-gray-700">{funil.lastEdited}</span>
                                </p>
                            </div>

                            {/* Dates */}
                            <div className="flex justify-between text-xs text-gray-500 mb-4">
                                <span>Criado: {formatDate(funil.createdAt)}</span>
                                <span>Atualizado: {formatDate(funil.updatedAt)}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => handleEditFunil(funil.id)}
                                    className="flex-1"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Editar
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <BarChart3 className="w-4 h-4 mr-1" />
                                    Métricas
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {sortedFunis.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Edit className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum funil encontrado
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {selectedStatus !== 'todos' || selectedCategory !== 'todos'
                            ? 'Tente ajustar os filtros'
                            : 'Você ainda não criou nenhum funil'
                        }
                    </p>
                    <Button>
                        <Edit className="w-4 h-4 mr-2" />
                        Criar Primeiro Funil
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MeusFunisPage;