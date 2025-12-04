import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/contexts/store/authStore';
import { toast } from 'sonner';

export interface LibraryBlock {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  block_type: string;
  block_config: Record<string, any>;
  tags: string[];
  is_public: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface SaveBlockInput {
  name: string;
  description?: string;
  block_type: string;
  block_config: Record<string, any>;
  tags?: string[];
  is_public?: boolean;
}

export function useBlockLibrary() {
  const [blocks, setBlocks] = useState<LibraryBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchBlocks = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('block_library')
        .select('*')
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setBlocks((data as LibraryBlock[]) || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch blocks';
      setError(message);
      console.error('Error fetching block library:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const saveBlock = useCallback(async (input: SaveBlockInput): Promise<LibraryBlock | null> => {
    if (!user?.id) {
      toast.error('Você precisa estar logado para salvar blocos');
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('block_library')
        .insert({
          user_id: user.id,
          name: input.name,
          description: input.description || null,
          block_type: input.block_type,
          block_config: input.block_config,
          tags: input.tags || [],
          is_public: input.is_public || false,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newBlock = data as LibraryBlock;
      setBlocks(prev => [newBlock, ...prev]);
      toast.success('Bloco salvo na biblioteca!');
      return newBlock;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save block';
      toast.error('Erro ao salvar bloco: ' + message);
      console.error('Error saving block:', err);
      return null;
    }
  }, [user?.id]);

  const deleteBlock = useCallback(async (blockId: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('block_library')
        .delete()
        .eq('id', blockId);

      if (deleteError) throw deleteError;

      setBlocks(prev => prev.filter(b => b.id !== blockId));
      toast.success('Bloco removido da biblioteca');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete block';
      toast.error('Erro ao remover bloco: ' + message);
      console.error('Error deleting block:', err);
      return false;
    }
  }, []);

  const incrementUsage = useCallback(async (blockId: string) => {
    try {
      const block = blocks.find(b => b.id === blockId);
      if (!block) return;

      await supabase
        .from('block_library')
        .update({ usage_count: block.usage_count + 1 })
        .eq('id', blockId);

      setBlocks(prev => prev.map(b => 
        b.id === blockId ? { ...b, usage_count: b.usage_count + 1 } : b
      ));
    } catch (err) {
      console.error('Error incrementing usage:', err);
    }
  }, [blocks]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  return {
    blocks,
    isLoading,
    error,
    saveBlock,
    deleteBlock,
    incrementUsage,
    refetch: fetchBlocks,
  };
}
