import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getEnhancedBlockComponent } from '@/components/editor/blocks/EnhancedBlockRegistry';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Clock,
  Grid3X3,
  Image,
  MousePointer,
  Palette,
  Plus,
  Search,
  Settings,
  Star,
  Type,
  Zap,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface ComponentsLibraryProps {
  onAddBlock?: (blockType: string) => void;
  className?: string;
}

// Definição das categorias de componentes
const COMPONENT_CATEGORIES = {
  quiz: {
    label: 'Quiz',
    icon: Grid3X3,
    description: 'Componentes específicos para quiz',
    color: '#B89B7A',
    components: [
      {
        type: 'options-grid',
        name: 'Grade de Opções',
        description: 'Grid com opções selecionáveis',
        icon: Grid3X3,
        featured: true,
        tags: ['quiz', 'seleção', 'grid'],
      },
      {
        type: 'quiz-progress',
        name: 'Progresso do Quiz',
        description: 'Barra de progresso visual',
        icon: BarChart3,
        featured: true,
        tags: ['progresso', 'navegação'],
      },
      {
        type: 'result-style-card',
        name: 'Card de Resultado',
        description: 'Exibe resultado calculado',
        icon: Star,
        featured: true,
        tags: ['resultado', 'estilo'],
      },
      {
        type: 'bonus-showcase',
        name: 'Vitrine de Bônus',
        description: 'Grid de bônus e ofertas',
        icon: Zap,
        tags: ['bônus', 'oferta', 'conversão'],
      },
      {
        type: 'loading-animation',
        name: 'Animação Loading',
        description: 'Animações de transição',
        icon: Clock,
        tags: ['loading', 'transição'],
      },
    ],
  },
  content: {
    label: 'Conteúdo',
    icon: Type,
    description: 'Textos, títulos e conteúdo',
    color: '#432818',
    components: [
      {
        type: 'text-inline',
        name: 'Texto',
        description: 'Texto formatado',
        icon: Type,
        featured: true,
        tags: ['texto', 'conteúdo'],
      },
      {
        type: 'heading-inline',
        name: 'Título',
        description: 'Títulos e subtítulos',
        icon: Type,
        featured: true,
        tags: ['título', 'heading'],
      },
    ],
  },
  interactive: {
    label: 'Interativo',
    icon: MousePointer,
    description: 'Botões e elementos clicáveis',
    color: '#aa6b5d',
    components: [
      {
        type: 'button-inline',
        name: 'Botão',
        description: 'Botão clicável',
        icon: MousePointer,
        featured: true,
        tags: ['botão', 'CTA', 'ação'],
      },
      {
        type: 'form-input',
        name: 'Campo de Formulário',
        description: 'Input para captura de dados',
        icon: Settings,
        tags: ['formulário', 'input', 'dados'],
      },
    ],
  },
  media: {
    label: 'Mídia',
    icon: Image,
    description: 'Imagens e mídia',
    color: '#D4C2A8',
    components: [
      {
        type: 'image-display-inline',
        name: 'Imagem',
        description: 'Exibir imagens',
        icon: Image,
        featured: true,
        tags: ['imagem', 'mídia'],
      },
    ],
  },
  layout: {
    label: 'Layout',
    icon: Settings,
    description: 'Espaçamento e estrutura',
    color: '#6B4F43',
    components: [
      {
        type: 'spacer',
        name: 'Espaçador',
        description: 'Controla espaçamento',
        icon: Settings,
        tags: ['espaço', 'layout'],
      },
      {
        type: 'divider',
        name: 'Divisor',
        description: 'Linha divisória',
        icon: Settings,
        tags: ['divisor', 'separador'],
      },
      {
        type: 'decorative-bar-inline',
        name: 'Barra Decorativa',
        description: 'Elemento visual decorativo',
        icon: Palette,
        tags: ['decoração', 'visual'],
      },
    ],
  },
};

const ComponentsLibrary: React.FC<ComponentsLibraryProps> = ({ onAddBlock, className }) => {
  const [activeCategory, setActiveCategory] = useState('quiz');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar componentes baseado na busca
  const filteredComponents = useMemo(() => {
    if (!searchTerm) return null;

    const filtered: any[] = [];
    Object.values(COMPONENT_CATEGORIES).forEach(category => {
      category.components.forEach(component => {
        const matchesName = component.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDescription = component.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesTags = component.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (matchesName || matchesDescription || matchesTags) {
          filtered.push({ ...component, category: category.label });
        }
      });
    });

    return filtered;
  }, [searchTerm]);

  const handleAddBlock = (blockType: string) => {
    onAddBlock?.(blockType);
  };

  const renderComponentCard = (component: any, showCategory: boolean = false) => {
    const Icon = component.icon;
    const isAvailable = getEnhancedBlockComponent(component.type) !== null;

    return (
      <TooltipProvider key={component.type}>
        <Card
          className={cn(
            'cursor-pointer transition-all duration-200 hover:shadow-md border-2',
            isAvailable
              ? 'hover:border-[#B89B7A]/50 hover:bg-[#B89B7A]/5'
              : 'opacity-60 cursor-not-allowed border-gray-200'
          )}
          onClick={() => isAvailable && handleAddBlock(component.type)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    isAvailable ? 'bg-[#B89B7A]/10' : 'bg-gray-100'
                  )}
                >
                  <Icon
                    className={cn('w-4 h-4', isAvailable ? 'text-[#B89B7A]' : 'text-gray-400')}
                  />
                </div>
                {component.featured && (
                  <Badge variant="secondary" style={{ backgroundColor: '#E5DDD5' }}>
                    ⭐ Popular
                  </Badge>
                )}
              </div>

              {isAvailable ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[#B89B7A] hover:bg-[#B89B7A]/10"
                      onClick={e => {
                        e.stopPropagation();
                        handleAddBlock(component.type);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Adicionar {component.name}</TooltipContent>
                </Tooltip>
              ) : (
                <Badge variant="outline" className="text-xs">
                  Indisponível
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <h3
                className={cn(
                  'font-medium text-sm',
                  isAvailable ? 'text-[#432818]' : 'text-gray-500'
                )}
              >
                {component.name}
              </h3>

              <p style={{ color: '#6B4F43' }}>{component.description}</p>

              {showCategory && (
                <Badge variant="outline" className="text-xs">
                  {component.category}
                </Badge>
              )}

              <div className="flex flex-wrap gap-1 mt-2">
                {component.tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} style={{ color: '#6B4F43' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    );
  };

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-[#432818] flex items-center gap-2">
          <Grid3X3 className="w-5 h-5" />
          Biblioteca de Componentes
        </CardTitle>
        <CardDescription>Arraste ou clique para adicionar componentes</CardDescription>

        {/* Busca de componentes */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]/20"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        {filteredComponents ? (
          // Modo de busca
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p style={{ color: '#6B4F43' }}>
                {filteredComponents.length} componentes encontrados
              </p>
              <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>
                Limpar
              </Button>
            </div>

            <div className="grid gap-3">
              {filteredComponents.map(component => renderComponentCard(component, true))}
            </div>
          </div>
        ) : (
          // Modo de categorias
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="h-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              {Object.entries(COMPONENT_CATEGORIES)
                .slice(0, 2)
                .map(([key, category]) => {
                  const Icon = category.icon;
                  const componentCount = category.components.length;

                  return (
                    <TabsTrigger key={key} value={key} className="flex items-center gap-1 text-xs">
                      <Icon className="w-3 h-3" />
                      {category.label}
                      <span className="ml-1 text-[#B89B7A]">({componentCount})</span>
                    </TabsTrigger>
                  );
                })}
            </TabsList>

            <div className="grid grid-cols-3 gap-1 mb-4">
              {Object.entries(COMPONENT_CATEGORIES)
                .slice(2)
                .map(([key, category]) => {
                  const Icon = category.icon;

                  return (
                    <Button
                      key={key}
                      variant={activeCategory === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveCategory(key)}
                      className="text-xs p-2 h-auto flex flex-col gap-1"
                    >
                      <Icon className="w-3 h-3" />
                      {category.label}
                    </Button>
                  );
                })}
            </div>

            {Object.entries(COMPONENT_CATEGORIES).map(([key, category]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <category.icon className="w-4 h-4" style={{ color: category.color }} />
                    <h3 className="font-medium text-[#432818]">{category.label}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {category.components.length}
                    </Badge>
                  </div>
                  <p style={{ color: '#6B4F43' }}>{category.description}</p>
                </div>

                <Separator className="bg-[#B89B7A]/20" />

                <div className="grid gap-3">
                  {category.components.map(component => renderComponentCard(component))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>

      {/* Rodapé com estatísticas */}
      <div style={{ backgroundColor: '#FAF9F7' }}>
        <div style={{ color: '#6B4F43' }}>
          {Object.values(COMPONENT_CATEGORIES).reduce(
            (total, cat) => total + cat.components.length,
            0
          )}{' '}
          componentes disponíveis
        </div>
      </div>
    </Card>
  );
};

export default ComponentsLibrary;
