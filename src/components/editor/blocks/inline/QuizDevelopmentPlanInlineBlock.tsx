import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Target, Calendar, BookOpen, Award, CheckCircle, Clock, TrendingUp, User, Users, Brain, Lightbulb, Star, ArrowRight, Play, Pause, RotateCcw, Settings, Download, Share } from 'lucide-react';

interface QuizDevelopmentPlanInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de plano de desenvolvimento
}

/**
 * Componente inline para planos de desenvolvimento personalizados (Etapa 18)
 * Sistema de planejamento de carreira e desenvolvimento de competências
 */
export const QuizDevelopmentPlanInlineBlock: React.FC<QuizDevelopmentPlanInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');
  const [selectedView, setSelectedView] = useState('overview');
  
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

  const title = properties.title || 'Seu Plano de Desenvolvimento Personalizado';
  const subtitle = properties.subtitle || 'Um roadmap customizado baseado em suas competências atuais e objetivos de carreira';
  const userGoals = properties.userGoals || {
    shortTerm: 'Melhorar habilidades de liderança e comunicação',
    mediumTerm: 'Assumir posição de gestão em 12 meses',
    longTerm: 'Tornar-se diretor em 3 anos',
    currentLevel: 'Coordenador',
    targetLevel: 'Gerente'
  };
  const competencyGaps = properties.competencyGaps || [
    {
      competency: 'Liderança',
      currentScore: 75,
      targetScore: 90,
      priority: 'alta',
      timeToTarget: '6 meses',
      actions: [
        'Curso de Liderança Avançada',
        'Mentoria com líder sênior',
        'Liderar projeto estratégico'
      ]
    },
    {
      competency: 'Comunicação',
      currentScore: 68,
      targetScore: 85,
      priority: 'alta',
      timeToTarget: '4 meses',
      actions: [
        'Workshop de Comunicação Executiva',
        'Prática de apresentações',
        'Feedback 360º'
      ]
    },
    {
      competency: 'Estratégia',
      currentScore: 60,
      targetScore: 80,
      priority: 'média',
      timeToTarget: '8 meses',
      actions: [
        'MBA Executivo',
        'Participação em planejamento estratégico',
        'Análise de casos estratégicos'
      ]
    },
    {
      competency: 'Inovação',
      currentScore: 55,
      targetScore: 75,
      priority: 'baixa',
      timeToTarget: '12 meses',
      actions: [
        'Design Thinking Workshop',
        'Participação em hackathons',
        'Projeto de inovação'
      ]
    }
  ];
  const developmentActivities = properties.developmentActivities || [
    {
      id: 1,
      title: 'Curso: Liderança de Alta Performance',
      type: 'curso',
      provider: 'Business School',
      duration: '40 horas',
      format: 'Online',
      startDate: '2025-02-10',
      endDate: '2025-03-15',
      status: 'programado',
      competencies: ['Liderança', 'Comunicação'],
      priority: 'alta',
      investment: 'R$ 1.200',
      expectedOutcome: 'Desenvolver técnicas avançadas de liderança e gestão de equipes'
    },
    {
      id: 2,
      title: 'Mentoria Executiva',
      type: 'mentoria',
      provider: 'Senior Leader',
      duration: '6 meses',
      format: 'Presencial/Online',
      startDate: '2025-02-01',
      endDate: '2025-08-01',
      status: 'em-andamento',
      competencies: ['Liderança', 'Estratégia'],
      priority: 'alta',
      investment: 'R$ 3.000',
      expectedOutcome: 'Guidance personalizado para transição de carreira'
    },
    {
      id: 3,
      title: 'Projeto: Transformação Digital',
      type: 'projeto',
      provider: 'Empresa',
      duration: '4 meses',
      format: 'Presencial',
      startDate: '2025-03-01',
      endDate: '2025-06-30',
      status: 'programado',
      competencies: ['Liderança', 'Inovação', 'Estratégia'],
      priority: 'alta',
      investment: 'Tempo dedicado',
      expectedOutcome: 'Liderar mudança organizacional significativa'
    }
  ];
  const milestones = properties.milestones || [
    {
      id: 1,
      title: 'Completar Curso de Liderança',
      date: '2025-03-15',
      status: 'pendente',
      competencies: ['Liderança'],
      description: 'Finalizar curso e aplicar aprendizados'
    },
    {
      id: 2,
      title: 'Avaliação 360º',
      date: '2025-04-30',
      status: 'pendente',
      competencies: ['Comunicação', 'Liderança'],
      description: 'Receber feedback estruturado da equipe'
    },
    {
      id: 3,
      title: 'Apresentação Estratégica',
      date: '2025-06-15',
      status: 'pendente',
      competencies: ['Comunicação', 'Estratégia'],
      description: 'Apresentar projeto para diretoria'
    },
    {
      id: 4,
      title: 'Promoção para Gerente',
      date: '2025-12-31',
      status: 'objetivo',
      competencies: ['Liderança', 'Comunicação', 'Estratégia'],
      description: 'Alcançar posição de gestão desejada'
    }
  ];
  const progressTracking = properties.progressTracking || {
    overallProgress: 25,
    activitiesCompleted: 2,
    totalActivities: 8,
    competenciesImproved: 1,
    totalCompetencies: 4,
    timeInvested: 45,
    budgetUsed: 1200,
    totalBudget: 8000
  };
  const showProgress = properties.showProgress || true;
  const showBudget = properties.showBudget || true;
  const showTimeline = properties.showTimeline || true;
  const showRecommendations = properties.showRecommendations || true;
  const planType = properties.planType || 'comprehensive'; // comprehensive, focused, agile
  const theme = properties.theme || 'professional';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getPriorityColor = (priority: string) => {
    const colors = {
      alta: 'bg-red-100 text-red-700 border-red-200',
      média: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      baixa: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority as keyof typeof colors] || colors.média;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'programado': 'bg-blue-100 text-blue-700',
      'em-andamento': 'bg-orange-100 text-orange-700',
      'concluido': 'bg-green-100 text-green-700',
      'pausado': 'bg-gray-100 text-gray-700',
      'pendente': 'bg-yellow-100 text-yellow-700',
      'objetivo': 'bg-purple-100 text-purple-700'
    };
    return colors[status as keyof typeof colors] || colors.programado;
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      curso: BookOpen,
      mentoria: User,
      projeto: Target,
      workshop: Users,
      leitura: Brain,
      conferencia: Star
    };
    return icons[type as keyof typeof icons] || BookOpen;
  };

  const getThemeClasses = () => {
    const themes = {
      professional: {
        bg: 'from-slate-50 to-blue-50',
        border: 'border-slate-200',
        accent: 'text-slate-700',
        button: 'bg-slate-700 hover:bg-slate-800'
      },
      growth: {
        bg: 'from-green-50 to-emerald-100',
        border: 'border-green-200',
        accent: 'text-green-700',
        button: 'bg-green-600 hover:bg-green-700'
      },
      innovative: {
        bg: 'from-purple-50 to-indigo-100',
        border: 'border-purple-200',
        accent: 'text-purple-700',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    };
    return themes[theme as keyof typeof themes] || themes.professional;
  };

  const themeClasses = getThemeClasses();

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
              // Ação de download/exportar
            }}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              // Ação de compartilhar
            }}
          >
            <Share className="w-4 h-4" />
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
              placeholder="Título do plano"
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

      {/* Resumo dos Objetivos */}
      <div className="mb-8">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Seus Objetivos de Desenvolvimento
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Situação Atual</h4>
              <p className="text-gray-600 text-sm mb-4">{userGoals.currentLevel}</p>
              
              <h4 className="font-medium text-gray-700 mb-2">Objetivo de Curto Prazo</h4>
              <p className="text-gray-600 text-sm">{userGoals.shortTerm}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Meta de Posição</h4>
              <p className="text-gray-600 text-sm mb-4">{userGoals.targetLevel}</p>
              
              <h4 className="font-medium text-gray-700 mb-2">Visão de Longo Prazo</h4>
              <p className="text-gray-600 text-sm">{userGoals.longTerm}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Abas de Navegação */}
      <div className="mb-6">
        <div className="flex bg-white rounded-lg border shadow-sm p-1">
          {[
            { key: 'overview', label: 'Visão Geral', icon: Target },
            { key: 'competencies', label: 'Competências', icon: TrendingUp },
            { key: 'activities', label: 'Atividades', icon: BookOpen },
            { key: 'timeline', label: 'Timeline', icon: Calendar }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedView(tab.key)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  selectedView === tab.key
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                )}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progresso Geral */}
      {showProgress && selectedView === 'overview' && (
        <div className="mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Progresso do Desenvolvimento
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {progressTracking.overallProgress}%
                </div>
                <div className="text-sm text-gray-600">Progresso Geral</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {progressTracking.activitiesCompleted}/{progressTracking.totalActivities}
                </div>
                <div className="text-sm text-gray-600">Atividades</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {progressTracking.competenciesImproved}/{progressTracking.totalCompetencies}
                </div>
                <div className="text-sm text-gray-600">Competências</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {progressTracking.timeInvested}h
                </div>
                <div className="text-sm text-gray-600">Tempo Investido</div>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progresso do Plano</span>
                <span className="text-sm text-gray-600">{progressTracking.overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressTracking.overallProgress}%` }}
                />
              </div>
            </div>

            {/* Orçamento */}
            {showBudget && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Investimento</span>
                  <span className="text-sm text-gray-600">
                    R$ {progressTracking.budgetUsed.toLocaleString()} / R$ {progressTracking.totalBudget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: `${(progressTracking.budgetUsed / progressTracking.totalBudget) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gaps de Competências */}
      {selectedView === 'competencies' && (
        <div className="space-y-4">
          {competencyGaps.map((gap, index) => {
            const improvement = gap.targetScore - gap.currentScore;
            const progressPercentage = (gap.currentScore / gap.targetScore) * 100;
            
            return (
              <div key={index} className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {gap.competency}
                      </h4>
                      <Badge className={cn('text-xs', getPriorityColor(gap.priority))}>
                        {gap.priority} prioridade
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Atual:</span> {gap.currentScore}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Meta:</span> {gap.targetScore}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Melhoria:</span> +{improvement} pontos
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Prazo:</span> {gap.timeToTarget}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barra de Progresso da Competência */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-4 relative">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {gap.currentScore} → {gap.targetScore}
                    </div>
                  </div>
                </div>

                {/* Ações Recomendadas */}
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Ações Recomendadas:</h5>
                  <div className="space-y-2">
                    {gap.actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        <span className="text-sm text-gray-600">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Atividades de Desenvolvimento */}
      {selectedView === 'activities' && (
        <div className="space-y-4">
          {developmentActivities.map((activity) => {
            const ActivityIconComponent = getActivityIcon(activity.type);
            
            return (
              <div key={activity.id} className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ActivityIconComponent className="text-blue-600" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {activity.provider} • {activity.format} • {activity.duration}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={cn('text-xs', getStatusColor(activity.status))}>
                          {activity.status}
                        </Badge>
                        <Badge className={cn('text-xs', getPriorityColor(activity.priority))}>
                          {activity.priority}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {activity.expectedOutcome}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(activity.startDate).toLocaleDateString('pt-BR')} - {new Date(activity.endDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="font-medium text-green-600">
                          {activity.investment}
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {activity.competencies.map((comp) => (
                          <Badge key={comp} variant="outline" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Controles de Atividade */}
                    <div className="flex gap-2 mt-4">
                      {activity.status === 'programado' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Play className="w-4 h-4 mr-1" />
                          Iniciar
                        </Button>
                      )}
                      {activity.status === 'em-andamento' && (
                        <>
                          <Button size="sm" variant="outline">
                            <Pause className="w-4 h-4 mr-1" />
                            Pausar
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Concluir
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost">
                        <Settings className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline de Marcos */}
      {selectedView === 'timeline' && showTimeline && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Timeline de Marcos
          </h3>
          
          <div className="relative">
            {/* Linha do Timeline */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
            
            <div className="space-y-6">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="relative flex items-start gap-4">
                  {/* Marcador do Timeline */}
                  <div className={cn(
                    'relative z-10 flex-shrink-0 w-12 h-12 rounded-full',
                    'flex items-center justify-center text-white',
                    milestone.status === 'concluido' ? 'bg-green-500' :
                    milestone.status === 'objetivo' ? 'bg-purple-500' : 'bg-blue-500'
                  )}>
                    {milestone.status === 'concluido' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : milestone.status === 'objetivo' ? (
                      <Star className="w-6 h-6" />
                    ) : (
                      <Target className="w-6 h-6" />
                    )}
                  </div>
                  
                  {/* Conteúdo do Marco */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {milestone.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {milestone.description}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={cn('text-xs', getStatusColor(milestone.status))}>
                          {milestone.status}
                        </Badge>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(milestone.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {milestone.competencies.map((comp) => (
                        <Badge key={comp} variant="outline" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Botão de Ação */}
      {!isEditMode && (
        <div className="text-center mt-8">
          <Button
            size="lg"
            className={cn(
              'px-8 py-3 text-lg font-medium text-white rounded-lg',
              'transition-all duration-200 transform hover:scale-105',
              'shadow-lg hover:shadow-xl',
              themeClasses.button
            )}
          >
            Atualizar Meu Plano
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showProgress ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showProgress', !showProgress)}
            >
              Mostrar Progresso
            </Badge>
            
            <Badge
              variant={showBudget ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showBudget', !showBudget)}
            >
              Mostrar Orçamento
            </Badge>

            <Badge
              variant={showTimeline ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showTimeline', !showTimeline)}
            >
              Mostrar Timeline
            </Badge>

            <Badge
              variant={showRecommendations ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showRecommendations', !showRecommendations)}
            >
              Mostrar Recomendações
            </Badge>
          </div>

          {/* Tipo de Plano */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Plano
            </label>
            <div className="flex gap-2">
              {['comprehensive', 'focused', 'agile'].map((type) => (
                <Badge
                  key={type}
                  variant={planType === type ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('planType', type)}
                >
                  {type}
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
              {['professional', 'growth', 'innovative'].map((themeOption) => (
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

export default QuizDevelopmentPlanInlineBlock;
