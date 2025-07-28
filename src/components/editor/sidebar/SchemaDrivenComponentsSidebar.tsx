import React, { useState, useMemo } from 'react';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { PlusOutlined, AppstoreOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import { Space, Typography, Empty, Divider } from 'antd';
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
                          <block.icon className="w-4 h-4 text-[#B89B7A]" />
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
    </div>
  );
};

export default SchemaDrivenComponentsSidebar;