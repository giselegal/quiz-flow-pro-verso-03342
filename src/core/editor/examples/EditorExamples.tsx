// @ts-nocheck
/**
 * 🧪 EXEMPLOS E TESTES DO EDITOR DESACOPLADO
 * 
 * Demonstra como usar o editor com diferentes implementações:
 * - Mock para testes
 * - Supabase para produção
 * - LocalStorage para desenvolvimento
 */

import React from 'react';
import { FunnelEditor } from '../components/FunnelEditor';
import { EditorMockProvider } from '../mocks/EditorMocks';
import {
    EditorFunnelData,
    EditorDataProvider,
    EditorConfig,
    EditorMode
} from '../interfaces/EditorInterfaces';

// ============================================================================
// EXEMPLO 1: EDITOR COM DADOS MOCKADOS (PARA TESTES)
// ============================================================================

export const MockedEditorExample: React.FC = () => {
    const { dataProvider, validator, eventHandler } = EditorMockProvider.createFullMockSetup();

    const config: Partial<EditorConfig> = {
        mode: 'edit',
        features: {
            canAddPages: true,
            canRemovePages: true,
            canReorderPages: true,
            canEditBlocks: true,
            canPreview: true,
            canPublish: true,
            canDuplicate: true,
            canExport: true
        },
        autoSave: {
            enabled: true,
            interval: 10000, // 10 segundos para demo
            onUserInput: true,
            showIndicator: true
        },
        validation: {
            realTime: true,
            onSave: true,
            showWarnings: true,
            strictMode: false
        },
        ui: {
            theme: 'light',
            layout: 'sidebar',
            showMinimap: false,
            showGridlines: true,
            showRulers: false
        }
    };

    const handleSave = (data: EditorFunnelData) => {
        console.log('🎉 Funnel saved:', data);
    };

    const handleChange = (data: EditorFunnelData) => {
        console.log('📝 Funnel changed:', data.name);
    };

    const handleError = (error: string) => {
        console.error('❌ Editor error:', error);
    };

    const handleModeChange = (mode: EditorMode) => {
        console.log('🔄 Mode changed to:', mode);
    };

    return (
        <div className="h-screen">
            <FunnelEditor
                funnelId="mock-funnel-1"
                dataProvider={dataProvider}
                validator={validator}
                eventHandler={eventHandler}
                config={config}
                onSave={handleSave}
                onChange={handleChange}
                onError={handleError}
                onModeChange={handleModeChange}
            />
        </div>
    );
};

// ============================================================================
// EXEMPLO 2: EDITOR COM DADOS INICIAIS (SEM ID)
// ============================================================================

export const InitialDataEditorExample: React.FC = () => {
    const { dataProvider, utils } = EditorMockProvider.createMinimalMockSetup();

    // Criar funil inicial
    const initialFunnel = utils.createEmptyFunnel('My Custom Funnel');

    // Adicionar algumas páginas
    initialFunnel.pages = [
        utils.createEmptyPage('intro'),
        utils.createEmptyPage('question'),
        utils.createEmptyPage('result')
    ];

    return (
        <div className="h-screen">
            <FunnelEditor
                initialData={initialFunnel}
                dataProvider={dataProvider}
                config={{
                    mode: 'edit',
                    autoSave: { enabled: false, interval: 0, onUserInput: false, showIndicator: false }
                }}
                onSave={(data) => console.log('Custom funnel saved:', data)}
            />
        </div>
    );
};

// ============================================================================
// EXEMPLO 3: EDITOR EM MODO READONLY (PREVIEW)
// ============================================================================

export const ReadonlyEditorExample: React.FC = () => {
    const { dataProvider } = EditorMockProvider.createMinimalMockSetup();

    return (
        <div className="h-screen">
            <FunnelEditor
                funnelId="mock-funnel-1"
                dataProvider={dataProvider}
                config={{
                    mode: 'readonly',
                    features: {
                        canAddPages: false,
                        canRemovePages: false,
                        canReorderPages: false,
                        canEditBlocks: false,
                        canPreview: true,
                        canPublish: false,
                        canDuplicate: false,
                        canExport: true
                    }
                }}
            />
        </div>
    );
};

// ============================================================================
// IMPLEMENTAÇÃO PARA SUPABASE (EXEMPLO)
// ============================================================================

export class SupabaseFunnelDataProvider implements EditorDataProvider {
    constructor(private supabaseClient: any) { }

    async loadFunnel(id: string): Promise<EditorFunnelData | null> {
        try {
            const { data, error } = await this.supabaseClient
                .from('funnels')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!data) return null;

            // Transformar dados do Supabase para EditorFunnelData
            return {
                id: data.id,
                name: data.name,
                description: data.description,
                pages: data.pages || [],
                settings: {
                    theme: data.theme || this.getDefaultTheme(),
                    navigation: data.navigation || this.getDefaultNavigation(),
                    autoSave: data.auto_save ?? true,
                    previewMode: false
                },
                metadata: {
                    createdAt: new Date(data.created_at),
                    updatedAt: new Date(data.updated_at),
                    version: data.version || 1,
                    isPublished: data.is_published || false,
                    lastSavedBy: data.updated_by,
                    tags: data.tags || [],
                    category: data.category || 'general'
                }
            };
        } catch (error) {
            console.error('Error loading funnel from Supabase:', error);
            return null;
        }
    }

    async saveFunnel(data: EditorFunnelData) {
        try {
            const { error } = await this.supabaseClient
                .from('funnels')
                .upsert({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    pages: data.pages,
                    theme: data.settings.theme,
                    navigation: data.settings.navigation,
                    auto_save: data.settings.autoSave,
                    is_published: data.metadata.isPublished,
                    version: data.metadata.version + 1,
                    tags: data.metadata.tags,
                    category: data.metadata.category,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            return {
                success: true,
                timestamp: new Date(),
                version: data.metadata.version + 1
            };
        } catch (error) {
            throw new Error(`Failed to save funnel: ${error}`);
        }
    }

    async listFunnels(options = {}) {
        try {
            let query = this.supabaseClient.from('funnels').select('id, name, description, is_published, created_at, updated_at, category, tags');

            if (options.category) {
                query = query.eq('category', options.category);
            }

            if (options.limit) {
                query = query.limit(options.limit);
            }

            if (options.offset) {
                query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
            }

            const { data, error } = await query;
            if (error) throw error;

            return data.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                isPublished: item.is_published,
                createdAt: new Date(item.created_at),
                updatedAt: new Date(item.updated_at),
                pageCount: item.pages?.length || 0,
                category: item.category,
                tags: item.tags
            }));
        } catch (error) {
            console.error('Error listing funnels:', error);
            return [];
        }
    }

    async createFunnel(data: Partial<EditorFunnelData>) {
        const newFunnel = {
            id: crypto.randomUUID(),
            name: data.name || 'New Funnel',
            description: data.description || '',
            pages: data.pages || [],
            settings: data.settings || {
                theme: this.getDefaultTheme(),
                navigation: this.getDefaultNavigation(),
                autoSave: true,
                previewMode: false
            },
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 1,
                isPublished: false,
                tags: data.metadata?.tags || [],
                category: data.metadata?.category || 'general'
            }
        };

        await this.saveFunnel(newFunnel);
        return newFunnel;
    }

    async deleteFunnel(id: string) {
        try {
            const { error } = await this.supabaseClient
                .from('funnels')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting funnel:', error);
            return false;
        }
    }

    async duplicateFunnel(id: string, newName: string) {
        const original = await this.loadFunnel(id);
        if (!original) {
            throw new Error(`Funnel ${id} not found`);
        }

        return this.createFunnel({
            ...original,
            name: newName,
            metadata: {
                ...original.metadata,
                isPublished: false
            }
        });
    }

    private getDefaultTheme() {
        return {
            primaryColor: '#007bff',
            secondaryColor: '#6c757d',
            backgroundColor: '#ffffff',
            textColor: '#212529',
            fontFamily: 'Inter, sans-serif',
            borderRadius: '8px',
            spacing: 'normal' as const
        };
    }

    private getDefaultNavigation() {
        return {
            showProgress: true,
            showStepNumbers: true,
            allowBackward: true,
            autoAdvance: false
        };
    }
}

// ============================================================================
// HOOK PARA USAR O EDITOR
// ============================================================================
// NOTE: Example useEditor function renamed to avoid conflicts with EditorProvider.useEditor
// ============================================================================

export interface UseEditorExampleOptions {
    funnelId?: string;
    initialData?: EditorFunnelData;
    provider: 'mock' | 'supabase' | 'localStorage';
    supabaseClient?: any;
    config?: Partial<EditorConfig>;
}

export function useEditorExample(options: UseEditorExampleOptions) {
    const [isReady, setIsReady] = React.useState(false);
    const [dataProvider, setDataProvider] = React.useState<EditorDataProvider | null>(null);
    const [validator, setValidator] = React.useState<any>(null);
    const [eventHandler, setEventHandler] = React.useState<any>(null);

    React.useEffect(() => {
        let provider: EditorDataProvider;
        let val: any;
        let events: any;

        switch (options.provider) {
            case 'mock':
                const mockSetup = EditorMockProvider.createFullMockSetup();
                provider = mockSetup.dataProvider;
                val = mockSetup.validator;
                events = mockSetup.eventHandler;
                break;

            case 'supabase':
                if (!options.supabaseClient) {
                    throw new Error('Supabase client required for supabase provider');
                }
                provider = new SupabaseFunnelDataProvider(options.supabaseClient);
                // TODO: Implementar validator e eventHandler para Supabase
                break;

            case 'localStorage':
                // TODO: Implementar LocalStorageFunnelDataProvider
                throw new Error('LocalStorage provider not implemented yet');

            default:
                throw new Error(`Unknown provider: ${options.provider}`);
        }

        setDataProvider(provider);
        setValidator(val);
        setEventHandler(events);
        setIsReady(true);
    }, [options.provider, options.supabaseClient]);

    const defaultConfig: Partial<EditorConfig> = {
        mode: 'edit',
        features: {
            canAddPages: true,
            canRemovePages: true,
            canReorderPages: true,
            canEditBlocks: true,
            canPreview: true,
            canPublish: true,
            canDuplicate: true,
            canExport: true
        },
        autoSave: {
            enabled: true,
            interval: 30000,
            onUserInput: false,
            showIndicator: true
        },
        validation: {
            realTime: true,
            onSave: true,
            showWarnings: true,
            strictMode: false
        }
    };

    return {
        isReady,
        dataProvider,
        validator,
        eventHandler,
        config: { ...defaultConfig, ...options.config }
    };
}

// ============================================================================
// COMPONENTE DE EXEMPLO COMPLETO
// ============================================================================

export const EditorExampleApp: React.FC = () => {
    const [activeExample, setActiveExample] = React.useState<'mock' | 'initial' | 'readonly'>('mock');

    return (
        <div className="h-screen flex flex-col">
            {/* Header com seletor de exemplo */}
            <div className="bg-gray-800 text-white p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">🎨 Editor de Funil Desacoplado</h1>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveExample('mock')}
                            className={`px-3 py-1 rounded text-sm ${activeExample === 'mock' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                        >
                            Mock Data
                        </button>
                        <button
                            onClick={() => setActiveExample('initial')}
                            className={`px-3 py-1 rounded text-sm ${activeExample === 'initial' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                        >
                            Initial Data
                        </button>
                        <button
                            onClick={() => setActiveExample('readonly')}
                            className={`px-3 py-1 rounded text-sm ${activeExample === 'readonly' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                        >
                            Readonly
                        </button>
                    </div>
                </div>
            </div>

            {/* Exemplo ativo */}
            <div className="flex-1">
                {activeExample === 'mock' && <MockedEditorExample />}
                {activeExample === 'initial' && <InitialDataEditorExample />}
                {activeExample === 'readonly' && <ReadonlyEditorExample />}
            </div>
        </div>
    );
};
