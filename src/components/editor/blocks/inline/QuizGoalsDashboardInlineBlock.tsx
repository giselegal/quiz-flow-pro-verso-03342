import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Target, TrendingUp, Calendar, CheckCircle, AlertCircle, Clock, Award, Star, BarChart3, LineChart, Activity, ArrowUp, ArrowDown, Plus, Edit, RotateCcw, Settings, Filter, Download } from 'lucide-react';

interface QuizGoalsDashboardInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de dashboard de metas
}

/**
 * Componente inline para dashboard de metas e objetivos (Etapa 19)
 * Sistema de acompanhamento de objetivos com métricas e KPIs
 */
export const QuizGoalsDashboardInlineBlock: React.FC<QuizGoalsDashboardInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const {
    properties,
    handlePropertyChange,
    commonProps
  } = useInlineBlock({
    block,
    isSelected,
    onClick,
    onPropertyChange,
    className
  });

  const title = properties.title || 'Dashboard de Metas e Objetivos';
  const subtitle = properties.subtitle || 'Acompanhe seu progresso e mantenha o foco nos seus objetivos de desenvolvimento profissional';
  const overallProgress = properties.overallProgress || {
    totalGoals: 12,
    completedGoals: 8,
    inProgressGoals: 3,
    overdueGoals: 1,
    completionRate: 67,
    onTrackPercentage: 75,
    averageProgress: 72
  };
  const goals = properties.goals || [
    {
      id: 1,
      title: 'Melhorar Habilidades de Liderança',
      description: 'Desenvolver competências de liderança através de curso e prática',
      category: 'lideranca',
      priority: 'alta',
      status: 'em-progresso',
      progress: 85,
      targetDate: '2025-03-31',
      startDate: '2025-01-15',
      milestones: [
        { title: 'Completar Curso de Liderança', completed: true, date: '2025-02-15' },
        { title: 'Liderar Projeto Piloto', completed: true, date: '2025-02-28' },
        { title: 'Receber Feedback 360°', completed: false, date: '2025-03-15' },
        { title: 'Implementar Plano de Ação', completed: false, date: '2025-03-31' }
      ],
      metrics: [
        { name: 'Score de Liderança', current: 82, target: 90, unit: 'pts' },
        { name: 'Avaliação da Equipe', current: 4.2, target: 4.5, unit: '/5' }
      ],
      tags: ['liderança', 'gestão', 'desenvolvimento'],
      owner: 'João Silva',
      lastUpdate: '2025-01-25'
    },
    {
      id: 2,
      title: 'Certificação em Gestão de Projetos',
      description: 'Obter certificação PMP para avançar na carreira',
      category: 'certificacao',
      priority: 'alta',
      status: 'em-progresso',
      progress: 60,
      targetDate: '2025-06-30',
      startDate: '2025-01-01',
      milestones: [
        { title: 'Estudar Material Teórico', completed: true, date: '2025-02-01' },
        { title: 'Completar Simulados', completed: false, date: '2025-04-01' },
        { title: 'Agendar Exame', completed: false, date: '2025-05-01' },
        { title: 'Realizar Exame PMP', completed: false, date: '2025-06-01' }
      ],
      metrics: [
        { name: 'Horas de Estudo', current: 120, target: 200, unit: 'h' },
        { name: 'Score Simulados', current: 75, target: 85, unit: '%' }
      ],
      tags: ['certificação', 'projetos', 'PMP'],
      owner: 'João Silva',
      lastUpdate: '2025-01-24'
    },
    {
      id: 3,
      title: 'Construir Rede Profissional',
      description: 'Expandir network e estabelecer conexões estratégicas',
      category: 'networking',
      priority: 'média',
      status: 'em-progresso',
      progress: 40,
      targetDate: '2025-12-31',
      startDate: '2025-01-01',
      milestones: [
        { title: 'Participar de 5 Eventos', completed: true, date: '2025-03-01' },
        { title: 'Conectar com 50 Profissionais', completed: false, date: '2025-06-01' },
        { title: 'Estabelecer 10 Mentores', completed: false, date: '2025-09-01' },
        { title: 'Criar Grupo de Discussão', completed: false, date: '2025-12-01' }
      ],
      metrics: [
        { name: 'Novas Conexões', current: 23, target: 50, unit: '' },
        { name: 'Eventos Participados', current: 3, target: 12, unit: '' }
      ],
      tags: ['networking', 'relacionamentos', 'eventos'],
      owner: 'João Silva',
      lastUpdate: '2025-01-23'
    },
    {
      id: 4,
      title: 'Aumentar Produtividade Pessoal',
      description: 'Implementar metodologias para otimizar performance',
      category: 'produtividade',
      priority: 'média',
      status: 'concluida',
      progress: 100,
      targetDate: '2025-02-28',
      startDate: '2024-12-01',
      milestones: [
        { title: 'Implementar GTD', completed: true, date: '2024-12-15' },
        { title: 'Usar Técnica Pomodoro', completed: true, date: '2025-01-01' },
        { title: 'Automatizar Tarefas', completed: true, date: '2025-01-15' },
        { title: 'Medir Resultados', completed: true, date: '2025-02-15' }
      ],
      metrics: [
        { name: 'Tarefas Concluídas/Dia', current: 12, target: 10, unit: '' },
        { name: 'Tempo de Foco', current: 6.5, target: 6, unit: 'h' }
      ],
      tags: ['produtividade', 'metodologia', 'otimização'],
      owner: 'João Silva',
      lastUpdate: '2025-02-28'
    }
  ];
  const categoryStats = properties.categoryStats || [
    { category: 'lideranca', name: 'Liderança', goals: 3, completed: 2, progress: 78 },
    { category: 'certificacao', name: 'Certificações', goals: 2, completed: 0, progress: 45 },
    { category: 'networking', name: 'Networking', goals: 4, completed: 1, progress: 52 },
    { category: 'produtividade', name: 'Produtividade', goals: 3, completed: 3, progress: 100 }
  ];
  const insights = properties.insights || [
    {
      type: 'achievement',
      title: 'Meta Antecipada!',
      description: 'Você completou a meta de Produtividade 1 mês antes do prazo',
      priority: 'positive',
      date: '2025-01-25'
    },
    {
      type: 'warning',
      title: 'Atenção: Meta em Risco',
      description: 'A meta de Networking precisa de mais atenção para não atrasar',
      priority: 'warning',
      date: '2025-01-24'
    },
    {
      type: 'recommendation',
      title: 'Oportunidade de Melhoria',
      description: 'Considere dedicar mais tempo aos estudos para a certificação PMP',
      priority: 'info',
      date: '2025-01-23'
    }
  ];
  const performanceMetrics = properties.performanceMetrics || [
    { name: 'Taxa de Conclusão', value: 67, target: 80, trend: 'up', change: '+5%' },
    { name: 'Metas no Prazo', value: 75, target: 90, trend: 'up', change: '+8%' },
    { name: 'Produtividade Média', value: 72, target: 85, trend: 'stable', change: '0%' },
    { name: 'Satisfação Pessoal', value: 85, target: 90, trend: 'up', change: '+3%' }
  ];
  const showInsights = properties.showInsights || true;
  const showMetrics = properties.showMetrics || true;
  const showProgress = properties.showProgress || true;
  const showTimeline = properties.showTimeline || true;
  const dashboardStyle = properties.dashboardStyle || 'comprehensive'; // comprehensive, minimal, focus
  const theme = properties.theme || 'business';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getStatusColor = (status: string) => {
    const colors = {
      'concluida': 'bg-green-100 text-green-700 border-green-200',
      'em-progresso': 'bg-blue-100 text-blue-700 border-blue-200',
      'pausada': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'atrasada': 'bg-red-100 text-red-700 border-red-200',
      'cancelada': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors['em-progresso'];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'alta': 'bg-red-100 text-red-700',
      'média': 'bg-yellow-100 text-yellow-700',
      'baixa': 'bg-green-100 text-green-700'
    };
    return colors[priority as keyof typeof colors] || colors.média;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      lideranca: Target,
      certificacao: Award,
      networking: Activity,
      produtividade: BarChart3,
      desenvolvimento: TrendingUp
    };
    return icons[category as keyof typeof icons] || Target;
  };

  const getTrendIcon = (trend: string) => {
    const icons = {
      up: ArrowUp,
      down: ArrowDown,
      stable: RotateCcw
    };
    return icons[trend as keyof typeof icons] || RotateCcw;
  };

  const getInsightIcon = (type: string) => {
    const icons = {
      achievement: Award,
      warning: AlertCircle,
      recommendation: Star,
      info: Activity
    };
    return icons[type as keyof typeof icons] || Activity;
  };

  const getThemeClasses = () => {
    const themes = {
      business: {
        bg: 'from-slate-50 to-blue-50',
        border: 'border-slate-200',
        accent: 'text-slate-700',
        button: 'bg-slate-700 hover:bg-slate-800'
      },
      success: {
        bg: 'from-green-50 to-emerald-100',
        border: 'border-green-200',
        accent: 'text-green-700',
        button: 'bg-green-600 hover:bg-green-700'
      },
      dynamic: {
        bg: 'from-purple-50 to-blue-100',
        border: 'border-purple-200',
        accent: 'text-purple-700',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    };
    return themes[theme as keyof typeof themes] || themes.business;
  };

  const themeClasses = getThemeClasses();
  const filteredGoals = goals.filter(goal => {
    if (selectedCategory !== 'all' && goal.category !== selectedCategory) return false;
    if (selectedPeriod === 'overdue') return new Date(goal.targetDate) < new Date() && goal.status !== 'concluida';
    if (selectedPeriod === 'thisMonth') {
      const targetDate = new Date(goal.targetDate);
      const now = new Date();
      return targetDate.getMonth() === now.getMonth() && targetDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const daysUntilTarget = (targetDate: string) => {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[900px] p-8',
        `bg-gradient-to-br ${themeClasses.bg}`,
        `border ${themeClasses.border} rounded-lg`,
        'transition-all duration-300',
        isSelected && 'ring-2 ring-blue-500',
        className
      )}
    >
      {/* Botão de Edição */}
      {isSelected && (
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              // Ação de filtro
            }}
          >
            <Filter className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              // Ação de download/exportar
            }}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={isEditMode ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              toggleEditMode();
            }}
          >
            {isEditMode ? 'Salvar' : 'Editar'}
          </Button>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="text-center mb-8">
        {isEditMode ? (
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
              placeholder="Título do dashboard"
              className="w-full text-3xl font-bold text-center p-2 border border-gray-300 rounded"
            />
            <textarea
              value={subtitle}
              onChange={(e) => handlePropertyChange('subtitle', e.target.value)}
              placeholder="Subtítulo"
              rows={2}
              className="w-full text-center p-2 border border-gray-300 rounded resize-none"
            />
          </div>
        ) : (
          <div>
            <h1 className={cn('text-3xl font-bold mb-3', themeClasses.accent)}>
              {title}
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Métricas de Performance */}
      {showMetrics && (
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => {
              const TrendIconComponent = getTrendIcon(metric.trend);
              const trendColor = metric.trend === 'up' ? 'text-green-600' : 
                               metric.trend === 'down' ? 'text-red-600' : 'text-gray-600';
              
              return (
                <div key={index} className="bg-white rounded-lg border shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600">
                      {metric.name}
                    </h4>
                    <div className={cn('flex items-center gap-1', trendColor)}>
                      <TrendIconComponent className="w-4 h-4" />
                      <span className="text-xs">{metric.change}</span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {metric.value}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Meta: {metric.target}%
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        metric.value >= metric.target ? 'bg-green-500' : 'bg-blue-500'
                      )}
                      style={{ width: `${(metric.value / metric.target) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resumo Geral */}
      <div className="mb-8">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Resumo das Metas
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {overallProgress.totalGoals}
              </div>
              <div className="text-sm text-gray-600">Total de Metas</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {overallProgress.completedGoals}
              </div>
              <div className="text-sm text-gray-600">Concluídas</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {overallProgress.inProgressGoals}
              </div>
              <div className="text-sm text-gray-600">Em Progresso</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {overallProgress.overdueGoals}
              </div>
              <div className="text-sm text-gray-600">Em Atraso</div>
            </div>
          </div>

          {/* Barra de Progresso Geral */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
              <span className="text-sm text-gray-600">{overallProgress.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${overallProgress.completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Período */}
          <div className="flex gap-1">
            {[
              { key: 'current', label: 'Atual' },
              { key: 'thisMonth', label: 'Este Mês' },
              { key: 'overdue', label: 'Em Atraso' }
            ].map((period) => (
              <Badge
                key={period.key}
                variant={selectedPeriod === period.key ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedPeriod(period.key)}
              >
                {period.label}
              </Badge>
            ))}
          </div>

          {/* Categoria */}
          <div className="flex gap-1">
            <Badge
              variant={selectedCategory === 'all' ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory('all')}
            >
              Todas
            </Badge>
            {categoryStats.map((cat) => (
              <Badge
                key={cat.category}
                variant={selectedCategory === cat.category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat.category)}
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Metas */}
      <div className="space-y-4 mb-8">
        {filteredGoals.map((goal) => {
          const daysLeft = daysUntilTarget(goal.targetDate);
          const completedMilestones = goal.milestones.filter(m => m.completed).length;
          const totalMilestones = goal.milestones.length;
          const CategoryIconComponent = getCategoryIcon(goal.category);
          
          return (
            <div key={goal.id} className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-start gap-4">
                {/* Ícone da Categoria */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CategoryIconComponent className="text-blue-600" />
                  </div>
                </div>

                <div className="flex-1">
                  {/* Cabeçalho da Meta */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {goal.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {goal.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={cn('text-xs', getStatusColor(goal.status))}>
                        {goal.status}
                      </Badge>
                      <Badge className={cn('text-xs', getPriorityColor(goal.priority))}>
                        {goal.priority}
                      </Badge>
                    </div>
                  </div>

                  {/* Progresso */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progresso</span>
                      <span className="text-sm text-gray-600">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all duration-300',
                          goal.status === 'concluida' ? 'bg-green-500' :
                          goal.progress >= 80 ? 'bg-blue-500' :
                          goal.progress >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                        )}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Marcos */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Marcos</span>
                      <span className="text-sm text-gray-600">
                        {completedMilestones}/{totalMilestones} concluídos
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {goal.milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className={cn(
                            'w-3 h-3 rounded-full border-2',
                            milestone.completed 
                              ? 'bg-green-500 border-green-500' 
                              : 'bg-gray-200 border-gray-300'
                          )}
                          title={milestone.title}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Métricas */}
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      {goal.metrics.map((metric, index) => (
                        <div key={index} className="text-sm">
                          <span className="text-gray-600">{metric.name}:</span>
                          <span className="font-medium ml-1">
                            {metric.current}{metric.unit} / {metric.target}{metric.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rodapé */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {daysLeft > 0 ? `${daysLeft} dias restantes` : 
                           daysLeft === 0 ? 'Vence hoje' : `${Math.abs(daysLeft)} dias em atraso`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Atualizado em {goal.lastUpdate}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      {goal.status !== 'concluida' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Marcar Concluída
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights e Alertas */}
      {showInsights && (
        <div className="mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Insights e Alertas
            </h3>
            
            <div className="space-y-3">
              {insights.map((insight, index) => {
                const InsightIconComponent = getInsightIcon(insight.type);
                const insightColors = {
                  positive: 'border-green-200 bg-green-50 text-green-700',
                  warning: 'border-yellow-200 bg-yellow-50 text-yellow-700',
                  info: 'border-blue-200 bg-blue-50 text-blue-700'
                };
                
                return (
                  <div
                    key={index}
                    className={cn(
                      'p-4 rounded-lg border-l-4',
                      insightColors[insight.priority as keyof typeof insightColors]
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <InsightIconComponent className="flex-shrink-0 mt-0.5 w-5 h-5" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{insight.title}</h4>
                        <p className="text-sm opacity-90">{insight.description}</p>
                        <div className="text-xs opacity-70 mt-2">{insight.date}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Botão de Nova Meta */}
      {!isEditMode && (
        <div className="text-center">
          <Button
            size="lg"
            className={cn(
              'px-8 py-3 text-lg font-medium text-white rounded-lg',
              'transition-all duration-200 transform hover:scale-105',
              'shadow-lg hover:shadow-xl',
              themeClasses.button
            )}
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Nova Meta
          </Button>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showInsights ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showInsights', !showInsights)}
            >
              Mostrar Insights
            </Badge>
            
            <Badge
              variant={showMetrics ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showMetrics', !showMetrics)}
            >
              Mostrar Métricas
            </Badge>

            <Badge
              variant={showProgress ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showProgress', !showProgress)}
            >
              Mostrar Progresso
            </Badge>

            <Badge
              variant={showTimeline ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showTimeline', !showTimeline)}
            >
              Mostrar Timeline
            </Badge>
          </div>

          {/* Estilo do Dashboard */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estilo do Dashboard
            </label>
            <div className="flex gap-2">
              {['comprehensive', 'minimal', 'focus'].map((style) => (
                <Badge
                  key={style}
                  variant={dashboardStyle === style ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('dashboardStyle', style)}
                >
                  {style}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <div className="flex gap-2">
              {['business', 'success', 'dynamic'].map((themeOption) => (
                <Badge
                  key={themeOption}
                  variant={theme === themeOption ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('theme', themeOption)}
                >
                  {themeOption}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGoalsDashboardInlineBlock;
