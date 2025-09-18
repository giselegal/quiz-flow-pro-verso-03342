/**
 * 🎯 FUNNEL MANAGER
 * 
 * Gerenciador central para todas as operações de funil
 * Single source of truth para o sistema de funis
 */

import { FunnelCore, funnelCore } from './FunnelCore';
import { templateService } from './services/TemplateService';
import { persistenceService } from './services/PersistenceService';
import {
    FunnelState,
    FunnelTemplate,
    FunnelSettings,
    FunnelStatus
} from './types';

// ============================================================================
// INTERFACES ESPECÍFICAS DO MANAGER
// ============================================================================

export interface CreateFunnelOptions {
    id?: string;
    name: string;
    description?: string;
    category: string;
    templateId?: string;
    settings?: Partial<FunnelSettings>;
    tags?: string[];
}

export interface CloneFunnelOptions {
    newId?: string;
    newName?: string;
    newDescription?: string;
    clearUserData?: boolean;
}

export interface FunnelSearchFilters {
    category?: string;
    tags?: string[];
    status?: string;
    createdBy?: string;
    dateRange?: {
        start: string;
        end: string;
    };
}

export interface FunnelListOptions {
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'category';
    sortOrder?: 'asc' | 'desc';
    filters?: FunnelSearchFilters;
}

// ============================================================================
// FUNNEL MANAGER CLASS
// ============================================================================

export class FunnelManager {
    private static instance: FunnelManager;
    private core: FunnelCore;

    private constructor() {
        this.core = funnelCore;
    }

    public static getInstance(): FunnelManager {
        if (!FunnelManager.instance) {
            FunnelManager.instance = new FunnelManager();
        }
        return FunnelManager.instance;
    }

    // ============================================================================
    // FUNNEL LIFECYCLE MANAGEMENT
    // ============================================================================

    /**
     * Cria um novo funil a partir de um template ou do zero
     */
    async createFunnel(options: CreateFunnelOptions): Promise<FunnelState> {
        console.log('[FunnelManager] Creating funnel:', options);

        // Validar opções de entrada
        this.validateCreateOptions(options);

        let baseState: Partial<FunnelState>;

        if (options.templateId) {
            // Criar a partir de template
            baseState = await this.createFromTemplate(options.templateId);
        } else {
            // Criar do zero
            baseState = this.createBlankFunnel();
        }

        // Aplicar configurações personalizadas
        const finalState: FunnelState = {
            ...baseState,
            id: options.id || this.core.generateFunnelId(),
            metadata: {
                ...baseState.metadata,
                id: options.id || this.core.generateFunnelId(),
                name: options.name,
                description: options.description || '',
                category: options.category,
                theme: 'modern',
                version: '1.0.0',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isPublished: false,
                isOfficial: false
            },
            settings: {
                ...baseState.settings,
                ...options.settings
            }
        } as FunnelState;

        // Validar estado criado
        this.validateFunnelState(finalState);

        // Emitir evento de criação
        this.core.emitEvent({
            type: 'funnel_started',
            timestamp: Date.now(),
            funnelId: finalState.id,
            data: {
                templateId: options.templateId,
                name: finalState.metadata.name
            }
        });

        return finalState;
    }

    /**
     * Carrega um funil por ID
     */
    async loadFunnel(funnelId: string): Promise<FunnelState | null> {
        console.log('[FunnelManager] Loading funnel:', funnelId);

        try {
            const funnelState = await persistenceService.loadFunnel(funnelId);

            if (funnelState) {
                this.validateFunnelState(funnelState);
                console.log('[FunnelManager] Funnel loaded successfully:', funnelId);
            }

            return funnelState;
        } catch (error) {
            console.error('[FunnelManager] Error loading funnel:', error);
            return null;
        }
    }

    /**
     * Salva um funil
     */
    async saveFunnel(state: FunnelState, options?: { autoPublish?: boolean; userId?: string }): Promise<void> {
        console.log('[FunnelManager] Saving funnel:', state.id);
        this.validateFunnelState(state);

        // Atualizar timestamp
        state.metadata.updatedAt = new Date().toISOString();

        try {
            // Salvar usando PersistenceService
            await persistenceService.saveFunnel(state, options);

            console.log('[FunnelManager] Funnel saved successfully:', state.id);

            // Emitir evento de salvamento
            this.core.emitEvent({
                type: 'funnel_completed',
                timestamp: Date.now(),
                funnelId: state.id,
                data: {
                    funnelId: state.id,
                    stepCount: state.steps.length,
                    completedSteps: state.completedSteps.length
                }
            });
        } catch (error) {
            console.error('[FunnelManager] Error saving funnel:', error);
            throw error;
        }
    }

    /**
     * Lista funis do usuário
     */
    async listFunnels(options?: {
        category?: string;
        includeUnpublished?: boolean;
        userId?: string;
        limit?: number;
        offset?: number;
    }): Promise<any[]> {
        console.log('[FunnelManager] Listing funnels with options:', options);

        try {
            const loadOptions = {
                includeUnpublished: options?.includeUnpublished,
            };

            return await persistenceService.listFunnels(options?.userId, loadOptions);
        } catch (error) {
            console.error('[FunnelManager] Error listing funnels:', error);
            return [];
        }
    }

    /**
     * Remove um funil
     */
    async deleteFunnel(funnelId: string): Promise<boolean> {
        console.log('[FunnelManager] Deleting funnel:', funnelId);

        try {
            const success = await persistenceService.deleteFunnel(funnelId);

            if (success) {
                console.log('[FunnelManager] Funnel deleted successfully:', funnelId);

                // Emitir evento de remoção
                this.core.emitEvent({
                    type: 'funnel_abandoned',
                    timestamp: Date.now(),
                    funnelId: funnelId,
                    data: { funnelId }
                });
            }

            return success;
        } catch (error) {
            console.error('[FunnelManager] Error deleting funnel:', error);
            return false;
        }
    }

    // ============================================================================
    // TEMPLATE MANAGEMENT
    // ============================================================================

    /**
     * Lista templates disponíveis
     */
    async getTemplates(category?: string): Promise<FunnelTemplate[]> {
        console.log('[FunnelManager] Getting templates, category:', category);
        return await templateService.getTemplates(category);
    }

    /**
     * Obtém um template específico
     */
    async getTemplate(templateId: string): Promise<FunnelTemplate | null> {
        console.log('[FunnelManager] Getting template:', templateId);
        return await templateService.getTemplate(templateId);
    }

    // ============================================================================
    // VALIDATION HELPERS
    // ============================================================================

    private validateCreateOptions(options: CreateFunnelOptions): void {
        if (!options.name?.trim()) {
            throw new Error('Nome do funil é obrigatório');
        }
        if (!options.category?.trim()) {
            throw new Error('Categoria do funil é obrigatória');
        }
        if (options.id && !this.core.isValidFunnelId(options.id)) {
            throw new Error('ID do funil inválido');
        }
    }

    private validateFunnelState(state: FunnelState): void {
        if (!state.id || !this.core.isValidFunnelId(state.id)) {
            throw new Error('Estado do funil inválido: ID ausente ou inválido');
        }
        if (!state.metadata?.name?.trim()) {
            throw new Error('Estado do funil inválido: Nome ausente');
        }
        if (!state.steps || state.steps.length === 0) {
            throw new Error('Estado do funil inválido: Deve ter pelo menos uma etapa');
        }
    }

    // ============================================================================
    // TEMPLATE CREATION HELPERS
    // ============================================================================

    private async createFromTemplate(templateId: string): Promise<Partial<FunnelState>> {
        const template = await this.getTemplate(templateId);
        if (!template) {
            throw new Error(`Template não encontrado: ${templateId}`);
        }

        // Converter steps do template para steps completos com IDs
        const steps = template.templateData.steps.map((stepTemplate: any, index: number) => ({
            ...stepTemplate,
            id: stepTemplate.id || `step-${index + 1}`,
            order: index
        }));

        return {
            steps,
            settings: { ...template.templateData.settings },
            userData: {},
            completedSteps: [],
            currentStep: steps[0]?.id || '',
            progress: {
                currentStepIndex: 0,
                totalSteps: steps.length,
                completedSteps: 0,
                percentage: 0
            },
            navigation: {
                canGoForward: true,
                canGoBackward: false,
                nextStep: steps[1]?.id,
                previousStep: undefined,
                history: [],
                direction: undefined
            },
            validation: {
                isValid: true,
                errors: [],
                warnings: [],
                currentStepValid: true
            },
            status: 'ready' as FunnelStatus
        };
    }

    private createBlankFunnel(): Partial<FunnelState> {
        return {
            steps: [
                {
                    id: 'intro',
                    name: 'Introdução',
                    description: 'Etapa inicial do funil',
                    order: 0,
                    type: 'intro',
                    isRequired: true,
                    isVisible: true,
                    components: [],
                    settings: {
                        autoAdvance: false,
                        autoAdvanceDelay: 0,
                        showProgress: true,
                        allowSkip: false,
                        validation: {
                            required: false
                        }
                    }
                }
            ],
            settings: {
                autoSave: true,
                autoAdvance: false,
                progressTracking: true,
                analytics: true,
                theme: {
                    primaryColor: '#007bff',
                    secondaryColor: '#6c757d',
                    fontFamily: 'Inter',
                    borderRadius: '8px',
                    spacing: '16px',
                    layout: 'centered'
                },
                navigation: {
                    showProgress: true,
                    showStepNumbers: true,
                    allowBackward: true,
                    showNavigationButtons: true,
                    autoAdvanceDelay: 3000
                },
                validation: {
                    strictMode: true,
                    requiredFields: [],
                    customValidators: {}
                }
            },
            userData: {},
            completedSteps: [],
            currentStep: 'intro',
            progress: {
                currentStepIndex: 0,
                totalSteps: 1,
                completedSteps: 0,
                percentage: 0
            },
            navigation: {
                canGoForward: false,
                canGoBackward: false,
                nextStep: undefined,
                previousStep: undefined,
                history: [],
                direction: undefined
            },
            validation: {
                isValid: true,
                errors: [],
                warnings: [],
                currentStepValid: true
            },
            status: 'ready' as FunnelStatus
        };
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const funnelManager = FunnelManager.getInstance();
