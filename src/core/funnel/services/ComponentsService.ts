/**
 * 🧩 COMPONENTS SERVICE
 * 
 * Serviço para gerenciar componentes de funil
 * Migrado e integrado ao core
 */

import { supabase } from '@/services/integrations/supabase/customClient';
import { FunnelComponent } from '../types';
import { appLogger } from '@/lib/utils/appLogger';

export type ComponentInstance = {
    id: string;
    instance_key: string;
    component_type_key: string;
    funnel_id: string;
    stage_id?: string | null;
    step_number: number;
    order_index: number;
    properties: Record<string, any>;
    custom_styling?: Record<string, any>;
    is_active?: boolean;
    is_locked?: boolean;
    is_template?: boolean;
    created_at?: string;
    updated_at?: string;
    created_by?: string | null;
};

export type AddComponentInput = {
    funnelId: string;
    stepNumber: number;
    instanceKey: string;
    componentTypeKey: string;
    orderIndex: number;
    properties?: Record<string, any>;
    stageId?: string | null;
};

export type UpdateComponentInput = {
    id: string;
    properties?: Record<string, any>;
    custom_styling?: Record<string, any>;
    is_active?: boolean;
    is_locked?: boolean;
    order_index?: number;
};

export class ComponentsService {
    private static instance: ComponentsService;

    public static getInstance(): ComponentsService {
        if (!ComponentsService.instance) {
            ComponentsService.instance = new ComponentsService();
        }
        return ComponentsService.instance;
    }

    /**
     * Busca componentes de uma etapa específica
     */
    async getComponents(params: { funnelId: string; stepNumber: number }): Promise<ComponentInstance[]> {
        const { funnelId, stepNumber } = params;

        appLogger.info(`🔍 Buscando componentes: funil=${funnelId}, etapa=${stepNumber}`);

        try {
            if (!supabase) {
                appLogger.warn('⚠️ Supabase não disponível, retornando componentes vazios');
                return [];
            }

            const { data, error } = await supabase
                .from('component_instances')
                .select('*')
                .eq('funnel_id', funnelId)
                .eq('step_number', stepNumber)
                .order('order_index', { ascending: true });

            if (error) {
                appLogger.error('❌ Erro ao buscar componentes:', { data: [error] });
                return [];
            }

            appLogger.info(`✅ Encontrados ${data?.length || 0} componentes`);
            return (data || []) as unknown as ComponentInstance[];
        } catch (error) {
            appLogger.error('Error in getComponents:', { data: [error] });
            return [];
        }
    }

    /**
     * Adiciona novo componente à etapa
     */
    async addComponent(input: AddComponentInput): Promise<ComponentInstance | null> {
        const {
            funnelId,
            stepNumber,
            instanceKey,
            componentTypeKey,
            orderIndex,
            properties = {},
            stageId = null,
        } = input;

        appLogger.info(`➕ Adicionando componente: ${componentTypeKey} na etapa ${stepNumber}`);

        try {
            if (!supabase) {
                appLogger.warn('⚠️ Supabase não disponível, componente não será persistido');
                return {
                    id: `temp-${Date.now()}`,
                    instance_key: instanceKey,
                    component_type_key: componentTypeKey,
                    funnel_id: funnelId,
                    stage_id: stageId,
                    step_number: stepNumber,
                    order_index: orderIndex,
                    properties,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
            }

            const { data, error } = await supabase
                .from('component_instances')
                .insert([{
                    instance_key: instanceKey,
                    component_type_key: componentTypeKey,
                    funnel_id: funnelId,
                    stage_id: stageId,
                    step_number: stepNumber,
                    order_index: orderIndex,
                    properties,
                    is_active: true,
                }])
                .select()
                .single();

            if (error) {
                appLogger.error('❌ Erro ao adicionar componente:', { data: [error] });
                return null;
            }

            appLogger.info(`✅ Componente adicionado: ${data.id}`);
            return data as unknown as ComponentInstance;
        } catch (error) {
            appLogger.error('Error in addComponent:', { data: [error] });
            return null;
        }
    }

    /**
     * Atualiza componente existente
     */
    async updateComponent(input: UpdateComponentInput): Promise<ComponentInstance | null> {
        const { id, ...updates } = input;

        appLogger.info(`📝 Atualizando componente: ${id}`);

        try {
            if (!supabase) {
                appLogger.warn('⚠️ Supabase não disponível, atualização não será persistida');
                return null;
            }

            const { data, error } = await supabase
                .from('component_instances')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                appLogger.error('❌ Erro ao atualizar componente:', { data: [error] });
                return null;
            }

            appLogger.info(`✅ Componente atualizado: ${data.id}`);
            return data as unknown as ComponentInstance;
        } catch (error) {
            appLogger.error('Error in updateComponent:', { data: [error] });
            return null;
        }
    }

    /**
     * Remove componente
     */
    async removeComponent(componentId: string): Promise<boolean> {
        appLogger.info(`🗑️ Removendo componente: ${componentId}`);

        try {
            if (!supabase) {
                appLogger.warn('⚠️ Supabase não disponível, remoção não será persistida');
                return true;
            }

            const { error } = await supabase
                .from('component_instances')
                .delete()
                .eq('id', componentId);

            if (error) {
                appLogger.error('❌ Erro ao remover componente:', { data: [error] });
                return false;
            }

            appLogger.info(`✅ Componente removido: ${componentId}`);
            return true;
        } catch (error) {
            appLogger.error('Error in removeComponent:', { data: [error] });
            return false;
        }
    }

    /**
     * Reordena componentes de uma etapa
     */
    async reorderComponents(params: {
        funnelId: string;
        stepNumber: number;
        componentIds: string[];
    }): Promise<boolean> {
        const { funnelId, stepNumber, componentIds } = params;

        appLogger.info(`🔄 Reordenando componentes da etapa ${stepNumber}`);

        try {
            if (!supabase) {
                appLogger.warn('⚠️ Supabase não disponível, reordenação não será persistida');
                return true;
            }

            // Atualizar ordem de cada componente
            const updates = componentIds.map((id, index) =>
                supabase
                    .from('component_instances')
                    .update({
                        order_index: index,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', id)
                    .eq('funnel_id', funnelId)
                    .eq('step_number', stepNumber),
            );

            const results = await Promise.all(updates);

            const hasError = results.some((result: any) => result.error);
            if (hasError) {
                appLogger.error('❌ Erro ao reordenar alguns componentes');
                return false;
            }

            appLogger.info('✅ Componentes reordenados com sucesso');
            return true;
        } catch (error) {
            appLogger.error('Error in reorderComponents:', { data: [error] });
            return false;
        }
    }

    /**
     * Converte ComponentInstance para FunnelComponent
     */
    convertToFunnelComponent(instance: ComponentInstance): FunnelComponent {
        return {
            id: instance.id,
            type: instance.component_type_key,
            order: instance.order_index,
            isVisible: instance.is_active !== false,
            content: instance.properties || {},
            properties: instance.properties || {},
            styling: instance.custom_styling || {},
            conditions: [],
        };
    }

    /**
     * Converte FunnelComponent para ComponentInstance
     */
    convertFromFunnelComponent(
        component: FunnelComponent,
        funnelId: string,
        stepNumber: number,
        instanceKey?: string,
    ): AddComponentInput {
        return {
            funnelId,
            stepNumber,
            instanceKey: instanceKey || `${component.type}-${Date.now()}`,
            componentTypeKey: component.type,
            orderIndex: component.order,
            properties: {
                ...component.content,
                ...component.properties,
            },
        };
    }

    /**
     * Busca todos os componentes de um funil
     */
    async getFunnelComponents(funnelId: string): Promise<ComponentInstance[]> {
        appLogger.info(`🔍 Buscando todos os componentes do funil: ${funnelId}`);

        try {
            if (!supabase) {
                appLogger.warn('⚠️ Supabase não disponível, retornando componentes vazios');
                return [];
            }

            const { data, error } = await supabase
                .from('component_instances')
                .select('*')
                .eq('funnel_id', funnelId)
                .order('step_number', { ascending: true })
                .order('order_index', { ascending: true });

            if (error) {
                appLogger.error('❌ Erro ao buscar componentes do funil:', { data: [error] });
                return [];
            }

            appLogger.info(`✅ Encontrados ${data?.length || 0} componentes no funil`);
            return (data || []) as unknown as ComponentInstance[];
        } catch (error) {
            appLogger.error('Error in getFunnelComponents:', { data: [error] });
            return [];
        }
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const componentsService = ComponentsService.getInstance();
