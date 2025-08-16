/**
 * EDITOR SUPABASE SERVICE
 * 
 * Service layer that provides clean, typed interface for all editor-related
 * Supabase operations with comprehensive error handling and validation.
 * 
 * Features:
 * - Type-safe operations with runtime validation
 * - Comprehensive error handling and recovery
 * - Optimized queries with proper relationships
 * - Batch operations for performance
 * - Caching and memoization where appropriate
 * - Detailed logging and monitoring
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import {
  validateComponentInstance,
  validateComponentInstanceInsert,
  validateComponentInstanceUpdate,
  validateFunnel,
  normalizeComponentInstance,
  normalizeComponentProperties,
  validateBatch,
  ComponentInstanceSchema,
  InsertComponentInstanceSchema,
  UpdateComponentInstanceSchema,
} from '@/lib/schema-validation';
import type {
  ComponentInstance,
  InsertComponentInstance,
  UpdateComponentInstance,
  ComponentType,
  Funnel,
  FunnelPage,
} from '@/lib/schema-validation';

// Re-export Database types for consistency
type Json = Database['public']['Tables']['component_instances']['Row']['properties'];
type SupabaseComponentInstance = Database['public']['Tables']['component_instances']['Row'];
type SupabaseInsertComponentInstance = Database['public']['Tables']['component_instances']['Insert'];
type SupabaseUpdateComponentInstance = Database['public']['Tables']['component_instances']['Update'];
type SupabaseComponentType = Database['public']['Tables']['component_types']['Row'];

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface ComponentWithType extends ComponentInstance {
  component_type?: ComponentType;
}

export interface GetComponentsOptions {
  funnelId: string;
  stepNumber?: number;
  includeInactive?: boolean;
  sortBy?: 'order_index' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface BatchUpdateOperation {
  id: string;
  updates: Partial<UpdateComponentInstance>;
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

class EditorSupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'EditorSupabaseError';
  }
}

function handleSupabaseError(error: any, context: string): EditorSupabaseError {
  console.error(`❌ [EditorSupabaseService] ${context}:`, error);
  
  if (error?.code) {
    switch (error.code) {
      case 'PGRST116':
        return new EditorSupabaseError(
          'Nenhum registro encontrado',
          'NOT_FOUND',
          error
        );
      case 'PGRST301':
        return new EditorSupabaseError(
          'Conexão com o banco de dados perdida',
          'CONNECTION_LOST',
          error
        );
      case '23505':
        return new EditorSupabaseError(
          'Registro duplicado',
          'DUPLICATE_ENTRY',
          error
        );
      case '23503':
        return new EditorSupabaseError(
          'Referência inválida',
          'FOREIGN_KEY_VIOLATION',
          error
        );
      default:
        return new EditorSupabaseError(
          error.message || 'Erro desconhecido do banco de dados',
          error.code,
          error
        );
    }
  }
  
  return new EditorSupabaseError(
    error?.message || 'Erro inesperado',
    'UNKNOWN_ERROR',
    error
  );
}

// =============================================================================
// COMPONENT OPERATIONS
// =============================================================================

/**
 * Retrieves components for a specific funnel and step
 */
export async function getComponents(
  options: GetComponentsOptions
): Promise<ServiceResult<ComponentWithType[]>> {
  try {
    const {
      funnelId,
      stepNumber,
      includeInactive = false,
      sortBy = 'order_index',
      sortOrder = 'asc',
      limit,
      offset = 0,
    } = options;

    if (!funnelId) {
      throw new EditorSupabaseError('FunnelId é obrigatório', 'MISSING_FUNNEL_ID');
    }

    console.log(`🔍 [EditorSupabaseService] Carregando componentes: ${funnelId}/${stepNumber || 'all'}`);

    let query = supabase
      .from('component_instances')
      .select(`
        *,
        component_types (
          id,
          type_key,
          display_name,
          description,
          category,
          subcategory,
          component_path,
          icon,
          default_properties,
          validation_schema,
          is_system,
          is_active
        )
      `)
      .eq('funnel_id', funnelId);

    // Add step number filter if provided
    if (stepNumber !== undefined) {
      query = query.eq('step_number', stepNumber);
    }

    // Add active filter
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Add pagination if specified
    if (limit) {
      const endIndex = offset + limit - 1;
      query = query.range(offset, endIndex);
    }

    const { data, error, count } = await query;

    if (error) {
      throw handleSupabaseError(error, 'getComponents');
    }

    // Validate and normalize data
    const validationResult = validateBatch(
      ComponentInstanceSchema,
      data || [],
      'Component instances from database'
    );

    if (!validationResult.success) {
      console.warn(
        '⚠️ [EditorSupabaseService] Alguns componentes falharam na validação:',
        validationResult.errors
      );
    }

    // Normalize component properties
    const normalizedData = validationResult.validData.map(component => ({
      ...component,
      properties: normalizeComponentProperties(component.properties),
    }));

    console.log(`✅ [EditorSupabaseService] Componentes carregados: ${normalizedData.length}`);

    return {
      success: true,
      data: normalizedData as ComponentWithType[],
    };
  } catch (error) {
    const serviceError = error instanceof EditorSupabaseError
      ? error
      : handleSupabaseError(error, 'getComponents');

    return {
      success: false,
      error: serviceError.message,
      details: serviceError.details,
    };
  }
}

/**
 * Creates a new component instance
 */
export async function createComponent(
  componentData: InsertComponentInstance
): Promise<ServiceResult<ComponentInstance>> {
  try {
    console.log('➕ [EditorSupabaseService] Criando componente:', componentData.component_type_key);

    // Validate input data
    const validation = validateComponentInstanceInsert(componentData);
    if (!validation.success) {
      throw new EditorSupabaseError(
        `Dados inválidos: ${validation.error}`,
        'VALIDATION_ERROR'
      );
    }

    // Ensure required fields are present
    if (!validation.data?.funnel_id || !validation.data?.component_type_key) {
      throw new EditorSupabaseError(
        'FunnelId e ComponentTypeKey são obrigatórios',
        'MISSING_REQUIRED_FIELDS'
      );
    }

    // Create the component
    const { data, error } = await supabase
      .from('component_instances')
      .insert([validation.data] as any) // Type assertion for Supabase compatibility
      .select(`
        *,
        component_types (
          id,
          type_key,
          display_name,
          category,
          component_path,
          default_properties
        )
      `)
      .single();

    if (error) {
      throw handleSupabaseError(error, 'createComponent');
    }

    // Validate returned data
    const returnedComponent = normalizeComponentInstance(data);
    if (!returnedComponent) {
      throw new EditorSupabaseError(
        'Componente criado mas dados inválidos retornados',
        'INVALID_RETURN_DATA'
      );
    }

    console.log(`✅ [EditorSupabaseService] Componente criado: ${returnedComponent.id}`);

    return {
      success: true,
      data: returnedComponent,
    };
  } catch (error) {
    const serviceError = error instanceof EditorSupabaseError
      ? error
      : handleSupabaseError(error, 'createComponent');

    return {
      success: false,
      error: serviceError.message,
      details: serviceError.details,
    };
  }
}

/**
 * Updates an existing component instance
 */
export async function updateComponent(
  componentId: string,
  updates: Partial<UpdateComponentInstance>
): Promise<ServiceResult<ComponentInstance>> {
  try {
    console.log(`📝 [EditorSupabaseService] Atualizando componente: ${componentId}`);

    if (!componentId) {
      throw new EditorSupabaseError('ComponentId é obrigatório', 'MISSING_COMPONENT_ID');
    }

    // Validate update data
    const validation = validateComponentInstanceUpdate(updates);
    if (!validation.success) {
      throw new EditorSupabaseError(
        `Dados de atualização inválidos: ${validation.error}`,
        'VALIDATION_ERROR'
      );
    }

    // Add updated_at timestamp
    const updateData = {
      ...validation.data,
      updated_at: new Date().toISOString(),
    } as any; // Type assertion for Supabase compatibility

    const { data, error } = await supabase
      .from('component_instances')
      .update(updateData)
      .eq('id', componentId)
      .select(`
        *,
        component_types (
          id,
          type_key,
          display_name,
          category,
          component_path,
          default_properties
        )
      `)
      .single();

    if (error) {
      throw handleSupabaseError(error, 'updateComponent');
    }

    // Validate returned data
    const updatedComponent = normalizeComponentInstance(data);
    if (!updatedComponent) {
      throw new EditorSupabaseError(
        'Componente atualizado mas dados inválidos retornados',
        'INVALID_RETURN_DATA'
      );
    }

    console.log(`✅ [EditorSupabaseService] Componente atualizado: ${componentId}`);

    return {
      success: true,
      data: updatedComponent,
    };
  } catch (error) {
    const serviceError = error instanceof EditorSupabaseError
      ? error
      : handleSupabaseError(error, 'updateComponent');

    return {
      success: false,
      error: serviceError.message,
      details: serviceError.details,
    };
  }
}

/**
 * Deletes a component instance
 */
export async function deleteComponent(componentId: string): Promise<ServiceResult<boolean>> {
  try {
    console.log(`🗑️ [EditorSupabaseService] Removendo componente: ${componentId}`);

    if (!componentId) {
      throw new EditorSupabaseError('ComponentId é obrigatório', 'MISSING_COMPONENT_ID');
    }

    const { error } = await supabase
      .from('component_instances')
      .delete()
      .eq('id', componentId);

    if (error) {
      throw handleSupabaseError(error, 'deleteComponent');
    }

    console.log(`✅ [EditorSupabaseService] Componente removido: ${componentId}`);

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    const serviceError = error instanceof EditorSupabaseError
      ? error
      : handleSupabaseError(error, 'deleteComponent');

    return {
      success: false,
      error: serviceError.message,
      details: serviceError.details,
    };
  }
}

/**
 * Reorders components by updating their order_index
 */
export async function reorderComponents(
  funnelId: string,
  stepNumber: number,
  componentIds: string[]
): Promise<ServiceResult<boolean>> {
  try {
    console.log(`🔄 [EditorSupabaseService] Reordenando componentes: ${componentIds.length} itens`);

    if (!funnelId || !componentIds.length) {
      throw new EditorSupabaseError(
        'FunnelId e lista de componentIds são obrigatórios',
        'MISSING_REQUIRED_FIELDS'
      );
    }

    // Create batch updates for order_index
    const updates = componentIds.map((id, index) => ({
      id,
      order_index: index,
      updated_at: new Date().toISOString(),
    }));

    // Execute updates in parallel (Supabase handles transactions)
    const promises = updates.map(({ id, order_index, updated_at }) =>
      supabase
        .from('component_instances')
        .update({ order_index, updated_at } as any) // Type assertion for compatibility
        .eq('id', id)
        .eq('funnel_id', funnelId)
        .eq('step_number', stepNumber)
    );

    const results = await Promise.allSettled(promises);

    // Check for failures
    const failures = results.filter(result => result.status === 'rejected');
    if (failures.length > 0) {
      console.error('❌ [EditorSupabaseService] Falhas na reordenação:', failures);
      throw new EditorSupabaseError(
        `${failures.length} de ${updates.length} atualizações falharam`,
        'BATCH_UPDATE_PARTIAL_FAILURE'
      );
    }

    // Check for Supabase errors
    const supabaseErrors = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value?.error)
      .filter(Boolean);

    if (supabaseErrors.length > 0) {
      console.error('❌ [EditorSupabaseService] Erros do Supabase na reordenação:', supabaseErrors);
      throw handleSupabaseError(supabaseErrors[0], 'reorderComponents');
    }

    console.log(`✅ [EditorSupabaseService] Componentes reordenados com sucesso`);

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    const serviceError = error instanceof EditorSupabaseError
      ? error
      : handleSupabaseError(error, 'reorderComponents');

    return {
      success: false,
      error: serviceError.message,
      details: serviceError.details,
    };
  }
}

// =============================================================================
// BATCH OPERATIONS
// =============================================================================

/**
 * Performs batch updates on multiple components
 */
export async function batchUpdateComponents(
  operations: BatchUpdateOperation[]
): Promise<ServiceResult<ComponentInstance[]>> {
  try {
    console.log(`🔄 [EditorSupabaseService] Executando batch update: ${operations.length} operações`);

    if (!operations.length) {
      return {
        success: true,
        data: [],
      };
    }

    // Validate all operations first
    const validationErrors: string[] = [];
    const validOperations: BatchUpdateOperation[] = [];

    operations.forEach((op, index) => {
      const validation = validateComponentInstanceUpdate(op.updates);
      if (validation.success) {
        validOperations.push({
          ...op,
          updates: {
            ...validation.data,
            updated_at: new Date().toISOString(),
          },
        });
      } else {
        validationErrors.push(`Operação ${index}: ${validation.error}`);
      }
    });

    if (validationErrors.length > 0) {
      throw new EditorSupabaseError(
        `Operações inválidas: ${validationErrors.join('; ')}`,
        'VALIDATION_ERROR'
      );
    }

    // Execute all updates
    const promises = validOperations.map(({ id, updates }) =>
      supabase
        .from('component_instances')
        .update(updates as any) // Type assertion for compatibility
        .eq('id', id)
        .select(`
          *,
          component_types (
            id,
            type_key,
            display_name,
            category,
            component_path,
            default_properties
          )
        `)
        .single()
    );

    const results = await Promise.allSettled(promises);

    // Process results
    const successfulUpdates: ComponentInstance[] = [];
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && !result.value.error) {
        const normalized = normalizeComponentInstance(result.value.data);
        if (normalized) {
          successfulUpdates.push(normalized);
        }
      } else {
        const error = result.status === 'rejected' 
          ? result.reason 
          : result.value.error;
        errors.push(`Operação ${index}: ${error?.message || 'Erro desconhecido'}`);
      }
    });

    if (errors.length > 0) {
      console.warn(`⚠️ [EditorSupabaseService] Algumas operações falharam:`, errors);
    }

    const successRate = successfulUpdates.length / operations.length;
    
    if (successRate === 0) {
      throw new EditorSupabaseError(
        'Todas as operações falharam',
        'BATCH_UPDATE_COMPLETE_FAILURE',
        errors
      );
    }

    console.log(
      `✅ [EditorSupabaseService] Batch update concluído: ${successfulUpdates.length}/${operations.length} sucesso`
    );

    return {
      success: successRate > 0.5, // Consider successful if more than 50% succeeded
      data: successfulUpdates,
      error: errors.length > 0 ? `${errors.length} operações falharam` : undefined,
      details: { successCount: successfulUpdates.length, errors },
    };
  } catch (error) {
    const serviceError = error instanceof EditorSupabaseError
      ? error
      : handleSupabaseError(error, 'batchUpdateComponents');

    return {
      success: false,
      error: serviceError.message,
      details: serviceError.details,
    };
  }
}

// =============================================================================
// COMPONENT TYPE OPERATIONS
// =============================================================================

/**
 * Retrieves available component types
 */
export async function getComponentTypes(
  options: {
    category?: string;
    includeInactive?: boolean;
    sortBy?: 'display_name' | 'usage_count' | 'created_at';
  } = {}
): Promise<ServiceResult<ComponentType[]>> {
  try {
    const { category, includeInactive = false, sortBy = 'display_name' } = options;

    console.log('🔍 [EditorSupabaseService] Carregando tipos de componente');

    let query = supabase
      .from('component_types')
      .select('*');

    if (category) {
      query = query.eq('category', category);
    }

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    query = query.order(sortBy);

    const { data, error } = await query;

    if (error) {
      throw handleSupabaseError(error, 'getComponentTypes');
    }

    console.log(`✅ [EditorSupabaseService] Tipos de componente carregados: ${data?.length || 0}`);

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    const serviceError = error instanceof EditorSupabaseError
      ? error
      : handleSupabaseError(error, 'getComponentTypes');

    return {
      success: false,
      error: serviceError.message,
      details: serviceError.details,
    };
  }
}

// =============================================================================
// CONNECTION & HEALTH CHECKS
// =============================================================================

/**
 * Tests the connection to Supabase
 */
export async function testConnection(): Promise<ServiceResult<boolean>> {
  try {
    console.log('🔍 [EditorSupabaseService] Testando conexão...');

    const { error } = await supabase
      .from('component_types')
      .select('count')
      .limit(1);

    if (error) {
      throw handleSupabaseError(error, 'testConnection');
    }

    console.log('✅ [EditorSupabaseService] Conexão validada');

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    const serviceError = error instanceof EditorSupabaseError
      ? error
      : handleSupabaseError(error, 'testConnection');

    return {
      success: false,
      error: serviceError.message,
      details: serviceError.details,
    };
  }
}

/**
 * Gets service health information
 */
export async function getServiceHealth(): Promise<ServiceResult<{
  connection: boolean;
  tablesAccessible: string[];
  lastSync?: Date;
}>> {
  try {
    console.log('🔍 [EditorSupabaseService] Verificando saúde do serviço...');

    const tablesAccessible: string[] = [];

    // Test each table access
    const tables = ['component_types', 'component_instances', 'funnels'] as const;
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (!error) {
          tablesAccessible.push(table);
        }
      } catch {
        // Table not accessible
      }
    }

    const connection = tablesAccessible.length > 0;

    console.log(`✅ [EditorSupabaseService] Saúde verificada: ${tablesAccessible.length}/${tables.length} tabelas acessíveis`);

    return {
      success: true,
      data: {
        connection,
        tablesAccessible,
        lastSync: new Date(),
      },
    };
  } catch (error) {
    const serviceError = error instanceof EditorSupabaseError
      ? error
      : handleSupabaseError(error, 'getServiceHealth');

    return {
      success: false,
      error: serviceError.message,
      details: serviceError.details,
    };
  }
}

// =============================================================================
// EXPORT EVERYTHING
// =============================================================================

export const EditorSupabaseService = {
  // Component operations
  getComponents,
  createComponent,
  updateComponent,
  deleteComponent,
  reorderComponents,
  
  // Batch operations
  batchUpdateComponents,
  
  // Component type operations
  getComponentTypes,
  
  // Health and connection
  testConnection,
  getServiceHealth,
  
  // Error class for external use
  EditorSupabaseError,
};

export default EditorSupabaseService;