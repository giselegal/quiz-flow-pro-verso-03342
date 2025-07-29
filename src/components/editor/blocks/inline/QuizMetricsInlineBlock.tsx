import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Target, Users, Clock, Award, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface QuizMetricsInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de métricas
}

/**
 * Componente inline para métricas e KPIs (Etapa 11)
 * Exibição de indicadores de performance, comparações e estatísticas
 */
export const QuizMetricsInlineBlock: React.FC<QuizMetricsInlineBlockProps> = ({
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

  const title = properties.title || 'Suas Métricas de Performance';
  const subtitle = properties.subtitle || 'Comparativo com outros profissionais da área e indicadores de crescimento';
  const mainMetrics = properties.mainMetrics || [
    {
      id: 1,
      label: 'Pontuação Geral',
      value: 87,
      previousValue: 72,
      unit: '%',
      trend: 'up',
      icon: 'target',
      description: 'Sua performance geral no assessment'
    },
    {
      id: 2,
      label: 'Posição no Ranking',
      value: 15,
      previousValue: 28,
      unit: 'º',
      trend: 'up',
      icon: 'award',
      description: 'Entre 100 profissionais avaliados'
    },
    {
      id: 3,
      label: 'Competências Dominadas',
      value: 12,
      previousValue: 8,
      unit: '',
      trend: 'up',
      icon: 'users',
      description: 'De 15 competências avaliadas'
    },
    {
      id: 4,
      label: 'Tempo de Conclusão',
      value: 8,
      previousValue: 12,
      unit: 'min',
      trend: 'up',
      icon: 'clock',
      description: 'Mais rápido que 78% dos usuários'
    }
  ];
  const benchmarks = properties.benchmarks || [
    {
      id: 1,
      category: 'Liderança',
      userScore: 92,
      averageScore: 68,
      topPerformers: 85
    },
    {
      id: 2,
      category: 'Inovação',
      userScore: 88,
      averageScore: 72,
      topPerformers: 89
    },
    {
      id: 3,
      category: 'Estratégia',
      userScore: 85,
      averageScore: 65,
      topPerformers: 82
    },
    {
      id: 4,
      category: 'Execução',
      userScore: 78,
      averageScore: 70,
      topPerformers: 88
    }
  ];
  const insights = properties.insights || [
    'Você está 23% acima da média em Liderança',
    'Sua pontuação em Inovação supera 89% dos profissionais',
    'Área de foco: Melhorar habilidades de Execução'
  ];
  const showTrends = properties.showTrends || true;
  const showBenchmarks = properties.showBenchmarks || true;
  const showInsights = properties.showInsights || true;
  const layoutStyle = properties.layoutStyle || 'grid'; // grid, list, dashboard
  const theme = properties.theme || 'blue';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getMetricIcon = (iconType: string) => {
    const icons = {
      target: Target,
      award: Award,
      users: Users,
      clock: Clock,
      chart: BarChart3,
      pie: PieChart
    };
    const IconComponent = icons[iconType as keyof typeof icons] || Target;
    return <IconComponent className="w-6 h-6" />;
  };

  const getTrendIcon = (trend: string, value: number, previousValue: number) => {
    const isImprovement = value > previousValue;
    if (trend === 'up' || isImprovement) {
      return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    } else if (trend === 'down' || value < previousValue) {
      return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (trend: string, value: number, previousValue: number) => {
    const isImprovement = value > previousValue;
    if (trend === 'up' || isImprovement) {
      return 'text-green-600 bg-green-50 border-green-200';
    } else if (trend === 'down' || value < previousValue) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getThemeClasses = () => {
    const themes = {
      blue: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        accent: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        card: 'border-blue-100'
      },
      green: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        accent: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
        card: 'border-green-100'
      },
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        accent: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700',
        card: 'border-purple-100'
      }
    };
    return themes[theme as keyof typeof themes] || themes.blue;
  };

  const themeClasses = getThemeClasses();

  const addMetric = () => {
    const newMetric = {
      id: Date.now(),
      label: 'Nova Métrica',
      value: 0,
      previousValue: 0,
      unit: '%',
      trend: 'up',
      icon: 'target',
      description: 'Descrição da métrica...'
    };
    handlePropertyChange('mainMetrics', [...mainMetrics, newMetric]);
  };

  const updateMetric = (id: number, field: string, value: any) => {
    const updatedMetrics = mainMetrics.map(metric =>
      metric.id === id ? { ...metric, [field]: value } : metric
    );
    handlePropertyChange('mainMetrics', updatedMetrics);
  };

  const removeMetric = (id: number) => {
    const filteredMetrics = mainMetrics.filter(metric => metric.id !== id);
    handlePropertyChange('mainMetrics', filteredMetrics);
  };

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[700px] p-8',
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
              placeholder="Título das métricas"
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

      {/* Métricas Principais */}
      <div className={cn(
        'mb-8',
        layoutStyle === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
        layoutStyle === 'list' && 'space-y-4',
        layoutStyle === 'dashboard' && 'grid grid-cols-1 md:grid-cols-3 gap-6'
      )}>
        {mainMetrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            {/* Cabeçalho da Métrica */}
            <div className="flex items-start justify-between mb-4">
              <div className={cn('p-2 rounded-lg', themeClasses.accent.replace('text-', 'bg-').replace('-600', '-100'))}>
                {getMetricIcon(metric.icon)}
              </div>
              
              {showTrends && (
                <div className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border',
                  getTrendColor(metric.trend, metric.value, metric.previousValue)
                )}>
                  {getTrendIcon(metric.trend, metric.value, metric.previousValue)}
                  {Math.abs(metric.value - metric.previousValue)}{metric.unit}
                </div>
              )}
            </div>

            {/* Valor Principal */}
            {isEditMode ? (
              <div className="space-y-2 mb-3">
                <input
                  type="text"
                  value={metric.label}
                  onChange={(e) => updateMetric(metric.id, 'label', e.target.value)}
                  className="w-full font-medium p-1 border border-gray-300 rounded"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={metric.value}
                    onChange={(e) => updateMetric(metric.id, 'value', parseInt(e.target.value) || 0)}
                    className="flex-1 text-2xl font-bold p-1 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={metric.unit}
                    onChange={(e) => updateMetric(metric.id, 'unit', e.target.value)}
                    className="w-12 p-1 border border-gray-300 rounded text-sm"
                    placeholder="un"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  {metric.label}
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {metric.value}{metric.unit}
                </div>
              </div>
            )}

            {/* Descrição */}
            {isEditMode ? (
              <textarea
                value={metric.description}
                onChange={(e) => updateMetric(metric.id, 'description', e.target.value)}
                rows={2}
                className="w-full text-sm p-2 border border-gray-300 rounded resize-none"
              />
            ) : (
              <p className="text-sm text-gray-500">
                {metric.description}
              </p>
            )}

            {isEditMode && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeMetric(metric.id)}
                  className="w-full"
                >
                  Remover Métrica
                </Button>
              </div>
            )}
          </div>
        ))}

        {/* Botão Adicionar Nova Métrica */}
        {isEditMode && (
          <div
            className="bg-white/50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-white/70 transition-colors flex items-center justify-center"
            onClick={addMetric}
          >
            <Button variant="outline" className="w-full">
              + Adicionar Métrica
            </Button>
          </div>
        )}
      </div>

      {/* Benchmarks Comparativos */}
      {showBenchmarks && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6 text-center">
            Comparativo por Competência
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benchmarks.map((benchmark) => (
              <div
                key={benchmark.id}
                className="bg-white rounded-lg border shadow-sm p-6"
              >
                {/* Título da Competência */}
                {isEditMode ? (
                  <input
                    type="text"
                    value={benchmark.category}
                    onChange={(e) => {
                      const updatedBenchmarks = benchmarks.map(b =>
                        b.id === benchmark.id ? { ...b, category: e.target.value } : b
                      );
                      handlePropertyChange('benchmarks', updatedBenchmarks);
                    }}
                    className="w-full font-semibold text-lg p-1 border border-gray-300 rounded mb-4"
                  />
                ) : (
                  <h4 className="font-semibold text-lg mb-4 text-gray-800">
                    {benchmark.category}
                  </h4>
                )}

                <div className="space-y-3">
                  {/* Sua Pontuação */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Você</span>
                      <span className="text-sm font-bold text-gray-900">
                        {benchmark.userScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={cn('h-2 rounded-full', themeClasses.button.split(' ')[0])}
                        style={{ width: `${benchmark.userScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Média Geral */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Média Geral</span>
                      <span className="text-sm text-gray-700">
                        {benchmark.averageScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: `${benchmark.averageScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Top Performers */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Top 10%</span>
                      <span className="text-sm text-gray-700">
                        {benchmark.topPerformers}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${benchmark.topPerformers}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {showInsights && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Insights Personalizados
          </h3>
          
          {isEditMode ? (
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={insight}
                    onChange={(e) => {
                      const newInsights = [...insights];
                      newInsights[index] = e.target.value;
                      handlePropertyChange('insights', newInsights);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    placeholder={`Insight ${index + 1}`}
                  />
                  {insights.length > 1 && (
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
                  )}
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newInsights = [...insights, 'Novo insight...'];
                  handlePropertyChange('insights', newInsights);
                }}
                className="w-full border-dashed"
              >
                + Adicionar Insight
              </Button>
            </div>
          ) : (
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
          )}
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
            Baixar Relatório Completo
            <BarChart3 className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showTrends ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showTrends', !showTrends)}
            >
              Mostrar Tendências
            </Badge>
            
            <Badge
              variant={showBenchmarks ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showBenchmarks', !showBenchmarks)}
            >
              Mostrar Benchmarks
            </Badge>

            <Badge
              variant={showInsights ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showInsights', !showInsights)}
            >
              Mostrar Insights
            </Badge>
          </div>

          {/* Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layout
            </label>
            <div className="flex gap-2">
              {['grid', 'list', 'dashboard'].map((layout) => (
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

export default QuizMetricsInlineBlock;
