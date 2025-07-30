import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { ScrollArea } from '../../ui/scroll-area';
import { Plus, Package, FileText, Search } from 'lucide-react';

interface BlockDefinition {
  type: string;
  category?: string;
  displayName?: string;
  description?: string;
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

  const componentCategories = useMemo(() => {
    const categories: Record<string, BlockDefinition[]> = {
      'Quiz': [],
      'Layout': [],
      'Content': [],
      'Others': []
    };

    blockDefinitions.forEach(definition => {
      const category = definition.category || 'Others';
      if (categories[category]) {
        categories[category].push(definition);
      } else {
        categories.Others.push(definition);
      }
    });

    return categories;
  }, [blockDefinitions]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return componentCategories;

    const filtered: Record<string, BlockDefinition[]> = {};
    Object.entries(componentCategories).forEach(([category, definitions]) => {
      const filteredDefs = definitions.filter(def =>
        def.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (def.displayName && def.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      if (filteredDefs.length > 0) {
        filtered[category] = filteredDefs;
      }
    });

    return filtered;
  }, [componentCategories, searchTerm]);

  const renderComponentsTab = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {Object.entries(filteredCategories).map(([category, definitions]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                <Package className="w-4 h-4" />
                <span>{category}</span>
                <Badge variant="secondary" className="text-xs">
                  {definitions.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {definitions.map((definition) => (
                  <Card
                    key={definition.type}
                    className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-gray-200 hover:border-[#B89B7A]/50"
                    onClick={() => onComponentSelect(definition.type)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-800">
                            {definition.displayName || definition.type}
                          </h4>
                          {definition.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {definition.description}
                            </p>
                          )}
                        </div>
                        <Plus className="w-4 h-4 text-[#B89B7A]" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(filteredCategories).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum componente encontrado</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const renderPagesTab = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800">Páginas do Funil</h3>
          {onAddPage && (
            <Button size="sm" onClick={onAddPage} className="bg-[#B89B7A] hover:bg-[#aa6b5d]">
              <Plus className="w-4 h-4 mr-1" />
              Nova
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {funnelPages.map((page, index) => (
            <Card
              key={page.id}
              className={`cursor-pointer transition-all duration-200 ${
                currentPageId === page.id
                  ? 'border-[#B89B7A] bg-[#B89B7A]/5 shadow-sm'
                  : 'border-gray-200 hover:border-[#B89B7A]/50 hover:shadow-sm'
              }`}
              onClick={() => setCurrentPage(page.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                    currentPageId === page.id
                      ? 'bg-[#B89B7A] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 truncate">
                      {page.title || page.name || `Página ${index + 1}`}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {page.blocks?.length || 0} bloco{(page.blocks?.length || 0) !== 1 ? 's' : ''}
                      </Badge>
                      {page.type && (
                        <Badge variant="secondary" className="text-xs">
                          {page.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}

          {funnelPages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma página encontrada</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="h-full flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
          <TabsTrigger
            value="components"
            className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white"
          >
            Componentes
          </TabsTrigger>
          <TabsTrigger
            value="pages"
            className="data-[state=active]:bg-[#B89B7A] data-[state=active]:text-white"
          >
            Páginas
          </TabsTrigger>
        </TabsList>
        
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