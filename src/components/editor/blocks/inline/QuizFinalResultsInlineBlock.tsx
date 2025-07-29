import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Trophy, Star, TrendingUp, Download, Share, Target, Award, CheckCircle, BarChart3, Users, Brain, Lightbulb, ArrowRight, Calendar, Clock, Mail, Phone, ExternalLink, ChevronRight, Play } from 'lucide-react';

interface QuizFinalResultsInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de resultados finais
}

/**
 * Componente inline para resultados finais consolidados (Etapa 20)
 * Apresentação completa dos resultados, perfil e próximos passos
 */
export const QuizFinalResultsInlineBlock: React.FC<QuizFinalResultsInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState('overview');
  
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

  const title = properties.title || 'Seus Resultados Completos';
  const subtitle = properties.subtitle || 'Parabéns! Aqui está seu perfil profissional completo e as recomendações personalizadas para seu desenvolvimento';
  const userProfile = properties.userProfile || {
    name: 'João Silva',
    position: 'Coordenador de Projetos',
    company: 'TechCorp',
    overallScore: 82,
    completionDate: '2025-01-29',
    timeSpent: '24 minutos',
    profileType: 'Líder Estratégico'
  };
  const competencyResults = properties.competencyResults || [
    {
      name: 'Liderança',
      score: 88,
      level: 'Avançado',
      percentile: 85,
      description: 'Você demonstra excelentes habilidades de liderança com capacidade de inspirar e orientar equipes.',
      strengths: ['Visão estratégica', 'Comunicação eficaz', 'Tomada de decisão'],
      opportunities: ['Delegação', 'Gestão de conflitos'],
      color: 'blue'
    },
    {
      name: 'Comunicação',
      score: 75,
      level: 'Intermediário',
      percentile: 70,
      description: 'Suas habilidades de comunicação são sólidas, com oportunidades de aprimoramento.',
      strengths: ['Clareza na expressão', 'Escuta ativa'],
      opportunities: ['Apresentações públicas', 'Feedback construtivo'],
      color: 'green'
    },
    {
      name: 'Inovação',
      score: 79,
      level: 'Intermediário+',
      percentile: 75,
      description: 'Você possui um bom pensamento inovador e criativo para resolver problemas.',
      strengths: ['Pensamento criativo', 'Adaptabilidade'],
      opportunities: ['Implementação de ideias', 'Gestão da mudança'],
      color: 'purple'
    },
    {
      name: 'Estratégia',
      score: 85,
      level: 'Avançado',
      percentile: 80,
      description: 'Excelente capacidade de planejamento estratégico e visão de longo prazo.',
      strengths: ['Análise estratégica', 'Planejamento', 'Visão sistêmica'],
      opportunities: ['Execução de estratégias', 'Medição de resultados'],
      color: 'orange'
    }
  ];
  const keyInsights = properties.keyInsights || [
    {
      type: 'strength',
      title: 'Seu Maior Diferencial',
      description: 'Sua capacidade de liderança estratégica é excepcional, colocando você no top 15% dos profissionais avaliados.',
      icon: 'trophy'
    },
    {
      type: 'opportunity',
      title: 'Área de Maior Potencial',
      description: 'Desenvolver suas habilidades de comunicação pode elevar significativamente seu impacto como líder.',
      icon: 'target'
    },
    {
      type: 'recommendation',
      title: 'Próximo Passo Recomendado',
      description: 'Busque oportunidades de liderança em projetos estratégicos para acelerar seu crescimento.',
      icon: 'lightbulb'
    }
  ];
  const careerRecommendations = properties.careerRecommendations || [
    {
      category: 'Posições Ideais',
      items: [
        'Gerente de Projetos Sênior',
        'Diretor de Operações',
        'Head de Estratégia',
        'VP de Desenvolvimento'
      ]
    },
    {
      category: 'Áreas de Atuação',
      items: [
        'Consultoria Estratégica',
        'Transformação Digital',
        'Gestão de Mudanças',
        'Desenvolvimento Organizacional'
      ]
    },
    {
      category: 'Setores Recomendados',
      items: [
        'Tecnologia',
        'Consultoria',
        'Serviços Financeiros',
        'Healthcare'
      ]
    }
  ];
  const developmentPlan = properties.developmentPlan || [
    {
      priority: 'Alta',
      timeframe: 'Próximos 3 meses',
      action: 'Curso de Comunicação Executiva',
      impact: 'Melhoria de 15-20 pontos em Comunicação',
      investment: 'R$ 1.200'
    },
    {
      priority: 'Alta',
      timeframe: 'Próximos 6 meses',
      action: 'Mentoria com Líder Sênior',
      impact: 'Aceleração do desenvolvimento de liderança',
      investment: 'R$ 3.000'
    },
    {
      priority: 'Média',
      timeframe: 'Próximos 12 meses',
      action: 'MBA Executivo',
      impact: 'Fortalecimento estratégico e networking',
      investment: 'R$ 25.000'
    }
  ];
  const benchmarkData = properties.benchmarkData || {
    totalParticipants: 5420,
    userPercentile: 78,
    industryAverage: 72,
    topPerformers: 90,
    yourPosition: 1192
  };
  const nextSteps = properties.nextSteps || [
    {
      step: 1,
      title: 'Baixe seu Relatório Completo',
      description: 'PDF detalhado com todos os resultados e recomendações',
      action: 'Download',
      timeEstimate: '1 min'
    },
    {
      step: 2,
      title: 'Agende uma Consulta',
      description: 'Sessão gratuita de 30min com especialista em carreira',
      action: 'Agendar',
      timeEstimate: '30 min'
    },
    {
      step: 3,
      title: 'Explore Oportunidades',
      description: 'Vagas exclusivas baseadas no seu perfil',
      action: 'Ver Vagas',
      timeEstimate: '15 min'
    },
    {
      step: 4,
      title: 'Continue seu Desenvolvimento',
      description: 'Acesse recursos personalizados de aprendizagem',
      action: 'Explorar',
      timeEstimate: 'Ongoing'
    }
  ];
  const showBenchmark = properties.showBenchmark || true;
  const showRecommendations = properties.showRecommendations || true;
  const showDevelopmentPlan = properties.showDevelopmentPlan || true;
  const showNextSteps = properties.showNextSteps || true;
  const reportStyle = properties.reportStyle || 'comprehensive'; // comprehensive, executive, detailed
  const theme = properties.theme || 'professional';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getCompetencyColor = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100',
        border: 'border-blue-500',
        text: 'text-blue-700',
        progress: 'bg-blue-500'
      },
      green: {
        bg: 'bg-green-100',
        border: 'border-green-500',
        text: 'text-green-700',
        progress: 'bg-green-500'
      },
      purple: {
        bg: 'bg-purple-100',
        border: 'border-purple-500',
        text: 'text-purple-700',
        progress: 'bg-purple-500'
      },
      orange: {
        bg: 'bg-orange-100',
        border: 'border-orange-500',
        text: 'text-orange-700',
        progress: 'bg-orange-500'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getInsightIcon = (iconType: string) => {
    const icons = {
      trophy: Trophy,
      target: Target,
      lightbulb: Lightbulb,
      award: Award,
      star: Star
    };
    return icons[iconType as keyof typeof icons] || Trophy;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'Alta': 'bg-red-100 text-red-700 border-red-200',
      'Média': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Baixa': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority as keyof typeof colors] || colors.Média;
  };

  const getThemeClasses = () => {
    const themes = {
      professional: {
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
      premium: {
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
        'min-h-[1000px] p-8',
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
              // Ação de download
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

      {/* Cabeçalho de Celebração */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
        </div>
        
        {isEditMode ? (
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
              placeholder="Título dos resultados"
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
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed mb-4">
              {subtitle}
            </p>
            <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Tempo: {userProfile.timeSpent}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Concluído: {userProfile.completionDate}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                Score: {userProfile.overallScore}/100
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Perfil do Usuário */}
      <div className="mb-8">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{userProfile.name}</h2>
            <p className="text-gray-600">{userProfile.position} • {userProfile.company}</p>
            <div className="mt-3">
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {userProfile.profileType}
              </Badge>
            </div>
          </div>

          {/* Score Geral */}
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {userProfile.overallScore}
            </div>
            <div className="text-gray-600 mb-4">Score Geral</div>
            <div className="w-full bg-gray-200 rounded-full h-4 max-w-md mx-auto">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${userProfile.overallScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Seções */}
      <div className="mb-6">
        <div className="flex bg-white rounded-lg border shadow-sm p-1 overflow-x-auto">
          {[
            { key: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { key: 'competencies', label: 'Competências', icon: Target },
            { key: 'insights', label: 'Insights', icon: Lightbulb },
            { key: 'recommendations', label: 'Recomendações', icon: Award }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedSection(tab.key)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap',
                  selectedSection === tab.key
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

      {/* Benchmark e Estatísticas */}
      {selectedSection === 'overview' && showBenchmark && (
        <div className="mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Como Você se Compara
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {benchmarkData.userPercentile}%
                </div>
                <div className="text-sm text-gray-600">Seu Percentil</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  #{benchmarkData.yourPosition.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Sua Posição</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {benchmarkData.industryAverage}
                </div>
                <div className="text-sm text-gray-600">Média do Setor</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {benchmarkData.totalParticipants.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Avaliados</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 text-center">
                <strong>Parabéns!</strong> Você está no top {100 - benchmarkData.userPercentile}% dos profissionais avaliados, 
                superando {benchmarkData.userPercentile}% dos participantes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Competências Detalhadas */}
      {selectedSection === 'competencies' && (
        <div className="space-y-6">
          {competencyResults.map((competency, index) => {
            const colorClasses = getCompetencyColor(competency.color);
            
            return (
              <div key={index} className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold',
                    colorClasses.bg,
                    colorClasses.text
                  )}>
                    {competency.score}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {competency.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge className={cn('text-sm', colorClasses.bg, colorClasses.text)}>
                            {competency.level}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Percentil {competency.percentile}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                      {competency.description}
                    </p>

                    {/* Barra de Progresso */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={cn('h-3 rounded-full transition-all duration-300', colorClasses.progress)}
                          style={{ width: `${competency.score}%` }}
                        />
                      </div>
                    </div>

                    {/* Pontos Fortes e Oportunidades */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Pontos Fortes
                        </h5>
                        <ul className="space-y-1">
                          {competency.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center gap-1">
                              <div className="w-1 h-1 bg-green-500 rounded-full" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-orange-700 mb-2 flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          Oportunidades
                        </h5>
                        <ul className="space-y-1">
                          {competency.opportunities.map((opportunity, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center gap-1">
                              <div className="w-1 h-1 bg-orange-500 rounded-full" />
                              {opportunity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Insights Principais */}
      {selectedSection === 'insights' && (
        <div className="space-y-4">
          {keyInsights.map((insight, index) => {
            const InsightIconComponent = getInsightIcon(insight.icon);
            const insightColors = {
              strength: 'border-green-200 bg-green-50 text-green-700',
              opportunity: 'border-blue-200 bg-blue-50 text-blue-700',
              recommendation: 'border-purple-200 bg-purple-50 text-purple-700'
            };
            
            return (
              <div
                key={index}
                className={cn(
                  'bg-white rounded-lg border-l-4 shadow-sm p-6',
                  insightColors[insight.type as keyof typeof insightColors]
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <InsightIconComponent className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">
                      {insight.title}
                    </h4>
                    <p className="text-sm leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recomendações de Carreira */}
      {selectedSection === 'recommendations' && showRecommendations && (
        <div className="space-y-6">
          {careerRecommendations.map((category, index) => (
            <div key={index} className="bg-white rounded-lg border shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 text-lg mb-4">
                {category.category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Plano de Desenvolvimento */}
          {showDevelopmentPlan && (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 text-lg mb-4">
                Plano de Desenvolvimento Recomendado
              </h4>
              <div className="space-y-4">
                {developmentPlan.map((plan, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn('text-xs', getPriorityColor(plan.priority))}>
                            {plan.priority} Prioridade
                          </Badge>
                          <span className="text-sm text-gray-600">{plan.timeframe}</span>
                        </div>
                        <h5 className="font-medium text-gray-900">{plan.action}</h5>
                        <p className="text-sm text-gray-600 mt-1">{plan.impact}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{plan.investment}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Próximos Passos */}
      {showNextSteps && (
        <div className="mt-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Seus Próximos Passos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nextSteps.map((step) => (
                <div key={step.step} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {step.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {step.timeEstimate}
                        </span>
                        <Button size="sm" variant="outline">
                          {step.action}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Botão de Ação Principal */}
      {!isEditMode && (
        <div className="text-center mt-8">
          <Button
            size="lg"
            className={cn(
              'px-8 py-3 text-lg font-medium text-white rounded-lg mr-4',
              'transition-all duration-200 transform hover:scale-105',
              'shadow-lg hover:shadow-xl',
              themeClasses.button
            )}
          >
            <Download className="w-5 h-5 mr-2" />
            Baixar Relatório Completo
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-3 text-lg font-medium rounded-lg"
          >
            Agendar Consulta Gratuita
            <Calendar className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showBenchmark ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showBenchmark', !showBenchmark)}
            >
              Mostrar Benchmark
            </Badge>
            
            <Badge
              variant={showRecommendations ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showRecommendations', !showRecommendations)}
            >
              Mostrar Recomendações
            </Badge>

            <Badge
              variant={showDevelopmentPlan ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showDevelopmentPlan', !showDevelopmentPlan)}
            >
              Mostrar Plano
            </Badge>

            <Badge
              variant={showNextSteps ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showNextSteps', !showNextSteps)}
            >
              Mostrar Próximos Passos
            </Badge>
          </div>

          {/* Estilo do Relatório */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estilo do Relatório
            </label>
            <div className="flex gap-2">
              {['comprehensive', 'executive', 'detailed'].map((style) => (
                <Badge
                  key={style}
                  variant={reportStyle === style ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('reportStyle', style)}
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
              {['professional', 'success', 'premium'].map((themeOption) => (
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

export default QuizFinalResultsInlineBlock;
