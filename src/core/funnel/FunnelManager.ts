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
    FunnelStatus,
} from './types';
import { appLogger } from '@/lib/utils/appLogger';

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
        appLogger.info('[FunnelManager] Creating funnel:', { data: [options] });

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
                isOfficial: false,
            },
            settings: {
                ...baseState.settings,
                ...options.settings,
            },
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
                name: finalState.metadata.name,
            },
        });

        return finalState;
    }

    /**
     * Carrega um funil por ID
     */
    async loadFunnel(funnelId: string): Promise<FunnelState | null> {
        appLogger.info('[FunnelManager] Loading funnel:', { data: [funnelId] });

        try {
            const funnelState = await persistenceService.loadFunnel(funnelId);

            if (funnelState) {
                this.validateFunnelState(funnelState);
                appLogger.info('[FunnelManager] Funnel loaded successfully:', { data: [funnelId] });
            }

            return funnelState;
        } catch (error) {
            appLogger.error('[FunnelManager] Error loading funnel:', { data: [error] });
            return null;
        }
    }

    /**
     * Salva um funil
     */
    async saveFunnel(state: FunnelState, options?: { autoPublish?: boolean; userId?: string }): Promise<void> {
        appLogger.info('[FunnelManager] Saving funnel:', { data: [state.id] });
        this.validateFunnelState(state);

        // Atualizar timestamp
        state.metadata.updatedAt = new Date().toISOString();

        try {
            // Salvar usando PersistenceService
            await persistenceService.saveFunnel(state, options);

            appLogger.info('[FunnelManager] Funnel saved successfully:', { data: [state.id] });

            // Emitir evento de salvamento
            this.core.emitEvent({
                type: 'funnel_completed',
                timestamp: Date.now(),
                funnelId: state.id,
                data: {
                    funnelId: state.id,
                    stepCount: state.steps.length,
                    completedSteps: state.completedSteps.length,
                },
            });
        } catch (error) {
            appLogger.error('[FunnelManager] Error saving funnel:', { data: [error] });
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
        appLogger.info('[FunnelManager] Listing funnels with options:', { data: [options] });

        try {
            const loadOptions = {
                includeUnpublished: options?.includeUnpublished,
            };

            return await persistenceService.listFunnels(options?.userId, loadOptions);
        } catch (error) {
            appLogger.error('[FunnelManager] Error listing funnels:', { data: [error] });
            return [];
        }
    }

    /**
     * Remove um funil
     */
    async deleteFunnel(funnelId: string): Promise<boolean> {
        appLogger.info('[FunnelManager] Deleting funnel:', { data: [funnelId] });

        try {
            const success = await persistenceService.deleteFunnel(funnelId);

            if (success) {
                appLogger.info('[FunnelManager] Funnel deleted successfully:', { data: [funnelId] });

                // Emitir evento de remoção
                this.core.emitEvent({
                    type: 'funnel_abandoned',
                    timestamp: Date.now(),
                    funnelId,
                    data: { funnelId },
                });
            }

            return success;
        } catch (error) {
            appLogger.error('[FunnelManager] Error deleting funnel:', { data: [error] });
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
        appLogger.info('[FunnelManager] Getting templates, category:', { data: [category] });
        return await templateService.getTemplates(category);
    }

    /**
     * Obtém um template específico
     */
    async getTemplate(templateId: string): Promise<FunnelTemplate | null> {
        appLogger.info('[FunnelManager] Getting template:', { data: [templateId] });
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
            order: index,
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
                percentage: 0,
            },
            navigation: {
                canGoForward: true,
                canGoBackward: false,
                nextStep: steps[1]?.id,
                previousStep: undefined,
                history: [],
                direction: undefined,
            },
            validation: {
                isValid: true,
                errors: [],
                warnings: [],
                currentStepValid: true,
            },
            status: 'ready' as FunnelStatus,
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
                            required: false,
                        },
                    },
                },
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
                    layout: 'centered',
                },
                navigation: {
                    showProgress: true,
                    showStepNumbers: true,
                    allowBackward: true,
                    showNavigationButtons: true,
                    autoAdvanceDelay: 3000,
                },
                validation: {
                    strictMode: true,
                    requiredFields: [],
                    customValidators: {},
                },
            },
            userData: {},
            completedSteps: [],
            currentStep: 'intro',
            progress: {
                currentStepIndex: 0,
                totalSteps: 1,
                completedSteps: 0,
                percentage: 0,
            },
            navigation: {
                canGoForward: false,
                canGoBackward: false,
                nextStep: undefined,
                previousStep: undefined,
                history: [],
                direction: undefined,
            },
            validation: {
                isValid: true,
                errors: [],
                warnings: [],
                currentStepValid: true,
            },
            status: 'ready' as FunnelStatus,
        };
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const funnelManager = FunnelManager.getInstance();
