/**
 * 🔥 FASE 1: UnifiedCRUDProvider - REAL IMPLEMENTATION
 * Conectado ao Supabase funnels table com CRUD completo
 */
import React, { ReactNode, createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/SuperUnifiedProvider';
import { useToast } from '@/hooks/use-toast';

interface UnifiedCRUDContextType {
  loading: boolean;
  error: string | null;
  currentFunnel: any;
  funnelContext: any;
  setCurrentFunnel: (funnel: any) => void;
  saveFunnel: (data?: any) => Promise<void>;
  loadFunnel: (id: string) => Promise<any>;
  createFunnel: (data: any, context?: any) => Promise<any>;
  isLoading: boolean;
  isSaving: boolean;
  funnels: any[];
  refreshFunnels: () => Promise<void>;
}

const UnifiedCRUDContext = createContext<UnifiedCRUDContextType | null>(null);

export function UnifiedCRUDProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFunnel, setCurrentFunnel] = useState<any>(null);
  const [funnelContext, setFunnelContext] = useState<any>(null);
  const [funnels, setFunnels] = useState<any[]>([]);

  // 🔥 REAL CRUD - Load all funnels for current user
  const refreshFunnels = useCallback(async () => {
    if (!user) {
      setFunnels([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setFunnels(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error loading funnels:', err);
      setError(err.message);
      toast({
        title: 'Error loading funnels',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Load funnels on mount and when user changes
  useEffect(() => {
    refreshFunnels();
  }, [refreshFunnels]);

  // 🔥 REAL CRUD - Load single funnel
  const loadFunnel = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setCurrentFunnel(data);
      setFunnelContext(data?.metadata || {});
      setError(null);
      
      return data;
    } catch (err: any) {
      console.error('Error loading funnel:', err);
      setError(err.message);
      toast({
        title: 'Error loading funnel',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 🔥 REAL CRUD - Save funnel (update)
  const saveFunnel = useCallback(async (data?: any) => {
    if (!currentFunnel?.id) {
      console.error('No current funnel to save');
      return;
    }

    try {
      setIsSaving(true);
      const updateData = data || currentFunnel;
      
      const { error } = await supabase
        .from('funnels')
        .update({
          name: updateData.name,
          description: updateData.description,
          config: updateData.config || updateData,
          metadata: updateData.metadata || funnelContext,
          status: updateData.status || 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', currentFunnel.id);

      if (error) throw error;

      toast({
        title: 'Funnel saved',
        description: 'Your changes have been saved successfully'
      });

      await refreshFunnels();
      setError(null);
    } catch (err: any) {
      console.error('Error saving funnel:', err);
      setError(err.message);
      toast({
        title: 'Error saving funnel',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [currentFunnel, funnelContext, toast, refreshFunnels]);

  // 🔥 REAL CRUD - Create funnel
  const createFunnel = useCallback(async (data: any, context?: any) => {
    if (!user) {
      throw new Error('User must be authenticated to create funnels');
    }

    try {
      setIsSaving(true);
      const { data: newFunnel, error } = await supabase
        .from('funnels')
        .insert({
          name: data.name || 'Untitled Funnel',
          description: data.description || '',
          user_id: user.id,
          config: data.config || data,
          metadata: context || data.metadata || {},
          type: data.type || 'quiz',
          status: data.status || 'draft',
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Funnel created',
        description: 'Your new funnel has been created successfully'
      });

      setCurrentFunnel(newFunnel);
      setFunnelContext(newFunnel.metadata);
      await refreshFunnels();
      setError(null);

      return newFunnel;
    } catch (err: any) {
      console.error('Error creating funnel:', err);
      setError(err.message);
      toast({
        title: 'Error creating funnel',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [user, toast, refreshFunnels]);

  const value: UnifiedCRUDContextType = {
    loading,
    error,
    currentFunnel,
    funnelContext,
    setCurrentFunnel: (funnel: any) => {
      setCurrentFunnel(funnel);
      setFunnelContext(funnel?.metadata || {});
    },
    saveFunnel,
    loadFunnel,
    createFunnel,
    isLoading: loading,
    isSaving,
    funnels,
    refreshFunnels
  };

  return (
    <UnifiedCRUDContext.Provider value={value}>
      {children}
    </UnifiedCRUDContext.Provider>
  );
}

export function useUnifiedCRUD() {
  const context = useContext(UnifiedCRUDContext);
  if (!context) {
    return { 
      loading: false, 
      error: null,
      currentFunnel: null,
      funnelContext: null,
      setCurrentFunnel: () => {},
      saveFunnel: async () => {},
      loadFunnel: async () => null,
      createFunnel: async () => null,
      isLoading: false,
      isSaving: false,
      funnels: [],
      refreshFunnels: async () => {}
    };
  }
  return context;
}

export function useUnifiedCRUDOptional() {
  return useUnifiedCRUD();
}

export default UnifiedCRUDProvider;
