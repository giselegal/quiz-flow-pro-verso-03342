// Correção crítica para o salvamento do funil
// O problema é que o serviço está tentando salvar na tabela 'quizzes' que não existe
// As tabelas corretas são 'funnels' e 'funnel_pages'

import { supabase } from '../lib/supabase';
import type { SchemaDrivenFunnelData } from './schemaDrivenFunnelService';

export class CorrectedSchemaDrivenFunnelService {
  
  async saveFunnel(funnel: SchemaDrivenFunnelData, isAutoSave: boolean = false): Promise<SchemaDrivenFunnelData> {
    console.log('💾 [CORRECTED] saveFunnel called:', { 
      funnelId: funnel.id, 
      isAutoSave, 
      funnelName: funnel.name,
      pagesCount: funnel.pages?.length || 0
    });

    try {
      // 1. Preparar dados do funil principal para tabela 'funnels'
      const funnelData = {
        id: funnel.id,
        name: funnel.name,
        description: funnel.description || '',
        is_published: funnel.config?.isPublished || false,
        settings: funnel.config || {},
        version: funnel.version,
        updated_at: new Date().toISOString()
      };

      console.log('📋 [CORRECTED] Funnel data:', funnelData);

      // 2. Verificar se o funil já existe na tabela 'funnels'
      const { data: existing } = await supabase
        .from('funnels')
        .select('id')
        .eq('id', funnel.id)
        .single();

      let funnelResult;
      if (existing) {
        // Atualizar funil existente
        console.log('🔄 [CORRECTED] Updating existing funnel...');
        const { data, error } = await supabase
          .from('funnels')
          .update(funnelData)
          .eq('id', funnel.id)
          .select()
          .single();
        
        if (error) throw error;
        funnelResult = data;
      } else {
        // Criar novo funil
        console.log('➕ [CORRECTED] Creating new funnel...');
        const { data, error } = await supabase
          .from('funnels')
          .insert([{ ...funnelData, created_at: new Date().toISOString() }])
          .select()
          .single();
        
        if (error) throw error;
        funnelResult = data;
      }

      console.log('✅ [CORRECTED] Funnel saved:', funnelResult);

      // 3. Salvar as páginas/etapas na tabela 'funnel_pages'
      if (funnel.pages && funnel.pages.length > 0) {
        console.log(`📄 [CORRECTED] Saving ${funnel.pages.length} pages...`);
        
        // Primeiro, remover páginas existentes
        const { error: deleteError } = await supabase
          .from('funnel_pages')
          .delete()
          .eq('funnel_id', funnel.id);
        
        if (deleteError) {
          console.error('❌ [CORRECTED] Error deleting existing pages:', deleteError);
          throw deleteError;
        }

        // Depois, inserir páginas atualizadas
        const pagesData = funnel.pages.map((page, index) => ({
          id: page.id,
          funnel_id: funnel.id,
          title: page.name || `Etapa ${index + 1}`,
          page_type: page.type || 'question',
          page_order: page.order || index + 1,
          blocks: page.blocks || [],
          metadata: page.settings || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { error: pagesError } = await supabase
          .from('funnel_pages')
          .insert(pagesData);
        
        if (pagesError) {
          console.error('❌ [CORRECTED] Error saving pages:', pagesError);
          throw pagesError;
        }
        
        console.log(`✅ [CORRECTED] Saved ${pagesData.length} pages to funnel_pages`);
      }

      const savedFunnel = {
        ...funnel,
        lastModified: new Date(),
        version: funnel.version + (isAutoSave ? 0 : 1)
      };

      console.log('🎉 [CORRECTED] Funnel and pages saved successfully to Supabase');
      return savedFunnel;

    } catch (error) {
      console.error('❌ [CORRECTED] Supabase save failed:', error);
      throw error;
    }
  }

  async loadFunnel(funnelId: string): Promise<SchemaDrivenFunnelData | null> {
    console.log('📂 [CORRECTED] Loading funnel:', funnelId);

    try {
      // 1. Carregar dados do funil principal
      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', funnelId)
        .single();

      if (funnelError || !funnelData) {
        console.log('❌ [CORRECTED] Funnel not found:', funnelError);
        return null;
      }

      // 2. Carregar páginas do funil
      const { data: pagesData, error: pagesError } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('page_order', { ascending: true });

      if (pagesError) {
        console.error('❌ [CORRECTED] Error loading pages:', pagesError);
        throw pagesError;
      }

      // 3. Montar o objeto do funil
      const loadedFunnel: SchemaDrivenFunnelData = {
        id: funnelData.id,
        name: funnelData.name,
        description: funnelData.description || '',
        theme: funnelData.settings?.theme || 'default',
        isPublished: funnelData.is_published || false,
        version: funnelData.version || 1,
        lastModified: new Date(funnelData.updated_at || funnelData.created_at || Date.now()),
        createdAt: new Date(funnelData.created_at || Date.now()),
        config: funnelData.settings || {},
        pages: (pagesData || []).map(page => ({
          id: page.id,
          name: page.title || 'Sem título',
          title: page.title || 'Sem título',
          type: page.page_type as any,
          order: page.page_order,
          blocks: page.blocks || [],
          settings: page.metadata || {}
        }))
      };

      console.log('✅ [CORRECTED] Funnel loaded successfully:', {
        id: loadedFunnel.id,
        name: loadedFunnel.name,
        pagesCount: loadedFunnel.pages.length
      });

      return loadedFunnel;

    } catch (error) {
      console.error('❌ [CORRECTED] Error loading funnel:', error);
      throw error;
    }
  }
}

// Instância corrigida
export const correctedSchemaDrivenFunnelService = new CorrectedSchemaDrivenFunnelService();
