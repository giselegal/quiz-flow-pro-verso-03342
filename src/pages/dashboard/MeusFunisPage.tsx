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

// Mock data para funis do usuário
const meusFunis = [
    {
        id: 'funil-1',
        name: 'Quiz de Marketing Digital',
        description: 'Quiz personalizado para captar leads interessados em marketing digital',
        status: 'active',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        template: 'Quiz de Personalidade',
        views: 1250,
        completions: 890,
        conversionRate: 71.2,
        category: 'Marketing',
        questions: 6,
        avgTime: '4 min',
        thumbnail: 'https://via.placeholder.com/200x120/3b82f6/ffffff?text=Marketing+Quiz'
    },
    {
        id: 'funil-2',
        name: 'Avaliação de Satisfação',
        description: 'Pesquisa customizada para medir satisfação dos clientes',
        status: 'active',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-22',
        template: 'Pesquisa de Satisfação',
        views: 2100,
        completions: 1850,
        conversionRate: 88.1,
        category: 'Feedback',
        questions: 8,
        avgTime: '5 min',
        thumbnail: 'https://via.placeholder.com/200x120/10b981/ffffff?text=Satisfacao'
    },
    {
        id: 'funil-3',
        name: 'Calculadora ROI Personalizada',
        description: 'Ferramenta personalizada para demonstrar ROI dos nossos serviços',
        status: 'draft',
        createdAt: '2024-01-18',
        updatedAt: '2024-01-22',
        template: 'Calculadora de ROI',
        views: 0,
        completions: 0,
        conversionRate: 0,
        category: 'Vendas',
        questions: 7,
        avgTime: '6 min',
        thumbnail: 'https://via.placeholder.com/200x120/ef4444/ffffff?text=ROI+Calc'
    },
    {
        id: 'funil-4',
        name: 'Onboarding Tech Team',
        description: 'Processo de integração para novos desenvolvedores',
        status: 'paused',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-15',
        template: 'Onboarding Interativo',
        views: 45,
        completions: 32,
        conversionRate: 71.1,
        category: 'RH',
        questions: 5,
        avgTime: '8 min',
        thumbnail: 'https://via.placeholder.com/200x120/8b5cf6/ffffff?text=Onboarding'
    },
    {
        id: 'funil-5',
        name: 'Lead Scoring B2B',
        description: 'Funil avançado para qualificação automática de leads empresariais',
        status: 'active',
        createdAt: '2023-12-20',
        updatedAt: '2024-01-21',
        template: 'Funil de Vendas B2B',
        views: 3200,
        completions: 2100,
        conversionRate: 65.6,
        category: 'Vendas',
        questions: 9,
        avgTime: '7 min',
        thumbnail: 'https://via.placeholder.com/200x120/f59e0b/ffffff?text=B2B+Scoring'
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

    const categories = ['todos', ...Array.from(new Set(meusFunis.map(funil => funil.category)))];
    const statusOptions = ['todos', 'active', 'draft', 'paused'];

    const filteredFunis = meusFunis.filter(funil => {
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
        // Aqui redirecionaria para o editor com o funil carregado
    };

    const handleDuplicateFunil = (funilId: string) => {
        console.log(`Duplicando funil: ${funilId}`);
    };

    const handleDeleteFunil = (funilId: string) => {
        console.log(`Excluindo funil: ${funilId}`);
    };

    const handleToggleStatus = (funilId: string, currentStatus: string) => {
        console.log(`Alterando status do funil ${funilId} de ${currentStatus}`);
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
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
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
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Funis Ativos</p>
                                    <p className="text-xl font-bold">{meusFunis.filter(f => f.status === 'active').length}</p>
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
                                    <p className="text-gray-500">Tempo Médio</p>
                                    <p className="font-semibold">{funil.avgTime}</p>
                                </div>
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