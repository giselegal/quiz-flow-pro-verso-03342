// @ts-nocheck
/**
 * 🚀 SISTEMA HÍBRIDO UNIFICADO - IMPROVED FUNNEL SYSTEM
 * 
 * Este é o sistema híbrido completo que integra:
 * - AdvancedFunnelStorage (storage avançado)
 * - Validation systems (idValidation, schemaValidation, errorHandling)
 * - FunnelUnifiedService (serviços unificados)
 * - Template management unificado
 * 
 * Baseado na documentação: RELATORIO_MELHORIAS_ADMIN_FUNIS.md
 */

import { getLogger } from '@/utils/logging';
import { advancedFunnelStorage } from './AdvancedFunnelStorage';
import { validateFunnelId } from '@/utils/idValidation';
import { errorManager, createStorageError } from '@/utils/errorHandling';
import { FunnelContext } from '@/core/contexts/FunnelContext';
// Migrado para adapter unificado
import { analyticsEngineAdapter as analyticsEngine } from '@/analytics/compat/analyticsEngineAdapter';

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================

export interface Permission {
    action: 'view' | 'edit' | 'duplicate' | 'delete' | 'share';
    resource: 'funnel' | 'template' | 'component';
    scope: 'own' | 'workspace' | 'organization';
}

export interface MultiTenantContext {
    organizationId: string;
    workspaceId: string;
    permissions: Permission[];
    role: 'owner' | 'admin' | 'editor' | 'viewer';
}

export interface HybridFunnelData {
    id: string;
    name: string;
    description?: string;
    category?: string;
    templateId?: string;
    context: FunnelContext;
    // 🚀 MULTI-TENANCY: Estrutura escalável
    userId: string;
    organizationId: string;
    workspaceId: string;
    permissions: Permission[];
    visibility: 'private' | 'workspace' | 'organization' | 'public';
    // Metadados de acesso
    accessLevel: 'read' | 'write' | 'admin';
    sharedWith: string[]; // userIds com acesso específico
    autoPublish?: boolean;
    status?: 'draft' | 'published';
    url?: string;
    version?: number;
    createdAt?: string;
    updatedAt?: string;
    checksum?: string;
}

export interface FunnelCreationResult {
    id: string;
    name: string;
    url: string;
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
    success: boolean;
    validationStatus: 'valid' | 'invalid';
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

// ============================================================================
// CLASSE PRINCIPAL DO SISTEMA HÍBRIDO
// ============================================================================

class ImprovedFunnelSystem {
    private readonly logger = getLogger();

    // ============================================================================
    // SISTEMA DE PERMISSÕES MULTI-TENANT
    // ============================================================================

    checkPermission(
        userPermissions: Permission[],
        requiredAction: Permission['action'],
        resourceType: Permission['resource'],
        scope: Permission['scope'] = 'own'
    ): boolean {
        return userPermissions.some(permission =>
            permission.action === requiredAction &&
            permission.resource === resourceType &&
            (permission.scope === scope || permission.scope === 'organization') // Admin org pode tudo
        );
    }

    canAccessFunnel(
        funnelData: HybridFunnelData,
        requestingUserId: string,
        requestingUserOrg: string,
        requestingUserWorkspace: string,
        requiredAction: Permission['action'] = 'view'
    ): boolean {
        // 1. Proprietário sempre pode acessar
        if (funnelData.userId === requestingUserId) {
            return true;
        }

        // 2. Verificar visibilidade
        switch (funnelData.visibility) {
            case 'private':
                return funnelData.sharedWith.includes(requestingUserId);

            case 'workspace':
                return funnelData.workspaceId === requestingUserWorkspace;

            case 'organization':
                return funnelData.organizationId === requestingUserOrg;

            case 'public':
                return true;

            default:
                return false;
        }
    }

    // ============================================================================
    // VALIDAÇÃO INTEGRADA
    // ============================================================================

    private async validateFunnelData(data: Partial<HybridFunnelData>): Promise<ValidationResult> {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // Validação de ID
        if (data.id) {
            const idValidation = validateFunnelId(data.id);
            if (!idValidation.isValid) {
                result.isValid = false;
                result.errors.push(`ID inválido: ${idValidation.error}`);
            }
        }

        // Validação de schema básico
        if (data.name && data.name.length < 3) {
            result.errors.push('Nome deve ter pelo menos 3 caracteres');
            result.isValid = false;
        }

        if (data.userId && !data.userId.trim()) {
            result.errors.push('UserID é obrigatório');
            result.isValid = false;
        }

        // 🚀 MULTI-TENANCY: Validações específicas
        if (data.organizationId && !data.organizationId.trim()) {
            result.errors.push('OrganizationID é obrigatório');
            result.isValid = false;
        }

        if (data.workspaceId && !data.workspaceId.trim()) {
            result.errors.push('WorkspaceID é obrigatório');
            result.isValid = false;
        }

        if (data.visibility && !['private', 'workspace', 'organization', 'public'].includes(data.visibility)) {
            result.errors.push('Visibility deve ser: private, workspace, organization ou public');
            result.isValid = false;
        }

        if (data.accessLevel && !['read', 'write', 'admin'].includes(data.accessLevel)) {
            result.errors.push('AccessLevel deve ser: read, write ou admin');
            result.isValid = false;
        }

        // Validações de negócio
        if (data.context && !Object.values(FunnelContext).includes(data.context)) {
            result.warnings.push('Contexto não reconhecido');
        }

        this.logger.debug('hybrid-validation', 'Validação completa', {
            isValid: result.isValid,
            errorsCount: result.errors.length,
            warningsCount: result.warnings.length
        });

        return result;
    }

    // ============================================================================
    // CRIAÇÃO DE FUNIS HÍBRIDA
    // ============================================================================

    async createFunnel(params: Omit<HybridFunnelData, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'url'> & {
        multiTenantContext?: MultiTenantContext;
    }): Promise<FunnelCreationResult> {
        this.logger.info('hybrid-creation', 'Iniciando criação de funil híbrida', {
            name: params.name,
            templateId: params.templateId,
            context: params.context,
            organizationId: params.organizationId,
            workspaceId: params.workspaceId
        });

        try {
            // 1. Gerar ID único e seguro
            const funnelId = this.generateSecureId(params.name);
            const now = new Date().toISOString();

            // 2. Definir permissões padrão se não especificadas
            const defaultPermissions: Permission[] = [
                { action: 'view', resource: 'funnel', scope: 'own' },
                { action: 'edit', resource: 'funnel', scope: 'own' },
                { action: 'duplicate', resource: 'funnel', scope: 'own' }
            ];

            // 3. Criar dados completos do funil
            const funnelData: HybridFunnelData = {
                id: funnelId,
                name: params.name,
                description: params.description || `Funil baseado no template ${params.templateId || 'personalizado'}`,
                category: params.category || 'general',
                templateId: params.templateId,
                context: params.context,
                // 🚀 MULTI-TENANCY: Campos obrigatórios
                userId: params.userId,
                organizationId: params.organizationId || `org_${params.userId}`, // Default org
                workspaceId: params.workspaceId || `ws_${params.userId}`, // Default workspace
                permissions: params.permissions || defaultPermissions,
                visibility: params.visibility || 'private',
                accessLevel: params.accessLevel || 'admin',
                sharedWith: params.sharedWith || [],
                status: params.autoPublish ? 'published' : 'draft',
                url: `/editor/${encodeURIComponent(funnelId)}`,
                version: 1,
                createdAt: now,
                updatedAt: now
            };

            // 3. Validação híbrida integrada
            const validation = await this.validateFunnelData(funnelData);
            if (!validation.isValid) {
                const validationError = createStorageError(
                    'STORAGE_NOT_AVAILABLE',
                    `Validação falhou: ${validation.errors.join(', ')}`,
                    { operation: 'createFunnel', funnelId }
                );
                errorManager.handleError(validationError);

                return {
                    id: funnelId,
                    name: params.name,
                    url: '',
                    status: 'draft',
                    createdAt: now,
                    updatedAt: now,
                    success: false,
                    validationStatus: 'invalid'
                };
            }

            // 4. Armazenamento através do AdvancedFunnelStorage
            const storedFunnel = await advancedFunnelStorage.upsertFunnel(funnelData);

            // 5. 📊 ANALYTICS TRACKING: Registrar criação de funil
            analyticsEngine.trackEvent({
                type: 'funnel_started',
                funnelId: storedFunnel.id,
                userId: params.userId,
                sessionId: this.generateSessionId(),
                properties: {
                    funnelName: storedFunnel.name,
                    templateId: params.templateId,
                    organizationId: params.organizationId,
                    workspaceId: params.workspaceId,
                    visibility: params.visibility || 'private',
                    autoPublish: params.autoPublish || false
                },
                metadata: this.getCurrentEventMetadata()
            });

            this.logger.info('hybrid-creation', 'Funil criado com sucesso no sistema híbrido', {
                funnelId: storedFunnel.id,
                status: storedFunnel.status,
                validationPassed: true,
                storageMethod: 'advanced',
                analyticsTracked: true
            });

            return {
                id: storedFunnel.id,
                name: storedFunnel.name,
                url: storedFunnel.url || `/editor/${encodeURIComponent(storedFunnel.id)}`,
                status: storedFunnel.status,
                createdAt: storedFunnel.createdAt,
                updatedAt: storedFunnel.updatedAt,
                success: true,
                validationStatus: 'valid'
            };

        } catch (error) {
            this.logger.error('hybrid-creation', 'Falha na criação híbrida', {
                error: error instanceof Error ? error.message : String(error),
                params
            });

            const systemError = createStorageError(
                'STORAGE_NOT_AVAILABLE',
                `Falha na criação do funil: ${error instanceof Error ? error.message : String(error)}`,
                { operation: 'createFunnel' }
            );
            errorManager.handleError(systemError);

            throw error;
        }
    }

    // ============================================================================
    // ARMAZENAMENTO E VALIDAÇÃO HÍBRIDA
    // ============================================================================

    async validateAndStore(funnelData: Partial<HybridFunnelData> & { id: string }): Promise<void> {
        this.logger.debug('hybrid-storage', 'Validando e armazenando funil', { funnelId: funnelData.id });

        try {
            // 1. Validação completa
            const validation = await this.validateFunnelData(funnelData);
            if (!validation.isValid) {
                throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
            }

            // 2. Preparar dados para armazenamento
            const now = new Date().toISOString();
            const storageData = {
                ...funnelData,
                updatedAt: now,
                createdAt: funnelData.createdAt || now,
                version: (funnelData.version || 0) + 1
            };

            // 3. Armazenar usando AdvancedFunnelStorage
            await advancedFunnelStorage.upsertFunnel(storageData);

            this.logger.info('hybrid-storage', 'Funil validado e armazenado com sucesso', {
                funnelId: funnelData.id,
                version: storageData.version
            });

        } catch (error) {
            this.logger.error('hybrid-storage', 'Erro no armazenamento híbrido', {
                funnelId: funnelData.id,
                error: error instanceof Error ? error.message : String(error)
            });

            const storageError = createStorageError(
                'STORAGE_NOT_AVAILABLE',
                `Erro no armazenamento: ${error instanceof Error ? error.message : String(error)}`,
                { operation: 'validateAndStore', funnelId: funnelData.id }
            );
            errorManager.handleError(storageError);

            throw error;
        }
    }

    // ============================================================================
    // LISTAGEM VALIDADA COM MULTI-TENANCY
    // ============================================================================

    async listValidatedFunnels(
        requestingUserId?: string,
        requestingUserOrg?: string,
        requestingUserWorkspace?: string,
        filters?: {
            organizationId?: string;
            workspaceId?: string;
            visibility?: HybridFunnelData['visibility'];
            category?: string;
        }
    ): Promise<any[]> {
        try {
            const allFunnels = await advancedFunnelStorage.listFunnels();

            this.logger.debug('hybrid-list', 'Funis listados com validação multi-tenant', {
                totalCount: allFunnels.length,
                requestingUserId,
                requestingUserOrg,
                filters
            });

            // Filtrar e validar funis
            const validatedFunnels = allFunnels.filter(funnel => {
                // 1. Validação básica de ID
                const validation = validateFunnelId(funnel.id);
                if (!validation.isValid) return false;

                // 2. 🚀 MULTI-TENANCY: Filtros de acesso
                if (requestingUserId) {
                    const hasAccess = this.canAccessFunnel(
                        funnel as HybridFunnelData,
                        requestingUserId,
                        requestingUserOrg || '',
                        requestingUserWorkspace || ''
                    );
                    if (!hasAccess) return false;
                }

                // 3. Aplicar filtros opcionais
                if (filters) {
                    if (filters.organizationId && funnel.organizationId !== filters.organizationId) return false;
                    if (filters.workspaceId && funnel.workspaceId !== filters.workspaceId) return false;
                    if (filters.visibility && funnel.visibility !== filters.visibility) return false;
                    if (filters.category && funnel.category !== filters.category) return false;
                }

                return true;
            });

            this.logger.debug('hybrid-list', 'Funis filtrados por multi-tenancy', {
                filteredCount: validatedFunnels.length,
                originalCount: allFunnels.length
            });

            return validatedFunnels;

        } catch (error) {
            this.logger.error('hybrid-list', 'Erro na listagem validada', {
                error: error instanceof Error ? error.message : String(error)
            });

            const listError = createStorageError(
                'STORAGE_NOT_AVAILABLE',
                `Erro na listagem: ${error instanceof Error ? error.message : String(error)}`,
                { operation: 'listValidatedFunnels' }
            );
            errorManager.handleError(listError);

            return [];
        }
    }

    // ============================================================================
    // UTILIDADES HÍBRIDAS
    // ============================================================================

    private generateSecureId(baseName: string): string {
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substr(2, 8);
        const safeBaseName = baseName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substr(0, 20);

        return `${safeBaseName}-${timestamp}-${randomSuffix}`;
    }

    async getSystemStatus(): Promise<{
        storageReady: boolean;
        validationReady: boolean;
        errorHandlingReady: boolean;
        totalFunnels: number;
    }> {
        try {
            const storageInfo = await advancedFunnelStorage.getStorageInfo();

            return {
                storageReady: true,
                validationReady: typeof validateFunnelId === 'function',
                errorHandlingReady: typeof errorManager.handleError === 'function',
                totalFunnels: storageInfo.totalFunnels
            };
        } catch (error) {
            return {
                storageReady: false,
                validationReady: false,
                errorHandlingReady: false,
                totalFunnels: 0
            };
        }
    }

    // ============================================================================
    // MÉTODOS AUXILIARES PARA ANALYTICS
    // ============================================================================

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private getCurrentEventMetadata(): any {
        // Em um ambiente real, isso coletaria dados do browser/request
        return {
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
            device: {
                type: 'desktop', // Simplificado para server-side
                os: 'Unknown',
                browser: 'Unknown',
                screenResolution: '1920x1080',
                viewportSize: '1920x1080'
            },
            location: {
                country: 'BR',
                region: 'SP',
                city: 'São Paulo',
                timezone: 'America/Sao_Paulo'
            },
            referrer: 'direct',
            utm: {}
        };
    }
}

// ============================================================================
// EXPORTAR INSTÂNCIA SINGLETON
// ============================================================================

export const improvedFunnelSystem = new ImprovedFunnelSystem();

// Para compatibilidade, também exportar como default
export default improvedFunnelSystem;