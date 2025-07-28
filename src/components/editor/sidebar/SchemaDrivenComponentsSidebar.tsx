import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Separator } from '../../ui/separator';
import { ScrollArea } from '../../ui/scroll-area';
import { Plus, Package, FileText, Search } from 'lucide-react';

// Tipo para definição de bloco
interface BlockDefinition {
  type: string;
  category?: string;
  [key: string]: any;
}

interface SchemaDrivenComponentsSidebarProps {
  onComponentSelect: (type: string) => void;
  activeTab: 'components' | 'pages';
  onTabChange: (tab: string) => void;
  funnelPages: any[];
  currentPageId?: string;
  setCurrentPage: (pageId: string) => void;
  onAddPage?: () => void;
}

export const SchemaDrivenComponentsSidebar: React.FC<SchemaDrivenComponentsSidebarProps> = ({
  onComponentSelect,
  activeTab,
  onTabChange,
  funnelPages,
  currentPageId,
  setCurrentPage,
  onAddPage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blockDefinitions, setBlockDefinitions] = useState<BlockDefinition[]>([]);

  // Carregar definições de blocos dinamicamente
  useEffect(() => {
    const loadBlockDefinitions = async () => {
      try {
        const module = await import('../../../config/blockDefinitions');
        setBlockDefinitions(module.allBlockDefinitions || []);
      } catch (error) {
        console.warn('Erro ao carregar blockDefinitions:', error);
        setBlockDefinitions([]);
      }
    };
    
    loadBlockDefinitions();
  }, []);

  // Filtrar blocos por busca
  const filteredBlocks = useMemo(() => {
    if (!searchTerm) return blockDefinitions;
    
    return blockDefinitions.filter((block: BlockDefinition) =>
      block.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, blockDefinitions]);

  // Agrupar blocos por categoria
  const blocksByCategory = useMemo(() => {
    const grouped = filteredBlocks.reduce((acc: Record<string, BlockDefinition[]>, block: BlockDefinition) => {
      const category = block.category || 'Outros';
      if (!acc[category]) acc[category] = [];
      acc[category].push(block);
      return acc;
    }, {} as Record<string, BlockDefinition[]>);
    
    return grouped;
  }, [filteredBlocks]);

  const renderComponentsTab = () => (
    <div className="p-4 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar componentes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Components by Category */}
      {Object.entries(blocksByCategory).length > 0 ? (
        <ScrollArea className="max-h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {Object.entries(blocksByCategory).map(([category, blocks]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-[#B89B7A]" />
                  <span className="text-[#432818] text-sm font-semibold uppercase tracking-wide">
                    {category}
                  </span>
                  <Badge variant="secondary">
                    {(blocks as BlockDefinition[]).length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {(blocks as BlockDefinition[]).map((block: BlockDefinition) => (
                    <Card
                      key={block.type}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-[#B89B7A]/50 group"
                      onClick={() => onComponentSelect(block.type)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#B89B7A]/10 rounded-lg flex items-center justify-center group-hover:bg-[#B89B7A]/20 transition-colors">
                            <Package className="w-4 h-4 text-[#B89B7A]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[#432818] text-sm font-medium block">
                              {block.type}
                            </span>
                            {block.category && (
                              <span className="text-[#8F7A6A] text-xs block truncate">
                                {block.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {searchTerm ? 'Nenhum componente encontrado' : 'Nenhum componente disponível'}
          </p>
        </div>
      )}
    </div>
  );

  const renderPagesTab = () => (
    <div className="p-4 space-y-4">
      {/* Add Page Button */}
      <Button
        variant="default"
        size="sm"
        className="w-full bg-[#B89B7A] hover:bg-[#aa6b5d] text-white"
        onClick={() => {
          if (onAddPage) {
            onAddPage();
          } else {
            console.log('Adicionar nova página');
          }
        }}
      >
        <Plus className="mr-2 w-4 h-4" />
        Nova Página
      </Button>

      <Separator className="my-4" />

      {/* Pages List - As 21 Etapas do Funil */}
      {funnelPages.length > 0 ? (
        <ScrollArea className="max-h-[calc(100vh-200px)]">
          <div className="space-y-2">
            {funnelPages.map((page, index) => (
              <Card
                key={page.id}
                className={`cursor-pointer transition-all duration-200 p-3 ${
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
                    <span className="text-[#432818] text-sm font-medium block truncate">
                      {page.title || `Página ${index + 1}`}
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="default" className="text-xs">
                        {page.blocks?.length || 0} blocos
                      </Badge>
                      {page.type && (
                        <Badge variant="secondary" className="text-xs">
                          {page.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            Nenhuma página criada
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value)}
        className="flex-1 flex flex-col"
      >
        <div className="border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="components" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Blocos</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Páginas</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="components" className="h-full m-0">
            {renderComponentsTab()}
          </TabsContent>
          <TabsContent value="pages" className="h-full m-0">
            {renderPagesTab()}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SchemaDrivenComponentsSidebar;
