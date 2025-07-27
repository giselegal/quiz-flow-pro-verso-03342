import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Star, Crown } from 'lucide-react';
import { 
  AVAILABLE_BLOCKS, 
  BLOCK_CATEGORIES, 
  getBlocksByCategory, 
  getPopularBlocks,
  searchBlocks,
  BlockComponent
} from '../blocks/ModularBlockSystem';

interface ComponentsSidebarProps {
  onComponentSelect: (type: string) => void;
}

interface BlockItemProps {
  block: BlockComponent;
  onSelect: (type: string) => void;
}

const BlockItem: React.FC<BlockItemProps> = ({ block, onSelect }) => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-left p-3 h-auto hover:bg-[#FAF9F7] hover:border-[#B89B7A]/20 border border-transparent"
      onClick={() => onSelect(block.type)}
    >
      <div className="flex items-start gap-3 w-full">
        <div className="flex-shrink-0 w-8 h-8 bg-[#B89B7A]/10 rounded-lg flex items-center justify-center">
          {typeof block.icon === 'string' ? (
            <span className="text-lg">{block.icon}</span>
          ) : (
            React.createElement(block.icon as React.ComponentType<any>, { className: "w-4 h-4 text-[#B89B7A]" })
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-[#432818] text-sm truncate">
              {block.label}
            </span>
            {block.isPopular && (
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
            )}
            {block.isPro && (
              <Crown className="w-3 h-3 text-purple-500" />
            )}
          </div>
          <p className="text-xs text-[#8F7A6A] line-clamp-2">
            {block.description}
          </p>
          {block.preview && (
            <div className="mt-1 text-xs text-[#B89B7A] font-mono bg-[#B89B7A]/5 px-2 py-1 rounded">
              {block.preview}
            </div>
          )}
        </div>
      </div>
    </Button>
  );
};

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ 
  onComponentSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('popular');

  const filteredBlocks = searchQuery 
    ? searchBlocks(searchQuery)
    : activeTab === 'popular' 
      ? getPopularBlocks()
      : getBlocksByCategory(activeTab);

  const handleBlockSelect = (type: string) => {
    onComponentSelect(type);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-[#B89B7A]/20">
      {/* Header */}
      <div className="p-4 border-b border-[#B89B7A]/20">
        <h2 className="font-playfair text-lg text-[#432818] mb-3">Blocos</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F7A6A]" />
          <input
            placeholder="Buscar componentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 h-9 border border-[#B89B7A]/20 rounded focus:border-[#B89B7A] text-sm px-3"
          />
        </div>
      </div>

      {/* Tabs Navigation */}
      {!searchQuery && (
        <div className="px-4 pt-3 pb-2 border-b border-[#B89B7A]/10">
          <div className="flex gap-1 mb-2">
            <Button
              variant={activeTab === 'popular' ? 'default' : 'outline'}
              size="sm"
              className={`h-8 text-xs px-3 ${
                activeTab === 'popular' 
                  ? 'bg-[#B89B7A] text-white hover:bg-[#a08965]' 
                  : 'border-[#B89B7A]/20 text-[#8F7A6A] hover:border-[#B89B7A] hover:text-[#432818]'
              }`}
              onClick={() => setActiveTab('popular')}
            >
              <Star className="w-3 h-3 mr-1" />
              Populares
            </Button>
            <Button
              variant={activeTab === 'basic' ? 'default' : 'outline'}
              size="sm"
              className={`h-8 text-xs px-3 ${
                activeTab === 'basic' 
                  ? 'bg-[#B89B7A] text-white hover:bg-[#a08965]' 
                  : 'border-[#B89B7A]/20 text-[#8F7A6A] hover:border-[#B89B7A] hover:text-[#432818]'
              }`}
              onClick={() => setActiveTab('basic')}
            >
              Básicos
            </Button>
          </div>
          
          {/* Additional Categories */}
          <div className="flex flex-wrap gap-1">
            {BLOCK_CATEGORIES.filter(category => category !== 'basic').map((category) => {
              return (
                <Button
                  key={category}
                  variant={activeTab === category ? 'default' : 'outline'}
                  size="sm"
                  className={`h-7 text-xs px-2 ${
                    activeTab === category 
                      ? 'bg-[#B89B7A] text-white hover:bg-[#a08965]' 
                      : 'border-[#B89B7A]/20 text-[#8F7A6A] hover:border-[#B89B7A] hover:text-[#432818]'
                  }`}
                  onClick={() => setActiveTab(category)}
                >
                  {category}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {/* Search Results */}
        {searchQuery && (
          <div>
            <div className="mb-3">
              <div className="inline-flex items-center px-2 py-1 rounded-md bg-[#B89B7A]/10 border border-[#B89B7A]/30 text-[#432818] text-xs">
                <Search className="w-3 h-3 mr-1" />
                {filteredBlocks.length} resultado{filteredBlocks.length !== 1 ? 's' : ''}
              </div>
            </div>
            {filteredBlocks.length > 0 ? (
              <div className="space-y-2">
                {filteredBlocks.map((block) => (
                  <BlockItem
                    key={block.type}
                    block={block}
                    onSelect={handleBlockSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#8F7A6A]">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum componente encontrado</p>
                <p className="text-xs">Tente buscar por outro termo</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content */}
        {!searchQuery && (
          <div>
            {/* Popular Tab */}
            {activeTab === 'popular' && (
              <div>
                <div className="mb-3">
                  <div className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-100 border border-yellow-200 text-yellow-700 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Mais Usados
                  </div>
                </div>
                <div className="space-y-2">
                  {getPopularBlocks().map((block) => (
                    <BlockItem
                      key={block.type}
                      block={block}
                      onSelect={handleBlockSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Category Tabs */}
            {BLOCK_CATEGORIES.includes(activeTab) && activeTab !== 'popular' && (
              <div>
                <div className="mb-3">
                  <div 
                    className="inline-flex items-center px-2 py-1 rounded-md border text-xs border-[#B89B7A]/30 text-[#432818]"
                  >
                    {activeTab}
                  </div>
                  <p className="text-xs text-[#8F7A6A] mt-1">
                    Componentes da categoria {activeTab}
                  </p>
                </div>
                <div className="space-y-2">
                  {getBlocksByCategory(activeTab).map((block) => (
                    <BlockItem
                      key={block.type}
                      block={block}
                      onSelect={handleBlockSelect}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#B89B7A]/20">
        <div className="flex items-center justify-between text-xs text-[#8F7A6A]">
          <span>{AVAILABLE_BLOCKS.length} componentes</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>Popular</span>
            </div>
            <div className="flex items-center gap-1">
              <Crown className="w-3 h-3 text-purple-500" />
              <span>Pro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
