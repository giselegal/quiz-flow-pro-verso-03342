/**
 * FUNNEL PUBLISHING SERVICE
 * Sistema completo de publicação de funis com 21 etapas
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface PublishFunnelData {
  id: string;
  name: string;
  description: string;
  stages: Array<{
    id: string;
    name: string;
    order: number;
    blocks: any[];
  }>;
  settings?: Record<string, any>;
}

export interface PublishResult {
  success: boolean;
  publicUrl?: string;
  funnelId?: string;
  error?: string;
}

/**
 * Publica um funil completo no Supabase
 */
export const publishFunnel = async (funnelData: PublishFunnelData): Promise<PublishResult> => {
  try {
    console.log('🚀 Iniciando publicação do funil:', funnelData.name);

    // 1. Validar dados do funil
    const validation = validateFunnelData(funnelData);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validação falhou: ${validation.errors.join(', ')}`,
      };
    }

    // 2. Salvar funil principal
    const { data: funnelResult, error: funnelError } = await supabase
      .from('funnels')
      .upsert({
        id: funnelData.id,
        name: funnelData.name,
        description: funnelData.description,
        is_published: true,
        settings: funnelData.settings || {},
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (funnelError) {
      console.error('❌ Erro ao salvar funil:', funnelError);
      return {
        success: false,
        error: `Erro ao salvar funil: ${funnelError.message}`,
      };
    }

    // 3. Salvar páginas das etapas
    const pages = funnelData.stages.map(stage => ({
      id: `${funnelData.id}-page-${stage.order}`,
      funnel_id: funnelData.id,
      page_type: getPageType(stage.order),
      title: stage.name,
      page_order: stage.order,
      blocks: stage.blocks,
      metadata: {
        stepNumber: stage.order,
        totalSteps: 21,
        createdAt: new Date().toISOString(),
      },
    }));

    const { error: pagesError } = await supabase.from('funnel_pages').upsert(pages);

    if (pagesError) {
      console.error('❌ Erro ao salvar páginas:', pagesError);
      return {
        success: false,
        error: `Erro ao salvar páginas: ${pagesError.message}`,
      };
    }

    // 4. Gerar URL pública
    const publicUrl = generatePublicUrl(funnelData.id);

    console.log('✅ Funil publicado com sucesso!');
    toast({
      title: 'Funil Publicado!',
      description: `O funil "${funnelData.name}" está agora disponível publicamente.`,
    });

    return {
      success: true,
      publicUrl,
      funnelId: funnelData.id,
    };
  } catch (error) {
    console.error('❌ Erro na publicação:', error);
    return {
      success: false,
      error: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    };
  }
};

/**
 * Valida dados do funil antes da publicação
 */
const validateFunnelData = (funnelData: PublishFunnelData) => {
  const errors: string[] = [];

  if (!funnelData.name?.trim()) {
    errors.push('Nome do funil é obrigatório');
  }

  if (!funnelData.stages || funnelData.stages.length !== 21) {
    errors.push('Funil deve ter exatamente 21 etapas');
  }

  if (funnelData.stages) {
    funnelData.stages.forEach((stage, index) => {
      if (stage.order !== index + 1) {
        errors.push(`Etapa ${index + 1} tem ordem incorreta`);
      }
      if (!stage.blocks || stage.blocks.length === 0) {
        errors.push(`Etapa ${index + 1} não tem blocos configurados`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Determina o tipo da página baseado na ordem da etapa
 */
const getPageType = (order: number): string => {
  if (order === 1) return 'intro';
  if (order >= 2 && order <= 14) return 'question';
  if (order === 15 || order === 16) return 'processing';
  if (order >= 17 && order <= 19) return 'result';
  if (order === 20) return 'lead';
  if (order === 21) return 'offer';
  return 'default';
};

/**
 * Gera URL pública para o funil
 */
const generatePublicUrl = (funnelId: string): string => {
  // Usar o dominio do Lovable para URLs públicas
  const baseUrl = window.location.origin;
  return `${baseUrl}/quiz/${funnelId}`;
};

/**
 * Despublica um funil
 */
export const unpublishFunnel = async (funnelId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('funnels')
      .update({ is_published: false })
      .eq('id', funnelId);

    if (error) {
      console.error('❌ Erro ao despublicar funil:', error);
      return false;
    }

    toast({
      title: 'Funil Despublicado',
      description: 'O funil não está mais disponível publicamente.',
    });

    return true;
  } catch (error) {
    console.error('❌ Erro ao despublicar:', error);
    return false;
  }
};

/**
 * Verifica se um funil está publicado
 */
export const checkFunnelStatus = async (
  funnelId: string
): Promise<{
  isPublished: boolean;
  publicUrl?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('funnels')
      .select('is_published')
      .eq('id', funnelId)
      .single();

    if (error) {
      console.error('❌ Erro ao verificar status:', error);
      return { isPublished: false };
    }

    return {
      isPublished: data?.is_published || false,
      publicUrl: data?.is_published ? generatePublicUrl(funnelId) : undefined,
    };
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    return { isPublished: false };
  }
};

export default {
  publishFunnel,
  unpublishFunnel,
  checkFunnelStatus,
  validateFunnelData,
  generatePublicUrl,
};
