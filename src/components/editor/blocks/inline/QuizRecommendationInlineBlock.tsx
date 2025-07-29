import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { BookOpen, PlayCircle, Users, Star, Clock, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';

interface QuizRecommendationInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de recomendações
}

/**
 * Componente inline para recomendações específicas (Etapa 9)
 * Exibição de recursos, cursos e ações recomendadas baseadas no perfil
 */
export const QuizRecommendationInlineBlock: React.FC<QuizRecommendationInlineBlockProps> = ({
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

  const title = properties.title || 'Recomendações Personalizadas';
  const subtitle = properties.subtitle || 'Baseado no seu perfil, selecionamos os melhores recursos para acelerar seu crescimento';
  const recommendations = properties.recommendations || [
    {
      id: 1,
      type: 'course',
      title: 'Liderança Estratégica',
      description: 'Desenvolva suas habilidades de liderança e tomada de decisão estratégica.',
      duration: '6 semanas',
      rating: 4.8,
      priority: 'high',
      provider: 'Academia XYZ',
      price: 'R$ 497',
      features: ['Certificado', 'Mentoria', 'Comunidade']
    },
    {
      id: 2,
      type: 'book',
      title: 'Pensamento de Design',
      description: 'Aprenda a aplicar metodologias de design thinking na sua rotina.',
      duration: '3 horas',
      rating: 4.5,
      priority: 'medium',
      provider: 'Editora ABC',
      price: 'R$ 89',
      features: ['E-book', 'Audiobook', 'Exercícios']
    },
    {
      id: 3,
      type: 'workshop',
      title: 'Inovação e Criatividade',
      description: 'Workshop prático para desenvolver seu mindset inovador.',
      duration: '2 dias',
      rating: 4.9,
      priority: 'high',
      provider: 'Instituto DEF',
      price: 'R$ 899',
      features: ['Presencial', 'Material', 'Networking']
    }
  ];
  const showRatings = properties.showRatings || true;
  const showPricing = properties.showPricing || true;
  const showFeatures = properties.showFeatures || true;
  const layoutStyle = properties.layoutStyle || 'cards'; // cards, list, grid
  const theme = properties.theme || 'blue';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getTypeIcon = (type: string) => {
    const icons = {
      course: PlayCircle,
      book: BookOpen,
      workshop: Users,
      webinar: Star
    };
    const IconComponent = icons[type as keyof typeof icons] || BookOpen;
    return <IconComponent className="w-5 h-5" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-600 bg-red-50 border-red-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      low: 'text-green-600 bg-green-50 border-green-200'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
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
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        accent: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700',
        card: 'border-purple-100'
      },
      green: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        accent: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
        card: 'border-green-100'
      }
    };
    return themes[theme as keyof typeof themes] || themes.blue;
  };

  const themeClasses = getThemeClasses();

  const addRecommendation = () => {
    const newRecommendation = {
      id: Date.now(),
      type: 'course',
      title: 'Nova Recomendação',
      description: 'Descrição da recomendação...',
      duration: '1 semana',
      rating: 4.0,
      priority: 'medium',
      provider: 'Provedor',
      price: 'R$ 0',
      features: ['Funcionalidade 1']
    };
    handlePropertyChange('recommendations', [...recommendations, newRecommendation]);
  };

  const updateRecommendation = (id: number, field: string, value: any) => {
    const updatedRecommendations = recommendations.map(rec =>
      rec.id === id ? { ...rec, [field]: value } : rec
    );
    handlePropertyChange('recommendations', updatedRecommendations);
  };

  const removeRecommendation = (id: number) => {
    const filteredRecommendations = recommendations.filter(rec => rec.id !== id);
    handlePropertyChange('recommendations', filteredRecommendations);
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
              placeholder="Título das recomendações"
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

      {/* Lista de Recomendações */}
      <div className={cn(
        'space-y-6',
        layoutStyle === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 space-y-0'
      )}>
        {recommendations.map((recommendation, index) => (
          <div
            key={recommendation.id}
            className={cn(
              'bg-white rounded-lg shadow-sm border p-6',
              'transition-all duration-200 hover:shadow-md',
              themeClasses.card
            )}
          >
            {/* Cabeçalho da Recomendação */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Ícone do Tipo */}
                <div className={cn(
                  'p-2 rounded-lg',
                  themeClasses.accent.replace('text-', 'bg-').replace('-600', '-100'),
                  themeClasses.accent
                )}>
                  {getTypeIcon(recommendation.type)}
                </div>
                
                <div>
                  {/* Título */}
                  {isEditMode ? (
                    <input
                      type="text"
                      value={recommendation.title}
                      onChange={(e) => updateRecommendation(recommendation.id, 'title', e.target.value)}
                      className="font-semibold text-lg p-1 border border-gray-300 rounded w-full"
                    />
                  ) : (
                    <h3 className="font-semibold text-lg text-gray-800">
                      {recommendation.title}
                    </h3>
                  )}
                  
                  {/* Provedor */}
                  {isEditMode ? (
                    <input
                      type="text"
                      value={recommendation.provider}
                      onChange={(e) => updateRecommendation(recommendation.id, 'provider', e.target.value)}
                      className="text-sm text-gray-500 p-1 border border-gray-300 rounded w-full mt-1"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">
                      {recommendation.provider}
                    </p>
                  )}
                </div>
              </div>

              {/* Prioridade */}
              <Badge className={cn('text-xs', getPriorityColor(recommendation.priority))}>
                {recommendation.priority}
              </Badge>
            </div>

            {/* Descrição */}
            {isEditMode ? (
              <textarea
                value={recommendation.description}
                onChange={(e) => updateRecommendation(recommendation.id, 'description', e.target.value)}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded resize-none mb-4"
              />
            ) : (
              <p className="text-gray-600 mb-4 leading-relaxed">
                {recommendation.description}
              </p>
            )}

            {/* Informações */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              {/* Duração */}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {isEditMode ? (
                  <input
                    type="text"
                    value={recommendation.duration}
                    onChange={(e) => updateRecommendation(recommendation.id, 'duration', e.target.value)}
                    className="p-1 border border-gray-300 rounded w-20"
                  />
                ) : (
                  <span>{recommendation.duration}</span>
                )}
              </div>

              {/* Rating */}
              {showRatings && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {isEditMode ? (
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={recommendation.rating}
                      onChange={(e) => updateRecommendation(recommendation.id, 'rating', parseFloat(e.target.value))}
                      className="p-1 border border-gray-300 rounded w-16"
                    />
                  ) : (
                    <span>{recommendation.rating}</span>
                  )}
                </div>
              )}

              {/* Preço */}
              {showPricing && (
                <div className="flex items-center gap-1 font-medium text-gray-700">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={recommendation.price}
                      onChange={(e) => updateRecommendation(recommendation.id, 'price', e.target.value)}
                      className="p-1 border border-gray-300 rounded w-20"
                    />
                  ) : (
                    <span>{recommendation.price}</span>
                  )}
                </div>
              )}
            </div>

            {/* Funcionalidades */}
            {showFeatures && (
              <div className="mb-4">
                {isEditMode ? (
                  <div className="space-y-1">
                    {recommendation.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...recommendation.features];
                            newFeatures[featureIndex] = e.target.value;
                            updateRecommendation(recommendation.id, 'features', newFeatures);
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newFeatures = recommendation.features.filter((_, i) => i !== featureIndex);
                            updateRecommendation(recommendation.id, 'features', newFeatures);
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
                        const newFeatures = [...recommendation.features, 'Nova funcionalidade'];
                        updateRecommendation(recommendation.id, 'features', newFeatures);
                      }}
                      className="w-full border-dashed text-xs"
                    >
                      + Adicionar
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {recommendation.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-1 text-xs text-gray-600"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-2">
              {!isEditMode && (
                <Button
                  className={cn(
                    'flex-1 text-white',
                    themeClasses.button
                  )}
                >
                  Começar Agora
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              
              {!isEditMode && (
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}

              {isEditMode && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeRecommendation(recommendation.id)}
                >
                  Remover
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Botão Adicionar Nova Recomendação */}
        {isEditMode && (
          <div
            className="bg-white/50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-white/70 transition-colors"
            onClick={addRecommendation}
          >
            <Button variant="outline" className="w-full">
              + Adicionar Nova Recomendação
            </Button>
          </div>
        )}
      </div>

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showRatings ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showRatings', !showRatings)}
            >
              Mostrar Avaliações
            </Badge>
            
            <Badge
              variant={showPricing ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showPricing', !showPricing)}
            >
              Mostrar Preços
            </Badge>

            <Badge
              variant={showFeatures ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showFeatures', !showFeatures)}
            >
              Mostrar Funcionalidades
            </Badge>
          </div>

          {/* Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layout
            </label>
            <div className="flex gap-2">
              {['cards', 'list', 'grid'].map((layout) => (
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
              {['blue', 'purple', 'green'].map((color) => (
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

export default QuizRecommendationInlineBlock;
