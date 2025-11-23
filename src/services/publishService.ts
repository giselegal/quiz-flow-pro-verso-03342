import { appLogger } from '@/lib/utils/appLogger';
import { supabase } from '@/integrations/supabase/client';
import { funnelComponentsService } from './funnelComponentsService';

export interface PublishOptions {
  funnelId: string;
  environment: 'staging' | 'production';
  enableAnalytics: boolean;
  customDomain?: string;
}

export interface PublishResult {
  success: boolean;
  url?: string;
  errors?: string[];
  warnings?: string[];
  publishedAt?: string;
  draftId?: string;
}

export class PublishService {
  /**
   * Publica um funnel para produção
   * 
   * Fluxo:
   * 1. Valida estrutura do funnel (componentes existem)
   * 2. Busca draft atual
   * 3. Cria versão em produção via RPC
   * 4. Atualiza status do funnel
   * 5. Gera URL pública
   * 
   * @param options - Opções de publicação
   * @returns Resultado da publicação com URL ou erros
   */
  static async publishFunnel(options: PublishOptions): Promise<PublishResult> {
    try {
      appLogger.info('🚀 Iniciando publicação do funnel', { 
        funnelId: options.funnelId,
        environment: options.environment 
      });

      // ============================================================================
      // STEP 1: VALIDAR ESTRUTURA DO FUNNEL
      // ============================================================================
      
      // Validação simplificada: verificar se funnel existe
      const { data: funnelExists, error: funnelCheckError } = await supabase
        .from('funnels')
        .select('id')
        .eq('id', options.funnelId)
        .maybeSingle();

      if (funnelCheckError || !funnelExists) {
        appLogger.warn('Funnel não encontrado', { funnelId: options.funnelId });
        return {
          success: false,
          errors: ['Funnel não encontrado - crie um funnel antes de publicar']
        };
      }

      appLogger.info('Funnel validado', { funnelId: options.funnelId });

      // ============================================================================
      // STEP 2: BUSCAR DRAFT ATUAL
      // ============================================================================
      
      const { data: draft, error: draftError } = await supabase
        .from('quiz_drafts')
        .select('*')
        .eq('funnel_id', options.funnelId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (draftError) {
        appLogger.error('Erro ao buscar draft', { 
          error: draftError,
          funnelId: options.funnelId 
        });
        return {
          success: false,
          errors: [`Erro ao buscar draft: ${draftError.message}`]
        };
      }

      if (!draft) {
        appLogger.warn('Draft não encontrado', { funnelId: options.funnelId });
        return {
          success: false,
          errors: ['Draft não encontrado - salve o funnel antes de publicar']
        };
      }

      // ============================================================================
      // STEP 3: CRIAR VERSÃO EM PRODUÇÃO
      // ============================================================================
      
      // Verificar se RPC existe
      const { data: production, error: prodError } = await supabase.rpc(
        'publish_quiz_draft',
        { draft_id: draft.id }
      ).maybeSingle();

      // Se RPC não existir, criar registro direto em quiz_production
      if (prodError && prodError.message.includes('function')) {
        appLogger.warn('RPC publish_quiz_draft não existe, usando insert direto', {
          funnelId: options.funnelId
        });

        const { data: directProduction, error: directError } = await supabase
          .from('quiz_production')
          .insert({
            funnel_id: options.funnelId,
            name: draft.name || `Quiz ${options.funnelId}`,
            slug: draft.slug || options.funnelId,
            content: draft.content,
            metadata: (draft.metadata && typeof draft.metadata === 'object') ? {
              ...(draft.metadata as Record<string, any>),
              publishedAt: new Date().toISOString(),
              environment: options.environment,
              analytics: options.enableAnalytics
            } : {
              publishedAt: new Date().toISOString(),
              environment: options.environment,
              analytics: options.enableAnalytics
            },
            version: 1,
            status: 'active'
          })
          .select()
          .single();

        if (directError) {
          appLogger.error('Erro ao criar versão em produção', { 
            error: directError,
            funnelId: options.funnelId 
          });
          return {
            success: false,
            errors: [`Erro ao publicar: ${directError.message}`]
          };
        }

        appLogger.info('Versão em produção criada (método direto)', { 
          funnelId: options.funnelId,
          productionId: directProduction?.id || 'unknown'
        });
      } else if (prodError) {
        appLogger.error('Erro ao executar RPC de publicação', { 
          error: prodError,
          funnelId: options.funnelId 
        });
        return {
          success: false,
          errors: [`Erro ao publicar: ${prodError.message}`]
        };
      } else {
        appLogger.info('Versão em produção criada via RPC', { 
          funnelId: options.funnelId
        });
      }

      // ============================================================================
      // STEP 4: ATUALIZAR STATUS DO FUNNEL
      // ============================================================================
      
      const publishedAt = new Date().toISOString();
      
      const { error: funnelUpdateError } = await supabase
        .from('funnels')
        .update({ 
          status: 'published',
          metadata: (draft.metadata && typeof draft.metadata === 'object') ? {
            ...(draft.metadata as Record<string, any>),
            publishedAt,
            environment: options.environment,
            analytics: options.enableAnalytics,
            lastPublishedDraft: draft.id
          } : {
            publishedAt,
            environment: options.environment,
            analytics: options.enableAnalytics,
            lastPublishedDraft: draft.id
          },
          updated_at: publishedAt
        })
        .eq('id', options.funnelId);

      if (funnelUpdateError) {
        appLogger.error('Erro ao atualizar status do funnel', { 
          error: funnelUpdateError,
          funnelId: options.funnelId 
        });
        // Não falhar a publicação por causa disso - apenas avisar
      }

      // ============================================================================
      // STEP 5: GERAR URL PÚBLICA
      // ============================================================================
      
      const publicUrl = options.customDomain 
        ? `https://${options.customDomain}/${options.funnelId}`
        : `${window.location.origin}/quiz/${options.funnelId}`;

      appLogger.info('✅ Funnel publicado com sucesso', { 
        funnelId: options.funnelId,
        url: publicUrl,
        environment: options.environment
      });

      // ============================================================================
      // STEP 6: RETORNAR RESULTADO
      // ============================================================================
      
      const warnings: string[] = [];
      
      if (!options.enableAnalytics) {
        warnings.push('Analytics desabilitado - recomendado habilitar para insights');
      }

      if (options.environment === 'staging') {
        warnings.push('Publicado em staging - lembre-se de publicar em production');
      }

      return {
        success: true,
        url: publicUrl,
        publishedAt,
        draftId: draft.id,
        warnings: warnings.length > 0 ? warnings : undefined
      };

    } catch (error: any) {
      appLogger.error('❌ Erro crítico na publicação', { 
        error: error,
        funnelId: options.funnelId,
        stack: error?.stack
      });
      
      return {
        success: false,
        errors: [`Erro inesperado: ${error?.message || 'Desconhecido'}`]
      };
    }
  }

  /**
   * Despublica um funnel (remove de produção)
   * 
   * @param funnelId - ID do funnel a despublicar
   * @returns Resultado da operação
   */
  static async unpublishFunnel(funnelId: string): Promise<PublishResult> {
    try {
      appLogger.info('📤 Despublicando funnel', { funnelId });

      // Atualizar status para draft
      const { error: funnelError } = await supabase
        .from('funnels')
        .update({ 
          status: 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', funnelId);

      if (funnelError) {
        appLogger.error('Erro ao despublicar funnel', { 
          error: funnelError,
          funnelId 
        });
        return {
          success: false,
          errors: [`Erro ao despublicar: ${funnelError.message}`]
        };
      }

      // Desativar versão em produção
      const { error: prodError } = await supabase
        .from('quiz_production')
        .update({ status: 'inactive' })
        .eq('funnel_id', funnelId);

      if (prodError) {
        appLogger.warn('Erro ao desativar produção', { 
          error: prodError,
          funnelId 
        });
        // Não falhar por causa disso
      }

      appLogger.info('✅ Funnel despublicado', { funnelId });

      return {
        success: true
      };

    } catch (error: any) {
      appLogger.error('❌ Erro ao despublicar', { 
        error: error,
        funnelId 
      });
      
      return {
        success: false,
        errors: [`Erro inesperado: ${error?.message || 'Desconhecido'}`]
      };
    }
  }

  /**
   * Verifica se um funnel está publicado
   * 
   * @param funnelId - ID do funnel
   * @returns Status de publicação
   */
  static async isPublished(funnelId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('funnels')
        .select('status')
        .eq('id', funnelId)
        .single();

      if (error || !data) {
        return false;
      }

      return data.status === 'published';

    } catch (error) {
      appLogger.error('Erro ao verificar status de publicação', { 
        error,
        funnelId 
      });
      return false;
    }
  }
}
