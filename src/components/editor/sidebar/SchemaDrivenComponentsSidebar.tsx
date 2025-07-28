<<<<<<< HEAD
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DraggableComponentItem } from '../dnd/DraggableComponentItem';
import { blockDefinitions } from '@/config/blockDefinitionsClean';
import { 
  Type, Image, ArrowRight, CheckCircle, Target, Play, Star, FileText, ShoppingCart, Clock, 
  MessageSquare, HelpCircle, Shield, Video, AlertTriangle, Zap, Volume2, RotateCcw, Loader, 
  BarChart3, Quote, FormInput, List, TrendingUp, Grid, FileCode, BookOpen, Palette, Sparkles, 
  Gift, Award, Layers, Users, Brain, Crown, Heart, Mic, GalleryHorizontalEnd, RotateCw, 
  Blocks, Layout, MousePointer, Package
} from 'lucide-react';
=======
import React, { useState, useMemo } from 'react';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Tabs } from '../../ui-new/Tabs';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { PlusOutlined, AppstoreOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import { Space, Typography, Empty, Divider } from 'antd';
import { allBlockDefinitions } from '../../../config/blockDefinitions';
import { renderLucideIcon } from '../../../utils/iconMap';

const { Text } = Typography;
>>>>>>> main

interface SchemaDrivenComponentsSidebarProps {
  onComponentSelect: (type: string) => void;
  activeTab: 'components' | 'pages';
  onTabChange: (tab: string) => void;
  funnelPages: any[];
  currentPageId?: string;
  setCurrentPage: (pageId: string) => void;
}

export const SchemaDrivenComponentsSidebar: React.FC<SchemaDrivenComponentsSidebarProps> = ({
  onComponentSelect,
  activeTab,
  onTabChange,
  funnelPages,
  currentPageId,
  setCurrentPage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar blocos por busca
  const filteredBlocks = useMemo(() => {
    if (!searchTerm) return allBlockDefinitions;
    
    return allBlockDefinitions.filter(block =>
      block.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Agrupar blocos por categoria
  const blocksByCategory = useMemo(() => {
    const grouped = filteredBlocks.reduce((acc, block) => {
      const category = block.category || 'Outros';
      if (!acc[category]) acc[category] = [];
      acc[category].push(block);
      return acc;
    }, {} as Record<string, typeof allBlockDefinitions>);
    
    return grouped;
  }, [filteredBlocks]);

  const renderComponentsTab = () => (
    <div className="p-4 space-y-4">
      {/* Search Input */}
      <Input
        variant="search"
        placeholder="Buscar componentes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        allowClear
      />

      {/* Components by Category */}
      {Object.entries(blocksByCategory).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(blocksByCategory).map(([category, blocks]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center space-x-2">
                <AppstoreOutlined className="text-[#B89B7A]" />
                <Text strong className="text-[#432818] text-sm uppercase tracking-wide">
                  {category}
                </Text>
                <Badge variant="secondary" size="small">
                  {blocks.length}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {blocks.map((block) => (
                  <Card
                    key={block.type}
                    variant="component"
                    size="small"
                    onClick={() => onComponentSelect(block.type)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#B89B7A]/20 to-[#aa6b5d]/20 rounded-lg flex items-center justify-center">
                        {block.icon ? (
                          renderLucideIcon(block.icon, "w-4 h-4 text-[#B89B7A]")
                        ) : (
                          <AppstoreOutlined className="w-4 h-4 text-[#B89B7A]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Text strong className="text-[#432818] text-sm block">
                          {block.label || block.type}
                        </Text>
                        {block.description && (
                          <Text className="text-[#8F7A6A] text-xs block truncate">
                            {block.description}
                          </Text>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text className="text-[#8F7A6A]">
              {searchTerm ? 'Nenhum componente encontrado' : 'Nenhum componente disponível'}
            </Text>
          }
        />
      )}
    </div>
  );

  const renderPagesTab = () => (
    <div className="p-4 space-y-4">
      {/* Add Page Button */}
      <Button
        variant="primary"
        size="small"
        fullWidth
        icon={<PlusOutlined />}
        onClick={() => {
          // Lógica para adicionar nova página
          console.log('Adicionar nova página');
        }}
      >
        Nova Página
      </Button>

      <Divider className="my-4" />

      {/* Pages List */}
      {funnelPages.length > 0 ? (
        <div className="space-y-2">
          {funnelPages.map((page, index) => (
            <Card
              key={page.id}
              variant="page"
              size="small"
              className={`cursor-pointer transition-all duration-200 ${
                currentPageId === page.id 
                  ? 'bg-[#B89B7A]/10 border-[#B89B7A]' 
                  : 'hover:bg-[#B89B7A]/5'
              }`}
              onClick={() => setCurrentPage(page.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentPageId === page.id
                    ? 'bg-[#B89B7A] text-white'
                    : 'bg-[#B89B7A]/20 text-[#432818]'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <Text strong className="text-[#432818] text-sm block truncate">
                    {page.title || `Página ${index + 1}`}
                  </Text>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="info" size="small">
                      {page.blocks?.length || 0} blocos
                    </Badge>
                    {page.type && (
                      <Badge variant="secondary" size="small">
                        {page.type}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text className="text-[#8F7A6A]">
              Nenhuma página criada
            </Text>
          }
        />
      )}
    </div>
  );

  return (
<<<<<<< HEAD
    <div className="h-full flex flex-col">
      <div className="p-2 sm:p-4 border-b border-gray-200">
        <h2 className="font-playfair text-base sm:text-lg text-[#432818]">Biblioteca</h2>
        <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
          <span>{funnelPages.length} páginas</span>
          <span>•</span>
          <span>{allBlocks.length} blocos</span>
          <span>•</span>
          <span>{categories.length} categorias</span>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col min-h-0">
        <div className="border-b border-gray-200 px-2 sm:px-4 py-2 flex-shrink-0">
          <TabsList className="w-full">
            <TabsTrigger value="pages" className="flex-1 text-xs sm:text-sm">Páginas</TabsTrigger>
            <TabsTrigger value="blocks" className="flex-1 text-xs sm:text-sm">Blocos</TabsTrigger>
          </TabsList>
        </div>
        
        {/* ABA PÁGINAS */}
        <TabsContent value="pages" className="flex-1 p-0 m-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-2 sm:p-3 space-y-1 sm:space-y-2">
              {funnelPages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Nenhuma página encontrada</p>
                  <p className="text-xs mt-1">Crie um novo funil para começar</p>
                </div>
              ) : (
                funnelPages
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((page, index) => (
                    <Button
                      key={page.id}
                      variant="ghost"
                      className={`w-full justify-start px-2 sm:px-3 py-2 sm:py-2.5 h-auto text-left rounded-md hover:bg-gray-50 transition-colors ${
                        page.id === currentPageId 
                          ? 'bg-[#B89B7A]/10 border border-[#B89B7A]/20 text-[#432818]' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentPage && setCurrentPage(page.id)}
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3 w-full">
                        <div className={`mt-0.5 flex-shrink-0 ${
                          page.id === currentPageId ? 'text-[#B89B7A]' : 'text-gray-400'
                        }`}>
                          {getPageIcon(page)}
                        </div>
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <div className="flex items-center space-x-2 w-full">
                            <span className="font-medium text-xs sm:text-sm text-[#432818] truncate flex-1">
                              {page.name || page.title || `Página ${page.order || index + 1}`}
                            </span>
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-gray-50 text-gray-600 border-gray-200 hidden sm:inline-flex"
                            >
                              {page.order || index + 1}
                            </Badge>
                          </div>
                          {page.title && page.name !== page.title && (
                            <span className="text-xs text-gray-500 truncate w-full mt-0.5 hidden sm:block">
                              {page.title}
                            </span>
                          )}
                          {page.blocks && (
                            <span className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                              {page.blocks.length} bloco{page.blocks.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* ABA BLOCOS */}
        <TabsContent value="blocks" className="flex-1 p-0 m-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
              {categories.map(category => {
                const categoryBlocks = getBlocksByCategory(category);
                
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-700">
                        {category}
                      </h3>
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                        {categoryBlocks.length}
                      </Badge>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      {categoryBlocks.map((block, blockIndex) => (
                        <DraggableComponentItem
                          key={`${block.type}-${blockIndex}`}
                          blockType={block.type}
                          title={block.name}
                          description={block.description || 'Componente sem descrição'}
                          icon={iconMap[block.icon || 'Type'] || <Type className="w-4 h-4" />}
                          category={category}
                          className="w-full justify-start hover:bg-[#FAF9F7] transition-colors group"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {/* Footer com estatísticas */}
      <div className="border-t border-gray-200 p-2 sm:p-3 bg-gray-50/50">
        <div className="text-xs text-gray-500 text-center">
          {activeTab === 'pages' ? (
            <span>
              Página ativa: {currentPageId ? funnelPages.find(p => p.id === currentPageId)?.name || 'Não encontrada' : 'Nenhuma'}
            </span>
          ) : (
            <span>
              Total de componentes disponíveis: {allBlocks.length}
            </span>
          )}
        </div>
      </div>
=======
    <div className="h-full flex flex-col bg-white">
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        items={[
          {
            key: 'components',
            label: (
              <Space size="small">
                <AppstoreOutlined />
                Blocos
              </Space>
            ),
            children: renderComponentsTab(),
          },
          {
            key: 'pages',
            label: (
              <Space size="small">
                <FileTextOutlined />
                Páginas
              </Space>
            ),
            children: renderPagesTab(),
          },
        ]}
        className="flex-1"
      />
>>>>>>> main
    </div>
  );
};

export default SchemaDrivenComponentsSidebar;