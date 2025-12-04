import React, { useState } from 'react';
import { Library, Search, Trash2, Plus, Tag, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useBlockLibrary, LibraryBlock } from '../hooks/useBlockLibrary';
import { cn } from '@/lib/utils';

interface BlockLibraryPanelProps {
  onInsertBlock: (blockType: string, config: Record<string, any>) => void;
}

export function BlockLibraryPanel({ onInsertBlock }: BlockLibraryPanelProps) {
  const { blocks, isLoading, deleteBlock, incrementUsage } = useBlockLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Get unique tags
  const allTags = Array.from(new Set(blocks.flatMap(b => b.tags)));

  // Filter blocks
  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = !searchQuery || 
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.block_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !selectedTag || block.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const handleInsert = (block: LibraryBlock) => {
    onInsertBlock(block.block_type, block.block_config);
    incrementUsage(block.id);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteBlock(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <Library className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Biblioteca de Blocos</h3>
        <Badge variant="secondary" className="ml-auto">
          {blocks.length}
        </Badge>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar blocos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="p-3 border-b border-border">
          <div className="flex flex-wrap gap-1">
            <Badge
              variant={selectedTag === null ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedTag(null)}
            >
              Todos
            </Badge>
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Block List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {filteredBlocks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Library className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                {searchQuery || selectedTag 
                  ? 'Nenhum bloco encontrado'
                  : 'Sua biblioteca está vazia'}
              </p>
              <p className="text-xs mt-1">
                Salve blocos clicando com botão direito no canvas
              </p>
            </div>
          ) : (
            filteredBlocks.map(block => (
              <LibraryBlockCard
                key={block.id}
                block={block}
                onInsert={() => handleInsert(block)}
                onDelete={() => setDeleteConfirm(block.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover bloco da biblioteca?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O bloco será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface LibraryBlockCardProps {
  block: LibraryBlock;
  onInsert: () => void;
  onDelete: () => void;
}

function LibraryBlockCard({ block, onInsert, onDelete }: LibraryBlockCardProps) {
  return (
    <div className={cn(
      "group relative p-3 rounded-lg border border-border bg-card",
      "hover:border-primary/50 hover:shadow-sm transition-all"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm text-foreground truncate">
              {block.name}
            </h4>
            <Tooltip>
              <TooltipTrigger>
                {block.is_public ? (
                  <Globe className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <Lock className="h-3 w-3 text-muted-foreground" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                {block.is_public ? 'Público' : 'Privado'}
              </TooltipContent>
            </Tooltip>
          </div>
          {block.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {block.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {block.block_type}
            </Badge>
            {block.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
            {block.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{block.tags.length - 2}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={onInsert}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Inserir no canvas</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remover</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mt-2">
        Usado {block.usage_count}x
      </div>
    </div>
  );
}
