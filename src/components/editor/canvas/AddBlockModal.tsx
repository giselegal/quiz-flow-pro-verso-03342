/**
 * 🎯 ADD BLOCK MODAL - Modal para Adicionar Novos Blocos
 * 
 * Modal com categorias e tipos de blocos disponíveis
 */

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Type,
  Image,
  Layout,
  FormInput,
  Star,
  ListChecks,
  AlertCircle,
  Sparkles,
  Package,
} from 'lucide-react';
import { BlockType } from '@/types/editor';

interface BlockTypeDefinition {
  type: BlockType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'content' | 'layout' | 'quiz' | 'inline';
  preview?: string;
}

const AVAILABLE_BLOCKS: BlockTypeDefinition[] = [
  // Content Blocks
  {
    type: 'headline',
    name: 'Título',
    description: 'Título principal ou subtítulo',
    icon: Type,
    category: 'content',
  },
  {
    type: 'text',
    name: 'Texto',
    description: 'Parágrafo de texto',
    icon: Type,
    category: 'content',
  },
  {
    type: 'image',
    name: 'Imagem',
    description: 'Imagem com legenda',
    icon: Image,
    category: 'content',
  },
  {
    type: 'button',
    name: 'Botão',
    description: 'Botão de ação',
    icon: Package,
    category: 'content',
  },
  
  // Layout Blocks
  {
    type: 'spacer',
    name: 'Espaçador',
    description: 'Espaço vertical',
    icon: Layout,
    category: 'layout',
  },
  {
    type: 'divider',
    name: 'Divisor',
    description: 'Linha divisória',
    icon: Layout,
    category: 'layout',
  },
  {
    type: 'decorative-bar',
    name: 'Barra Decorativa',
    description: 'Barra colorida decorativa',
    icon: Sparkles,
    category: 'layout',
  },
  
  // Quiz Blocks
  {
    type: 'multiple-choice',
    name: 'Múltipla Escolha',
    description: 'Opções de seleção múltipla',
    icon: ListChecks,
    category: 'quiz',
  },
  {
    type: 'single-choice',
    name: 'Escolha Única',
    description: 'Opções de seleção única',
    icon: AlertCircle,
    category: 'quiz',
  },
  {
    type: 'text-input',
    name: 'Campo de Texto',
    description: 'Input para texto',
    icon: FormInput,
    category: 'quiz',
  },
  {
    type: 'form-input',
    name: 'Campo de Formulário',
    description: 'Input de formulário',
    icon: FormInput,
    category: 'quiz',
  },
  
  // Inline Blocks
  {
    type: 'text-inline',
    name: 'Texto Inline',
    description: 'Texto otimizado inline',
    icon: Type,
    category: 'inline',
  },
  {
    type: 'image-inline',
    name: 'Imagem Inline',
    description: 'Imagem otimizada inline',
    icon: Image,
    category: 'inline',
  },
  {
    type: 'button-inline',
    name: 'Botão Inline',
    description: 'Botão otimizado inline',
    icon: Package,
    category: 'inline',
  },
  {
    type: 'badge-inline',
    name: 'Badge',
    description: 'Etiqueta ou badge',
    icon: Star,
    category: 'inline',
  },
];

const CATEGORY_LABELS = {
  content: 'Conteúdo',
  layout: 'Layout',
  quiz: 'Quiz',
  inline: 'Inline',
};

interface AddBlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBlock: (blockType: BlockType) => void;
}

export function AddBlockModal({
  open,
  onOpenChange,
  onSelectBlock,
}: AddBlockModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Filtrar blocos por busca e categoria
  const filteredBlocks = useMemo(() => {
    let blocks = AVAILABLE_BLOCKS;
    
    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      blocks = blocks.filter(b => b.category === selectedCategory);
    }
    
    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      blocks = blocks.filter(
        b =>
          b.name.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query)
      );
    }
    
    return blocks;
  }, [searchQuery, selectedCategory]);
  
  const handleSelectBlock = (blockType: BlockType) => {
    onSelectBlock(blockType);
    onOpenChange(false);
    setSearchQuery('');
    setSelectedCategory('all');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] bg-background">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Bloco</DialogTitle>
          <DialogDescription>
            Selecione o tipo de bloco que deseja adicionar ao step
          </DialogDescription>
        </DialogHeader>
        
        {/* Busca */}
        <div className="mb-4">
          <Input
            placeholder="Buscar blocos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Tabs por categoria */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5 bg-muted">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="inline">Inline</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedCategory} className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {filteredBlocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mb-2 opacity-50" />
                  <p>Nenhum bloco encontrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredBlocks.map((block) => {
                    const Icon = block.icon;
                    
                    return (
                      <Button
                        key={block.type}
                        variant="outline"
                        className="h-auto flex flex-col items-start p-4 hover:bg-accent hover:border-primary transition-colors"
                        onClick={() => handleSelectBlock(block.type)}
                      >
                        <div className="flex items-center gap-2 mb-2 w-full">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-sm">
                            {block.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground text-left">
                          {block.description}
                        </p>
                      </Button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default AddBlockModal;
