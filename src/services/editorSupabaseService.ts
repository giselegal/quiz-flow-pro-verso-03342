import { supabase } from '@/lib/supabase';
import {
  validateComponentInstanceInsert,
  ComponentInstance
} from '@/lib/schema-validation';

export const getFunnelComponents = async (funnelId: string) => {
  const { data, error } = await supabase
    .from('component_instances')
    .select('*')
    .eq('funnel_id', funnelId)
    .order('order_index');

  if (error) {
    console.error('Error fetching components:', error);
    return [];
  }

  return data as ComponentInstance[];
};

export const getComponentInstance = async (id: string) => {
  const { data, error } = await supabase
    .from('component_instances')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching component instance:', error);
    return null;
  }

  return data as ComponentInstance;
};

export const createComponentInstance = async (
  componentInstance: Omit<ComponentInstance, 'id'>
): Promise<ComponentInstance | null> => {
  const validatedData = validateComponentInstanceInsert(componentInstance);

  const { data, error } = await supabase
    .from('component_instances')
    .insert([validatedData])
    .select()
    .single();

  if (error) {
    console.error('Error creating component instance:', error);
    return null;
  }

  return data as ComponentInstance;
};

export const updateComponentInstance = async (
  id: string,
  updates: Partial<ComponentInstance>
): Promise<ComponentInstance | null> => {
  const { data, error } = await supabase
    .from('component_instances')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating component instance:', error);
    return null;
  }

  return data as ComponentInstance;
};

export const deleteComponentInstance = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('component_instances').delete().eq('id', id);

  if (error) {
    console.error('Error deleting component instance:', error);
    return false;
  }

  return true;
};

export const bulkUpdateBlockOrder = async (
  updates: { id: string; order_index: number }[]
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Convert the updates to proper ComponentInstance format
    const componentUpdates = updates.map(update => ({
      id: update.id,
      order_index: update.order_index,
      component_type_key: 'unknown', // This should be provided
      funnel_id: 'default',
      step_number: 1,
      instance_key: update.id
    }));

    const { error } = await supabase
      .from('component_instances')
      .upsert(componentUpdates);

    if (error) {
      console.error('Bulk update error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Bulk update failed:', error);
    return { success: false, error: error.message };
  }
};
