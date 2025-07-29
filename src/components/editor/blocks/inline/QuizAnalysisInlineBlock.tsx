import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { BarChart3, PieChart, Activity, TrendingUp, Users, Clock, Target } from 'lucide-react';

interface QuizAnalysisInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de análise
}

/**
 * Componente inline para análise detalhada do quiz (Etapa 7)
 * Exibição de gráficos, estatísticas e insights personalizados
 */
export const QuizAnalysisInlineBlock: React.FC<QuizAnalysisInlineBlockProps> = ({
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

  const title = properties.title || 'Análise Detalhada';
  const subtitle = properties.subtitle || 'Insights baseados no seu perfil';
  const categories = properties.categories || [
    { name: 'Liderança', score: 85, color: 'bg-blue-500' },
    { name: 'Comunicação', score: 92, color: 'bg-green-500' },
    { name: 'Estratégia', score: 78, color: 'bg-purple-500' },
    { name: 'Inovação', score: 88, color: 'bg-orange-500' }
  ];
  const insights = properties.insights || [
    'Seu perfil de liderança é colaborativo e inspirador',
    'Você demonstra excelentes habilidades de comunicação',
    'Sua abordagem estratégica é bem estruturada',
    'Há oportunidades de crescimento em pensamento disruptivo'
  ];
  const recommendations = properties.recommendations || [
    'Desenvolver técnicas de feedback construtivo',
    'Explorar metodologias ágeis de gestão',
    'Investir em cursos de inovação e criatividade'
  ];
  const comparison = properties.comparison || {
    yourScore: 85,
    averageScore: 67,
    topPercentile: 15
  };
  const showCategories = properties.showCategories || true;
  const showInsights = properties.showInsights || true;
  const showRecommendations = properties.showRecommendations || true;
  const showComparison = properties.showComparison || true;
  const chartType = properties.chartType || 'bars'; // bars, radial, mixed
  const theme = properties.theme || 'professional';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getThemeClasses = () => {
    const themes = {
      professional: {
        bg: 'from-slate-50 to-gray-50',
        border: 'border-slate-200',
        accent: 'text-slate-700',
        card: 'bg-white border-slate-200'
      },
      modern: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        accent: 'text-blue-700',
        card: 'bg-white border-blue-200'
      },
      creative: {
        bg: 'from-purple-50 to-pink-50',
        border: 'border-purple-200',
        accent: 'text-purple-700',
        card: 'bg-white border-purple-200'
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
        'min-h-[600px] p-8',
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
              placeholder="Título da análise"
              className="w-full text-2xl font-bold text-center p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) => handlePropertyChange('subtitle', e.target.value)}
              placeholder="Subtítulo"
              className="w-full text-center p-2 border border-gray-300 rounded"
            />
          </div>
        ) : (
          <div>
            <h1 className={cn('text-3xl font-bold mb-2', themeClasses.accent)}>
              {title}
            </h1>
            <p className="text-gray-600 text-lg">
              {subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Comparação Geral */}
      {showComparison && !isEditMode && (
        <div className={cn('p-6 rounded-lg mb-8', themeClasses.card, 'border')}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Como Você Se Compara
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{comparison.yourScore}</div>
              <div className="text-sm text-gray-600">Sua Pontuação</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-500">{comparison.averageScore}</div>
              <div className="text-sm text-gray-600">Média Geral</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">Top {comparison.topPercentile}%</div>
              <div className="text-sm text-gray-600">Seu Ranking</div>
            </div>
          </div>
        </div>
      )}

      {/* Análise por Categorias */}
      {showCategories && (
        <div className={cn('p-6 rounded-lg mb-8', themeClasses.card, 'border')}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Análise por Categoria
          </h3>
          
          {isEditMode ? (
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 items-center">
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => {
                      const newCategories = [...categories];
                      newCategories[index] = { ...category, name: e.target.value };
                      handlePropertyChange('categories', newCategories);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Nome da categoria"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={category.score}
                    onChange={(e) => {
                      const newCategories = [...categories];
                      newCategories[index] = { ...category, score: parseInt(e.target.value) || 0 };
                      handlePropertyChange('categories', newCategories);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <select
                    value={category.color}
                    onChange={(e) => {
                      const newCategories = [...categories];
                      newCategories[index] = { ...category, color: e.target.value };
                      handlePropertyChange('categories', newCategories);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="bg-blue-500">Azul</option>
                    <option value="bg-green-500">Verde</option>
                    <option value="bg-purple-500">Roxo</option>
                    <option value="bg-orange-500">Laranja</option>
                    <option value="bg-red-500">Vermelho</option>
                    <option value="bg-yellow-500">Amarelo</option>
                  </select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newCategories = categories.filter((_, i) => i !== index);
                      handlePropertyChange('categories', newCategories);
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newCategories = [...categories, { name: 'Nova categoria', score: 50, color: 'bg-gray-500' }];
                  handlePropertyChange('categories', newCategories);
                }}
                className="w-full border-dashed"
              >
                + Adicionar Categoria
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-gray-700">
                    {category.name}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={cn('h-3 rounded-full transition-all duration-1000', category.color)}
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm font-semibold text-gray-700">
                    {category.score}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Insights Personalizados */}
      {showInsights && (
        <div className={cn('p-6 rounded-lg mb-8', themeClasses.card, 'border')}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Insights Personalizados
          </h3>
          
          {isEditMode ? (
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={insight}
                    onChange={(e) => {
                      const newInsights = [...insights];
                      newInsights[index] = e.target.value;
                      handlePropertyChange('insights', newInsights);
                    }}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                    placeholder={`Insight ${index + 1}`}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newInsights = insights.filter((_, i) => i !== index);
                      handlePropertyChange('insights', newInsights);
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newInsights = [...insights, 'Novo insight personalizado...'];
                  handlePropertyChange('insights', newInsights);
                }}
                className="w-full border-dashed"
              >
                + Adicionar Insight
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Target className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">{insight}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recomendações */}
      {showRecommendations && (
        <div className={cn('p-6 rounded-lg mb-8', themeClasses.card, 'border')}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recomendações de Desenvolvimento
          </h3>
          
          {isEditMode ? (
            <div className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={recommendation}
                    onChange={(e) => {
                      const newRecommendations = [...recommendations];
                      newRecommendations[index] = e.target.value;
                      handlePropertyChange('recommendations', newRecommendations);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder={`Recomendação ${index + 1}`}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newRecommendations = recommendations.filter((_, i) => i !== index);
                      handlePropertyChange('recommendations', newRecommendations);
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newRecommendations = [...recommendations, 'Nova recomendação...'];
                  handlePropertyChange('recommendations', newRecommendations);
                }}
                className="w-full border-dashed"
              >
                + Adicionar Recomendação
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Botão de Ação */}
      {!isEditMode && (
        <div className="text-center">
          <Button
            className="px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Baixar Relatório Completo
            <Clock className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Comparação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dados de Comparação
            </label>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                value={comparison.yourScore}
                onChange={(e) => handlePropertyChange('comparison', {
                  ...comparison,
                  yourScore: parseInt(e.target.value) || 0
                })}
                placeholder="Sua pontuação"
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <input
                type="number"
                value={comparison.averageScore}
                onChange={(e) => handlePropertyChange('comparison', {
                  ...comparison,
                  averageScore: parseInt(e.target.value) || 0
                })}
                placeholder="Média geral"
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <input
                type="number"
                value={comparison.topPercentile}
                onChange={(e) => handlePropertyChange('comparison', {
                  ...comparison,
                  topPercentile: parseInt(e.target.value) || 0
                })}
                placeholder="Top %"
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showCategories ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showCategories', !showCategories)}
            >
              Mostrar Categorias
            </Badge>
            
            <Badge
              variant={showInsights ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showInsights', !showInsights)}
            >
              Mostrar Insights
            </Badge>

            <Badge
              variant={showRecommendations ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showRecommendations', !showRecommendations)}
            >
              Mostrar Recomendações
            </Badge>

            <Badge
              variant={showComparison ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showComparison', !showComparison)}
            >
              Mostrar Comparação
            </Badge>
          </div>

          {/* Seletor de Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema Visual
            </label>
            <div className="flex gap-2">
              {['professional', 'modern', 'creative'].map((themeOption) => (
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

export default QuizAnalysisInlineBlock;
