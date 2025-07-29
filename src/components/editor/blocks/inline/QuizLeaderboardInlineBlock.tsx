import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Trophy, Medal, Crown, Star, TrendingUp, TrendingDown, Users, Target, Zap, User, ChevronUp, ChevronDown } from 'lucide-react';

interface QuizLeaderboardInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de leaderboard
}

/**
 * Componente inline para ranking e posicionamento (Etapa 14)
 * Exibição do leaderboard com ranking global, regional e por categoria
 */
export const QuizLeaderboardInlineBlock: React.FC<QuizLeaderboardInlineBlockProps> = ({
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

  const title = properties.title || 'Ranking de Performance';
  const subtitle = properties.subtitle || 'Veja sua posição no ranking global e compare-se com outros profissionais';
  const userPosition = properties.userPosition || 15;
  const totalParticipants = properties.totalParticipants || 1247;
  const userScore = properties.userScore || 87;
  const userName = properties.userName || 'Você';
  const userAvatar = properties.userAvatar || '';
  const leaderboardData = properties.leaderboardData || [
    {
      id: 1,
      position: 1,
      name: 'Maria Silva',
      score: 98,
      avatar: '',
      badge: 'champion',
      trend: 'stable',
      category: 'Liderança',
      location: 'São Paulo, SP'
    },
    {
      id: 2,
      position: 2,
      name: 'Carlos Santos',
      score: 95,
      avatar: '',
      badge: 'expert',
      trend: 'up',
      category: 'Inovação',
      location: 'Rio de Janeiro, RJ'
    },
    {
      id: 3,
      position: 3,
      name: 'Ana Costa',
      score: 93,
      avatar: '',
      badge: 'expert',
      trend: 'up',
      category: 'Estratégia',
      location: 'Belo Horizonte, MG'
    },
    {
      id: 4,
      position: 14,
      name: 'Pedro Lima',
      score: 88,
      avatar: '',
      badge: 'advanced',
      trend: 'down',
      category: 'Execução',
      location: 'Porto Alegre, RS'
    },
    {
      id: 5,
      position: 15,
      name: userName,
      score: userScore,
      avatar: userAvatar,
      badge: 'advanced',
      trend: 'up',
      category: 'Visão',
      location: 'Brasil',
      isUser: true
    },
    {
      id: 6,
      position: 16,
      name: 'Lucia Ferreira',
      score: 86,
      avatar: '',
      badge: 'advanced',
      trend: 'stable',
      category: 'Comunicação',
      location: 'Salvador, BA'
    }
  ];
  const categories = properties.categories || [
    { name: 'Global', count: 1247, userRank: 15 },
    { name: 'Brasil', count: 312, userRank: 8 },
    { name: 'Liderança', count: 89, userRank: 3 },
    { name: 'Sua Área', count: 45, userRank: 2 }
  ];
  const achievements = properties.achievements || [
    'Top 5% Global',
    'Melhor da Região',
    'Streak de 7 dias'
  ];
  const showAchievements = properties.showAchievements || true;
  const showCategories = properties.showCategories || true;
  const showTrends = properties.showTrends || true;
  const showUserHighlight = properties.showUserHighlight || true;
  const leaderboardType = properties.leaderboardType || 'global'; // global, regional, category
  const theme = properties.theme || 'gold';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getBadgeIcon = (badge: string) => {
    const badges = {
      champion: Crown,
      expert: Trophy,
      advanced: Medal,
      intermediate: Star,
      beginner: Target
    };
    const BadgeComponent = badges[badge as keyof typeof badges] || Medal;
    return <BadgeComponent className="w-4 h-4" />;
  };

  const getBadgeColor = (badge: string) => {
    const colors = {
      champion: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      expert: 'bg-purple-100 text-purple-800 border-purple-300',
      advanced: 'bg-blue-100 text-blue-800 border-blue-300',
      intermediate: 'bg-green-100 text-green-800 border-green-300',
      beginner: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[badge as keyof typeof colors] || colors.advanced;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ChevronUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ChevronDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">{position}</div>;
    }
  };

  const getThemeClasses = () => {
    const themes = {
      gold: {
        bg: 'from-yellow-50 to-amber-50',
        border: 'border-yellow-200',
        accent: 'text-yellow-600',
        button: 'bg-yellow-600 hover:bg-yellow-700',
        highlight: 'bg-yellow-100 border-yellow-300'
      },
      blue: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        accent: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        highlight: 'bg-blue-100 border-blue-300'
      },
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        accent: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700',
        highlight: 'bg-purple-100 border-purple-300'
      }
    };
    return themes[theme as keyof typeof themes] || themes.gold;
  };

  const themeClasses = getThemeClasses();
  const percentile = Math.round(((totalParticipants - userPosition) / totalParticipants) * 100);

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
              placeholder="Título do ranking"
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

      {/* Estatísticas do Usuário */}
      {showUserHighlight && (
        <div className="mb-8">
          <div className={cn(
            'bg-white rounded-lg border-2 p-6 text-center shadow-lg',
            themeClasses.highlight
          )}>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">#{userPosition}</div>
                <div className="text-sm text-gray-600">Sua Posição</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{percentile}º</div>
                <div className="text-sm text-gray-600">Percentil</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{userScore}%</div>
                <div className="text-sm text-gray-600">Pontuação</div>
              </div>
            </div>
            
            <p className="text-gray-700">
              Você está melhor que <span className="font-bold text-green-600">{percentile}%</span> dos {totalParticipants.toLocaleString()} participantes
            </p>
          </div>
        </div>
      )}

      {/* Rankings por Categoria */}
      {showCategories && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Ranking por Categoria
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border shadow-sm p-4 text-center"
              >
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => {
                        const newCategories = [...categories];
                        newCategories[index] = { ...category, name: e.target.value };
                        handlePropertyChange('categories', newCategories);
                      }}
                      className="w-full font-medium p-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      value={category.userRank}
                      onChange={(e) => {
                        const newCategories = [...categories];
                        newCategories[index] = { ...category, userRank: parseInt(e.target.value) || 1 };
                        handlePropertyChange('categories', newCategories);
                      }}
                      className="w-full text-xl font-bold p-1 border border-gray-300 rounded"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      {category.name}
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      #{category.userRank}
                    </div>
                    <div className="text-xs text-gray-500">
                      de {category.count}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Principal */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6 text-center">
          Top Performers
        </h3>
        
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="space-y-0">
            {leaderboardData.map((participant) => (
              <div
                key={participant.id}
                className={cn(
                  'flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0',
                  'transition-all duration-200 hover:bg-gray-50',
                  participant.isUser && `${themeClasses.highlight} font-semibold`
                )}
              >
                {/* Posição */}
                <div className="flex-shrink-0 w-12 flex justify-center">
                  {getPositionIcon(participant.position)}
                </div>

                {/* Avatar e Nome */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {participant.avatar ? (
                      <img src={participant.avatar} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                      <User className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {isEditMode && !participant.isUser ? (
                      <input
                        type="text"
                        value={participant.name}
                        onChange={(e) => {
                          const updatedData = leaderboardData.map(p =>
                            p.id === participant.id ? { ...p, name: e.target.value } : p
                          );
                          handlePropertyChange('leaderboardData', updatedData);
                        }}
                        className="w-full font-medium p-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div className="font-medium text-gray-800 truncate">
                        {participant.name}
                        {participant.isUser && (
                          <Badge variant="default" className="ml-2 text-xs">Você</Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 truncate">
                      {participant.location}
                    </div>
                  </div>
                </div>

                {/* Badge */}
                <div className="flex-shrink-0">
                  <Badge className={cn('text-xs border', getBadgeColor(participant.badge))}>
                    {getBadgeIcon(participant.badge)}
                    <span className="ml-1 capitalize">{participant.badge}</span>
                  </Badge>
                </div>

                {/* Categoria */}
                <div className="flex-shrink-0 hidden md:block text-sm text-gray-600 w-20 text-center">
                  {participant.category}
                </div>

                {/* Tendência */}
                {showTrends && (
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    {getTrendIcon(participant.trend)}
                  </div>
                )}

                {/* Pontuação */}
                <div className="flex-shrink-0 w-16 text-right">
                  <div className="font-bold text-gray-800">
                    {participant.score}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conquistas */}
      {showAchievements && achievements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Suas Conquistas
          </h3>
          
          {isEditMode ? (
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => {
                      const newAchievements = [...achievements];
                      newAchievements[index] = e.target.value;
                      handlePropertyChange('achievements', newAchievements);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    placeholder={`Conquista ${index + 1}`}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newAchievements = achievements.filter((_, i) => i !== index);
                      handlePropertyChange('achievements', newAchievements);
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
                  const newAchievements = [...achievements, 'Nova conquista...'];
                  handlePropertyChange('achievements', newAchievements);
                }}
                className="w-full border-dashed"
              >
                + Adicionar Conquista
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {achievements.map((achievement, index) => (
                <Badge
                  key={index}
                  className="px-3 py-2 text-sm bg-amber-100 text-amber-800 border-amber-200"
                >
                  <Trophy className="w-4 h-4 mr-1" />
                  {achievement}
                </Badge>
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
            Ver Ranking Completo
            <TrendingUp className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Configurações do Usuário */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posição do Usuário
              </label>
              <input
                type="number"
                min="1"
                value={userPosition}
                onChange={(e) => handlePropertyChange('userPosition', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total de Participantes
              </label>
              <input
                type="number"
                min="1"
                value={totalParticipants}
                onChange={(e) => handlePropertyChange('totalParticipants', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontuação do Usuário
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={userScore}
                onChange={(e) => handlePropertyChange('userScore', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showUserHighlight ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showUserHighlight', !showUserHighlight)}
            >
              Destacar Usuário
            </Badge>
            
            <Badge
              variant={showCategories ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showCategories', !showCategories)}
            >
              Mostrar Categorias
            </Badge>

            <Badge
              variant={showTrends ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showTrends', !showTrends)}
            >
              Mostrar Tendências
            </Badge>

            <Badge
              variant={showAchievements ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showAchievements', !showAchievements)}
            >
              Mostrar Conquistas
            </Badge>
          </div>

          {/* Tipo de Leaderboard */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Ranking
            </label>
            <div className="flex gap-2">
              {['global', 'regional', 'category'].map((type) => (
                <Badge
                  key={type}
                  variant={leaderboardType === type ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('leaderboardType', type)}
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
              {['gold', 'blue', 'purple'].map((color) => (
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

export default QuizLeaderboardInlineBlock;
