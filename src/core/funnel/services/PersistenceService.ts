/**
 * 💾 PERSISTENCE SERVICE
 * 
 * Serviço para persistência de funis (Supabase + fallbacks)
 * Migrado e integrado ao core
 */

import { supabase } from '@/integrations/supabase/customClient';
import { FunnelState } from '../types';

export interface FunnelPersistenceData {
    id: string;
    name: string;
    description?: string;
    category: string;
    user_id?: string;
    funnel_data: any; // JSON do FunnelState
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface SaveFunnelOptions {
    autoPublish?: boolean;
    createVersion?: boolean;
    userId?: string;
}

export interface LoadFunnelOptions {
    includeUnpublished?: boolean;
    userId?: string;
}

export interface FunnelListItem {
    id: string;
    name: string;
    description?: string;
    category: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    step_count: number;
    usage_count?: number;
}

export class PersistenceService {
    private static instance: PersistenceService;

    public static getInstance(): PersistenceService {
        if (!PersistenceService.instance) {
            PersistenceService.instance = new PersistenceService();
        }
        return PersistenceService.instance;
    }

    // ============================================================================
    // FUNNEL CRUD OPERATIONS
    // ============================================================================

    /**
     * Salva um funil no Supabase
     */
    async saveFunnel(
        state: FunnelState,
        options: SaveFunnelOptions = {}
    ): Promise<FunnelPersistenceData> {
        console.log(`💾 Salvando funil: ${state.id}`);

        try {
            if (!supabase) {
                console.warn('⚠️ Supabase não disponível, salvando apenas localmente');
                return this.saveToLocalStorage(state, options);
            }

            const funnelRecord = {
                id: state.id,
                name: state.metadata.name,
                description: state.metadata.description || null,
                is_published: options.autoPublish || state.metadata.isPublished,
                user_id: options.userId || null,
                settings: state as any, // Armazenar o estado completo no campo settings
                updated_at: new Date().toISOString(),
                created_at: new Date().toISOString()
            };

            // Verificar se o funil já existe
            const existing = await this.checkFunnelExists(state.id);

            if (existing) {
                // Atualizar existente (remover created_at para update)
                const { created_at, ...updateData } = funnelRecord;

                const { data, error } = await supabase
                    .from('funnels')
                    .update(updateData)
                    .eq('id', state.id)
                    .select()
                    .single();

                if (error) {
                    console.error('❌ Erro ao atualizar funil:', error);
                    return this.saveToLocalStorage(state, options);
                }

                console.log(`✅ Funil atualizado: ${state.id}`);
                return this.convertToFunnelPersistenceData(data, state);
            } else {
                // Criar novo
                const { data, error } = await supabase
                    .from('funnels')
                    .insert([funnelRecord])
                    .select()
                    .single();

                if (error) {
                    console.error('❌ Erro ao criar funil:', error);
                    return this.saveToLocalStorage(state, options);
                }

                console.log(`✅ Funil criado: ${state.id}`);
                return this.convertToFunnelPersistenceData(data, state);
            }
        } catch (error) {
            console.error('Error in saveFunnel:', error);
            return this.saveToLocalStorage(state, options);
        }
    }

    /**
     * Carrega um funil por ID
     */
    async loadFunnel(
        funnelId: string,
        options: LoadFunnelOptions = {}
    ): Promise<FunnelState | null> {
        console.log(`📖 Carregando funil: ${funnelId}`);

        try {
            if (!supabase) {
                console.warn('⚠️ Supabase não disponível, carregando do localStorage');
                return this.loadFromLocalStorage(funnelId);
            }

            let query = supabase
                .from('funnels')
                .select('*')
                .eq('id', funnelId);

            if (!options.includeUnpublished) {
                query = query.eq('is_published', true);
            }

            if (options.userId) {
                query = query.eq('user_id', options.userId);
            }

            const { data, error } = await query.single();

            if (error || !data) {
                console.warn(`⚠️ Funil não encontrado no Supabase: ${funnelId}`);
                return this.loadFromLocalStorage(funnelId);
            }

            // Converter dados do Supabase para FunnelState
            const funnelState = data.settings as unknown as FunnelState;

            console.log(`✅ Funil carregado: ${funnelId}`);
            return funnelState;
        } catch (error) {
            console.error('Error in loadFunnel:', error);
            return this.loadFromLocalStorage(funnelId);
        }
    }

    /**
     * Lista funis do usuário
     */
    async listFunnels(
        userId?: string,
        options: LoadFunnelOptions = {}
    ): Promise<FunnelListItem[]> {
        console.log(`📋 Listando funis do usuário: ${userId}`);

        try {
            if (!supabase) {
                console.warn('⚠️ Supabase não disponível, carregando do localStorage');
                return this.listFromLocalStorage();
            }

            let query = supabase
                .from('funnels')
                .select(`
          id,
          name,
          description,
          category,
          is_published,
          created_at,
          updated_at,
          funnel_data
        `);

            if (userId) {
                query = query.eq('user_id', userId);
            }

            if (!options.includeUnpublished) {
                query = query.eq('is_published', true);
            }

            query = query.order('updated_at', { ascending: false });

            const { data, error } = await query;

            if (error) {
                console.error('❌ Erro ao listar funis:', error);
                return this.listFromLocalStorage();
            }

            const funnelList = (data || []).map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                category: item.category,
                is_published: item.is_published,
                created_at: item.created_at,
                updated_at: item.updated_at,
                step_count: item.funnel_data?.steps?.length || 0,
                usage_count: 0 // TODO: Implementar contagem de uso
            }));

            console.log(`✅ Encontrados ${funnelList.length} funis`);
            return funnelList;
        } catch (error) {
            console.error('Error in listFunnels:', error);
            return this.listFromLocalStorage();
        }
    }

    /**
     * Remove um funil
     */
    async deleteFunnel(funnelId: string, userId?: string): Promise<boolean> {
        console.log(`🗑️ Removendo funil: ${funnelId}`);

        try {
            if (!supabase) {
                console.warn('⚠️ Supabase não disponível, removendo do localStorage');
                return this.deleteFromLocalStorage(funnelId);
            }

            let query = supabase
                .from('funnels')
                .delete()
                .eq('id', funnelId);

            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { error } = await query;

            if (error) {
                console.error('❌ Erro ao remover funil:', error);
                return false;
            }

            // Também remover do localStorage como limpeza
            this.deleteFromLocalStorage(funnelId);

            console.log(`✅ Funil removido: ${funnelId}`);
            return true;
        } catch (error) {
            console.error('Error in deleteFunnel:', error);
            return false;
        }
    }

    /**
     * Publica/despublica um funil
     */
    async publishFunnel(funnelId: string, isPublished: boolean, userId?: string): Promise<boolean> {
        console.log(`📢 ${isPublished ? 'Publicando' : 'Despublicando'} funil: ${funnelId}`);

        try {
            if (!supabase) {
                console.warn('⚠️ Supabase não disponível, não é possível publicar');
                return false;
            }

            let query = supabase
                .from('funnels')
                .update({
                    is_published: isPublished,
                    updated_at: new Date().toISOString()
                })
                .eq('id', funnelId);

            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { error } = await query;

            if (error) {
                console.error('❌ Erro ao publicar funil:', error);
                return false;
            }

            console.log(`✅ Funil ${isPublished ? 'publicado' : 'despublicado'}: ${funnelId}`);
            return true;
        } catch (error) {
            console.error('Error in publishFunnel:', error);
            return false;
        }
    }

    // ============================================================================
    // FALLBACK LOCAL STORAGE METHODS
    // ============================================================================

    private saveToLocalStorage(state: FunnelState, options: SaveFunnelOptions): FunnelPersistenceData {
        const data: FunnelPersistenceData = {
            id: state.id,
            name: state.metadata.name,
            description: state.metadata.description,
            category: state.metadata.category,
            user_id: options.userId,
            funnel_data: state,
            is_published: options.autoPublish || state.metadata.isPublished,
            created_at: state.metadata.createdAt,
            updated_at: new Date().toISOString()
        };

        localStorage.setItem(`funnel-${state.id}`, JSON.stringify(data));

        // Atualizar lista de funis
        const funnelsList = this.getLocalFunnelsList();
        const existingIndex = funnelsList.findIndex(f => f.id === state.id);

        const listItem: FunnelListItem = {
            id: data.id,
            name: data.name,
            description: data.description,
            category: data.category,
            is_published: data.is_published,
            created_at: data.created_at,
            updated_at: data.updated_at,
            step_count: state.steps.length
        };

        if (existingIndex >= 0) {
            funnelsList[existingIndex] = listItem;
        } else {
            funnelsList.push(listItem);
        }

        localStorage.setItem('funnels-list', JSON.stringify(funnelsList));

        console.log(`✅ Funil salvo localmente: ${state.id}`);
        return data;
    }

    private loadFromLocalStorage(funnelId: string): FunnelState | null {
        try {
            const data = localStorage.getItem(`funnel-${funnelId}`);
            if (!data) return null;

            const parsed = JSON.parse(data) as FunnelPersistenceData;
            return parsed.funnel_data as FunnelState;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    private listFromLocalStorage(): FunnelListItem[] {
        try {
            const data = localStorage.getItem('funnels-list');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error listing from localStorage:', error);
            return [];
        }
    }

    private deleteFromLocalStorage(funnelId: string): boolean {
        try {
            localStorage.removeItem(`funnel-${funnelId}`);

            // Remover da lista
            const funnelsList = this.getLocalFunnelsList();
            const filtered = funnelsList.filter(f => f.id !== funnelId);
            localStorage.setItem('funnels-list', JSON.stringify(filtered));

            console.log(`✅ Funil removido localmente: ${funnelId}`);
            return true;
        } catch (error) {
            console.error('Error deleting from localStorage:', error);
            return false;
        }
    }

    private getLocalFunnelsList(): FunnelListItem[] {
        try {
            const data = localStorage.getItem('funnels-list');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Verificar se um funil existe no Supabase
     */
    private async checkFunnelExists(funnelId: string): Promise<boolean> {
        try {
            const { data, error } = await supabase
                .from('funnels')
                .select('id')
                .eq('id', funnelId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = not found
                console.warn('❌ Erro ao verificar existência do funil:', error);
                return false;
            }

            return !!data;
        } catch (error) {
            console.warn('❌ Erro ao verificar existência do funil:', error);
            return false;
        }
    }

    /**
     * Converter dados do Supabase para FunnelPersistenceData
     */
    private convertToFunnelPersistenceData(
        supabaseData: any,
        funnelState: FunnelState
    ): FunnelPersistenceData {
        return {
            id: supabaseData.id,
            name: supabaseData.name,
            description: supabaseData.description || funnelState.metadata.description,
            category: funnelState.metadata.category || 'outros',
            funnel_data: funnelState,
            is_published: supabaseData.is_published || false,
            user_id: supabaseData.user_id,
            created_at: supabaseData.created_at,
            updated_at: supabaseData.updated_at
        };
    }

}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const persistenceService = PersistenceService.getInstance();
