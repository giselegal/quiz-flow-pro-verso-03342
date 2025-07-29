import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { User, Users, Crown, Zap, Heart, Target, Brain, Lightbulb } from 'lucide-react';

interface QuizCategoryInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de categorização
}

/**
 * Componente inline para categorização de perfil (Etapa 8)
 * Exibição do perfil/categoria do usuário com características e descrição
 */
export const QuizCategoryInlineBlock: React.FC<QuizCategoryInlineBlockProps> = ({
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

  const title = properties.title || 'Seu Perfil';
  const categoryName = properties.categoryName || 'O Visionário';
  const categoryDescription = properties.categoryDescription || 'Você é uma pessoa que enxerga oportunidades onde outros veem obstáculos. Sua capacidade de inovação e visão estratégica são seus maiores diferenciais.';
  const characteristics = properties.characteristics || [
    'Pensamento estratégico',
    'Inovação constante',
    'Visão de longo prazo',
    'Liderança inspiradora'
  ];
  const strengths = properties.strengths || [
    'Criatividade excepcional',
    'Capacidade de adaptação',
    'Comunicação persuasiva'
  ];
  const growthAreas = properties.growthAreas || [
    'Paciência com detalhes',
    'Execução operacional'
  ];
  const percentage = properties.percentage || 92;
  const iconType = properties.iconType || 'brain'; // brain, crown, zap, heart, target, lightbulb
  const categoryColor = properties.categoryColor || 'purple';
  const showPercentage = properties.showPercentage || true;
  const showCharacteristics = properties.showCharacteristics || true;
  const showStrengths = properties.showStrengths || true;
  const showGrowthAreas = properties.showGrowthAreas || true;

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getCategoryIcon = () => {
    const icons = {
      brain: Brain,
      crown: Crown,
      zap: Zap,
      heart: Heart,
      target: Target,
      lightbulb: Lightbulb,
      user: User,
      users: Users
    };
    const IconComponent = icons[iconType as keyof typeof icons] || Brain;
    return <IconComponent className="w-16 h-16" />;
  };

  const getColorClasses = () => {
    const colors = {
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        accent: 'text-purple-600',
        icon: 'text-purple-500',
        badge: 'bg-purple-100 text-purple-800',
        progress: 'bg-purple-500',
        card: 'bg-purple-50/50 border-purple-100'
      },
      blue: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        accent: 'text-blue-600',
        icon: 'text-blue-500',
        badge: 'bg-blue-100 text-blue-800',
        progress: 'bg-blue-500',
        card: 'bg-blue-50/50 border-blue-100'
      },
      green: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        accent: 'text-green-600',
        icon: 'text-green-500',
        badge: 'bg-green-100 text-green-800',
        progress: 'bg-green-500',
        card: 'bg-green-50/50 border-green-100'
      },
      orange: {
        bg: 'from-orange-50 to-amber-50',
        border: 'border-orange-200',
        accent: 'text-orange-600',
        icon: 'text-orange-500',
        badge: 'bg-orange-100 text-orange-800',
        progress: 'bg-orange-500',
        card: 'bg-orange-50/50 border-orange-100'
      },
      red: {
        bg: 'from-red-50 to-pink-50',
        border: 'border-red-200',
        accent: 'text-red-600',
        icon: 'text-red-500',
        badge: 'bg-red-100 text-red-800',
        progress: 'bg-red-500',
        card: 'bg-red-50/50 border-red-100'
      }
    };
    return colors[categoryColor as keyof typeof colors] || colors.purple;
  };

  const colorClasses = getColorClasses();

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[600px] p-8',
        `bg-gradient-to-br ${colorClasses.bg}`,
        `border ${colorClasses.border} rounded-lg`,
        'transition-all duration-300',
        isSelected && `ring-2 ring-${categoryColor}-500`,
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
          <input
            type="text"
            value={title}
            onChange={(e) => handlePropertyChange('title', e.target.value)}
            placeholder="Título da seção"
            className="w-full text-2xl font-bold text-center p-2 border border-gray-300 rounded mb-4"
          />
        ) : (
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {title}
          </h1>
        )}
      </div>

      {/* Ícone e Nome da Categoria */}
      <div className="text-center mb-8">
        {/* Ícone Principal */}
        <div className={cn(
          'mb-6 p-8 rounded-full bg-white/90 shadow-xl mx-auto w-fit',
          'animate-pulse',
          colorClasses.icon
        )}>
          {getCategoryIcon()}
        </div>

        {/* Nome da Categoria */}
        {isEditMode ? (
          <input
            type="text"
            value={categoryName}
            onChange={(e) => handlePropertyChange('categoryName', e.target.value)}
            placeholder="Nome da categoria"
            className="w-full text-3xl font-bold text-center p-2 border border-gray-300 rounded mb-4"
          />
        ) : (
          <h2 className={cn('text-4xl font-bold mb-4', colorClasses.accent)}>
            {categoryName}
          </h2>
        )}

        {/* Porcentagem de Compatibilidade */}
        {showPercentage && (
          <div className="mb-6">
            <div className={cn('text-2xl font-semibold mb-2', colorClasses.accent)}>
              {percentage}% de compatibilidade
            </div>
            <div className="max-w-xs mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={cn(
                    'h-3 rounded-full transition-all duration-1000 ease-out',
                    colorClasses.progress
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Descrição da Categoria */}
        {isEditMode ? (
          <textarea
            value={categoryDescription}
            onChange={(e) => handlePropertyChange('categoryDescription', e.target.value)}
            placeholder="Descrição da categoria"
            rows={4}
            className="w-full max-w-2xl mx-auto p-3 border border-gray-300 rounded resize-none"
          />
        ) : (
          <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
            {categoryDescription}
          </p>
        )}
      </div>

      {/* Características Principais */}
      {showCharacteristics && (
        <div className={cn('p-6 rounded-lg mb-6', colorClasses.card, 'border')}>
          <h3 className="text-xl font-semibold mb-4 text-center">
            Características Principais
          </h3>
          
          {isEditMode ? (
            <div className="space-y-2">
              {characteristics.map((characteristic, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={characteristic}
                    onChange={(e) => {
                      const newCharacteristics = [...characteristics];
                      newCharacteristics[index] = e.target.value;
                      handlePropertyChange('characteristics', newCharacteristics);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder={`Característica ${index + 1}`}
                  />
                  {characteristics.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newCharacteristics = characteristics.filter((_, i) => i !== index);
                        handlePropertyChange('characteristics', newCharacteristics);
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
                  const newCharacteristics = [...characteristics, 'Nova característica...'];
                  handlePropertyChange('characteristics', newCharacteristics);
                }}
                className="w-full border-dashed"
              >
                + Adicionar Característica
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {characteristics.map((characteristic, index) => (
                <Badge
                  key={index}
                  className={cn('text-center py-2 px-3', colorClasses.badge)}
                >
                  {characteristic}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pontos Fortes */}
        {showStrengths && (
          <div className="bg-white/60 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Pontos Fortes
            </h3>
            
            {isEditMode ? (
              <div className="space-y-2">
                {strengths.map((strength, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={strength}
                      onChange={(e) => {
                        const newStrengths = [...strengths];
                        newStrengths[index] = e.target.value;
                        handlePropertyChange('strengths', newStrengths);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder={`Ponto forte ${index + 1}`}
                    />
                    {strengths.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newStrengths = strengths.filter((_, i) => i !== index);
                          handlePropertyChange('strengths', newStrengths);
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
                    const newStrengths = [...strengths, 'Novo ponto forte...'];
                    handlePropertyChange('strengths', newStrengths);
                  }}
                  className="w-full border-dashed"
                >
                  + Adicionar Ponto Forte
                </Button>
              </div>
            ) : (
              <ul className="space-y-2">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {strength}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Áreas de Crescimento */}
        {showGrowthAreas && (
          <div className="bg-white/60 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-orange-700 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Áreas de Crescimento
            </h3>
            
            {isEditMode ? (
              <div className="space-y-2">
                {growthAreas.map((area, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => {
                        const newGrowthAreas = [...growthAreas];
                        newGrowthAreas[index] = e.target.value;
                        handlePropertyChange('growthAreas', newGrowthAreas);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder={`Área de crescimento ${index + 1}`}
                    />
                    {growthAreas.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newGrowthAreas = growthAreas.filter((_, i) => i !== index);
                          handlePropertyChange('growthAreas', newGrowthAreas);
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
                    const newGrowthAreas = [...growthAreas, 'Nova área...'];
                    handlePropertyChange('growthAreas', newGrowthAreas);
                  }}
                  className="w-full border-dashed"
                >
                  + Adicionar Área
                </Button>
              </div>
            ) : (
              <ul className="space-y-2">
                {growthAreas.map((area, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {area}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Botão de Ação */}
      {!isEditMode && (
        <div className="text-center mt-8">
          <Button
            className={cn(
              'px-8 py-3 text-lg font-medium text-white rounded-lg',
              'transition-all duration-200 transform hover:scale-105',
              'shadow-lg hover:shadow-xl',
              colorClasses.progress
            )}
          >
            Ver Recomendações Personalizadas
          </Button>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Configurações Básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Porcentagem de Compatibilidade
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => handlePropertyChange('percentage', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showPercentage ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showPercentage', !showPercentage)}
            >
              Mostrar %
            </Badge>
            
            <Badge
              variant={showCharacteristics ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showCharacteristics', !showCharacteristics)}
            >
              Características
            </Badge>

            <Badge
              variant={showStrengths ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showStrengths', !showStrengths)}
            >
              Pontos Fortes
            </Badge>

            <Badge
              variant={showGrowthAreas ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showGrowthAreas', !showGrowthAreas)}
            >
              Áreas de Crescimento
            </Badge>
          </div>

          {/* Seletor de Ícone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ícone da Categoria
            </label>
            <div className="flex gap-2">
              {['brain', 'crown', 'zap', 'heart', 'target', 'lightbulb', 'user', 'users'].map((icon) => (
                <Badge
                  key={icon}
                  variant={iconType === icon ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('iconType', icon)}
                >
                  {icon}
                </Badge>
              ))}
            </div>
          </div>

          {/* Seletor de Cor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor da Categoria
            </label>
            <div className="flex gap-2">
              {['purple', 'blue', 'green', 'orange', 'red'].map((color) => (
                <Badge
                  key={color}
                  variant={categoryColor === color ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('categoryColor', color)}
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

export default QuizCategoryInlineBlock;
