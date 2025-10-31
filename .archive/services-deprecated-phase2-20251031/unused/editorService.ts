import { toast } from '@/hooks/use-toast';

interface SaveData {
  blocks: any[];
  activeStageId: string | null;
  funnelId: string;
  timestamp: number;
}

export const saveEditor = async (data: SaveData, showToast = true) => {
  try {
    // Simulate save operation
    console.log('💾 Salvando editor:', data);
    
    // In a real implementation, this would make an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (showToast) {
      toast({
        title: 'Editor salvo',
        description: 'Suas alterações foram salvas com sucesso!',
        variant: 'default',
      });
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao salvar editor:', error);
    
    if (showToast) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      });
    }
    
    throw error;
  }
};