import { DraggableComponentItem } from '@/components/editor/dnd/DraggableComponentItem';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { blockDefinitions } from '@/config/blockDefinitionsOptimized';
import { MODULAR_COMPONENTS, type ModularComponent } from '@/config/modularComponents';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { type BlockDefinition } from '@/types/blocks';
import {
  ChevronDown,
  ChevronRight,
  Edit3,
  FileCode,
  GripVertical,
  HelpCircle,
  Layers,
  Search,
  Settings,
  Trophy,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

interface EnhancedComponentsSidebarProps {}

const EnhancedComponentsSidebar: React.FC<EnhancedComponentsSidebarProps> = () => {
  const { scrollRef } = useSyncedScroll({ source: 'components' });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Edição JSON': true,
    'Componentes Modulares': true,
    Quiz: true,
    Interativo: true,
    CTA: true,
    Conteúdo: false,
    Legal: false,
    Estrutura: false,
  });

  // 🎯 COMPONENTES DE EDIÇÃO JSON ATIVA
  const jsonEditingBlocks: BlockDefinition[] = [
    {
      type: 'json-template-loader',
      name: '🔧 Carregar Template JSON',
      description: 'Carrega templates JSON das etapas',
      category: 'Edição JSON',
      icon: FileCode,
      properties: {
        stepNumber: { type: 'number', default: 1, label: 'Número da Etapa' },
        templatePath: { type: 'text', default: '', label: 'Caminho do Template' },
      },
      defaultProps: { stepNumber: 1, templatePath: '' },
    },
    {
      type: 'json-integration-test',
      name: '🧪 Teste Integração JSON',
      description: 'Teste prático da integração JSON',
      category: 'Edição JSON',
      icon: Edit3,
      properties: {
        testMode: { type: 'boolean', default: true, label: 'Modo Teste' },
        logResults: { type: 'boolean', default: true, label: 'Log Resultados' },
      },
      defaultProps: { testMode: true, logResults: true },
    },
    {
      type: 'json-system-demo',
      name: '⚡ Demo Sistema JSON',
      description: 'Demonstração completa do sistema JSON',
      category: 'Edição JSON',
      icon: Zap,
      properties: {
        demoStep: { type: 'number', default: 1, label: 'Etapa Demo' },
        autoLoad: { type: 'boolean', default: false, label: 'Carregamento Automático' },
      },
      defaultProps: { demoStep: 1, autoLoad: false },
    },
  ];

  // 🎯 COMPONENTES MODULARES INTEGRADOS
  const modularBlocks: BlockDefinition[] = MODULAR_COMPONENTS.map(
    (modularComp: ModularComponent) => ({
      type: modularComp.type,
      name: `📦 ${modularComp.name}`,
      description: modularComp.description,
      category: 'Componentes Modulares',
      icon: Settings,
      properties: Object.entries(modularComp.properties).reduce((acc, [key, propConfig]) => {
        acc[key] = {
          type: propConfig.type as any,
          default: propConfig.default,
          label:
            key.charAt(0).toUpperCase() +
            key
              .slice(1)
              .replace(/([A-Z])/g, ' $1')
              .trim(),
        };
        return acc;
      }, {} as any),
      defaultProps: Object.entries(modularComp.properties).reduce((acc, [key, propConfig]) => {
        acc[key] = propConfig.default;
        return acc;
      }, {} as any),
    })
  );

  const allBlocks = [...jsonEditingBlocks, ...modularBlocks, ...blockDefinitions];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredBlocks = allBlocks.filter(block => {
    const matchesSearch =
      !searchQuery ||
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (block.description && block.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const groupedBlocks = filteredBlocks.reduce(
    (groups, block) => {
      const category = block.category || 'Outros';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(block);
      return groups;
    },
    {} as Record<string, typeof allBlocks>
  );

  const categoryOrder = [
    'Componentes Modulares', // 🎯 NOVA CATEGORIA EM PRIMEIRO
    'Quiz',
    'Interativo',
    'CTA',
    'Conteúdo',
    'Legal',
    'Estrutura',
  ];

  const categoryIcons: Record<string, React.ComponentType<any>> = {
    'Componentes Modulares': Settings,
    Quiz: Trophy,
    Interativo: HelpCircle,
    CTA: Layers,
    Conteúdo: GripVertical,
    Legal: GripVertical,
    Estrutura: GripVertical,
  };

  const orderedCategories = categoryOrder.filter(cat => groupedBlocks[cat]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>🎯 Quiz Builder com Componentes Modulares</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar componentes..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto [scrollbar-gutter:stable] overflow-x-hidden"
        >
          <div className="space-y-1 p-0">
            {orderedCategories.map(category => (
              <div key={category} className="space-y-1">
                <div
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center space-x-2">
                    {expandedCategories[category] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {React.createElement(categoryIcons[category] || GripVertical, {
                      className: 'h-4 w-4 text-primary',
                    })}
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {groupedBlocks[category].length}
                  </Badge>
                </div>

                {expandedCategories[category] && (
                  <div className="pl-4 space-y-1">
                    {groupedBlocks[category].map(block => (
                      <DraggableComponentItem
                        key={block.type}
                        blockType={block.type}
                        title={block.name}
                        description={block.description}
                        icon={<GripVertical className="h-4 w-4" />}
                        category={category}
                        className="w-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedComponentsSidebar;
