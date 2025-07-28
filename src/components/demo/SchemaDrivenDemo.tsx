import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DynamicPropertiesPanel } from '../editor/panels/DynamicPropertiesPanel';
import { BlockRenderer, BlockData } from '../editor/blocks';
import { blockDefinitions, getCategories, getBlocksByCategory } from '@/config/blockDefinitionsClean';
import { Type, Image, ArrowRight, CheckCircle, Target, Play, Star, FileText, ShoppingCart, Clock, MessageSquare, HelpCircle, Shield, Video } from 'lucide-react';

// Mock de dados para demonstração
const mockBlocks: BlockData[] = [
  {
    id: '1',
    type: 'header',
    properties: {
      title: 'Meu Título Incrível',
      subtitle: 'Este é um subtítulo interessante',
      titleSize: 'large',
      alignment: 'center'
    }
  },
  {
    id: '2',
    type: 'text',
    properties: {
      content: 'Este é um parágrafo de exemplo para demonstrar o sistema schema-driven.',
      fontSize: 'medium',
      alignment: 'left'
    }
  },
  {
    id: '3',
    type: 'image',
    properties: {
      src: 'https://via.placeholder.com/600x300?text=Imagem+Demo',
      alt: 'Imagem de demonstração',
      width: 'auto',
      alignment: 'center'
    }
  }
];

const mockFunnelConfig = {
  name: 'Quiz CaktoQuiz - Demonstração',
  description: 'Demonstração do sistema schema-driven',
  isPublished: false,
  theme: 'caktoquiz'
};

// Mapeamento de ícones
const iconMap: { [key: string]: React.ReactNode } = {
  'Type': <Type className="w-4 h-4" />,
  'Image': <Image className="w-4 h-4" />,
  'ArrowRight': <ArrowRight className="w-4 h-4" />,
  'CheckCircle': <CheckCircle className="w-4 h-4" />,
  'Target': <Target className="w-4 h-4" />,
  'Play': <Play className="w-4 h-4" />,
  'Star': <Star className="w-4 h-4" />,
  'FileText': <FileText className="w-4 h-4" />,
  'ShoppingCart': <ShoppingCart className="w-4 h-4" />,
  'Clock': <Clock className="w-4 h-4" />,
  'MessageSquare': <MessageSquare className="w-4 h-4" />,
  'HelpCircle': <HelpCircle className="w-4 h-4" />,
  'Shield': <Shield className="w-4 h-4" />,
  'Video': <Video className="w-4 h-4" />
};

export const SchemaDrivenDemo: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockData[]>(mockBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('1');
  const [funnelConfig, setFunnelConfig] = useState(mockFunnelConfig);
  const [activeTab, setActiveTab] = useState('blocks');

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || blocks[0];

  // Handlers para o painel de propriedades
  const handleBlockPropertyChange = (key: string, value: any) => {
    setBlocks(prev => prev.map(block => 
      block.id === selectedBlockId 
        ? { ...block, properties: { ...block.properties, [key]: value } }
        : block
    ));
  };

  const handleNestedPropertyChange = (path: string, value: any) => {
    const keys = path.split('.');
    setBlocks(prev => prev.map(block => {
      if (block.id !== selectedBlockId) return block;
      
      const newProperties = { ...block.properties };
      let target = newProperties;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!target[keys[i]]) target[keys[i]] = {};
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
      
      return { ...block, properties: newProperties };
    }));
  };

  const handleFunnelConfigChange = (config: Partial<typeof mockFunnelConfig>) => {
    setFunnelConfig(prev => ({ ...prev, ...config }));
  };

  // Handler para adicionar novo bloco
  const addBlock = (blockType: string) => {
    const definition = blockDefinitions.find(def => def.type === blockType);
    if (!definition) return;

    const defaultProperties: Record<string, any> = {};
    definition.propertiesSchema?.forEach(prop => {
      if (prop.defaultValue !== undefined) {
        if (prop.nestedPath) {
          const keys = prop.nestedPath.split('.');
          let target = defaultProperties;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!target[keys[i]]) target[keys[i]] = {};
            target = target[keys[i]];
          }
          target[keys[keys.length - 1]] = prop.defaultValue;
        } else {
          defaultProperties[prop.key] = prop.defaultValue;
        }
      }
    });

    const newBlock: BlockData = {
      id: `block-${Date.now()}`,
      type: blockType,
      properties: defaultProperties
    };

    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar Esquerda - Biblioteca de Blocos */}
      <div className="w-80 border-r bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b p-4">
            <TabsList className="w-full">
              <TabsTrigger value="pages">Páginas</TabsTrigger>
              <TabsTrigger value="blocks">Blocos</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pages" className="flex-1 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Páginas do Funil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Sistema de páginas seria implementado aqui...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocks" className="flex-1 overflow-auto">
            <div className="p-4 space-y-4">
              {getCategories().map(category => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {getBlocksByCategory(category).map(block => (
                      <Button
                        key={block.id}
                        variant="ghost"
                        className="w-full justify-start p-3 h-auto"
                        onClick={() => addBlock(block.type)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-gray-600">
                            {iconMap[block.icon] || <Type className="w-4 h-4" />}
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-sm">
                              {block.name}
                              {block.isNew && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  Novo
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {block.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Canvas Central */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto bg-white min-h-[800px] shadow-lg rounded-lg">
            <div className="p-6 space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Preview do Funil: {funnelConfig.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {funnelConfig.description}
                </p>
              </div>
              
              <div className="space-y-4">
                {blocks.map((block) => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    isSelected={block.id === selectedBlockId}
                    onClick={() => setSelectedBlockId(block.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Direita - Painel de Propriedades */}
      <div className="w-80 border-l bg-white">
        <DynamicPropertiesPanel
          selectedBlock={selectedBlock}
          funnelConfig={funnelConfig}
          onBlockPropertyChange={handleBlockPropertyChange}
          onNestedPropertyChange={handleNestedPropertyChange}
          onFunnelConfigChange={handleFunnelConfigChange}
        />
      </div>
    </div>
  );
};
