import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Users, Crown, TrendingUp, Star, Target, Zap, Brain, Heart, ArrowRight, Check, X } from 'lucide-react';

interface QuizComparisonInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de comparação
}

/**
 * Componente inline para comparação de perfis (Etapa 12)
 * Comparação do usuário com outros perfis e benchmark da indústria
 */
export const QuizComparisonInlineBlock: React.FC<QuizComparisonInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  
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

  const title = properties.title || 'Comparação de Perfis';
  const subtitle = properties.subtitle || 'Veja como você se compara com outros profissionais e descubra oportunidades de crescimento';
  const userProfile = properties.userProfile || {
    name: 'Seu Perfil',
    type: 'O Visionário',
    score: 87,
    level: 'Avançado',
    strengths: ['Inovação', 'Liderança', 'Estratégia'],
    weaknesses: ['Execução', 'Detalhamento'],
    icon: 'brain',
    color: 'purple'
  };
  const comparisonProfiles = properties.comparisonProfiles || [
    {
      id: 1,
      name: 'Média da Indústria',
      type: 'Benchmark Geral',
      score: 68,
      level: 'Intermediário',
      strengths: ['Execução', 'Consistência'],
      weaknesses: ['Inovação', 'Liderança'],
      icon: 'users',
      color: 'gray',
      isUser: false
    },
    {
      id: 2,
      name: 'Top 10% da Área',
      type: 'Elite Performers',
      score: 92,
      level: 'Expert',
      strengths: ['Todas as áreas'],
      weaknesses: ['Nenhuma significativa'],
      icon: 'crown',
      color: 'gold',
      isUser: false
    },
    {
      id: 3,
      name: 'Perfil Similar',
      type: 'O Estrategista',
      score: 84,
      level: 'Avançado',
      strengths: ['Estratégia', 'Análise'],
      weaknesses: ['Criatividade'],
      icon: 'target',
      color: 'blue',
      isUser: false
    }
  ];
  const comparisonCriteria = properties.comparisonCriteria || [
    {
      id: 1,
      name: 'Liderança',
      userScore: 92,
      industryAvg: 68,
      topPerformers: 89,
      isStrength: true
    },
    {
      id: 2,
      name: 'Inovação',
      userScore: 88,
      industryAvg: 65,
      topPerformers: 87,
      isStrength: true
    },
    {
      id: 3,
      name: 'Estratégia',
      userScore: 85,
      industryAvg: 70,
      topPerformers: 92,
      isStrength: true
    },
    {
      id: 4,
      name: 'Execução',
      userScore: 72,
      industryAvg: 78,
      topPerformers: 94,
      isStrength: false
    },
    {
      id: 5,
      name: 'Comunicação',
      userScore: 81,
      industryAvg: 72,
      topPerformers: 88,
      isStrength: true
    }
  ];
  const insights = properties.insights || [
    'Você está 28% acima da média da indústria',
    'Suas competências de liderança superam 89% dos profissionais',
    'Foco em execução pode elevar seu perfil ao top 10%'
  ];
  const showDetailedComparison = properties.showDetailedComparison || true;
  const showCriteria = properties.showCriteria || true;
  const showInsights = properties.showInsights || true;
  const layoutStyle = properties.layoutStyle || 'cards'; // cards, table, dashboard
  const theme = properties.theme || 'blue';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getProfileIcon = (iconType: string) => {
    const icons = {
      brain: Brain,
      crown: Crown,
      users: Users,
      target: Target,
      star: Star,
      zap: Zap,
      heart: Heart
    };
    const IconComponent = icons[iconType as keyof typeof icons] || Brain;
    return <IconComponent className="w-8 h-8" />;
  };

  const getColorClasses = (color: string) => {
    const colors = {
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-200'
      },
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-200'
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        border: 'border-green-200'
      },
      gold: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        border: 'border-yellow-200'
      },
      gray: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border-gray-200'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getThemeClasses = () => {
    const themes = {
      blue: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        accent: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        accent: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700'
      },
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        accent: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    };
    return themes[theme as keyof typeof themes] || themes.blue;
  };

  const themeClasses = getThemeClasses();

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 55) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const allProfiles = [{ ...userProfile, isUser: true }, ...comparisonProfiles];

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[800px] p-8',
        `bg-gradient-to-br ${themeClasses.bg}`,
        `border ${themeClasses.border} rounded-lg`,
        'transition-all duration-300',
        isSelected && `ring-2 ring-${theme}-500`,
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
              placeholder="Título da comparação"
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

      {/* Comparação de Perfis */}
      {showDetailedComparison && (
        <div className="mb-8">
          <div className={cn(
            layoutStyle === 'cards' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
            layoutStyle === 'table' && 'overflow-x-auto',
            layoutStyle === 'dashboard' && 'grid grid-cols-1 lg:grid-cols-3 gap-6'
          )}>
            {layoutStyle === 'table' ? (
              <table className="w-full bg-white rounded-lg border overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Perfil</th>
                    <th className="px-6 py-4 text-center font-semibold">Tipo</th>
                    <th className="px-6 py-4 text-center font-semibold">Pontuação</th>
                    <th className="px-6 py-4 text-center font-semibold">Nível</th>
                    <th className="px-6 py-4 text-left font-semibold">Pontos Fortes</th>
                  </tr>
                </thead>
                <tbody>
                  {allProfiles.map((profile, index) => (
                    <tr
                      key={index}
                      className={cn(
                        'border-t',
                        profile.isUser && 'bg-blue-50 font-medium'
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'p-2 rounded-lg',
                            getColorClasses(profile.color).bg,
                            getColorClasses(profile.color).text
                          )}>
                            {getProfileIcon(profile.icon)}
                          </div>
                          <span>{profile.name}</span>
                          {profile.isUser && <Badge variant="default" className="ml-2">Você</Badge>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">{profile.type}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge className={getScoreColor(profile.score)}>
                          {profile.score}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">{profile.level}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {profile.strengths.slice(0, 2).map((strength, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              allProfiles.map((profile, index) => (
                <div
                  key={index}
                  className={cn(
                    'bg-white rounded-lg border shadow-sm p-6',
                    'transition-all duration-200 hover:shadow-md',
                    profile.isUser && 'ring-2 ring-blue-400 bg-blue-50/50'
                  )}
                >
                  {/* Cabeçalho do Perfil */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn(
                      'p-3 rounded-xl',
                      getColorClasses(profile.color).bg,
                      getColorClasses(profile.color).text
                    )}>
                      {getProfileIcon(profile.icon)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{profile.name}</h3>
                        {profile.isUser && <Badge variant="default">Você</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">{profile.type}</p>
                    </div>
                  </div>

                  {/* Pontuação e Nível */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-3xl font-bold text-gray-800">
                        {profile.score}%
                      </div>
                      <div className="text-sm text-gray-500">Pontuação</div>
                    </div>
                    <Badge className={getScoreColor(profile.score)}>
                      {profile.level}
                    </Badge>
                  </div>

                  {/* Pontos Fortes */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-500" />
                      Pontos Fortes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.strengths.map((strength, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Áreas de Melhoria */}
                  {profile.weaknesses && profile.weaknesses.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <X className="w-4 h-4 text-red-500" />
                        Pontos de Atenção
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.weaknesses.map((weakness, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs text-red-600">
                            {weakness}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Comparação por Critérios */}
      {showCriteria && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6 text-center">
            Comparação Detalhada por Competência
          </h3>
          
          <div className="space-y-4">
            {comparisonCriteria.map((criteria) => (
              <div
                key={criteria.id}
                className="bg-white rounded-lg border shadow-sm p-6"
              >
                {/* Nome da Competência */}
                <div className="flex items-center justify-between mb-4">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={criteria.name}
                      onChange={(e) => {
                        const updatedCriteria = comparisonCriteria.map(c =>
                          c.id === criteria.id ? { ...c, name: e.target.value } : c
                        );
                        handlePropertyChange('comparisonCriteria', updatedCriteria);
                      }}
                      className="font-semibold text-lg p-1 border border-gray-300 rounded"
                    />
                  ) : (
                    <h4 className="font-semibold text-lg">{criteria.name}</h4>
                  )}
                  
                  <Badge 
                    variant={criteria.isStrength ? "default" : "outline"}
                    className={criteria.isStrength ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {criteria.isStrength ? 'Ponto Forte' : 'Melhoria'}
                  </Badge>
                </div>

                {/* Barras de Comparação */}
                <div className="space-y-3">
                  {/* Sua Pontuação */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Você</span>
                      <span className="text-sm font-bold text-gray-900">
                        {criteria.userScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={cn(
                          'h-3 rounded-full',
                          criteria.isStrength ? 'bg-green-500' : 'bg-red-500'
                        )}
                        style={{ width: `${criteria.userScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Média da Indústria */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Média da Indústria</span>
                      <span className="text-sm text-gray-700">
                        {criteria.industryAvg}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: `${criteria.industryAvg}%` }}
                      />
                    </div>
                  </div>

                  {/* Top Performers */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Top 10%</span>
                      <span className="text-sm text-gray-700">
                        {criteria.topPerformers}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${criteria.topPerformers}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights da Comparação */}
      {showInsights && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Insights da Comparação
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="bg-white/80 rounded-lg border p-4 flex items-start gap-3"
              >
                <TrendingUp className={cn('w-5 h-5 flex-shrink-0 mt-0.5', themeClasses.accent)} />
                <p className="text-sm text-gray-700 leading-relaxed">
                  {insight}
                </p>
              </div>
            ))}
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
            Ver Plano de Desenvolvimento
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
              variant={showDetailedComparison ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showDetailedComparison', !showDetailedComparison)}
            >
              Comparação Detalhada
            </Badge>
            
            <Badge
              variant={showCriteria ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showCriteria', !showCriteria)}
            >
              Critérios
            </Badge>

            <Badge
              variant={showInsights ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showInsights', !showInsights)}
            >
              Insights
            </Badge>
          </div>

          {/* Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layout
            </label>
            <div className="flex gap-2">
              {['cards', 'table', 'dashboard'].map((layout) => (
                <Badge
                  key={layout}
                  variant={layoutStyle === layout ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('layoutStyle', layout)}
                >
                  {layout}
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
              {['blue', 'green', 'purple'].map((color) => (
                <Badge
                  key={color}
                  variant={theme === color ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('theme', color)}
                >
                  {color}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComparisonInlineBlock;
