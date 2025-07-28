import React, { useState, useMemo } from 'react';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { PlusOutlined, AppstoreOutlined, FileTextOutlined } from '@ant-design/icons';
import { Space, Typography, Empty, Divider, Tabs } from 'antd';
import { allBlockDefinitions } from '../../../config/blockDefinitions';

const { Text } = Typography;

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
        placeholder="Buscar componentes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
                <Badge variant="secondary">
                  {blocks.length}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {blocks.map((block) => (
                  <Card
                    key={block.type}
                    onClick={() => onComponentSelect(block.type)}
                    className="cursor-pointer hover:bg-[#B89B7A]/5 transition-colors"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#B89B7A]/20 to-[#aa6b5d]/20 rounded-lg flex items-center justify-center">
                          {block.icon ? (
                            typeof block.icon === 'string' ? (
                              <span className="text-lg">{block.icon}</span>
                            ) : (
                              React.createElement(block.icon as React.ComponentType<any>, { className: "w-4 h-4 text-[#B89B7A]" })
                            )
                          ) : (
                            <AppstoreOutlined className="w-4 h-4 text-[#B89B7A]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Text strong className="text-[#432818] text-sm block">
                            {block.name || block.type}
                          </Text>
                          {block.description && (
                            <Text className="text-[#8F7A6A] text-xs block truncate">
                              {block.description}
                            </Text>
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
        variant="default"
        size="sm"
        className="w-full"
        onClick={() => {
          // Lógica para adicionar nova página
          console.log('Adicionar nova página');
        }}
      >
        <PlusOutlined className="mr-2" />
        Nova Página
      </Button>

      <Divider className="my-4" />

      {/* Pages List */}
      {funnelPages.length > 0 ? (
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
                  <Text strong className="text-[#432818] text-sm block truncate">
                    {page.title || `Página ${index + 1}`}
                  </Text>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="default">
                      {page.blocks?.length || 0} blocos
                    </Badge>
                    {page.type && (
                      <Badge variant="secondary">
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
    <div className="h-full flex flex-col bg-white">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => onTabChange(key as "components" | "pages")}
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
    </div>
  );
};

export default SchemaDrivenComponentsSidebar;