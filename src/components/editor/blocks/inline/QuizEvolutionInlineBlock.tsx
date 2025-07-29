import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { TrendingUp, Calendar, Target, Award, BarChart3, LineChart, Activity, ChevronRight, CheckCircle, Clock, Star, Trophy, Zap, Users, Brain, Lightbulb, ArrowUp } from 'lucide-react';

interface QuizEvolutionInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de evolução
}

/**
 * Componente inline para evolução e crescimento (Etapa 16)
 * Visualização do progresso temporal e desenvolvimento de competências
 */
export const QuizEvolutionInlineBlock: React.FC<QuizEvolutionInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('3months');
  
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

  const title = properties.title || 'Sua Jornada de Evolução';
  const subtitle = properties.subtitle || 'Acompanhe seu crescimento profissional e desenvolvimento contínuo ao longo do tempo';
  const timelineData = properties.timelineData || [
    {
      id: 1,
      date: '2025-01-01',
      type: 'assessment',
      title: 'Primeira Avaliação',
      description: 'Iniciou sua jornada de desenvolvimento',
      score: 65,
      competencies: ['lideranca', 'comunicacao'],
      icon: 'activity',
      category: 'inicio'
    },
    {
      id: 2,
      date: '2025-01-05',
      type: 'milestone',
      title: 'Primeiro Marco',
      description: 'Completou módulo de Liderança Básica',
      score: 72,
      competencies: ['lideranca'],
      icon: 'target',
      category: 'progresso'
    },
    {
      id: 3,
      date: '2025-01-10',
      type: 'badge',
      title: 'Badge Conquistado',
      description: 'Comunicador Eficaz - Nível Bronze',
      score: 78,
      competencies: ['comunicacao'],
      icon: 'award',
      category: 'conquista'
    },
    {
      id: 4,
      date: '2025-01-15',
      type: 'assessment',
      title: 'Reavaliação',
      description: 'Melhoria significativa em todas as áreas',
      score: 85,
      competencies: ['lideranca', 'comunicacao', 'inovacao'],
      icon: 'trending-up',
      category: 'evolucao'
    },
    {
      id: 5,
      date: '2025-01-20',
      type: 'achievement',
      title: 'Objetivo Alcançado',
      description: 'Meta trimestral de 80% atingida',
      score: 88,
      competencies: ['lideranca', 'comunicacao', 'inovacao', 'estrategia'],
      icon: 'trophy',
      category: 'sucesso'
    }
  ];
  const competencyEvolution = properties.competencyEvolution || [
    {
      name: 'Liderança',
      slug: 'lideranca',
      color: 'blue',
      data: [
        { date: '2025-01-01', score: 65 },
        { date: '2025-01-05', score: 72 },
        { date: '2025-01-10', score: 75 },
        { date: '2025-01-15', score: 82 },
        { date: '2025-01-20', score: 88 }
      ]
    },
    {
      name: 'Comunicação',
      slug: 'comunicacao',
      color: 'green',
      data: [
        { date: '2025-01-01', score: 58 },
        { date: '2025-01-05', score: 58 },
        { date: '2025-01-10', score: 78 },
        { date: '2025-01-15', score: 83 },
        { date: '2025-01-20', score: 85 }
      ]
    },
    {
      name: 'Inovação',
      slug: 'inovacao',
      color: 'purple',
      data: [
        { date: '2025-01-01', score: 45 },
        { date: '2025-01-05', score: 48 },
        { date: '2025-01-10', score: 52 },
        { date: '2025-01-15', score: 75 },
        { date: '2025-01-20', score: 82 }
      ]
    },
    {
      name: 'Estratégia',
      slug: 'estrategia',
      color: 'orange',
      data: [
        { date: '2025-01-01', score: 40 },
        { date: '2025-01-05', score: 42 },
        { date: '2025-01-10', score: 45 },
        { date: '2025-01-15', score: 68 },
        { date: '2025-01-20', score: 79 }
      ]
    }
  ];
  const statistics = properties.statistics || {
    totalAssessments: 12,
    improvementRate: 35.4,
    averageScore: 82.5,
    topCompetency: 'Liderança',
    streakDays: 25,
    badgesEarned: 8
  };
  const insights = properties.insights || [
    {
      id: 1,
      type: 'positive',
      title: 'Crescimento Acelerado',
      description: 'Suas pontuações aumentaram 35% nos últimos 3 meses',
      icon: 'trending-up'
    },
    {
      id: 2,
      type: 'recommendation',
      title: 'Área de Foco',
      description: 'Continue desenvolvendo suas habilidades de Estratégia para equilibrar seu perfil',
      icon: 'lightbulb'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Destaque do Mês',
      description: 'Você está no top 10% dos usuários em Liderança',
      icon: 'star'
    }
  ];
  const showStatistics = properties.showStatistics || true;
  const showInsights = properties.showInsights || true;
  const showCompetencyCharts = properties.showCompetencyCharts || true;
  const chartType = properties.chartType || 'line'; // line, area, bar
  const theme = properties.theme || 'professional';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getEventIcon = (iconType: string) => {
    const icons = {
      activity: Activity,
      target: Target,
      award: Award,
      'trending-up': TrendingUp,
      trophy: Trophy,
      zap: Zap,
      users: Users,
      brain: Brain,
      lightbulb: Lightbulb,
      star: Star
    };
    const IconComponent = icons[iconType as keyof typeof icons] || Activity;
    return <IconComponent className="w-5 h-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      inicio: 'bg-gray-500',
      progresso: 'bg-blue-500',
      conquista: 'bg-green-500',
      evolucao: 'bg-purple-500',
      sucesso: 'bg-yellow-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getCompetencyColor = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100',
        border: 'border-blue-500',
        text: 'text-blue-700',
        line: 'stroke-blue-500'
      },
      green: {
        bg: 'bg-green-100',
        border: 'border-green-500',
        text: 'text-green-700',
        line: 'stroke-green-500'
      },
      purple: {
        bg: 'bg-purple-100',
        border: 'border-purple-500',
        text: 'text-purple-700',
        line: 'stroke-purple-500'
      },
      orange: {
        bg: 'bg-orange-100',
        border: 'border-orange-500',
        text: 'text-orange-700',
        line: 'stroke-orange-500'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getThemeClasses = () => {
    const themes = {
      professional: {
        bg: 'from-slate-50 to-gray-100',
        border: 'border-gray-200',
        accent: 'text-gray-700',
        button: 'bg-gray-700 hover:bg-gray-800'
      },
      vibrant: {
        bg: 'from-blue-50 to-indigo-100',
        border: 'border-blue-200',
        accent: 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      warm: {
        bg: 'from-orange-50 to-red-100',
        border: 'border-orange-200',
        accent: 'text-orange-700',
        button: 'bg-orange-600 hover:bg-orange-700'
      }
    };
    return themes[theme as keyof typeof themes] || themes.professional;
  };

  const themeClasses = getThemeClasses();
  const filteredTimeline = timelineData.filter(item => {
    const itemDate = new Date(item.date);
    const now = new Date();
    const monthsBack = selectedPeriod === '1month' ? 1 : selectedPeriod === '3months' ? 3 : 12;
    const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate());
    return itemDate >= cutoffDate;
  });

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
        <div className="absolute top-2 right-2">
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
              placeholder="Título da evolução"
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

      {/* Filtros de Período */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-white rounded-lg border shadow-sm p-1">
          {[
            { key: '1month', label: '1 Mês' },
            { key: '3months', label: '3 Meses' },
            { key: '12months', label: '1 Ano' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                selectedPeriod === period.key
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Estatísticas Gerais */}
      {showStatistics && (
        <div className="mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Estatísticas de Crescimento
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {statistics.totalAssessments}
                </div>
                <div className="text-xs text-gray-600">Avaliações</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1 flex items-center justify-center gap-1">
                  +{statistics.improvementRate}%
                  <ArrowUp className="w-4 h-4" />
                </div>
                <div className="text-xs text-gray-600">Melhoria</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {statistics.averageScore}
                </div>
                <div className="text-xs text-gray-600">Média Geral</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {statistics.topCompetency}
                </div>
                <div className="text-xs text-gray-600">Top Competência</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {statistics.streakDays}
                </div>
                <div className="text-xs text-gray-600">Dias Seguidos</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {statistics.badgesEarned}
                </div>
                <div className="text-xs text-gray-600">Badges</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evolução das Competências */}
      {showCompetencyCharts && (
        <div className="mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Evolução por Competência
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {competencyEvolution.map((competency) => {
                const colorClasses = getCompetencyColor(competency.color);
                const latestScore = competency.data[competency.data.length - 1]?.score || 0;
                const firstScore = competency.data[0]?.score || 0;
                const improvement = latestScore - firstScore;
                
                return (
                  <div
                    key={competency.slug}
                    className={cn(
                      'p-4 rounded-lg border-l-4',
                      colorClasses.bg,
                      colorClasses.border
                    )}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className={cn('font-semibold', colorClasses.text)}>
                        {competency.name}
                      </h4>
                      <div className="text-right">
                        <div className={cn('text-2xl font-bold', colorClasses.text)}>
                          {latestScore}
                        </div>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          <ArrowUp className="w-3 h-3" />
                          +{improvement} pts
                        </div>
                      </div>
                    </div>
                    
                    {/* Mini Gráfico */}
                    <div className="h-16 relative">
                      <svg className="w-full h-full">
                        <polyline
                          fill="none"
                          stroke={`var(--${competency.color}-500)`}
                          strokeWidth="2"
                          points={competency.data.map((point, index) => {
                            const x = (index / (competency.data.length - 1)) * 100;
                            const y = 100 - (point.score / 100) * 100;
                            return `${x},${y}`;
                          }).join(' ')}
                        />
                        {competency.data.map((point, index) => {
                          const x = (index / (competency.data.length - 1)) * 100;
                          const y = 100 - (point.score / 100) * 100;
                          return (
                            <circle
                              key={index}
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="3"
                              fill={`var(--${competency.color}-500)`}
                            />
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Timeline de Evolução */}
      <div className="mb-8">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Timeline de Conquistas
          </h3>
          
          <div className="relative">
            {/* Linha do Timeline */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
            
            <div className="space-y-6">
              {filteredTimeline.map((event, index) => (
                <div key={event.id} className="relative flex items-start gap-4">
                  {/* Ícone do Evento */}
                  <div className={cn(
                    'relative z-10 flex-shrink-0 w-12 h-12 rounded-full',
                    'flex items-center justify-center text-white',
                    getCategoryColor(event.category)
                  )}>
                    {getEventIcon(event.icon)}
                  </div>
                  
                  {/* Conteúdo do Evento */}
                  <div className="flex-1 min-w-0">
                    {isEditMode ? (
                      <div className="space-y-2 bg-gray-50 p-3 rounded">
                        <input
                          type="text"
                          value={event.title}
                          onChange={(e) => {
                            const updatedTimeline = timelineData.map(item =>
                              item.id === event.id ? { ...item, title: e.target.value } : item
                            );
                            handlePropertyChange('timelineData', updatedTimeline);
                          }}
                          className="w-full font-semibold p-1 border border-gray-300 rounded text-sm"
                        />
                        <textarea
                          value={event.description}
                          onChange={(e) => {
                            const updatedTimeline = timelineData.map(item =>
                              item.id === event.id ? { ...item, description: e.target.value } : item
                            );
                            handlePropertyChange('timelineData', updatedTimeline);
                          }}
                          rows={2}
                          className="w-full text-sm p-1 border border-gray-300 rounded resize-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-800">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge className="text-xs">
                              Score: {event.score}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">
                          {event.description}
                        </p>
                        
                        <div className="flex gap-1">
                          {event.competencies.map((comp) => {
                            const competency = competencyEvolution.find(c => c.slug === comp);
                            const colorClasses = competency ? getCompetencyColor(competency.color) : getCompetencyColor('blue');
                            
                            return (
                              <Badge
                                key={comp}
                                variant="outline"
                                className={cn('text-xs capitalize', colorClasses.text)}
                              >
                                {competency?.name || comp}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights e Recomendações */}
      {showInsights && (
        <div className="mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Insights de Desenvolvimento
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((insight) => {
                const insightColors = {
                  positive: 'border-green-200 bg-green-50 text-green-700',
                  recommendation: 'border-blue-200 bg-blue-50 text-blue-700',
                  achievement: 'border-yellow-200 bg-yellow-50 text-yellow-700'
                };
                
                return (
                  <div
                    key={insight.id}
                    className={cn(
                      'p-4 rounded-lg border-2',
                      insightColors[insight.type as keyof typeof insightColors]
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getEventIcon(insight.icon)}
                      </div>
                      
                      <div>
                        {isEditMode ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={insight.title}
                              onChange={(e) => {
                                const updatedInsights = insights.map(item =>
                                  item.id === insight.id ? { ...item, title: e.target.value } : item
                                );
                                handlePropertyChange('insights', updatedInsights);
                              }}
                              className="w-full font-semibold p-1 border border-gray-300 rounded text-sm"
                            />
                            <textarea
                              value={insight.description}
                              onChange={(e) => {
                                const updatedInsights = insights.map(item =>
                                  item.id === insight.id ? { ...item, description: e.target.value } : item
                                );
                                handlePropertyChange('insights', updatedInsights);
                              }}
                              rows={3}
                              className="w-full text-sm p-1 border border-gray-300 rounded resize-none"
                            />
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-semibold mb-1 text-sm">
                              {insight.title}
                            </h4>
                            <p className="text-sm leading-relaxed">
                              {insight.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Botão de Ação */}
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
            Continuar Evolução
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showStatistics ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showStatistics', !showStatistics)}
            >
              Mostrar Estatísticas
            </Badge>
            
            <Badge
              variant={showInsights ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showInsights', !showInsights)}
            >
              Mostrar Insights
            </Badge>

            <Badge
              variant={showCompetencyCharts ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showCompetencyCharts', !showCompetencyCharts)}
            >
              Mostrar Gráficos
            </Badge>
          </div>

          {/* Tipo de Gráfico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Gráfico
            </label>
            <div className="flex gap-2">
              {['line', 'area', 'bar'].map((type) => (
                <Badge
                  key={type}
                  variant={chartType === type ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('chartType', type)}
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
              {['professional', 'vibrant', 'warm'].map((themeOption) => (
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

export default QuizEvolutionInlineBlock;
