import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Award, Trophy, Medal, Star, Crown, Target, Zap, Heart, Shield, Flame, Lock, CheckCircle, Clock, Calendar } from 'lucide-react';

interface QuizBadgesInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de badges
}

/**
 * Componente inline para conquistas e badges (Etapa 15)
 * Sistema de gamificação com badges conquistados e objetivos
 */
export const QuizBadgesInlineBlock: React.FC<QuizBadgesInlineBlockProps> = ({
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

  const title = properties.title || 'Suas Conquistas e Badges';
  const subtitle = properties.subtitle || 'Acompanhe seu progresso e comemore suas conquistas no desenvolvimento profissional';
  const totalBadges = properties.totalBadges || 24;
  const earnedBadges = properties.earnedBadges || 18;
  const badgeCategories = properties.badgeCategories || [
    {
      id: 1,
      name: 'Competências',
      description: 'Domínio de habilidades específicas',
      badges: [
        {
          id: 1,
          name: 'Mestre em Liderança',
          description: 'Alcançou 90%+ em avaliações de liderança',
          icon: 'crown',
          rarity: 'legendary',
          earned: true,
          earnedDate: '2025-01-15',
          progress: 100,
          requirement: 'Pontuação 90%+ em Liderança'
        },
        {
          id: 2,
          name: 'Inovador Expert',
          description: 'Demonstrou excelência em pensamento inovador',
          icon: 'zap',
          rarity: 'epic',
          earned: true,
          earnedDate: '2025-01-10',
          progress: 100,
          requirement: 'Pontuação 85%+ em Inovação'
        },
        {
          id: 3,
          name: 'Estrategista Avançado',
          description: 'Domínio em planejamento estratégico',
          icon: 'target',
          rarity: 'rare',
          earned: true,
          earnedDate: '2025-01-05',
          progress: 100,
          requirement: 'Pontuação 80%+ em Estratégia'
        },
        {
          id: 4,
          name: 'Comunicador Nato',
          description: 'Excelência em comunicação interpessoal',
          icon: 'heart',
          rarity: 'uncommon',
          earned: false,
          earnedDate: null,
          progress: 75,
          requirement: 'Pontuação 85%+ em Comunicação'
        }
      ]
    },
    {
      id: 2,
      name: 'Engajamento',
      description: 'Participação e dedicação na plataforma',
      badges: [
        {
          id: 5,
          name: 'Guerreiro Consistente',
          description: 'Completou avaliações por 30 dias seguidos',
          icon: 'flame',
          rarity: 'epic',
          earned: true,
          earnedDate: '2025-01-20',
          progress: 100,
          requirement: '30 dias consecutivos'
        },
        {
          id: 6,
          name: 'Explorador Curioso',
          description: 'Completou 10 avaliações diferentes',
          icon: 'star',
          rarity: 'rare',
          earned: true,
          earnedDate: '2025-01-12',
          progress: 100,
          requirement: '10 avaliações completas'
        },
        {
          id: 7,
          name: 'Velocista',
          description: 'Completou avaliação em tempo recorde',
          icon: 'clock',
          rarity: 'uncommon',
          earned: false,
          earnedDate: null,
          progress: 60,
          requirement: 'Tempo < 5 minutos'
        }
      ]
    },
    {
      id: 3,
      name: 'Conquistas Especiais',
      description: 'Marcos únicos e exclusivos',
      badges: [
        {
          id: 8,
          name: 'Primeiro Lugar',
          description: 'Alcançou o topo do ranking global',
          icon: 'trophy',
          rarity: 'legendary',
          earned: false,
          earnedDate: null,
          progress: 0,
          requirement: 'Posição #1 no ranking'
        },
        {
          id: 9,
          name: 'Perfeccionista',
          description: 'Pontuação 100% em uma avaliação',
          icon: 'shield',
          rarity: 'epic',
          earned: false,
          earnedDate: null,
          progress: 87,
          requirement: 'Pontuação perfeita'
        }
      ]
    }
  ];
  const showProgress = properties.showProgress || true;
  const showRarity = properties.showRarity || true;
  const showDates = properties.showDates || true;
  const showRequirements = properties.showRequirements || true;
  const layoutStyle = properties.layoutStyle || 'grid'; // grid, list, carousel
  const theme = properties.theme || 'gold';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getBadgeIcon = (iconType: string) => {
    const icons = {
      crown: Crown,
      trophy: Trophy,
      medal: Medal,
      star: Star,
      target: Target,
      zap: Zap,
      heart: Heart,
      shield: Shield,
      flame: Flame,
      award: Award,
      clock: Clock
    };
    const IconComponent = icons[iconType as keyof typeof icons] || Award;
    return <IconComponent className="w-8 h-8" />;
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      legendary: {
        bg: 'from-yellow-400 to-amber-500',
        border: 'border-yellow-400',
        text: 'text-yellow-800',
        glow: 'shadow-yellow-400/50'
      },
      epic: {
        bg: 'from-purple-400 to-violet-500',
        border: 'border-purple-400',
        text: 'text-purple-800',
        glow: 'shadow-purple-400/50'
      },
      rare: {
        bg: 'from-blue-400 to-indigo-500',
        border: 'border-blue-400',
        text: 'text-blue-800',
        glow: 'shadow-blue-400/50'
      },
      uncommon: {
        bg: 'from-green-400 to-emerald-500',
        border: 'border-green-400',
        text: 'text-green-800',
        glow: 'shadow-green-400/50'
      },
      common: {
        bg: 'from-gray-400 to-slate-500',
        border: 'border-gray-400',
        text: 'text-gray-800',
        glow: 'shadow-gray-400/50'
      }
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getThemeClasses = () => {
    const themes = {
      gold: {
        bg: 'from-yellow-50 to-amber-50',
        border: 'border-yellow-200',
        accent: 'text-yellow-600',
        button: 'bg-yellow-600 hover:bg-yellow-700'
      },
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        accent: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      blue: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        accent: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      }
    };
    return themes[theme as keyof typeof themes] || themes.gold;
  };

  const themeClasses = getThemeClasses();
  const completionPercentage = Math.round((earnedBadges / totalBadges) * 100);

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
              placeholder="Título dos badges"
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

      {/* Estatísticas Gerais */}
      <div className="mb-8">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {earnedBadges}/{totalBadges}
              </div>
              <div className="text-sm text-gray-600">Badges Conquistados</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {completionPercentage}%
              </div>
              <div className="text-sm text-gray-600">Progresso Geral</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {badgeCategories.length}
              </div>
              <div className="text-sm text-gray-600">Categorias</div>
            </div>
          </div>

          {/* Barra de Progresso Geral */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={cn(
                  'h-3 rounded-full transition-all duration-1000 ease-out',
                  'bg-gradient-to-r from-yellow-400 to-amber-500'
                )}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categorias de Badges */}
      <div className="space-y-8">
        {badgeCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg border shadow-sm p-6">
            {/* Cabeçalho da Categoria */}
            <div className="mb-6">
              {isEditMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => {
                      const updatedCategories = badgeCategories.map(cat =>
                        cat.id === category.id ? { ...cat, name: e.target.value } : cat
                      );
                      handlePropertyChange('badgeCategories', updatedCategories);
                    }}
                    className="w-full text-xl font-semibold p-2 border border-gray-300 rounded"
                  />
                  <textarea
                    value={category.description}
                    onChange={(e) => {
                      const updatedCategories = badgeCategories.map(cat =>
                        cat.id === category.id ? { ...cat, description: e.target.value } : cat
                      );
                      handlePropertyChange('badgeCategories', updatedCategories);
                    }}
                    rows={1}
                    className="w-full p-2 border border-gray-300 rounded resize-none"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              )}
            </div>

            {/* Grid de Badges */}
            <div className={cn(
              layoutStyle === 'grid' && 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
              layoutStyle === 'list' && 'space-y-4',
              layoutStyle === 'carousel' && 'flex gap-4 overflow-x-auto pb-2'
            )}>
              {category.badges.map((badge) => {
                const rarityColors = getRarityColor(badge.rarity);
                
                return (
                  <div
                    key={badge.id}
                    className={cn(
                      'relative p-4 rounded-lg border-2 transition-all duration-300',
                      'hover:scale-105 hover:shadow-lg',
                      badge.earned 
                        ? `${rarityColors.border} bg-gradient-to-br ${rarityColors.bg} shadow-lg ${rarityColors.glow}`
                        : 'border-gray-300 bg-gray-50',
                      layoutStyle === 'carousel' && 'flex-shrink-0 w-64'
                    )}
                  >
                    {/* Ícone do Badge */}
                    <div className="text-center mb-3">
                      <div className={cn(
                        'w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2',
                        badge.earned 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      )}>
                        {badge.earned ? (
                          getBadgeIcon(badge.icon)
                        ) : (
                          <Lock className="w-8 h-8" />
                        )}
                      </div>
                      
                      {showRarity && (
                        <Badge 
                          className={cn(
                            'text-xs capitalize',
                            badge.earned ? rarityColors.text : 'text-gray-600'
                          )}
                          variant={badge.earned ? "default" : "outline"}
                        >
                          {badge.rarity}
                        </Badge>
                      )}
                    </div>

                    {/* Informações do Badge */}
                    <div className="text-center">
                      {isEditMode ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={badge.name}
                            onChange={(e) => {
                              const updatedCategories = badgeCategories.map(cat =>
                                cat.id === category.id ? {
                                  ...cat,
                                  badges: cat.badges.map(b =>
                                    b.id === badge.id ? { ...b, name: e.target.value } : b
                                  )
                                } : cat
                              );
                              handlePropertyChange('badgeCategories', updatedCategories);
                            }}
                            className="w-full font-semibold p-1 border border-gray-300 rounded text-sm"
                          />
                          <textarea
                            value={badge.description}
                            onChange={(e) => {
                              const updatedCategories = badgeCategories.map(cat =>
                                cat.id === category.id ? {
                                  ...cat,
                                  badges: cat.badges.map(b =>
                                    b.id === badge.id ? { ...b, description: e.target.value } : b
                                  )
                                } : cat
                              );
                              handlePropertyChange('badgeCategories', updatedCategories);
                            }}
                            rows={2}
                            className="w-full text-xs p-1 border border-gray-300 rounded resize-none"
                          />
                        </div>
                      ) : (
                        <div>
                          <h4 className={cn(
                            'font-semibold mb-1 text-sm',
                            badge.earned ? 'text-white' : 'text-gray-700'
                          )}>
                            {badge.name}
                          </h4>
                          
                          <p className={cn(
                            'text-xs mb-3 leading-relaxed',
                            badge.earned ? 'text-white/90' : 'text-gray-600'
                          )}>
                            {badge.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Estado do Badge */}
                    {badge.earned ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-white/90 text-xs mb-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Conquistado</span>
                        </div>
                        
                        {showDates && badge.earnedDate && (
                          <div className="flex items-center justify-center gap-1 text-white/70 text-xs">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(badge.earnedDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {/* Progresso */}
                        {showProgress && (
                          <div className="mb-2">
                            <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                              <span>Progresso</span>
                              <span>{badge.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${badge.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Requisito */}
                        {showRequirements && (
                          <div className="text-xs text-gray-600 text-center">
                            <span className="font-medium">Requisito:</span>
                            <br />
                            {badge.requirement}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

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
            Explorar Mais Badges
            <Star className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badges Conquistados
              </label>
              <input
                type="number"
                min="0"
                value={earnedBadges}
                onChange={(e) => handlePropertyChange('earnedBadges', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total de Badges
              </label>
              <input
                type="number"
                min="1"
                value={totalBadges}
                onChange={(e) => handlePropertyChange('totalBadges', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

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
              variant={showRarity ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showRarity', !showRarity)}
            >
              Mostrar Raridade
            </Badge>

            <Badge
              variant={showDates ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showDates', !showDates)}
            >
              Mostrar Datas
            </Badge>

            <Badge
              variant={showRequirements ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showRequirements', !showRequirements)}
            >
              Mostrar Requisitos
            </Badge>
          </div>

          {/* Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layout
            </label>
            <div className="flex gap-2">
              {['grid', 'list', 'carousel'].map((layout) => (
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
              {['gold', 'purple', 'blue'].map((color) => (
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

export default QuizBadgesInlineBlock;
