/**
 * Hook de integração com Supabase para Template Engine
 * Substitui o backend in-memory por persistência real
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { TemplateDraftShared } from '@/shared/templateEngineTypes';
import { useToast } from '@/hooks/use-toast';

interface TemplateRecord {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  draft_data: any;
  draft_version: number;
  published_data: any | null;
  published_version: number | null;
  updated_at: string;
}

export function useTemplateEngine(templateSlug?: string) {
  const [template, setTemplate] = useState<TemplateDraftShared | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Carregar template do Supabase
  const loadTemplate = useCallback(async (slug: string) => {
    if (!slug) return;
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Autenticação necessária',
          description: 'Você precisa estar logado para acessar templates.',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('slug', slug)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const draft = data.draft_data as unknown as TemplateDraftShared;
        setTemplate(draft);
      } else {
        toast({
          title: 'Template não encontrado',
          description: `Template "${slug}" não existe.`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Erro ao carregar template:', error);
      toast({
        title: 'Erro ao carregar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Salvar/atualizar template no Supabase
  const saveTemplate = useCallback(async (draft: TemplateDraftShared) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Verificar se já existe
      const { data: existing } = await supabase
        .from('templates')
        .select('id')
        .eq('slug', draft.meta.slug)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // UPDATE
        const { error } = await supabase
          .from('templates')
          .update({
            name: draft.meta.name,
            description: draft.meta.description || null,
            draft_data: draft as any,
            draft_version: (draft.draftVersion || 1) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // INSERT
        const { error } = await supabase
          .from('templates')
          .insert({
            user_id: user.id,
            slug: draft.meta.slug,
            name: draft.meta.name,
            description: draft.meta.description || null,
            schema_version: draft.schemaVersion,
            draft_data: draft as any,
            draft_version: 1,
          });

        if (error) throw error;
      }

      setTemplate({ ...draft, draftVersion: (draft.draftVersion || 1) + 1 });
      
      toast({
        title: 'Salvo com sucesso',
        description: 'Template atualizado no Supabase.',
      });
    } catch (error: any) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Criar novo template
  const createTemplate = useCallback(async (
    name: string,
    slug: string,
    description?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const newDraft: TemplateDraftShared = {
        id: crypto.randomUUID(),
        schemaVersion: '1.0.0',
        meta: { name, slug, description },
        stages: [],
        components: {},
        logic: { scoring: { mode: 'sum', weights: {} }, branching: [] },
        outcomes: [],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        draftVersion: 1,
      };

      await saveTemplate(newDraft);
      return newDraft;
    } catch (error: any) {
      console.error('Erro ao criar template:', error);
      toast({
        title: 'Erro ao criar',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  }, [saveTemplate, toast]);

  // Auto-load no mount
  useEffect(() => {
    if (templateSlug) {
      loadTemplate(templateSlug);
    }
  }, [templateSlug, loadTemplate]);

  return {
    template,
    isLoading,
    isSaving,
    loadTemplate,
    saveTemplate,
    createTemplate,
    setTemplate,
  };
}
