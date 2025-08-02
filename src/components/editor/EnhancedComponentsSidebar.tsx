import React, { useState, useMemo } from 'react';
import { Search, Filter, Tag, Grid3X3, List, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  BLOCK_CATEGORIES,
  BLOCK_DEFINITIONS,
  getAllBlockTypes,
  searchBlocks,
  getBlocksByCategory,
  BlockDefinition
} from './blocks/EnhancedBlockRegistry';

// 🎨 ENHANCED COMPONENTS SIDEBAR - Sidebar Moderna com Busca e Filtros
// Sistema avançado de navegação de componentes baseado na auditoria completa

interface EnhancedComponentsSidebarProps {
  onAddBlock?: (blockType: string) => void;
  onComponentSelect?: (blockType: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

interface ViewMode {
  type: 'grid' | 'list';
  label: string;
  icon: React.ReactNode;
}

const VIEW_MODES: ViewMode[] = [
  { type: 'grid', label: 'Grade', icon: <Grid3X3 className="w-4 h-4" /> },
  { type: 'list', label: 'Lista', icon: <List className="w-4 h-4" /> }
];

const EnhancedComponentsSidebar: React.FC<EnhancedComponentsSidebarProps> = ({
  onAddBlock,
  onComponentSelect,
  isCollapsed = false,
  onToggleCollapse,
  selectedCategory = 'all',
  onCategoryChange
}) => {
  // 🔍 ESTADO DE BUSCA E FILTROS
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['basico', 'quiz', 'vendas'])
  );
  const [showFilters, setShowFilters] = useState(false);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  // 📊 ESTATÍSTICAS DOS COMPONENTES
  const allBlockTypes = getAllBlockTypes();
  const totalBlocks = allBlockTypes.length;
  
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    Object.values(BLOCK_CATEGORIES).forEach(category => {
      const categoryKey = Object.keys(BLOCK_CATEGORIES).find(
        key => BLOCK_CATEGORIES[key as keyof typeof BLOCK_CATEGORIES] === category
      );
      if (categoryKey) {
        stats[categoryKey] = getBlocksByCategory(categoryKey).length;
      }
    });
    return stats;
  }, []);

  // 🔍 BUSCA E FILTROS AVANÇADOS
  const filteredBlocks = useMemo(() => {
    let blocks = Object.values(BLOCK_DEFINITIONS);

    // Aplicar busca por texto
    if (searchQuery.trim()) {
      blocks = searchBlocks(searchQuery);
    }

    // Aplicar filtro de categoria
    if (selectedCategory !== 'all') {
      blocks = blocks.filter(block => block.category === selectedCategory);
    }

    // Aplicar filtros de tags
    if (activeTags.size > 0) {
      blocks = blocks.filter(block => 
        block.tags?.some(tag => activeTags.has(tag))
      );
    }

    return blocks;
  }, [searchQuery, selectedCategory, activeTags]);

  // 🏷️ EXTRAÇÃO DE TAGS DISPONÍVEIS
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    Object.values(BLOCK_DEFINITIONS).forEach(block => {
      block.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // 🎯 HANDLERS
  const handleCategoryToggle = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = new Set(activeTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setActiveTags(newTags);
  };

  const handleAddBlock = (blockType: string) => {
    if (onComponentSelect) {
      onComponentSelect(blockType);
    } else if (onAddBlock) {
      onAddBlock(blockType);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveTags(new Set());
    onCategoryChange?.('all');
  };

  // 📱 COMPONENTE BLOCK CARD
  const BlockCard: React.FC<{ block: any }> = ({ block }) => {
    const category = BLOCK_CATEGORIES[block.category as keyof typeof BLOCK_CATEGORIES];
    
    return (
      <div
        className={cn(
          'group relative p-3 rounded-lg border border-gray-200 hover:border-blue-300',
          'bg-white hover:bg-blue-50 transition-all duration-200 cursor-pointer',
          'hover:shadow-md active:scale-95',
          viewMode === 'list' ? 'flex items-center gap-3' : 'flex flex-col gap-2'
        )}
        onClick={() => handleAddBlock(block.type)}
        title={block.description}
      >
        {/* Icon e Nome */}
        <div className={cn(
          'flex items-center gap-2',
          viewMode === 'grid' && 'justify-center'
        )}>
          <span className="text-lg" style={{ color: category?.color }}>
            {block.icon}
          </span>
          <span className={cn(
            'font-medium text-gray-800 text-sm',
            viewMode === 'grid' && 'text-center'
          )}>
            {block.name}
          </span>
        </div>

        {/* Tags */}
        {block.tags && block.tags.length > 0 && (
          <div className={cn(
            'flex flex-wrap gap-1',
            viewMode === 'list' && 'ml-auto'
          )}>
            {block.tags.slice(0, 2).map((tag: string) => (
              <span 
                key={tag}
                className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
            {block.tags.length > 2 && (
              <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                +{block.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Botão Add (visível no hover) */}
        <button
          className={cn(
            'absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full',
            'flex items-center justify-center opacity-0 group-hover:opacity-100',
            'transition-opacity duration-200 hover:bg-blue-600'
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleAddBlock(block.type);
          }}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    );
  };

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Grid3X3 className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* 📊 HEADER COM ESTATÍSTICAS */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Componentes</h2>
          <div className="flex items-center gap-2">
            {VIEW_MODES.map(mode => (
              <button
                key={mode.type}
                onClick={() => setViewMode(mode.type)}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === mode.type
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-gray-100 text-gray-600'
                )}
                title={mode.label}
              >
                {mode.icon}
              </button>
            ))}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-blue-50 p-2 rounded">
            <div className="font-medium text-blue-800">{totalBlocks}</div>
            <div className="text-blue-600">Total de Blocks</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="font-medium text-green-800">{filteredBlocks.length}</div>
            <div className="text-green-600">Filtrados</div>
          </div>
        </div>
      </div>

      {/* 🔍 BUSCA AVANÇADA */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar componentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtros Avançados */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-sm',
              showFilters 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-600'
            )}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {showFilters ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          
          {(searchQuery || activeTags.size > 0 || selectedCategory !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Tags Filter Panel */}
        {showFilters && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-700 mb-2">Tags:</div>
            <div className="flex flex-wrap gap-1">
              {availableTags.slice(0, 10).map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={cn(
                    'px-2 py-1 text-xs rounded transition-colors',
                    activeTags.has(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 📋 LISTA DE CATEGORIAS E COMPONENTES */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Resultados da Busca */}
        {searchQuery && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Resultados da busca ({filteredBlocks.length})
            </h3>
            <div className={cn(
              'gap-3',
              viewMode === 'grid' 
                ? 'grid grid-cols-2' 
                : 'space-y-2'
            )}>
              {filteredBlocks.map(block => (
                <BlockCard key={block.type} block={block} />
              ))}
            </div>
          </div>
        )}

        {/* Categorias */}
        {!searchQuery && Object.entries(BLOCK_CATEGORIES).map(([categoryKey, category]) => {
          const isExpanded = expandedCategories.has(categoryKey);
          const blocksInCategory = getBlocksByCategory(categoryKey);
          const count = blocksInCategory.length;

          if (count === 0) return null;

          return (
            <div key={categoryKey} className="mb-4">
              <button
                onClick={() => handleCategoryToggle(categoryKey)}
                className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-gray-800">{category.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {count}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className={cn(
                  'mt-2 ml-4 gap-3',
                  viewMode === 'grid' 
                    ? 'grid grid-cols-2' 
                    : 'space-y-2'
                )}>
                  {blocksInCategory.map(block => (
                    <BlockCard key={block.type} block={block} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Estado Vazio */}
        {filteredBlocks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-medium mb-1">Nenhum componente encontrado</div>
            <div className="text-sm">Tente ajustar os filtros ou busca</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedComponentsSidebar;
