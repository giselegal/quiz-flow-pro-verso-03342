
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';
import { cn } from '@/lib/utils';

export function ComponentsSidebar() {
  const { blockSearch, setBlockSearch, availableBlocks, handleAddBlock } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Todos', count: availableBlocks.length },
    { id: 'intro', name: 'Introdução', count: availableBlocks.filter(b => b.category === 'intro').length },
    { id: 'quiz', name: 'Quiz', count: availableBlocks.filter(b => b.category === 'quiz').length },
    { id: 'result', name: 'Resultado', count: availableBlocks.filter(b => b.category === 'result').length },
    { id: 'offer', name: 'Oferta', count: availableBlocks.filter(b => b.category === 'offer').length },
    { id: 'content', name: 'Conteúdo', count: availableBlocks.filter(b => b.category === 'content').length },
    { id: 'layout', name: 'Layout', count: availableBlocks.filter(b => b.category === 'layout').length }
  ];

  const filteredBlocks = availableBlocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(blockSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full bg-white border-r border-[#B89B7A]/20 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#B89B7A]/20">
        <h2 className="text-sm font-semibold text-[#432818] mb-3">Componentes</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8F7A6A] w-4 h-4" />
          <Input
            placeholder="Buscar componentes..."
            value={blockSearch}
            onChange={(e) => setBlockSearch(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-[#B89B7A]/20">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "text-xs",
                selectedCategory === category.id && "bg-[#B89B7A] text-white"
              )}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredBlocks.map((block) => (
            <Button
              key={block.type}
              variant="ghost"
              onClick={() => handleAddBlock(block.type)}
              className="w-full justify-start p-3 h-auto hover:bg-[#FAF9F7] border border-transparent hover:border-[#B89B7A]/20"
            >
              <div className="flex items-center gap-3">
                <div className="text-xl">{block.icon}</div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-[#432818] text-sm">{block.name}</div>
                  <div className="text-xs text-[#8F7A6A] capitalize">{block.category}</div>
                </div>
                <Plus className="w-4 h-4 text-[#8F7A6A]" />
              </div>
            </Button>
          ))}
          
          {filteredBlocks.length === 0 && (
            <div className="text-center py-8 text-[#8F7A6A]">
              <p className="text-sm">Nenhum componente encontrado</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
