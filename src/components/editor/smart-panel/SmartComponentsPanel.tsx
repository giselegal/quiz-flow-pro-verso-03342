import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, Clock, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { blockDefinitions } from '@/config/blockDefinitions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * 🔍 PAINEL INTELIGENTE DE COMPONENTES
 * 
 * Sistema avançado de busca e organização para 167+ componentes
 * - Busca inteligente por nome, categoria e funcionalidade
 * - Filtros por categoria e popularidade
 * - Favoritos do usuário
 * - Componentes recentes
 * - Sugestões baseadas no contexto
 */

interface ComponentItem {
  type: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  tags: string[];
  popularity: number;
  isNew?: boolean;
  isFavorite?: boolean;
  lastUsed?: Date;
}

interface SmartComponentsPanelProps {
  currentStepNumber?: number;
  onComponentSelect?: (componentType: string) => void;
  viewMode?: 'grid' | 'list';
  className?: string;
}

// Categorias organizadas com cores e ícones
const CATEGORIES = {
  'quiz': { 
    label: 'Quiz & Interativo', 
    color: 'bg-blue-100 text-blue-800', 
    icon: '🧠',
    description: 'Perguntas, opções e elementos interativos'
  },
  'action': { 
    label: 'Ação & CTA', 
    color: 'bg-green-100 text-green-800', 
    icon: '🎯',
    description: 'Botões, CTAs e elementos de conversão'
  },
  'text': { 
    label: 'Texto & Conteúdo', 
    color: 'bg-gray-100 text-gray-800', 
    icon: '📝',
    description: 'Títulos, parágrafos e elementos textuais'
  },
  'media': { 
    label: 'Mídia', 
    color: 'bg-purple-100 text-purple-800', 
    icon: '🎬',
    description: 'Imagens, vídeos e elementos visuais'
  },
  'layout': { 
    label: 'Layout & Estrutura', 
    color: 'bg-indigo-100 text-indigo-800', 
    icon: '🏗️',
    description: 'Espaçadores, divisores e elementos estruturais'
  },
  'social-proof': { 
    label: 'Prova Social', 
    color: 'bg-pink-100 text-pink-800', 
    icon: '⭐',
    description: 'Depoimentos, avaliações e elementos de confiança'
  },
  'pricing': { 
    label: 'Preços & Ofertas', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: '💰',
    description: 'Tabelas de preço, ofertas e elementos comerciais'
  },
  'urgency': { 
    label: 'Urgência', 
    color: 'bg-red-100 text-red-800', 
    icon: '⏰',
    description: 'Contadores, timers e elementos de urgência'
  },
  'forms': { 
    label: 'Formulários', 
    color: 'bg-teal-100 text-teal-800', 
    icon: '📋',
    description: 'Campos, inputs e elementos de formulário'
  },
  'misc': { 
    label: 'Diversos', 
    color: 'bg-stone-100 text-stone-800', 
    icon: '🔧',
    description: 'Outros elementos especializados'
  }
};

// Componentes populares baseados no uso típico
const POPULAR_COMPONENTS = new Set([
  'text-inline', 'heading-inline', 'button-inline', 'image-inline', 
  'spacer-inline', 'quiz-question', 'quiz-option', 'cta-inline',
  'testimonial-inline', 'pricing-inline'
]);

// Componentes recomendados por etapa
const STEP_RECOMMENDATIONS = {
  1: ['quiz-intro-header', 'heading-inline', 'text-inline', 'image-inline'],
  2: ['quiz-question', 'quiz-option', 'options-grid', 'progress-inline'],
  3: ['quiz-question', 'quiz-option', 'options-grid'],
  4: ['quiz-question', 'quiz-option', 'options-grid'],
  5: ['quiz-result-header', 'text-inline', 'image-inline', 'cta-inline'],
  21: ['final-cta', 'pricing-inline', 'testimonial-inline', 'urgency-timer']
};

export const SmartComponentsPanel: React.FC<SmartComponentsPanelProps> = ({
  currentStepNumber = 1,
  onComponentSelect,
  viewMode: initialViewMode = 'grid',
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'recent' | 'favorites'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Gerenciar favoritos e recentes no localStorage
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);

  useEffect(() => {
    // Carregar dados do localStorage
    const savedFavorites = localStorage.getItem('editor-favorites');
    const savedRecent = localStorage.getItem('editor-recent');
    
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
    
    if (savedRecent) {
      setRecentlyUsed(JSON.parse(savedRecent));
    }
  }, []);

  // Preparar dados dos componentes
  const componentItems: ComponentItem[] = useMemo(() => {
    return blockDefinitions.map(def => {
      const tags = [
        def.category,
        def.name.toLowerCase(),
        def.description.toLowerCase(),
        ...def.name.toLowerCase().split(' ')
      ];

      return {
        type: def.type,
        name: def.name,
        description: def.description,
        category: def.category,
        icon: def.icon,
        tags,
        popularity: POPULAR_COMPONENTS.has(def.type) ? 10 : 5,
        isFavorite: favorites.has(def.type),
        isNew: false // Poderia ser baseado em data de criação
      };
    });
  }, [favorites]);

  // Sistema de busca inteligente
  const filteredComponents = useMemo(() => {
    let filtered = componentItems;

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filtro por favoritos
    if (showFavoritesOnly) {
      filtered = filtered.filter(item => item.isFavorite);
    }

    // Busca inteligente
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        return item.tags.some(tag => tag.includes(query)) ||
               item.name.toLowerCase().includes(query) ||
               item.description.toLowerCase().includes(query);
      });

      // Ranking por relevância
      filtered = filtered.sort((a, b) => {
        const aExactMatch = a.name.toLowerCase().includes(query) ? 10 : 0;
        const bExactMatch = b.name.toLowerCase().includes(query) ? 10 : 0;
        const aPopularity = a.popularity || 0;
        const bPopularity = b.popularity || 0;
        
        return (bExactMatch + bPopularity) - (aExactMatch + aPopularity);
      });
    } else {
      // Ordenar por popularidade quando não há busca
      filtered = filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return filtered;
  }, [componentItems, selectedCategory, showFavoritesOnly, searchQuery]);

  // Componentes recomendados para a etapa atual
  const recommendedComponents = useMemo(() => {
    const recommendations = STEP_RECOMMENDATIONS[currentStepNumber as keyof typeof STEP_RECOMMENDATIONS] || [];
    return componentItems.filter(item => recommendations.includes(item.type));
  }, [componentItems, currentStepNumber]);

  // Componentes recentes
  const recentComponents = useMemo(() => {
    return recentlyUsed.slice(0, 8).map(type => 
      componentItems.find(item => item.type === type)
    ).filter(Boolean) as ComponentItem[];
  }, [componentItems, recentlyUsed]);

  // Handlers
  const handleComponentSelect = (componentType: string) => {
    // Atualizar recentes
    const newRecent = [componentType, ...recentlyUsed.filter(t => t !== componentType)].slice(0, 20);
    setRecentlyUsed(newRecent);
    localStorage.setItem('editor-recent', JSON.stringify(newRecent));

    onComponentSelect?.(componentType);
  };

  const toggleFavorite = (componentType: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(componentType)) {
      newFavorites.delete(componentType);
    } else {
      newFavorites.add(componentType);
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('editor-favorites', JSON.stringify(Array.from(newFavorites)));
  };

  // Atalho de teclado para busca
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderComponentCard = (component: ComponentItem) => {
    const category = CATEGORIES[component.category as keyof typeof CATEGORIES] || CATEGORIES.misc;
    
    if (viewMode === 'list') {
      return (
        <div
          key={component.type}
          className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
          onClick={() => handleComponentSelect(component.type)}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
              {category.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{component.name}</span>
                {POPULAR_COMPONENTS.has(component.type) && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{component.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn('text-xs', category.color)}>
              {category.label}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(component.type);
              }}
              className="p-1"
            >
              <Heart className={cn(
                'w-4 h-4',
                component.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              )} />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={component.type}
        className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-all duration-200 hover:border-gray-300"
        onClick={() => handleComponentSelect(component.type)}
      >
        {/* Badge de favorito */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(component.type);
          }}
          className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className={cn(
            'w-4 h-4',
            component.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
          )} />
        </Button>

        {/* Ícone e nome */}
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl mb-3 mx-auto">
            {category.icon}
          </div>
          <h3 className="font-medium text-sm mb-1">{component.name}</h3>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{component.description}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-1">
          <Badge className={cn('text-xs', category.color)}>
            {category.label}
          </Badge>
          {POPULAR_COMPONENTS.has(component.type) && (
            <Badge variant="secondary" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('h-full flex flex-col bg-white', className)}>
      {/* Header com busca e controles */}
      <div className="p-4 border-b space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            ref={searchInputRef}
            placeholder="Buscar componentes... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            {filteredComponents.length} componentes
          </div>
        </div>
      </div>

      {/* Tabs de navegação */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
          <TabsTrigger value="recommended" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Recomendados
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Recentes
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs">
            <Heart className="w-3 h-3 mr-1" />
            Favoritos
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo das tabs */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="all" className="h-full mt-0">
            {/* Filtro por categoria */}
            <div className="p-4 border-b">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory('all')}
                >
                  Todas
                </Badge>
                {Object.entries(CATEGORIES).map(([key, category]) => (
                  <Badge
                    key={key}
                    variant={selectedCategory === key ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(key)}
                  >
                    {category.icon} {category.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Lista de componentes */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredComponents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum componente encontrado</p>
                  <p className="text-sm mt-1">Tente ajustar os filtros ou busca</p>
                </div>
              ) : (
                <div className={cn(
                  viewMode === 'grid' 
                    ? 'grid grid-cols-2 gap-4' 
                    : 'space-y-2'
                )}>
                  {filteredComponents.map(renderComponentCard)}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recommended" className="h-full mt-0 overflow-y-auto p-4">
            <div className="mb-4">
              <h3 className="font-medium text-sm mb-2">Recomendados para Etapa {currentStepNumber}</h3>
              <p className="text-xs text-gray-500">
                Componentes mais adequados para esta etapa do funil
              </p>
            </div>
            
            {recommendedComponents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Sem recomendações específicas</p>
                <p className="text-sm mt-1">Use a aba "Todos" para ver todos os componentes</p>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 gap-4' 
                  : 'space-y-2'
              )}>
                {recommendedComponents.map(renderComponentCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="h-full mt-0 overflow-y-auto p-4">
            <div className="mb-4">
              <h3 className="font-medium text-sm mb-2">Usados Recentemente</h3>
              <p className="text-xs text-gray-500">
                Componentes que você utilizou nos últimos projetos
              </p>
            </div>
            
            {recentComponents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum componente usado recentemente</p>
                <p className="text-xs mt-1">Comece adicionando componentes ao seu projeto</p>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 gap-4' 
                  : 'space-y-2'
              )}>
                {recentComponents.map(renderComponentCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="h-full mt-0 overflow-y-auto p-4">
            <div className="mb-4">
              <h3 className="font-medium text-sm mb-2">Seus Favoritos</h3>
              <p className="text-xs text-gray-500">
                Componentes que você marcou como favoritos
              </p>
            </div>
            
            {Array.from(favorites).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum favorito ainda</p>
                <p className="text-sm mt-1">Clique no ❤️ para adicionar componentes aos favoritos</p>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 gap-4' 
                  : 'space-y-2'
              )}>
                {componentItems
                  .filter(c => c.isFavorite)
                  .map(renderComponentCard)}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SmartComponentsPanel;