import { supabase } from '@/integrations/supabase/client';
import { 
  validateComponentInstance
} from '@/lib/schema-validation';

// Remove unused imports and simplify types
export interface SupabaseComponent {
  id: string;
  component_type_key: string;
  funnel_id: string;
  instance_key: string;
  properties: any;
  order_index: number;
  step_number: number;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  custom_styling: any;
  is_active: boolean | null;
  is_locked: boolean | null;
  is_template: boolean | null;
  stage_id: string | null;
}

export interface ComponentFilters {
  funnelId?: string;
  stepNumber?: number;
  isActive?: boolean;
  componentType?: string;
}

export interface ComponentSortOptions {
  field: 'order_index' | 'created_at' | 'updated_at';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface ComponentQueryResult {
  components: SupabaseComponent[];
  total: number;
  hasMore: boolean;
}

/**
 * Utility function to handle Supabase errors
 */
const handleSupabaseError = (error: any, customMessage: string) => {
  console.error(customMessage, error);
  throw new Error(`${customMessage}: ${error.message}`);
};

/**
 * Normalizes component data before inserting or updating
 */
const normalizeComponentData = (data: any) => {
  return {
    ...data,
    properties: data.properties || {},
    custom_styling: data.custom_styling || {},
    order_index: data.order_index || 0,
    is_active: data.is_active ?? true,
    is_locked: data.is_locked ?? false,
    is_template: data.is_template ?? false,
  };
};

/**
 * Fetches components from Supabase with filtering, sorting, and pagination
 */
export const fetchComponents = async (
  options: {
    filters?: ComponentFilters;
    sort?: ComponentSortOptions;
    pagination?: PaginationOptions;
  } = {}
): Promise<ComponentQueryResult> => {
  try {
    const { filters = {}, sort = { field: 'order_index', direction: 'asc' }, pagination } = options;

    let query = supabase
      .from('component_instances')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.funnelId) {
      query = query.eq('funnel_id', filters.funnelId);
    }
    if (filters.stepNumber !== undefined) {
      query = query.eq('step_number', filters.stepNumber);
    }
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }
    if (filters.componentType) {
      query = query.eq('component_type_key', filters.componentType);
    }

    // Apply sorting
    query = query.order(sort.field, { ascending: sort.direction === 'asc' });

    // Apply pagination if provided
    if (pagination) {
      const offset = (pagination.page - 1) * pagination.limit;
      query = query.range(offset, offset + pagination.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching components:', error);
      throw new Error(`Failed to fetch components: ${error.message}`);
    }

    const total = count || 0;
    const hasMore = pagination ? (pagination.page * pagination.limit) < total : false;

    return {
      components: data || [],
      total,
      hasMore,
    };
  } catch (error) {
    console.error('Error in fetchComponents:', error);
    throw error;
  }
};

/**
 * Adds a new component instance to Supabase
 */
export const addComponent = async (componentData: any): Promise<SupabaseComponent> => {
  try {
    const normalizedData = normalizeComponentData(componentData);

    // Validate the data before inserting
    validateComponentInstance(normalizedData);

    const { data, error } = await supabase
      .from('component_instances')
      .insert([normalizedData])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'Failed to add component');
    }

    return data as SupabaseComponent;
  } catch (error) {
    console.error('Error adding component:', error);
    throw error;
  }
};

/**
 * Updates an existing component instance in Supabase
 */
export const updateComponent = async (
  id: string,
  updates: Partial<SupabaseComponent>
): Promise<SupabaseComponent> => {
  try {
    const normalizedUpdates = normalizeComponentData(updates);

    // Validate the updates before applying
    validateComponentInstance(normalizedUpdates);

    const { data, error } = await supabase
      .from('component_instances')
      .update(normalizedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'Failed to update component');
    }

    return data as SupabaseComponent;
  } catch (error) {
    console.error('Error updating component:', error);
    throw error;
  }
};

/**
 * Deletes a component instance from Supabase
 */
export const deleteComponent = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from('component_instances').delete().eq('id', id);

    if (error) {
      handleSupabaseError(error, 'Failed to delete component');
    }
  } catch (error) {
    console.error('Error deleting component:', error);
    throw error;
  }
};

/**
 * Reorders components in Supabase
 */
export const reorderComponents = async (
  funnelId: string,
  componentIds: string[]
): Promise<SupabaseComponent[]> => {
  try {
    if (!funnelId) {
      throw new Error('Funnel ID is required for reordering components.');
    }

    if (!Array.isArray(componentIds) || componentIds.length === 0) {
      throw new Error('Component IDs array is required for reordering components.');
    }

    // Fetch existing components to verify and prepare updates
    const { data: existingComponents, error: fetchError } = await supabase
      .from('component_instances')
      .select('*')
      .eq('funnel_id', funnelId)
      .in('id', componentIds);

    if (fetchError) {
      handleSupabaseError(fetchError, 'Failed to fetch existing components for reordering');
    }

    if (!existingComponents || existingComponents.length !== componentIds.length) {
      throw new Error('One or more component IDs not found in the specified funnel.');
    }

    // Prepare updates with new order indices
    const updates = componentIds.map((id, index) => ({
      id,
      order_index: index,
    }));

    // Execute individual updates
    const updatedComponents: SupabaseComponent[] = [];
    
    for (const update of updates) {
      const { data, error: updateError } = await supabase
        .from('component_instances')
        .update({ order_index: update.order_index })
        .eq('id', update.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Failed to update component order:', updateError);
        continue;
      }
      
      if (data) {
        updatedComponents.push(data as SupabaseComponent);
      }
    }

    console.log('✅ Component reordering completed successfully');

    return updatedComponents as SupabaseComponent[];
  } catch (error) {
    console.error('Error reordering components:', error);
    throw error;
  }
};

/**
 * Transforms components for consistent API response
 */
export const transformComponents = (components: SupabaseComponent[]): SupabaseComponent[] => {
  return components.map((component: SupabaseComponent) => ({
    ...component,
    properties: component.properties || {},
    custom_styling: component.custom_styling || {},
    order_index: component.order_index || 0,
    is_active: component.is_active ?? true,
    is_locked: component.is_locked ?? false,
    is_template: component.is_template ?? false,
  }));
};
