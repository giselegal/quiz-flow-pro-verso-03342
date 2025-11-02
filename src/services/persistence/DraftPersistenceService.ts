/**
 * 🎯 FASE 1: DRAFT PERSISTENCE SERVICE
 * 
 * Serviço canônico para persistir drafts no Supabase
 * Substitui localStorage como fonte de verdade
 */

import { supabase } from '@/integrations/supabase/client';
import { blockSchema } from '@/schemas/blockSchemas';
import { z } from 'zod';

export interface QuizDraft {
  id: string;
  user_id: string;
  funnel_id: string;
  name: string;
  slug: string;
  version: number;
  content: {
    steps: Array<{
      id: string;
      type: string;
      order: number;
      blocks: any[];
    }>;
    metadata: Record<string, any>;
  };
  metadata: Record<string, any>;
  status: 'draft' | 'validating' | 'ready';
  created_at: string;
  updated_at: string;
  last_validated_at?: string;
}

export interface QuizProduction {
  id: string;
  user_id: string;
  draft_id?: string;
  funnel_id: string;
  name: string;
  slug: string;
  version: number;
  content: any;
  metadata: Record<string, any>;
  status: 'published' | 'archived' | 'deprecated';
  is_template: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
}

class DraftPersistenceService {
  /**
   * Criar novo draft
   */
  async createDraft(params: {
    funnelId: string;
    name: string;
    slug: string;
    content?: QuizDraft['content'];
  }): Promise<QuizDraft> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('quiz_drafts')
      .insert({
        user_id: user.id,
        funnel_id: params.funnelId,
        name: params.name,
        slug: params.slug,
        content: params.content || { steps: [], metadata: {} },
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;
    return data as QuizDraft;
  }

  /**
   * Buscar draft por funnel_id
   */
  async getDraftByFunnelId(funnelId: string): Promise<QuizDraft | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('quiz_drafts')
      .select('*')
      .eq('funnel_id', funnelId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data as QuizDraft | null;
  }

  /**
   * Atualizar draft (com validação Zod)
   */
  async updateDraft(
    funnelId: string,
    updates: Partial<QuizDraft['content']>,
  ): Promise<QuizDraft> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Buscar draft atual
    const draft = await this.getDraftByFunnelId(funnelId);
    if (!draft) throw new Error('Draft não encontrado');

    // Validar blocos se fornecidos
    if (updates.steps) {
      for (const step of updates.steps) {
        for (const block of step.blocks) {
          try {
            blockSchema.parse(block);
          } catch (err) {
            if (err instanceof z.ZodError) {
              console.error('Validação falhou:', err.errors);
              throw new Error(`Bloco inválido: ${err.errors[0].message}`);
            }
            throw err;
          }
        }
      }
    }

    // Merge content
    const newContent = {
      ...draft.content,
      ...updates,
    };

    const { data, error } = await supabase
      .from('quiz_drafts')
      .update({
        content: newContent,
        status: 'draft', // Voltar para draft após edição
      })
      .eq('funnel_id', funnelId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data as QuizDraft;
  }

  /**
   * Validar draft completo
   */
  async validateDraft(funnelId: string): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const draft = await this.getDraftByFunnelId(funnelId);
    if (!draft) throw new Error('Draft não encontrado');

    const errors: string[] = [];

    // Validar steps
    if (!draft.content.steps || draft.content.steps.length === 0) {
      errors.push('Draft deve ter pelo menos 1 step');
    }

    // Validar cada bloco
    for (const step of draft.content.steps || []) {
      if (!step.blocks || step.blocks.length === 0) {
        errors.push(`Step ${step.id} não tem blocos`);
      }

      for (const block of step.blocks || []) {
        try {
          blockSchema.parse(block);
        } catch (err) {
          if (err instanceof z.ZodError) {
            errors.push(`Step ${step.id}, Bloco ${block.id}: ${err.errors[0].message}`);
          }
        }
      }
    }

    const isValid = errors.length === 0;

    // Atualizar status se válido
    if (isValid) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('quiz_drafts')
          .update({
            status: 'ready',
            last_validated_at: new Date().toISOString(),
          })
          .eq('funnel_id', funnelId)
          .eq('user_id', user.id);
      }
    }

    return { isValid, errors };
  }

  /**
   * Publicar draft (mover para production)
   */
  async publishDraft(funnelId: string): Promise<QuizProduction> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Validar antes de publicar
    const validation = await this.validateDraft(funnelId);
    if (!validation.isValid) {
      throw new Error(`Draft inválido: ${validation.errors.join(', ')}`);
    }

    // Buscar draft
    const draft = await this.getDraftByFunnelId(funnelId);
    if (!draft) throw new Error('Draft não encontrado');

    // Usar função do banco para publicar
    const { data, error } = await supabase.rpc('publish_quiz_draft', {
      draft_id: draft.id,
    });

    if (error) throw error;

    // Buscar o registro criado
    const { data: published, error: fetchError } = await supabase
      .from('quiz_production')
      .select('*')
      .eq('id', data)
      .single();

    if (fetchError) throw fetchError;
    return published as QuizProduction;
  }

  /**
   * Listar todos os drafts do usuário
   */
  async listDrafts(): Promise<QuizDraft[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('quiz_drafts')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as QuizDraft[];
  }

  /**
   * Deletar draft
   */
  async deleteDraft(funnelId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('quiz_drafts')
      .delete()
      .eq('funnel_id', funnelId)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  /**
   * Duplicar template
   */
  async duplicateTemplate(
    templateSlug: string,
    newName: string,
    newFunnelId: string,
  ): Promise<QuizDraft> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase.rpc('duplicate_quiz_template', {
      template_slug: templateSlug,
      new_name: newName,
      new_funnel_id: newFunnelId,
    });

    if (error) throw error;

    // Buscar o draft criado
    const draft = await this.getDraftByFunnelId(newFunnelId);
    if (!draft) throw new Error('Falha ao criar draft do template');

    return draft;
  }
}

export const draftPersistenceService = new DraftPersistenceService();
