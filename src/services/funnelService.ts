/**
 * 🔥 FASE 1: FunnelService - REAL IMPLEMENTATION
 * Conectado ao Supabase com métodos CRUD completos
 */
import { supabase } from '@/integrations/supabase/client';

export class FunnelService {
  /**
   * Get a single funnel by ID
   */
  async getFunnel(id: string) {
    try {
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting funnel:', error);
      throw error;
    }
  }

  /**
   * Save/create a new funnel
   */
  async saveFunnel(data: any) {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be authenticated to save funnels');
      }

      const { data: funnel, error } = await supabase
        .from('funnels')
        .insert({
          name: data.name || 'Untitled Funnel',
          description: data.description || '',
          user_id: session.session.user.id,
          config: data.config || data,
          metadata: data.metadata || {},
          type: data.type || 'quiz',
          status: data.status || 'draft',
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return funnel;
    } catch (error) {
      console.error('Error saving funnel:', error);
      throw error;
    }
  }

  /**
   * Update an existing funnel
   */
  async updateFunnel(id: string, data: any) {
    try {
      const { data: funnel, error } = await supabase
        .from('funnels')
        .update({
          name: data.name,
          description: data.description,
          config: data.config || data,
          metadata: data.metadata,
          status: data.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return funnel;
    } catch (error) {
      console.error('Error updating funnel:', error);
      throw error;
    }
  }

  /**
   * List all funnels for the current user
   */
  async listFunnels(userId?: string) {
    try {
      let query = supabase
        .from('funnels')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        // Get current user's funnels
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          query = query.eq('user_id', session.session.user.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error listing funnels:', error);
      return [];
    }
  }

  /**
   * Delete a funnel (soft delete)
   */
  async deleteFunnel(id: string) {
    try {
      const { error } = await supabase
        .from('funnels')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting funnel:', error);
      return false;
    }
  }

  /**
   * Permanently delete a funnel
   */
  async permanentlyDeleteFunnel(id: string) {
    try {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error permanently deleting funnel:', error);
      return false;
    }
  }
}

export const funnelService = new FunnelService();

// Compatibility API used by AdvancedFunnelStorage
export const funnelApiService = {
  getFunnel: (id: string) => funnelService.getFunnel(id),
  updateFunnel: (id: string, data: any) => funnelService.updateFunnel(id, data),
  listFunnels: (userId?: string) => funnelService.listFunnels(userId),
  deleteFunnel: (id: string) => funnelService.deleteFunnel(id),
};
